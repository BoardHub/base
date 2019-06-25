var sections =
[{
	id : "cricket",
	name : "Cricket",
	state : 'active',
	charts : [{
		id : "lineChart",
		name : "Line Chart"
	},{
		id : "lineChart-background",
		name : "Line Chart - Background"
	}]
},{
	id : "politics",
	name : "Politics",
	charts : [{
		id : "singelBarChart",
		name : "Single Bar Chart"
	},{
		id : "doughutChart",
		name : "Doughut Chart"
	}]
},{
	id : "bollywood",
	name : "Bollywood",
	charts : [{
		id : "barChart",
		name : "Bar chart"
	},{
		id : "radarChart",
		name : "Rader chart"
	}]
}];

function initLayout() {
	
	var nav = '';
	var content = '';
	
	for (i = 0; i < sections.length; i++) {
		var section = sections[i];

		nav +='<a class="js-arrow nav-item nav-link '+(section.state || '')+'" id="nav-'+section.id+'-tab" data-toggle="tab" href="#nav-'+section.id+'" role="tab" aria-controls="nav-'+section.id+'" aria-selected="false"><i class="fas fa-tachometer-alt m-r-20"></i>'+section.name+'</a>';

		content += '<div class="row tab-pane fade '+ (section.state || '')+' show" id="nav-'+section.id+'" role="tabpanel" aria-labelledby="nav-'+section.id+'-tab">';
		content += '    <h2 class="col-lg-12 title-1 m-t-15 m-b-15">'+section.name+'</h2>';
		if(section.charts) {
			for(j = 0; j < section.charts.length; j++) {
				var chart = section.charts[j];
				content += '    <div class="col-lg-6">';
				content += '        <div class="au-card m-b-30">';
				content += '            <div class="au-card-inner">';
				content += '                <h3 class="title-2 m-b-40">'+chart.name+'</h3>';
				content += '                <canvas id='+chart.id+'></canvas>';
				content += '            </div>';
				content += '        </div>';
				content += '    </div>';
				
			}
		}
		content += '</div>';
	}
	$('#nav-menu').append($(nav));
	$('#nav-tab').append($(nav));
	$('#nav-content').append($(content));
};

initLayout();