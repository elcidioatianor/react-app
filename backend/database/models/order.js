'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.User, {
                foreignKey: 'buyerId',
                as: 'buyer',
            });
            Order.belongsTo(models.Store, {
                foreignKey: 'storeId',
                as: 'store',
            });
            Order.hasMany(models.OrderItem, {
                foreignKey: 'orderId',
                as: 'items',
            });
        }
    }
    Order.init(
        {
            status: {
                type: DataTypes.ENUM(
                    'novo',
                    'confirmado',
                    'preparacao',
                    'enviado',
                    'entregue',
                    'cancelado'
                ),
                defaultValue: 'novo',
            },
            total: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            paymentMethod: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            paymentStatus: {
                type: DataTypes.ENUM('pendente', 'pago', 'reembolsado'),
                defaultValue: 'pendente',
            },
            deliveryMethod: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            customerName: DataTypes.STRING,
            customerPhone: DataTypes.STRING,
            customerAddress: DataTypes.TEXT,
            trackingCode: DataTypes.STRING,
            buyerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            storeId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Order',
            tableName: 'orders',
            underscored: true,
        }
    );
    return Order;
};
