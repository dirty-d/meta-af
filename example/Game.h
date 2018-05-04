#ifndef GAME_H
#define GAME_H

/*$
    let gameUtils = require('./example/gameUtils')
    return gameUtils.includeObjectClasses(meta)
$*/
#include <BlahPlayer.h> //BlahPlayer.h:14)
#include <Game.h> //Game.h:14)
#include <Object.h> //Object.h:27)
#include <Player.h> //Player.h:14)
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