// *** --- REQUIRE DEPENDENCIES --- ***
var d3 = require('d3')
var crossfilter = require('crossfilter')
var textures = require('textures')
var jquery = require('jquery')

window.d3 = d3;
window.crossfilter = crossfilter;
window.textures = textures;
window.jquery = jquery;

var stats = Stats();
var polar = Polar();
var request = Request();
var polarDetail = PolarDetail()
	.pointer(false);

// *** --- DATA QUERY --- ***
d3.queue()
	.defer(d3.csv, '../data/compiledFreqConceptsW.csv')
	.defer(d3.csv, '../data/conceptStats.csv', function(d) { d.max = +d.max; return d })
	.defer(d3.csv, '../data/compiledFreqWords.csv')
	.await(dataLoaded);

// *** --- dataLoaded() --- ***
function dataLoaded(err, concepts, conceptStats, words){

	// console.log(conceptStats);

	// *** --- DATA MODELS --- ***
	var cf = crossfilter(concepts)
	var conceptsByPresident = cf.dimension(function(d) { return d.dates; })
	var nestByYear = d3.nest()
		.key(function(d) { return d.dates; })
		.rollup(function(d) { var x = d[0]; delete x.dates; return x; })
		.entries(concepts);

	// nesting data by year
	for (index in nestByYear) {
		var keys = Object.keys(nestByYear[index].value);
		var values = Object.values(nestByYear[index].value);
		var params = [];
		for (i in keys) {
			params.push({key: keys[i], value: values[i]})
		}
		nestByYear[index].params = params;
	}


	// d3.select('#concept-list').datum(words)

	d3.select('#stats-container').datum(conceptStats).call(stats);

	for (var i = 0; i < nestByYear.length; i++) {
		d3.select('#multiples-container')
			.append('div')
			.attr('class', 'plot-container')
			.attr('id', 'plot'.concat(i))
			.attr('data-toggle', 'modal')
			.attr('data-target', '.bs-example-modal-lg')
			.datum(nestByYear[i]).call(polar);
	}

	d3.selectAll('.plot-container')
	.on('click', function(d){
		var index = this.id.substring(4);
		var node = d3.select('#speech-container').node();
		request(node, index);

		d3.select('#modal-chart-container')
		.append('div')
		.attr('class', 'plot-container plot-modal')
		.datum(nestByYear[index]).call(polarDetail);
	});

	// remove svg when modal is closed
	$('#speeches-modal').on('hidden.bs.modal', function () {
    	d3.selectAll('.plot-modal').remove();
	})
}// <--- dataLoaded()



var words = {
	unity: ["alliance", "confederation", "integrity", "one"],
	democracy: ["citizenry", "democracy", "department", "majority", "multitude", "people", "republic"],
	success: ["advancement", "invention", "progress", "success", "technology", "win"],
	problem: ["conflict", "difficulty", "problem", "struggle", "trouble"],
	terror: ["approach", "attack", "communist", "concern", "fear", "fire", "menace", "panic", "terror", "terrorism", "threat"],
	war: ["artillery", "battle", "dictatorship", "gun", "invasion", "war", "weapon"]
}

for (var key in words) {
  if (words.hasOwnProperty(key)) {
  	d3.select('#concept-list')
  		.append('h4')
  		.html(key)
  		.attr('id', key)
  		.style('fill', 'white')
  }

    if (words.hasOwnProperty(key)) {
  	d3.select('#' + key)
  		.append('ul')
  	for (var i in words[key]) {
  	d3.select('#' + key).select('ul')
  		.append('li')
  		.html(words[key][i])
  		.style('fill', 'white')
  	}
  }
}

// for (var key in words) {
//   if (words.hasOwnProperty(key)) {
//   	d3.select('#' + key)
//   		.append('ul')
//   	for (var i in words[key]) {
//   	d3.select('#' + key).select('ul')
//   		.append('li')
//   		.html(words[key][i])
//   		.style('fill', 'white')
//   	}
//   }
// }