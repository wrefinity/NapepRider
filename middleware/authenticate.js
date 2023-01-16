const jwt = require('jsonwebtoken')
const User = require('../model/usersModel')

const checkUser = (req, res, next)=>{
    const token = req.cookies.authentication

    if(token){
        
        jwt.verify( token, process.env.PROJECT_SECRET, async (err, decoded)=>{
            if(err){              
                res.locals.user = null
                res.redirect('/users/login')
                next()
            }
            let user = await User.findById(decoded.id)
            if (user){
                res.locals.user = user
                req.user = user
                next()
            }else{
                res.locals.user = null
                res.redirect('/users/login')
                next()
            }
        })
        
    }else{
        res.locals.user = null
        res.redirect('/users/login')
    }
}

const verifyTokenAndAdmin = (req, res, next) => {
    checkUser(req, res, () => {
      if (req.user.role == "doc" || req.user.role == "lab-scientist" || req.user.role =="admin") {
        next();
      } else {
        res.locals.user = null
        res.status(403).redirect('/users/login')
      }
    });
  };
// Non-Academic-Staff

module.exports = {
    checkUser,
    verifyTokenAndAdmin
}