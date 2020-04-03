var filterSheetUrl; //= 'https://docs.google.com/spreadsheets/d/1nTDr5cIAFvJhUEBmqgMXia9R703viC08wUXUa6lOJ6w/edit';
var dataSheetUrl;

var filters;
var filtersOptions = [];

function loadFilters() {
    getSheetData(filterSheetUrl, 2, function(result) {
        filters = result.data;
        buildFilters(filters);
    });
}

function buildFilters(filters) {

    var form = '';
    form += '<form class="form-header row p-t-10 m-l-5 m-r-5" onsubmit="return false;">';
    form += '</form>';
    form = $(form);
    $('.main-content > .section__content').prepend(form);

    for (let index = 0; index < filters.length; index++) {
        const filter = filters[index];
        var select = $(buildFilter(filter));
        if(filter.type == 'SECTION') {
            select.hide();
        }
        form.append(select);
    }

    buildParentFiltersOptions(filters);
}


function buildFilter(filter) {
    var size = 'col-6';
    if(filter.type == 'SECTION') {
        size = 'col-12';
    }
    var selector = '';
    selector += '	<select id="' + filter.id + '" class="' + filter.type + '-filter 1form-control-lg form-control ' + size + '" onchange="onFilterChange()">';
    selector += '       <option value="0" selected>Select ' + filter.name +'</option>';
    selector += '	</select>';
    return selector;
}

function buildParentFiltersOptions() {
    getSheetData(filterSheetUrl, 3, function(result) {        
        filtersOptions = result.data;
        for (let index = 0; index < filtersOptions.length; index++) {
            filtersOption = filtersOptions[index];
            if(!filtersOption.parent) {
                var option = '<option value="' + filtersOption.id +'">' + filtersOption.name + '</option>';
                $('#'+filtersOption.filterid).append($(option));
            }
        }
    });
}

function onFilterChange() {

    var changedFilterId = event.target.id;
    var changedFilterOptionId = $('#'+ changedFilterId).val();

    for (let index = 0; index < filters.length; index++) {

        const filter = filters[index];

        if(filter.parent == changedFilterId) {

            if(filter.type == 'SECTION') {
                $('.form-header .SECTION-filter').empty();
                $('.form-header .SECTION-filter').hide();
            } else {
                var options = '<option value="0" selected>Select ' + filter.name +'</option>';
                
                for (let index = 0; index < filtersOptions.length; index++) {
                    var filtersOption = filtersOptions[index];
                    if(filtersOption.parent == changedFilterOptionId) {
                        options += '<option value="' + filtersOption.id +'">' + filtersOption.name + '</option>';
                    }
                }
    
                $('#' + filter.id).empty();
                $('#' + filter.id).append($(options));
            }
            
        } else if (filter.id == changedFilterId) {

            if(filter.type == 'DATA') {
                
                for (let index = 0; index < filtersOptions.length; index++) {
                    var filtersOption = filtersOptions[index];
                    if(filtersOption.id == changedFilterOptionId) {
                        dataSheetUrl = filtersOption.data;
                        if(dataSheetUrl) {
                            loadData();
                        } else {
                            clearData();
                        }
                    }
                }

            } else if (filter.type == 'SECTION') {
                showSection();
            }
            
        } 
    }

}

function loadData() {
    getSheetData(dataSheetUrl, 1, function(result) {
        sections = result.data;
        sections = convertRowsToObj(sections);

        getSheetData(dataSheetUrl, 2, function(result) {
            widgets = result.data;
            widgets = convertRowsToObj(widgets);
            onDataLoaded();
        });
    });
}

function clearData() {
    $('.form-header .SECTION-filter').empty();
    $('.form-header .SECTION-filter').hide();
    $('#nav-content').empty();
}

function showSection() {
    var select = $(event.target);
    sectionId = select.val();
    $('#nav-content .active').removeClass('active');
    $("#nav-"+sectionId).addClass("active");
}