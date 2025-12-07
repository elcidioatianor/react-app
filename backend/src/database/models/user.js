const { 
	Model,
	DataTypes,
	Op
} = require("sequelize")

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
		//define associations here
	}
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users"
    }
  );

  return User
};
