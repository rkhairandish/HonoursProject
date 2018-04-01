//Global Variables
var yLabel = ["Acceleration"];
var date = [];









//Parse the data to create a graph with the data
function parseData(createGraph, filename, chartDivName, findPunchesInGraph) {
	Papa.parse(filename, {
		download: true,
		complete: function(results) {
			createGraph(results.data, chartDivName);
			findPunchesInGraph(results.data, chartDivName);
		}
	});
}
 












// Function to Create the Graph 
function createGraph(data, chartDivName) {
	var date = [ "Date + Time -> "];

				for (var i = 1; i < data.length; i++) {
					date.push(data[i][0]);
					yLabel.push(data[i][2]);
				}

	var chart = c3.generate({
		bindto: "#chart" + chartDivName,
		size: {
			width: 980},
	    data: {
			columns: [ yLabel ] }, 

		colors: {
			"y": '#000000'
		},
		legend: {
			colors: {
				'y': '#000'
			}
		},
	    axis: { x: {  type: 'category', categories: date,       
	    tick: {	multiline: false, culling: { max: 6 } } } },
	    zoom: { enabled: true },
		legend: { position: 'bottom' }
	});
	var display = firstAndLast(date);
}











function findPunchesInGraph(data, chartDivName) {

	//Find Peaks in the Graph
	var slayer = require('slayer');
	var arrayData = yLabel;

	slayer().fromArray(arrayData).then(spikes => { 

		//for loop to detect punches ie acceleration above 2 
		var realPunches = 0;
		for (var i = 0; i < spikes.length; i++) {
			if (spikes[i].y > 2) {
				realPunches++;
			}
		}

		document.getElementById("NumPunches" + chartDivName).innerHTML = realPunches;

		//Calls the function
		circularGraph(realPunches);
		getAvgSpeedOfPunches(spikes, chartDivName);
	});
}










function getAvgSpeedOfPunches(data, chartDivName) {

	//Find Peaks in the Graph
	var slayer = require('slayer');
	var dataFromArray = yLabel;


	slayer().fromArray(dataFromArray).then(spikes => {

		//for loop to detect acceleration above 7G
		var gAccelerationAmount = 0;
		var numberOfRealPunches = 0;

		for (var i = 0; i < spikes.length; i++) {
			if (spikes[i].y > 2) {
			//	console.log("Spikes" + spikes[i].y)
				numberOfRealPunches++
				gAccelerationAmount += Number(spikes[i].y);
			} 
		} var avg = gAccelerationAmount/numberOfRealPunches;

		// console.log("gAccelerationAmount", gAccelerationAmount, " numberOfRealPunches   ", numberOfRealPunches)
		// console.log("Avg Punches", chartDivName, "    ", avg)

		document.getElementById("Avg Punches" + chartDivName).innerHTML = avg.toFixed(2);
	});
}













function circularGraph(punches) {
	//Circular Progress Bar to Visually Show number of punches
	var elements = document.getElementsByClassName("c100 p100 ");
	

for (i = 0; i < elements.length; i++) {
	
	if (punches < 30){   					//Less than 30 punches = red
		elements[i].className = "c100 p100 center red";
	} else if (punches > 60){				//More than 60 Punches = green
		elements[i].className = "c100 p100 center green";
	}
	  else {								//Inbetween 30 - 60 punches = orange
		elements[i].className = "c100 p100 center orange";	
	  }
	} 
}




function firstAndLast(date) {

var elements = document.getElementsByClassName("Date/Time");

	

	var startSessionTimestamp = date[1];
	var endSessionTimestamp = date[date.length - 1];

	var splitStartTime = startSessionTimestamp;
	var splitEndTime = endSessionTimestamp;


	startSessionTimestamp = startSessionTimestamp.split(" ");
	endSessionTimestamp = endSessionTimestamp.split(" ");
	
	splitStartTime = startSessionTimestamp[1].split(":");
	splitEndTime = endSessionTimestamp[1].split(":"); 

	var dateTimeObj = {
		firstDateTime: startSessionTimestamp,
		lastDateTime: endSessionTimestamp,
	}
//	console.log("split : " + splitStartTime + " " + splitEndTime);

	var lengthOfSession = [];

	for (var i = 0; i < splitStartTime.length; i++){

		 lengthOfSession.push(Math.abs(splitStartTime[i] - splitEndTime[i]));

	}
	
	// console.log("Length" + lengthOfSession);
	document.getElementById("Date/Time").innerHTML = "Start of Session: " + startSessionTimestamp[1] + "<br>" + "End of Session: " + 
		endSessionTimestamp[1] + "<br>" +
		"Duration (Hr, Min, Sec, Milli): " +
		lengthOfSession[0] + " : " +
		lengthOfSession[1] + " : " +
		lengthOfSession[2] + " : " +
		lengthOfSession[3];

	return dateTimeObj;
}















//Call the Functions
parseData(createGraph, "../data/GeneActiv Data.csv", "", findPunchesInGraph);
parseData(createGraph, "../data/BTT.csv", "2", findPunchesInGraph );
