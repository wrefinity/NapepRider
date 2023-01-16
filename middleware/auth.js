const jwt = require("jsonwebtoken")
const User = require("../model/usersModel")


module.exports = (req, res, next) =>{

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if(token == null ){
        res.locals.user = null
        res.redirect("/users/login")
    }else{

        jwt.verify(token, process.env.PROJECT_SECRET, async (err, decoded)=>{
            if (err) {
                res.locals.user = null
                res.redirect('/users/login')
            }else {
                const user = await User.findById(decoded.id)
                if(user){
                    res.locals.user = user
                    req.user = user
                    next()
                }else{
                    res.locals.user = null
                    res.redirect('/users/login') 
                } 
            }
        })
    }

}