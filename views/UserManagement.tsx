import React, { useState, useMemo } from 'react';
import type { Patient, Doctor } from '../types';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { Search, FilePenLine, Trash2, X, AlertTriangle } from '../components/icons';
import ConfirmationModal from '../components/ConfirmationModal';

interface UserManagementProps {
  patients: Patient[];
  doctors: Doctor[];
  onUpdateUser: (user: Patient | Doctor) => void;
  onDeleteUser: (userId: string, userType: 'patient' | 'doctor') => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ patients, doctors, onUpdateUser, onDeleteUser }) => {
  const [activeTab, setActiveTab] = useState<'patients' | 'doctors'>('patients');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<Patient | Doctor | null>(null);
  const [userToDelete, setUserToDelete] = useState<{id: string; name: string; type: 'patient' | 'doctor'} | null>(null);


  const filteredPatients = useMemo(() =>
    patients.filter(p =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
    ), [patients, searchTerm]);

  const filteredDoctors = useMemo(() =>
    doctors.filter(d =>
      d.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id.toLowerCase().includes(searchTerm.toLowerCase())
    ), [doctors, searchTerm]);

    const confirmDelete = () => {
      if (userToDelete) {
        onDeleteUser(userToDelete.id, userToDelete.type);
        setUserToDelete(null);
      }
    };
    
    const UserEditModal: React.FC<{user: Patient | Doctor, onClose: () => void, onSave: (user: Patient | Doctor) => void}> = ({user, onClose, onSave}) => {
        const [formData, setFormData] = useState(user);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setFormData(prev => ({...prev, [name]: value}));
        };
        
        const handleSave = () => {
            onSave(formData);
            onClose();
        };

        return (
             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <Card className="w-full max-w-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Edit User</h3>
                        <button onClick={onClose}><X/></button>
                    </div>
                    <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
                        {'firstName' in formData ? ( // Patient form
                            <>
                                <Input id="firstName" label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                                <Input id="lastName" label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                                <Input id="phone" label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                                <Input id="address" label="Address" name="address" value={formData.address} onChange={handleChange} />
                            </>
                        ) : ( // Doctor form
                             <>
                                <Input id="fullName" label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
                                <Input id="email" label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
                                <Input id="phone" label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                                <Input id="specialization" label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} />
                            </>
                        )}
                    </div>
                     <div className="flex justify-end gap-4 mt-6">
                        <Button variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                </Card>
            </div>
        )
    };

  return (
    <>
    {editingUser && <UserEditModal user={editingUser} onClose={() => setEditingUser(null)} onSave={onUpdateUser} />}
    {userToDelete && (
      <ConfirmationModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={confirmDelete}
        title={`Delete ${userToDelete.type}`}
        message={`Are you sure you want to permanently delete the profile for ${userToDelete.name}? This action cannot be undone.`}
      />
    )}
    <Card>
        <h2 className="text-2xl font-bold mb-4">User Management</h2>
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                <Button variant={activeTab === 'patients' ? 'primary' : 'secondary'} onClick={() => setActiveTab('patients')} className={activeTab === 'patients' ? '' : '!bg-transparent shadow-none'}>Patients ({filteredPatients.length})</Button>
                <Button variant={activeTab === 'doctors' ? 'primary' : 'secondary'} onClick={() => setActiveTab('doctors')} className={activeTab === 'doctors' ? '' : '!bg-transparent shadow-none'}>Doctors ({filteredDoctors.length})</Button>
            </div>
            <div className="relative">
                <Input id="search" label="" placeholder="Search by name or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-700 text-xs uppercase">
                    <tr>
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">{activeTab === 'patients' ? 'Phone' : 'Email'}</th>
                        <th className="px-6 py-3">{activeTab === 'patients' ? 'Address' : 'Specialization'}</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {(activeTab === 'patients' ? filteredPatients : filteredDoctors).map(user => (
                        <tr key={user.id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <td className="px-6 py-4 font-mono">{user.id}</td>
                            <td className="px-6 py-4 font-semibold">{'firstName' in user ? `${user.firstName} ${user.lastName}`: user.fullName}</td>
                            <td className="px-6 py-4">{'phone' in user ? user.phone : user.email}</td>
                            <td className="px-6 py-4">{'address' in user ? user.address : user.specialization}</td>
                            <td className="px-6 py-4">
                                <div className="flex justify-end gap-2">
                                    <Button variant="secondary" onClick={() => setEditingUser(user)} className="!p-2 h-8 w-8"><FilePenLine className="w-4 h-4" /></Button>
                                    <Button 
                                      variant="danger" 
                                      onClick={() => setUserToDelete({
                                        id: user.id, 
                                        name: 'firstName' in user ? `${user.firstName} ${user.lastName}`: user.fullName, 
                                        type: activeTab === 'patients' ? 'patient' : 'doctor'
                                      })} 
                                      className="!p-2 h-8 w-8"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
             {((activeTab === 'patients' && filteredPatients.length === 0) || (activeTab === 'doctors' && filteredDoctors.length === 0)) && (
                <div className="text-center py-8 text-slate-500">
                    No {activeTab} found.
                </div>
            )}
        </div>
    </Card>
    </>
  );
};

export default UserManagement;