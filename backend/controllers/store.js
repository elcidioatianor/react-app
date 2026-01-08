const { Store, User } = require('../database/models');

exports.createStore = async (req, res) => {
    try {
        const { name, category, type, description, city, province } = req.body;
        const ownerId = req.user.id;

        // Check if user already has a store
        const existingStore = await Store.findOne({ where: { ownerId: ownerId } });
        if (existingStore) {
            return res.status(400).json({ message: 'Você já possui uma loja cadastrada.' });
        }

        const store = await Store.create({
            name,
            category,
            type,
            description,
            city,
            province,
            ownerId: ownerId,
            logoUrl: null // Initialize with null if not provided
        });

        // Update user role to seller if it was client
        await User.update({ role: 'seller' }, { where: { id: ownerId } });

        res.status(201).json(store);
    } catch (error) {
        console.error('Erro ao criar loja:', error);
        res.status(500).json({ message: 'Erro ao criar loja.' });
    }
};

exports.getMyStore = async (req, res) => {
    try {
        const store = await Store.findOne({
            where: { ownerId: req.user.id },
            include: ['products']
        });

        if (!store) {
            return res.status(404).json({ message: 'Loja não encontrada.' });
        }

        res.json(store);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar loja.' });
    }
};

exports.updateStore = async (req, res) => {
    try {
        const { name, description, city, province, logoUrl } = req.body;
        const store = await Store.findOne({ where: { ownerId: req.user.id } });

        if (!store) {
            return res.status(404).json({ message: 'Loja não encontrada.' });
        }

        await store.update({ name, description, city, province, logo_url: logoUrl });
        res.json(store);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar loja.' });
    }
};
