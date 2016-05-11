// import { Meteor } from 'meteor/meteor';
// import { Mongo } from 'meteor/mongo';

// export const Message = new Mongo.Collection('messages');

// if(Meteor.isServer){ // this has something to do with publication
// 	Meteor.publish('messages', function messagesPublication(){
// 		return Message.find(); // prevention of leaking data 
// 	});
// }

// Meteor.methods({
// 	// check if the user exists before executing a method
// 	// how to create user:
// 	// 	~*authentication system*~
// 	// 	add package

// 	'messages.insert'(text, username) { // insert data on the collection
// 		Message.insert({ // insert on mongoDB
// 			text, // isa sa mga data na ma-iinsert sa collection (sa mongoDb)
// 			username,
// 			createdAt: new Date() // i really do not know what is this for. is this required?
// 		});
// 	},

// 	'messages.removeAll'() { // clearing the data on collection
// 		Message.remove({});
// 	},
// });