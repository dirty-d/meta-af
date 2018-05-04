let fs = require('fs');
let path = require('path');

let configFilename = './meta-af.config.js'

if(process.argv[2]) {
    configFilename = process.argv[2]
}

let config = require(configFilename)

let AsyncFunction = Object.getPrototypeOf(async function(){}).constructor

class PromiseThing {
    constructor() {
        this.resolve = null
        this.reject = null

        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve
            this.reject = reject
        })
    }
}

global.stages = new Map()

global.stages.set(0, {
    promise_thing: new PromiseThing(),
    count: 0
})

global.stage = async function(stage, cb) {
    if(!global.stages.has(stage)) {
        global.stages.set(stage, {
            promise_thing: new PromiseThing(),
            count: 0
        })
    }

    global.stages.get(stage).count++

    await global.stages.get(0).promise_thing.promise

    let promises = Array.from(global.stages).filter((x) => x[0] < stage).map((x) => x[1].promise_thing.promise)
    
    await Promise.all(promises)
    
    let result = cb()

    if(Promise.resolve(result) == result) {
        result = await result
    }

    global.stages.get(stage).count--

    if(global.stages.get(stage).count == 0) {
        global.stages.get(stage).promise_thing.resolve()
    }

    return result
}

global.lineTag = function (expressionId) {
    return `${SourceCode.expressionIdTagRefStart}${expressionId}${SourceCode.expressionIdTagRefEnd}`
}

String.prototype.indexesOf = function(pattern) {
    let indexes = []
    let index = 0

    for(;;) {
        index = this.indexOf(pattern, index)

        if(index == -1) {
            break
        }

        indexes.push(index)
        index += pattern.length
    }

    return indexes
}

function evaluate(expression) {
    return new Promise(function (resolve, reject) {
        AsyncFunction('lineTag', 'stage', 'meta', 'require', expression.expr)(
            global.lineTag,
            global.stage,
            expression.meta,
            require
        ).then((result) => {
            resolve({result: result, expression: expression})
        }).catch((err) => {
            reject(err)
        })
    })
}

class SourceCode {
    constructor(filePath) {
        if(SourceCode.expressionId === undefined) {
            SourceCode.expressionId = 0

            SourceCode.expressionIdTags = new Map()

            SourceCode.expressionIdTagStart = '/***expression_id_tag('
            SourceCode.expressionIdTagEnd = ')expression_id_tag***/'

            SourceCode.expressionIdTagRefStart = '/***expression_id_tag_ref('
            SourceCode.expressionIdTagRefEnd = ')expression_id_tag_ref***/'

            SourceCode.startCode = config.start_code
            SourceCode.endCode = config.end_code
            SourceCode.endPaste = config.end_paste
        }

        this.filePath = filePath
        this.source = fs.readFileSync(this.filePath, 'utf8')
        this.delta = 0
        this.replacements = []
        this.expressions = []
    }

    parse() {
        let state = new Map();
        let startCodeMatches = this.source.indexesOf(SourceCode.startCode)
        let endCodeMatches = this.source.indexesOf(SourceCode.endCode)
        let endPasteMatches = this.source.indexesOf(SourceCode.endPaste)

        if(startCodeMatches.length != endCodeMatches.length || endPasteMatches.length != startCodeMatches.length) {
            throw 'syntax error'
        }

        for(let i = 0; i < startCodeMatches.length; i++) {
            let indentLevel = 0;
            let startCodeMatch = startCodeMatches[i]

            for(let i = startCodeMatch; i > 0 && this.source[i - 1] != '\n'; i--) {
                indentLevel++
            }

            let expression = {
                expr: this.source.substring(
                    startCodeMatch + SourceCode.startCode.length,
                    endCodeMatches[i]
                ).trim(),
                start_code: startCodeMatch,
                start: endCodeMatches[i] + SourceCode.endCode.length,
                end: endPasteMatches[i],
                source_code: this,
                meta: {
                    expression_id: SourceCode.expressionId++,
                    indent_level: indentLevel,
                    file_path: this.filePath,
                    file_name: path.basename(this.filePath)
                }
            }

            this.expressions.push(expression)
        }
    }

    generate() {
        this.replacements = this.replacements.sort((a, b) => a.expression.start - b.expression.start)

        for(let i = 0; i < this.replacements.length; i++) {
            let replacement = this.replacements[i]
            let expression = replacement.expression
            let result = replacement.result

            if(result == undefined) {
                result = ''
            }

            result = result.toString()

            let before = this.source.substring(0, expression.start_code + this.delta)
            let middle = this.source.substring(expression.start_code + this.delta, expression.start + this.delta)
            let after = this.source.substring(expression.end + this.delta)
            let expressionIdTag = this.expressionIdTag(expression.meta.expression_id)

            this.source = before + expressionIdTag + middle + result + after
            this.delta += result.length + expressionIdTag.length - (expression.end - expression.start)
        }
    }

    expressionIdTag(id) {
        return `${SourceCode.expressionIdTagStart}${id}${SourceCode.expressionIdTagEnd}`
    }

    expressionIdRefTag(id) {
        return `${SourceCode.expressionIdTagRefStart}${id}${SourceCode.expressionIdTagRefEnd}`
    }

    replace(expression, result) {
        this.replacements.push({
            expression: expression,
            result: result
        })
    }

    addTags() {
        let lines = this.source.split('\n')

        for(let i = 0; i < lines.length; i++) {
            let line = lines[i]
            let startIndex = line.indexOf(SourceCode.expressionIdTagStart)
            let endIndex = line.indexOf(SourceCode.expressionIdTagEnd)

            if(startIndex != -1 && endIndex != -1) {
                let tag = line.substring(startIndex, endIndex + SourceCode.expressionIdTagEnd.length)
                let expressionId = line.substring(startIndex + SourceCode.expressionIdTagStart.length, endIndex)
                let lineNo = i + 1

                this.source = this.source.replace(tag, '')
                SourceCode.expressionIdTags.set(parseInt(expressionId, 10), lineNo)
            } else if(startIndex != endIndex) {
                throw 'syntax error: ' + line
            }
        }
    }

    resolveTags() {
        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        }

        for(let [expressionId, lineNo] of SourceCode.expressionIdTags) {
            let search = escapeRegExp(this.expressionIdRefTag(expressionId))
            let regex = new RegExp(search, 'g')
            this.source = this.source.replace(regex, lineNo)
        }
    }
}

async function main() {
    let sourceCodeSet = new Set()
    let promiseMap = new Map()
    let promiseSet = new Set()

    config.dirs.forEach((dir) => {
        let files = fs.readdirSync(dir)

        console.log(`searching "${dir}"`)

        files.forEach((filename) => {
            let filePath = path.normalize(dir + '/' + filename)

            if(!config.match(filePath)) {
                return
            }

            console.log(`processing "${filePath}"`)

            let sourceCode = new SourceCode(filePath)
        
            sourceCode.parse()

            sourceCode.expressions.forEach((expression) => {
                let promise = evaluate(expression)

                promise.catch((err) => {
                    console.error(`error in expression: ${expression.expr}`)
                })

                promiseSet.add(promise)
                promiseMap.set(expression, promise)
            })
            
            sourceCodeSet.add(sourceCode)
        })
    })

    global.stages.get(0).promise_thing.resolve()

    let results = await Promise.all(promiseSet)

    results.forEach((result) => {
        result.expression.source_code.replace(result.expression, result.result)
    })

    for(let sourceCode of sourceCodeSet) {
        console.log(`generating code for "${sourceCode.filePath}"`)
        sourceCode.generate()
    }

    for(let sourceCode of sourceCodeSet) {
        console.log(`adding tags for "${sourceCode.filePath}"`)
        sourceCode.addTags()
    }

    for(let sourceCode of sourceCodeSet) {
        console.log(`resolving tags for "${sourceCode.filePath}"`)
        sourceCode.resolveTags()
        fs.writeFileSync(sourceCode.filePath, sourceCode.source, 'utf8')
    }
}

main().catch((err) => {
    console.error(err)
})
