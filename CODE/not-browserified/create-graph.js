//Global Variables
var date = [];
var yLabel = ["Acceleration"];









//Parse the data to create a graph with the data
function parseData(createGraph, filename, chartDivName, findPunchesInGraph) {
	Papa.parse(filename, {
		worker: true,
		download: true,
		complete: function(results) {
			createGraph(results.data, chartDivName);
			findPunchesInGraph(results.data, chartDivName);
		}
	});
}





// Function to Create the Graph 
function createGraph(data, chartDivName) {
	 yLabel = ["Acceleration"];
	var date = [ "Date + Time -> "];

				for (var i = 1; i < data.length; i++) {
					date.push(data[i][0]);
					yLabel.push(data[i][2]);
				}
	 chart = c3.generate({
		bindto: "#chart" + chartDivName,
		size: {
			width: 980},
	    data: {
			columns: [ yLabel ] }, 
	    axis: { x: {  type: 'category', categories: date,       
	    tick: {	multiline: false, culling: { max: 6 } } } },
	    zoom: { enabled: true },
		legend: { position: 'bottom' }
	});
	var display = getFirstAndLastDateTime(date);
	
}










function findPunchesInGraph(data, chartDivName) {

	//Find Peaks in the Graph
	var slayer = require('slayer');
	var arrayData = yLabel;

	slayer().fromArray(arrayData).then(spikes => {

		//  minPeakDistance = 10;
		//for loop to detect punches ie acceleration above 6 
		var realPunches = 0;
		for (var i = 0; i < spikes.length; i++) {
			if (spikes[i].y > 5) {
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

		//for loop to detect acceleration above 5G
		var gAccelerationAmount = 0;
		var numberOfRealPunches = 0;

		for (var i = 0; i < spikes.length; i++) {
			if (spikes[i].y > 5) {
				numberOfRealPunches++
				gAccelerationAmount += Number(spikes[i].y);
			} 
		} var avg = gAccelerationAmount/numberOfRealPunches;

		document.getElementById("Avg Punches" + chartDivName).innerHTML = avg.toFixed(2);
	});
}















function circularGraph(punches) {
	//Circular Progress Bar to Visually Show number of punches
	var elements = document.getElementsByClassName("c100 p100");
	

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










function getFirstAndLastDateTime(date) {
	
	//Function to Get The First and Last Date/Time information from the data
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

	//Gets Duration of the Session by taking away the start of session time with the end of session time
	var lengthOfSession = [];

			for (var i = 0; i < splitStartTime.length; i++){
				 lengthOfSession.push(Math.abs(splitStartTime[i] - splitEndTime[i]));
			}



	//Date
		var splicedstartSessionTimestamp = startSessionTimestamp.slice(0,1);
	    document.getElementById("DisplayDate").innerHTML = splicedstartSessionTimestamp;

	// Time
	document.getElementById("Time").innerHTML = "Start: " + startSessionTimestamp[1] + "<br>" + "End: " +
		endSessionTimestamp[1] + "<br>";
	
	// Duration
	document.getElementById("Duration").innerHTML = 
		lengthOfSession[0] + " Hr - " + 
		lengthOfSession[1] + " Min - " +
		lengthOfSession[2] + " Sec - " +
		lengthOfSession[3] + " Ms" ;

	// var start = splitStartTime[0];
	// var end = splitEndTime[1];
	//  document.getElementById("diff").innerHTML = diff(start, end);

	return dateTimeObj;
}



// function diff(start, end) {

// 	start = start.split(":");
// 	end = end.split(":");
// 	var startDate = new Date(0, 0, 0, start[0], start[1], 0);
// 	var endDate = new Date(0, 0, 0, end[0], end[1], 0);
// 	var diff = endDate.getTime() - startDate.getTime();
// 	var hours = Math.floor(diff / 1000 / 60 / 60);
// 	diff -= hours * (1000 * 60 * 60);
// 	var minutes = Math.floor(diff / 1000 / 60);
// 	diff -= minutes * (1000 * 60);
// 	var seconds = Math.floor(diff / 1000);

// 	return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes + ":" + (seconds <= 9 ? "0" : "") +  seconds;
// } 





//Call the Functions

parseData(createGraph, "../data/BTT1.csv", "", findPunchesInGraph);
//parseData(createGraph, "../data/BTT3.csv", "2", findPunchesInGraph);
//parseData(createGraph, "../data/BTT3.csv", "3", findPunchesInGraph);

