#ifndef PLAYER_H
#define PLAYER_H

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
    global.className = 'Player'
    let gameUtils = require('./example/gameUtils')
    return gameUtils.declareObjectClass(meta, global.className, 'Object')
$*/
class Player: public Object {
public:
    static constexpr const char *class_name = "Player";
    static constexpr const uint32_t class_hash = 477166624;
/*@*/

    /*$
        let gameUtils = require('./example/gameUtils')
        return gameUtils.declareDerivesFrom(meta, global.className)
    $*/
    virtual bool _derives_from(Player *) {
        return true;
    }
    
    virtual bool _derives_from(Object *) {
        return true;
    }
    /*@*/
};

#endif