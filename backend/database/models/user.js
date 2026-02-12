'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // associações futuras
            User.hasMany(models.Store, {
                as: 'stores'
            })
        }
    }

    User.init(
        {
            firstName: {
                type: DataTypes.STRING(80),
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [2, 100],
                },
            },

            lastName: {
                type: DataTypes.STRING(80),
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [2, 100],
                },
            },

            phoneNumber: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: true,
            },

            email: {
                type: DataTypes.STRING(100),
                allowNull: true,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },

            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [8, 255],
                },
            },

            role: {
                type: DataTypes.ENUM('buyer', 'seller', 'admin'),
                allowNull: false,
                defaultValue: 'buyer',
            },

            refreshTokenHash: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },

            lastLoginAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            timestamps: true,
        }
    );

    return User;
};
