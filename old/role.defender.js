module.exports = {
    /**
    * @param {Creep} creep 
    **/
    run: creep => {
        const flag = 'Defenders';
        const enemys = creep.room.find(FIND_CREEPS, { filter: c => {c.my == false; }})

        if (enemys.length > 0) {
            if (creep.attack(enemys[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(enemys[0]);
            }
        } else {
            creep.moveTo(Game.flags[flag]);
        }
    }
}