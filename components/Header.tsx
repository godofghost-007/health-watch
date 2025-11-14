import React from 'react';
import type { Patient, Doctor, Admin, Government } from '../types';
import { Hospital, LogIn } from './icons';
import { View } from '../App';
import Button from './Button';

interface HeaderProps {
  appName: string;
  user: Patient | Doctor | Admin | Government | null;
  onLogout: () => void;
  onHomeClick: () => void;
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ appName, user, onLogout, onHomeClick, setView }) => {
  
  const getUserName = () => {
      if (!user) return '';
      if ('role' in user) {
          if (user.role === 'ADMIN') return 'Admin';
          if (user.role === 'GOVERNMENT') return (user as Government).agencyName;
      }
      if ('firstName' in user) return `${user.firstName} ${user.lastName}`;
      if ('fullName' in user) return user.fullName;
      return '';
  }

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 text-xl font-bold text-teal-600 dark:text-teal-400 cursor-pointer"
          onClick={onHomeClick}
        >
          <Hospital className="w-8 h-8" />
          <span>{appName}</span>
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-sm text-slate-600 dark:text-slate-300">
                Welcome, <span className="font-semibold">{getUserName()}</span>
              </span>
              <Button
                onClick={onLogout}
                variant="secondary"
                className="!py-2 !px-3 text-sm"
              >
                Logout
              </Button>
            </div>
          ) : (
             <Button
                onClick={() => setView(View.LOGIN)}
                className="!py-2 !px-3 text-sm flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;