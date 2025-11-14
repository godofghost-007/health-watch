import React, { useState } from 'react';
import type { Patient, Doctor, MedicalNote, Prescription, LabOrder } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import * as api from '../lib/api';
import AIAssistant from '../components/AIAssistant';

interface PatientProfileForDoctorProps {
  patient: Patient;
  doctor: Doctor;
  onPatientUpdate: (patient: Patient) => void;
}

const PatientProfileForDoctor: React.FC<PatientProfileForDoctorProps> = ({ patient, doctor, onPatientUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [newPrescription, setNewPrescription] = useState({ medication: '', dosage: '', frequency: '' });
    const [newLabOrder, setNewLabOrder] = useState('');

    const addNote = async () => {
        if (!newNote) return;
        setIsLoading(true);
        const updatedPatient = await api.addMedicalNote(patient.id, {
            date: new Date().toISOString().split('T')[0],
            doctorName: doctor.fullName,
            note: newNote,
        });
        onPatientUpdate(updatedPatient);
        setNewNote('');
        setIsLoading(false);
    };

    const addPrescription = async () => {
        if (!newPrescription.medication) return;
        setIsLoading(true);
        const updatedPatient = await api.addPrescription(patient.id, {
            date: new Date().toISOString().split('T')[0],
            doctorName: doctor.fullName,
            ...newPrescription
        });
        onPatientUpdate(updatedPatient);
        setNewPrescription({ medication: '', dosage: '', frequency: '' });
        setIsLoading(false);
    };

    const addLabOrder = async () => {
        if (!newLabOrder) return;
        setIsLoading(true);
        const updatedPatient = await api.addLabOrder(patient.id, {
            date: new Date().toISOString().split('T')[0],
            doctorName: doctor.fullName,
            testName: newLabOrder,
            status: 'Ordered'
        });
        onPatientUpdate(updatedPatient);
        setNewLabOrder('');
        setIsLoading(false);
    };

    const notes = patient.medicalNotes || [];
    const prescriptions = patient.prescriptions || [];
    const labOrders = patient.labOrders || [];

    return (
        <div className="space-y-8">
            <Card>
                <h2 className="text-2xl font-bold mb-4">Patient: {patient.firstName} {patient.lastName}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div><strong className="block text-slate-500 dark:text-slate-400">Patient ID:</strong> {patient.id}</div>
                    <div><strong className="block text-slate-500 dark:text-slate-400">DoB:</strong> {patient.dateOfBirth}</div>
                    <div><strong className="block text-slate-500 dark:text-slate-400">Gender:</strong> {patient.gender}</div>
                    <div><strong className="block text-slate-500 dark:text-slate-400">Blood Group:</strong> {patient.bloodGroup}</div>
                </div>
            </Card>

            <AIAssistant patient={patient} />

            <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                    <h3 className="text-xl font-semibold mb-4">Medical History</h3>
                     <div className="space-y-2 text-sm">
                       <div><strong className="text-slate-500 dark:text-slate-400">Allergies:</strong> {patient.medicalHistory.allergies || 'N/A'}</div>
                       <div><strong className="text-slate-500 dark:text-slate-400">Conditions:</strong> {patient.medicalHistory.chronicConditions || 'N/A'}</div>
                       <div><strong className="text-slate-500 dark:text-slate-400">Family History:</strong> {patient.medicalHistory.familyHistory || 'N/A'}</div>
                       <div><strong className="text-slate-500 dark:text-slate-400">Vaccinations:</strong> {patient.medicalHistory.vaccinations || 'N/A'}</div>
                    </div>
                </Card>
                 <Card>
                    <h3 className="text-xl font-semibold mb-4">Emergency Contact</h3>
                    {patient.emergencyContacts[0] && <div className="text-sm">
                        <p><strong className="text-slate-500 dark:text-slate-400">Name:</strong> {patient.emergencyContacts[0].name}</p>
                        <p><strong className="text-slate-500 dark:text-slate-400">Phone:</strong> {patient.emergencyContacts[0].phone}</p>
                    </div>}
                </Card>
            </div>
            
            <Card>
                <h3 className="text-xl font-semibold mb-4">Doctor's Notes</h3>
                <div className="space-y-4">
                    <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add a new note..." rows={3} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" disabled={isLoading}></textarea>
                    <Button onClick={addNote} disabled={isLoading}>{isLoading ? 'Saving...' : 'Add Note'}</Button>
                </div>
                <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                    {notes.length > 0 ? notes.map(note => <div key={note.id} className="p-2 bg-slate-50 dark:bg-slate-700 rounded text-sm"><p>{note.note}</p><p className="text-xs text-slate-400 text-right">{note.date} - {note.doctorName}</p></div>) : <p className="text-sm text-slate-500 dark:text-slate-400">No notes recorded.</p>}
                </div>
            </Card>

            <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                    <h3 className="text-xl font-semibold mb-4">Prescriptions</h3>
                    <div className="space-y-2">
                        <input value={newPrescription.medication} onChange={(e) => setNewPrescription(p => ({...p, medication: e.target.value}))} placeholder="Medication" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" disabled={isLoading} />
                        <input value={newPrescription.dosage} onChange={(e) => setNewPrescription(p => ({...p, dosage: e.target.value}))} placeholder="Dosage (e.g., 500mg)" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" disabled={isLoading} />
                        <input value={newPrescription.frequency} onChange={(e) => setNewPrescription(p => ({...p, frequency: e.target.value}))} placeholder="Frequency (e.g., Twice a day)" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" disabled={isLoading} />
                        <Button onClick={addPrescription} disabled={isLoading} className="w-full mt-2">{isLoading ? 'Saving...' : 'Add Prescription'}</Button>
                    </div>
                    <div className="mt-4 space-y-3 max-h-48 overflow-y-auto">
                        {prescriptions.length > 0 ? prescriptions.map(p => (
                            <div key={p.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-sm">
                                <p className="font-semibold">{p.medication}</p>
                                <p>{p.dosage}, {p.frequency}</p>
                                <p className="text-xs text-slate-400 text-right mt-2">{p.date} - {p.doctorName}</p>
                            </div>
                        )) : <p className="text-sm text-slate-500 dark:text-slate-400">No prescriptions recorded.</p>}
                    </div>
                </Card>
                <Card>
                    <h3 className="text-xl font-semibold mb-4">Lab Orders</h3>
                    <div className="space-y-2">
                        <input value={newLabOrder} onChange={(e) => setNewLabOrder(e.target.value)} placeholder="Test Name (e.g., Complete Blood Count)" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" disabled={isLoading} />
                        <Button onClick={addLabOrder} disabled={isLoading} className="w-full mt-2">{isLoading ? 'Saving...' : 'Add Lab Order'}</Button>
                    </div>
                    <div className="mt-4 space-y-3 max-h-48 overflow-y-auto">
                        {labOrders.length > 0 ? labOrders.map(o => (
                            <div key={o.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-sm">
                                <p className="font-semibold">{o.testName}</p>
                                <p>Status: <span className="font-mono bg-slate-200 dark:bg-slate-600 px-1.5 py-0.5 rounded text-xs">{o.status}</span></p>
                                <p className="text-xs text-slate-400 text-right mt-2">{o.date} - {o.doctorName}</p>
                            </div>
                        )) : <p className="text-sm text-slate-500 dark:text-slate-400">No lab orders recorded.</p>}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PatientProfileForDoctor;
