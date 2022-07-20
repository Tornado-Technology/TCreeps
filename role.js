/**
 * Class for creep management with roles.
 */
class Role {

  /**
   * If you don't understand what you are doing
   * don't use this constructor, use  {@link Role.add}.
   * @param {numver} id - Set automatically in  {@link Role.add}.
   * @param {string} prefix - Prefix for creep name.
   * @param {string} name - Name of role(stringID).
   * @param {string} description - Short description about what role do.
   * @param {method} callbackCount - Yes.
   * @param {method} callbackParts - Method for get bodyPart in spawnCreep.
   * @param {method} callbakcRun - Method for update creep.
   */
  constructor(id, prefix, name, description, callbackCount, callbackParts, callbakcRun) {
    this.id = id;
    this.prefix = prefix;
    this.name = name;
    this.description = description;

    this.callbackCount = callbackCount;
    this.callbackParts = callbackParts;
    this.callbakcRun = callbakcRun;
  }

  /**
   * Safe call callbakcRun.
   * @param {Creep} creep - Creep to apply run callback.
   */
  run(creep) {
    try {
      this.callbakcRun(creep);
    } catch (exeption) {
      creep.log(`Role run failed, reason: ${exeption}`);
    }
  }

  getCount() {
    try {
      return this.callbackCount();
    } catch (exeption) {
      console.log(`GetCount run failed, reason: ${exeption}`);
    }
  }

  /**
   * 
   * @param {number} source - Number of avaible source.
   * @returns {array<BodyPartConstant>} - BosyPart for spawn creep.
   */
  getParts(source) {
    return this.callbackParts(source);
  }
}

// #region Role static shit (WHERE NORMAL STATIC?!?!?)
/**
 * 
 * @param {string} prefix - Prefix for creep name.
 * @param {string} name - Name of role(stringID).
 * @param {string} description - Short description about what role do.
 * @param {method} callbackCount
 * @param {method} callbackParts - Method for get bodyPart in spawnCreep.
 * @param {method} callbakcRun - Method for update creep.
 */
function add(prefix, name, description, callbackCount, callbackParts, callbakcRun) {
  this.list[name] = new this(Object.keys(this.list).length, prefix, name, description, callbackCount, callbackParts, callbakcRun);
}

/**
 * 
 */
function update(spawn) {
  // Update spawn creeps
  Object.keys(this.list).every((key) => {
    const role = this.list[key];
    const roleCount = _.filter(Game.creeps, (creep) => creep.memory.role === role.name).length;
    const roleReqired = role.getCount() || 1;

    if (roleCount < roleReqired && spawn.spawning === null) {
      const name = `${role.prefix}_${new Date().getTime()}`;
      const parts = role.getParts(spawn.room.energyCapacityAvailable);
    
      if (Creep.bodyCost(parts) <= spawn.room.energyAvailable) {
        const result = spawn.spawnCreep(parts, name, { memory: {
          role: role.name,
          spawn: spawn.name
        }});

        if (result === OK) {
          return false;
        } 
      }

      return false;
    }

    return true;
  });

  // Update run creeps
  Object.keys(Game.creeps).forEach((name) => {
    const creep = Game.creeps[name];
    const role = creep.memory.role;
    if (Object.keys(this.list).includes(role)) {
      this.list[role].run(creep);
    } else {
      creep.log(`Role run failed, reason: unkown role \"${role}\"`);
    }
  });
}

Role.add = add;
Role.update = update;
Role.list = { };
// #endregion 

const priority = {
  STRUCTURE_TOWER: 0,
  STRUCTURE_EXTENSION: 1,
  STRUCTURE_SPAWN: 2,
  STRUCTURE_STORAGE: 3
};

const storageFilter = (struct1, struct2) => {
  return priority[struct2] - priority[struct1];
};

Role.add('Mn', 'miner', '', () => 1, Creep.calculateBodyMiner, (creep) => {
  const sources = creep.room.find(FIND_SOURCES);
  const closestSource = creep.pos.findClosestByRange(sources);
  if (creep.harvest(closestSource) == ERR_NOT_IN_RANGE) {
    creep.moveTo(closestSource);
  }
});

Role.add('Hr', 'harvester', 'Mine and transfer source.', () => 2, Creep.calculateBodyHarvester, (creep) => {
  // Get some fields
  const memory = creep.memory;
	const store = creep.store;
	const state = memory.state;

	const targets = creep.room.find(FIND_STRUCTURES, {
    filter: (structure) => (
      (structure.structureType === STRUCTURE_EXTENSION || 
      structure.structureType === STRUCTURE_SPAWN ||
      structure.structureType === STRUCTURE_TOWER) && 
      structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    )
  }).sort(storageFilter);

  // Create default state
  if (state === undefined || state === Creep.state.undefined) {
    memory.state = Creep.state.harvest;
  }

  // State machine
	if ((state === Creep.state.harvest) && store.getFreeCapacity() == 0) {
		memory.state = Creep.state.transfer;
	}

	if ((state === Creep.state.transfer) && store[RESOURCE_ENERGY] == 0) {
		memory.state = Creep.state.harvest;
	}

  switch (state) {
    case Creep.state.harvest:
      creep.doPickup();
      break;
    
    case Creep.state.transfer:
      if (targets.length > 0)
        creep.doTransfer(targets);
      else
        creep.doBuild(creep.room.find(FIND_CONSTRUCTION_SITES, {  filter: s => (s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_ROAD || s.structureType == STRUCTURE_TOWER) }));
      break;
  }
});

Role.add('Re', 'repairer', 'Mine and repair biudlings', () => 0, Creep.calculateBodyUpgrader, (creep) => {
  // Get some fields
  const memory = creep.memory;
  const store = creep.store;
  const state = memory.state;

  const targets = creep.room.find(FIND_STRUCTURES, {
    filter: object => {
        return object.structureType !== STRUCTURE_WALL && object.structureType !== STRUCTURE_RAMPART && object.hits < (object.hitsMax / 2) 
    }
  });

  // Create default state
  if (state === undefined || state === Creep.state.undefined) {
    memory.state = Creep.state.harvest;
  }

  // State machine
  if ((state === Creep.state.harvest) && store.getFreeCapacity() == 0) {
    memory.state = Creep.state.transfer;
  }

  if ((state === Creep.state.transfer) && store[RESOURCE_ENERGY] == 0) {
    memory.state = Creep.state.harvest;
  }

  switch (state) {
    case Creep.state.harvest:
      creep.doPickup();
      break;
  
    case Creep.state.transfer:
      if (targets.length > 0)
        creep.doRepair(targets);
      else
        creep.doBuild(creep.room.find(FIND_CONSTRUCTION_SITES, {  filter: s => (s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_ROAD || s.structureType == STRUCTURE_TOWER) }));
      break;
  }
});

Role.add('Ug', 'upgrader', 'Mine and upgrade romm controller.', () => 4, Creep.calculateBodyUpgrader, (creep) => {
  // Get some fields
  const memory = creep.memory;
	const store = creep.store;
	const state = memory.state;
  const spawn = memory.spawn;

  // TODO: Craete global calculate (No in creeps)
  const sources = creep.room.find(FIND_SOURCES, { 
    filter: (source) => (
      source.energy > 0
    )
  });

  // Create default state
  if (state === undefined || state === Creep.state.undefined) {
    memory.state = Creep.state.harvest;
  }

  // State machine
	if ((state === Creep.state.harvest) && store.getFreeCapacity() == 0) {
		memory.state =  Creep.state.upgrade;
	}

	if ((state === Creep.state.upgrade) && store[RESOURCE_ENERGY] == 0) {
		memory.state = Creep.state.harvest;
	}

  switch (state) {
    case Creep.state.harvest:
      creep.doPickup();
      break;
    
    case Creep.state.upgrade:
      creep.doUpgrade();
      break;
  }
});

module.exports = { Role };
