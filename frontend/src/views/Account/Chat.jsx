import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { useAuthContext } from "../../contexts/AuthContext";

export function Chat() {
    const { partnerId } = useParams();
    const { user } = useAuthContext();
    const api = useApi();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [partner, setPartner] = useState(null);
    const scrollRef = useRef();

    const fetchMessages = async () => {
        try {
            const res = await api.get(`/chat/history/${partnerId}`);
            setMessages(res.data);
            // In a real app we'd fetch partner info too
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (partnerId) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 5000); // Poll every 5s for MVP
            return () => clearInterval(interval);
        }
    }, [partnerId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const res = await api.post('/chat/send', {
                receiverId: partnerId,
                message: newMessage
            });
            setMessages([...messages, res.data]);
            setNewMessage("");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container py-5" style={{ marginTop: "70px", height: "calc(100vh - 100px)" }}>
            <div className="card shadow-sm border-0 h-100 d-flex flex-column">
                <div className="card-header bg-white py-3 border-bottom d-flex align-items-center">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 40, height: 40 }}>
                        <i className="bi bi-person"></i>
                    </div>
                    <div>
                        <h6 className="fw-bold mb-0">Conversa com Vendedor</h6>
                        <small className="text-success small"><i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i>Online</small>
                    </div>
                </div>

                <div className="card-body overflow-auto p-4 bg-light" style={{ flex: 1 }}>
                    {messages.map((m, idx) => (
                        <div key={idx} className={`d-flex mb-3 ${m.senderId === user.id ? 'justify-content-end' : 'justify-content-start'}`}>
                            <div className={`p-3 rounded-3 shadow-sm ${m.senderId === user.id ? 'bg-primary text-white' : 'bg-white'}`} style={{ maxWidth: '75%' }}>
                                {m.message}
                                <div className={`small mt-1 opacity-50 ${m.senderId === user.id ? 'text-white' : 'text-muted'}`} style={{ fontSize: '0.7rem' }}>
                                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={scrollRef}></div>
                </div>

                <div className="card-footer bg-white border-top p-3">
                    <form onSubmit={handleSend} className="d-flex gap-2">
                        <input
                            type="text"
                            className="form-control border-0 bg-light"
                            placeholder="Escreva sua mensagem..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button className="btn btn-primary" type="submit">
                            <i className="bi bi-send-fill"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
