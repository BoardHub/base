var tenantSheetUrl = 'https://docs.google.com/spreadsheets/d/1AlyhZ5EGofE-r6U3G0Eoa852ShsI88TPprIMQJ5UwM8/edit#gid=0';
var config;

var paths = window.location.pathname.split('/');
var tenant;
if(paths.length > 1) {
    tenant = paths[1];
}

function loadApp() {

    getSheetData(tenantSheetUrl, 1, function(result) {
        var configs = convertRowsToObj(result.data);
        if(tenant) {
            config = configs[tenant];
        }
        if(!config) {
            config = configs['default'];
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