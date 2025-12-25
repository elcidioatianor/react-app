'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // associações futuras
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING(80),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [3, 50]
        }
      },

      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8, 255]
        }
      },

      role: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user'
      },

      refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },

      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true
    }
  )

  return User
}
