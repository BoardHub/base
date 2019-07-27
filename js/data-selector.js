
var sectionUrl = prompt('Enter Section URL') || 'https://docs.google.com/spreadsheets/d/155i7b3vhsVUSoQlBrQZpAwX6vXX1JXIlPqpACWP0Xt4/edit#gid=0';
var chartUrl = prompt('Enter Chart URL' ) || 'https://docs.google.com/spreadsheets/d/1q8MWcPfdGTRXOPScSaoxKes-GlygqG-7Fr_pKCzroEA/edit#gid=1647689125';

getData(sectionUrl, function(result) {
	sections = result.data;
	sections = convertRowsToObj(sections);

	getData(chartUrl, function(result) {
		charts = result.data;
		charts = convertRowsToObj(charts);
		onDataLoaded();
	});
});