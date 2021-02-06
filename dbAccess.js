// データベースに接続 --- (*1)
const NeDB = require('nedb');
const path = require('path');

module.exports = class dbAccess{
  constructor () {
    this.db = new NeDB({
      filename: path.join(__dirname, 'userInfo.db'),
      autoload: true
    });
  }
  insertData(name, password) {
    this.db.insert({
      name: name,
      password: password,
      stime: (new Date()).getTime()
    });
  }

  async asyncPromiseLoginChk(inputName) {
    const result = await this.getNameAndPassword(inputName);
    //console.log(result);
    return result;
  }

  getNameAndPassword(inputName){
    return new Promise(resolve => {
      this.db.find({ name: inputName }, (error, docs) => {
        console.log('docs=', docs);
        //resolve('{"Name":' + docs[0].name + ', "Password":' + docs[0].password + '}');
        resolve({'Name':docs[0].name, 'Password':docs[0].password});
      });
    })
  }


}







/*
//export default class dbAccess {
class dbAccess {
  //constructor(db) {
  //  this.db = db;
  //}
  constructor() {
    
  }

  //// ゲッター
  //get area() {
  //  return this.calcArea();
  //}
  
  // メソッド
  insertData(name, password) {
    this.db.insert({
      name: name,
      password: password,
      stime: (new Date()).getTime()
    });
  }
}

//export default new(dbAccess);
*/