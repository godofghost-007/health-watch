import type { Patient, Doctor, Admin, Government } from '../types';
import { DoctorVerificationStatus, Gender, BloodGroup } from '../types';

export let patients: Patient[] = [
    {
        id: 'P001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'patient@test.com',
        dateOfBirth: '1985-05-15',
        gender: Gender.MALE,
        phone: '123-456-7890',
        address: '123 Health St, Wellness City',
        bloodGroup: BloodGroup.O_POSITIVE,
        qrCodeUrl: 'P001',
        password: 'password123',
        medicalHistory: {
            allergies: 'Pollen, Penicillin',
            chronicConditions: 'Hypertension, Asthma',
            currentMedications: 'Lisinopril 10mg, Albuterol Inhaler',
            surgeries: 'Appendectomy (2005)',
            familyHistory: 'Heart disease (Father)',
            vaccinations: 'COVID-19, Flu Shot (2023)',
        },
        emergencyContacts: [{ name: 'Jane Doe', relationship: 'Spouse', phone: '098-765-4321' }],
        medicalNotes: [
            { id: 'N001', patient_id: 'P001', date: '2023-10-26', doctorName: 'Dr. Alice', note: 'Patient presented with seasonal allergy symptoms. Advised to continue current medication.'},
            { id: 'N002', patient_id: 'P001', date: '2024-01-15', doctorName: 'Dr. Alice', note: 'Routine check-up. Blood pressure is well-controlled. Continue Lisinopril.'}
        ],
        prescriptions: [
            { id: 'PR001', patient_id: 'P001', date: '2024-01-15', doctorName: 'Dr. Alice', medication: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' }
        ],
        labOrders: [
            { id: 'L001', patient_id: 'P001', date: '2024-01-15', doctorName: 'Dr. Alice', testName: 'Lipid Panel', status: 'Completed' }
        ]
    },
    {
        id: 'P002',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@test.com',
        dateOfBirth: '1992-11-20',
        gender: Gender.FEMALE,
        phone: '555-123-4567',
        address: '456 Care Ave, Meditown',
        bloodGroup: BloodGroup.A_NEGATIVE,
        qrCodeUrl: 'P002',
        password: 'password123',
        medicalHistory: { allergies: 'None', chronicConditions: 'None', currentMedications: 'None', surgeries: 'None', familyHistory: 'None', vaccinations: 'COVID-19'},
        emergencyContacts: [{ name: 'John Smith', relationship: 'Husband', phone: '555-987-6543' }],
        medicalNotes: [],
        prescriptions: [],
        labOrders: []
    }
];

export let doctors: Doctor[] = [
    {
        id: 'D001',
        fullName: 'Dr. Alice',
        email: 'doctor@test.com',
        phone: '111-222-3333',
        specialization: 'Cardiology',
        experienceYears: 15,
        medicalRegNumber: 'MD-12345',
        verificationStatus: DoctorVerificationStatus.VERIFIED,
        password: 'password123',
    },
    {
        id: 'D002',
        fullName: 'Dr. Bob',
        email: 'bob.pending@test.com',
        phone: '444-555-6666',
        specialization: 'Pediatrics',
        experienceYears: 8,
        medicalRegNumber: 'MD-67890',
        verificationStatus: DoctorVerificationStatus.PENDING,
        password: 'password123',
    },
     {
        id: 'D003',
        fullName: 'Dr. Carol',
        email: 'carol.rejected@test.com',
        phone: '777-888-9999',
        specialization: 'Dermatology',
        experienceYears: 5,
        medicalRegNumber: 'MD-54321',
        verificationStatus: DoctorVerificationStatus.REJECTED,
        password: 'password123',
    }
];

export const admin: Admin = {
    id: 'A001',
    email: 'admin@ihdim5.com',
    role: 'ADMIN',
    password: 'password123'
};

export const government: Government = {
    id: 'G001',
    agencyName: 'Ministry of Health',
    email: 'gov@ihdim5.com',
    role: 'GOVERNMENT',
    password: 'password123'
};
