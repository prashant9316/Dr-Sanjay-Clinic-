const jwt = require('jsonwebtoken')

const isPatient = async(req, res, next) => {
    if(req.user.role == "patient"){
        next();
    } else {
        return res.status(401).send("Unauthorized Access!");
    }
}

const isAdmin = async(req, res, next) => {
    const token = req.cookies.AuthToken
    if(!token) return res.redirect('/')

    try {
        const verified = jwt.verify(token, process.env.SECRET_TOKEN)
        req.user = verified;
        if(req.user.role == 'admin'){
            next();
        } else {
            return res.redirect('/')
        }
    } catch(error) {
        console.log(error)
        return res.redirect('/')
    }
}

const isLoggedIn = async(req, res, next) => {
    const token = req.cookies.AuthToken
   try {
    if(token){
        verified = jwt.verify(token, process.env.SECRET_TOKEN)
        // const user = await User.findOne({ _id: verified._id })
        req.user = verified

    } else {
        req.user= {
            _id: false
        }
    }
    next()
   } catch (error) {
       console.log("ERROR AT ISLOGGEDIN: " + error)
       next()
   }
}


module.exports = {
    isPatient: isPatient, 
    isAdmin: isAdmin,
    isLoggedIn: isLoggedIn
}