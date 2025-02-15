const express=require('express')
const authMiddleware=require('../middleware/auth-middleware')
const isAdminUser = require('../middleware/admin-middleware')
const uploadMiddleware = require('../middleware/upload-middleware');
const {uploadImageController, deleteImageController}=require('../controllers/image-controller');
const router=express.Router();
const {fetchImageController} = require('../controllers/image-controller');
//upload
router.post('/upload',authMiddleware,isAdminUser,uploadMiddleware.single('image'),uploadImageController);
//to get all the images
router.get('/getImages',authMiddleware,fetchImageController);
//delete image route
router.delete('/delete/:id',authMiddleware,isAdminUser,deleteImageController);

module.exports=router;