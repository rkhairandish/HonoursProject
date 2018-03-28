
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
 


var y = ["Acceleration"];


// Function to Create the Graph 
function createGraph(data, chartDivName) {
	var date = [ "Date + Time --> "];

				for (var i = 1; i < data.length; i++) {
					date.push(data[i][0]);
					y.push(data[i][2]);
				}
//	console.log(date);
//	console.log(y);

	var chart = c3.generate({
		bindto: "#chart" + chartDivName,
	    data: {
	        columns: [ y ] },
	    axis: { x: {  type: 'category', categories: date,       
	    tick: {	multiline: false, culling: { max: 6 } } } },
	    zoom: { enabled: true },
	    legend: { position: 'bottom' }
	});

	
		// Example Output = Number of Punches: 25
}

function findPunchesInGraph(data, chartDivName) {

	//Find Peaks in the Graph
	var slayer = require('slayer');
	var arrayData = y;

	slayer().fromArray(arrayData).then(spikes => {
		console.log(spikes);
		// Example Output = { x: 4, y: 12 }, { x: 12, y: 25 } 

		//for loop to detect punches ie acceleration above 2 
		var realPunches = 0;
		for (var i = 0; i < spikes.length; i++) {
			if (spikes[i].y > 2) {
				realPunches++;
			}
		}
		console.log("Real punches", realPunches)
		document.getElementById("spikes" + chartDivName).innerHTML = realPunches;
	});
}

function circularGraph(data, chartDivName) {
	


	//Circular Progress Bar to Visually Show number of punches
	document.getElementById("NumPunches").innerHTML = realPunches;
	document.getElementById("NumPunches2").innerHTML = realPunches;

}

//Call the Functions
parseData(createGraph, "../data/GeneActiv Data.csv", "", findPunchesInGraph);
parseData(createGraph, "../data/BTT.csv", "2", findPunchesInGraph);
