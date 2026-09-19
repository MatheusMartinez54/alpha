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

function Footer({ compact = false, centered = false, showFloatingContact = false, showStoreInfo = false }) {
  return (
    <>
      <footer className={`footer${centered ? ' footer--centered' : ''}`}>
        <div className="container footer-content">
          <div className="footer-branding">
            <strong>ALPHA IMPORTES</strong>
            <span>Escolhas com intenção.</span>
          </div>

          {!compact && showStoreInfo && (
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
          )}

          <small>© 2026 Alpha Imports</small>
        </div>
      </footer>
      {showFloatingContact && (
        <div className="floating-contact">
          <a
            className="floating-whatsapp"
            href={`https://wa.me/${stores[0].whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar com a Alpha Imports no WhatsApp"
            title="Falar pelo WhatsApp"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
              <path d="M20.5 3.5A11.9 11.9 0 0 0 12 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6a12 12 0 0 0 5.8 1.5c6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.5-8.4ZM12 21.9a10 10 0 0 1-5.1-1.4l-.4-.2-3.7 1 1-3.6-.3-.4A10 10 0 1 1 12 21.9Zm5.5-7.5c-.3-.1-1.8-.9-2-.9-.3-.1-.5-.1-.7.2-.2.3-.8.9-1 1.1-.1.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.4.1-.6l.5-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.1c-.2-.5-.5-.5-.6-.5H8c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.7 1.2 2.9c.1.2 2 3.1 5 4.3.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.2-.6-.4Z" />
            </svg>
            <span>WhatsApp</span>
          </a>
        </div>
      )}
    </>
  );
}
export default Footer;
