//Global Variables
var date = [];
var yLabel = ["Acceleration"];
var divValue = 0;









//Parse the data to create a graph with the data
function parseData(createGraph, filename, chartDivName, findPunchesInGraph) {
	Papa.parse(filename, {
		worker: true,
		download: true,
		complete: function (results) {
			createGraph(results.data, chartDivName);
			findPunchesInGraph(results.data, chartDivName);
		}
	});
}

//Parse the data to create a graph with the data
function parseDataTmp(filename, chartDivName) {
	Papa.parse(filename, {
		worker: true,
		download: true,
		complete: function (results) {
			createGraph(results.data, chartDivName);
			findPunchesInGraph(results.data, chartDivName);
		}
	});
}





//Some Code in this function is from https://www.html5rocks.com/en/tutorials/file/dndfiles/
function handleFileSelect(evt) {
	var files = evt.target.files; // FileList object


	div = document.createElement('div');
	div.className = divValue;
	document.getElementsByTagName('body')[0].appendChild(div);


	// files is a FileList of File objects. List some properties 
	var output = [];
	for (var i = 0, f; f = files[i]; i++) {
		output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
			f.size, ' bytes, last modified: ',
			f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
			'</li>');
	}

	//The File Name
	var filenameTest = output[1];
	console.log("Filename Test: " + filenameTest);


	document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';

	parseData(createGraph, output.name, divValue.toString(), findPunchesInGraph);
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);








// Function to Create the Graph 
function createGraph(data, chartDivName) {
	 yLabel = ["Acceleration"];
	 date = [ ];

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

	//Time
	document.getElementById("Time").innerHTML = "Start: " + startSessionTimestamp[1] + "<br>" + "End: " +
		endSessionTimestamp[1] + "<br>";
	
	// Duration 
	document.getElementById("Duration").innerHTML = 
		lengthOfSession[0] + " Hr - " + 
		lengthOfSession[1] + " Min - " +
		lengthOfSession[2] + " Sec " ;

	// var durationLength = new Date(lengthOfSession).getTime();


	// console.log("durationLength" + durationLength);


	return dateTimeObj;
}










//Call the Functions
//parseDataTmp("../data/BTT1.csv", "");
//parseData(createGraph, "../data/BTT1.csv", "", findPunchesInGraph);
//parseData(createGraph, "../data/BTT2.csv", "2", findPunchesInGraph);
