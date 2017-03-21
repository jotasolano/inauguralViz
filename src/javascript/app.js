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

	conceptsByPresident.filterExact("1789");
	// console.log( conceptsByPresident.bottom(Infinity) );

	var nestByYear = d3.nest()
		.key(function(d) { return d.dates; })
		.entries(concepts)

	// console.log(Object.keys(nestByYear[0].values[0])); //the keys
	// console.log(Object.values(nestByYear[0].values[0])); //the values


	var polar = Polar()
	var polar2 = Polar().id(30)

	// console.log(Polar().id(5))

	d3.select('#plot1').datum(nestByYear).call(polar);
	d3.select('#plot2').datum(nestByYear).call(polar2);


}// <--- dataLoaded()