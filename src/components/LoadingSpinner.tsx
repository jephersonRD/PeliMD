import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
}

const LoadingSpinner = ({ size = 'medium', fullScreen = false }: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <Loader2 className={`${sizeClasses[size]} text-primary-500 animate-spin`} />
      </div>
      <p className="text-gray-400 text-sm animate-pulse">Cargando...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark-950/90 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
