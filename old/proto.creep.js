/**
 * Leaves the ConstructionSite in place of the creep
 * @param {structureType} structure 
 */
Creep.prototype.createTrail = structure => {
    this.room.createConstructionSite(this.pos.x, this.pos.y, structure);
};

Creep.prototype.createTrailRoad = () => {
    this.room.createConstructionSite(this.pos.x, this.pos.y, STRUCTURE_ROAD);
};


Creep.prototype.doMine = () => {
    
    /*const memory = this.memory;
    const pos = this.pos;

    let source = [];
 
    // Ищем наилучший ресурс
    if (memory.sID) {
        source =  pos.findClosestByPath(FIND_SOURCES_ACTIVE, { filter: s => { s.id === memory.sID }});
    }

    if (!source) {
        // Ищем ресур похуже
        if (memory.sBadID) {
            source = pos.findClosestByPath(FIND_SOURCES_ACTIVE, { filter: s => { s.id !== memory.badResID }});
        }

        // ДАЙТЕ МНЕ УЖЕ ЛЮБОЙ РЕСУРС!
        if (!source) {
            source = pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        }
    }


    // Добывае
    const actResult = this.harvest(source);*/
    const sources = creep.room.find(FIND_SOURCES, { filter: s => { return (s.energy > 0); } });
    if (this.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        this.moveTo(sources[0], {visualizePathStyle: {stroke: '#f9da89'}});
    }
};

Creep.prototype.doRepair = () => {
    const targets = creep.room.find(FIND_STRUCTURES, {
        filter: object => {
            return object.structureType !== STRUCTURE_WALL && object.structureType !== STRUCTURE_RAMPART && object.hits < (object.hitsMax / 2) 
        }
    });
    
    if (targets.length > 0) {
        // Repair
        if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#b866ff'}});
        }
    }
};