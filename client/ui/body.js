import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Numbers } from '../../imports/api/numbers.js';
import { LastNumber } from '../../imports/api/lastNumber.js';

import './body.html';

Template.body.onCreated(function bodyOnCreated() {
	Meteor.subscribe('numbers');										// para ma-publish niya b3h
	Meteor.subscribe('lastNumber');										// para ma-publish niya b3h

	this.generatedNumber = new ReactiveVar(999); 					// i officially declare that the ticket will have four digits.
	this.ticketToBeServed = new ReactiveVar(0);
	this.flag = new ReactiveVar(1);									// just a flag for identifying if first time maglalagay sa array			
	this.waitingQueue = new ReactiveVar([]);							// utilize array methods for queue implementation
});																		// problem pa with reactive integer, it will always start with 1000.

Template.body.helpers({
	numbers(){
		return Numbers.find({});										// for collections, maybe? 
	},
	lastNumber(){
		return LastNumber.find({});										// for collections, maybe? 
	},
	generatedNumber(){
		return Template.instance().generatedNumber.get();
	},
	ticketToBeServed(){
		return Template.instance().ticketToBeServed.get();
	},
	flag(){
		return Template.instance().flag.get();
	},
	waitingQueue(){
		return Template.instance().waitingQueue.get();
	},
	equals(a, b){
		if(a === b) return true;
		return false;
	},
	greaterThan(a, b){
		if(a > b) return true;
		return false;
	},
});

Template.body.events({
	'submit .dequeue'(event, instance) {
		// Prevent default browser form submit
		event.preventDefault();

		let tempArray = instance.waitingQueue.get();
		if(tempArray.length >= 0 || instance.flag.get() == 1){
			var ticketToBeServed = tempArray.shift();
		 	instance.waitingQueue.set(tempArray);
		 	instance.ticketToBeServed.set(ticketToBeServed);
			console.log("served! arraySize: " + tempArray.length + " flag: " + instance.flag.get());
			if(tempArray.length == 0) instance.flag.set(0);
		}
		else{
			console.log("not served! arraySize: " + tempArray.length + " flag: " + instance.flag.get());
		}

		Meteor.call('numbers.insert', ticketToBeServed);
	},

	'submit .void'(event) {
		// Prevent default browser form submit
		event.preventDefault();
		console.log("void");
	},

	'click .void'(event) {
		console.log("void");
	},


	'click .generate'(event, instance) {		
		// getting last number saved in collection
		// var last = document.getElementById('lastNumb').innerText;
		// console.log(last);
		// instance.generatedNumber.set( + 1);

		instance.generatedNumber.set(instance.generatedNumber.get() + 1);
		
		// console.log(lastNum);
		// if(instance.generatedNumber.get() === undefined) instance.generatedNumber.set(1000); // begin at the beginning

		var currentNumber = instance.generatedNumber.get();			// get the generated number (reactive integer)
		let tempArray = instance.waitingQueue.get();
		tempArray.push(currentNumber);
		instance.waitingQueue.set(tempArray);

		// updating last number in collection

		instance.flag.set(1);

		// Meteor.call('lastNumber.removeAll'); // clear muna		
		// Meteor.call('lastNumber.insert', currentNumber);
	},

	'click .remove'(event) {
		// Prevent default browser form submit
		event.preventDefault();

		console.log(this._id);
		Meteor.call('numbers.remove', this._id);	
	},

	'click .clear'(event) {
		// Prevent default browser form submit
		event.preventDefault();

		// Remove all tasks in the Collection
		Meteor.call('numbers.removeAll');
	},
});

/***
	plan of action for the random number generator with queue ADT
	1 | reactive integer generatedNumber: 	ito lang yung dapat mag-appear sa screen (yung card section ng 
	.									generate number) na ang range ay from 1000-9999 (four digits and
	.									if sobra na, balik na muli sa 1000) from 9999, next int ay 1000
	.
	2 | reactive integer array: 		dito mangyayari yung operations ng queue (enqueue at dequeue) using
	.									methods ng array nhg JavaScript. 
	.	- enqueue						if may may nadagdag, add lang siya sa collection.
	.	- dequeue						delete sa collection, so dequeue muna sa array bago magperform ng 
	.									deletions sa collection
	.
	3 | clicking generate number: 	lalabas lang yung value nung reactive integer generatedNumber. tapos, kada
-	.									click, nag-iincrement lang by 1, ergo, queue of numbers
	.

	problems na ma-eencounter
	- kapag inulit na yung program. uulit siya nang uulit sa 1000 (default)

	for clarification
	- ilan bang digits yung nasa ticket?
	- ilan ang ididsplay na ticket being submitd?
	- kailan magde-dequeue? (x: if lima na yung ticket being submitd, limit kung baga, )
	- if na-exit yung program, kailangan ba resume yung state?

	to do:
	- pag walang value sa waitingQueue, dapat naka-toast. mehehe. para bang alert na "hoy wala nang nasa array*"
	- buttons are tooltipped, yung generate, serve, at remove. 

*/