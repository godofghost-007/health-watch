import React, { useState } from 'react';
import type { Patient } from '../types';
import { View } from '../App';
import { BloodGroup, Gender } from '../types';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { useToast } from '../context/ToastContext';
import { validatePassword, validateEmail } from '../lib/validation';


interface PatientRegistrationProps {
  onRegister: (patient: Omit<Patient, 'id' | 'qrCodeUrl'>) => void;
  setView: (view: View) => void;
}

const PatientRegistration: React.FC<PatientRegistrationProps> = ({ onRegister, setView }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    gender: Gender.MALE,
    phone: '',
    address: '',
    bloodGroup: BloodGroup.A_POSITIVE,
    password: '',
    confirmPassword: '',
    medicalHistory: {
      allergies: '',
      chronicConditions: '',
      currentMedications: '',
      surgeries: '',
      familyHistory: '',
      vaccinations: '',
    },
    emergencyContacts: [
      { name: '', relationship: '', phone: '' },
    ],
  });
  const { toast } = useToast();

  const handleChange = <T,>(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, section?: keyof T, index?: number) => {
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

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    const { confirmPassword, ...patientData } = formData;
    onRegister(patientData);
  };
  
  const renderStep = () => {
      switch(step) {
          case 1:
              return (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4">Step 1: Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input id="firstName" name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} required />
                    <Input id="lastName" name="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} required />
                    <Input id="email" name="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} required />
                    <Input id="dateOfBirth" name="dateOfBirth" label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={handleChange} required />
                     <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                        <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600">
                            {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                    <Input id="phone" name="phone" label="Phone Number" type="tel" value={formData.phone} onChange={handleChange} required />
                    <Input id="address" name="address" label="Address" value={formData.address} onChange={handleChange} required className="md:col-span-2" />
                     <div>
                        <label htmlFor="bloodGroup" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Blood Group</label>
                        <select id="bloodGroup" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600">
                            {Object.values(BloodGroup).map(bg => <option key={bg} value={bg}>{bg}</option>)}
                        </select>
                    </div>
                  </div>
                </div>
              );
          case 2:
              return (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold mb-4">Step 2: Medical History</h3>
                     <Input id="allergies" name="allergies" label="Allergies (comma-separated)" value={formData.medicalHistory.allergies} onChange={(e) => handleChange(e, 'medicalHistory')} />
                     <Input id="chronicConditions" name="chronicConditions" label="Chronic Conditions (comma-separated)" value={formData.medicalHistory.chronicConditions} onChange={(e) => handleChange(e, 'medicalHistory')} />
                     <Input id="currentMedications" name="currentMedications" label="Current Medications (comma-separated)" value={formData.medicalHistory.currentMedications} onChange={(e) => handleChange(e, 'medicalHistory')} />
                     <Input id="surgeries" name="surgeries" label="Past Surgeries (comma-separated)" value={formData.medicalHistory.surgeries} onChange={(e) => handleChange(e, 'medicalHistory')} />
                     <Input id="familyHistory" name="familyHistory" label="Family Medical History (e.g., heart disease)" value={formData.medicalHistory.familyHistory} onChange={(e) => handleChange(e, 'medicalHistory')} />
                     <Input id="vaccinations" name="vaccinations" label="Vaccinations (comma-separated)" value={formData.medicalHistory.vaccinations} onChange={(e) => handleChange(e, 'medicalHistory')} />
                  </div>
              );
          case 3:
              return (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Step 3: Account Security & Emergency Contacts</h3>
                     <div className="grid md:grid-cols-2 gap-4 mb-6 p-4 border rounded-lg">
                        <div>
                            <Input id="password" name="password" label="Password" type="password" value={formData.password} onChange={handleChange} required />
                            <p className="text-xs text-slate-500 mt-1">Min. 8 chars, 1 number, 1 upper, 1 lower.</p>
                        </div>
                        <Input id="confirmPassword" name="confirmPassword" label="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleChange} required />
                    </div>

                    <h4 className="text-lg font-semibold mb-2">Emergency Contact</h4>
                    {formData.emergencyContacts.map((contact, index) => (
                         <div key={index} className="grid md:grid-cols-3 gap-4 p-4 border rounded-lg">
                           <Input id={`name-${index}`} name="name" label="Full Name" value={contact.name} onChange={(e) => handleChange(e, 'emergencyContacts', index)} required />
                           <Input id={`relationship-${index}`} name="relationship" label="Relationship" value={contact.relationship} onChange={(e) => handleChange(e, 'emergencyContacts', index)} required />
                           <Input id={`phone-${index}`} name="phone" label="Phone" type="tel" value={contact.phone} onChange={(e) => handleChange(e, 'emergencyContacts', index)} required />
                        </div>
                    ))}
                  </div>
              );
      }
  }

  return (
    <div className="max-w-4xl mx-auto">
        <Card>
            <h2 className="text-3xl font-bold text-center mb-2">Patient Registration</h2>
            <p className="text-center text-slate-500 dark:text-slate-400 mb-8">Create your secure health profile.</p>

            <form onSubmit={handleSubmit}>
                {renderStep()}
                <div className="mt-8 flex justify-between">
                    {step > 1 ? <Button type="button" variant="secondary" onClick={prevStep}>Back</Button> : <div />}
                    {step < 3 && <Button type="button" onClick={nextStep}>Next</Button>}
                    {step === 3 && <Button type="submit">Complete Registration</Button>}
                </div>
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

export default PatientRegistration;