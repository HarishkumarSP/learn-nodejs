const { sequelize, SequelizeRoot } = require("../utils/database");

const User = sequelize.define("user", {
	id: {
		type: SequelizeRoot.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	name: SequelizeRoot.STRING,
	email: SequelizeRoot.STRING,
});

module.exports = User;
