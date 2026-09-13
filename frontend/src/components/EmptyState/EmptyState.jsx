import { PackageSearch } from 'lucide-react';
import { Link } from 'react-router-dom';

function EmptyState({ title, description, to, action, icon: Icon = PackageSearch, heading: Heading = 'h2', announce = false }) {
  return (
    <div className="empty" role={announce ? 'status' : undefined}>
      <Icon size={32} aria-hidden="true" />
      <Heading>{title}</Heading>
      <p>{description}</p>
      {to && (
        <Link className="button" to={to}>
          {action}
        </Link>
      )}
    </div>
  );
}
export default EmptyState;
