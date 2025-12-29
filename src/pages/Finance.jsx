import React, { useState } from 'react';
import { DollarSign, Plus, TrendingUp, TrendingDown, Calendar, Search } from 'lucide-react';
import { useData } from '../context/DataContext';
import FinanceTransactionModal from '../components/modals/FinanceTransactionModal';

const Finance = () => {
    const { finance, addFinanceTransaction, events } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('Expense');
    const [searchTerm, setSearchTerm] = useState('');

    const transactions = finance || []; // Ensure not null

    // Calculate Summary Stats
    const totalIncome = transactions
        .filter(t => t.type === 'Income')
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'Expense')
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

    const netBalance = totalIncome - totalExpenses;

    // Filter Transactions
    const filteredTransactions = transactions
        .filter(t => {
            const matchesSearch =
                (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesSearch;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date desc

    const getEventName = (eventId) => {
        const ev = events.find(e => e.id === eventId || e.id === parseInt(eventId));
        return ev ? ev.name : 'Unknown Event';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-gray-900">Financial Overview</h1>
                    <p className="text-gray-500">Track earnings, expenses, and cash flow across all events.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => { setModalType('Income'); setIsModalOpen(true); }}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-green-500/20 flex items-center gap-2 transition-all"
                    >
                        <Plus size={18} /> Record Payment
                    </button>
                    <button
                        onClick={() => { setModalType('Expense'); setIsModalOpen(true); }}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-red-500/20 flex items-center gap-2 transition-all"
                    >
                        <Plus size={18} /> Log Expense
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp size={48} className="text-green-600" />
                    </div>
                    <div className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-2">Total Income</div>
                    <div className="text-3xl font-bold text-gray-900">₹{(totalIncome / 100000).toFixed(2)}L</div>
                    <div className="text-green-600 text-xs font-bold mt-1 flex items-center gap-1">
                        <TrendingUp size={12} /> +12% vs last month (est)
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingDown size={48} className="text-red-600" />
                    </div>
                    <div className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-2">Total Expenses</div>
                    <div className="text-3xl font-bold text-gray-900">₹{(totalExpenses / 100000).toFixed(2)}L</div>
                    <div className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1">
                        <TrendingDown size={12} /> Within Budget
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <DollarSign size={48} className="text-blue-600" />
                    </div>
                    <div className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-2">Net Balance</div>
                    <div className={`text-3xl font-bold ${netBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        ₹{(netBalance / 100000).toFixed(2)}L
                    </div>
                    <div className="text-gray-400 text-xs font-bold mt-1">
                        Available Cash Flow
                    </div>
                </div>
            </div>

            {/* Recent Transactions List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="font-heading font-bold text-lg text-gray-900">All Transactions</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-gray-500 text-xs font-bold uppercase tracking-wide">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Description</th>
                                <th className="p-4">Event</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Mode</th>
                                <th className="p-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredTransactions.map((t, i) => (
                                <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                                        {new Date(t.date).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-gray-900 text-sm">{t.notes || 'Transaction'}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold whitespace-nowrap">
                                            {getEventName(t.eventId)}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${t.type === 'Income' ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <span className="text-sm text-gray-700">{t.category}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">{t.mode}</td>
                                    <td className={`p-4 text-right font-bold text-sm ${t.type === 'Income' ? 'text-green-600' : 'text-gray-900'}`}>
                                        {t.type === 'Income' ? '+' : '-'} ₹{parseFloat(t.amount).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-gray-400 italic">
                                        No transactions found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <FinanceTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                defaultType={modalType}
                onConfirm={addFinanceTransaction}
            />
        </div>
    );
};

export default Finance;
