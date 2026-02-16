'use client';

import { useEffect, useState, useRef } from 'react';
import { auth } from '@/firebaseConfig';
import { supabase } from '@/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MessagesPage() {
    const router = useRouter();
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchConversations = async () => {
            const user = auth.currentUser;
            if (!user) {
                router.push('/signIn');
                return;
            }

            // For demo, create mock conversations
            // In production, this would fetch from a real messages table
            setConversations([
                {
                    id: 1,
                    name: 'Sarah Johnson',
                    role: 'Event Planner',
                    lastMessage: 'Are you available for my wedding in June?',
                    timestamp: '2 hours ago',
                    avatar: '👰',
                    unread: 2
                },
                {
                    id: 2,
                    name: 'John Smith',
                    role: 'Event Planner',
                    lastMessage: 'Thanks for the quotation!',
                    timestamp: '1 day ago',
                    avatar: '🎭',
                    unread: 0
                },
                {
                    id: 3,
                    name: 'Beautiful Venues Co.',
                    role: 'Venue Owner',
                    lastMessage: 'Perfect! We\'ll collaborate with you.',
                    timestamp: '3 days ago',
                    avatar: '🏢',
                    unread: 0
                }
            ]);

            setLoading(false);
        };

        fetchConversations();
    }, [router]);

    useEffect(() => {
        // Auto-scroll to latest message
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSelectConversation = (conversation: any) => {
        setSelectedConversation(conversation);
        // Load mock messages for demo
        setMessages([
            {
                id: 1,
                sender: 'Sarah Johnson',
                text: 'Hi! Are you available for my wedding in June?',
                timestamp: '2 hours ago',
                isOwn: false
            },
            {
                id: 2,
                sender: 'You',
                text: 'Hello! We\'d love to help with your wedding. What dates are you looking at?',
                timestamp: '1 hour ago',
                isOwn: true
            },
            {
                id: 3,
                sender: 'Sarah Johnson',
                text: 'June 15th-16th, 2026. How much would it cost?',
                timestamp: '45 minutes ago',
                isOwn: false
            }
        ]);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        setSending(true);
        
        // Add message to UI immediately
        const message = {
            id: messages.length + 1,
            sender: 'You',
            text: newMessage,
            timestamp: 'just now',
            isOwn: true
        };

        setMessages([...messages, message]);
        setNewMessage('');

        // In production, save to Supabase
        await new Promise(resolve => setTimeout(resolve, 500));
        setSending(false);
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-300">Loading conversations...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-hidden flex flex-col bg-slate-900">
            {/* Header */}
            <div className="p-8 border-b border-slate-700">
                <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-block">
                    ← Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-white mb-2">Messages 💬</h1>
                <p className="text-gray-400">Connect with {auth.currentUser?.uid?.includes('venue') ? 'event planners' : 'venues'}</p>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Conversations List */}
                <div className="w-80 border-r border-slate-700 overflow-y-auto bg-slate-800/30">
                    <div className="p-4 space-y-2">
                        {conversations.map((conversation) => (
                            <button
                                key={conversation.id}
                                onClick={() => handleSelectConversation(conversation)}
                                className={`w-full text-left p-4 rounded-lg transition ${
                                    selectedConversation?.id === conversation.id
                                        ? 'bg-slate-700 border border-blue-500'
                                        : 'hover:bg-slate-700/50 border border-transparent'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="text-3xl">{conversation.avatar}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="text-white font-medium truncate">{conversation.name}</h3>
                                            {conversation.unread > 0 && (
                                                <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                                                    {conversation.unread}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-400 text-xs mb-1">{conversation.role}</p>
                                        <p className="text-gray-400 text-sm truncate">{conversation.lastMessage}</p>
                                        <p className="text-gray-500 text-xs mt-1">{conversation.timestamp}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                {selectedConversation ? (
                    <div className="flex-1 flex flex-col">
                        {/* Chat Header */}
                        <div className="p-6 border-b border-slate-700 bg-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="text-3xl">{selectedConversation.avatar}</div>
                                <div>
                                    <h2 className="text-white font-bold">{selectedConversation.name}</h2>
                                    <p className="text-gray-400 text-sm">{selectedConversation.role}</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs px-4 py-3 rounded-lg ${
                                            message.isOwn
                                                ? 'bg-blue-600 text-white rounded-br-none'
                                                : 'bg-slate-700 text-gray-100 rounded-bl-none'
                                        }`}
                                    >
                                        <p>{message.text}</p>
                                        <p className={`text-xs mt-2 ${message.isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
                                            {message.timestamp}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 border-t border-slate-700 bg-slate-800/50">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={sending || !newMessage.trim()}
                                    className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                                >
                                    {sending ? '⏳' : '📨'}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-5xl mb-3">💬</div>
                            <p className="text-gray-400">Select a conversation to start chatting</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
