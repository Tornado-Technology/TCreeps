StructureSpawn.prototype.population = {
    scripts: {
        harvester: require('role.harvester'),
        upgrader:  require('role.upgrader'),
        builder:   require('role.builder'),
        defender:  require('role.defender'),
    },

    // The order in this list is priority
    settings: {
        harvester: {pref: 'H', role: 'harvester', parts: [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE], limit: 4},
        upgrader:  {pref: 'U', role: 'upgrader',  parts: [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE], limit: 4},
        builder:   {pref: 'B', role: 'builder',   parts: [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE], limit: 2},
        defender:  {pref: 'D', role: 'defender',  parts: [ATTACK, ATTACK, MOVE, MOVE, MOVE],    limit: 1},
        repair:    {pref: 'R', role: 'repair',    parts: [WORK, WORK, CARRY, MOVE, MOVE, MOVE], limit: 0}
    }
};