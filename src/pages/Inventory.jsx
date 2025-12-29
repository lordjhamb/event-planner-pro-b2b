import React, { useState } from 'react';
import { Package, Plus, Search, Filter, ArrowRight, ArrowLeft, Box, AlertTriangle, Check, X } from 'lucide-react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { useData } from '../context/DataContext';
import InventoryActionModal from '../components/modals/InventoryActionModal';

const Inventory = () => {
    const { inventory, addInventoryItem, logInventoryTransaction, inventoryRequests, events, updateInventoryRequestStatus, tasks } = useData();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add', 'check-in', 'check-out', 'details'
    const [selectedItem, setSelectedItem] = useState(null);

    const categories = ['All', 'Furniture', 'Lighting', 'Sound', 'Decor', 'Tech'];

    // Filtering
    const filteredInventory = inventory.filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Stats
    const totalItems = inventory.length;
    const lowStockItems = inventory.filter(i => (i.availableQuantity / i.totalQuantity) < 0.2).length;
    const totalValue = inventory.reduce((sum, item) => sum + (item.totalQuantity * item.pricePerUnit), 0);

    const handleAction = (type, item) => {
        setModalType(type);
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleModalConfirm = (data) => {
        if (modalType === 'add') {
            addInventoryItem(data);
        } else {
            logInventoryTransaction(data);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-gray-50">
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 pb-24 md:p-6 w-full">
                <div className="max-w-7xl mx-auto space-y-6 animate-fade-in relative z-0">

                    {/* Title & Actions */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-heading font-bold text-gray-900">Inventory Management</h1>
                            <p className="text-gray-500">Track props, equipment, and resources.</p>
                        </div>
                        <button
                            onClick={() => { setModalType('add'); setSelectedItem(null); setIsModalOpen(true); }}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary-500/20 flex items-center gap-2 transition-all"
                        >
                            <Plus size={20} /> Add New Item
                        </button>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <Box size={24} />
                            </div>
                            <div>
                                <div className="text-gray-500 text-sm font-medium">Total SKUs</div>
                                <div className="text-2xl font-bold text-gray-900">{totalItems}</div>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <div className="text-gray-500 text-sm font-medium">Low Stock Alerts</div>
                                <div className="text-2xl font-bold text-gray-900">{lowStockItems}</div>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                <span className="font-bold text-xl">₹</span>
                            </div>
                            <div>
                                <div className="text-gray-500 text-sm font-medium">Total Asset Value</div>
                                <div className="text-2xl font-bold text-gray-900">₹{(totalValue / 100000).toFixed(2)}L</div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 bg-white p-2 rounded-xl border border-gray-200 shadow-sm mobile-scroll-container">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search items..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-primary-500/20 text-sm font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${selectedCategory === cat
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Inventory List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Item Name</th>
                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Category</th>
                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Availability</th>
                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wide text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredInventory.map(item => {
                                        const availabilityPct = (item.availableQuantity / item.totalQuantity) * 100;
                                        return (
                                            <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                                                <td className="p-4 cursor-pointer" onClick={() => handleAction('details', item)}>
                                                    <div className="font-bold text-gray-900 hover:text-primary-600 transition-colors">{item.name}</div>
                                                    <div className="text-xs text-gray-500">₹{item.pricePerUnit}/unit</div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-bold">
                                                        {item.category}
                                                    </span>
                                                </td>
                                                <td className="p-4 w-1/3">
                                                    <div className="flex items-center justify-between mb-1 text-sm">
                                                        <span className={`font-bold ${availabilityPct < 20 ? 'text-red-600' : 'text-green-600'}`}>
                                                            {item.availableQuantity} Available
                                                        </span>
                                                        <span className="text-gray-400 font-medium">Total: {item.totalQuantity}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full transition-all duration-500 ${availabilityPct < 20 ? 'bg-red-500' : 'bg-green-500'}`}
                                                            style={{ width: `${availabilityPct}%` }}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex gap-2 justify-end">
                                                        <button
                                                            onClick={() => handleAction('check-in', item)}
                                                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 font-medium text-xs flex items-center gap-1 transition-colors"
                                                            title="Check In (Return)"
                                                        >
                                                            <ArrowLeft size={16} /> <span className="hidden sm:inline">In</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction('check-out', item)}
                                                            className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 font-medium text-xs flex items-center gap-1 transition-colors"
                                                            title="Check Out (Send)"
                                                        >
                                                            <ArrowRight size={16} /> <span className="hidden sm:inline">Out</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filteredInventory.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="p-12 text-center text-gray-500">
                                                No items found. Add your first item above!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            <InventoryActionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type={modalType}
                item={selectedItem}
                onConfirm={handleModalConfirm}
            />

            {/* Detail Modal */}
            {modalType === 'details' && (
                <InventoryDetailModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    item={selectedItem}
                    requests={inventoryRequests}
                    events={events}
                    tasks={tasks} // [FIX] ID: 1 - Pass tasks for name lookup
                    onApprove={updateInventoryRequestStatus}
                />
            )}
        </div>
    );
};

export default Inventory;

// Simple internal modal for Item Details (MVP style)
const InventoryDetailModal = ({ isOpen, onClose, item, requests, events, tasks, onApprove }) => {
    if (!isOpen || !item) return null;

    const itemRequests = requests.filter(r => r.itemId === item.id);

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                <div className="bg-white border-b border-gray-100 p-6 flex items-center justify-between shrink-0">
                    <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{item.category}</div>
                        <h2 className="text-2xl font-heading font-bold text-gray-900">{item.name}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                        <Box size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-xl text-center">
                            <div className="text-xs text-blue-600 font-bold uppercase mb-1">Total</div>
                            <div className="text-xl font-bold text-blue-900">{item.totalQuantity}</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl text-center">
                            <div className="text-xs text-green-600 font-bold uppercase mb-1">Available</div>
                            <div className="text-xl font-bold text-green-900">{item.availableQuantity}</div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-xl text-center">
                            <div className="text-xs text-orange-600 font-bold uppercase mb-1">Requested</div>
                            <div className="text-xl font-bold text-orange-900">{itemRequests.filter(r => r.status === 'Requested').reduce((sum, r) => sum + r.quantity, 0)}</div>
                        </div>
                    </div>

                    {/* Active Requests Table */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Filter size={18} /> Active Requests
                        </h3>
                        <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-100/50 text-xs font-bold text-gray-500 uppercase">
                                    <tr>
                                        <th className="p-3">Event / Task</th>
                                        <th className="p-3">Qty</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {itemRequests.length > 0 ? itemRequests.map(req => {
                                        // Find Event Name via DataContext helper logic would be better, but quick find here:
                                        const task = tasks?.find(t => t.id === req.taskId || t.id.toString() === req.taskId.toString());
                                        return (
                                            <tr key={req.id}>
                                                <td className="p-3">
                                                    <div className="font-bold text-gray-700">{task ? task.title : `Task #${req.taskId}`}</div>
                                                    {task && <div className="text-[10px] text-gray-400">{task.priority} Priority</div>}
                                                </td>
                                                <td className="p-3 font-mono">{req.quantity}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                        req.status === 'Requested' ? 'bg-orange-100 text-orange-700' :
                                                            req.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                                'bg-gray-100 text-gray-600'
                                                        }`}>{req.status}</span>
                                                </td>
                                                <td className="p-3 text-right">
                                                    {req.status === 'Requested' && (
                                                        <div className="flex gap-2 justify-end">
                                                            <button
                                                                onClick={() => onApprove(req.id, 'Approved')}
                                                                className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                                                title="Approve"
                                                            >
                                                                <Check size={16} /> {/* [FIX] ID: 4 - Tick Icon */}
                                                            </button>
                                                            <button
                                                                onClick={() => onApprove(req.id, 'Rejected')}
                                                                className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                                                title="Reject"
                                                            >
                                                                <X size={16} /> {/* [FIX] ID: 4 - Cross Icon */}
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr><td colSpan="4" className="p-4 text-center text-gray-400 italic">No active requests</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
