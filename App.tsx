

import React, { useState, useEffect } from 'react';
import type { Patient, Doctor, Admin, Government } from './types';
import { DoctorVerificationStatus } from './types';
import Landing from './views/Landing';
import PatientRegistration from './views/PatientRegistration';
import DoctorRegistration from './views/DoctorRegistration';
import PatientDashboard from './views/PatientDashboard';
import DoctorDashboard from './views/DoctorDashboard';
import Header from './components/Header';
import Login from './views/Login';
import AdminDashboard from './views/AdminDashboard';
import GovernmentDashboard from './views/GovernmentDashboard';
import { ToastProvider, useToast } from './context/ToastContext';
import * as api from './lib/api';
import SupabaseNotice from './components/SupabaseNotice';


const SupabasePlaceholderNotice: React.FC = () => null;

export enum View {
  LANDING,
  PATIENT_REGISTRATION,
  DOCTOR_REGISTRATION,
  LOGIN,
  PATIENT_DASHBOARD,
  DOCTOR_DASHBOARD,
  ADMIN_DASHBOARD,
  GOVERNMENT_DASHBOARD,
}

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [currentUser, setCurrentUser] = useState<Patient | Doctor | Admin | Government | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // App is now backend-free, so we can initialize immediately.
    setIsInitialized(true);
  }, []);

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setCurrentView(View.LANDING);
    toast.success('You have been logged out.');
  };

  const handlePatientRegister = async (patientData: Omit<Patient, 'id' | 'qrCodeUrl'>) => {
    try {
      await api.registerPatient(patientData);
      toast.success('Registration successful! You can now log in.');
      setCurrentView(View.LOGIN);
    } catch (err) {
       toast.error((err as Error).message);
    }
  };
  
  const handleDoctorRegister = async (doctorData: Omit<Doctor, 'id' | 'verificationStatus' | 'registrationDocumentUrl'> & { registrationDocumentUrl?: string }) => {
    try {
      await api.registerDoctor(doctorData);
      toast.success('Registration successful! Your profile is pending verification.');
      setCurrentView(View.LANDING);
    } catch(err) {
       toast.error((err as Error).message);
    }
  };
  
  const handleLogin = async (email: string, password: string):Promise<void> => {
    try {
        const user = await api.login(email, password);
        setCurrentUser(user);
         if ('role' in user) {
            if (user.role === 'ADMIN') {
                setCurrentView(View.ADMIN_DASHBOARD);
            } else if (user.role === 'GOVERNMENT') {
                setCurrentView(View.GOVERNMENT_DASHBOARD);
            }
        } else if ('qrCodeUrl' in user) {
            setCurrentView(View.PATIENT_DASHBOARD);
        } else {
            setCurrentView(View.DOCTOR_DASHBOARD);
        }
        toast.success('Login successful!');
    } catch (err) {
        toast.error((err as Error).message);
        throw err; // re-throw to be caught in Login component
    }
  };

  const handleDoctorVerification = async (doctorId: string, status: DoctorVerificationStatus) => {
    const updatedDoctor = await api.updateDoctorStatus(doctorId, status);
    if (updatedDoctor) {
        setDoctors(prevDoctors => 
            prevDoctors.map(doc => 
                doc.id === doctorId ? updatedDoctor : doc
            )
        );
        toast.success(`Doctor has been ${status.toLowerCase()}.`);
    } else {
        toast.error('Failed to update doctor status.');
    }
  };

  const handleUpdateUser = async (updatedUser: Patient | Doctor) => {
    const user = await api.updateUser(updatedUser);
    if ('qrCodeUrl' in user) { // It's a Patient
        const patientUser = user as Patient;
        setPatients(prev => prev.map(p => p.id === patientUser.id ? patientUser : p));
        if (currentUser?.id === patientUser.id) {
            setCurrentUser(patientUser);
        }
    } else { // It's a Doctor
        const doctorUser = user as Doctor;
        setDoctors(prev => prev.map(d => d.id === doctorUser.id ? doctorUser : d));
        if (currentUser?.id === doctorUser.id) {
            setCurrentUser(doctorUser);
        }
    }
    toast.success('User profile updated successfully.');
  };

  const handleDeleteUser = async (userId: string, userType: 'patient' | 'doctor') => {
    await api.deleteUser(userId, userType);
    if (userType === 'patient') {
        setPatients(prev => prev.filter(p => p.id !== userId));
    } else {
        setDoctors(prev => prev.filter(d => d.id !== userId));
    }
    toast.success(`User has been deleted.`);
  };

  const renderView = () => {
    if (!isInitialized) {
        return <div className="text-center p-10">Initializing Application...</div>;
    }
    switch (currentView) {
      case View.LANDING:
        return <Landing setView={setCurrentView} />;
      case View.PATIENT_REGISTRATION:
        return <PatientRegistration onRegister={handlePatientRegister} setView={setCurrentView} />;
      case View.DOCTOR_REGISTRATION:
        return <DoctorRegistration onRegister={handleDoctorRegister} setView={setCurrentView} />;
      case View.LOGIN:
        return <Login onLogin={handleLogin} setView={setCurrentView} />;
      case View.PATIENT_DASHBOARD:
        return <PatientDashboard patient={currentUser as Patient} onUpdateUser={handleUpdateUser} />;
      case View.DOCTOR_DASHBOARD:
        return <DoctorDashboard doctor={currentUser as Doctor} />;
      case View.ADMIN_DASHBOARD:
        return <AdminDashboard 
                    onUpdateDoctorStatus={handleDoctorVerification} 
                    onUpdateUser={handleUpdateUser}
                    onDeleteUser={handleDeleteUser}
                />;
      case View.GOVERNMENT_DASHBOARD:
          return <GovernmentDashboard />;
      default:
        return <Landing setView={setCurrentView} />;
    }
  };

  const getHomeView = () => {
      if (!currentUser) return View.LANDING;
      if ('role' in currentUser) {
          if(currentUser.role === 'ADMIN') return View.ADMIN_DASHBOARD;
          if(currentUser.role === 'GOVERNMENT') return View.GOVERNMENT_DASHBOARD;
      }
      if ('qrCodeUrl' in currentUser) return View.PATIENT_DASHBOARD;
      return View.DOCTOR_DASHBOARD;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <Header
        appName="I-HDIM5"
        user={currentUser}
        onLogout={handleLogout}
        onHomeClick={() => setCurrentView(getHomeView())}
        setView={setCurrentView}
      />
      <main className="p-4 md:p-8">
        {renderView()}
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <ToastProvider>
    <AppContent />
  </ToastProvider>
);


export default App;