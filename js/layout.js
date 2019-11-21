
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
if(wd || ch || br) {
	hideNav();
}

function hideNav() {
    $('.menu-sidebar').remove();
    $('.header-mobile').remove();
    $('.page-container').css('padding-left', '0px');
    $('.page-container').css('top', '0px');    
}

function onDataLoaded() {
    //if(Object.keys(sections).length == 1) {
    //    hideNav();
    //}
    
    if(wd && (widget = widgets[wd])) {
        document.title = widget.name;
        plotWidget(wd, widget);
    } else if(ch && (chart = charts[ch])) {
		document.title = chart.name;
		initWidget(ch, chart, 12);
		plotChart(ch, chart);
	} else {
		initLayout();
		plotCharts();
	}		
}

function initLayout() {
	
	var nav = '';
	var content = '';
	
	for (var id in sections) {
		var section = sections[id];

		nav +='<a class="js-arrow nav-item nav-link '+(section.state || '')+'" id="nav-'+section.id+'-tab" data-toggle="tab" href="#nav-'+section.id+'" role="tab" aria-controls="nav-'+section.id+'" aria-selected="false"><i class="fas '+section.icon+' m-r-20"></i>'+section.name;
		if(section.live) {
		nav +=' <i class="float-right fas fa-rss m-r-20"></i> ';
		}
		nav +='</a>';

		content += '<div class="row tab-pane fade '+ (section.state || '')+' show" id="nav-'+section.id+'" role="tabpanel" aria-labelledby="nav-'+section.id+'-tab">';
		content += '    <h1 class="col-lg-12 title-1 m-t-15 m-b-15">' + (section.desc || section.name) + '</h1>';
		
		for(var j = 0; j < section.chartcount; j++) {
			
			var widgetId = section['chart'+(j+1)+'id'];
			var widgetName = section['chart'+(j+1)+'name'];
			var widget = charts[widgetId];
            var size = 6;			
			if(widget.size) {
			    size = widget.size;
			} else if(widget.type == 'event' || widget.type == 'preview') {
				size = 12;
			}
			var widgetLayout = getWidgetLayout(widgetId, widget, size);
			if(widgetLayout) {
				content += widgetLayout;	
			}
		}
		content += '</div>';
	}
	
	$('#nav-menu').empty();
	$('#nav-menu').append($(nav));

	$('#nav-tab').empty();
	$('#nav-tab').append($(nav));

	$('#nav-content').empty();
	$('#nav-content').append($(content));
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

function getChartLayout(id, chart, size) {
	
	var chartContent = '';
	var chartTitle = chart.name || chart.desc; 
	if(chart.tile) {
		var data = chart.dataset1data;
		if($(window).width() > 575) {
			chartContent += '	<div class="col-3">';
		} else {
			chartContent += '	<div class="col-6">';	
		}
		chartContent += '		<div class="overview-item">';
		chartContent += '			<div class="overview__inner">';
		chartContent += '				<div class="overview-box clearfix">';
		chartContent += '					<div class="text">';
		chartContent += '						<h2>' + data.substr( data.lastIndexOf(',') + 1 ) + '</h2>';
		chartContent += '						<span>' + chartTitle + '</span>';
		chartContent += '					</div>';
		chartContent += '				</div>';
		chartContent += '				<div class="overview-chart">';
		chartContent += '					<canvas id='+ id +'></canvas>';
		chartContent += '				</div>';
		chartContent += '			</div>';
		chartContent += '		</div>';
		chartContent += '	</div>';
	} else {
		chartContent += '    <div class="col-lg-'+size+'">';
		chartContent += '        <div class="au-card m-t-15 m-b-15">';
		chartContent += '            <div class="au-card-inner">';
		chartContent += '                <h2 class="title-2 m-b-15">'+ chartTitle +'</h2>';
		chartContent += '                <canvas id='+ id +'></canvas>';
		chartContent += '            </div>';
		chartContent += '        </div>';
		chartContent += '    </div>';
	}

	return chartContent;
}


// ToDo : Move to event board
function getEventLayout(id, event, size) {
	var eventLayout = '';
	eventLayout += '<div class="col-lg-'+size+'">';
	eventLayout += '	<div class="card">';
	eventLayout += '		<img class="card-img-top" src="' + event.cover + '">';
	eventLayout += '		<div class="card-body">';
	eventLayout += '			<h4 class="card-title mb-3">' + event.name + '</h4>';
	eventLayout += '			<p class="card-text">' + event.desc + '</p>';
	eventLayout += '		</div>';
	eventLayout += '	</div>';
	eventLayout += '</div>';
	return eventLayout;	
}


function plotWidget(widgetId, widget) {
    var plotter = plotters[widget.type];
    if(plotter) {
        eval(plotter)(widget);
    } else {
        console.log('No plotter registered for type : ' + widget.type);
    }
    
}