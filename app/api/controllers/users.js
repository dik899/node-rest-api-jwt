const userModel = require('../models/users');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');

module.exports = {
  create: async function(req, res, next) {
  
   if ( await userModel.findOne({ email:req.body.email})) {
         res.status(409).send("Email is  Already Taken.");
        throw 'Email "' + req.body.email + '" is already taken' ;
        
      }
  userModel.create({ name: req.body.name, email: req.body.email, password: req.body.password }, function (err, result) {
      if (err) 
       next(err);
      else
         res.json({status: "success", message: "User added successfully!!!", data:{ name: req.body.name, email: req.body.email, password:     req.body.password }});
      
    });
  },


 authenticate: function(req, res, next) {
  userModel.findOne({email:req.body.email}, function(err, userInfo){
     if (err) {
      next(err);
     } else {
         if(bcrypt.compareSync(req.body.password, userInfo.password)) 
           {
           const token = jwt.sign({id: userInfo._id}, req.app.get('secretKey'), { expiresIn: '1h' });
            res.json({status:"success", message: "user found!!!",username: userInfo.name ,data:{user: userInfo, token:token}});
           }
         else {
            res.json({status:"error", message: "Invalid email/password!!!", data:null});
             }
           }
     });
   },
 
 getAll: function(req, res, next) {
  let userList = [];
 userModel.find({}, function(err, users){
   if (err){
    next(err);
   } else{
    for (let user of users) {
     userList.push({ id: user._id, name: user.name, email: user.email });
    }
    res.json({status:"success", message: "Users list found!!!", data:{users: userList}});
       
   }
 });
 },

  deleteById: function(req, res, next) {
  userModel.findByIdAndRemove(req.params.userId, function(err, userInfo){
  let userList = [];
    if(err)
      next(err);
   else {
       userModel.find({},function(err,users){
         if(err)
             next(err);
        else{
            for (let user of users) {
                userList.push({ id: user._id, name: user.name, email: user.email });
                }
            res.json({status:"success", message: "User deleted successfully!!!", data:{users: userList }});
            }
        });
     }

  });
 },
  
}
