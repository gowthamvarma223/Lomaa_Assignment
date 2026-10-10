import React from 'react';

export default function DashboardView({ permissionsState, handlePermissionChange, roles }) {
    const sections = [
        {
            title: 'Overview',
            items: ['Home']
        },
        {
            title: 'Operations',
            items: ['Orders', 'Kitchen', 'Coupons']
        },
        {
            title: 'Menu',
            items: ['Categories', 'Items', 'Item Types', 'Item Customization', 'Bulk Import']
        },
        {
            title: 'People',
            items: ['Employees']
        },
        {
            title: 'Setup',
            items: ['Restaurant', 'Locations']
        }
    ];

    return (
        <div className="bg-white shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            <th className="p-4 w-1/3"></th>
                            {roles.map((role, idx) => (
                                <th key={idx} className={`p-4 text-center ${role.headerBg} text-white font-bold border-l border-slate-200 w-1/5`}>
                                    {role.name}
                                </th>
                            ))}
                        </tr>
                        <tr className="bg-slate-100/60 border-b border-slate-200 text-xs text-slate-600 font-medium">
                            <td className="p-3 pl-6"></td>
                            {roles.map((_, idx) => (
                                <td key={idx} className="text-center border-l border-slate-200 p-0 font-semibold w-1/5">
                                    <div className="flex text-[11px] text-slate-500 uppercase tracking-wider h-full">
                                        <div className="w-1/2 bg-[#d0fabe] text-black py-2 flex items-center justify-center">Read</div>
                                        <div className="w-1/2 bg-[#d0fabe] text-black py-2 flex items-center justify-center border-l border-slate-200">Write</div>
                                    </div>
                                </td>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm">
                        {sections.map((sec, sIdx) => (
                            <React.Fragment key={sIdx}>
                                <tr className="bg-slate-200 font-bold text-slate-900">
                                    <td colSpan={roles.length + 1} className="p-3.5 pl-6 ">{sec.title}</td>
                                </tr>
                                {sec.items.map((item, iIdx) => (
                                    <tr key={iIdx} className="hover:bg-slate-50/50 transition  ">
                                        <td className="p-4 pl-10 text-indigo-600 border-b-2 border-t-2 border-l-2 border-slate-900 font-medium hover:underline cursor-pointer truncate">
                                            {item} 
                                        </td>
                                        {roles.map((role, rIdx) => {
                                            const currentPerm = permissionsState[item]?.[role.name] || { read: false, write: false };
                                            return (
                                                <td key={rIdx} className="p-0 text-center border-2 border-slate-900  border-slate-200 align-middle h-12 w-1/5">
                                                    <div className="flex items-center h-full">
                                                        {/* Read Checkbox Cell */}
                                                        <div className="w-1/2 h-full flex items-center justify-center">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={currentPerm.read}
                                                                onChange={(e) => handlePermissionChange(item, role.name, 'read', e.target.checked)}
                                                                className="w-4 h-4 rounded accent-black cursor-pointer" 
                                                                title={`${role.name} Read Permission`}
                                                            />
                                                        </div>

                                                        {/* Full height vertical divider between Read and Write checkboxes */}
                                                        <div className="h-full w-[1px] bg-slate-200"></div>

                                                        {/* Write Checkbox Cell */}
                                                        <div className="w-1/2 h-full flex items-center justify-center">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={currentPerm.write}
                                                                onChange={(e) => handlePermissionChange(item, role.name, 'write', e.target.checked)}
                                                                className="w-4 h-4 rounded accent-black cursor-pointer" 
                                                                title={`${role.name} Write Permission`}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}