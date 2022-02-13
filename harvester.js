module.exports = {
    /** 
    * @param {Creep} creep 
    **/
    run: (creep) => {
        const createRoad = () => {
            Game.rooms.E22N8.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_ROAD);
        };

        const flag = 'Harvesters';
        const colors = {
            harvest: '#f9da89',
            transfer: '#f9da89'
        };
        
        const cMemory = creep.memory;
        const cStore  = creep.store;
        
        const states = {
            harvest: 'h',
            transfer: 't'
        }

        // ####### Init ########
        if (cMemory.state == undefined) {
            cMemory.state = states.harvest;
        }
        // #####################


        // ###### Surces #######
        const sources = creep.room.find(FIND_SOURCES, {
            filter: (source) => { 
                return (source.energy > 0); 
            }
        });
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        // #####################
        // ### State machine ###
        // If the creep is not mining and the creep's inventory is empty, then we mine
        if (cMemory.state != states.harvest && cStore[RESOURCE_ENERGY] == 0) {
            creep.say('⛏️ Harvest!');
            cMemory.state = states.harvest;
        }

        // If the creep is mining and the creep's inventory is full, then we carry it to storage
        if (cMemory.state != states.transfer && cStore.getFreeCapacity() == 0) {
            creep.say('🔄 Transfer!');
            cMemory.state = states.transfer;
        }
        // #####################
        
   
        // Use State machine data
        if (cMemory.state == states.harvest) {
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: colors.harvest}});
            }
        }

        if (cMemory.state == states.transfer) {
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: colors.transfer}});
                }
            } else {
                creep.moveTo(Game.flags[flag], {visualizePathStyle: {stroke: colors.wait}});
            }
        }
        createRoad();
    }
};