import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import * as api from '../lib/api';
import type { AnonymizedHealthData } from '../lib/api';
import { Landmark, Users, BarChart3 } from '../components/icons';

const StatCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
    <Card>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
    </Card>
);

const BarChart: React.FC<{ title: string; data: { [key: string]: number } }> = ({ title, data }) => {
    const maxValue = Math.max(...Object.values(data));
    const sortedData = Object.entries(data).sort(([, a], [, b]) => b - a);

    return (
        <Card>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-500" />
                {title}
            </h3>
            <div className="space-y-3">
                {sortedData.map(([label, value]) => (
                    <div key={label} className="grid grid-cols-3 items-center gap-2 text-sm">
                        <span className="truncate font-medium">{label}</span>
                        <div className="col-span-2 bg-slate-200 dark:bg-slate-700 rounded-full h-6">
                            <div
                                className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2 text-white font-bold text-xs"
                                style={{ width: `${(value / maxValue) * 100}%` }}
                                title={String(value)}
                            >
                               {value}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};


const GovernmentDashboard: React.FC = () => {
    const [data, setData] = useState<AnonymizedHealthData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const healthData = await api.getAnonymizedHealthData();
                setData(healthData);
            } catch (error) {
                console.error("Failed to fetch health data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return <div className="text-center p-10">Loading Anonymized Health Statistics...</div>;
    }

    if (!data) {
        return <div className="text-center p-10 text-red-500">Could not load health statistics.</div>;
    }

    return (
        <div className="container mx-auto max-w-7xl">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Landmark className="w-8 h-8"/>
                Public Health Monitoring Portal
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Displaying anonymized, high-level statistics from the I-HDIM5 system.</p>
            
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Population Overview</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Total Population (in system)" value={data.totalPatients} />
                        <StatCard title="Gender: Male" value={data.genderDistribution.Male} />
                        <StatCard title="Gender: Female" value={data.genderDistribution.Female} />
                        <StatCard title="Gender: Other" value={data.genderDistribution.Other} />
                     </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <BarChart title="Age Demographics" data={data.ageDemographics} />
                    <BarChart title="Chronic Conditions Prevalence" data={data.chronicConditions} />
                </div>
                 <div>
                    <h2 className="text-2xl font-bold mb-4">Clinical Data</h2>
                     <Card>
                        <h3 className="text-xl font-semibold mb-4">Blood Group Distribution</h3>
                         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-center">
                            {Object.entries(data.bloodGroupDistribution).map(([group, count]) => (
                                <div key={group} className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
                                    <p className="font-mono text-2xl font-bold text-red-600 dark:text-red-400">{group}</p>
                                    <p className="text-sm font-semibold">{count}</p>
                                </div>
                            ))}
                         </div>
                     </Card>
                </div>
            </div>
        </div>
    );
};

export default GovernmentDashboard;
