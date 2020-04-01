var tenantSheetUrl = 'https://docs.google.com/spreadsheets/d/1AlyhZ5EGofE-r6U3G0Eoa852ShsI88TPprIMQJ5UwM8/edit#gid=0';

// var paths = window.location.pathname.split('/');
// var app;
// if(paths.length > 1) {
//     app = paths[paths.length-1];
// }


function loadApp() {
    getSheetData(tenantSheetUrl, 1, function(result) {
        config = convertRowsToObj(result.data);
        if(app) {
            filterSheetUrl = config[app].data;
        }
        if(!filterSheetUrl) {
            filterSheetUrl = config['tute'].data;
        }
        loadFilters(filters);
    });
}

loadApp();