// var navSheetUrl = 'https://docs.google.com/spreadsheets/d/1nTDr5cIAFvJhUEBmqgMXia9R703viC08wUXUa6lOJ6w/edit';

// var navs;
var sections;
var widgets;

var plotters = {};
var layouts = {};

/*
var sections = [{
	id : "cricket",
	name : "Cricket",
	state : 'active',
	icon : 'fa-baseball-ball',
	charts : [{
		id : "lineChart",
		name : "Line Chart"
	},{
		id : "lineChart_background",
		name : "Line Chart - Background"
	}]
},{
	id : "politics",
	name : "Politics",
	icon : 'fa-flag-checkered',
	charts : [{
		id : "singelBarChart",
		name : "Single Bar Chart"
	},{
		id : "barChart",
		name : "Bar Chart"
	}]
},{
	id : "bollywood",
	name : "Bollywood",
	icon : 'fa-film',
	charts : [{
		id : "doughutChart",
		name : "Doughut Chart"
	},{
		id : "polarAreaChart",
		name : "Polar Area Chart"
	}]
}];

*/
var paths = window.location.pathname.split('/');
var referer = paths[paths.length-1];
var app = paths[paths.length-2];

var urlParams = new URLSearchParams(window.location.search);
var wd = urlParams.get('wd');
var ch = urlParams.get('ch');
var br = urlParams.get('br');
// if(wd || ch || br) {
initNav();
// }

initHeader();

function initNav() {

    // getSheetData(navSheetUrl, 1, function(result) {
    //     navs = result.data;
    //     buildNav(navs);
    // });

    // if($(window).width() > 575) {
    //$('.menu-sidebar').remove();
    //$('.page-container').css('padding-left', '0px');
    // } else {
    $('.hamburger').remove();
    // }
    
}

function initHeader() {

    var headerDesktop = $('.header-desktop');

    if($(window).width() > 575) {
        headerDesktop.css('background', 'white');
        $('.page-container').css('padding-top', ( headerDesktop.height() + 10 ) + 'px');
        $('.menu-sidebar .logo').css('margin-left', '-35px');
        $('.menu-sidebar .logo .icon ').css('padding-right', '10px');
    } else {
        headerDesktop.remove();
        $('.page-container').css('padding-top', '1px');
        $('.logo').css('margin-top', '-7px');
        $('.logo').css('margin-left', '-15px');
    }

    $('.page-container').css('padding-bottom', '60px');

}

function buildNav(navs) {

    var navItems = '';

    for (var id in navs) {
        var nav = navs[id];
        navItems +='<a class="js-arrow nav-item nav-link '+(nav.state || '')+'" id="nav-'+nav.id+'-tab" data-toggle="tab" href="#nav-'+nav.id+'" role="tab" aria-controls="nav-'+nav.id+'" aria-selected="false"><i class="fas '+nav.icon+' m-r-20"></i>'+nav.name + '</a>';
    }

    $('#nav-menu').empty();
	$('#nav-menu').append($(navItems));
}

function onDataLoaded() {

    //if(Object.keys(sections).length == 1) {
    //    initNav();
    //}

    if(wd && (widget = widgets[wd])) {
        document.title = widget.name;
        initWidget(wd, widget, 12);
        plotWidget(wd, widget);
    } 
    // ToDo : Use init/plot Widget
    // else if(ch && (chart = charts[ch])) {
	// 	document.title = chart.name;
	// 	initWidget(ch, chart, 12);
	// 	plotChart(ch, chart);
    // } 
    else {
        initLayout();
        // ToDo : Convert to plotWidgets
		//plotCharts();
	}
}

function initLayout() {
	
    var content = '';
    var sectionOptions = '';

	for (var id in sections) {

        var section = sections[id];
        
        var sectionSelected = section.state == 'active' ? 'selected' : '';
        sectionOptions += '<option value="' + section.id +'" ' + sectionSelected + '>' + section.name + '</option>';

		content += '<div class="row tab-pane fade '+ (section.state || '')+' show" id="nav-'+section.id+'" role="tabpanel" aria-labelledby="nav-'+section.id+'-tab">';
		content += '    <h1 class="col-lg-12 title-1 m-t-10 m-l-5 m-r-5">' + (section.desc || section.name) + '</h1>';        
		content += '</div>';
    }
    
    $('.form-header .SECTION-filter').empty();
    $('.form-header .SECTION-filter').append($(sectionOptions));
    $('.form-header .SECTION-filter').show();

	$('#nav-content').empty();
    $('#nav-content').append($(content));
    
    for(var widgetId in widgets) {
        var widget = widgets[widgetId];
        var size = 6;	
        if(widget.size) {
            size = widget.size;
        }
        var widgetLayout = getWidgetLayout(widgetId, widget, size);
        if(widgetLayout) {
            $('#nav-' + widget.section).append(widgetLayout);
        }
    }

};

function initWidget(widgetId, widget) {
	var content = '';
	content += '<div class="row">';
	content += getWidgetLayout(widgetId, widget, 12)
	content += '</div>';
	$('#nav-content').append($(content));
}

function getWidgetLayout(widgetId, widget, size) {
	var layout = layouts[widget.type];
	if(layout) {
	    return window[layout](widgetId, widget, size);
	} else if(widget.type == 'event') { // ToDo : create event plotter
		return getEventLayout(widgetId, widget, size);
	} else { // defaults to 'chart' | ToDo : create chart plotter
		return getChartLayout(widgetId, widget, size);
	}
}

function plotWidget(widgetId, widget) {
    var plotter = plotters[widget.type];
    if(plotter) {
        eval(plotter)(widget);
    } else {
        console.log('No plotter registered for type : ' + widget.type);
    }
    
}

layouts['preview'] = 'getPreviewLayout';
layouts['video'] = 'getPreviewLayout';

function getPreviewLayout(id, preview, size) {
	var previewLayout = '';
	previewLayout += '<div class="col-lg-'+size+' m-t-10">';
	previewLayout += '	<div class="row m-l-5 m-r-5">';
	previewLayout += '		<div class="col-lg-3 card">';
	previewLayout += '			<img class="" src="' + preview.cover + '">';
	previewLayout += '		</div>';
	previewLayout += '		<div class="col-lg-9 card">';
	previewLayout += '			<div class="card-body">';
    previewLayout += '			<h4 class="card-title mb-3">' + preview.name;
	if(preview.link) {
        previewLayout += '			<button type="button" class="float-right fas fa-play" data-toggle="modal" data-target="#modalDialog" data-link="' + preview.link +'"></button>';
    }
    previewLayout += '          </h4>';
	previewLayout += '				<p class="card-text">' + preview.desc + '</p>';
	previewLayout += '			</div>';
	previewLayout += '		</div>';
	previewLayout += '	</div>';
	previewLayout += '</div>';
	return previewLayout;	
}

$('#modalDialog').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget);
  var link = button.data('link').replace('watch?v=','embed/');
  var title = button.parent().text().trim();
  var desc = button.parent().next().text().trim();

  var modal = $(this);
  
  modal.find('.modal-title').html(title);
  var footer = modal.find('.modal-footer');
  footer.empty();
  footer.css('justify-content', 'left');
  footer.html($('<p>' + desc + '</p>'));

  var video = '<iframe width="auto" src="' + link +'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
  modal.find('.modal-body').append(video);
});

$('#modalDialog').on('shown.bs.modal', function () {
    var modal = $(this);
    modal.find('iframe').width(modal.find('.modal-body').width());
});


$('#modalDialog').on('hide.bs.modal', function(){
        $(this).find('.modal-body').empty();
        //$(this).find('video').remove();
});