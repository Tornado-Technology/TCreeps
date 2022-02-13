module.exports = {
    /**
    * @param {Creep} creep 
    **/
    run: (creep) => {
        const createRoad = () => {
            Game.rooms.E22N8.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_ROAD);
        };

        const colors = {
            harvest: '#f9da89',
            upgrade: '#b866ff',
        };
        const cMemory = creep.memory;
        const cStore  = creep.store;
        const states = {
            harvest: 'h',
            upgrade: 'u'
        };

        // ####### Init ########
        if (cMemory.state == undefined) {
            cMemory.state = states.harvest;
        }
        // #####################


        // ###### Surces #######
        const sources = creep.room.find(FIND_SOURCES, {
            filter: (source) => { 
                return (source.energy != 0); 
            }
        });
        // #####################
        

        // ### State machine ###
        if (cMemory.state != states.harvest && cStore[RESOURCE_ENERGY] == 0) {
            cMemory.state = states.harvest;
            creep.say('⛏️ Harvest!');
	    }
	    
	    if (cMemory.state != states.upgrade && cStore.getFreeCapacity() == 0) {
	        cMemory.state = states.upgrade;
	        creep.say('⚡ Upgrade');
	    }
        // #####################


        // #####################
        if (cMemory.state == states.harvest) {
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: colors.harvest}});
            }
        }

	   if(cMemory.state == states.upgrade) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: colors.upgrade}});
            }
        }
        // #####################

        createRoad();
	}
};