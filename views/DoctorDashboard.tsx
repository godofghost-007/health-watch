import React, { useState, useEffect } from 'react';
import type { Doctor, Patient } from '../types';
import { DoctorVerificationStatus } from '../types';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { ShieldCheck, AlertTriangle, FileText } from '../components/icons';
import PatientProfileForDoctor from './PatientProfileForDoctor';
import QRScanner from '../components/QRScanner';
import * as api from '../lib/api';

interface DoctorDashboardProps {
  doctor: Doctor;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ doctor }) => {
  const [searchId, setSearchId] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [recentlyAccessed, setRecentlyAccessed] = useState<Patient[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const addPatientToRecents = (patient: Patient) => {
    setRecentlyAccessed(prev => {
      const filtered = prev.filter(p => p.id !== patient.id);
      const newRecents = [patient, ...filtered].slice(0, 5);
      // Here you could also persist 'recents' to localStorage for a better UX
      return newRecents;
    });
  };

  const handlePatientUpdate = (updatedPatient: Patient) => {
    setSelectedPatient(updatedPatient);
    addPatientToRecents(updatedPatient);
  };

  const findAndSelectPatient = async (patientId: string) => {
    try {
        const foundPatient = await api.getPatientById(patientId);
        if (foundPatient) {
            setSelectedPatient(foundPatient);
            addPatientToRecents(foundPatient);
            return foundPatient;
        }
    } catch (err) {
        console.error(err);
    }
    return null;
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const foundPatient = await findAndSelectPatient(searchId);
    if (foundPatient) {
      setSearchId('');
    } else {
      alert('Patient not found.');
    }
  };

  const handleScanSuccess = async (scannedUrl: string) => {
    setIsScanning(false);
    // Assuming QR code URL is just the patient ID
    const patientId = scannedUrl;
    const foundPatient = await findAndSelectPatient(patientId);

    if (foundPatient) {
        alert(`Successfully scanned Patient ID: ${patientId}`);
    } else {
        alert(`Patient with scanned ID ${patientId} not found.`);
    }
  };


  if (doctor.verificationStatus !== DoctorVerificationStatus.VERIFIED) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <Card>
          {doctor.verificationStatus === DoctorVerificationStatus.PENDING ? (
            <ShieldCheck className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
          ) : (
            <AlertTriangle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          )}
          <h2 className="text-2xl font-bold mb-2">Profile {doctor.verificationStatus}</h2>
          <p className="text-slate-600 dark:text-slate-400">
            {doctor.verificationStatus === DoctorVerificationStatus.PENDING
              ? "Your profile is currently under review by our administrators. You will be notified once the verification process is complete."
              : "Your profile verification was rejected. Please contact support for more information."}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>

      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6 flex items-center gap-3" role="alert">
        <ShieldCheck className="w-6 h-6" />
        <div>
          <p className="font-bold">Profile Verified</p>
          <p className="text-sm">You have full access to the dashboard features.</p>
        </div>
      </div>
      
      {isScanning && <QRScanner onScan={handleScanSuccess} onClose={() => setIsScanning(false)} />}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
            <Card>
              <h2 className="text-xl font-semibold mb-4">Access Patient Record</h2>
              <form onSubmit={handleSearch} className="space-y-4">
                <Input
                  id="patientId"
                  label="Enter Patient ID"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="e.g., P001"
                />
                <div className="flex flex-col gap-2">
                    <Button type="submit" className="w-full">Search</Button>
                    <Button type="button" variant="secondary" onClick={() => setIsScanning(true)} className="w-full">
                      Scan Patient QR
                    </Button>
                </div>
              </form>
            </Card>

            {recentlyAccessed.length > 0 && (
              <Card>
                <h2 className="text-xl font-semibold mb-4">Recently Accessed</h2>
                <ul className="space-y-2">
                  {recentlyAccessed.map(p => (
                    <li key={p.id}>
                      <button 
                        onClick={() => findAndSelectPatient(p.id)}
                        className="w-full text-left p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <p className="font-semibold">{p.firstName} {p.lastName}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">ID: {p.id}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
        </div>
        
        <div className="lg:col-span-2">
            {!selectedPatient ? (
                <Card className="flex flex-col items-center justify-center h-full text-center min-h-[300px]">
                    <FileText className="w-16 h-16 text-slate-400 mb-4"/>
                    <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300">No Patient Selected</h3>
                    <p className="text-slate-500 dark:text-slate-400">Search for a patient or select one from your recent list to view their details.</p>
                </Card>
            ) : (
              <PatientProfileForDoctor 
                patient={selectedPatient} 
                doctor={doctor} 
                onPatientUpdate={handlePatientUpdate}
              />
            )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;