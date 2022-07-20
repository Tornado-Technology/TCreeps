
// #region Room
/**
 * Message that is sent to the console on behalf of the room with the time stamp.
 * @param {...string} messages - Messages to send.
 */
function roomLog(...messages) {
  console.log(`[${this.name}] ${messages.join(' ')}`);
} Room.prototype.log = roomLog;
// #endregion

// Creep
require('./prototypesCreeps');


// It's not prototype but ok?
Math.radToDeg = (radians) => radians * (180 / Math.PI);
Math.angleTo = (x1, y1, x2, y2) => Math.radToDeg(Math.atan2(y1 - y2, x1 - x2));
Math.clamp = (num, min, max) => Math.min(Math.max(num, min), max);
Math.randomRange = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
Math.inRect = (x, y, x1, y1, x2, y2) => (x >= x1 && x <= x2 && y >= y1 && y <= y2);
Math.sigmoid = (x) => 1 + Math.tanh((2 * x) - 1);
Math.cpuLimit = () => _.ceil(Game.cpu.limit * global.sigmoid(Game.cpu.bucket / 10000));

require('./prototypesAlgoritms');
