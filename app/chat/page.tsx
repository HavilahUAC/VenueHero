'use client';

import { useEffect, useState, useRef, type ComponentType, type SVGProps } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebaseConfig';
import { supabase } from '@/supabaseClient';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import {
    ArrowLeftIcon,
    ArrowPathIcon,
    BuildingOffice2Icon,
    ClipboardDocumentListIcon,
    PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

type ProviderInfo = {
    id: string;
    name: string;
    role: string;
    avatar: ComponentType<SVGProps<SVGSVGElement>>;
    firebase_uid: string;
};

export default function ChatPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const providerId = searchParams.get('provider');
    const serviceQuery = searchParams.get('service');

    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Load current user and fetch provider info
    useEffect(() => {
        const loadChat = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    router.push('/signIn');
                    return;
                }

                setCurrentUser(user);

                // Fetch provider info from Supabase
                if (providerId) {
                    const { data: provider } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', providerId)
                        .single();

                    if (provider) {
                        const providerData = {
                            id: provider.id,
                            name: provider.brand_name,
                            role: provider.role,
                            avatar: provider.role === 'venue' ? BuildingOffice2Icon : ClipboardDocumentListIcon,
                            firebase_uid: provider.firebase_uid
                        };
                        
                        setProviderInfo(providerData);
                        console.log('Provider loaded:', provider.brand_name);

                        // Fetch messages using the provider data we just got
                        await fetchMessages(user.uid, provider.firebase_uid);
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error('Error loading chat:', error);
                setLoading(false);
            }
        };

        loadChat();
    }, [providerId, router]);

    const fetchMessages = async (userId: string, receiverFirebaseUid: string) => {
        try {
            console.log('Fetching messages between:', userId, 'and', receiverFirebaseUid);
            
            // Fetch all messages (no complex OR query)
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching messages:', error);
                console.log('Error details:', {
                    message: error.message,
                    code: (error as any).code,
                    details: (error as any).details
                });
                return;
            }

            // Filter messages client-side for this conversation
            const conversationMessages = (data || []).filter((msg: any) => {
                const isFromMe = msg.sender_id === userId && msg.receiver_id === receiverFirebaseUid;
                const isFromThem = msg.sender_id === receiverFirebaseUid && msg.receiver_id === userId;
                return isFromMe || isFromThem;
            });

            const formattedMessages = conversationMessages.map((msg: any) => ({
                id: msg.id,
                sender: msg.sender_id,
                text: msg.content,
                timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isOwn: msg.sender_id === userId
            }));

            setMessages(formattedMessages);
            console.log('Loaded', formattedMessages.length, 'messages from conversation');
        } catch (error) {
            console.error('Error in fetchMessages:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !currentUser || !providerInfo) return;

        setSending(true);

        try {
            console.log('Sending message:', {
                sender_id: currentUser.uid,
                receiver_id: providerInfo.firebase_uid,
                content: newMessage.substring(0, 50)
            });

            // Save message to Supabase
            const { error, data } = await supabase
                .from('messages')
                .insert({
                    sender_id: currentUser.uid,
                    receiver_id: providerInfo.firebase_uid,
                    sender_name: currentUser.email,
                    receiver_name: providerInfo.name,
                    content: newMessage
                });

            if (error) {
                console.error('Error sending message:', error);
                console.log('Full error details:', {
                    message: error.message,
                    code: (error as any).code,
                    details: (error as any).details,
                    hint: (error as any).hint
                });
                alert(`Failed to send message: ${error.message}`);
                setSending(false);
                return;
            }

            console.log('Message sent successfully');

            // Add message to UI immediately
            const message = {
                id: Date.now().toString(),
                sender: currentUser.uid,
                text: newMessage,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isOwn: true
            };

            setMessages(prev => [...prev, message]);
            setNewMessage('');
            console.log('Message sent successfully');

            // Auto-fetch new messages (for real-time effect)
            setTimeout(() => {
                fetchMessages(currentUser.uid, providerInfo.id);
            }, 500);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-900">
                {/* Back Button */}
                <div className="bg-slate-800/50 border-b border-slate-700 py-4 px-6">
                    <div className="max-w-2xl mx-auto">
                        <Link href="/marketplace" className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-2">
                            <ArrowLeftIcon className="h-4 w-4" />
                            Back to Marketplace
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                        <div className="text-center">
                            <p className="text-gray-300">Loading chat...</p>
                        </div>
                    </div>
                ) : !providerInfo ? (
                    <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                        <div className="text-center">
                            <p className="text-gray-300">Provider not found</p>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto h-[calc(100vh-200px)] flex flex-col">
                        {/* Chat Header */}
                        <div className="bg-slate-800/50 border-b border-slate-700 p-6">
                            <div className="flex items-center gap-4">
                                {(() => {
                                    const AvatarIcon = providerInfo.avatar;
                                    return <AvatarIcon className="h-10 w-10 text-white" />;
                                })()}
                                <div>
                                    <h2 className="text-white font-bold text-lg">{providerInfo?.name}</h2>
                                    <p className="text-gray-400 text-sm capitalize">{providerInfo?.role}</p>
                                    {serviceQuery && (
                                        <p className="text-blue-400 text-sm mt-1">Inquiring about: {serviceQuery}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <p className="text-gray-400">Start a conversation with {providerInfo?.name}</p>
                                    </div>
                                </div>
                            ) : (
                                messages.map((message) => (
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
                                            <p className="break-words">{message.text}</p>
                                            <p className={`text-xs mt-2 ${message.isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
                                                {message.timestamp}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                            {sending && (
                                <div className="flex justify-end">
                                    <div className="bg-blue-600 text-white px-4 py-3 rounded-lg rounded-br-none">
                                        <div className="flex gap-2">
                                            <div className="w-2 h-2 bg-blue-200 rounded-full animate-bounce" />
                                            <div className="w-2 h-2 bg-blue-200 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                            <div className="w-2 h-2 bg-blue-200 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="bg-slate-800/50 border-t border-slate-700 p-6">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                                    disabled={sending}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={sending || !newMessage.trim()}
                                    className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                                >
                                    {sending ? (
                                        <ArrowPathIcon className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <PaperAirplaneIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>

                            {/* Info Text */}
                            <p className="text-gray-400 text-xs mt-3 text-center">
                                Messages are stored securely. For safety, avoid sharing personal details in initial messages.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
