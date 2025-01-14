const { SequelizeRoot, sequelize } = require("../utils/database");

const OrderItem = sequelize.define("orderItem", {
	id: {
		type: SequelizeRoot.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	quantity: SequelizeRoot.INTEGER,
});

module.exports = OrderItem;
