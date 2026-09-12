const stores = [
  {
    name: 'Loja 1',
    whatsapp: '5541999999999',
    instagram: '@alphaimports1',
    address: 'Rua das Flores, 842 — Centro, Curitiba/PR',
  },
  {
    name: 'Loja 2',
    whatsapp: '5541888888888',
    instagram: '@alphaimports2',
    address: 'Av. Itália, 1250 — Água Verde, Curitiba/PR',
  },
];

function Footer() {
  return (
    <>
      <a
        className="floating-whatsapp"
        href="https://wa.me/5541999999999"
        target="_blank"
        rel="noreferrer"
        aria-label="Falar com a Alpha Imports no WhatsApp"
      >
        WhatsApp
      </a>

      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-branding">
            <strong>ALPHA IMPORTES</strong>
            <span>Escolhas com intenção.</span>
          </div>

          <div className="footer-stores">
            {stores.map((store) => (
              <div key={store.name} className="footer-store">
                <h3>{store.name}</h3>
                <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noreferrer">
                  WhatsApp: {store.whatsapp}
                </a>
                <a href="https://instagram.com/alphaimports" target="_blank" rel="noreferrer">
                  Instagram: {store.instagram}
                </a>
                <span>Endereço: {store.address}</span>
              </div>
            ))}
          </div>

          <small>© 2026 Alpha Imports</small>
        </div>
      </footer>
    </>
  );
}
export default Footer;
