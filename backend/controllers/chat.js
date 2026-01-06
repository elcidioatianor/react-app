const { ChatMessage, User } = require('../database/models');
const { Op } = require('sequelize');

exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, message, orderId } = req.body;
        const chat = await ChatMessage.create({
            senderId: req.user.id,
            receiverId,
            message,
            orderId,
            read: false
        });
        res.status(201).json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao enviar mensagem.' });
    }
};

exports.getChatHistory = async (req, res) => {
    try {
        const { otherId } = req.params;
        const messages = await ChatMessage.findAll({
            where: {
                [Op.or]: [
                    { senderId: req.user.id, receiverId: otherId },
                    { senderId: otherId, receiverId: req.user.id }
                ]
            },
            order: [['created_at', 'ASC']]
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar histórico.' });
    }
};

exports.getConversations = async (req, res) => {
    try {
        // Find unique people the user has chatted with
        const messages = await ChatMessage.findAll({
            where: {
                [Op.or]: [{ senderId: req.user.id }, { receiverId: req.user.id }]
            },
            include: [
                { model: User, as: 'sender', attributes: ['id', 'name', 'avatar_url'] },
                { model: User, as: 'receiver', attributes: ['id', 'name', 'avatar_url'] }
            ],
            order: [['created_at', 'DESC']]
        });

        // Simplified logic to group by conversation partner
        const conversations = {};
        messages.forEach(m => {
            const partner = m.senderId === req.user.id ? m.receiver : m.sender;
            if (!conversations[partner.id]) {
                conversations[partner.id] = {
                    partner,
                    lastMessage: m.message,
                    createdAt: m.createdAt
                };
            }
        });

        res.json(Object.values(conversations));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar conversas.' });
    }
};
