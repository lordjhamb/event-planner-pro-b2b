import React, { useState } from 'react';
import { MessageSquare, Users, Send } from 'lucide-react';

const ChatInterface = ({
    messages = [],
    onSendMessage,
    currentUser,
    users = [],
    height = "h-[600px]",
    activeChatId,
    onChatSelect
}) => {
    const [messageInput, setMessageInput] = useState('');
    const [localActiveChat, setLocalActiveChat] = useState('group'); // Default if not controlled
    const [showMobileChat, setShowMobileChat] = useState(false); // Mobile view state

    // Use controlled or uncontrolled state
    const currentChatId = activeChatId !== undefined ? activeChatId : localActiveChat;

    const handleChatSelect = (id) => {
        if (onChatSelect) {
            onChatSelect(id);
        } else {
            setLocalActiveChat(id);
        }
        setShowMobileChat(true); // Switch to chat view on mobile selection
    };

    const handleSend = () => {
        if (!messageInput.trim()) return;
        onSendMessage(messageInput, currentChatId);
        setMessageInput('');
    };

    const ChatSidebar = () => (
        <div className={`flex-col bg-gray-50 border-r border-gray-100 md:flex md:w-80 ${showMobileChat ? 'hidden' : 'flex w-full'}`}>
            <div className="p-4 border-b border-gray-200">
                <h3 className="font-heading font-bold text-gray-900 flex items-center gap-2">
                    <MessageSquare size={20} className="text-primary-600" />
                    Messages
                </h3>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                {/* Group Chat Option */}
                <div
                    onClick={() => handleChatSelect('group')}
                    className={`p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 ${currentChatId === 'group' ? 'bg-white shadow-sm border border-primary-100' : 'hover:bg-white/60'}`}
                >
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                        <Users size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 text-sm">Event Group</div>
                        <div className="text-xs text-gray-500 truncate">Everyone in this event</div>
                    </div>
                </div>
                <div className="px-3 pt-2 pb-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Direct Messages</div>
                {users.map(worker => (
                    <div
                        key={worker.id}
                        onClick={() => handleChatSelect(worker.id)}
                        className={`p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 ${currentChatId === worker.id ? 'bg-white shadow-sm border border-primary-100' : 'hover:bg-white/60'}`}
                    >
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center p-0.5 relative">
                            <img src={`https://ui-avatars.com/api/?name=${worker.name}&background=random`} alt={worker.name} className="w-full h-full rounded-full" />
                            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${worker.available ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-gray-900 text-sm truncate">{worker.name}</div>
                            <div className="text-xs text-gray-500 truncate">{worker.role}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 animate-fade-in overflow-hidden ${height} flex flex-col md:flex-row`}>
            {/* Sidebar - Hidden on mobile if chat is open */}
            <ChatSidebar />

            {/* Chat Area - Hidden on mobile if list is open */}
            <div className={`flex-1 flex-col bg-white md:flex ${!showMobileChat ? 'hidden' : 'flex'}`}>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                    <div className="flex items-center gap-3">
                        {/* Mobile Back Button */}
                        <button
                            onClick={() => setShowMobileChat(false)}
                            className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </button>

                        {currentChatId === 'group' ? (
                            <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                                <Users size={20} />
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                                <span className="font-bold text-indigo-600 text-lg">
                                    {users.find(w => w.id === currentChatId)?.name.charAt(0)}
                                </span>
                            </div>
                        )}
                        <div>
                            <div className="font-bold text-gray-900">
                                {currentChatId === 'group' ? 'Event Team Chat' : users.find(w => w.id === currentChatId)?.name}
                            </div>
                            <div className="text-xs text-gray-500">
                                {currentChatId === 'group' ? `${users.length} members` : 'Online'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/30">
                    {messages.map(msg => (
                        msg.isSystem ? (
                            <div key={msg.id} className="flex justify-center my-4">
                                <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full font-medium">
                                    {msg.text}
                                </span>
                            </div>
                        ) : (
                            <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-3 shadow-sm ${msg.senderId === 'me'
                                    ? 'bg-primary-600 text-white rounded-br-none'
                                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                                    }`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <div className={`text-[10px] mt-1 text-right ${msg.senderId === 'me' ? 'text-primary-200' : 'text-gray-400'}`}>
                                        {msg.timestamp}
                                    </div>
                                </div>
                            </div>
                        )
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-3 md:p-4 border-t border-gray-100 bg-white">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!messageInput.trim()}
                            className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-primary-200"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
