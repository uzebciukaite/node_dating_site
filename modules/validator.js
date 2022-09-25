const User = require("../models/tinderUserSchema")

module.exports  = {
    validateData: async (req, res, next) => {

    const {username, userpass, userpass2, usercity, userage, usergender} = req.body
        
    const userExists =  await User.findOne({username})

    
       
    if(username === "" || userpass === "" || userpass2 === "" || usercity === "" || userage === "" || usergender === undefined || usergender === "gender") return res.send({error:true, message: "Please fill in all fields" })

    if(userExists) return res.send({error:true, message: "User already exists" })
    
    if(userpass !== userpass2) return res.send({error:true, message: "Passwords do not match" })
    
    if(userage < 18) return res.send({error:true, message: "You must be 18 or more years old to be able to register" })
     
    
    next()
    
        
    

}
}