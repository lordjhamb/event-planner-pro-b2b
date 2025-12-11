import React from 'react';

const KpiCard = ({ kpi, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer text-left"
        >
            <div className="flex items-center justify-between mb-2">
                <kpi.icon size={20} className={kpi.color} />
                <span className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</span>
            </div>
            <p className="text-xs text-gray-600">{kpi.label}</p>
        </button>
    );
};

export default KpiCard;
