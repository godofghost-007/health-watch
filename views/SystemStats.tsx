import React, { useMemo } from 'react';
import type { Doctor, Patient } from '../types';
import { DoctorVerificationStatus } from '../types';
import Card from '../components/Card';
import { Users, Stethoscope, ShieldCheck, UserPlus } from '../components/icons';

interface SystemStatsProps {
  patients: Patient[];
  doctors: Doctor[];
}

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
    <Card className="flex items-center p-6">
        <div className={`p-4 rounded-full ${color}`}>
            {icon}
        </div>
        <div className="ml-4">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    </Card>
)

const SystemStats: React.FC<SystemStatsProps> = ({ patients, doctors }) => {
    
    const stats = useMemo(() => {
        const totalPatients = patients.length;
        const totalDoctors = doctors.length;
        const pendingDoctors = doctors.filter(d => d.verificationStatus === DoctorVerificationStatus.PENDING).length;
        const verifiedDoctors = doctors.filter(d => d.verificationStatus === DoctorVerificationStatus.VERIFIED).length;
        return { totalPatients, totalDoctors, pendingDoctors, verifiedDoctors };
    }, [patients, doctors]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">System Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Patients"
                    value={stats.totalPatients}
                    icon={<Users className="w-8 h-8 text-blue-800" />}
                    color="bg-blue-100 dark:bg-blue-900/50"
                />
                 <StatCard 
                    title="Total Doctors"
                    value={stats.totalDoctors}
                    icon={<Stethoscope className="w-8 h-8 text-green-800" />}
                    color="bg-green-100 dark:bg-green-900/50"
                />
                 <StatCard 
                    title="Pending Verifications"
                    value={stats.pendingDoctors}
                    icon={<UserPlus className="w-8 h-8 text-yellow-800" />}
                    color="bg-yellow-100 dark:bg-yellow-900/50"
                />
                 <StatCard 
                    title="Verified Doctors"
                    value={stats.verifiedDoctors}
                    icon={<ShieldCheck className="w-8 h-8 text-indigo-800" />}
                    color="bg-indigo-100 dark:bg-indigo-900/50"
                />
            </div>
        </div>
    );
};

export default SystemStats;
