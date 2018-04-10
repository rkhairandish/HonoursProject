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





// document.getElementById('txtFileUpload').addEventListener('change', upload, false);

// function upload(evt) {

// 	var uploadedData = null;
// 	var uploadedFile = evt.target.files[0];
// 	var reader = new FileReader();
// 	reader.readAsText(uploadedFile);
// 	reader.onload = function (event) {
// 		var csvData = event.target.result;

// 		var uploadedData = Papa.parse(csvData, { header: true });

// 		console.log("this is the data" + uploadedData);

// 	};
// 	reader.onerror = function () {
// 		alert('Unable to read ' + uploadedFile.fileName);
// 	};

// }






// Function to Create the Graph 
function createGraph(data, chartDivName) {
	 yLabel = ["Acceleration"];
	var date = [ ];

				for (var i = 1; i < data.length; i++) {
					date.push(data[i][0]);
					yLabel.push(data[i][2]);
				}
	 chart = c3.generate({
		bindto: "#chart" + chartDivName,
		size: {
			width: 980},
	    data: {
			columns: [yLabel] }, 
		 axis: {
			 x: {


				//  array map to get Time from Date&Time
				 type: 'category', categories: date.map((item) => { return item[11] + 
					 item[12] + 
					 item[13] + 
					 item[14] + 
					 item[15] + item[16] + item[17] + item[18] ;}), 
				     
	    tick: {	multiline: false, culling: { max: 5 } } } },
		// zoom: { enabled: false },
		 point: {
			 show: false
		 },
		legend: { position: 'right' }
	});
	var display = getFirstAndLastDateTime(date);	
}












function findPunchesInGraph(data, chartDivName) {

	//Find Peaks in the Graph
	var slayer = require('slayer');
	var arrayData = yLabel;

	slayer({ minPeakDistance: 1, minPeakHeight: 7}).fromArray(arrayData).then(spikes => {

	  
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
		lengthOfSession[2] + " Sec " ;

	return dateTimeObj;
}










//Call the Functions

parseData(createGraph, "../data/BTT1.csv", "", findPunchesInGraph);
//parseData(createGraph, "../data/L.csv", "", findPunchesInGraph);
//parseData(createGraph, "../data/BTT2.csv", "2", findPunchesInGraph);
//parseData(createGraph, "../data/BTT1.csv", "", findPunchesInGraph);
