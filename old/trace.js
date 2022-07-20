/**
 * @param {...string} messages 
 */
Room.prototype.log = (...messages) => {
    console.log(`[${Game.time}][${this.name}] ${messages.join(' ')}`);
};