import React, { useRef } from 'react';
import { X, Printer, Download, Mail } from 'lucide-react';

const QuotePreviewModal = ({ isOpen, onClose, event }) => {
    const printRef = useRef();

    if (!isOpen || !event) return null;

    const handlePrint = () => {
        const content = printRef.current.innerHTML;
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Print Quote</title>');
        // Inject Tailwind CDN for styling in print window (simplest way for MVP)
        printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
        printWindow.document.write('</head><body class="bg-white p-8">');
        printWindow.document.write(content);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    // Mock Line Items based on Event Budget
    const lineItems = [
        { desc: 'Venue Rental & Setup', qty: 1, rate: 850000, total: 850000 },
        { desc: 'Premium Catering (500 Pax)', qty: 500, rate: 1200, total: 600000 },
        { desc: 'Entertainment Package (DJ + Live Band)', qty: 1, rate: 300000, total: 300000 },
        { desc: 'Decor & Floral Arrangements', qty: 1, rate: 150000, total: 150000 },
        { desc: 'Logistics & Transport', qty: 5, rate: 10000, total: 50000 },
    ];

    const subtotal = lineItems.reduce((acc, item) => acc + item.total, 0);
    const tax = subtotal * 0.18; // 18% GST (India context)
    const grandTotal = subtotal + tax;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-xl w-full max-w-4xl shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
                {/* Header Actions */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
                    <h3 className="text-lg font-heading font-bold text-gray-900">Quote Preview</h3>
                    <div className="flex items-center gap-3">
                        <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700 transition-colors shadow-sm">
                            <Printer size={16} /> Print / Save PDF
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Printable Content */}
                <div className="overflow-y-auto p-8 bg-gray-50 flex-1">
                    <div ref={printRef} className="bg-white shadow-lg p-12 max-w-3xl mx-auto min-h-[800px] border border-gray-100">
                        {/* Quote Header */}
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                                        EP
                                    </div>
                                    <h1 className="text-2xl font-heading font-black text-gray-900 tracking-tight">EventPlanner<span className="text-primary-600">Pro</span></h1>
                                </div>
                                <div className="text-sm text-gray-500 max-w-[200px]">
                                    123 Event Horizon Blvd,<br />
                                    Creative District, Mumbai 400001<br />
                                    contact@eventplannerpro.com
                                </div>
                            </div>
                            <div className="text-right">
                                <h2 className="text-4xl font-heading font-thin text-gray-300 mb-2">QUOTE</h2>
                                <div className="text-sm font-bold text-gray-900">#QT-{event.id}-001</div>
                                <div className="text-sm text-gray-500">Date: {new Date().toLocaleDateString()}</div>
                            </div>
                        </div>

                        {/* Client Info */}
                        <div className="flex justify-between mb-12 pb-8 border-b border-gray-100">
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Bill To</h3>
                                <div className="font-bold text-gray-900 text-lg">{event.client}</div>
                                <div className="text-sm text-gray-500">Client ID: CLT-{event.id.slice(0, 4)}</div>
                            </div>
                            <div className="text-right">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Event Details</h3>
                                <div className="font-bold text-gray-900">{event.name}</div>
                                <div className="text-sm text-gray-500">{event.location}</div>
                                <div className="text-sm text-gray-500">{event.dates}</div>
                            </div>
                        </div>

                        {/* Line Items */}
                        <table className="w-full mb-12">
                            <thead>
                                <tr className="border-b-2 border-primary-500">
                                    <th className="text-left py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Description</th>
                                    <th className="text-center py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Qty</th>
                                    <th className="text-right py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Rate</th>
                                    <th className="text-right py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {lineItems.map((item, i) => (
                                    <tr key={i}>
                                        <td className="py-4 text-sm font-medium text-gray-900">{item.desc}</td>
                                        <td className="py-4 text-sm text-gray-600 text-center">{item.qty}</td>
                                        <td className="py-4 text-sm text-gray-600 text-right">₹{item.rate.toLocaleString()}</td>
                                        <td className="py-4 text-sm font-bold text-gray-900 text-right">₹{item.total.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Totals */}
                        <div className="flex justify-end mb-12">
                            <div className="w-64">
                                <div className="flex justify-between py-2 text-sm text-gray-600 border-b border-gray-50">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between py-2 text-sm text-gray-600 border-b border-gray-50">
                                    <span>Tax (18% GST)</span>
                                    <span>₹{tax.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between py-3 text-lg font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>₹{grandTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="border-t border-gray-100 pt-8">
                            <h4 className="font-bold text-gray-900 text-sm mb-2">Terms & Conditions</h4>
                            <ul className="text-xs text-gray-500 space-y-1 list-disc pl-4">
                                <li>Payment is due within 15 days of invoice date.</li>
                                <li>Please make checks payable to "EventPlannerPro Inc."</li>
                                <li>This quote is valid for 30 days from the date of issue.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuotePreviewModal;
