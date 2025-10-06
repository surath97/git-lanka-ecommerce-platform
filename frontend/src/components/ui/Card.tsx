import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: CardProps) {
  return (
    <div className={`border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }: CardProps) {
  return (
    <h3 className={`text-xl font-semibold text-gray-900 dark:text-gray-100 ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = '' }: CardProps) {
  return <div className={className}>{children}</div>;
}