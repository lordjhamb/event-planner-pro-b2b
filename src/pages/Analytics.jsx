import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Calendar } from 'lucide-react';

const Analytics = () => {
    return (
        <div className="space-y-6 pb-20 lg:pb-4">
            <h2 className="text-xl font-bold">Analytics & Reports</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <DollarSign size={20} />
                        </div>
                        <span className="text-green-600 text-sm font-medium">+12.5%</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">₹45.2L</div>
                    <p className="text-xs text-gray-600">Total Revenue (YTD)</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                            <Calendar size={20} />
                        </div>
                        <span className="text-green-600 text-sm font-medium">+4</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">28</div>
                    <p className="text-xs text-gray-600">Events Completed</p>
                </div>
                {/* ... more stat cards could be added */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="font-bold flex items-center gap-2 mb-6">
                        <TrendingUp size={20} className="text-indigo-600" />
                        Revenue Growth
                    </h3>
                    <div className="h-64 flex items-end justify-between px-2 gap-2">
                        {[40, 65, 45, 80, 55, 90].map((h, i) => (
                            <div key={i} className="w-full bg-indigo-50 rounded-t-lg relative group">
                                <div
                                    className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg transition-all duration-300 group-hover:bg-indigo-600"
                                    style={{ height: `${h}%` }}
                                />
                                <div className="absolute -bottom-6 w-full text-center text-xs text-gray-500">
                                    {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="font-bold flex items-center gap-2 mb-6">
                        <BarChart3 size={20} className="text-purple-600" />
                        Budget vs Actuals
                    </h3>
                    <div className="space-y-4">
                        {['Sharma Wedding', 'Tech Summit', 'Diwali Gala'].map((event, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">{event}</span>
                                    <span className="text-gray-500">85%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-purple-500 rounded-full"
                                        style={{ width: '85%' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
