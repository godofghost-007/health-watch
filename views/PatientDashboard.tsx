import React, { useState } from 'react';
import type { Patient, Doctor } from '../types';
import Card from '../components/Card';
import QRCodeDisplay from '../components/QRCodeDisplay';
import Button from '../components/Button';
// Fix: Replaced 'ClipboardText' with 'ClipboardList' to match the updated export from components/icons.tsx.
import { FileDown, FilePenLine, User, HeartPulse, ClipboardList, FlaskConical } from '../components/icons';
import PatientEditModal from './PatientEditModal';

interface PatientDashboardProps {
  patient: Patient;
  onUpdateUser: (user: Patient | Doctor) => void;
}

type PatientTab = 'profile' | 'history' | 'records';

const PatientDashboard: React.FC<PatientDashboardProps> = ({ patient, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<PatientTab>('profile');

  const handleDownloadCard = () => {
    const svg = document.getElementById('patient-qr-code');
    if (!svg) {
      alert("Could not find QR code to download.");
      return;
    };

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const img = new Image();
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        
        const downloadLink = document.createElement("a");
        downloadLink.download = `I-HDIM5-Card-${patient.id}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };
  
  const handleSave = (updatedPatient: Patient) => {
    onUpdateUser(updatedPatient);
    setIsEditing(false);
  }
  
  const TabButton: React.FC<{ tabName: PatientTab; label: string; icon: React.ReactNode }> = ({ tabName, label, icon }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex flex-col sm:flex-row items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        activeTab === tabName
          ? 'bg-teal-600 text-white'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
      }`}
    >
      {icon}
      <span className="text-center sm:text-left">{label}</span>
    </button>
  );

  return (
    <>
    {isEditing && (
      <PatientEditModal 
        patient={patient} 
        onClose={() => setIsEditing(false)} 
        onSave={handleSave}
      />
    )}
    <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Patient Dashboard</h1>
        <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-6">
                 <Card className="text-center">
                    <h2 className="text-2xl font-semibold">{patient.firstName} {patient.lastName}</h2>
                    <p className="text-slate-500 dark:text-slate-400">Patient ID:</p>
                    <p className="font-mono bg-slate-100 dark:bg-slate-700 p-1 rounded inline-block my-1">{patient.id}</p>
                 </Card>
                 <div className="flex flex-row lg:flex-col gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                     <TabButton tabName="profile" label="Patient Profile" icon={<User className="w-5 h-5"/>} />
                     <TabButton tabName="history" label="Medical History" icon={<HeartPulse className="w-5 h-5"/>} />
                     {/* Fix: Replaced 'ClipboardText' icon component with 'ClipboardList' to resolve the export error. */}
                     <TabButton tabName="records" label="Medical Records" icon={<ClipboardList className="w-5 h-5"/>} />
                 </div>
            </div>
            <div className="lg:col-span-3 space-y-8">
                {activeTab === 'profile' && (
                    <div className="space-y-8">
                        <Card>
                            <div className="flex justify-between items-center mb-4 border-b pb-2">
                                <h3 className="text-xl font-semibold">Personal Information</h3>
                                <Button variant="secondary" onClick={() => setIsEditing(true)} className="flex items-center justify-center gap-2 !py-1.5 !px-3 text-sm">
                                    <FilePenLine className="w-4 h-4" />
                                    Edit Profile
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div><strong className="text-slate-500 dark:text-slate-400">Date of Birth:</strong> {patient.dateOfBirth}</div>
                                <div><strong className="text-slate-500 dark:text-slate-400">Gender:</strong> {patient.gender}</div>
                                <div><strong className="text-slate-500 dark:text-slate-400">Phone:</strong> {patient.phone}</div>
                                <div><strong className="text-slate-500 dark:text-slate-400">Blood Group:</strong> {patient.bloodGroup}</div>
                                <div className="md:col-span-2"><strong className="text-slate-500 dark:text-slate-400">Address:</strong> {patient.address}</div>
                            </div>
                        </Card>
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card className="flex flex-col items-center">
                                <QRCodeDisplay value={patient.qrCodeUrl} title="Your Patient ID Card" id="patient-qr-code"/>
                                <Button onClick={handleDownloadCard} className="mt-6 w-full flex items-center justify-center gap-2">
                                    <FileDown className="w-5 h-5" />
                                    Download Digital Card
                                </Button>
                            </Card>
                             <Card>
                                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Emergency Contacts</h3>
                                <ul className="space-y-3">
                                    {patient.emergencyContacts.map((contact, index) => (
                                        <li key={index}>
                                            <p className="font-semibold">{contact.name} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">({contact.relationship})</span></p>
                                            <p className="text-sm text-slate-600 dark:text-slate-300">{contact.phone}</p>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </div>
                    </div>
                )}
                 {activeTab === 'history' && (
                    <Card>
                        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Medical History</h3>
                        <div className="space-y-4 text-sm">
                           <div><strong className="text-slate-500 dark:text-slate-400 text-base block mb-1">Allergies:</strong> <p>{patient.medicalHistory.allergies || 'None reported'}</p></div>
                           <hr className="dark:border-slate-700"/>
                           <div><strong className="text-slate-500 dark:text-slate-400 text-base block mb-1">Chronic Conditions:</strong> <p>{patient.medicalHistory.chronicConditions || 'None reported'}</p></div>
                            <hr className="dark:border-slate-700"/>
                           <div><strong className="text-slate-500 dark:text-slate-400 text-base block mb-1">Current Medications:</strong> <p>{patient.medicalHistory.currentMedications || 'None reported'}</p></div>
                           <hr className="dark:border-slate-700"/>
                           <div><strong className="text-slate-500 dark:text-slate-400 text-base block mb-1">Past Surgeries:</strong> <p>{patient.medicalHistory.surgeries || 'None reported'}</p></div>
                        </div>
                    </Card>
                 )}
                 {activeTab === 'records' && (
                     <div className="space-y-8">
                         <Card>
                            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Doctor's Notes</h3>
                            <div className="space-y-3 text-sm max-h-60 overflow-y-auto">
                                {(patient.medicalNotes && patient.medicalNotes.length > 0) ? patient.medicalNotes.map(note => (
                                    <div key={note.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                        <p>{note.note}</p>
                                        <p className="text-xs text-slate-400 text-right mt-2">{note.date} - {note.doctorName}</p>
                                    </div>
                                )) : <p className="text-slate-500 dark:text-slate-400">No notes found.</p>}
                            </div>
                        </Card>
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card>
                                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Prescriptions</h3>
                                <div className="space-y-3 text-sm max-h-60 overflow-y-auto">
                                     {(patient.prescriptions && patient.prescriptions.length > 0) ? patient.prescriptions.map(p => (
                                        <div key={p.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                            <p className="font-semibold">{p.medication}</p>
                                            <p>{p.dosage}, {p.frequency}</p>
                                            <p className="text-xs text-slate-400 text-right mt-2">{p.date} - {p.doctorName}</p>
                                        </div>
                                    )) : <p className="text-slate-500 dark:text-slate-400">No prescriptions found.</p>}
                                </div>
                            </Card>
                             <Card>
                                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Lab Orders</h3>
                                <div className="space-y-3 text-sm max-h-60 overflow-y-auto">
                                    {(patient.labOrders && patient.labOrders.length > 0) ? patient.labOrders.map(o => (
                                        <div key={o.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                            <p className="font-semibold">{o.testName}</p>
                                            <p>Status: <span className="font-mono bg-slate-200 dark:bg-slate-600 px-1.5 py-0.5 rounded text-xs">{o.status}</span></p>
                                            <p className="text-xs text-slate-400 text-right mt-2">{o.date} - {o.doctorName}</p>
                                        </div>
                                    )) : <p className="text-slate-500 dark:text-slate-400">No lab orders found.</p>}
                                </div>
                            </Card>
                        </div>
                     </div>
                 )}
            </div>
        </div>
    </div>
    </>
  );
};

export default PatientDashboard;