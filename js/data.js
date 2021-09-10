
function getData(sheetId, callback) {
	localStorage.clear();
	var googleSpreadsheet = new GoogleSpreadsheet();
	googleSpreadsheet.url(sheetId);
	googleSpreadsheet.load(callback);
}

function getSheetData(sheetId, title, callback) {
	localStorage.clear();
	var googleSpreadsheet = new GoogleSpreadsheet();
	googleSpreadsheet.url(sheetId, title);
	googleSpreadsheet.load(function(result){
		if(!result) {
			console.log('no result')
			return;
		}
		callback(result)
	});
}

function getUrlData(sheetId, url, callback) {
	$.get({
		url : url,
		// headers : { 'Origin' : '*' },
		success : function( response ) {
			window[callback](sheetId, response);
		}
	});
}

function convertRowsToObj(rows) {
	var obj = {};
	var idIndx = -1;
	for (var j=0; j < rows[0].length; j++) {
		if(rows[0][j] == 'id') {
			idIndx = j;
		}
	}
	for (var i=1; i < rows.length; i++) {
		var row = rows[i];
		var rowObj = {};
		for (var j=0; j < row.length; j++) {
			rowObj[rows[0][j]] = row[j];
		}
		obj[row[idIndx]] = rowObj;
	}
	return obj;
}
