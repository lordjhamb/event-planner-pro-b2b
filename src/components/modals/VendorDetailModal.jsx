import React from 'react';
import { X, MapPin, Phone, Star, Tag, ExternalLink, Mail, FileText, Calendar, CheckSquare } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { createWhatsAppLink } from '../../utils/whatsapp';

const VendorDetailModal = ({ vendor, onClose }) => {
    const { tasks, events } = useData();

    if (!vendor) return null;

    // Filter tasks for this vendor
    const vendorTasks = tasks.filter(t => t.vendorId === vendor.id);

    // Get unique related events
    const vendorEventIds = [...new Set(vendorTasks.map(t => t.eventId))];
    const vendorEvents = events.filter(e => vendorEventIds.includes(e.id));

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                {/* Header */}
                <div className="relative h-32 bg-gradient-to-r from-gray-800 to-gray-900 shrink-0">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors z-10">
                        <X size={24} />
                    </button>
                    <div className="absolute bottom-4 left-6 text-white">
                        <h2 className="text-2xl font-bold font-heading">{vendor.name}</h2>
                        <div className="flex items-center gap-2 text-gray-300 text-sm mt-1">
                            <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded backdrop-blur-sm">
                                <Star size={12} className="text-yellow-400" fill="currentColor" /> {vendor.rating}
                            </span>
                            <span>•</span>
                            <span>{vendor.category}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                    <div>
                        <h4 className="font-semibold mb-2 text-gray-900">Services Offered</h4>
                        <div className="flex flex-wrap gap-2">
                            {vendor.services.map((service, idx) => (
                                <span key={idx} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm border border-purple-100 font-medium">
                                    {service}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Active Projects Section */}
                    {vendorEvents.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-3 text-gray-900 flex items-center gap-2">
                                <Calendar size={16} className="text-primary-600" />
                                Active Projects
                            </h4>
                            <div className="space-y-4">
                                {vendorEvents.map(event => (
                                    <div key={event.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-bold text-gray-900 text-sm">{event.name}</span>
                                            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-100">{event.dates}</span>
                                        </div>
                                        <div className="space-y-2">
                                            {vendorTasks.filter(t => t.eventId === event.id).map(task => (
                                                <div key={task.id} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm">
                                                    <div className="flex items-center gap-2">
                                                        <CheckSquare size={12} className="text-gray-400" />
                                                        <span className="font-medium text-gray-700">{task.title}</span>
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${task.status === 'Approved' ? 'bg-green-50 text-green-700' :
                                                        task.status === 'Submitted' ? 'bg-blue-50 text-blue-700' :
                                                            'bg-yellow-50 text-yellow-700'
                                                        }`}>
                                                        {task.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h4 className="font-semibold mb-2 text-gray-900">Contact Information</h4>
                        <div className="space-y-3 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center gap-3 text-sm flex-1">
                                <Phone size={16} className="text-gray-400" />
                                <div className="flex items-center gap-2">
                                    <a href={`tel:${vendor.phone}`} className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
                                        {vendor.phone}
                                    </a>
                                    <span className="text-gray-300">|</span>
                                    <a
                                        href={createWhatsAppLink(vendor.phone, `Hi ${vendor.name}, we are interested in your services for an upcoming event.`)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 font-bold hover:underline text-xs flex items-center gap-1"
                                    >
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-3 h-3" />
                                        WhatsApp
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Mail size={16} className="text-gray-400" />
                                <a href={`mailto:${vendor.email}`} className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
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
                        <h4 className="font-semibold mb-2 text-gray-900">Documents</h4>
                        <div className="space-y-2">
                            {['Portfolio PDF', 'Rate Card 2024', 'Contract Template'].map((doc, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <FileText size={18} className="text-gray-400 group-hover:text-gray-600" />
                                        <span className="text-sm font-medium text-gray-700">{doc}</span>
                                    </div>
                                    <span className="text-xs text-indigo-600 font-medium group-hover:text-indigo-700">Download</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-2 grid grid-cols-2 gap-3">
                        <button className="w-full bg-white border border-indigo-200 text-indigo-700 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
                            Contact Vendor
                        </button>
                        <a
                            href={createWhatsAppLink(vendor.phone, `Hi ${vendor.name}, inquiry from EventFlow.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2"
                        >
                            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-5 h-5 brightness-0 invert" />
                            Chat on WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorDetailModal;
