const { Order, OrderItem, Product, Store } = require('../database/models');

exports.createOrder = async (req, res) => {
    try {
        const {
            items,
            total,
            paymentMethod,
            deliveryMethod,
            customerName,
            customerPhone,
            customerAddress,
        } = req.body;

        if (!items || items.length === 0) {
            return res
                .status(400)
                .json({ message: 'O pedido deve conter pelo menos um item.' });
        }

        // In this simplified multi-vendor MVP, we assume items belong to one store
        // to keep logic simple, or we could split orders by store.
        // For now, let's group by store or use the first item's store.
        const firstItem = await Product.findByPk(items[0].id);
        const storeId = firstItem.storeId;

        const order = await Order.create({
            total,
            paymentMethod,
            deliveryMethod,
            customerName,
            customerPhone,
            customerAddress,
            buyerId: req.user.id,
            storeId: storeId,
            status: 'novo',
        });

        const orderItems = items.map((item) => ({
            orderId: order.id,
            productId: item.id,
            productName: item.name,
            quantity: item.quantity,
            price: item.price,
        }));

        await OrderItem.bulkCreate(orderItems);

        res.status(201).json(order);
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        res.status(500).json({ message: 'Erro ao processar pedido.' });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { buyerId: req.user.id },
            include: [
                { model: OrderItem, as: 'items' },
                { model: Store, as: 'store' },
            ],
            order: [['created_at', 'DESC']],
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar pedidos.' });
    }
};

exports.getStoreOrders = async (req, res) => {
    try {
        const store = await Store.findOne({ where: { owner_id: req.user.id } });
        if (!store)
            return res.status(404).json({ message: 'Loja não encontrada' });

        const orders = await Order.findAll({
            where: { storeId: store.id },
            include: [{ model: OrderItem, as: 'items' }],
            order: [['created_at', 'DESC']],
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar pedidos da loja.' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const store = await Store.findOne({ where: { owner_id: req.user.id } });

        const order = await Order.findOne({ where: { id, storeId: store.id } });
        if (!order)
            return res.status(404).json({ message: 'Pedido não encontrado' });

        await order.update({ status });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar status.' });
    }
};
