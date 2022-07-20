/**
 * All creep posible state in constans
 * @type object
 */
 const creepState = {
  undefined: -1,
  wait: 0,
  idle: 1,
  harvest: 2,
  transfer: 3,
  upgrade: 4,
  build: 5,
  repair: 6
}; Creep.state = creepState;

/**
 * Calculates for an array of a creep body its cost according to BODYPART_COST.
 * @param {array<BodyPartConstant>} body - The array of the body of the creep for which you want to calculate the cost.
 * @returns {number} The cost of creating this body.
 */
function bodyCost(body) {
  let cost = 0;

  body.forEach((part) => { 
    cost += BODYPART_COST[part]; 
  });

  return cost;
}; Creep.bodyCost = bodyCost;


/**
 * Calculate bodyPart for harvseter, you can use it for callbackParts in Role().
 * @param {number} capacity - How much source we have.
 * @param {boolean} forRoads - Choice create creep for roads or not.
 * @returns {array<BodyPartConstant>} Result body for spawnCreep.
 */
 function calculateBodyUpgrader(capacity, forRoads = true) {
  const moveCost = BODYPART_COST.move;
  const workCost = BODYPART_COST.work;
  const carryCost = BODYPART_COST.carry;

  const baseCost = carryCost + workCost + moveCost;
  const bodyPartsCont = Math.floor(capacity / baseCost);

  const result = [];
  for (let i = 0; i < bodyPartsCont; i++) {
    result.push(CARRY);
    result.push(WORK);
    result.push(MOVE);
  }

  return result;
}; Creep.calculateBodyUpgrader = calculateBodyUpgrader;

/**
 * Calculate bodyPart for harvseter, you can use it for callbackParts in Role().
 * @param {number} capacity - How much source we have.
 * @param {boolean} forRoads - Choice create creep for roads or not.
 * @returns {array<BodyPartConstant>} Result body for spawnCreep.
 */
function calculateBodyHarvester(capacity, forRoads = true) {
  const moveCost = BODYPART_COST.move;
  const carryCost = BODYPART_COST.carry;

  const baseCost = carryCost * 2 + moveCost;
  const bodyPartsCont = Math.floor(capacity / baseCost);

  const result = [];
  for (let i = 0; i < bodyPartsCont; i++) {
    result.push(CARRY);
    result.push(CARRY);
    result.push(MOVE);
  }

  return result;
}; Creep.calculateBodyHarvester = calculateBodyHarvester;

/**
 * Calculate bodyPart for harvseter, you can use it for callbackParts in Role().
 * @param {number} capacity - How much source we have.
 * @returns {array<BodyPartConstant>} Result body for spawnCreep.
 */
function calculateBodyMiner(capacity) {
  const moveCost = BODYPART_COST.move;
  const workCost = BODYPART_COST.work;

  const baseCost = workCost + moveCost;
  const bodyPartsCont = Math.floor(capacity / baseCost);

  const result = [];
  for (let i = 0; i < bodyPartsCont; i++) {
    result.push(WORK);
    result.push(MOVE);
  }

  return result;
}; Creep.calculateBodyMiner = calculateBodyMiner;

/**
 * Message that is sent to the console on behalf of the room with the time stamp.
 * @param {...string} messages - Messages to send.
 */
function creepLog(...messages) {
  console.log(`[${this.room.name}][${this.name}] ${messages.join(' ')}`);
} Creep.prototype.log = creepLog;

/**
 * Create road in creep position.
 */
function createRoad() {
  this.room.createConstructionSite(this.pos.x, this.pos.y, STRUCTURE_ROAD);
}; Creep.prototype.createRoad = createRoad;

/**
 * 
 * @param {array<Source | Mineral<MineralConstant> | Deposit>} targets - Array with targets for harvesting
 */
 function creepActionHarvest(targets) {
  if (targets.length === 0) return;
	if (this.harvest(targets[0]) == ERR_NOT_IN_RANGE) {
    this.moveTo(targets[0]);
  }
}; Creep.prototype.doHarvest = creepActionHarvest;

/**
 * 
 * @param {array<AnyCreep | Structure<StructureConstant>} targets - Array with target for transfer
 */
function creepActionTransfer(targets) {
  if (targets.length === 0) return;
  if (this.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    this.moveTo(targets[0]);
  }
}; Creep.prototype.doTransfer = creepActionTransfer;

/**
 * 
 */
function creepActionUpgrade() {
  if (this.upgradeController(this.room.controller) === ERR_NOT_IN_RANGE) {
    this.moveTo(this.room.controller);
  }
}; Creep.prototype.doUpgrade = creepActionUpgrade;

/**
 * 
 * @param targets 
 */
function creepDoBuild(targets) {
  if (targets.length === 0) return;
  if (this.build(targets[0]) == ERR_NOT_IN_RANGE) {
    this.moveTo(targets[0]);
  }
}; Creep.prototype.doBuild = creepDoBuild;

/**
 * 
 * @param targets 
 */
function doRepair(targets) {
  if (targets.length === 0) return;
  if (this.repair(targets[0]) == ERR_NOT_IN_RANGE) {
    this.moveTo(targets[0]);
  }
}; Creep.prototype.doRepair = doRepair;

Creep.prototype.doPickup = function doPickup() {
  const droppedEnergy = this.room.find(FIND_DROPPED_RESOURCES, {
    filter: (resource) => resource.resourceType === RESOURCE_ENERGY
  });

  // Find the closest energy on the ground
  const closestDroppedEnergy = this.pos.findClosestByRange(droppedEnergy);

  // Try to pickup the energy. If it's not in range
  if (this.pickup(closestDroppedEnergy) == ERR_NOT_IN_RANGE) {
    this.moveTo(closestDroppedEnergy);
  }
};