var layoutSheetUrl;
var dataSheetUrl;

var filters;
var filtersOptions = [];

function loadFilters(layoutSheetUrl) {
    this.layoutSheetUrl = layoutSheetUrl;
    getSheetData(layoutSheetUrl, 'filters', function(result) {
        filters = convertRowsToObj(result.data);
        buildFilters(filters);
    });
}

function buildFilters(filters) {

    var form = '';
    form += '<form class="form-header row p-t-10 m-l-5 m-r-5 m-b-0" onsubmit="return false;">';
    form += '</form>';
    form = $(form);
    $('.main-content > .section__content').prepend(form);

    for (let filterId in filters) {
        const filter = filters[filterId];
		
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
    selector += '	<select id="' + filter.id + '" class="' + filter.type + '-filter 1form-control-lg 1form-control ' + size + '" onchange="onFilterChange()">';
    selector += '       <option value="0" selected>Select ' + filter.name +'</option>';
    selector += '	</select>';
    return selector;
}

function buildParentFiltersOptions() {
    getSheetData(layoutSheetUrl, 'options', function(result) {        
        filtersOptions = convertRowsToObj(result.data);
        for (let filtersOptionId in filtersOptions) {
            filtersOption = filtersOptions[filtersOptionId];
			
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

    for (let filterId in filters) {
        const filter = filters[filterId];

        if(filter.parent == changedFilterId) {

            if(filter.type == 'SECTION') {
                $('.form-header .SECTION-filter').empty();
                $('.form-header .SECTION-filter').hide();
            } else {
                var options = '<option value="0" selected>Select ' + filter.name +'</option>';
                
				for (let filtersOptionId in filtersOptions) {
					filtersOption = filtersOptions[filtersOptionId];
					
                    if(filtersOption.parent == changedFilterOptionId) {
                        options += '<option value="' + filtersOption.id +'">' + filtersOption.name + '</option>';
                    }
                }
    
                $('#' + filter.id).empty();
                $('#' + filter.id).append($(options));
            }
            
        } else if (filter.id == changedFilterId) {

            if(filter.type == 'DATA') {
                
				for (let filtersOptionId in filtersOptions) {
					filtersOption = filtersOptions[filtersOptionId];
                    if(filtersOption.id == changedFilterOptionId) {
                        if(filtersOption.data) {
                            loadData(filtersOption.data);
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

function loadData(dataSheetUrl) {
    this.dataSheetUrl = dataSheetUrl;
    getSheetData(dataSheetUrl, 'sections', function(result) {
        sections = result.data;
        sections = convertRowsToObj(sections);

        getSheetData(dataSheetUrl, 'widgets', function(result) {
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
