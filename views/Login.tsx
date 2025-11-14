import React, { useState } from 'react';
import { View } from '../App';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { useToast } from '../context/ToastContext';
import { Hospital } from '../components/icons';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
  setView: (view: View) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, setView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        await onLogin(email, password);
    } catch (err) {
        // Error toast is handled by the caller, just need to stop loading
    } finally {
        setIsLoading(false);
    }
  };
  
  const getIdentifierHint = () => {
      return "Use: patient@test.com, doctor@test.com, admin@ihdim5.com, or gov@ihdim5.com with password 'password123'";
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="max-w-md w-full mx-auto">
        <div className="flex justify-center items-center gap-2 mb-6">
            <Hospital className="w-10 h-10 text-teal-600 dark:text-teal-400" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">I-HDIM5 Login</h1>
        </div>
        <Card>
          <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  id="email"
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-xs text-slate-500 mt-1">{getIdentifierHint()}</p>
              </div>

              <Input
                  id="password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
            
              <Button type="submit" className="w-full !mt-6" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
              </Button>
          </form>
          <div className="text-center mt-6 text-sm">
            <p className="text-slate-500 dark:text-slate-400">
                Don't have an account?{' '}
                <button onClick={() => setView(View.PATIENT_REGISTRATION)} className="font-semibold text-teal-600 hover:underline">Register Now</button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;