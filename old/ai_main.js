'use strict';

ai.main.update = function() {
    try {
        // Update
    } catch (err) {
        console.log(`AI Error: ${err.message}`);
    }

    if (global.config.ticksummary.gcl)       console.log(`${Game.time} GCL ${Game.gcl.level}: ${global.utils.lpadround(Game.gcl.progress/Game.gcl.progressTotal*100, 3, 5)} %  ${Math.round(Game.gcl.progress)}/${Math.round(Game.gcl.progressTotal)}`);
    if (global.config.ticksummary.bucket)    console.log(`${Game.time} Bucket: ${Game.cpu.bucket}`);
    if (global.config.ticksummary.seperator) console.log(Game.time, '-----------');
};