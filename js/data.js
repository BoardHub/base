
function getData(key, callback) {
	localStorage.clear();
	var googleSpreadsheet = new GoogleSpreadsheet();
	googleSpreadsheet.url(key);
	googleSpreadsheet.load(callback);

}


function getUrlData(key, url, callback) {

	$.get({
		url : url,
		// headers : { 'Origin' : '*' },
		success : function( response ) {
			window[callback](key, response);
		}
	});
}

function processNSEData(key, data) {

	var chart = charts[key];
	chart.labels =  data[0].symbol;
	
	var dataset = { label : chart.dataset1label, data : [data[0].netPrice] }; 
	for(var i = 1; i < data.length; i++) {
		var row = data[i];
		chart.labels = chart.labels + ',' + row.symbol;
		dataset.data.push(row.netPrice);
	}
	
	plotChart(key, chart, [ dataset ]);

}

function process91MobileData(key, data) {

	var chart = charts[key];
	chart.labels =  data[0].name;
	
	var dataset = { label : chart.dataset1label, data : [data[0].price] }; 
	for(var i = 1; i < data.length; i++) {
		var row = data[i];
		chart.labels = chart.labels + ',' + row.name;
		dataset.data.push(row.price);
	}
	
	plotChart(key, chart, [ dataset ]);

}


getData('1U8oVJ0iDZwPmmbE_wlBq4da7iJ0fyumewOwCW9cvxWY', function(result) {
	sections = result.data;
	sections = convertRowsToObj(sections);

	getData('1aXy8j8vPMS0e--U9d8XtPyKdPcA-XG8ao9EHKywSMwQ', function(result) {
		charts = result.data;
		charts = convertRowsToObj(charts);
		onDataLoaded();
	});
});

var urlParams = new URLSearchParams(window.location.search);
var ch = urlParams.get('ch');
var br = urlParams.get('br');
if(ch || br) {
	$('.menu-sidebar').remove();
	$('.page-container').css('padding-left', '0px');
}

function onDataLoaded() {
	if(ch) {
		var chart = charts[ch];
		document.title = chart.title || chart.name;
		initChart(ch, chart.name);
		plotChart(ch, chart);
	} else {
		initLayout();
		plotCharts();
	}
		
}

function convertRowsToObj(rows) {
	var obj = {};
	for (var i = 0; i < rows.length; i++ ) {
		var row = rows[i];
		obj[row.id] = row;
	}
	return obj;
}