export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

export enum BloodGroup {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface MedicalHistory {
  allergies: string;
  chronicConditions: string;
  currentMedications: string;
  surgeries: string;
  familyHistory: string;
  vaccinations: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  address: string;
  bloodGroup: BloodGroup;
  qrCodeUrl: string;
  medicalHistory: MedicalHistory;
  emergencyContacts: EmergencyContact[];
  password?: string;
  medicalNotes?: MedicalNote[];
  prescriptions?: Prescription[];
  labOrders?: LabOrder[];
}

export enum DoctorVerificationStatus {
  PENDING = 'Pending',
  VERIFIED = 'Verified',
  REJECTED = 'Rejected',
}

export interface Doctor {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  experienceYears: number;
  medicalRegNumber: string;
  verificationStatus: DoctorVerificationStatus;
  password?: string;
  registrationDocumentUrl?: string;
}

export interface Admin {
    id: string;
    email: string;
    role: 'ADMIN';
    password?: string;
}

export interface Government {
    id: string;
    agencyName: string;
    email: string;
    role: 'GOVERNMENT';
    password?: string;
}

export interface MedicalNote {
    id: string;
    patient_id: string;
    date: string;
    doctorName: string;
    note: string;
}

export interface Prescription {
    id: string;
    patient_id: string;
    date: string;
    doctorName: string;
    medication: string;
    dosage: string;
    frequency: string;
}

export interface LabOrder {
    id: string;
    patient_id: string;
    date: string;
    doctorName: string;
    testName: string;
    status: 'Ordered' | 'Completed' | 'Pending';
}