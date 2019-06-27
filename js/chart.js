var charts = {
	lineChart : {
		type : 'line',
		xAxesLabel : 'Year',
		yAxesLabel : 'Value',
		labels : ["2010", "2011", "2012", "2013", "2014", "2015", "2016"],
		datasets : [{
			label : "Foods",
			data: [0, 30, 10, 120, 50, 63, 10]
		},{
			label: "Electronics",
            data: [0, 50, 40, 80, 40, 79, 120],
		}]
	},
	lineChart_background : {
		type : 'line',
		background : true,
		xAxesLabel : '',
		yAxesLabel : '',
		labels : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
		datasets : [{
			label : "My First dataset",
			data: [22, 44, 67, 43, 76, 45, 12]
		},{
			label: "My Second dataset",
            data: [16, 32, 18, 26, 42, 33, 44],
		}]
	},
	singelBarChart : {
		type : 'bar',
		background : true,
		xAxesLabel : '',
		yAxesLabel : '',
		labels : ["Sun", "Mon", "Tu", "Wed", "Th", "Fri", "Sat"],
		datasets : [{
			label : "My First dataset",
			data: [40, 55, 75, 81, 56, 55, 40]
		}]
	},
	doughutChart : {
		type : 'doughnut',
		background : true,
		xAxesLabel : '',
		yAxesLabel : '',
		labels : ["A", "B", "C", "D"],
		datasets : [{
			label : "My First dataset",
			data: [45, 25, 20, 10]
		}]
	},
	barChart : {	
		type : 'bar',
		background : true,
		xAxesLabel : '',
		yAxesLabel : '',
		labels : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
		datasets : [{
			label : "My First dataset",
			data: [65, 59, 80, 81, 56, 55, 40]
		},{
			label: "My Second dataset",
            data: [28, 48, 40, 19, 86, 27, 90],
		}]
	}
}

var COLORS = {
	blue	:	{	hex : '#007bff',	rgb : 'rgba(0, 123, 255, 1)',	light : 'rgba(0, 123, 255, 0.5)'	},
	indigo	:	{	hex : '#6610f2',	rgb : 'rgba(102, 16, 242, 1)',	light : 'rgba(102, 16, 242, 0.5)'	},
	purple	:	{	hex : '#6f42c1',	rgb : 'rgba(111, 66, 193, 1)',	light : 'rgba(111, 66, 193, 0.5)'	},
	pink	:	{	hex : '#e83e8c',	rgb : 'rgba(232, 62, 140, 1)',	light : 'rgba(232, 62, 140, 0.5)'	},
	red		:	{	hex : '#dc3545',	rgb : 'rgba(220, 53, 69, 1)',	light : 'rgba(220, 53, 69, 0.5)'	},
	orange	:	{	hex : '#fd7e14',	rgb : 'rgba(253, 126, 20, 1)',	light : 'rgba(253, 126, 20, 0.5)'	},
	yellow	:	{	hex : '#ffc107',	rgb : 'rgba(255, 193, 7, 1)',	light : 'rgba(255, 193, 7, 0.5)'	},
	green	:	{	hex : '#28a745',	rgb : 'rgba(40, 167, 69, 1)',	light : 'rgba(40, 167, 69, 0.5)'	},
	teal	:	{	hex : '#20c997',	rgb : 'rgba(32, 201, 151, 1)',	light : 'rgba(32, 201, 151, 0.5)'	},
	cyan	:	{	hex : '#17a2b8',	rgb : 'rgba(23, 162, 184, 1)',	light : 'rgba(23, 162, 184, 0.5)'	},
	gray	:	{	hex : '#6c757d',	rgb : 'rgba(108, 117, 125, 1)',	light : 'rgba(108, 117, 125, 0.5)'	}
};

var COLOR_VALUES = Object.values(COLORS);

function plotChart(id, chart) {

	try {		
		var ctx = document.getElementById(id);
		if (ctx) {
		  
		  ctx.height = 200;
		  var datasets = [];
		  
		  var defaultDataset = {
			borderWidth: 2,
			pointStyle: 'circle',
			pointRadius: 3,
			pointBorderColor: 'transparent'
		  };
		  
		  var xAxesDisplay = true;
		  var yAxesDisplay = true;
		  var legendDisplay = false;
		  if(chart.type === 'doughnut') {
			  xAxesDisplay = false;
			  yAxesDisplay = false;
			  legendDisplay = true;
		  } else {
			  legendDisplay = datasets.length > 1
		  }
		  
		  for(var i = 0; i < chart.datasets.length; i++) {
			var dataset = chart.datasets[i];
			Object.assign(dataset, defaultDataset);
			if(chart.type === 'doughnut') {
				dataset.backgroundColor = [];
				dataset.hoverBackgroundColor = [];
				for(var j = 0; j < dataset.data.length; j++) {
					var backgroundColor = COLOR_VALUES[parseInt(Math.random()*10)];
					dataset.backgroundColor.push(backgroundColor.light);
					dataset.hoverBackgroundColor.push(backgroundColor.rgb);
				}
			} else {
				var color = COLOR_VALUES[parseInt(Math.random()*10)];
				dataset.borderColor = color.rgb;
				dataset.pointBackgroundColor = color.rgb;
				if(chart.background) {
					dataset.backgroundColor = color.light;
				} else {
					dataset.backgroundColor = 'transparent';
				}
			}
			datasets.push(dataset);
		  }
		  
		  var myChart = new Chart(ctx, {
			type: chart.type,
			data: {
			  labels: chart.labels,
			  type: chart.type,
			  defaultFontFamily: 'Poppins',
			  datasets: datasets
			},
			options: {
			  responsive: true,
			  tooltips: {
				mode: 'index',
				titleFontSize: 12,
				titleFontColor: '#000',
				bodyFontColor: '#000',
				backgroundColor: '#fff',
				titleFontFamily: 'Poppins',
				bodyFontFamily: 'Poppins',
				cornerRadius: 3,
				intersect: false,
			  },
			  legend: {
				position: 'top',
				display: legendDisplay,
				labels: {
				  usePointStyle: true,
				  fontFamily: 'Poppins',
				},
			  },
			  scales: {
				xAxes: [{
				  display: xAxesDisplay,
				  gridLines: {
					display: false,
					drawBorder: false
				  },
				  scaleLabel: {
					display: true,
					labelString: chart.xAxesLabel,
					fontFamily: "Poppins"
				  },
				  ticks: {
					fontFamily: "Poppins"
				  }
				}],
				yAxes: [{
				  display: yAxesDisplay,
				  gridLines: {
					display: false,
					drawBorder: false
				  },
				  scaleLabel: {
					display: true,
					labelString: chart.yAxesLabel,
					fontFamily: "Poppins"
				  },
				  ticks: {
					beginAtZero: true,
					fontFamily: "Poppins"
				  }
				}]
			  },
			  title: {
				display: false,
				text: 'Normal Legend'
			  }
			}
		  });
		}
	} catch (error) {
		console.log(error);
	}
}

function plotCharts() {
	for(var id in charts) {
		var chart = charts[id];
		if(chart.type === 'line' || chart.type === 'bar' || chart.type === 'doughnut') {
			plotChart(id, chart);
		} else {
			console.log('chart type not supported, id :' + chart.id + ', type : ' + chart.type );
		}
	}
}

plotCharts();