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
		var maxY = 60;

		// !! - scaleBand creates a weird offset
		var scaleX = d3.scalePoint()
			.domain(labels)
			.range([0,W])

		var scaleY = d3.scaleLinear().domain([0,maxY]).range([H,0]);

		//Represent
		//Axis, line and area generators
		var line = d3.line()
			.x(function(d){ return scaleX(d.key); })
			.y(function(d){ return scaleY(parseInt(d.value)); });

			// .x(function(d, i){ return scaleX(labels[i]); })
			// .y(function(d, i){ return scaleY(d); });

		var axisX = d3.axisBottom()
			.scale(scaleX);

		var axisY = d3.axisLeft()
			.tickSize(-W)
			.scale(scaleY)
			.ticks(4);

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
			.attr('transform','translate('+M.l+','+M.t+')');
		plotEnter.append('g').attr('class','axis axis-y');
		plotEnter.append('path').attr('class','line');
		plotEnter.append('g').attr('class','axis axis-x');
		// plotEnter.append('g').attr('class','brush');

		//Update
		var plot = svg.merge(svgEnter)
			.select('.plot')
			.attr('transform','translate('+M.l+','+M.t+')');
		plot.select('.line').transition()
			.attr('d',line)
			.style('fill', 'none')
			.style('stroke', '#000');
		plot.select('.axis-y').transition()
			.call(axisY);
		plot.select('.axis-x')
			.attr('transform','translate(0,'+H+')')
			.transition()
			.call(axisX);

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
