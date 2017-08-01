


$(document).ready(function(){

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCEM0LzQNa4qSY1dqj5sR01XIdsVnvrXB0",
    authDomain: "train-scheduler-76918.firebaseapp.com",
    databaseURL: "https://train-scheduler-76918.firebaseio.com",
    projectId: "train-scheduler-76918",
    storageBucket: "",
    messagingSenderId: "901628323950"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

// when user hits submit
$("#addTrain").on("click", function() {
//Just in case
	event.preventDefault();

//assign variables to every input
	var name = $('#inputName').val().trim();
    var destination = $('#inputDestination').val().trim();
    var time = $('#inputTime').val().trim();
    var freq = $('#inputFrequency').val().trim();

// push entry into firebase
	database.ref().push({
		name: name,
		destination: destination,
    	time: time,
    	freq: freq,
    	timeAdded: firebase.database.ServerValue.TIMESTAMP
	});
	$("input").val('');
    return false;
});

//child function
database.ref().on("child_added", function(childSnapshot){
	// console.log(childSnapshot.val());
	var name = childSnapshot.val().name;
	var destination = childSnapshot.val().destination;
	var time = childSnapshot.val().time;
	var freq = childSnapshot.val().freq;

	console.log("Name: " + name);
	console.log("Destination: " + destination);
	console.log("Time: " + time);
	console.log("Frequency: " + freq);

//time converter
	var freq = parseInt(freq);
	//current time
	var currentTime = moment().format('ddd, Do MMMM  YYYY, h:mm:ss a');
	console.log("current time:" + moment().format('HH:mm'));
	var dConverted = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');
	console.log("date converted: " + dConverted);
	var trainTime = moment(dConverted).format('HH:mm');
	console.log("train time : " + trainTime);
	
	//time difference
	var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
	var tDifference = moment().diff(moment(tConverted), 'minutes');
	console.log("difference in time: " + tDifference);
	//remainder 
	var tRemainder = tDifference % freq;
	console.log("time remaining " + tRemainder);
	//min until next train
	var minsAway = freq - tRemainder;
	console.log("min until next train: " + minsAway);
	//next train
	var nextTrain = moment().add(minsAway, 'minutes');
	console.log("arrival " + moment(nextTrain).format('HH:mm A'));

 //creating a table
$('#currentTime').html(currentTime);
$('#trainTable').append(
		"<tr><td id='nameDisplay'>" + childSnapshot.val().name +
		"</td><td id='destinationDisplay'>" + childSnapshot.val().destination +
		"</td><td id='freqDisplay'>" + childSnapshot.val().freq +
		"</td><td id='nextDisplay'>" + moment(nextTrain).format("LT") +
		"</td><td id='awayDisplay'>" + minsAway  + ' minutes' + "</td></tr>");
 },

function(errorObject){
    console.log("Read failed: " + errorObject.code)
});

});