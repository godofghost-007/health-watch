import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { Patient } from '../types';
import Card from './Card';
import Button from './Button';
import { Sparkles, AlertTriangle } from './icons';

// The API key is injected from environment variables.
const API_KEY = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;

interface AIAssistantProps {
  patient: Patient;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ patient }) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSummary = async () => {
    if (!API_KEY) {
      setError("AI features are not available. The API key is not configured.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSummary('');

    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      
      const patientDataString = `
        Patient Name: ${patient.firstName} ${patient.lastName}
        Date of Birth: ${patient.dateOfBirth}
        Gender: ${patient.gender}
        Blood Group: ${patient.bloodGroup}

        Medical History:
        - Allergies: ${patient.medicalHistory.allergies || 'None recorded'}
        - Chronic Conditions: ${patient.medicalHistory.chronicConditions || 'None recorded'}
        - Current Medications: ${patient.medicalHistory.currentMedications || 'None recorded'}
        - Surgeries: ${patient.medicalHistory.surgeries || 'None recorded'}
        - Family History: ${patient.medicalHistory.familyHistory || 'None recorded'}

        Medical Notes:
        ${patient.medicalNotes && patient.medicalNotes.length > 0 ? patient.medicalNotes.map(note => `- ${note.date} (${note.doctorName}): ${note.note}`).join('\n') : 'No notes available.'}

        Prescriptions:
        ${patient.prescriptions && patient.prescriptions.length > 0 ? patient.prescriptions.map(p => `- ${p.date} (${p.doctorName}): ${p.medication} ${p.dosage}, ${p.frequency}`).join('\n') : 'No prescriptions available.'}

        Lab Orders:
        ${patient.labOrders && patient.labOrders.length > 0 ? patient.labOrders.map(o => `- ${o.date} (${o.doctorName}): ${o.testName} (Status: ${o.status})`).join('\n') : 'No lab orders available.'}
      `;

      const prompt = `You are a helpful medical assistant. Based on the following patient data, generate a concise clinical summary for a doctor. Highlight key issues, recent activities, and potential risks. Structure the output clearly with headings (e.g., "Key Issues", "Recent Activity", "Potential Risks").
      
      Patient Data:
      ${patientDataString}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setSummary(response.text);

    } catch (err) {
      console.error("Error generating AI summary:", err);
      setError("An error occurred while generating the summary. Please check the console and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            AI-Powered Clinical Summary
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Get a quick overview of the patient's record using Gemini.
          </p>
        </div>
        <Button onClick={generateSummary} disabled={isLoading} variant="secondary" className="flex-shrink-0">
          {isLoading ? 'Generating...' : 'Generate Summary'}
        </Button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/50 rounded-lg text-sm text-red-800 dark:text-red-200 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          {error}
        </div>
      )}

      {isLoading && (
        <div className="mt-4 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">Generating summary, this may take a moment...</p>
        </div>
      )}

      {summary && (
        <div className="mt-4 border-t dark:border-slate-700 pt-4">
          <h4 className="font-semibold mb-2">Generated Summary:</h4>
          <div className="prose prose-sm dark:prose-invert max-w-none bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap font-sans text-sm">{summary}</pre>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AIAssistant;