/*$
    let utils = require('./utils.js')
    
    return stage(1, () => {
        let includes = global.headers.map((x) => `#include <${x}>`)
        return utils.indentLines(includes, meta.indent_level, ' ')
    })
$*/
#include <example.h>
/*@*/

/*$
    let utils = require('./utils.js')
    utils.appendEnumClass(meta, 'Things', 'Something')
$*//*@*/

/*$
    let utils = require('./utils.js')
    return utils.defineEnumClass(meta, 'Things')
$*/
enum class Things {
    Something,
    AnotherThing,
    SomethingElse
};
/*@*/

/*$
    let utils = require('./utils.js')
    utils.appendEnumClass(meta, 'Things', 'AnotherThing')
$*//*@*/

int main(int argc, char **argv) {
    return 0;
}
