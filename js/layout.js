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
        $('.page-container').css('padding-top', ( headerDesktop.height() + 15 ) + 'px');
    } else {
        headerDesktop.remove();
        $('.page-container').css('padding-top', '1px');
    }

    $('.page-container').css('padding-bottom', '65px');

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
    var pageFilter = '';

    pageFilter += '	<select id="pageFilter" class="1form-control-lg form-control col-sm-12" onchange="showSection()">';

	for (var id in sections) {
        var section = sections[id];
        
        pageFilter += '<option value="' + section.id +'">' + section.name + '</option>';

		content += '<div class="row tab-pane fade '+ (section.state || '')+' show" id="nav-'+section.id+'" role="tabpanel" aria-labelledby="nav-'+section.id+'-tab">';
		content += '    <h1 class="col-lg-12 title-1 m-t-15">' + (section.desc || section.name) + '</h1>';

		// for(var j = 0; j < section.chartcount; j++) {
			
		// 	var widgetId = section['chart'+(j+1)+'id'];
		// 	var widgetName = section['chart'+(j+1)+'name'];
		// 	var widget = charts[widgetId];
        //     var size = 6;			
		// 	if(widget.size) {
		// 	    size = widget.size;
		// 	} else if(widget.type == 'event' || widget.type == 'preview') {
		// 		size = 12;
		// 	}
		// 	var widgetLayout = getWidgetLayout(widgetId, widget, size);
		// 	if(widgetLayout) {
		// 		content += widgetLayout;	
		// 	}
        // }
        
		content += '</div>';
    }
    
    
    pageFilter += '	</select>';
	    
    $('.form-header').remove('#pageFilter');
    $('.form-header').append($(pageFilter));

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
            $('#nav-' + widget.parent).append(widgetLayout);
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


// ToDo : Move to Dashboard
// function getChartLayout(id, chart, size) {
	
// 	var chartContent = '';
// 	var chartTitle = chart.name || chart.desc; 
// 	if(chart.tile) {
// 		var data = chart.dataset1data;
// 		if($(window).width() > 575) {
// 			chartContent += '	<div class="col-3">';
// 		} else {
// 			chartContent += '	<div class="col-6">';	
// 		}
// 		chartContent += '		<div class="overview-item">';
// 		chartContent += '			<div class="overview__inner">';
// 		chartContent += '				<div class="overview-box clearfix">';
// 		chartContent += '					<div class="text">';
// 		chartContent += '						<h2>' + data.substr( data.lastIndexOf(',') + 1 ) + '</h2>';
// 		chartContent += '						<span>' + chartTitle + '</span>';
// 		chartContent += '					</div>';
// 		chartContent += '				</div>';
// 		chartContent += '				<div class="overview-chart">';
// 		chartContent += '					<canvas id='+ id +'></canvas>';
// 		chartContent += '				</div>';
// 		chartContent += '			</div>';
// 		chartContent += '		</div>';
// 		chartContent += '	</div>';
// 	} else {
// 		chartContent += '    <div class="col-lg-'+size+'">';
// 		chartContent += '        <div class="au-card m-t-15 m-b-15">';
// 		chartContent += '            <div class="au-card-inner">';
// 		chartContent += '                <h2 class="title-2 m-b-15">'+ chartTitle +'</h2>';
// 		chartContent += '                <canvas id='+ id +'></canvas>';
// 		chartContent += '            </div>';
// 		chartContent += '        </div>';
// 		chartContent += '    </div>';
// 	}

// 	return chartContent;
// }


// ToDo : Move to event board
// function getEventLayout(id, event, size) {
// 	var eventLayout = '';
// 	eventLayout += '<div class="col-lg-'+size+'">';
// 	eventLayout += '	<div class="card">';
// 	eventLayout += '		<img class="card-img-top" src="' + event.cover + '">';
// 	eventLayout += '		<div class="card-body">';
// 	eventLayout += '			<h4 class="card-title mb-3">' + event.name + '</h4>';
// 	eventLayout += '			<p class="card-text">' + event.desc + '</p>';
// 	eventLayout += '		</div>';
// 	eventLayout += '	</div>';
// 	eventLayout += '</div>';
// 	return eventLayout;	
// }


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
	previewLayout += '<div class="col-lg-'+size+' m-t-15">';
	previewLayout += '	<div class="row">';
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

function showSection() {
    var select = $(event.target);
    sectionId = select.val();
    $('#nav-content .active').removeClass('active');
    $("#nav-"+sectionId).addClass("active");
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