import React from 'react';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'blue';
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8'
};

const textSizes = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl'
};

const variantClasses = {
  default: {
    logo: 'bg-blue-600',
    text: 'text-gray-900 dark:text-white',
    subtitle: 'text-blue-600 dark:text-blue-400'
  },
  white: {
    logo: 'bg-white/20',
    text: 'text-white',
    subtitle: 'text-blue-100'
  },
  blue: {
    logo: 'bg-blue-600',
    text: 'text-blue-600',
    subtitle: 'text-blue-500'
  }
};

export function Logo({ 
  size = 'md', 
  variant = 'default', 
  showText = true, 
  className 
}: LogoProps) {
  const sizeClass = sizeClasses[size];
  const iconSize = iconSizes[size];
  const textSize = textSizes[size];
  const variantClass = variantClasses[variant];

  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <div className={cn(
        sizeClass,
        variantClass.logo,
        'rounded-xl flex items-center justify-center flex-shrink-0'
      )}>
        <Building2 className={cn(iconSize, 'text-white')} />
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <h1 className={cn(
            textSize,
            'font-bold leading-none',
            variantClass.text
          )}>
            PosPort
          </h1>
          <p className={cn(
            'text-xs leading-none',
            variantClass.subtitle
          )}>
            Store Management
          </p>
        </div>
      )}
    </div>
  );
}

export default Logo;
