#include <cstdio>
#include <memory>

/*$
    let gameUtils = require('./example/gameUtils')
    return gameUtils.includeObjectClasses(meta)
$*/
#include <BlahPlayer.h> //BlahPlayer.h:14)
#include <Game.h> //Game.h:14)
#include <Object.h> //Object.h:27)
#include <Player.h> //Player.h:14)
/*@*/

int main(int argc, char **argv) {
    /*$
        let utils = require('./utils')
        let gameUtils = require('./example/gameUtils')

        return stage(1, () => {
            let classes = Array.from(gameUtils.objectClasses.values()).sort((a, b) => a.class_name.localeCompare(b.class_name))
            let lines = classes.map((x) => `printf("class: %s, hash: 0x%08x\\n", ${x.class_name}::class_name, ${x.class_name}::class_hash);`)
            return utils.indentLines(lines, meta.indent_level)
        })
    $*/
    printf("class: %s, hash: 0x%08x\n", BlahPlayer::class_name, BlahPlayer::class_hash);
    printf("class: %s, hash: 0x%08x\n", Game::class_name, Game::class_hash);
    printf("class: %s, hash: 0x%08x\n", Object::class_name, Object::class_hash);
    printf("class: %s, hash: 0x%08x\n", Player::class_name, Player::class_hash);
    /*@*/

    return 0;
}