const { Product, Store } = require('../database/models');

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, images } = req.body;

        const store = await Store.findOne({ where: { owner_id: req.user.id } });
        if (!store) {
            return res.status(403).json({ message: 'Você precisa ter uma loja para cadastrar produtos.' });
        }

        const product = await Product.create({
            name,
            description,
            price,
            stock,
            category,
            images,
            store_id: store.id
        });

        res.status(201).json(product);
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ message: 'Erro ao criar produto.' });
    }
};

exports.getStoreProducts = async (req, res) => {
    try {
        const store = await Store.findOne({ where: { owner_id: req.user.id } });
        if (!store) {
            return res.status(404).json({ message: 'Loja não encontrada.' });
        }

        const products = await Product.findAll({ where: { store_id: store.id } });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar produtos.' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, category, images } = req.body;

        const store = await Store.findOne({ where: { owner_id: req.user.id } });
        const product = await Product.findOne({ where: { id, store_id: store.id } });

        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado ou proprietário incorreto.' });
        }

        await product.update({ name, description, price, stock, category, images });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar produto.' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const store = await Store.findOne({ where: { owner_id: req.user.id } });
        const product = await Product.findOne({ where: { id, store_id: store.id } });

        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }

        await product.destroy();
        res.json({ message: 'Produto removido com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover produto.' });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({ include: ['store'] });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar todos os produtos.' });
    }
};
