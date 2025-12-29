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
                relative overflow-hidden rounded-[2rem] p-6 text-left transition-all duration-300
                hover:-translate-y-1 hover:shadow-lg cursor-pointer
                ${bgClass}
                w-full min-w-0
                min-h-[150px] flex flex-col justify-end
            `}
        >
            {/* Cut-out / Tab Icon */}
            <div className={`absolute top-0 right-0 w-16 h-16 flex items-center justify-center rounded-bl-[2rem] ${iconBgClass}`}>
                <kpi.icon size={24} strokeWidth={2} />
            </div>

            {/* Label Positioned Top Left */}
            <div className="absolute top-6 left-6 max-w-[calc(100%-4rem)]">
                <span className="text-sm font-bold tracking-wide opacity-90 leading-tight block">
                    {kpi.label}
                </span>
            </div>

            {/* Value positioned Bottom */}
            <div className="relative z-10 mt-8">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-4xl md:text-5xl font-heading font-bold tracking-tighter">
                        {kpi.value}
                    </span>
                    <span className="text-sm font-bold opacity-70 mb-1">
                        {kpi.unit || 'Tasks'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default KpiCard;
