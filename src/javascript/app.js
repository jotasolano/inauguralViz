// *** --- REQUIRE DEPENDENCIES --- ***
var d3 = require('d3')
var crossfilter = require('crossfilter')

window.d3 = d3
window.crossfilter = crossfilter

// *** --- DATA QUERY --- ***
d3.queue()
	.defer(d3.csv, '../data/compiledFreqConcepts.csv')
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

	console.log(nestByYear);
	// console.log(Object.keys(nestByYear[0].values[0])); //the keys
	// console.log(Object.values(nestByYear[0].values[0])); //the values


	var polar = Polar()
	var polar2 = Polar().id(30)

	// console.log(Polar().id(5))

	d3.select('#plot1').datum(nestByYear).call(polar);
	// d3.select('#plot2').datum(nestByYear[2]).call(polar2);


}// <--- dataLoaded()