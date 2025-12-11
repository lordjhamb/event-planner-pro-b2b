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
        <div className="space-y-4 pb-20 lg:pb-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Vendor Directory</h2>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700">
                    <Plus size={16} />Add Vendor
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search vendors by name or service..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                        <Filter size={20} className="text-gray-400" />
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${categoryFilter === cat
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {cat === 'all' ? 'All Categories' : cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVendors.map(vendor => (
                    <VendorCard key={vendor.id} vendor={vendor} onClick={() => onSelectVendor(vendor)} />
                ))}
            </div>

            {filteredVendors.length === 0 && (
                <div className="text-center py-10">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                        <Search size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No vendors found</h3>
                    <p className="text-gray-600">Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
};

export default Vendors;
