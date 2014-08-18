var fs = require('fs')
var path = require('path')

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