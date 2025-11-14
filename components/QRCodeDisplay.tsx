import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
  value: string;
  title: string;
  id?: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ value, title, id }) => {
  return (
    <div className="flex flex-col items-center gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="p-2 bg-white rounded-md">
        <QRCodeSVG value={value} size={128} id={id} />
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">Scan this code for quick access</p>
    </div>
  );
};

export default QRCodeDisplay;