Room.prototype.distanceTransform = function() {
  let topDownPass = new PathFinder.CostMatrix();
 
  for (let y = 0; y < 50; ++y) {
    for (let x = 0; x < 50; ++x) {
      
      if (this.getTerrain().get(x, y) === TERRAIN_MASK_WALL) {
        topDownPass.set(x, y, 0);
        continue;
      }

      topDownPass.set(x, y, Math.min(
        topDownPass.get(x - 1, y - 1), 
        topDownPass.get(x + 1, y - 1),
        topDownPass.get(x, y - 1),
        topDownPass.get(x - 1, y)) + 1
      );
    }
  }

  for (let y = 49; y >= 0; --y) {
    for (let x = 49; x >= 0; --x) {
      let value = Math.min(
        topDownPass.get(x, y),
        topDownPass.get(x + 1, y + 1) + 1, 
        topDownPass.get(x - 1, y + 1) + 1, 
        topDownPass.get(x, y + 1) + 1,
        topDownPass.get(x + 1, y) + 1
      );
         
      topDownPass.set(x, y, value);
    }
  }
  
  return topDownPass;
}

Room.prototype.sourcePlaces = function() {
  const terrain = this.getTerrain();
  const sources = this.find(FIND_SOURCES);
  const result = [];
  
  sources.forEach((source) => {
    const sx = source.pos.x;
    const sy = source.pos.y;
    let count = 1;

    for (let x = sx - 1; x < sx + 1; x++) {
      for (let y = sy - 1; y < sy + 1; y++) {
        if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
          count++;
        }
      }
    }

    result.push({
      source: source,
      value: count
    });
  });

  return result;
}