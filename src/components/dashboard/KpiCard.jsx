const KpiCard = ({ kpi, onClick }) => {
    const colorClasses = {
        purple: 'bg-indigo-50 text-indigo-900',
        red: 'bg-rose-50 text-rose-900',
        orange: 'bg-amber-50 text-amber-900',
        yellow: 'bg-yellow-50 text-yellow-900',
        green: 'bg-emerald-50 text-emerald-900',
    };

    const iconBgClasses = {
        purple: 'bg-indigo-100/50 text-indigo-600',
        red: 'bg-rose-100/50 text-rose-600',
        orange: 'bg-amber-100/50 text-amber-600',
        yellow: 'bg-yellow-100/50 text-yellow-600',
        green: 'bg-emerald-100/50 text-emerald-600',
    };

    const bgClass = colorClasses[kpi.colorName] || 'bg-white text-gray-900 border border-gray-100';
    const iconBgClass = iconBgClasses[kpi.colorName] || 'bg-gray-100 text-gray-600';

    return (
        <div
            onClick={onClick}
            role="button"
            tabIndex={0}
            className={`
                relative overflow-hidden rounded-xl md:rounded-3xl p-2 md:p-6 text-left transition-all duration-300
                hover:-translate-y-1 hover:shadow-md cursor-pointer
                ${bgClass}
                w-full min-w-0
                min-h-[100px] md:min-h-[160px] flex flex-col justify-between
            `}
        >
            {/* Top Row: Label and Icon */}
            <div className="flex items-start justify-between gap-2 w-full relative z-10">
                <span className="flex-1 text-xs md:text-sm font-semibold tracking-wide opacity-90 leading-tight break-words min-w-0">
                    {kpi.label}
                </span>
                <div className={`p-1.5 md:p-2.5 rounded-full shrink-0 ${iconBgClass}`}>
                    <kpi.icon size={16} className="md:w-5 md:h-5" strokeWidth={2.5} />
                </div>
            </div>

            {/* Bottom Row: Big Value */}
            <div className="relative z-10 mt-2">
                <div className="flex items-baseline gap-1 flex-wrap">
                    <span className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
                        {kpi.value}
                    </span>
                    <span className="text-sm font-medium opacity-70">
                        Tasks
                    </span>
                </div>
            </div>
        </div>
    );
};

export default KpiCard;
