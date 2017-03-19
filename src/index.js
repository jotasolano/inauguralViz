// ** ------- DEPENDENCIES ------- **
// > libs
import * as d3 from 'd3';
import 'bootstrap/dist/css/bootstrap.css'

// > files
import parseSpeech from './modules/parse.js';

var datum = require('./data/compiledFreqConcepts.csv')

console.log(datum);

// d3.queue()
// 	.defer(datum)
// 	.await(dataLoaded);

function dataLoaded(err, speeches){
	console.log(err);
	console.table(speeches);

}