const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 1,
		required: [true, "Name required"],
	},
	number: {
		type: String,
		minLength: 1,
		validate: {
			validator: (v) => {
				return /\d{3}-\d{3}-\d{4}/.test(v);
			},
			message: () => `555-555-5555 is a valid format`,
		},
		required: [true, "Phone number required"],
	},
});

personSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Person", personSchema);
