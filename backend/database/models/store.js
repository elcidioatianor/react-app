const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Store extends Model {
        static associate(models) {
            Store.belongsTo(models.User, {
                as: 'owner',
                foreignKey: 'ownerId',
            });
            Store.hasMany(models.Product, {
                as: 'products',
                foreignKey: 'storeId',
            });
        }
    }

    Store.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            category: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM('individual', 'pme'),
                defaultValue: 'individual',
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            logoUrl: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            province: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            verified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            ownerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Store',
            underscored: true,
        }
    );

    return Store;
};
