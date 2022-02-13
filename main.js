// ########## Settings ########## 
const mainSpawn = 'Spawn1';
const roleHarvester = require('harvester');
const roleUpgrader = require('upgrader');
const roleBuilder = require('builder');

const creepsSettings = {
    harvester: {name: 'Harvester', parts: [WORK, WORK, CARRY, MOVE, MOVE], count: 3, run: roleHarvester.run},
    upgrader:  {name: 'Upgrader',  parts: [WORK, WORK, CARRY, MOVE, MOVE], count: 4, run: roleUpgrader.run },
    builder:   {name: 'Builder',   parts: [WORK, WORK, CARRY, MOVE, MOVE], count: 3, run: roleBuilder.run  },
    defender:  {name: 'Defender',  parts: [WORK, WORK, CARRY, MOVE, MOVE], count: 0, run: roleHarvester.run},
    repair:    {name: 'Repair',    parts: [WORK, WORK, CARRY, MOVE, MOVE], count: 0, run: roleHarvester.run}
}

const creepsCount = {
    harvester: 0,
    upgrader:  0,
    defender:  0, 
    builder:   0, 
    repair:    0, 
    
    toString: () => {
        return JSON.stringify(creepsCount);
    }
};
// #############################


// ######### Functions ##########
const spawnCreep = (creepSetting) => {
    let name = creepSetting.name;
    let pref = new Date();
    let newName  = `${name}_${pref.getTime()}`;
    let newParts = creepSetting.parts;
    let newRole  = creepSetting.name.toLowerCase();
    
    Game.spawns[mainSpawn].spawnCreep(newParts, newName, {memory: {role: newRole}});
    console.log(`💫Try spawning harvester: ${newName}`)
};

const memoryClean = () => {
    // Clear old creeps
    if (Game.time % 100 === 0) {
        for (const name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name]
            }
        }
    }

    // Clear rooms
    if (Game.time % 5000 === 0) {
        for (const name in Memory.rooms) {
            if (!Memory.rooms[name].city) {
                delete Memory.rooms[name]
            }
        }
    }
};

const creepsCountUpdate = () => {
    for(let e in creepsSettings) {
        let role = creepsSettings[e].name.toLowerCase();
        creepsCount[role] = _.filter(Game.creeps, (creep) => creep.memory.role == role).length;
    }
};

const creepsCreateUpdate = () => {
    creepsCountUpdate();

    for(let i in creepsSettings) {
        let st = creepsSettings[i];
        let role = st.name.toLowerCase();
        let count = creepsCount[role];

        if (count < st.count) {
            spawnCreep(st);
            break;
        }
    }
};

const creepsRunUpdate = () => {
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        creepsSettings[creep.memory.role].run(creep);
    }
};
// #############################


// ########## Update ###########
const loop = () => {
    memoryClean();

    creepsCreateUpdate();
    creepsRunUpdate();
};
// #############################


// Finaly export update
module.exports.loop = loop;