module.exports = scaffold;

function inflateTemplate(fileDataString,templateObj) {
    var Mustache = require('mustache');     
    return Mustache.render(fileDataString,templateObj);
}

function calcPath(path) {
    var minimatch = require("minimatch");
    if (minimatch(path, "*.scaffold")) {
      var splitPath = path.split('.');
      splitPath.pop();

      return splitPath.join('.');
    }
    else return path;
}

function scaffold(projectName,developer) {
    var fs = require('fs');
    var path = require('path');
    var readdirp = require('readdirp');
    var mkdirp = require('mkdirp');
    var through = require('through2');
    var minimatch = require("minimatch");

    var templateObj = { appName : projectName,
                        developer : developer };
    var stat;


    try {
        stat = fs.statSync(projectName);
    } catch (e) {
        fs.mkdirSync(projectName);
    }

    if (stat !== undefined) {
        console.log("project: " + projectName + " already exists");
    }
    else {
        var projectAbsolutePath = path.resolve(projectName);
        var templatesFolder =
            path.normalize(path.join(__dirname, '..', 'templates'));
	
        readdirp({ root: path.join(templatesFolder), fileFilter: '*.+(js|hbs|scaffold|template|sol|css|json|marko)' }) 
            .on('warn', function (err) { console.error('warning: ', err); })
            .on('error', function (err) { console.error('fatal error: ', err); })
            .on('end', function(err){ console.log("project initiated!\nnow type `cd " + projectName + " && npm install`");})
            .pipe(through.obj(
                function (entry, _, cb) {
                    mkdirp(path.join(projectAbsolutePath,entry.parentDir), function (err) {
                        if (err) console.error(err);
                        else { 
                            fs.createReadStream(entry.fullPath, { encoding: 'utf-8' })
				.pipe(through.obj(
				    function(fileData, _, cb) {
                        if (minimatch(entry.path, "*.scaffold")) { 
	                        this.push(inflateTemplate(fileData,templateObj));
                        } else { 
                            this.push(fileData);
                        }
					    cb();
			           }))
                      .pipe(fs.createWriteStream(path.join(projectAbsolutePath, calcPath(entry.path))));
                      }
                    });
                    this.push({ path: calcPath(entry.path) });
                    cb();
                }))
            .pipe(through.obj(
                function (res, _, cb) { 
                    this.push("Wrote: " + (path.join(projectAbsolutePath, res.path)) + "\n");
                    cb();
                }))
            .pipe(process.stdout)
    }
    return;
}
