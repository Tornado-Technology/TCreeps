module.exports = {
    creepScripts: {
        harvester: require('role.harvester'),
        upgrader:  require('role.upgrader'),
        builder:   require('role.builder'),
        defender:  require('role.defender'),
        repair:    require('role.repair')
    },

    // The order in this list is priority
    creepsSettings: {
        harvester: {pref: 'H', role: 'harvester', parts: [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE], limit: 4},
        upgrader:  {pref: 'U', role: 'upgrader',  parts: [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE], limit: 4},
        builder:   {pref: 'B', role: 'builder',   parts: [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE], limit: 2},
        defender:  {pref: 'D', role: 'defender',  parts: [ATTACK, ATTACK, MOVE, MOVE, MOVE],    limit: 1},
        repair:    {pref: 'R', role: 'repair',    parts: [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE], limit: 1}
    },
    
    sourcesLoad: {
        creepRedistribution: true, 
        creepPerSources: []
    }
}