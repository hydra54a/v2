
// 
class UserModel {
    constructor(id, email, pwd, firstname, lastname, created_at) {
      this.id = id;
      this.email = email;
      this.pwd = pwd;
      this.firstname = firstname;
      this.lastname = lastname;
      this.created_at = created_at;
    }
  }
  
  module.exports = UserModel;
  