var tenantSheetUrl = 'https://docs.google.com/spreadsheets/d/1AlyhZ5EGofE-r6U3G0Eoa852ShsI88TPprIMQJ5UwM8/edit#gid=0';
var config;
// var paths = window.location.pathname.split('/');
// var app;
// if(paths.length > 1) {
//     app = paths[paths.length-1];
// }


function loadApp() {

    getSheetData(tenantSheetUrl, 1, function(result) {
        var configs = convertRowsToObj(result.data);
        if(app) {
            config = configs[app];
        }
        if(!config) {
            config = configs['tute'];
        }
        
        initNav();
        initHeader();
        initFooter();

        if(config.filter == 'Y') {
            loadFilters(config.layout);
        } else {
            loadData(config.data);
        }
        
    });
}

loadApp();