import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileVideo, FileImage, Loader2, X } from 'lucide-react';
import { extractFramesFromVideo, fileToBase64 } from '../services/videoProcessor';

interface UploadZoneProps {
  onAnalysisStart: () => void;
  onAnalysisComplete: (frames: string[]) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onAnalysisStart, onAnalysisComplete }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setLoading(true);
    onAnalysisStart();
    try {
      let frames: string[] = [];

      if (file.type.startsWith('video/')) {
        setProcessingStatus('Processing video frames...');
        // Extract 3 representative frames for analysis
        frames = await extractFramesFromVideo(file, 3);
      } else if (file.type.startsWith('image/')) {
        setProcessingStatus('Processing image...');
        const base64 = await fileToBase64(file);
        frames = [base64];
      } else {
        alert("Unsupported file type. Please upload an image or video.");
        setLoading(false);
        return;
      }

      setProcessingStatus('Finalizing...');
      onAnalysisComplete(frames);
    } catch (error) {
      console.error(error);
      alert("Error processing file.");
      setLoading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`
        relative w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center
        transition-all duration-300 ease-in-out cursor-pointer overflow-hidden
        ${isDragOver ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-600'}
      `}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onClick={() => !loading && fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*,video/*"
        onChange={handleFileInput}
      />

      {loading ? (
        <div className="flex flex-col items-center animate-pulse">
           <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-4" />
           <p className="text-zinc-400 font-mono text-sm">{processingStatus}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center p-6">
           <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-black/50">
             <Upload className="w-8 h-8 text-zinc-400" />
           </div>
           <h3 className="text-lg font-bold text-white mb-2">Upload Drone Imagery</h3>
           <p className="text-zinc-400 text-sm max-w-sm">
             Drag & drop MP4 video or JPG/PNG images here to begin structural analysis.
           </p>
           <div className="flex gap-4 mt-6 text-xs text-zinc-600 font-mono uppercase tracking-wider">
              <span className="flex items-center gap-1"><FileVideo className="w-3 h-3" /> MP4/MOV</span>
              <span className="flex items-center gap-1"><FileImage className="w-3 h-3" /> JPG/PNG</span>
           </div>
        </div>
      )}
    </div>
  );
};
