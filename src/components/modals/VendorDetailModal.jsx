import React from 'react';
import { X, Star, Phone, Mail, MapPin, Tag, FileText, CheckCircle } from 'lucide-react';

const VendorDetailModal = ({ vendor, onClose }) => {
    if (!vendor) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl" style={{ maxHeight: '75vh', display: 'flex', flexDirection: 'column' }}>
                {/* Fixed Header */}
                <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl" style={{ flexShrink: 0 }}>
                    <h2 className="text-lg font-bold">Vendor Details</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-4 space-y-4" style={{ overflowY: 'auto', flex: 1 }}>
                    <div className="flex items-center gap-4">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl ${vendor.status === 'Verified' ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-gray-500 to-gray-600'
                            }`}>
                            {vendor.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{vendor.name}</h3>
                                {vendor.status === 'Verified' && (
                                    <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                        <CheckCircle size={12} /> Verified
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <Tag size={14} className="text-gray-400" />
                                <span className="text-sm text-gray-600">{vendor.category}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="text-yellow-500" size={16} fill="currentColor" />
                                <span className="font-semibold text-gray-900">{vendor.rating}</span>
                                <span className="text-sm text-gray-600">({vendor.reviews} reviews)</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                            <div className="text-sm text-gray-600 mb-1">Pricing Range</div>
                            <div className="text-sm font-semibold text-gray-900">{vendor.pricing}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600 mb-1">Availability</div>
                            <div className="text-sm font-semibold text-green-600">Available for next 30 days</div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">Services Offered</h4>
                        <div className="flex flex-wrap gap-2">
                            {vendor.services.map((service, idx) => (
                                <span key={idx} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm border border-purple-100">
                                    {service}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">Contact Information</h4>
                        <div className="space-y-3 bg-white border border-gray-100 rounded-lg p-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Phone size={16} className="text-gray-400" />
                                <a href={`tel:${vendor.phone}`} className="text-indigo-600 hover:text-indigo-700 font-medium">
                                    {vendor.phone}
                                </a>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Mail size={16} className="text-gray-400" />
                                <a href={`mailto:${vendor.email}`} className="text-indigo-600 hover:text-indigo-700 font-medium">
                                    {vendor.email}
                                </a>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <MapPin size={16} className="text-gray-400" />
                                <span className="text-gray-600">{vendor.location}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">Documents</h4>
                        <div className="space-y-2">
                            {['Portfolio PDF', 'Rate Card 2024', 'Contract Template'].map((doc, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors">
                                    <div className="flex items-center gap-3">
                                        <FileText size={18} className="text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700">{doc}</span>
                                    </div>
                                    <span className="text-xs text-indigo-600 font-medium">Download</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-2">
                        <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                            Contact Vendor
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorDetailModal;
