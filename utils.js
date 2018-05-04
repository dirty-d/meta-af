module.exports.ensureGlobal = function(type) {
    let args = Array.from(arguments).slice(1)
    
    args.forEach((arg) => {
        if(global[arg] === undefined) {
            global[arg] = new type()
        }
    })
}

module.exports.indentLines = function(arr, indent_level, indent_char) {
    let indent = indent_char.repeat(indent_level)
    return '\n' + arr.map((x) => indent + x).join('\n') + '\n' + indent
}

module.exports.appendEnumClass = function(meta, name, value) {
    module.exports.ensureGlobal(Map, 'enums')

    if(!global.enums.has(name)) {
        global.enums.set(name, [])
    }

    global.enums.get(name).push(value)
}

module.exports.defineEnumClass = function(meta, name) {
    return global.stage(2, () => {
        let lines = []

        lines.push(`enum class ${name} {`)
        let values = global.enums.get(name).join(',').split(/(?<=,)/g)

        lines = lines.concat(values.map((x) => `    ${x}`))
        lines.push('};')

        return module.exports.indentLines(lines, meta.indent_level, ' ')
    })
}