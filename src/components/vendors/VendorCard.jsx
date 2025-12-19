import React from 'react';
import { Star, Phone, MapPin, Tag } from 'lucide-react';

const VendorCard = ({ vendor, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-card-hover hover:border-primary-100 transition-all duration-300 cursor-pointer group"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm ${vendor.status === 'Verified' ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-gray-500 to-gray-600'
                        }`}>
                        {vendor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 leading-tight">{vendor.name}</h3>
                        <span className="text-[10px] font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded-md flex items-center gap-1 w-fit mt-1 border border-gray-100">
                            <Tag size={10} />
                            {vendor.category}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                    <Star className="text-yellow-500" size={12} fill="currentColor" />
                    <span className="text-xs font-bold text-gray-900">{vendor.rating}</span>
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone size={14} className="text-gray-400" />
                    <span>{vendor.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="truncate">{vendor.location}</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-50">
                {vendor.services.slice(0, 2).map((service, idx) => (
                    <span key={idx} className="text-[10px] font-medium bg-purple-50 text-purple-700 px-2 py-1 rounded-md border border-purple-100">
                        {service}
                    </span>
                ))}
                {vendor.services.length > 2 && (
                    <span className="text-[10px] font-medium bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-100">
                        +{vendor.services.length - 2} more
                    </span>
                )}
            </div>
        </div>
    );
};

export default VendorCard;
