import React from 'react';
import { View } from '../App';
import Button from '../components/Button';
import { User, Stethoscope, LogIn, UserPlus, Hospital } from '../components/icons';
import Card from '../components/Card';

interface LandingProps {
  setView: (view: View) => void;
}

const Landing: React.FC<LandingProps> = ({ setView }) => {
  return (
    <div className="container mx-auto max-w-6xl text-center">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-teal-600 dark:text-teal-400 mb-4">
                I-HDIM5
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-6">
                Integrated Health Data Information & Management System.
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
                Your secure, centralized platform for managing health records. Connecting patients, doctors, and healthcare providers for a seamless and efficient healthcare experience.
            </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-8">
            <Card className="flex flex-col justify-between transform hover:scale-105 transition-transform duration-300">
                <div className="text-center">
                    <User className="mx-auto w-16 h-16 text-teal-500 mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">Patients</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                        Access and manage your secure health profile.
                    </p>
                </div>
                 <Button onClick={() => setView(View.PATIENT_REGISTRATION)} variant="secondary" className="w-full flex items-center justify-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Register
                </Button>
            </Card>
            <Card className="flex flex-col justify-between transform hover:scale-105 transition-transform duration-300">
                <div className="text-center">
                    <Stethoscope className="mx-auto w-16 h-16 text-green-500 mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">Doctors</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                        Join our network of verified health professionals.
                    </p>
                </div>
                <Button onClick={() => setView(View.DOCTOR_REGISTRATION)} variant="secondary" className="w-full flex items-center justify-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Register
                </Button>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default Landing;