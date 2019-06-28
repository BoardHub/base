
function getData(key, callback) {
	localStorage.clear();
	var googleSpreadsheet = new GoogleSpreadsheet();
	googleSpreadsheet.url(key);
	googleSpreadsheet.load(callback);

}

getData('1U8oVJ0iDZwPmmbE_wlBq4da7iJ0fyumewOwCW9cvxWY', function(result) {
	//$('#results').html(JSON.stringify(result).replace(/,/g,",\n"));
	sections = result.data;
	initLayout();

	getData('1aXy8j8vPMS0e--U9d8XtPyKdPcA-XG8ao9EHKywSMwQ', function(result) {
		//$('#results').html(JSON.stringify(result).replace(/,/g,",\n"));
		charts = result.data;
		plotCharts();	
	});
});