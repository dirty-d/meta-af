#ifndef BLAHPLAYER_H
#define BLAHPLAYER_H

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
    global.className = 'BlahPlayer'
    let gameUtils = require('./example/gameUtils')
    return gameUtils.declareObjectClass(meta, global.className, 'Object')
$*/
class BlahPlayer: public Object {
public:
    static constexpr const char *class_name = "BlahPlayer";
    static constexpr const uint32_t class_hash = 2222639227;
/*@*/

    /*$
        let gameUtils = require('./example/gameUtils')
        return gameUtils.declareDerivesFrom(meta, global.className)
    $*/
    virtual bool _derives_from(BlahPlayer *) {
        return true;
    }
    
    virtual bool _derives_from(Object *) {
        return true;
    }
    /*@*/
};

#endif