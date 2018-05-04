#ifndef OBJECT_H
#define OBJECT_H

#include <memory>
#include <unordered_map>
#include <string>
#include <vector>
#include <any>
#include <cassert>
#include <functional>

/*$
    let gameUtils = require('./example/gameUtils')
    return gameUtils.forwardDeclareObjectClasses(meta)
$*/
class BlahPlayer;
class Game;
class Object;
class Player;
/*@*/

class TypeInfo {
public:
    static inline uint32_t instance_id = 0;
};

/*$
    let gameUtils = require('./example/gameUtils')
    return gameUtils.declareObjectClass(meta, 'Object')
$*/
class Object {
public:
    static constexpr const char *class_name = "Object";
    static constexpr const uint32_t class_hash = 3851314394;
/*@*/
    const uint32_t instance_id = TypeInfo::instance_id++;

    virtual ~Object() {

    }

    template<class T>
    bool derives_from() {
        return _derives_from(static_cast<T *>(nullptr));
    }

    /*$
        let gameUtils = require('./example/gameUtils')
        return gameUtils.declareDerivesFrom(meta)
    $*/
    virtual bool _derives_from(BlahPlayer *) {
        return false;
    }
    
    virtual bool _derives_from(Game *) {
        return false;
    }
    
    virtual bool _derives_from(Object *) {
        return false;
    }
    
    virtual bool _derives_from(Player *) {
        return false;
    }
    /*@*/
};

#endif