import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Numbers = new Mongo.Collection('numbers');

if(Meteor.isServer){ 													// this has something to do with publication
	Meteor.publish('numbers', function numbersPublication(){
		return Numbers.find();
	});
}

Meteor.methods({
	// check if the user exists before executing a method
	// how to create user:
	// 	~*authentication system*~
	// 	add package

	'numbers.insert'(queueNumber) { 									// insert data to the collection
		Numbers.insert({ 											
			queueNumber,
			createdAt: new Date() 										// i really do not know what is this for. is this required?
		});
	},

	'numbers.remove'(_id) {											// removing a single entry
		Numbers.remove({_id});
	},

	'numbers.removeAll'() { 											// clearing the data on collection
		Numbers.remove({});
	},
});