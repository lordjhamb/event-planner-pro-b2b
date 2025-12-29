import React, { useState } from 'react';
import { X, DollarSign, Calendar, Tag, CreditCard, FileText } from 'lucide-react';

import { useData } from '../../context/DataContext';

const FinanceTransactionModal = ({ isOpen, onClose, onConfirm, defaultType = 'Expense', eventId = null }) => {
    const { events } = useData();
    const [selectedEventId, setSelectedEventId] = useState(eventId || '');
    const [type, setType] = useState(defaultType); // 'Income' | 'Expense'
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [mode, setMode] = useState('Bank Transfer');
    const [notes, setNotes] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        // If global mode (no eventId prop), require selection
        if (!eventId && !selectedEventId) {
            alert("Please select an event for this transaction.");
            return;
        }

        onConfirm({
            eventId: eventId || selectedEventId,
            type,
            amount: parseFloat(amount),
            category,
            date,
            mode,
            notes,
            status: 'Completed' // Default to completed for now
        });
        onClose();
    };

    const categories = type === 'Expense'
        ? ['Venue', 'Catering', 'Decor', 'Entertainment', 'Logistics', 'Marketing', 'Other']
        : ['Client Payment', 'Sponsorship', 'Refund', 'Other'];

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden transform transition-all scale-100">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-heading font-bold text-gray-900 flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${type === 'Income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            <DollarSign size={18} />
                        </div>
                        {type === 'Income' ? 'Record Payment' : 'Log Expense'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Type Toggle */}
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setType('Expense')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${type === 'Expense' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('Income')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${type === 'Income' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Income
                        </button>
                    </div>

                    {/* Event Selection (Only if not pre-linked) */}
                    {!eventId && (
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Link to Event</label>
                            <select
                                required
                                value={selectedEventId}
                                onChange={(e) => setSelectedEventId(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm font-medium text-gray-700 appearance-none"
                            >
                                <option value="">Select Event...</option>
                                {events.map(ev => (
                                    <option key={ev.id} value={ev.id}>{ev.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Amount */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Amount</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                            <input
                                type="number"
                                required
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-bold text-gray-900"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                            <Tag size={12} /> Category
                        </label>
                        <select
                            required
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm font-medium text-gray-700 appearance-none"
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Date & Mode */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                                <Calendar size={12} /> Date
                            </label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm font-medium text-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                                <CreditCard size={12} /> Mode
                            </label>
                            <select
                                value={mode}
                                onChange={(e) => setMode(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm font-medium text-gray-700 appearance-none"
                            >
                                <option>Cash</option>
                                <option>Bank Transfer</option>
                                <option>UPI</option>
                                <option>Cheque</option>
                                <option>Credit Card</option>
                            </select>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                            <FileText size={12} /> Notes
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm text-gray-700 placeholder:text-gray-400 resize-none"
                            placeholder="Add details about this transaction..."
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`flex-1 py-3 text-white rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${type === 'Income' ? 'bg-green-600 hover:bg-green-700 shadow-green-500/30' : 'bg-red-600 hover:bg-red-700 shadow-red-500/30'}`}
                        >
                            {type === 'Income' ? 'Confirm Payment' : 'Log Expense'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FinanceTransactionModal;
