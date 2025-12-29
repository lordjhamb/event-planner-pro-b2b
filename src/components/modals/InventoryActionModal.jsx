import React, { useState, useEffect } from 'react';
import { X, Package, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';

const InventoryActionModal = ({ isOpen, onClose, type, item, onConfirm }) => {
    // type: 'add' | 'check-in' | 'check-out'
    const { events } = useData();
    const [formData, setFormData] = useState({
        name: '',
        category: 'Furniture',
        totalQuantity: '',
        pricePerUnit: '',
        quantity: '',
        eventId: '',
        notes: ''
    });

    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({ ...prev, quantity: '', notes: '', eventId: '' }));
        }
    }, [isOpen, item]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm({ ...formData, itemId: item?.id, type: type === 'check-out' ? 'Check-Out' : 'Check-In' });
        onClose();
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        onConfirm(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-up">
                <div className="bg-white p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-heading font-bold text-xl text-gray-900 flex items-center gap-2">
                        {type === 'add' && <><Package className="text-primary-600" /> Add New Item</>}
                        {type === 'check-out' && <><ArrowRight className="text-orange-500" /> Check Out Item</>}
                        {type === 'check-in' && <><ArrowLeft className="text-green-500" /> Check In Item</>}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {type === 'add' ? (
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Item Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium"
                                    placeholder="e.g. Gold Tiffany Chairs"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                                    <select
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 bg-white font-medium"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="Furniture">Furniture</option>
                                        <option value="Lighting">Lighting</option>
                                        <option value="Sound">Sound</option>
                                        <option value="Decor">Decor</option>
                                        <option value="Tech">Tech</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Total Qty</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 font-medium"
                                        placeholder="0"
                                        value={formData.totalQuantity}
                                        onChange={e => setFormData({ ...formData, totalQuantity: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Price per Unit (₹)</label>
                                <input
                                    type="number"
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 font-medium"
                                    placeholder="0.00"
                                    value={formData.pricePerUnit}
                                    onChange={e => setFormData({ ...formData, pricePerUnit: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary-500/30 transition-all mt-2">
                                Create Inventory Item
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Selected Item</span>
                                <div className="font-bold text-gray-900 text-lg">{item?.name}</div>
                                <div className="text-sm text-gray-500">Available: {item?.availableQuantity} / {item?.totalQuantity}</div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Quantity to {type === 'check-out' ? 'Send' : 'Return'}
                                </label>
                                <input
                                    type="number"
                                    required
                                    max={type === 'check-out' ? item?.availableQuantity : (item?.totalQuantity - item?.availableQuantity)}
                                    min="1"
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 font-medium text-lg"
                                    value={formData.quantity}
                                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                />
                                <div className="text-xs text-gray-500 mt-1 text-right">
                                    Max: {type === 'check-out' ? item?.availableQuantity : (item?.totalQuantity - item?.availableQuantity)}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Event</label>
                                <select
                                    required
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 bg-white font-medium"
                                    value={formData.eventId}
                                    onChange={e => setFormData({ ...formData, eventId: e.target.value })}
                                >
                                    <option value="">Select Event...</option>
                                    {events.filter(e => e.status === 'Active' || e.status === 'Upcoming').map(event => (
                                        <option key={event.id} value={event.id}>{event.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Notes</label>
                                <textarea
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 font-medium h-24 resize-none"
                                    placeholder="e.g. Handed over to Raju driver"
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                className={`w-full font-bold py-3 rounded-xl shadow-lg transition-all mt-2 text-white ${type === 'check-out' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30' : 'bg-green-600 hover:bg-green-700 shadow-green-500/30'}`}
                            >
                                Confirm {type === 'check-out' ? 'Check Out' : 'Check In'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InventoryActionModal;
