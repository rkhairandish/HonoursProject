
/* Parse the data and create a graph with the data.*/

function parseData(createGraph) {
	Papa.parse("../data/test.csv", {
		download: true,
		complete: function(results) {
			findPeaks(results.data);
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
}

function findPeaks(data) {
	var peak;
	var counter = 0;

  return data.reduce(function(peaks, val, i) {
    if (data[i+1] > data[i]) {
      peak = data[i+1];
    } else if ((data[i+1] < data[i]) && (typeof peak === 'number')) {
      peaks.push(peak);
      peak = undefined;
		}
		console.log("this is peak" + peak);
    return peaks;
	}, []);

}


//when peak found add 1 to counter ie ++Counter


parseData(createGraph);














