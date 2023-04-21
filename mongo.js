// require("dotenv").config();
// const url = process.env.MONGODB_URI;
// const mongoose = require("mongoose");
// mongoose.set("strictQuery", false);
// mongoose
// 	.connect(url)
// 	.then((result) => {
// 		console.log("connected to MongoDB");
// 	})
// 	.catch((error) => {
// 		console.log("error connecting to MongoDB:", error.message);
// 	});

// const personSchema = new mongoose.Schema({
// 	name: String,
// 	number: String,
// });

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	number: {
		type: String,
		required: true,
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

/* Find all persons */
if (process.argv.length === 2) {
	Person.find({}).then((persons) => {
		persons.forEach((person) => {
			console.log(person.name, person.number);
		});
		mongoose.connection.close();
	});
}
/* Mongoose find a person */
if (process.argv.length === 3) {
	const personName = `${process.argv[2]}`;
	Person.find({name: personName}).then((foundPerson) => {
		console.log(foundPerson);
		mongoose.connection.close();
	});
}

/* Mongoose add a person */
if (process.argv.length === 4) {
	const personName = `${process.argv[2]}`;
	const personNumber = `${process.argv[3]}`;
	const person = new Person({
		name: personName,
		number: personNumber,
	});
	person.save().then((newPerson) => {
		console.log(newPerson);
		mongoose.connection.close();
	});
}

// module.exports = Person;
