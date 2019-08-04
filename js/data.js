
function getData(key, callback) {
	localStorage.clear();
	var googleSpreadsheet = new GoogleSpreadsheet();
	googleSpreadsheet.url(key);
	googleSpreadsheet.load(callback);
}

function getSheetData(key, sheetNo, callback) {
	localStorage.clear();
	var googleSpreadsheet = new GoogleSpreadsheet();
	googleSpreadsheet.url(key, sheetNo);
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

function onDataLoaded() {
	if(ch) {
		var chart = charts[ch];
		document.title = chart.name;
		initChart(ch, chart.desc || chart.name);
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