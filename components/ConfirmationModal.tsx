import React from 'react';
import Card from './Card';
import Button from './Button';
import { X } from './icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  children?: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4" aria-modal="true" role="dialog">
      <Card className="w-full max-w-md">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{message}</p>
        
        {children}
        
        <div className="mt-6 flex justify-end gap-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ConfirmationModal;
