import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const LastNumber = new Mongo.Collection('lastNumber');

if(Meteor.isServer){ 													// this has something to do with publication
	Meteor.publish('lastNumber', function lastNumberPublication(){
		return LastNumber.find();
	});
}

Meteor.methods({
	// check if the user exists before executing a method
	// how to create user:
	// 	~*authentication system*~
	// 	add package

	'lastNumber.insert'(lastNum) { 									// insert data to the collection
		LastNumber.insert({ 											
			lastNum,
			createdAt: new Date() 										// i really do not know what is this for. is this required?
		});
	},

	'lastNumber.removeAll'() { 											// clearing the data on collection
		LastNumber.remove({});
	},
});