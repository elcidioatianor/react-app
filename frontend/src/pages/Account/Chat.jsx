import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
//import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';
import { SendFill, Paperclip, CheckAll, Check } from 'react-bootstrap-icons';

function Chat() {
    const { partnerId } = useParams();
    const { user } = useAuth();
    //const api = useApi();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    //const [loading, setLoading] = useState(true);
    const scrollRef = useRef();

    // Mock partner info (In real app, fetch this)
    const partner = {
        name: 'Vendedor da Loja',
        status: 'online',
        avatar: null,
    };

    useEffect(() => {
        const fetchMessages = async () => {
        try {
            // const res = await api.get(/chat/history/${partnerId});
            // setMessages(res.data);

            // Mock Data for UI Dev
            if (messages.length === 0) {
                setMessages([
                    {
                        id: 1,
                        senderId: parseInt(partnerId),
                        message: 'Olá! Como posso ajudar com o Samsung S24?',
                        createdAt: new Date(Date.now() - 3600000).toISOString(),
                        read: true,
                    },
                    {
                        id: 2,
                        senderId: user.id,
                        message: 'Ainda está disponível na cor preta?',
                        createdAt: new Date(Date.now() - 3500000).toISOString(),
                        read: true,
                    },
                    {
                        id: 3,
                        senderId: parseInt(partnerId),
                        message:
                            'Sim, temos 2 unidades em stock. Podemos entregar hoje.',
                        createdAt: new Date(Date.now() - 3400000).toISOString(),
                        read: false,
                    },
                ]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            //setLoading(false);
        }
    };


        if (partnerId) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [partnerId, messages.length, user.id]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async e => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const optimisticMsg = {
            id: Date.now(),
            senderId: user.id,
            message: newMessage,
            createdAt: new Date().toISOString(),
            read: false,
        };

        setMessages([...messages, optimisticMsg]);
        setNewMessage('');

        try {
            // await api.post('/chat/send', { receiverId: partnerId, message: newMessage });
        } catch (error) {
            console.error('Failed to send: ' + error.message);
        }
    };

    const formatTime = isoString => {
        return new Date(isoString).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-76px)] bg-gray-100">
            {/* Header */}
            <div className="bg-green-600 text-white px-3 py-2 flex items-center shadow-sm flex-shrink-0">
                <Link to="/profile" className="text-white mr-3 md:hidden">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                </Link>
                <div className="bg-gray-500 rounded-full flex items-center justify-center mr-3 w-10 h-10">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                </div>
                <div>
                    <h6 className="mb-0 font-bold">{partner.name}</h6>
                    <small className="opacity-75 text-sm">Online agora</small>
                </div>
                <div className="ml-auto flex gap-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                </div>
            </div>

            {/* Messages Area */}
            <div
                className="flex-grow overflow-auto p-3"
                style={{
                    backgroundImage:
                        "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
                    backgroundRepeat: 'repeat',
                    opacity: 0.95,
                }}
            >
                <div className="max-w-4xl mx-auto">
                    {messages.map((msg, idx) => {
                        const isMe = msg.senderId === user.id;
                        return (
                            <div
                                key={idx}
                                className={`flex mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs px-3 py-2 shadow-sm ${
                                        isMe
                                            ? 'bg-green-100 rounded-lg rounded-br-none'
                                            : 'bg-white rounded-lg rounded-bl-none'
                                    }`}
                                >
                                    <span className="text-gray-800 text-sm">
                                        {msg.message}
                                    </span>
                                    <div className="flex items-center justify-end gap-1 mt-1">
                                        <span className="text-xs text-gray-500">
                                            {formatTime(msg.createdAt)}
                                        </span>
                                        {isMe &&
                                            (msg.read ? (
                                                <CheckAll className="text-blue-500 w-4 h-4" />
                                            ) : (
                                                <Check className="w-4 h-4" />
                                            ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={scrollRef}></div>
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-gray-200 px-3 py-2 flex-shrink-0">
                <div className="max-w-4xl mx-auto">
                    <form
                        onSubmit={handleSend}
                        className="flex items-center gap-2"
                    >
                        <button type="button" className="text-gray-500 hover:text-gray-700 p-0 bg-transparent border-none">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zM9 7a1 1 0 11-2 0 1 1 0 012 0zM9 11a1 1 0 100-2 1 1 0 000 2zM12 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button type="button" className="text-gray-500 hover:text-gray-700 p-0 bg-transparent border-none">
                            <Paperclip className="w-6 h-6" />
                        </button>
                        <input
                            className="flex-grow rounded-full border-none shadow-sm px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Mensagem"
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                        />
                        {newMessage.trim() ? (
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center w-11 h-11 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <SendFill size={20} className="ml-1" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="bg-gray-500 hover:bg-gray-600 text-white rounded-full flex items-center justify-center w-11 h-11 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 002 11c0-2.21.895-4.21 2.34-5.657l.793.793A5.968 5.968 0 013 11a5.968 5.968 0 001.543 4.207l-.793.793A6.967 6.967 0 004 11a6.967 6.967 0 002.457-5.457l.793.793A5.968 5.968 0 016 11c0 1.657.672 3.164 1.757 4.243l-.793.793z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Chat;