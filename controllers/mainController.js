const User = require("../models/tinderUserSchema")
const bcrypt = require("bcrypt")



module.exports = {

   regnewUser: async (req, res) => {
    const { username, userpass, usercity, userage, usergender} = req.body
    const hashedpass =  await bcrypt.hash(userpass, 10)

    const user = new User({
        username: username,
        userpass: hashedpass,
        usercity: usercity,
        usergender: usergender,
        userage: userage
    })

    await user.save()
    
    res.send({error: false, user})
        
},
    lognewUser: async (req, res) => {

        const {username, userpass} = req.body
        

    const result =  await User.findOne({username})
    
    if(result){
        const compare =  await bcrypt.compare(userpass, result.userpass)
        if(compare){
            req.session.user = result
            res.send({error:false, message: "user was found", result})
        } else {
            return res.send({error:true, message: "incorrect password"})
        }
    } else {
           return  res.send({error:true, message: "user not found"})
        }
    },

    // log user if checkbox keep me signed in is true
    logWithSession: async (req, res) => {
        
         if(req.session.user) {
            const {username} = req.session.user
            
            const user = await User.findOne({username})

            return res.send({error:false, message: "user was found", user})
        }
        res.send({error:true, message: "user not found"})
        
    },
    logout: async (req, res) => {
        
        req.session.destroy();
        console.log(req.session.user)
        res.send({error:false, message: "user was remover from session"})
    },
    addNewPhoto: async (req, res) => {
        const { username, userphotos} = req.body
        

        const user =  await User.findOneAndUpdate({username}, {$push: {userphotos: {$each: userphotos}}})
        if(user) return res.send({error: false, user})
        
    },
    addFilter: async (req, res) => {
        const {currentuser, city, gender, value} = req.body
        
        const user = await User.findOneAndUpdate({username: currentuser}, {$set: {userfilter: {city: city, gender: gender, age: value}}}, {new: true})


        res.send({error:false, message: "user updated", user})
      

    },
    addLikes: async (req, res) => {
        const {currentuser, likeduser} = req.body

        const current = await User.findOne({username: currentuser})

        if(likeduser === null){
            
           res.send({error:true, message: "user was disliked"})
        } else {
            const otherUser = await User.findOneAndUpdate({username: likeduser}, {$push: {userlikedby: {
                username: current.username,
                usercity: current.usercity,
                userage: current.userage, 
                usergender: current.usergender,
                userphotos: current.userphotos
            }}})
            
            const user = await User.findOneAndUpdate({username: currentuser}, {$push: {userlikes: {
                username: otherUser.username,
                usercity: otherUser.usercity,
                userage: otherUser.userage, 
                usergender: otherUser.usergender,
                userphotos: otherUser.userphotos}}})

            res.send({error:false, message: "user updated", user})
        }
        

    }

}