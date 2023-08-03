const { ObjectId } = require('mongodb');


class User {
  constructor(email, password, currency, balance) {
    this._id = new ObjectId();

    this.email = email;
    this.password = password;
    this.currency = currency;
    this.balance = balance || 0;
  }
}

class UserLogin {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }
}

module.exports = {
  User,
  UserLogin,
};
