
require('require');

let mainSpawn = { name: 'Spawn1', obj: null};

Game.spawns;

const spawnCreep = (creepSetting) => {
    let name = creepSetting.pref;
    let date = new Date();
    
    let newName  = `${name}_${date.getTime()}`;
    let newParts = creepSetting.parts;
    let newRole  = creepSetting.role;
    
    console.log(`${newRole}`)
    mainSpawn.obj.spawnCreep(newParts, newName, {memory: {role: newRole, spawn: mainSpawn.name}});
};

const memoryClean = () => {
    // Clear old creeps
    if (Game.time % 100 === 0) {
        for (const name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log(`🪄Clearing non-existing creep memory: ${name}`);
            }
        }
    }

    // Clear rooms
    if (Game.time % 5000 === 0) {
        for (const name in Memory.rooms) {
            if (!Memory.rooms[name].city) {
                delete Memory.rooms[name];
            }
        }
    }
};

const creepsCreateUpdate = () => {
   
};

const creepsRunUpdate = () => {
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        mainSpawn.obj.population.scripts[creep.memory.role].run(creep);
    }
};




module.exports.loop = () => {
    if (mainSpawn.obj == null) mainSpawn.obj = Game.spawns[mainSpawn.name];
    if (!mainSpawn.obj) return;
    
    memoryClean();
    
    let settings = mainSpawn.obj.population.settings;

    for (let i in settings) {
        let _settings = settings[i];

        let role  = _settings.role;
        let limit = _settings.limit;
        let count = _.filter(Game.creeps, (creep) => creep.memory.role == role).length;

        if (count < limit) {
            spawnCreep(_settings);
            break;
        }
    }
    

    if(Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }
    

    creepsRunUpdate();
};
