import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

export default function CaptureModal({ isOpen, onClose, showToast }) {
    const [issue, setIssue] = useState('');
    const [description, setDescription] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);

    if (!isOpen) return null;

    const handleTakeScreenshot = async () => {
        if (showToast) showToast('Capturing screenshot...');
        onClose();
        try {
            const container = document.getElementById('app-container') || document.body;
            const canvas = await html2canvas(container, { scale: 0.8 });
            canvas.toBlob(async (blob) => {
                if (showToast) showToast('Screenshot captured successfully!');

                const formData = new FormData();
                formData.append('media', blob, `screenshot-${Date.now()}.png`);
                await fetch('http://localhost:3000/api/upload', { method: 'POST', body: formData });
            }, 'image/png');
        } catch (err) {
            console.error(err);
            if (showToast) showToast('Failed to capture screenshot.');
        }
    };

    const handleToggleRecording = async () => {
        if (!isRecording) {
            onClose();
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({ video: { mediaSource: 'screen' }, audio: true });
                recordedChunksRef.current = [];
                const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });

                recorder.ondataavailable = (e) => {
                    if (e.data.size > 0) recordedChunksRef.current.push(e.data);
                };

                recorder.onstop = async () => {
                    const blob = new Blob(recordedChunksRef.current, { type: 'video/mp4' });
                    if (showToast) showToast('Screen recording completed and saved!');

                    const formData = new FormData();
                    formData.append('media', blob, `recording-${Date.now()}.mp4`);
                    await fetch('http://localhost:3000/api/upload', { method: 'POST', body: formData });
                };

                recorder.start();
                mediaRecorderRef.current = recorder;
                setIsRecording(true);
                if (showToast) showToast('Screen recording started (max 10s)...');

                setTimeout(() => {
                    if (recorder.state === 'recording') {
                        recorder.stop();
                        stream.getTracks().forEach(t => t.stop());
                        setIsRecording(false);
                    }
                }, 10000);

            } catch (err) {
                console.error(err);
                if (showToast) showToast('Screen recording permission denied.');
            }
        } else {
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
                mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
            }
            setIsRecording(false);
        }
    };

    const handleSubmitIssue = async () => {
        if (!issue.trim() && !description.trim()) {
            if (showToast) showToast('Please enter an issue summary or description.');
            return;
        }

        const formattedNote = `Issue: ${issue || 'N/A'} | Description: ${description || 'N/A'}`;

        try {
            const response = await fetch('http://localhost:3000/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ note: formattedNote })
            });
            const data = await response.json();
            if (data.success) {
                if (showToast) showToast('Issue saved to server notes.txt successfully!');
                onClose();
                setIssue('');
                setDescription('');
            } else {
                if (showToast) showToast('Error saving issue.');
            }
        } catch (err) {
            console.error(err);
            if (showToast) showToast('Server connection error.');
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Capture this page</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Save a screenshot, record your screen, or report an issue.</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 rounded-lg transition">
                        <i className="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Issue</label>
                        <input 
                            type="text" 
                            value={issue}
                            onChange={(e) => setIssue(e.target.value)}
                            placeholder="Short summary of the issue" 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Description</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3" 
                            placeholder="Describe what happened, steps to reproduce, etc." 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
                        ></textarea>
                    </div>

                    <div className="space-y-3 pt-2">
                        <button 
                            onClick={handleSubmitIssue}
                            className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-medium py-3 rounded-lg text-sm shadow-sm transition flex items-center justify-center space-x-2"
                        >
                            <i className="fa-solid fa-floppy-disk"></i>
                            <span>Save Issue + Description</span>
                        </button>

                        <button 
                            onClick={handleTakeScreenshot}
                            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium py-3 rounded-lg text-sm shadow-sm transition flex items-center justify-center space-x-2"
                        >
                            <i className="fa-solid fa-camera"></i>
                            <span>Take Screenshot</span>
                        </button>
                        <button 
                            onClick={handleToggleRecording}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 rounded-lg text-sm shadow-sm transition flex items-center justify-center space-x-2"
                        >
                            <i className="fa-solid fa-circle-dot"></i>
                            <span>Start Recording (max 10s)</span>
                        </button>


                        <button 
                            onClick={onClose}
                            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 rounded-lg text-sm transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}