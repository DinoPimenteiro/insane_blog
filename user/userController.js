import e from "express";
import bcrypt from "bcryptjs";
import User from './User.js'
import adminAuth from "../middlewares/adminAuth.js";

const userController = e.Router();

userController.get("/admin/users", adminAuth,(req, res) => {
  User.findAll({
    order: [
      ['id', 'DESC']
    ]
  }).then(users => {
      res.render("admin/users/list", {users: users});
  })

})

userController.get("/admin/user/create", (req, res) => {
  res.render("admin/users/create");
})

userController.post("/user/create", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  if (!email || email.trim() === '' || !password || password.trim() === '') {
     return res.redirect("/admin/user/create");
  }

  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);

  User.findOne({
    where: {email: email} }).then(user => {


    if (user == undefined) {
      User.create({ email: email, password: hash
    }).then(() => {
      res.redirect('/');
    }).catch(err => {
      res.redirect('/');
    })

    } else {
      res.redirect("/admin/user/create");
    }
  })
})

userController.get("/login", (req, res) => {
  res.render("admin/users/login")
})

userController.post("/authenticate", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({
    where: {email: email}}).then(user => {
      if (user != undefined){
        //Validação de senha
        var correct = bcrypt.compareSync(password, user.password);
        
        if(correct){
          req.session.user = {
            id: user.id,
            email: user.email
          }
          res.redirect("/admin/articles")

        } else {
          res.redirect("/login")
        }
      } else {
        res.redirect("/login") 
      }
    })
})

userController.get("/logout", (req, res) => {
  req.session.user = undefined;
  res.redirect("/")
})

export default userController;
