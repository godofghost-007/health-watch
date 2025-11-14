import React, { useState, useMemo, useEffect } from 'react';
import type { Doctor, Patient } from '../types';
import { DoctorVerificationStatus } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import { ShieldCheck, UserPlus, FileText, LayoutDashboard, Users } from '../components/icons';
import SystemStats from './SystemStats';
import UserManagement from './UserManagement';
import * as api from '../lib/api';

interface AdminDashboardProps {
  onUpdateDoctorStatus: (doctorId: string, status: DoctorVerificationStatus) => void;
  onUpdateUser: (user: Patient | Doctor) => void;
  onDeleteUser: (userId: string, userType: 'patient' | 'doctor') => void;
}

type AdminTab = 'dashboard' | 'verification' | 'users';

const VerificationPanel: React.FC<{
    doctors: Doctor[];
    onUpdateDoctorStatus: (doctorId: string, status: DoctorVerificationStatus) => void;
}> = ({ doctors, onUpdateDoctorStatus }) => {
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const pendingDoctors = useMemo(() => {
        return doctors.filter(d => d.verificationStatus === DoctorVerificationStatus.PENDING);
    }, [doctors]);

    const handleVerification = (status: DoctorVerificationStatus.VERIFIED | DoctorVerificationStatus.REJECTED) => {
        if (selectedDoctor) {
        onUpdateDoctorStatus(selectedDoctor.id, status);
        setSelectedDoctor(null);
        }
    };

    return (
        <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-teal-500" />
              Pending Verifications ({pendingDoctors.length})
            </h2>
            {pendingDoctors.length > 0 ? (
              <ul className="space-y-2">
                {pendingDoctors.map(doc => (
                  <li key={doc.id}>
                    <button
                      onClick={() => setSelectedDoctor(doc)}
                      className={`w-full text-left p-3 rounded-md transition-colors ${selectedDoctor?.id === doc.id ? 'bg-teal-100 dark:bg-teal-900/50' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                      <p className="font-semibold">{doc.fullName}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{doc.specialization}</p>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">No pending doctor verifications.</p>
            )}
          </Card>
        </div>
        <div className="lg:col-span-2">
           {!selectedDoctor ? (
            <Card className="flex flex-col items-center justify-center h-full text-center min-h-[300px]">
              <FileText className="w-16 h-16 text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300">No Doctor Selected</h3>
              <p className="text-slate-500 dark:text-slate-400">Select a doctor from the pending list to review their details.</p>
            </Card>
          ) : (
            <Card>
              <h2 className="text-2xl font-bold mb-4">Review: {selectedDoctor.fullName}</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong className="block text-slate-500 dark:text-slate-400">Email:</strong> {selectedDoctor.email}</div>
                  <div><strong className="block text-slate-500 dark:text-slate-400">Phone:</strong> {selectedDoctor.phone}</div>
                  <div><strong className="block text-slate-500 dark:text-slate-400">Specialization:</strong> {selectedDoctor.specialization}</div>
                  <div><strong className="block text-slate-500 dark:text-slate-400">Experience:</strong> {selectedDoctor.experienceYears} years</div>
                  <div className="md:col-span-2"><strong className="block text-slate-500 dark:text-slate-400">Medical Reg. No:</strong> <span className="font-mono">{selectedDoctor.medicalRegNumber}</span></div>
                </div>
                <div className="border-t pt-4">
                    <h3 className="text-md font-semibold mb-2">Submitted Documents</h3>
                    <Button variant="secondary" onClick={() => alert("Showing mock document for " + selectedDoctor.fullName)}>
                        View Medical Registration PDF
                    </Button>
                </div>
                 <div className="border-t pt-4 flex justify-end gap-4 mt-6">
                    <Button variant="danger" onClick={() => handleVerification(DoctorVerificationStatus.REJECTED)}>
                        Reject
                    </Button>
                     <Button variant="primary" onClick={() => handleVerification(DoctorVerificationStatus.VERIFIED)}>
                        Approve
                    </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
        </div>
    );
};


const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        setIsLoading(true);
        const [patientsData, doctorsData] = await Promise.all([
            api.getAllPatients(),
            api.getAllDoctors()
        ]);
        setPatients(patientsData);
        setDoctors(doctorsData);
        setIsLoading(false);
    };
    loadData();
  }, [activeTab, props.onUpdateDoctorStatus]); // Reload data if tab changes or doctor status is updated

  const NavButton: React.FC<{ tabName: AdminTab; label: string; icon: React.ReactNode }> = ({ tabName, label, icon }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center gap-3 w-full px-3 py-3 text-sm font-medium rounded-md text-left transition-colors ${
        activeTab === tabName
          ? 'bg-teal-600 text-white'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="container mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">Admin Portal</h1>
        <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
                <Card className="p-2">
                    <nav className="space-y-1">
                        <NavButton tabName="dashboard" label="Dashboard" icon={<LayoutDashboard className="w-5 h-5" />} />
                        <NavButton tabName="verification" label="Verification" icon={<ShieldCheck className="w-5 h-5" />} />
                        <NavButton tabName="users" label="User Management" icon={<Users className="w-5 h-5" />} />
                    </nav>
                </Card>
            </div>
            <div className="lg:col-span-3">
              {isLoading ? <div className="text-center p-10">Loading Admin Data...</div> : (
                <>
                  {activeTab === 'dashboard' && <SystemStats doctors={doctors} patients={patients} />}
                  {activeTab === 'verification' && <VerificationPanel doctors={doctors} onUpdateDoctorStatus={props.onUpdateDoctorStatus} />}
                  {activeTab === 'users' && <UserManagement doctors={doctors} patients={patients} onUpdateUser={props.onUpdateUser} onDeleteUser={props.onDeleteUser} />}
                </>
              )}
            </div>
        </div>
    </div>
  );
};

export default AdminDashboard;