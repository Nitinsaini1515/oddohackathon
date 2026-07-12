import React from 'react';
import Badge from './Badge';

export default function StatusBadge({ status = '', className = '' }) {
  const getVariant = () => {
    switch (status.toLowerCase()) {
      case 'available':
      case 'active':
      case 'approved':
      case 'completed':
      case 'resolved':
      case 'verified':
        return 'success';
        
      case 'pending':
      case 'in progress':
      case 'under maintenance':
      case 'technician assigned':
      case 'upcoming':
      case 'warning':
        return 'warning';
        
      case 'rejected':
      case 'cancelled':
      case 'overdue':
      case 'missing':
      case 'damaged':
      case 'broken':
        return 'danger';
        
      case 'allocated':
      case 'assigned':
      case 'info':
        return 'info';
        
      case 'gray':
      case 'archived':
      case 'inactive':
      default:
        return 'gray';
    }
  };

  return (
    <Badge variant={getVariant()} className={className}>
      {status}
    </Badge>
  );
}
