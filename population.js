const roleHarvester = require('harvester');
const roleUpgrader = require('upgrader');
const roleBuilder = require('builder');

module.exports = {
    creepsSettings: {
        harvester: {name: 'Harvester', parts: [WORK, CARRY, MOVE, MOVE], count: 3, run: roleHarvester.run},
        upgrader:  {name: 'Upgrader',  parts: [WORK, CARRY, MOVE, MOVE], count: 4, run: roleUpgrader.run },
        builder:   {name: 'Builder',   parts: [WORK, CARRY, MOVE, MOVE], count: 3, run: roleBuilder.run  },
        defender:  {name: 'Defender',  parts: [WORK, CARRY, MOVE, MOVE], count: 0, run: roleHarvester.run},
        repair:    {name: 'Repair',    parts: [WORK, CARRY, MOVE, MOVE], count: 0, run: roleHarvester.run}
    }
}