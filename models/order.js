const { mongooseSchema, mongooseRoot } = require("../utils/database");

const orderSchema = new mongooseSchema({
	products: [
		{
			product: {
				type: Object,
				required: true,
			},
			quantity: {
				type: Number,
				required: true,
			},
		},
	],
	user: {
		name: {
			type: String,
			required: true,
		},
		userId: {
			type: mongooseSchema.Types.ObjectId,
			required: true,
			ref: "User",
		},
	},
});

module.exports = mongooseRoot.model("Order", orderSchema);
