var yamyam = require("YamYam"),
	jade = require("jade"),
	fs = require("fs");

var annotations = {
	"@jmpress": function(attrs, annotation) {
		if(annotation.params.animation) {
			attrs["data-jmpress"] = annotation.params.animation;
		}
	},
	"@right": function(attrs) {
		attrs["class"] = (attrs["class"] || "") + "right";
	},
	"@attrs": yamyam.HtmlFormater.ATTRS
}

function compile(doneCallback) {
	function oneFinished(err) {
		//if(err)
		//	throw err;
		if(err) {
			console.error(err);
		}
		if(--sourcesCount == 0)
			doneCallback();
	}

	var sources = fs.readdirSync("src");
	var sourcesCount = sources.length;

	var stat;
	try {
		stat = fs.statSync("out");
	} catch(e) {}
	if(!stat || !stat.isDirectory())
		fs.mkdirSync("out");

	sources.forEach(function(file) {
		console.log(file + " reading...");
		fs.readFile("src/" + file, "utf-8", function(err, fileContent) {
			if(err) {
				console.error("ERROR reading " + file + ": " + err);
				oneFinished(err);
			}
			yamyam.parse(fileContent, { format: { block: false, annotations: annotations } }, function(err, result) {
				if(err) {
					console.error("ERROR in " + file + ": " + err);
					oneFinished(err);
				}
				/*
					result =
					[ { annotations: [...],
						content: "..." } ]
				*/
				var blocks = [],
					data = { sections: blocks, settings: {} },
					outputs = [];
				result.forEach(function(block) {
					var page = {content: block.content};

					block.annotations.forEach(function(annotation) {
						if(annotation.name === "@settings" || annotation.name === "@setting") {
							for(var name in annotation.params) {
								data.settings[name] = annotation.params[name];
							}
						} else if(annotation.name === "@output") {
							outputs.push({template: annotation.params.template, output: annotation.params.output});
						} else {
							if(annotation.name) {
								page.template = page["class"] = annotation.name;
							}
							for(var name in annotation.params) {
								page[name] = annotation.params[name];
							}
						}
					});

					blocks.push(page);
				});
				console.log(file + " yam read! Now read template...");
				if(outputs.length === 0) {
					if(!data.settings.template)
						data.settings.template = "basic";
					if(!data.settings.output)
						data.settings.output = file.substr(0, file.indexOf("."));
					outputs.push({template: data.settings.template, output: data.settings.output});
				}
				var outputsCount = outputs.length;
				function outputFinished(err) {
					if(err) {
						console.error(err);
					}
					outputsCount--;
					if(outputsCount === 0) {
						oneFinished();
					}
				}
				outputs.forEach(function(output) {
					fs.readFile("templates/"+output.template+".jade", "utf-8", function(err, templateContent) {
						if(err) {
							console.error("ERROR reading template for " + file + ": " + err);
							outputFinished(err);
						}
						var template = jade.compile(templateContent, {});
						data.settings.template = output.template;
						data.settings.output = output.output;
						fs.writeFile("out/" + output.output + ".html",
							template(data), "utf-8", function(err) {
							console.log("SUCCESSFUL: " + file + " -> " + output.output);
							outputFinished();
						});
					});
				});
			});
		});
	});

}
compile(function() {
	console.log("ALL DONE!");
});
module.exports = compile;




