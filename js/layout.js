
var sections;

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

var urlParams = new URLSearchParams(window.location.search);
var ch = urlParams.get('ch');
var br = urlParams.get('br');
if(ch) {
	$('.menu-sidebar').remove();
	$('.header-mobile').remove();
	$('.page-container').css('padding-left', '0px');
	$('.page-container').css('top', '0px');
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
			var chartContent = getChartContent(section['chart'+(j+1)+'id'], section['chart'+(j+1)+'name'], 6);
			if(chartContent){
				content += chartContent;	
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


function initChart(chartId, chartName) {
	var content = '';
	content += '<div class="row">';
	content += getChartContent(chartId, chartName, 12);
	content += '</div>';
	$('#nav-content').append($(content));
}

function getChartContent(chartId, chartName, size) {
	
	var chartContent = '';
	
	if(charts[chartId].tile) {
		var data = charts[chartId].dataset1data;
		if($(window).width() > 575) {
			chartContent += '	<div class="col-3">';
		} else {
			chartContent += '	<div class="col-6">';	
		}
		chartContent += '		<div class="overview-item">';
		chartContent += '			<div class="overview__inner">';
		chartContent += '				<div class="overview-box clearfix">';
		chartContent += '					<div class="text">';
		chartContent += '						<h2>'+data.substr(data.lastIndexOf(',')+1)+'</h2>';
		chartContent += '						<span>'+chartName+'</span>';
		chartContent += '					</div>';
		chartContent += '				</div>';
		chartContent += '				<div class="overview-chart">';
		chartContent += '					<canvas id='+ chartId +'></canvas>';
		chartContent += '				</div>';
		chartContent += '			</div>';
		chartContent += '		</div>';
		chartContent += '	</div>';
	} else {
		chartContent += '    <div class="col-lg-'+size+'">';
		chartContent += '        <div class="au-card m-t-15 m-b-15">';
		chartContent += '            <div class="au-card-inner">';
		chartContent += '                <h2 class="title-2 m-b-15">'+ chartName +'</h2>';
		chartContent += '                <canvas id='+ chartId +'></canvas>';
		chartContent += '            </div>';
		chartContent += '        </div>';
		chartContent += '    </div>';
	}

	return chartContent;
}