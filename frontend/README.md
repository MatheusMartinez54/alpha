# Alpha Imports

Loja em React 19 e Vite, com painel de produtos, categorias e pedidos. A interface mantém o logo, a tipografia, o fundo escuro e o dourado da marca.

## Executar

```sh
cd frontend
npm install
npm run dev
```

O catálogo usa `StoreContext`, inicializado com `src/data/adminMocks.js`. Produtos, categorias e pedidos são salvos nas chaves existentes do `localStorage` (`alpha-catalog-products`, `alpha-catalog-categories`, `alpha-orders`). O carrinho continua em memória durante a sessão da aplicação; recarregar a página o esvazia.

O checkout registra um pedido local para retirada em loja, com nome, telefone, loja e forma de pagamento. O backend atual expõe somente `/api/health`; não há processamento de pagamento ou envio remoto de pedidos. O login administrativo permanece demonstrativo. Esta refatoração não acrescenta autenticação ou integração de pagamentos.

## Organização

- `pages`: Home, catálogo, produto, carrinho, checkout e painel administrativo.
- `components`: imagens com fallback, preço, quantidade, item de carrinho, resumo, campos, filtros, estados vazios e dialog nativo compartilhados.
- `context`: catálogo/pedidos, carrinho e autenticação existentes.
- `utils/format.js`: preço efetivo, moeda brasileira e normalização de busca.
- `styles/variables.css`: tokens de identidade; `global.css`: base comum; `storefront.css`: navegação/Home/rodapé; `commerce.css`: catálogo/compra; `admin.css` e `admin-catalog.css`: painel.

O catálogo mantém `busca` e `categoria` na URL. Os filtros adicionam `estoque=disponivel` e `ordem=menor-preco|maior-preco|nome`, preservando combinações de filtros. A ordenação padrão mantém a ordem do catálogo. Cards usam linhas compactas no celular e grid a partir de 560px. Os filtros laterais aparecem a partir de 900px; abaixo disso usam um dialog.

Os campos de promoção, destaque e categoria vêm dos dados existentes. Não são inventadas avaliações, parcelamento, variações ou classificações de mais vendidos. Categoria desativada continua fora das seções da Home; a visibilidade de produtos ativos no catálogo completo é preservada.

## Verificação

```sh
npm run lint
npm run test
npm run build
```

Há testes de navegador sem dependências extras, via protocolo de depuração do Chrome. Use Node 24+ e um Chrome iniciado com perfil temporário e porta local de depuração. O teste cria um contexto descartável, popula apenas esse contexto com produtos fictícios e o destrói ao terminar; não utiliza o perfil pessoal do navegador.

```sh
google-chrome --headless --no-first-run \
  --user-data-dir=/tmp/alpha-test-browser --remote-debugging-port=9222 about:blank

# Em outro terminal, com a versão compilada em execução (npm run build e npm run preview):
TEST_BASE_URL=http://127.0.0.1:4173 npm run test:browser
```

`TEST_CDP_URL` permite mudar o endereço local de depuração. `TEST_OUTPUT_DIR` define a pasta de screenshots e do relatório (padrão: `/tmp/alpha-verification`). O script aceita somente servidores locais. A verificação cobre busca, filtros, preços, quantidades, estoque, checkout, pedidos, modais, teclado e overflow em 320, 375, 768, 1024, 1440 e 1920px.

As imagens remotas e os contatos/endereço das lojas permanecem os cadastrados no projeto. Falhas de imagem usam o componente de fallback. A verificação não realiza pagamentos nem envia mensagens.
