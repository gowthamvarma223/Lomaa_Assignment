import React, { useState } from 'react';
import DashboardView from './DashboardView.jsx';
import FloatingButton from './FloatingButton.jsx';
import CaptureModal from './CaptureModal.jsx';

export default function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);

    // Dynamic roles array: easily add, remove, or modify roles here!
    const roles = [
        { name: 'Owner', headerBg: 'bg-[#3c6c77]' },
        { name: 'Manager', headerBg: 'bg-[#b87333]' },
        { name: 'Asst. Manager', headerBg: 'bg-[#950663]' },
        { name: 'Chef', headerBg: 'bg-[#2980b9]' },
        { name: 'Staff', headerBg: 'bg-[#d87093]' }
    ];

    // State to store Read/Write permissions for each module and role
    const [permissionsState, setPermissionsState] = useState(() => {
        const initial = {};
        const modules = ['Home', 'Orders', 'Kitchen', 'Coupons', 'Categories', 'Items', 'Item Types', 'Item Customization', 'Bulk Import', 'Employees', 'Restaurant', 'Locations'];
        modules.forEach(mod => {
            initial[mod] = {};
            roles.forEach((role, rIdx) => {
                initial[mod][role.name] = {
                    read: rIdx === 0 || rIdx % 2 === 0,
                    write: rIdx === 0 && mod.length % 2 === 0
                };
            });
        });
        return initial;
    });

    const handlePermissionChange = (moduleName, roleName, type, value) => {
        setPermissionsState(prev => ({
            ...prev,
            [moduleName]: {
                ...prev[moduleName],
                [roleName]: {
                    ...prev[moduleName][roleName],
                    [type]: value
                }
            }
        }));
    };

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const handleSaveChanges = async () => {
        console.log("Saving permissions data:", permissionsState); // Keeps console.log intact
  
         try {
            const response = await fetch('http://localhost:3000/api/permissions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(permissionsState),
            });

            const data = await response.json();
            if (data.success) {
            setToastMessage("Permissions saved successfully to uploads/permissions.txt!");
            } else {
            alert("Failed to save permissions.");
            }
        } catch (error) {
            console.error("Error connecting to server:", error);
            alert("Error connecting to server. Is backend running on port 3000?");
        }
        };

    return (
        <div id="app-container" className="min-h-screen bg-slate-100 text-slate-800 relative font-sans selection:bg-indigo-500 selection:text-white pb-20">
            {/* Top Navigation & Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-3">
                    <div className="bg-slate-900 text-white p-2 rounded-lg font-bold">
                        <i className="fa-solid fa-shield-halved"></i>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Employee Permissions</h1>
                        <p className="text-xs text-slate-500">Toggle Read / Write access for every role, then save to apply the changes.</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    
                    <button 
                        onClick={handleSaveChanges} 
                        className="bg-slate-700 hover:bg-slate-800 text-white font-medium px-5 py-2 rounded-lg text-sm shadow transition flex items-center space-x-2"
                    >
                        <i className="fa-solid fa-floppy-disk"></i>
                        <span>Save Changes</span>
                    </button>
                </div>
            </header>

            {/* Main Employee Permission Dashboard matching reference image */}
            <main className="max-w-7xl mx-auto p-6">
                <DashboardView 
                    permissionsState={permissionsState} 
                    handlePermissionChange={handlePermissionChange} 
                    roles={roles} 
                />
            </main>

            {/* Draggable Floating Button */}
            <FloatingButton onClick={() => setIsModalOpen(true)} />

            {/* Capture & Issue Report Modal */}
            <CaptureModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                showToast={showToast} 
            />


            {/* Toast Notification Banner */}
            {toastMessage && (
                <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 animate-bounce">
                    <i className="fa-solid fa-circle-check text-emerald-400 text-lg"></i>
                    <span className="text-sm font-medium">{toastMessage}</span>
                </div>
            )}
        </div>
    );
}