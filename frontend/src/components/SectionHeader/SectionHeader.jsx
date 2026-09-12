import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
function SectionHeader({ label, title, to, linkText = 'Ver tudo' }) {
  return (
    <div className="section-heading">
      <div>{label && <span className="eyebrow">{label}</span>}<h2>{title}</h2></div>
      {to && <Link to={to}>{linkText}<ArrowRight size={17} aria-hidden="true" /></Link>}
    </div>
  );
}
export default SectionHeader;
