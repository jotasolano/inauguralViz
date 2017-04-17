function PolarDetail(){
	var _accessor = function(d){
		return d.startTime;
	};
	var M ={t:30,r:20,b:20,l:20};
	var W = 250, H = 250;
	var scaleX, scaleY;
	var _bgLen = 200;
	var labels = []

	var _ID = 0;
	var _pointer = true;

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

		var radius = Math.min(_bgLen, _bgLen) / 2 - 7
		var padding = (W - H)/2

		var r = d3.scaleLinear()
			.domain([0, maxSpLength])
			.range([0, Math.PI*2])

	    var y = d3.scaleLinear()
	    	.domain([0, 77.7])
	    	.range([_bgLen/2, 0])

	    var y2 = d3.scaleLinear()
	    	.domain([0, 77.7])
	    	.range([_bgLen/2, _bgLen])

	    var areaT = d3.area()
	    	.x(function(d, i) {return i * _bgLen/2; })
	    	.y1(function(d) { return y(parseInt(d.value)); })

	    var areaB = d3.area()
	    	.x(function(d, i) {return i * _bgLen/2; })
	    	.y1(function(d) { return y2(parseInt(d.value)); })

		var arc = d3.arc()
			.innerRadius(0)
			.outerRadius(function(d) { return radius; })
			.startAngle(r(0))
			.endAngle(function(d, i) { return r(d[0].value); });

		var arcBorder = d3.arc()
			.innerRadius(function(d) { return radius; })
			.outerRadius(function(d) { return radius; })
			.startAngle(r(0))
			.endAngle(function(d, i) { return r(d[0].value); });

		var axisX = d3.axisBottom()
			.ticks(4)
			.tickSize(-10)
			.scale(y);

		var axisR = d3.axisBottom()
			.ticks(4)
			.tickSize(-10)
			.scale(y2)


		var svg = selection.selectAll('svg')
			.data([_data]);

		var svgEnter = svg.enter()
			.append('svg') //ENTER
			.attr('width', W + M.l + M.r)
			.attr('height', H + M.t + M.b);

		var plotEnter = svgEnter.append('g').attr('class','plot time-series')
			.attr('transform','translate('+M.l+','+M.t+')')
		plotEnter.append('g').attr('class', 'axis axis-x');
		plotEnter.append('g').attr('class', 'axis axis-r')
		plotEnter.append('circle').attr('class', 'point');
		plotEnter.append('rect').attr('class', 'background');
		plotEnter.append('path').attr('class', 'areaT');
		plotEnter.append('path').attr('class', 'areaB');
		plotEnter.append('path').attr('class', 'arc');
		plotEnter.append('path').attr('class', 'arcBorder');		

		areaT.y0(y(0));
		areaB.y0(y2(0));

		//Update
		var plot = svg.merge(svgEnter)
			.select('.plot')
			.attr('transform','translate('+ (0) + "," + (M.t) + ') rotate('+-0+')')
			.classed('pointer', _pointer);

		plot.select('.axis-x')
			.attr('transform','translate('+ (M.l) + "," + (H) + ') rotate('+-0+')')
			.transition()
			.call(axisX);

		plot.select('.axis-r')
			.attr('transform','translate('+ (M.l) + "," + (H) + ') rotate('+-0+')')
			.transition()
			.call(axisR);

		plot.select('.background').transition()
		    .attr('x', M.l)
		    .attr('y', M.t)
		    .attr('width', _bgLen)
		    .attr('height', _bgLen)
		    .style('fill', '#53606B')
		    .style('fill-opacity', 0.1);

		plot.select('.areaT').transition()
			.attr('transform','translate('+ (M.l) + "," + (M.t + _bgLen) + ') rotate('+-90+')')
			.attr('d', function(d) { return areaT(d.slice(0,3)); })
			.style('fill', '#3EC9A7')
			.style('stroke', 'none');

		plot.select('.areaB').transition()
			.attr('transform','translate('+ (M.l) + "," + (M.t + _bgLen) + ') rotate('+-90+')')
			.attr('d', function(d) { return areaB(d.slice(3,6)); })
			.style('fill', '#2B879E')
			.style('stroke', 'none');

		plot.select('.arc').transition()
			.attr('transform','translate('+ (_bgLen/2 + M.l) + "," + (_bgLen/2 + M.t) + ') rotate('+-0+')')
			.attr('d', function(d) { return arc(d.slice(6)); })
		    .style('fill', '#f2f2f2')
		    .style('fill-opacity', 0.05);

		plot.select('.arcBorder').transition()
			.attr('transform','translate('+ (_bgLen/2 + M.l) + "," + (_bgLen/2 + M.t) + ') rotate('+-0+')')
			.attr('d', function(d) { return arcBorder(d.slice(6)); })
		    .style('fill', 'none')
		    .style('stroke', 'white');

		selection.selectAll('svg').select('.plot').data([arr]).append('text')
			.attr('transform','translate('+ (0) + "," + (-10) + ') rotate('+0+')')
			.attr('class', 'txt-multiples txt-detail')
		    .text(function(d) { return d.key.concat(' | ', d.params[6].value, ' words'); })
		    .style('fill', '#f2f2f2');

		var cContainerL = selection.selectAll('svg')
			.select('.plot')
			.append('g')
			.data([_data.slice(0,3)])
			.attr('class', 'c-container')

		cContainerL.each(function(d){
			d3.select(this).selectAll(".concepts").data(d).enter().append("g")
			.attr('transform','translate('+ (M.l) + "," + (M.t + _bgLen) + ') rotate('+0+')')
			.attr('class', 'concepts')
			.append("text")
			.text(function(d,i) { return d['key']; })
			.attr('y', function(d,i) { return i*-100; })
		})

		var cContainerR = selection.selectAll('svg')
			.select('.plot')
			.append('g')
			.data([_data.slice(3,6)])
			.attr('class', 'c-container')

		cContainerR.each(function(d){
			d3.select(this).selectAll(".concepts").data(d).enter().append("g")
			.attr('transform','translate('+ (M.l + _bgLen) + "," + (M.t + _bgLen) + ') rotate('+0+')')
			.attr('class', 'concepts')
			.append("text")
			.text(function(d,i) { return d['key']; })
			.attr('y', function(d,i) { return i*-100; })
			.attr('text-anchor', 'end')
		})
		
	};

	exports.id = function(_id){
		if(!arguments.length) return _ID;
		_ID = _id
		return this;
	}

	exports.pointer = function(pointer){
		if(!arguments.length) return _pointer;
		_pointer = pointer;
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
