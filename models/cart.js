const { SequelizeRoot, sequelize } = require("../utils/database");

const Cart = sequelize.define("cart", {
	id: {
		type: SequelizeRoot.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
});

module.exports = Cart;
