const {
	Model,
	DataTypes,
	Op
} = require('sequelize');

module.exports = (sequelize) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init({
    productName: DataTypes.STRING,
    productDescription: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
  });

  return Product;
};