import React from 'react';
import { cn } from '@/components/ui/card';
import { inputBaseClasses } from '@/components/ui/input';

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(inputBaseClasses, 'resize-none', className)} {...props} />;
}
