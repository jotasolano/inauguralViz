// *** --- REQUIRE DEPENDENCIES --- ***
var d3 = require('d3')
var crossfilter = require('crossfilter')

window.d3 = d3
window.crossfilter = crossfilter

// *** --- DATA QUERY --- ***
d3.queue()
	// .defer(d3.csv, '../data/compiledFreqConcepts5.csv')
	.defer(d3.csv, '../data/compiledFreqConceptsW.csv')
	.defer(d3.csv, '../data/compiledFreqWords.csv')
	.await(dataLoaded);

// *** --- dataLoaded() --- ***
function dataLoaded(err, concepts, words){

	// console.log(concepts);

	// *** --- DATA MODELS --- ***
	var cf = crossfilter(concepts)
	var conceptsByPresident = cf.dimension(function(d) { return d.dates; })
	var nestByYear = d3.nest()
		.key(function(d) { return d.dates; })
		.rollup(function(d) { var x = d[0]; delete x.dates; return x; })
		.entries(concepts);

	// console.log(nestByYear);

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

	var polar = Polar()

	for (var i = 0; i < nestByYear.length; i++) {
		d3.select('#multiples-container')
			.append('div')
			.attr('class', 'col-lg-3 chart-container test')
			.append('div')
			.attr('class', 'plot')
			.attr('id', 'plot'.concat(i))
			.datum(nestByYear[i]).call(polar)
	}
}// <--- dataLoaded()