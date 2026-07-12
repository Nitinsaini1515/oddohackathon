import React from 'react';
import Badge from './Badge';

export default function PriorityBadge({ priority = '', className = '' }) {
  const getVariant = () => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return 'danger';
      case 'high':
        return 'warning';
      case 'medium':
        return 'primary';
      case 'low':
      default:
        return 'gray';
    }
  };

  return (
    <Badge variant={getVariant()} className={className}>
      {priority}
    </Badge>
  );
}
