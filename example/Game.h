#ifndef GAME_H
#define GAME_H

/*$
    let gameUtils = require('./example/gameUtils')
    return gameUtils.includeObjectClasses(meta)
$*/
#include <BlahPlayer.h>
#include <Game.h>
#include <Object.h>
#include <Player.h>
/*@*/

/*$
    global.className = 'Game'
    let gameUtils = require('./example/gameUtils')
    return gameUtils.declareObjectClass(meta, global.className, 'Object')
$*/
class Game: public Object {
public:
    static constexpr const char *class_name = "Game";
    static constexpr const uint32_t class_hash = 3262522151;
/*@*/

    /*$
        let gameUtils = require('./example/gameUtils')
        return gameUtils.declareDerivesFrom(meta, global.className)
    $*/
    virtual bool _derives_from(Game *) {
        return true;
    }
    
    virtual bool _derives_from(Object *) {
        return true;
    }
    /*@*/
};

#endif