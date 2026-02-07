'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OrderItem extends Model {
        static associate(models) {
            OrderItem.belongsTo(models.Order, {
                foreignKey: 'orderId',
                as: 'order',
            });
            OrderItem.belongsTo(models.Product, {
                foreignKey: 'productId',
                as: 'product',
            });
        }
    }
    OrderItem.init(
        {
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            productName: DataTypes.STRING,
            orderId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            productId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'OrderItem',
            tableName: 'order_items',
            timestamps: false,
            underscored: true,
        }
    );
    return OrderItem;
};
