var fs = require("fs"),
	compile = require("./index.js");

var change = false,
	queued = false;
var watcher = fs.watch("./src", function(event) {
	// change occurs
	change = true;
	if(!queued) {
		queued = true;
		function exec() {
			change = false;
			// recompile
			compile(function() {
				console.log("ALL DONE!");
				queued = false;
				if(change) {
					// change occured while compiling
					setTimeout(exec, 200);
				}
			});
		}
		// queue change
		setTimeout(exec, 200);
	}
});