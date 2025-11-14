import React, { useState, useRef, useEffect } from 'react';
import { X } from './icons';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

// Add type definition for the experimental BarcodeDetector API
interface BarcodeDetector {
    new(options?: { formats: string[] }): BarcodeDetector;
    detect(image: ImageBitmapSource): Promise<Array<{ rawValue: string }>>;
}
declare global {
    interface Window {
        BarcodeDetector: BarcodeDetector;
    }
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrameId: number | null = null;

    const setupScanner = async () => {
      if (!('BarcodeDetector' in window)) {
        setError('QR code scanning is not supported by this browser.');
        return;
      }
      
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        } else {
            throw new Error("Video element not found");
        }

        const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
        
        const detectCode = async () => {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          
          if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d')?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            
            try {
              const barcodes = await barcodeDetector.detect(canvas);
              if (barcodes.length > 0) {
                onScan(barcodes[0].rawValue);
                return; // Stop scanning
              }
            } catch (e) {
              console.error("Barcode detection failed:", e);
            }
          }
          animationFrameId = requestAnimationFrame(detectCode);
        };
        detectCode();

      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access the camera. Please ensure you have granted permission.");
      }
    };

    setupScanner();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
            <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-center mb-4">Scan Patient QR Code</h2>
        <div className="bg-slate-900 rounded-md overflow-hidden aspect-square flex items-center justify-center relative">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-4 border-dashed border-white/50 rounded-lg animate-pulse"></div>
            </div>
        </div>
        <div className="text-center mt-4 h-6">
            {error ? (
                 <p className="text-red-500 text-sm">{error}</p>
            ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Point the camera at the QR code...
                </p>
            )}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;