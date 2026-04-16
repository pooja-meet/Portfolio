const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary')
require('dotenv').config()
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'portfolio', // Cloudinary mein folder ka naam
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});


const upload = multer({ storage });

// ✅ Export upload
module.exports = upload;