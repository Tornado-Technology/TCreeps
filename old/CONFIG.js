// Friends list
try {
    global.friends = require('friends');
    console.log('Friends list loaded!');
} catch (err) {
    global.friends = [];
    console.log(`Frineds list not loaded! ${err.message}`);
}
// #############


// Main
global.config = {
    ticklog: {
        gcl: true,
        bucket: true,
        separator: true
    }
};
// #############