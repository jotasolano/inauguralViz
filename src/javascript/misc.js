function parseObjectKeys(arr, obj) {
	for (var prop in obj) {
  		var sub = obj[prop]
    	if (prop=="key") {
    		arr.push(obj[prop])
    }
    if (typeof(sub) == "object") {
    	parseObjectKeys(sub);
    }
  }
}