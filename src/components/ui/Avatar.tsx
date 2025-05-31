import React from 'react';
import { getInitials } from '../../utils';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
  };

  const initials = getInitials(alt);

  return (
    <div className={`relative rounded-full overflow-hidden bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center text-white font-medium ${sizeClasses[size]} ${className}`}>
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
          onError={(e) => {
            // If image fails to load, show initials
            (e.target as HTMLImageElement).style.display = 'none';
          }} 
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};