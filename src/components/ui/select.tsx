import React from 'react';
import { cn } from '@/components/ui/card';
import { inputBaseClasses } from '@/components/ui/input';

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(inputBaseClasses, 'cursor-pointer', className)} {...props}>
      {children}
    </select>
  );
}
