//Global Variables
var date = [];
var yLabel = ["Acceleration"];
var divValue = 0;


//Upload CSV files 
document.getElementById('txtFileUpload').addEventListener('change', upload, false);

function upload(data) {
	var uploadedData = null;
	var uploadedFile = data.target.files[0];
	var reader = new FileReader();

	div = document.createElement('div');
	div.className = "chart" + divValue;
	document.getElementsByTagName('body')[0].appendChild(div);

	
	reader.readAsText(uploadedFile);
	reader.onload = function (event) {
		
		var csvData = event.target.result;
	
		var papaParseData = Papa.parse(csvData);	

		
		//parseData(createGraph, " ", divValue.toString(), findPunchesInGraph);
		
		var divNumber = divValue.toString();
		console.log("divValue: ", divValue, divNumber)
		
		createGraph(papaParseData, divNumber);
		findPunchesInGraph(papaParseData, divNumber);
		getAvgSpeedOfPunches(papaParseData);
		
		divValue++; 
		

	};
	reader.onerror = function () {
		alert('Unable to read ' + uploadedFile.fileName);
	};
}



// Function to Create the Graph 
function createGraph(data, chartDivName) {
	
	yLabel = ["Acceleration"];
	 date = [ ];

	 //PapaPased into array with 3 sub-elements [0] = Date, [1] = X Axis and [2] = Y Axis 
	 for (var i = 1; i < data.data.length; i++) {
		 date.push(data.data[i][0]);
		 yLabel.push(data.data[i][2]);
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

	console.log("chartDivName: ", chartDivName)

	document.getElementsByClassName("chart" + chartDivName)[0].innerHTML = chart;



	findPunchesInGraph(data, chartDivName);
	getFirstAndLastDateTime(data); 
}












function findPunchesInGraph(data, chartDivName) {


	//Find Peaks in the Graph
	var slayer = require('slayer');
	var arrayData = yLabel;

	
	slayer({ minPeakDistance: 1, minPeakHeight: 7}).fromArray(arrayData).then(spikes => {
		
		
		//for loop to detect punches ie acceleration above 5 
		var realPunches = 0;
		
		for (var i = 0; i < spikes.length; i++) {
			if (spikes[i].y > 5) {
				realPunches++;
			}
		}
		
		//Index Graph
		var toAdd = document.createDocumentFragment();
		div = document.createElement('NumPunches');
		div.className = divValue;
		document.getElementsByTagName('body')[0].appendChild(div);
		document.getElementById("NumPunches").innerHTML = realPunches;

		//Versus Graph
		var toAdd = document.createDocumentFragment();
		div = document.createElement('VersusNumPunches');
		div.className = divValue;
		document.getElementsByTagName('body')[0].appendChild(div);
		document.getElementById("VersusNumPunches").innerHTML = realPunches;



		//Calls the function
		circularGraph(realPunches);
	});
}









function getAvgSpeedOfPunches(data) {

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

		//Index Avg
		var toAdd = document.createDocumentFragment();
		div = document.createElement('AvgPunches');
		div.className = divValue;
		document.getElementsByTagName('body')[0].appendChild(div);
		document.getElementById("AvgPunches").innerHTML = avg.toFixed(2);

		//Versus Avg
		var toAdd = document.createDocumentFragment();
		div = document.createElement('VersusAvgPunches');
		div.className = divValue;
		document.getElementsByTagName('body')[0].appendChild(div);
		document.getElementById("VersusAvgPunches").innerHTML = avg.toFixed(2);


		
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





//FOR UPLOAD 
function getFirstAndLastDateTime(date) {
		
	//Function to Get The First and Last Date/Time information from the data
	var elements = document.getElementsByClassName("Date/Time");
	
	
	var startSessionTimestamp = date.data[1];
	var endSessionTimestamp = date.data[date.data.length - 1][0];
	
	
	var splitStartTime = startSessionTimestamp;
	var splitEndTime = endSessionTimestamp;
	

	startSessionTimestamp = startSessionTimestamp[0].split(" ");
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

	 var durationLength = new Date(lengthOfSession).getTime();


	return dateTimeObj;
}