let assert = require('assert')
let fs = require('fs')
let utils = require('../utils')

class GameUtils {
    constructor() {
        this.objectClasses = new Map()
        this.objectId = 0
    }

    fnv_1a32(str, salt = '') {
        //let prime = (0x01000193 >>> 0)
        let hash = (0x811c9dc5 >>> 0)

        str += salt

        for(let i = 0; i < str.length; i++) {
            hash ^= str[i].charCodeAt(0)
            hash += (hash << 24) + (hash << 8) + (hash << 7) + (hash << 4) + (hash << 1)
        }

        return hash >>> 0;
    }

    declareObjectClass(meta, className, baseName, salt = '') {
        let classInfo = {
            meta: meta,
            class_name: className,
            class_hash: this.fnv_1a32(className, salt),
            base: () => this.objectClasses.get(baseName)
        }

        this.objectClasses.set(className, classInfo)

        return global.stage(1, () => {
            let classInfo = this.objectClasses.get(className)
            let baseInfo = classInfo
            let template = fs.readFileSync('./example/derived_object.cpp.template', 'utf8')

            let uniqueHashes = new Set()
            let message = ''
            for(let [key, value] of this.objectClasses) {
                uniqueHashes.add(value.class_hash)
                message += `class: ${key}, hash: ${value.class_hash}\n`
            }

            assert(uniqueHashes.size == this.objectClasses.size, message)

            let decl = utils.stringTemplate(template, {
                class_info: classInfo,
                base_name: baseName
            })

            return utils.indentLines(decl.split('\n'), meta.indent_level)
        })
    }

    declareDerivesFrom(meta, className) {
        return global.stage(1, () => {
            let template = fs.readFileSync('./example/derives_from.cpp.template', 'utf8')
            let lines = []

            function addDecl(className, value) {
                let decl = utils.stringTemplate(template, {
                    type: className,
                    return_value: value
                })

                let lines = decl.split('\n')
                lines.push('')

                return lines
            }

            if(className === undefined) {
                for(let [key, value] of this.objectClasses) {
                    lines = lines.concat(addDecl(key, 'false'))
                }

                lines.length--
            } else {
                let classInfo = this.objectClasses.get(className)
                let baseInfo = classInfo

                lines = lines.concat(addDecl(baseInfo.class_name, 'true'))

                for(;;) {
                    baseInfo = baseInfo.base()

                    if(baseInfo === undefined) {
                        break
                    } else {
                        lines = lines.concat(addDecl(baseInfo.class_name, 'true'))
                    }
                }

                lines.length--
            }

            return utils.indentLines(lines, meta.indent_level)
        })
    }

    includeObjectClasses(meta) {
        return global.stage(1, () => {
            return utils.indentLines(
                Array.from(this.objectClasses.values()).map((x) => `#include <${x.class_name}.h> //${x.meta.file_name}:${global.lineTag(x.meta.expression_id)})`),
                meta.indent_level,
                ' '
            )
        })
    }

    forwardDeclareObjectClasses(meta) {
        return global.stage(1, () => {
            return utils.indentLines(
                Array.from(this.objectClasses.values()).map((x) => `class ${x.class_name};`),
                meta.indent_level,
                ' '
            )
        })
    }

    mixin(meta, filename) {
         let lines = fs.readFileSync(filename, 'utf8').split('\n')
         return utils.indentLines(lines, meta.indent_level, ' ')
    }
}

module.exports = new GameUtils()