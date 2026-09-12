function Logo({ className = '', src = '/brand/alpha-imports.png' }) {
  return <img className={`brand-logo ${className}`} src={src} alt="Alpha Imports" width="140" height="64" />;
}
export default Logo;
