const socket = require("socket.io");
const User = require("../models/tinderUserSchema")


let users = []


module.exports = (http) => {
    const io = socket(http, {cors: {origin: "http://localhost:3000"}})

    io.on("connect", (socket) => {
        //connect logged in user to socket
    socket.on("connect_user", (data) => {
            console.log(data)
            users.push({
            userInfo: data,
            userSwipedislikes: [],
            id: socket.id
        })
        console.log(data)
        const currentUser = users.find(x => x.id === socket.id)
        io.to(currentUser.id).emit("user_connected", currentUser)  

        

    }),
    socket.on("update_user", async (data) => {

        const currentUser = users.find(x => x.id === socket.id)
        console.log(currentUser)
        const userfromDb = await User.findOne({username: currentUser.userInfo.username})

        currentUser.userInfo = userfromDb
       
       
        io.to(currentUser.id).emit("user_updated", currentUser)  

    }),
    
    socket.on('disconnect', () => {
      
        console.log('user disconnected!')

       users = users.filter(x => x.id !== socket.id)
   });
   socket.on('send_likes', async (data) => {

    
            const currentUser = await users.find(x => x.id === socket.id)

            if(data.likeduser === null){
            
                await currentUser.userSwipedislikes.push(data.disliked)
            
             } else {

                const user =  await User.findOne({username: currentUser.userInfo.username})
                currentUser.userInfo = user
               
                const otherUserConnected = await users.find(x => x.userInfo.username === data.likeduser)

            if(otherUserConnected){
                const otherUser =  await User.findOne({username: data.likeduser})

                otherUserConnected.userInfo = otherUser
                
                await io.to(otherUserConnected.id).emit('likes_added', otherUserConnected)    
            }

             await io.to(currentUser.id).emit('likes_added', currentUser) 
            
        }
    }),
   
   socket.on('swipe_users', async (data) => {
    
        const currentUser = await users.find(x => x.id === socket.id)
        const current = await User.findOne({username: currentUser.userInfo.username})

        let likedUsers = []
    
    
         current.userlikes.map(x => {
             const userExists = likedUsers.find(user => user === x.username)
                if(!userExists){
                likedUsers.push(x.username)   
                } 
            })
    

        let usersNotShown = [...likedUsers, ...currentUser.userSwipedislikes, currentUser.userInfo.username]
      
        const filteredUsers = await User.find({
            username: { $nin: usersNotShown},
            usercity : current.userfilter.city,
            usergender : current.userfilter.gender,
            userage : {$gt: current.userfilter.age[0], $lt: current.userfilter.age[1]}
        })

        
        io.to(currentUser.id).emit('user_filterset', filteredUsers)   
        })

    })

}