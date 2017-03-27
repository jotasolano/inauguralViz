function Polar(){
	var _accessor = function(d){
		return d.startTime;
	};
	var W, H, M ={t:20,r:20,b:20,l:20};
	// var brush = d3.brushX()
	// 	.on('end',brushend);
	var scaleX, scaleY;
	var labels = []
	// var _dispatcher = d3.dispatch('timerange:select');

	var _ID = 0;

	var exports = function(selection){
		W = W || selection.node().clientWidth - M.l - M.r;
		H = H || selection.node().clientHeight - M.t - M.b;
		var arr = selection.datum()?selection.datum():[];

		console.log(arr);

		console.log(arr.key)
		var _data = arr.params;
		console.log(_data)

		// ** ------- LAYOUT ------- **
		//Set up the DOM structure like so:
		/*
		<svg>
			<g class='plot'>
				<g class='axis axis-y' />
				<path class='line' />
				<g class='axis axis-x' />
			</g>
		</svg>
		*/
		var svg = selection.selectAll('svg')
			.data([arr]);

		var svgEnter = svg
			.enter().append('svg') //ENTER
				.attr('width', W + M.l + M.r)
				.attr('height', H + M.t + M.b)
			.append('g')
				.attr('transform','translate('+M.l+','+M.t+')')
				.each(multiple);

		function multiple(date){

			console.log(date);
			var svg = d3.select(this);

			parseObjectKeys(date);
			var scaleX = d3.scalePoint()
				.domain(labels)
				.range([0,W])

			// var dLength = _data[0].length;
			var dLength = 6;

			var radius = Math.min(W, H) / 2 - M.t

			var a = d3.scaleLinear()
				.domain([0, (dLength/2)-1])
				.range([0, Math.PI])

			var aB = d3.scaleLinear()
				.domain([0, (dLength/2)-1])
				.range([Math.PI, 2*Math.PI])

		    var r = d3.scaleLinear()
		      .domain([0, 42])
		      .range([0, radius]);

			var radialLine = d3.radialLine()
				.angle(function(d, i) { return a(i); })
				.radius(function(d) { return r(parseInt(d.value)); })

	 		// var radialLineBtm = d3.radialLine()
				// .angle(function(d, i) { return aB(i); })
				// .radius(function(d) { return r(parseInt(d.value)); })

			svg.append('path').attr('class', 'lineTop')
				.attr('d',function(d) { return radialLine(d.slice(0,3)); })
				.style('fill', '#BCD8DD')
				.style('stroke', 'none');

			// svg.append('path').attr('class', 'lineBtm')
			// 	.attr('d',function(d) { return radialLineBtm(d.slice(3)); })
			// 	.attr('transform', 'rotate('+0+')')
			// 	.style('fill', '#8C9FA3')
			// 	.style('stroke', 'none');

			// var axisX = d3.axisBottom()
			// 	.scale(scaleX);

			// var axisY = d3.axisLeft()
			// 	.tickSize(-W)
			// 	.scale(scaleY)
			// 	.ticks(4);
		}

		// var plotEnter = svgEnter.append('g').attr('class','plot time-series')
		// 	.attr('transform','translate('+M.l+','+M.t+')')
		// plotEnter.append('path').attr('class','lineTop');
		// plotEnter.append('path').attr('class','lineBtm');
		// plotEnter.append('circle').attr('class', 'point');

		// //Update
		// var plot = svg.merge(svgEnter)
		// 	.select('.plot')
		// 	.attr('transform','translate('+ (M.l + W / 2) + "," + (M.t + H / 2) + ') rotate('+-90+')');
		// plot.select('.lineTop').transition()
		// 	.attr('d',function(d) { return radialLine(d.slice(0,3)); })
		// 	.style('fill', '#BCD8DD')
		// 	.style('stroke', 'none');

		// plot.select('.lineBtm').transition()
		// 	.attr('d',function(d) { return radialLineBtm(d.slice(3)); })
		// 	.attr('transform', 'rotate('+0+')')
		// 	.style('fill', '#8C9FA3')
		// 	.style('stroke', 'none');

		// selection.selectAll('svg').data([0]).append('circle')
		// 	.attr('transform','translate('+ (M.l + W / 2) + "," + (M.t + H / 2) + ') rotate('+0+')')
		//     .attr('cx', 0)
		//     .attr('cy', 0)
		//     .attr('r', 2)
		//     .style('fill', 'black');


		// selection.selectAll('svg').data([arr]).append('text')
		// 	.attr('transform','translate('+ (M.l) + "," + (M.t) + ') rotate('+0+')')
		//     .text(function(d) { return d.key; })
		//     .style('fill', 'black');

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

function parseObjectKeys(obj) {
	var labels = []
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
