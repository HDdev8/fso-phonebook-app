const mongoose = require("mongoose");

const infoSchema = new mongoose.Schema({
	time: {
		type: String,
		minLength: 1,
		required: [true, "Time required"],
	},
	entries: {
		type: String,
		minLength: 1,
		required: [true, "All entries required"],
	},
});

infoSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Info", infoSchema);
