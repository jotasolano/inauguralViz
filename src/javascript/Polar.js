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

		console.log(arr)
		var _data = arr.params;
		console.log(_data)

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
		var maxY = 60;

		// !! - scaleBand creates a weird offset
		var scaleX = d3.scalePoint()
			.domain(labels)
			.range([0,W])

		var dLength = _data.length;
		console.log(dLength);

		// var scaleX = d3.scalePoint()
		// 	.domain(labels)
		// 	.range([0,  2 * Math.PI])

		var scaleY = d3.scaleLinear().domain([0,maxY]).range([H,150]);
		// var scaleY = d3.scaleLinear().domain([0,maxY]).range([0,150]);

		//Represent
		//Axis, line and area generators
		var line = d3.line()
			.x(function(d){ return scaleX(d.key); })
			.y(function(d){ return scaleY(parseInt(d.value)); });

		// var radialLine = d3.radialLine()
		// 	.angle(function(d) { return scaleX(d.key); })
		// 	.radius(function(d) { return scaleY(parseInt(d.value)); })

		// var radialLine = d3.radialLine()
		// 	.angle(function(d, i) { return i * (360/dLength); })
		// 	.radius(function(d) { return (parseInt(-d.value) * 1.5 * Math.PI); })

		var radius = Math.min(W, H) / 2 - 30 //30 be the margin

		var a = d3.scaleLinear()
			.domain([0, dLength])
			.range([0, 2 * Math.PI])

		console.log(a(1));


	    var r = d3.scaleLinear()
	      .domain([0, 42])
	      .range([0, radius]);

		var radialLine = d3.radialLine()
			.angle(function(d, i) { return a(-i); })
			// .angle(function(d, i) { return i + (2 * Math.PI/dLength); })
			.radius(function(d) { return r(parseInt(d.value)); })

		console.log()

			// .x(function(d, i){ return scaleX(labels[i]); })
			// .y(function(d, i){ return scaleY(d); });

		var axisX = d3.axisBottom()
			.scale(scaleX);

		var axisY = d3.axisLeft()
			.tickSize(-W)
			.scale(scaleY)
			.ticks(4);

		console.log(radialLine(_data));	

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
			.data([_data]);

		var svgEnter = svg.enter()
			.append('svg') //ENTER
			.attr('width', W + M.l + M.r)
			.attr('height', H + M.t + M.b);

		var plotEnter = svgEnter.append('g').attr('class','plot time-series')
			.attr('transform','translate('+M.l+','+M.t+')')
		// plotEnter.append('g').attr('class','axis axis-y');
		plotEnter.append('path').attr('class','line');
		plotEnter.append('circle').attr('class', 'point');
		// plotEnter.append('g').attr('class','axis axis-x');
		// plotEnter.append('g').attr('class','brush');

		//Update
		var plot = svg.merge(svgEnter)
			.select('.plot')
			// .attr('transform','translate('+ (M.l) + "," + (M.t) + ')')
			.attr('transform','translate('+ (M.l + W / 2) + "," + (M.t + H / 2) + ') rotate('+0+')');
			// .attr('transform', 'rotate('+180+')');
		plot.select('.line').transition()
			.attr('d',radialLine)
			.style('fill', 'red')
			.style('stroke', '#000');


    // plot.selectAll("point")
    //   .data(_data)
    //   .enter()
    //   .append("circle")
    //   .attr("class", "point")
    //   .attr("transform", function(d) {
    //     var coors = line([d]).slice(1).slice(0, -1);
    //     return "translate(" + coors + ")"
    //   })
    //   .attr("r", 8)
		// plot.select('.axis-y').transition()
		// 	.call(axisY);
		// plot.select('.axis-x')
		// 	.attr('transform','translate(0,'+H+')')
		// 	.transition()
		// 	.call(axisX);

		// //Call brush function
		// plot.select('.brush')
		// 	.call(brush);
	};

	// function brushend(){
	// 	if(!d3.event.selection) {_dispatcher.call('timerange:select',this,null); return;}
	// 	var t0 = scaleX.invert(d3.event.selection[0]),
	// 		t1 = scaleX.invert(d3.event.selection[1]);
	// 	_dispatcher.call('timerange:select',this,[t0,t1]);
	// }

	// ** ------- CONFIG VALUES ------- **
	// exports.domain = function(_arr){
	// 	if(!arguments.length) return [T0,T1];
	// 	T0 = _arr[0];
	// 	T1 = _arr[1];
	// 	return this;
	// };

	// exports.interval = function(_int){
	// 	_interval = _int;
	// 	return this;
	// };

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
