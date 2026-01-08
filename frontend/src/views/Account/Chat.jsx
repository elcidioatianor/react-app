import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { useAuthContext } from "../../contexts/AuthContext";
import { Container, Card, Form, Button, Spinner } from "react-bootstrap";
import { SendFill, Paperclip, CheckAll, Check } from "react-bootstrap-icons";

export function Chat() {
    const { partnerId } = useParams();
    const { user } = useAuthContext();
    const api = useApi();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef();

    // Mock partner info (In real app, fetch this)
    const partner = {
        name: "Vendedor da Loja",
        status: "online",
        avatar: null
    };

    const fetchMessages = async () => {
        try {
            // const res = await api.get(/chat/history/${partnerId});
            // setMessages(res.data);

            // Mock Data for UI Dev
            if (messages.length === 0) {
                setMessages([
                    { id: 1, senderId: parseInt(partnerId), message: "Olá! Como posso ajudar com o Samsung S24?", createdAt: new Date(Date.now() - 3600000).toISOString(), read: true },
                    { id: 2, senderId: user.id, message: "Ainda está disponível na cor preta?", createdAt: new Date(Date.now() - 3500000).toISOString(), read: true },
                    { id: 3, senderId: parseInt(partnerId), message: "Sim, temos 2 unidades em stock. Podemos entregar hoje.", createdAt: new Date(Date.now() - 3400000).toISOString(), read: false },
                ]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (partnerId) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [partnerId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const optimisticMsg = {
            id: Date.now(),
            senderId: user.id,
            message: newMessage,
            createdAt: new Date().toISOString(),
            read: false
        };

        setMessages([...messages, optimisticMsg]);
        setNewMessage("");

        try {
            // await api.post('/chat/send', { receiverId: partnerId, message: newMessage });
        } catch (error) {
            console.error("Failed to send");
        }
    };

    const formatTime = (isoString) => {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="d-flex flex-column" style={{ height: "calc(100vh - 76px)", background: "#e5ddd5" }}>
            {/* Header */}
            <div className="bg-nav-sub text-white px-3 py-2 d-flex align-items-center shadow-sm flex-shrink-0">
                <Link to="/profile" className="text-white me-3 d-md-none"><i className="bi bi-arrow-left fs-4"></i></Link>
                <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 40, height: 40 }}>
                    <i className="bi bi-person-fill fs-5 text-white"></i>
                </div>
                <div>
                    <h6 className="mb-0 fw-bold">{partner.name}</h6>
                    <small className="opacity-75" style={{ fontSize: '0.8rem' }}>Online agora</small>
                </div>
                <div className="ms-auto d-flex gap-3">
                    <i className="bi bi-camera-video fs-5"></i>
                    <i className="bi bi-telephone fs-5"></i>
                    <i className="bi bi-three-dots-vertical fs-5"></i>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-grow-1 overflow-auto p-3" style={{
                backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
                backgroundRepeat: "repeat",
                opacity: 0.95
            }}>
                <Container style={{ maxWidth: '900px' }}>
                    {messages.map((msg, idx) => {
                        const isMe = msg.senderId === user.id;
                        return (
                            <div key={idx} className={`d-flex mb-2 ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
                                <Card className={`border-0 shadow-sm ${isMe ? 'bg-success bg-opacity-25' : 'bg-white'}`} style={{
                                    maxWidth: '80%',
                                    borderRadius: '7px',
                                    borderTopRightRadius: isMe ? 0 : '7px',
                                    borderTopLeftRadius: !isMe ? 0 : '7px',
                                    backgroundColor: isMe ? '#dcf8c6 !important' : '#fff'
                                }}>
                                    <div className="px-2 pt-2 pb-1">
                                        <span className="text-dark" style={{ fontSize: '0.95rem' }}>{msg.message}</span>
                                        <div className="d-flex align-items-center justify-content-end gap-1 mt-1" style={{ fontSize: '0.7rem', color: '#999' }}>
                                            <span>{formatTime(msg.createdAt)}</span>
                                            {isMe && (
                                                msg.read ? <CheckAll className="text-primary fs-6" /> : <Check className="fs-6" />
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        );
                    })}
                    <div ref={scrollRef}></div>
                </Container>
            </div>

            {/* Input Area */}
            <div className="bg-light px-3 py-2 flex-shrink-0">
                <Container style={{ maxWidth: '900px' }}>
                    <Form onSubmit={handleSend} className="d-flex align-items-center gap-2">
                        <Button variant="link" className="text-secondary p-0">
                            <i className="bi bi-emoji-smile fs-4"></i>
                        </Button>
                        <Button variant="link" className="text-secondary p-0">
                            <Paperclip className="fs-4" />
                        </Button>
                        <Form.Control
                            className="rounded-pill border-0 shadow-sm"
                            placeholder="Mensagem"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            style={{ paddingRight: '1rem' }}
                        />
                        {newMessage.trim() ? (
                            <Button type="submit" variant="success" className="rounded-circle d-flex align-items-center justify-content-center p-0 shadow-sm" style={{ width: 45, height: 45 }}>
                                <SendFill size={20} className="ms-1" />
                            </Button>
                        ) : (
                            <Button variant="secondary" className="rounded-circle d-flex align-items-center justify-content-center p-0 shadow-sm" style={{ width: 45, height: 45 }}>
                                <i className="bi bi-mic-fill fs-5"></i>
                            </Button>
                        )}
                    </Form>
                </Container>
            </div>
        </div>
    );
}
