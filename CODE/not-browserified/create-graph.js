//Global Variables
var realPunches = 0;
var y = ["Acceleration"];








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
	var date = [ "Date + Time --> "];

				for (var i = 1; i < data.length; i++) {
					date.push(data[i][0]);
					y.push(data[i][2]);
				}

	var chart = c3.generate({
		bindto: "#chart" + chartDivName,
	    data: {
	        columns: [ y ] },
	    axis: { x: {  type: 'category', categories: date,       
	    tick: {	multiline: false, culling: { max: 6 } } } },
	    zoom: { enabled: true },
	    legend: { position: 'bottom' }
	});
}








function findPunchesInGraph(data, chartDivName) {

	//Find Peaks in the Graph
	var slayer = require('slayer');
	var arrayData = y;

	slayer().fromArray(arrayData).then(spikes => { 

		//for loop to detect punches ie acceleration above 2 
		var realPunches = 0;
		for (var i = 0; i < spikes.length; i++) {
			if (spikes[i].y > 2) {
				realPunches++;
			}
		}
		console.log("Real punches", chartDivName, "    " , realPunches)
		circularGraph(realPunches, chartDivName);
	});
}








function circularGraph(punches, chartDivName) {
	
	//Circular Progress Bar to Visually Show number of punches
	document.getElementById("NumPunches" + chartDivName).innerHTML = punches;
}








//Call the Functions
parseData(createGraph, "../data/GeneActiv Data.csv", "", findPunchesInGraph);
parseData(createGraph, "../data/BTT.csv", "2", findPunchesInGraph);
