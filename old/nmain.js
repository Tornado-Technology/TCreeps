global.tickLimit = global.cpuLimit();
global.load = Math.round(Game.cpu.getUsed());

console.log(`${Game.time} Script reload - Load: ${global.load} tickLimit: ${Game.cpu.tickLimit} limit: ${Game.cpu.limit} Bucket: ${Game.cpu.bucket}`);

// Update
module.exports.loop = function() {

};