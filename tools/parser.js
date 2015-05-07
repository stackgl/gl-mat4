var fs = require('fs')
var path = require('path')

//TODO: curl this in?
//https://raw.githubusercontent.com/toji/gl-matrix/master/src/gl-matrix/mat4.js
// ^ had to manually remove aliases like 'mul' from the above before parsing
var orig = fs.readFileSync(__dirname+'/original.js', 'utf8')


// var block = /(\/\*[^]*?\*\/)/g
// var func = /mat4\.([a-z0-9\-\_]+).*\=.*function/ig

var intro = 'var mat4 = {};'
var start = orig.indexOf(intro)
if (start===-1)
    throw new Error('not valid file')
orig = orig.substring(start+intro.length)

//matches blocks + function name
var reg = /(\/\*[^]*?\*\/)\s*mat4\.([a-z0-9\-\_]+).*\=.*function/ig

var match
var start = 0,
    end = null,
    lastMatch = null

var allNames = []

while (match = reg.exec(orig)) {
    if (lastMatch !== null) {
        end = match.index
        var name = lastMatch[2].trim()
        var body = orig.substring( start, end )
        var file = 'module.exports = '+name+';\n\n'
        if(body.indexOf('GLMAT_ARRAY_TYPE') > -1) {
            file +=  "var GLMAT_ARRAY_TYPE = require('./common').GLMAT_ARRAY_TYPE;\n\n"
        };
        if(body.indexOf('GLMAT_RANDOM') > -1) {
            file +=  "var GLMAT_RANDOM = require('./common').GLMAT_RANDOM;\n\n"
        };
        if(body.indexOf('GLMAT_EPSILON') > -1) {
            file +=  "var GLMAT_EPSILON = require('./common').GLMAT_EPSILON;\n\n"
        };
        file += lastMatch[1]+'\nfunction '+name+body.trim() 

        var filename = name+'.js'

        fs.writeFile(filename, file, function(err) {
            if (err)
                console.error("Error writing file", filename, err)
        })
        allNames.push(name)
    }

    start = reg.lastIndex
    lastMatch = match
}

var entry = 'module.exports = {\n'
allNames.forEach(function(name, i) {
    entry += '  '
    if (i!==0)
        entry += ', '
    entry += name+": require('./"+name+"')\n"
})
entry += '}'

fs.writeFile('index.js', entry, function(err) {
    if (err)
        console.error("Error writing index", err)
})