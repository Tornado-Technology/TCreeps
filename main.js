require('prototypes');
require('config');
const Role = require('role').Role;

global.tickLimit = Game.cpu.limit;
global.load = Math.round(Game.cpu.getUsed());

console.log(`[${Game.time}] Script reload - Load: ${global.load} tickLimit: ${Game.cpu.tickLimit} limit: ${Game.cpu.limit} Bucket: ${Game.cpu.bucket}`);


// AI Update
module.exports.loop = () => {
  // Some base for testing
  memoryCleanUpdate();
  
  // Generate some pixels fro me :D
  if (Game.cpu.bucket >= PIXEL_CPU_COST) {
    Game.cpu.generatePixel();
  }

  const towers = _.filter(Object.values(Game.structures), (struct) => struct.structureType === 'tower');

  towers.forEach((tower) => {
    let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => structure.hits < structure.hitsMax
    });
    
    if (closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    }
  });

  Object.keys(Game.spawns).forEach((key) => {
    const spawn = Game.spawns[key];
    Role.update(spawn);
  });
}

const memoryCleanUpdate = () => {
  if (!global.settings.cleaningMemory.enabled) return;
  
  // Clear old creeps
  if (Game.time % global.settings.cleaningMemory.interval.creeps === 0) {
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log(`Clearing non-existing creep memory: ${name}`);
      }
    }
  }

  // Clear rooms
  if (Game.time % global.settings.cleaningMemory.interval.rooms === 0) {
    for (const name in Memory.rooms) {
      if (!Memory.rooms[name].city) {
        delete Memory.rooms[name];
        console.log(`Clearing non-existing room memory: ${name}`);
      }
    }
  }
}
