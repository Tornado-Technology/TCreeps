module.exports = {
   /** 
    * @param {Creep} creep 
    **/
    run: (creep) => {
        const flag = 'Builder';
        const colors = { harvest: '#f9da89', build: '#f9da89'};
		const states = { harvest: 'h', build: 'b'};
        
		// Shortcuts
		const cMemory = creep.memory;
        const cStore  = creep.store;


        // ###### Surces #######
        const sources = creep.room.find(FIND_SOURCES, {
            filter: (source) => { 
                return (source.energy > 0); 
            }
        });
		const targets = creep.room.find(FIND_CONSTRUCTION_SITES, { 
			filter: (constructionSite) => {
				return (constructionSite.structureType == STRUCTURE_EXTENSION)
			}
		});
        // #####################


        // ### State machine ###
        if (cMemory.state != states.harvest && cStore[RESOURCE_ENERGY] == 0) {
            creep.say('⛏️ Harvest!');
            cMemory.state = states.harvest;
        }

        if (cMemory.state != states.biuld && cStore.getFreeCapacity() == 0) {
            creep.say('🛠️ Biuld!');
            cMemory.state = states.biuld;
        }
        // #####################
        
   
        // Use State machine data
        if (cMemory.state == states.harvest) {
			if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }

        if (cMemory.state == states.biuld) {
			if (targets.length > 0) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.moveTo(Game.flags[flag], {visualizePathStyle: {stroke: colors.wait}});
            }
        }
	}
};