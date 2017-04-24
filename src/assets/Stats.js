function Stats(){
	var M ={t:20,r:20,b:20,l:20};
	var W, H;
	var scaleX, scaleY;

	var exports = function(selection){
		W = W || selection.node().clientWidth - M.l - M.r;
		H = H || selection.node().clientHeight - M.t - M.b;
		var arr = selection.datum()?selection.datum():[];

	var concepts = arr.map(function(d) { return d.concepts; });
	var colors = ['#39B1CF', '#957FF5', '#85CC46', '#E36147', '#F05ABA', '#E32D47']

		scaleX = d3.scalePoint()
			.domain(concepts)
			.range([0, W])
			.padding(0.3);

		scaleY = d3.scaleLinear()
			.domain([0, 128])
			.range([H, 0]);

		scaleColor = d3.scaleOrdinal()
			.domain(concepts)
			.range(colors)

		// ** ------- LAYOUT ------- **

var words = {
	unity: ["alliance", "confederation", "integrity", "one"],
	democracy: ["citizenry", "department", "majority", "multitude", "people", "republic"],
	success: ["advancement", "invention", "progress", "technology", "win"],
	problem: ["conflict", "difficulty", "struggle", "trouble"],
	terror: ["approach", "attack", "communist", "concern", "fear", "fire", "menace", "panic", "terrorism", "threat"],
	war: ["artillery", "battle", "dictatorship", "gun", "invasion", "weapon"]
}

for (var key in words){
  if (words.hasOwnProperty(key)){
  	d3.select('#concept-list')
  		.append('h4')
  		.html(key)
  		.attr('id', key)
  		.attr('class', 'concept-header')
  		.style('color', function(d) { return scaleColor(key)});
	}
    if (words.hasOwnProperty(key)){
  		d3.select('#' + key).append('ul').attr('class', 'list-unstyled word-list')
	  	for (var i in words[key]) {
	  		d3.select('#' + key).select('ul')
		  		.append('li')
		  		.html(words[key][i])
		  		.style('fill', 'white')
	  	}
	}
}


		var axisX = d3.axisBottom()
			.scale(scaleX)
			.tickSize(0);

		var axisY = d3.axisLeft()
			.tickSize(-W)
			.scale(scaleY)
			.ticks(4);

		var svg = selection.append("svg")
		    .attr("width", W + M.l + M.r)
		    .attr("height", H + M.t + M.b)
		  .append("g")
		    .attr("transform", "translate(" + M.l + "," + M.t + ")")
		    .attr('class', 'stats');

		svg.append("g")
		    .attr("class", "axis-x")
		    .attr("transform", "translate(0," + H + ")")
		    .call(axisX)

		var div = d3.select("body").append("div")	
		    .attr("class", "tooltip")				
		    .style("opacity", 0);

		var barsBig = svg.append('g').attr('class', 'barsBig')
			.attr('transform', 'translate(' + 0 + ',' + -10 + ')')

		var bars = svg.append('g').attr('class', 'bars')
			.attr('transform', 'translate(' + 0 + ',' + -10 + ')')

		var circles = svg.append('g').attr('class', 'circles')
			.attr('transform', 'translate(' + 0 + ',' + -10 + ')')

		bars.selectAll('.bars').data(arr).enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d) { return scaleX(d.concepts); })
			.attr("y", function(d) { return scaleY(d.max); })
			.attr("height", function(d) {return H - scaleY(d.max); })
			.attr('width', 2)
			.style('fill', function(d) { return scaleColor(d.concepts); });


		bars.selectAll('.barsBig').data(arr).enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d) { return scaleX(d.concepts)-15; })
			.attr("y", function(d) { return scaleY(d.max); })
			.attr("height", function(d) {return H - scaleY(d.max); })
			.attr('width', 30)
			.style('fill', 'white')
			.style('opacity', 0)
			.on('mouseover', function(d) {
				var coords = d3.mouse(this);
				var testX = d3.event.pageX;
				var testY = d3.event.pageY;
				div.transition()		
	                .duration(200)		
	                .style("opacity", .9);
	            div.html(d.concepts + "<br/>" + "Max: " + d.max + "<br/>" + "Mean: " + (+d.mean).toFixed(2))	
                .style("left", (testX) + "px")		
                .style("top", (testY - 20) + "px")
			})
			.on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        	});

		circles.selectAll('.circles').data(arr).enter().append('circle')
		    .attr('cx', function(d) { return scaleX(d.concepts)+1; })
		    .attr('cy', function(d) { return scaleY(d.mean); })
		    .attr('r', 6)
		    .style('fill', function(d) { return scaleColor(d.concepts); });

  // the "UPDATE" set:
  // bars.transition().duration(300).attr("x", function(d) { return scaleX(d.concepts); }) // (d) is one item from the data array, x is the scale object from above
  //   .attr("width", 1) // constant, so no callback function(d) here
  //   .attr("x", function(d) { return scaleX(d.concepts); })
  //   .attr("y", function(d) { return scaleY(d.max); })
  //   .attr("height", function(d) { console.log(H); return H - scaleY(d.max); }); // flip the height, because y's domain is bottom up, but SVG renders top down


	};
	exports.id = function(_id){
		if(!arguments.length) return _ID;
		_ID = _id
		return this;
	}

	return exports;
}
