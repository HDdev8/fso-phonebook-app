require("dotenv").config();
const url = process.env.MONGODB_URI;
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose
	.connect(url)
	.then((result) => {
		console.log("connected to MongoDB");
	})
	.catch((error) => {
		console.log("error connecting to MongoDB:", error.message);
	});

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

const Person = mongoose.model("Person", personSchema);
module.exports = Person;
