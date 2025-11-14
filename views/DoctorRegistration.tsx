import React, { useState } from 'react';
import type { Doctor } from '../types';
import { View } from '../App';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { useToast } from '../context/ToastContext';
import { validatePassword, validateEmail } from '../lib/validation';

interface DoctorRegistrationProps {
  onRegister: (doctor: Omit<Doctor, 'id' | 'verificationStatus'>) => void;
  setView: (view: View) => void;
}

const DoctorRegistration: React.FC<DoctorRegistrationProps> = ({ onRegister, setView }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    experienceYears: 0,
    medicalRegNumber: '',
    password: '',
    confirmPassword: '',
  });
  
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value, 10) : value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
          setFile(e.target.files[0]);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
        toast.error("Please upload your medical registration document.");
        return;
    }
    if (!validateEmail(formData.email)) {
        toast.error("Please enter a valid email address.");
        return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
        toast.error(passwordValidation.message);
        return;
    }
    const { confirmPassword, ...doctorData } = formData;
    onRegister(doctorData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <h2 className="text-3xl font-bold text-center mb-2">Doctor Registration</h2>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-8">Join our trusted network of healthcare professionals.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input id="fullName" name="fullName" label="Full Name" value={formData.fullName} onChange={handleChange} required />
            <Input id="email" name="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} required />
            <Input id="phone" name="phone" label="Phone Number" type="tel" value={formData.phone} onChange={handleChange} required />
            <Input id="specialization" name="specialization" label="Specialization" value={formData.specialization} onChange={handleChange} required />
            <Input id="experienceYears" name="experienceYears" label="Years of Experience" type="number" value={formData.experienceYears} onChange={handleChange} required />
            <Input id="medicalRegNumber" name="medicalRegNumber" label="Medical Registration Number" value={formData.medicalRegNumber} onChange={handleChange} required />
            <div>
                <Input id="password" name="password" label="Password" type="password" value={formData.password} onChange={handleChange} required />
                <p className="text-xs text-slate-500 mt-1">Min. 8 chars, 1 number, 1 upper, 1 lower.</p>
            </div>
            <Input id="confirmPassword" name="confirmPassword" label="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="document" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Medical Registration Document (PDF/JPG)
            </label>
            <input type="file" id="document" name="document" onChange={handleFileChange} required accept=".pdf,.jpg,.jpeg,.png"
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"/>
          </div>
          <Button type="submit" className="w-full !mt-8">Submit for Verification</Button>
        </form>
         <div className="text-center mt-6 text-sm">
            <p className="text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <button onClick={() => setView(View.LOGIN)} className="font-semibold text-teal-600 hover:underline">Login</button>
            </p>
        </div>
      </Card>
    </div>
  );
};

export default DoctorRegistration;