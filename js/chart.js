
var charts;

/*
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
	polarAreaChart : {
		type : 'polarArea',
		background : false,
		xAxesLabel : '',
		yAxesLabel : '',
		labels : ["A", "B", "C", "D"],
		datasets : [{
			label : "My First dataset",
			data: [45, 25, 20, 10]
		}]
	}
}
*/

var COLORS = {
	blue	:	{	hex : '#007bff',	hex_light : '#007bff80',	rgb : 'rgba(0, 123, 255, 1)',		rgb_light : 'rgba(0, 123, 255, 0.5)'	},
	purple	:	{	hex : '#6f42c1',	hex_light : '#6f42c180',	rgb : 'rgba(111, 66, 193, 1)',		rgb_light : 'rgba(111, 66, 193, 0.5)'	},
	pink	:	{	hex : '#e83e8c',	hex_light : '#e83e8c80',	rgb : 'rgba(232, 62, 140, 1)',		rgb_light : 'rgba(232, 62, 140, 0.5)'	},
	red		:	{	hex : '#dc3545',	hex_light : '#dc354580',	rgb : 'rgba(220, 53, 69, 1)',		rgb_light : 'rgba(220, 53, 69, 0.5)'	},
	orange	:	{	hex : '#fd7e14',	hex_light : '#fd7e1480',	rgb : 'rgba(253, 126, 20, 1)',		rgb_light : 'rgba(253, 126, 20, 0.5)'	},
	yellow	:	{	hex : '#ffc107',	hex_light : '#ffc10780',	rgb : 'rgba(255, 193, 7, 1)',		rgb_light : 'rgba(255, 193, 7, 0.5)'	},
	green	:	{	hex : '#28a745',	hex_light : '#28a74580',	rgb : 'rgba(40, 167, 69, 1)',		rgb_light : 'rgba(40, 167, 69, 0.5)'	},
	teal	:	{	hex : '#20c997',	hex_light : '#20c99780',	rgb : 'rgba(32, 201, 151, 1)',		rgb_light : 'rgba(32, 201, 151, 0.5)'	},
	cyan	:	{	hex : '#17a2b8',	hex_light : '#17a2b880',	rgb : 'rgba(23, 162, 184, 1)',		rgb_light : 'rgba(23, 162, 184, 0.5)'	},
	gray	:	{	hex : '#6c757d',	hex_light : '#6c757d80',	rgb : 'rgba(108, 117, 125, 1)',		rgb_light : 'rgba(108, 117, 125, 0.5)'	}
};

var COLOR_VALUES = Object.values(COLORS);

function populateDatasetDefaults(chart, dataset, i) {
	
	var defaultDataset = {
		borderWidth: 2,
		pointStyle1: 'circle',
		pointRadius: 3,
		pointBorderColor1: 'transparent'
	};
	
	dataset = Object.assign(dataset, defaultDataset);

	var tileDefaultDataset = {
		borderWidth: 1,
		pointRadius: 1,
		pointHitRadius: 10,
		pointHoverRadius: 2
	};

	if(chart.tile) {
		dataset = Object.assign(dataset, tileDefaultDataset);
	}
	
	if(chart.type === 'doughnut' || chart.type === 'polarArea') {
		dataset.borderColor = [];
		dataset.backgroundColor = [];
		dataset.hoverBackgroundColor = [];
		for(var j = 0; j < dataset.data.length; j++) {
			var backgroundColor = COLOR_VALUES[j];
			if(chart.background) {
				dataset.backgroundColor.push(backgroundColor.rgb_light);
				dataset.hoverBackgroundColor.push(backgroundColor.rgb);
			} else {
				dataset.backgroundColor.push('transparent');
				dataset.borderColor.push(COLOR_VALUES[0].rgb);
				dataset.hoverBackgroundColor.push(COLOR_VALUES[0].rgb);
			}
		}
	} else {
		var color = COLOR_VALUES[i];
		dataset.borderColor = color.rgb;
		dataset.pointBackgroundColor = color.rgb;
		dataset.hoverBackgroundColor = color.rgb;
		if(chart.background) {
			dataset.backgroundColor = color.rgb_light;
		} else {
			dataset.backgroundColor = 'transparent';
		}
	}
}

function plotChart(id, chart, datasets) {

	try {

		if(chart.dataset1datasource === 'URL' && !datasets) {
			var url = chart.dataset1data;
			var callback = chart.dataset1datacallback;
			getUrlData(chart.id, url, callback);
			return;
		}

		var ctx = document.getElementById(id);
		if (ctx) {

			ctx.height = 200;
		  
			if((ch && $(window).width() > 991)) {
				ctx.height = 100;
			}

			if(chart.tile) {
				if($(window).width() > 991){
					ctx.height = 100;
				}
				if($(window).width() <= 991 && $(window).width() > 767){
					ctx.height = 75;
				}
				if($(window).width() <= 767) {
					ctx.height = 50;
				}
			}

			// Datasets
			if(datasets) {
				for(var i = 0; i < datasets.length; i++) {
					var dataset = datasets[i];
					populateDatasetDefaults(chart, dataset, i);
				}
			} else {
				datasets = [];	  
				for(var i = 0; i < chart.datasetscount; i++) {
					var dataset = {
						label : chart['dataset'+(i+1)+'label'],
						data : chart['dataset'+(i+1)+'data'].split(','),
					};
					populateDatasetDefaults(chart, dataset, i);
					datasets.push(dataset);
				}
			}

			if($(window).width() < 991 && datasets[0].data.length >= 8) {
				ctx.height = 300;
			}
		  
			// Options
			var defaultOptions = {
				legend: {
					position: 'top',
					display: false,
					labels: {
						usePointStyle: true,
						fontFamily: 'Poppins',
					},
				},
				responsive: true
			};

			var options = {
				scales: {
					xAxes: [{
						display: chart.xaxeslabel != "",
						gridLines: {
							display: false,
							drawBorder: false
						},
						scaleLabel: {
							display: chart.xaxeslabel != "",
							labelString: chart.xaxeslabel,
							fontFamily: "Poppins"
						},
						ticks: {
							fontFamily: "Poppins"
						}
						}],
					yAxes: [{
						display: chart.yaxeslabel != "",
						gridLines: {
							display: false,
							drawBorder: false
						},
						scaleLabel: {
							display: chart.yaxeslabel != "",
							labelString: chart.yaxeslabel,
							fontFamily: "Poppins"
						},
						ticks: {
							beginAtZero: true,
							fontFamily: "Poppins"
						}
					}]
				},
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
					display: datasets.length > 1
				},
				title: {
					display: false,
					text: 'Normal Legend'
				}
			};

			if(chart.type != 'doughnut' && chart.type != 'polarArea') {
				options = Object.assign(options, defaultOptions);
			}

			// Chart
			var myChart = new Chart(ctx, {
				type: chart.type,
				data: {
					labels: chart.labels.split(','),
					type: chart.type,
					defaultFontFamily: 'Poppins',
					datasets: datasets
				},
				options: options
			});

			}
	} catch (error) {
		console.log('Chart :' + id + ' ' + error);
		console.log(error);
	}
}

function plotCharts() {
	for(var id in charts) {
		var chart = charts[id];
		if(chart.type === 'tile') {
			chart.type = chart.dataset1type;
			chart.tile = true;
		}
		if(chart.type === 'line' || chart.type === 'bar' || chart.type === 'horizontalBar' || chart.type === 'doughnut' || chart.type === 'polarArea') {
			plotChart(id, chart);
		} else {
			console.log('chart type not supported, id :' + chart.id + ', type : ' + chart.type );
		}
	}
}