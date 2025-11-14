import React, { useState } from 'react';
import type { Patient } from '../types';
import { BloodGroup, Gender } from '../types';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { X } from '../components/icons';

interface PatientEditModalProps {
  patient: Patient;
  onClose: () => void;
  onSave: (patient: Patient) => void;
}

const PatientEditModal: React.FC<PatientEditModalProps> = ({ patient, onClose, onSave }) => {
  const [formData, setFormData] = useState<Patient>(patient);

  const handleChange = <T,>(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, section?: keyof T, index?: number) => {
    const { name, value } = e.target;
    if (section) {
        if (typeof index === 'number') {
            const list = formData[section as keyof typeof formData] as any[];
            const updatedList = [...list];
            updatedList[index] = { ...updatedList[index], [name]: value };
            setFormData(prev => ({...prev, [section]: updatedList}));
        } else {
             setFormData(prev => ({
                ...prev,
                [section]: {
                    ...(prev[section as keyof typeof formData] as object),
                    [name]: value,
                }
             }));
        }
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-2xl font-bold">Edit Profile</h2>
            <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6 max-h-[75vh] overflow-y-auto p-2">
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                <Input id="firstName" name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} required />
                <Input id="lastName" name="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} required />
                <Input id="dateOfBirth" name="dateOfBirth" label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={handleChange} required />
                    <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                    <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600">
                        {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>
                <Input id="phone" name="phone" label="Phone Number" type="tel" value={formData.phone} onChange={handleChange} required />
                <Input id="address" name="address" label="Address" value={formData.address} onChange={handleChange} required />
                    <div>
                    <label htmlFor="bloodGroup" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Blood Group</label>
                    <select id="bloodGroup" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600">
                        {Object.values(BloodGroup).map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                </div>
                </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Medical History</h3>
                <Input id="allergies" name="allergies" label="Allergies (comma-separated)" value={formData.medicalHistory.allergies} onChange={(e) => handleChange(e, 'medicalHistory')} />
                <Input id="chronicConditions" name="chronicConditions" label="Chronic Conditions (comma-separated)" value={formData.medicalHistory.chronicConditions} onChange={(e) => handleChange(e, 'medicalHistory')} />
                <Input id="currentMedications" name="currentMedications" label="Current Medications (comma-separated)" value={formData.medicalHistory.currentMedications} onChange={(e) => handleChange(e, 'medicalHistory')} />
                <Input id="surgeries" name="surgeries" label="Past Surgeries (comma-separated)" value={formData.medicalHistory.surgeries} onChange={(e) => handleChange(e, 'medicalHistory')} />
                <Input id="familyHistory" name="familyHistory" label="Family Medical History (e.g., heart disease)" value={formData.medicalHistory.familyHistory} onChange={(e) => handleChange(e, 'medicalHistory')} />
                <Input id="vaccinations" name="vaccinations" label="Vaccinations (comma-separated)" value={formData.medicalHistory.vaccinations} onChange={(e) => handleChange(e, 'medicalHistory')} />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Emergency Contacts</h3>
              {formData.emergencyContacts.map((contact, index) => (
                    <div key={index} className="grid md:grid-cols-3 gap-4 p-4 border rounded-lg">
                    <Input id={`name-${index}`} name="name" label="Full Name" value={contact.name} onChange={(e) => handleChange(e, 'emergencyContacts', index)} required />
                    <Input id={`relationship-${index}`} name="relationship" label="Relationship" value={contact.relationship} onChange={(e) => handleChange(e, 'emergencyContacts', index)} required />
                    <Input id={`phone-${index}`} name="phone" label="Phone" type="tel" value={contact.phone} onChange={(e) => handleChange(e, 'emergencyContacts', index)} required />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4 border-t pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PatientEditModal;