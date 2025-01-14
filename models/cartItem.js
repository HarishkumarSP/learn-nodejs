const { SequelizeRoot, sequelize } = require("../utils/database");

const CartItem = sequelize.define("cartItem", {
	id: {
		type: SequelizeRoot.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	quantity: SequelizeRoot.INTEGER,
});

module.exports = CartItem;
