const { mongooseSchema, mongooseRoot } = require("../utils/database");

const productSchema = new mongooseSchema({
	title: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	imageUrl: {
		type: String,
		required: true,
	},
	userId: {
		type: mongooseSchema.Types.ObjectId,
		required: true,
		ref: "User",
	},
});

module.exports = mongooseRoot.model("Product", productSchema);
