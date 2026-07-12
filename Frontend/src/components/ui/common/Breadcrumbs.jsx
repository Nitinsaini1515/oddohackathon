import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../../utils/cn';

export default function Breadcrumbs({ className = '', items = [] }) {
  const location = useLocation();
  
  // Auto-generate items based on path if none provided
  const pathItems = React.useMemo(() => {
    if (items.length > 0) return items;
    
    const paths = location.pathname.split('/').filter(Boolean);
    const generated = paths.map((segment, index) => {
      const href = '/' + paths.slice(0, index + 1).join('/');
      // Format text
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);
      if (segment === 'new') label = 'Register New';
      
      return {
        label,
        href,
        active: index === paths.length - 1
      };
    });
    
    return generated;
  }, [location.pathname, items]);

  return (
    <nav className={cn('flex items-center gap-1.5 text-xs text-brand-secondaryText font-medium select-none', className)}>
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-white transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {pathItems.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3.5 h-3.5 text-slate-700 pointer-events-none" />
          {item.active ? (
            <span className="text-white font-semibold">{item.label}</span>
          ) : (
            <Link
              to={item.href}
              className="hover:text-white transition-colors capitalize"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
