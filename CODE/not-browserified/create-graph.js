
/* Parse the data and create a graph with the data.*/

function parseData(createGraph) {
	Papa.parse("../data/GeneActiv Data.csv", {
		download: true,
		complete: function(results) {
			createGraph(results.data);
		}
	});
}

/* Function to Create the Graph */
function createGraph(data) {
	var date = [];
	var y = ["Y Acceleration Coordinate  "];

	for (var i = 1; i < data.length; i++) {
		date.push(data[i][0]);
		y.push(data[i][2]);
	}

	console.log(date);
	console.log(y);

	var chart = c3.generate({
		bindto: '#chart',
	    data: {
	        columns: [
	        	y
	        ]
	    },
	    axis: {
        x: {
            type: 'category',
	            categories: date,       
	            tick: {
	              	multiline: false,
                	culling: {
                     	max: 6
                 	}
            	 }
	        }
	    },
	    zoom: {
        	enabled: true
    	},
	    legend: {
	        position: 'bottom'
		}
	});

	var slayer = require('slayer');
	var arrayData = y;

	slayer().fromArray(arrayData).then(spikes => {
		console.log(spikes);
		document.getElementById("spikes").innerHTML = "Number of Punches thrown: " + spikes.length;     // [ { x: 4, y: 12 }, { x: 12, y: 25 } ] 
	});

}

parseData(createGraph);














