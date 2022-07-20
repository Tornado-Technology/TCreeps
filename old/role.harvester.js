module.exports = {
/** 
* @param {Creep} creep 
**/
run: creep => {
	const flag = 'Harvesters';
	const colors = { harvest: '#f9da89', transfer: '#f9da89', renew: '#00ff17' };
		
// Shortcuts
	const cMemory = creep.memory;
	const cStore  = creep.store;
	const sState  = cMemory.state;
	
	// Use for state machine
	const states = {
			default:  'd',
			harvest:  'h',
			transfer: 't',
			renew:    'r'
	}

	// TODO: make the room autoload
	const createRoad = () => {
			creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_ROAD);
	};

	// ###### Surces #######
	const spawn = Game.spawns[cMemory.spawn];
	const sources = creep.room.find(FIND_SOURCES, { filter: s => { return (s.energy > 0); } });
	const targets = creep.room.find(FIND_STRUCTURES, {filter: s => { return (s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0; }});
	// #####################


	// ### State machine ###
	if ((sState != states.harvest) && cStore[RESOURCE_ENERGY] == 0) {
		creep.say('⛏️ Harvest!');
		cMemory.state = states.harvest;
	}

	if ((sState != states.transfer) && cStore.getFreeCapacity() == 0) {
		creep.say('🔄 Transfer!');
		cMemory.state = states.transfer;
	}

	// #####################
	// Use State machine data
	//console.log(`Memory: ${JSON.stringify(cMemory)}`);
	// Harvest
	if (sState == states.harvest) {
		if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
			creep.moveTo(sources[0], {visualizePathStyle: {stroke: colors.harvest}});
		}
	}

	// Transfet
	if (sState == states.transfer) {
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