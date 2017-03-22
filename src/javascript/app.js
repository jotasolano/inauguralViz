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

	var nestByYear_test = d3.nest()
		.key(function(d) { return d.dates; })
		.rollup(function(d) { var x = d[0]; delete x.dates; return x; })
		.entries(concepts);

	for (index in nestByYear_test) {
		var keys = Object.keys(nestByYear_test[index].value);
		var values = Object.values(nestByYear_test[index].value);
		var params = [];
		for (i in keys) {
			params.push({key: keys[i], value: values[i]})
		}
		nestByYear_test[index].params = params;
	}

	// console.log(nestByYear_test[0]);

	// console.log(Object.keys(nestByYear[0].values[0])); //the keys
	// console.log(Object.values(nestByYear[0].values[0])); //the values


	var polar = Polar()
	// var polar2 = Polar().id(30)

	// console.log(Polar().id(5))

	d3.select('#plot1').datum(nestByYear_test[0]).call(polar);
	// d3.select('#plot2').datum(nestByYear).call(polar2);


}// <--- dataLoaded()