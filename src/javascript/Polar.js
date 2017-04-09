function Polar(){
	var _accessor = function(d){
		return d.startTime;
	};
	var W, H, M ={t:20,r:20,b:20,l:20};
	var scaleX, scaleY;
	var labels = []
	// var _dispatcher = d3.dispatch('timerange:select');

	var _ID = 0;

	var exports = function(selection){
		W = W || selection.node().clientWidth - M.l - M.r;
		H = H || selection.node().clientHeight - M.t - M.b;
		var arr = selection.datum()?selection.datum():[];
		var _data = arr.params;

		// ** ------- LAYOUT ------- **
		function parseObjectKeys(obj) {
			for (var prop in obj) {
		  		var sub = obj[prop]
		    	if (prop=="key") {
		    		labels.push(obj[prop])
		    }
		    if (typeof(sub) == "object") {
		    	parseObjectKeys(sub);
		    }
		  }
		}

		parseObjectKeys(_data);

		var dLength = _data.length;
		var maxSpLength = 9200;
		console.log(_data);

		var radius = Math.min(W, H) / 2 - 7
		var padding = (W - 200)/2

		var r = d3.scaleLinear()
			.domain([0, maxSpLength])
			.range([0, Math.PI*2])

	    var y = d3.scaleLinear()
	    	.domain([0, 77])
	    	.range([H/2, 0])

	    var y2 = d3.scaleLinear()
	    	.domain([0, 77])
	    	.range([H/2, H])

	    var areaT = d3.area()
	    	.x(function(d, i) {return i * 80; })
	    	.y1(function(d) { console.log(y(parseInt(d.value))); return y(parseInt(d.value)); })

	    var areaB = d3.area()
	    	.x(function(d, i) {return i * 80; })
	    	.y1(function(d) { return y2(parseInt(d.value)); })

		var arc = d3.arc()
			.innerRadius(function(d) { return radius; })
			.outerRadius(function(d) { return radius; })
			.startAngle(r(0))
			.endAngle(function(d, i) { return r(d[0].value); });

		var axisX = d3.axisBottom()
			.scale(scaleX);

		var axisY = d3.axisLeft()
			.tickSize(-W)
			.scale(scaleY)
			.ticks(4);

		var svg = selection.selectAll('svg')
			.data([_data]);

		var svgEnter = svg.enter()
			.append('svg') //ENTER
			.attr('width', W + M.l + M.r)
			.attr('height', H + M.t + M.b);

		var plotEnter = svgEnter.append('g').attr('class','plot time-series')
			.attr('transform','translate('+M.l+','+M.t+')')
		plotEnter.append('circle').attr('class', 'point');
		plotEnter.append('rect').attr('class', 'background');
		plotEnter.append('rect').attr('class', 'ref');
		plotEnter.append('path').attr('class', 'areaT');
		plotEnter.append('path').attr('class', 'areaB');
		plotEnter.append('text').attr('class', 'name');
		// plotEnter.append('path').attr('class', 'arc');

		areaT.y0(y(0));
		areaB.y0(y2(0));

		//Update
		var plot = svg.merge(svgEnter)
			.select('.plot')
			.attr('transform','translate('+ (M.l) + "," + (M.t) + ') rotate('+-0+')');


		plot.select('.background').transition()
		    .attr('x', M.l)
		    .attr('y', M.t)
		    .attr('width', 150)
		    .attr('height', 150)
		    .style('fill', '#c2b59b');

		plot.select('.ref').transition()
		    .attr('x', 0)
		    .attr('y', 0)
		    .attr('width', W)
		    .attr('height', H)
		    .style('fill', 'rgba(0, 0, 0, 0.1)');


		plot.select('.areaT').transition()
			.attr('transform','translate('+ (padding) + "," + (0) + ') rotate('+-0+')')
			.attr('d', function(d) { return areaT(d.slice(0,3)); })
			.style('fill', '#BCD8DD')
			.style('stroke', 'none');

		plot.select('.areaB').transition()
			.attr('transform','translate('+ (padding) + "," + (0) + ') rotate('+-0+')')
			.attr('d', function(d) { return areaB(d.slice(3,6)); })
			.style('fill', '#8C9FA3')
			.style('stroke', 'none');

		plot.select('.arc').transition()
			.attr('transform','translate('+ (W/2) + "," + (H/2) + ') rotate('+-0+')')
			.attr('d', function(d) { return arc(d.slice(6)); })
		    // .style("stroke-dasharray", ("3, 5"))
			.style('stroke', '#666666');

		selection.selectAll('svg').select('.plot').data([arr]).append('text')
			.attr('transform','translate('+ (M.l) + "," + (M.t) + ') rotate('+0+')')
		    .text(function(d) { return d.key; })
		    .style('fill', 'black');
	};
	exports.id = function(_id){
		if(!arguments.length) return _ID;
		_ID = _id
		return this;
	}

	exports.value = function(_acc){
		if(!arguments.length) return _accessor;
		_accessor = _acc;
		return this;
	};

	exports.on = function(){
		_dispatcher.on.apply(_dispatcher,arguments);
		return this;
	};

	return exports;
}
