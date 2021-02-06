module.exports = class hashCreator{
  constructor (character) {
       this.character = character;
  }
  hashCreate() {
    const crypto = require('crypto');
    const str = this.character;
    const hashHex = crypto.createHash('sha256').update(str, 'utf8').digest('hex');
    //console.log(hashHex);
    return hashHex;
  }
}