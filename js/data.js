
function getData(key, callback) {
	localStorage.clear();
	var googleSpreadsheet = new GoogleSpreadsheet();
	googleSpreadsheet.url(key);
	googleSpreadsheet.load(callback);

}

getData('1U8oVJ0iDZwPmmbE_wlBq4da7iJ0fyumewOwCW9cvxWY', function(result) {
	//$('#results').html(JSON.stringify(result).replace(/,/g,",\n"));
	sections = result.data;

	getData('1aXy8j8vPMS0e--U9d8XtPyKdPcA-XG8ao9EHKywSMwQ', function(result) {
		//$('#results').html(JSON.stringify(result).replace(/,/g,",\n"));
		charts = result.data;
		charts = convertRowsToObj(charts);
		onDataLoaded();
	});
});

var urlParams = new URLSearchParams(window.location.search);
var ch = urlParams.get('ch');
if(ch) {
	$('.menu-sidebar').remove();
	$('.page-container').css('padding-left', '0px');
}

function onDataLoaded() {
	if(ch) {
		var chart = charts[ch];
		document.title = chart.title;
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