const { SequelizeRoot, sequelize } = require("../utils/database");

const Order = sequelize.define("order", {
	id: {
		type: SequelizeRoot.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
});

module.exports = Order;
