const express = require("express")
const router = express.Router()

const {regnewUser, lognewUser, addNewPhoto, logWithSession, logout, addFilter, addLikes} = require("../controllers/mainController")

const {validateData} = require("../modules/validator")

router.post("/regUser", validateData, regnewUser)
router.post("/logUser", lognewUser)
router.post("/uploadPhotos", addNewPhoto)
router.get("/autologin", logWithSession)
router.get("/logout", logout)
router.post("/filter", addFilter)
router.post("/addlikes", addLikes)




module.exports  = router