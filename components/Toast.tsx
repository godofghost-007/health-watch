import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, X } from './icons';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true); // Animate in
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Allow animation out
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);
  
  const handleClose = () => {
      setVisible(false);
      setTimeout(onClose, 300);
  }

  const baseClasses = 'flex items-center p-4 max-w-sm w-full rounded-lg shadow-lg text-white transition-all duration-300';
  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
  };
  
  const icon = {
      success: <CheckCircle2 className="w-6 h-6" />,
      error: <AlertCircle className="w-6 h-6" />
  }

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} role="alert">
      <div className="mr-3">
        {icon[type]}
      </div>
      <div className="text-sm font-medium flex-grow">{message}</div>
       <button onClick={handleClose} className="ml-4 -mr-2 p-1 rounded-md hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toast;
