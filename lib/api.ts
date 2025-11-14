// Fix: Imported MedicalHistory type to resolve reference error.
import type { Patient, Doctor, Admin, Government, MedicalNote, Prescription, LabOrder, MedicalHistory } from '../types';
import { DoctorVerificationStatus, Gender, BloodGroup } from '../types';
import { patients, doctors, admin, government } from './mockData';


// --- MOCK IN-MEMORY DATABASE ---
// Data is now imported from mockData.ts

const deepCopy = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

// --- Auth APIs ---

export const login = async (email: string, password: string): Promise<Patient | Doctor | Admin | Government> => {
    const allUsers = [...patients, ...doctors, admin, government];
    const user = allUsers.find(u => u.email === email);
    if (user && user.password === password) {
        return Promise.resolve(deepCopy(user));
    }
    throw new Error('Invalid email or password.');
};

export const logout = async (): Promise<void> => {
    // No-op for mock API
    return Promise.resolve();
};

export const registerPatient = async (patientData: Omit<Patient, 'id' | 'qrCodeUrl'>): Promise<void> => {
    const patientId = `P${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    const newPatient: Patient = {
        id: patientId,
        qrCodeUrl: patientId,
        ...patientData,
        medicalNotes: [],
        prescriptions: [],
        labOrders: [],
    };
    patients.push(newPatient);
    return Promise.resolve();
};

export const registerDoctor = async (doctorData: Omit<Doctor, 'id' | 'verificationStatus'>): Promise<void> => {
    const doctorId = `D${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    const newDoctor: Doctor = {
        id: doctorId,
        verificationStatus: DoctorVerificationStatus.PENDING,
        ...doctorData,
    };
    doctors.push(newDoctor);
    return Promise.resolve();
};

export const getUserProfile = async (userId: string): Promise<Patient | Doctor | Admin | Government | null> => {
    const allUsers = [...patients, ...doctors, admin, government];
    const user = allUsers.find(u => u.id === userId);
    return Promise.resolve(user ? deepCopy(user) : null);
}

// --- Data Fetching APIs ---

export const getAllPatients = async (): Promise<Patient[]> => {
    return Promise.resolve(deepCopy(patients));
};

export const getAllDoctors = async (): Promise<Doctor[]> => {
    return Promise.resolve(deepCopy(doctors));
};

export const getPatientById = async (patientId: string): Promise<Patient | null> => {
    const patient = patients.find(p => p.id === patientId);
    return Promise.resolve(patient ? deepCopy(patient) : null);
};

// --- Data Mutation APIs ---

export const updateDoctorStatus = async (doctorId: string, status: DoctorVerificationStatus): Promise<Doctor | null> => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
        doctor.verificationStatus = status;
        return Promise.resolve(deepCopy(doctor));
    }
    return Promise.resolve(null);
};

export const updateUser = async (updatedUser: Patient | Doctor): Promise<Patient | Doctor> => {
     if ('qrCodeUrl' in updatedUser) { // Patient
        const index = patients.findIndex(p => p.id === updatedUser.id);
        if (index > -1) {
            patients[index] = { ...patients[index], ...updatedUser };
            return Promise.resolve(deepCopy(patients[index]));
        }
    } else { // Doctor
        const index = doctors.findIndex(d => d.id === updatedUser.id);
         if (index > -1) {
            doctors[index] = { ...doctors[index], ...updatedUser };
            return Promise.resolve(deepCopy(doctors[index]));
        }
    }
    throw new Error("User not found for update");
};

export const deleteUser = async (userId: string, userType: 'patient' | 'doctor'): Promise<void> => {
    if (userType === 'patient') {
        const index = patients.findIndex(p => p.id === userId);
        if (index > -1) {
            patients.splice(index, 1);
        }
    } else {
        const index = doctors.findIndex(d => d.id === userId);
        if (index > -1) {
            doctors.splice(index, 1);
        }
    }
    return Promise.resolve();
};

// --- Medical Record APIs ---

export const addMedicalNote = async (patientId: string, noteData: Omit<MedicalNote, 'id' | 'patient_id'>): Promise<Patient> => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) throw new Error("Patient not found");
    
    if (!patient.medicalNotes) patient.medicalNotes = [];
    const newNote: MedicalNote = {
        id: `N${Date.now()}`,
        patient_id: patientId,
        ...noteData,
    };
    patient.medicalNotes.push(newNote);
    return Promise.resolve(deepCopy(patient));
};

export const addPrescription = async (patientId: string, presData: Omit<Prescription, 'id' | 'patient_id'>): Promise<Patient> => {
     const patient = patients.find(p => p.id === patientId);
    if (!patient) throw new Error("Patient not found");
    
    if (!patient.prescriptions) patient.prescriptions = [];
    const newPrescription: Prescription = {
        id: `PR${Date.now()}`,
        patient_id: patientId,
        ...presData,
    };
    patient.prescriptions.push(newPrescription);
    return Promise.resolve(deepCopy(patient));
};

export const addLabOrder = async (patientId: string, orderData: Omit<LabOrder, 'id' | 'patient_id'>): Promise<Patient> => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) throw new Error("Patient not found");
    
    if (!patient.labOrders) patient.labOrders = [];
    const newOrder: LabOrder = {
        id: `L${Date.now()}`,
        patient_id: patientId,
        ...orderData,
    };
    patient.labOrders.push(newOrder);
    return Promise.resolve(deepCopy(patient));
};


// --- Government Data API ---

export interface AnonymizedHealthData {
    totalPatients: number;
    genderDistribution: { [key in Gender]: number };
    ageDemographics: { [range: string]: number };
    chronicConditions: { [condition: string]: number };
    bloodGroupDistribution: { [key in BloodGroup]: number };
}

const getAge = (dateString: string) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export const getAnonymizedHealthData = async (): Promise<AnonymizedHealthData> => {
    const data: AnonymizedHealthData = {
        totalPatients: patients.length,
        genderDistribution: { Male: 0, Female: 0, Other: 0 },
        ageDemographics: { '0-17': 0, '18-35': 0, '36-55': 0, '56+': 0 },
        chronicConditions: {},
        bloodGroupDistribution: { 'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'AB+': 0, 'AB-': 0, 'O+': 0, 'O-': 0, }
    };

    patients.forEach(p => {
        // Gender
        data.genderDistribution[p.gender as Gender]++;
        
        // Blood Group
        data.bloodGroupDistribution[p.bloodGroup as BloodGroup]++;

        // Age
        const age = getAge(p.dateOfBirth);
        if (age <= 17) data.ageDemographics['0-17']++;
        else if (age <= 35) data.ageDemographics['18-35']++;
        else if (age <= 55) data.ageDemographics['36-55']++;
        else data.ageDemographics['56+']++;

        // Conditions
        const history = p.medicalHistory as MedicalHistory;
        if (history && history.chronicConditions) {
            const conditions = history.chronicConditions.split(',').map(c => c.trim().toLowerCase());
            conditions.forEach(condition => {
                if (condition) {
                    // Capitalize first letter for display
                    const capitalizedCondition = condition.charAt(0).toUpperCase() + condition.slice(1);
                    data.chronicConditions[capitalizedCondition] = (data.chronicConditions[capitalizedCondition] || 0) + 1;
                }
            });
        }
    });

    return Promise.resolve(data);
};