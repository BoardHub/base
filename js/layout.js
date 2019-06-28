
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

function initLayout() {
	
	var nav = '';
	var content = '';
	
	for (var i = 0; i < sections.length; i++) {
		var section = sections[i];

		nav +='<a class="js-arrow nav-item nav-link '+(section.state || '')+'" id="nav-'+section.id+'-tab" data-toggle="tab" href="#nav-'+section.id+'" role="tab" aria-controls="nav-'+section.id+'" aria-selected="false"><i class="fas '+section.icon+' m-r-20"></i>'+section.name+'</a>';

		content += '<div class="row tab-pane fade '+ (section.state || '')+' show" id="nav-'+section.id+'" role="tabpanel" aria-labelledby="nav-'+section.id+'-tab">';
		content += '    <h2 class="col-lg-12 title-1 m-t-15 m-b-15">'+section.name+'</h2>';
		for(var j = 0; j < section.chartcount; j++) {
			content += '    <div class="col-lg-6">';
			content += '        <div class="au-card m-b-30">';
			content += '            <div class="au-card-inner">';
			content += '                <h3 class="title-2 m-b-40">'+section['chart'+(j+1)+'name']+'</h3>';
			content += '                <canvas id='+section['chart'+(j+1)+'id']+'></canvas>';
			content += '            </div>';
			content += '        </div>';
			content += '    </div>';				
		}
		content += '</div>';
	}
	$('#nav-menu').append($(nav));
	$('#nav-tab').append($(nav));
	$('#nav-content').append($(content));
};