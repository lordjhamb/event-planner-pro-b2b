import React, { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import VendorCard from '../components/vendors/VendorCard';

const Vendors = ({ onSelectVendor }) => {
    const { permissions } = useAuth();
    const { vendors } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const categories = ['all', ...new Set(vendors.map(v => v.category))];

    const filteredVendors = vendors.filter(v =>
        (categoryFilter === 'all' || v.category === categoryFilter) &&
        (v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.services.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    return (
        <div className="space-y-6 pb-20 lg:pb-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-heading font-bold text-gray-900">Vendor Directory</h2>
                    <p className="text-gray-500">Find and manage your event partners</p>
                </div>
                <button className="bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5">
                    <Plus size={18} /> Add Vendor
                </button>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search vendors by name or service..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none shadow-sm transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 shrink-0">
                            <Filter size={20} className="text-gray-400" />
                        </div>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${categoryFilter === cat
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {cat === 'all' ? 'All' : cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVendors.map(vendor => (
                    <VendorCard key={vendor.id} vendor={vendor} onClick={() => onSelectVendor(vendor)} />
                ))}
            </div>

            {filteredVendors.length === 0 && (
                <div className="text-center py-16">
                    <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 border border-gray-100">
                        <Search size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">No vendors found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
                </div>
            )}
        </div>
    );
};

export default Vendors;
