import React from 'react';
import { Star, Phone, MapPin, Tag } from 'lucide-react';

const VendorCard = ({ vendor, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${vendor.status === 'Verified' ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-gray-500 to-gray-600'
                        }`}>
                        {vendor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1 w-fit mt-1">
                            <Tag size={10} />
                            {vendor.category}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                    <Star className="text-yellow-500" size={14} fill="currentColor" />
                    <span className="text-sm font-semibold text-gray-900">{vendor.rating}</span>
                </div>
            </div>

            <div className="space-y-2 text-sm mb-3">
                <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={14} />
                    <span>{vendor.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={14} />
                    <span className="truncate">{vendor.location}</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-1">
                {vendor.services.slice(0, 2).map((service, idx) => (
                    <span key={idx} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                        {service}
                    </span>
                ))}
                {vendor.services.length > 2 && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        +{vendor.services.length - 2} more
                    </span>
                )}
            </div>
        </div>
    );
};

export default VendorCard;
