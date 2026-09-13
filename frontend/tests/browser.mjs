// Runs against a local dev/preview server in a disposable Chrome browser context.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:4173';
const cdp = process.env.TEST_CDP_URL || 'http://127.0.0.1:9222';
const output = process.env.TEST_OUTPUT_DIR || '/tmp/alpha-verification';
for (const address of [base, cdp]) {
  assert.ok(['127.0.0.1', 'localhost'].includes(new URL(address).hostname), 'Use only an isolated local test server.');
}
await mkdir(output, { recursive: true });

async function connect(url) {
  const socket = new WebSocket(url);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  let id = 0;
  const pending = new Map();
  const errors = [];
  socket.addEventListener('message', ({ data }) => {
    const event = JSON.parse(data);
    if (event.id) {
      const task = pending.get(event.id);
      pending.delete(event.id);
      clearTimeout(task.timer);
      if (event.error) task.reject(new Error(JSON.stringify(event.error)));
      else task.resolve(event.result);
    }
    if (event.method === 'Runtime.exceptionThrown')
      errors.push(event.params.exceptionDetails.exception?.description || event.params.exceptionDetails.text);
  });
  return {
    errors,
    close: () => socket.close(),
    send: (method, params = {}) =>
      new Promise((resolve, reject) => {
        const key = ++id;
        const timer = setTimeout(() => {
          pending.delete(key);
          reject(new Error(`Timeout: ${method}`));
        }, 15000);
        pending.set(key, { resolve, reject, timer });
        socket.send(JSON.stringify({ id: key, method, params }));
      }),
  };
}

const version = await (await fetch(`${cdp}/json/version`)).json();
const browser = await connect(version.webSocketDebuggerUrl);
const { browserContextId } = await browser.send('Target.createBrowserContext');
let page;
const checks = [];
try {
  const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank', browserContextId });
  const targets = await (await fetch(`${cdp}/json/list`)).json();
  page = await connect(targets.find((target) => target.id === targetId).webSocketDebuggerUrl);
  const send = page.send;
  await send('Runtime.enable');
  await send('Page.enable');
  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  const wait = async (expression) => {
    const end = Date.now() + 6000;
    while (Date.now() < end) {
      if (await evaluate(expression)) return;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    throw new Error(`Condition failed: ${expression}`);
  };
  const navigate = async (path) => {
    await send('Page.navigate', { url: base + path });
    await wait(
      `location.pathname === ${JSON.stringify(path.split('?')[0])} && document.readyState === 'complete' && document.querySelector('main')?.innerText.trim().length > 0 && !document.querySelector('.loading')`,
    );
  };
  const viewport = (width, height = 900) =>
    send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  const click = async (selector) => {
    const position = await evaluate(
      `(() => { const e=document.querySelector(${JSON.stringify(selector)}); if(!e) throw new Error('Missing element'); e.scrollIntoView({block:'center'}); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })()`,
    );
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...position });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...position });
  };
  const fill = async (selector, value) =>
    evaluate(
      `(() => { const e=document.querySelector(${JSON.stringify(selector)}); e.focus(); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,${JSON.stringify(value)}); e.dispatchEvent(new Event('input',{bubbles:true})); e.dispatchEvent(new Event('change',{bubbles:true})); })()`,
    );
  const select = async (selector, value) =>
    evaluate(
      `(() => { const e=document.querySelector(${JSON.stringify(selector)}); e.value=${JSON.stringify(value)}; e.dispatchEvent(new Event('change',{bubbles:true})); })()`,
    );
  const key = async (name, code, modifiers = 0) => {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: name, code: name, windowsVirtualKeyCode: code, modifiers });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: name, code: name, windowsVirtualKeyCode: code, modifiers });
  };
  const screenshot = async (name) => {
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    await writeFile(`${output}/${name}.png`, Buffer.from(data, 'base64'));
  };
  const check = (name) => {
    checks.push(name);
    console.log(`PASS ${name}`);
  };
  const money = (value) => value.replace(/\s/g, ' ');
  const sampleProducts = [
    {
      id: 'notebook',
      name: 'Caderno de anotações',
      price: 20,
      promotionalPrice: 15,
      stock: 3,
      categoryId: 'paper',
      categoryName: 'Papelaria',
      active: true,
      description: 'Caderno para organizar suas ideias.',
      image: '',
    },
    {
      id: 'cup',
      name: 'Caneca Café',
      price: 25,
      stock: 2,
      categoryId: 'accessories',
      categoryName: 'Acessórios',
      active: true,
      description: 'Caneca para o dia a dia.',
      image: '/imagem-de-teste-ausente.png',
    },
    {
      id: 'zero',
      name: 'Marcador de página',
      price: 5,
      promotionalPrice: 0,
      stock: 1,
      categoryId: 'paper',
      categoryName: 'Papelaria',
      active: true,
      description: 'Marcador.',
      image: '',
    },
    {
      id: 'empty',
      name: 'Estojo esgotado',
      price: 40,
      stock: 0,
      categoryId: 'paper',
      categoryName: 'Papelaria',
      active: true,
      description: 'Estojo.',
      image: '',
    },
    {
      id: 'hidden',
      name: 'Produto inativo',
      price: 10,
      stock: 10,
      active: false,
      categoryId: 'paper',
      categoryName: 'Papelaria',
      image: '',
    },
    {
      id: 'long',
      name: 'Organizador ' + 'muitolongo'.repeat(15),
      price: 12345.67,
      stock: 10,
      active: true,
      categoryId: 'accessories',
      categoryName: 'Acessórios',
      description: 'Descrição longa '.repeat(50),
      image: '',
    },
  ];
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `if (!sessionStorage.getItem('alpha-test-seeded')) { localStorage.setItem('alpha-catalog-products', ${JSON.stringify(JSON.stringify(sampleProducts))}); localStorage.setItem('alpha-catalog-categories', JSON.stringify([{id:'paper', name:'Papelaria', active:true},{id:'accessories',name:'Acessórios',active:true}])); localStorage.setItem('alpha-orders', '[]'); sessionStorage.setItem('alpha-test-seeded','yes'); }`,
  });

  await viewport(375, 812);
  await navigate('/produtos');
  assert.equal(await evaluate("document.querySelectorAll('.product-card').length"), 5);
  assert.equal(
    await evaluate(
      "Math.round(document.querySelector('.cart-link').getBoundingClientRect().top) === Math.round(document.querySelector('.brand').getBoundingClientRect().top)",
    ),
    true,
  );
  await fill('.header-search input', 'cafe');
  await click('.header-search button');
  await wait("document.querySelectorAll('.product-card').length === 1");
  assert.ok((await evaluate("document.querySelector('.product-card').innerText")).includes('25,00'));
  check('Busca sem acentos e preço sem promoção');
  await click('.active-filters a');
  await wait("document.querySelectorAll('.product-card').length === 5");
  await select('.catalog-sort select', 'menor-preco');
  await wait("document.querySelector('.product-card h3').innerText === 'Marcador de página'");
  assert.ok((await evaluate("document.querySelector('.product-card .prices').innerText")).includes('0,00'));
  await click('.filter-toggle');
  await wait("!!document.querySelector('dialog[open]')");
  await select('dialog select', 'paper');
  await wait(
    "new URLSearchParams(location.search).get('categoria') === 'paper' && document.querySelectorAll('.product-card').length === 3",
  );
  await click('dialog input[type=checkbox]');
  await wait("document.querySelectorAll('.product-card').length === 2");
  await click('dialog .drawer-footer button');
  await wait("document.querySelectorAll('.product-card').length === 2");
  check('Filtros combinados, ordenação e promoção de valor zero');

  await navigate('/produto/notebook');
  await click('.quantity-stepper button:last-child');
  await click('.detail-actions .secondary');
  await wait("document.querySelector('.cart-count')?.innerText === '2'");
  await click('.cart-link');
  await wait("!!document.querySelector('dialog[open]')");
  assert.ok(money(await evaluate("document.querySelector('dialog .order-totals__total').innerText")).includes('R$ 30,00'));
  await click('dialog .quantity-stepper button:last-child');
  await wait("document.querySelector('dialog .quantity-stepper > span').innerText === '3'");
  assert.equal(await evaluate("document.querySelector('dialog .quantity-stepper button:last-child').disabled"), true);
  await click('dialog .quantity-stepper button:first-child');
  await key('Escape', 27);
  await wait("!document.querySelector('dialog[open]')");
  assert.equal(await evaluate('document.activeElement.className'), 'cart-link');
  await click('.cart-link');
  await click('dialog a[href="/carrinho"]');
  await wait("location.pathname === '/carrinho' && !!document.querySelector('.cart-layout')");
  await click('.quantity-stepper button:first-child');
  await wait("document.querySelector('.quantity-stepper > span').innerText === '1'");
  assert.ok(money(await evaluate("document.querySelector('.order-totals__total').innerText")).includes('R$ 15,00'));
  check('Quantidade compartilhada, limite de estoque, totais e foco do carrinho');

  await click('.summary a[href="/checkout"]');
  await wait("location.pathname === '/checkout' && !!document.querySelector('.checkout-form')");
  await click('button[type=submit]');
  await wait("document.querySelectorAll('.field-error').length === 4");
  assert.equal(await evaluate('document.activeElement.id'), 'customer-name');
  await fill('#customer-name', 'Cliente de Teste');
  await fill('#customer-phone', '(00) 00000-0000');
  await click('input[name=store][value="Loja Centro"]');
  await click('input[name=payment][value="PIX"]');
  await wait("document.querySelectorAll('.field-error').length === 0");
  await viewport(320, 812);
  await screenshot('checkout-mobile');
  assert.equal(await evaluate('document.documentElement.scrollWidth > innerWidth'), false);
  await click('button[type=submit]');
  await wait("document.querySelector('main').innerText.includes('Pedido confirmado')");
  const order = await evaluate("JSON.parse(localStorage.getItem('alpha-orders'))");
  assert.equal(order.length, 1);
  assert.equal(order[0].total, 15);
  assert.equal(order[0].customerName, 'Cliente de Teste');
  assert.equal(order[0].items[0].quantity, 1);
  assert.equal(order[0].payment, 'PIX');
  assert.equal(order[0].store, 'Loja Centro');
  assert.equal(await evaluate("document.querySelector('.cart-count')"), null);
  check('Checkout valida campos, confirma um pedido e esvazia o carrinho');

  await navigate('/admin/pedidos');
  assert.ok((await evaluate("document.querySelector('main').innerText")).includes('Cliente de Teste'));
  await click('.admin-order summary');
  assert.ok((await evaluate("document.querySelector('.admin-order__items').innerText")).includes('Caderno de anotações'));
  await select('.admin-order select', 'Aceito');
  await wait("JSON.parse(localStorage.getItem('alpha-orders'))[0].status === 'Aceito'");
  await navigate('/admin');
  assert.ok((await evaluate("document.querySelector('.dashboard-grid').innerText")).includes('15,00'));
  check('Pedido chega ao painel com cliente, itens, totais e status editável');

  await navigate('/admin/produtos');
  await click('button[aria-label="Editar Caderno de anotações"]');
  await wait("!!document.querySelector('dialog[open]')");
  await fill('input[name=stock]', '-1');
  await click('.admin-modal__stock-row button');
  await wait("!!document.querySelector('.admin-stock-feedback--error')");
  assert.equal(await evaluate("JSON.parse(localStorage.getItem('alpha-catalog-products'))[0].stock"), 3);
  await fill('input[name=stock]', '1.5');
  await click('.admin-modal__stock-row button');
  await wait("!!document.querySelector('.admin-stock-feedback--error')");
  await fill('input[name=stock]', '7');
  await click('.admin-modal__stock-row button');
  await wait("JSON.parse(localStorage.getItem('alpha-catalog-products'))[0].stock === 7");
  await screenshot('admin-modal-mobile');
  for (let index = 0; index < 16; index++) {
    await key('Tab', 9);
    assert.equal(await evaluate("document.querySelector('dialog').contains(document.activeElement)"), true);
  }
  await key('Escape', 27);
  await wait("!document.querySelector('dialog[open]')");
  assert.equal(await evaluate("document.activeElement.getAttribute('aria-label')"), 'Editar Caderno de anotações');
  check('Modal administrativo valida estoque e mantém/devolve foco');

  await navigate('/produto/inexistente');
  assert.ok((await evaluate("document.querySelector('main').innerText")).includes('Produto não encontrado'));
  await navigate('/produto/hidden');
  assert.ok((await evaluate("document.querySelector('main').innerText")).includes('Produto não encontrado'));
  await navigate('/produto/empty');
  assert.equal(await evaluate("[...document.querySelectorAll('.detail-actions button')].every(e => e.disabled)"), true);
  check('Produto inexistente/inativo e estoque zero');

  const paths = [
    '/',
    '/produtos',
    '/produto/long',
    '/produto/inexistente',
    '/carrinho',
    '/checkout',
    '/admin',
    '/admin/produtos',
    '/admin/categorias',
    '/admin/pedidos',
    '/admin/configuracoes',
    '/admin-login',
    '/pagina-inexistente',
  ];
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    await viewport(width, 900);
    for (const path of paths) {
      await navigate(path);
      assert.equal(await evaluate('document.documentElement.scrollWidth > innerWidth'), false, `Overflow: ${width} ${path}`);
      assert.equal(await evaluate("!!document.querySelector('vite-error-overlay')"), false);
      if (path === '/') {
        assert.equal(await evaluate("document.querySelectorAll('.category-menu').length"), 1);
        assert.equal(await evaluate("document.querySelectorAll('.site-header nav').length"), 0);
        assert.equal(
          await evaluate(
            "Math.round(document.querySelector('.cart-link').getBoundingClientRect().top) === Math.round(document.querySelector('.brand').getBoundingClientRect().top)",
          ),
          true,
        );
      }
    }
    check(`13 rotas sem overflow em ${width}px`);
  }
  await viewport(1440, 900);
  await navigate('/');
  await screenshot('home-desktop');
  await viewport(375, 812);
  await navigate('/produtos');
  await screenshot('catalog-mobile');
  await click('.menu-button');
  await wait("!!document.querySelector('dialog[open]')");
  for (let index = 0; index < 7; index++) {
    await key('Tab', 9);
    assert.equal(await evaluate("document.querySelector('dialog').contains(document.activeElement)"), true);
  }
  await key('Escape', 27);
  await wait("!document.querySelector('dialog[open]')");
  assert.equal(await evaluate('document.activeElement.classList.contains("menu-button")'), true);
  check('Menu mobile mantém e devolve foco');
  assert.deepEqual(page.errors, []);
  await writeFile(`${output}/report.json`, JSON.stringify({ base, checks, runtimeErrors: page.errors }, null, 2));
  console.log(`All ${checks.length} checks passed. Screenshots and report: ${output}`);
} catch (error) {
  if (page) {
    const state = await page.send('Runtime.evaluate', {
      expression: 'JSON.stringify({url:location.href,content:document.body.innerText})',
      returnByValue: true,
    });
    console.error(state.result.value);
    const { data } = await page.send('Page.captureScreenshot', { format: 'png' });
    await writeFile(`${output}/failure.png`, Buffer.from(data, 'base64'));
  }
  throw error;
} finally {
  page?.close();
  await browser.send('Target.disposeBrowserContext', { browserContextId });
  browser.close();
}
