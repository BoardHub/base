var spreadSheetUrl = 'https://docs.google.com/spreadsheets/d/1nTDr5cIAFvJhUEBmqgMXia9R703viC08wUXUa6lOJ6w/edit';

var filters;
var filtersOptions = {};

getSheetData(spreadSheetUrl, 1, function(result) {
    filters = result.data;
    buildFilters(filters);
});

function buildFilters(filters) {

    var selector = '';
    selector += '<form class="form-header row" onsubmit="return false;">';
    for (let index = 0; index < filters.length; index++) {
        const filter = filters[index];
        selector += buildFilter(filter);
    }
    selector += '</form>';
    $('.section__content').prepend($(selector));

    buildFiltersOptions(filters);
}


function buildFilter(filter) {
    var selector = '';
    selector += '	<select id="' + filter.id + '" class="form-control-lg form-control col-sm-12 col-lg-6" onchange="onFilterChange()">';
    selector += '	</select>';
    return selector;
}

let index = 0;
function buildFiltersOptions(filters) {
    if(index < filters.length) {
        getSheetData(spreadSheetUrl, index + 2, function(result) {
            buildFilterOptions(filters[index], result.data);
            index++;
            buildFiltersOptions(filters);
        });
    }
}

function buildFilterOptions(filter, filterOptions) {
    filtersOptions[filter.id] = filterOptions;
    var options = '<option value="0" selected>Select ' + filter.name +'</option>';
    if(!filter.parent) {
        for (let index = 0; index < filterOptions.length; index++) {
            filterOption = filterOptions[index];
            options += '<option value="' + filterOption.id +'">' + filterOption.name + '</option>';
        }
    }

    $('#'+filter.id).append($(options));
}

function onFilterChange() {

    var changedFilterId = event.target.id;
    var changedFilterOptionId = $('#'+ changedFilterId).val();

    for (let index = 0; index < filters.length; index++) {
        
        const filter = filters[index];
        if(filter.parent == changedFilterId) {
            
            var options = '<option value="0" selected>Select ' + filter.name +'</option>';
            
            var filterOptions = filtersOptions[filter.id];
            for (let index = 0; index < filterOptions.length; index++) {

                filterOption = filterOptions[index];
                if(filterOption.parent == changedFilterOptionId) {
                    options += '<option value="' + filterOption.id +'">' + filterOption.name + '</option>';
                }
            }

            $('#'+filter.id).empty();
            $('#'+filter.id).append($(options));
        
        } else if (filter.id == changedFilterId && filter.data == 'TRUE') {
            
            var filterOptions = filtersOptions[filter.id];
            for (let index = 0; index < filterOptions.length; index++) {
                filterOption = filterOptions[index];
                if(filterOption.id == changedFilterOptionId) {
                    spreadSheetUrl = filterOption.data;
                    loadData();
                }
            }
        }
    }

}