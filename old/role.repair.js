module.exports = {
    /** 
    * @param {Creep} creep 
    **/
    run: creep => {
        const colors = {
            harvest: '#f9da89',
            repair: '#b866ff',
        };

        const cMemory = creep.memory;
        const cStore  = creep.store;
        const cStaet  = cMemory.staet;
        const states = {
            harvest: 'h',
            repair:  'r'
        };

        
        // ### State machine ###
        if (cStaet !== states.harvest && cStore[RESOURCE_ENERGY] == 0) {
            cMemory.state = states.harvest;
            creep.say('⛏️ Harvest!');
	    }
	    
	    if (cStaet !== states.repair && cStore.getFreeCapacity() == 0) {
	        cMemory.state = states.repair;
	        creep.say('✨ Repaire!');
	    }
        // #####################


        // #####################
        if (cState === states.harvest) creep.doMine();
        if (cState === states.repair) creep.doRepair();
        // #####################
    }
}