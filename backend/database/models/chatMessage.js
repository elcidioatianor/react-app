'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ChatMessage extends Model {
        static associate(models) {
            ChatMessage.belongsTo(models.User, { foreignKey: 'senderId', as: 'sender' });
            ChatMessage.belongsTo(models.User, { foreignKey: 'receiverId', as: 'receiver' });
            ChatMessage.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
        }
    }
    ChatMessage.init({
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        receiverId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'ChatMessage',
        tableName: 'chat_messages',
        underscored: true
    });
    return ChatMessage;
};
