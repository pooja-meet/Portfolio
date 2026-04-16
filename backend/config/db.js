const mongoose = require('mongoose')
require("dotenv").config()
const connectDb = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_DB)
        console.log("MongoDb connected successfully", db.connection.host)
    } catch (error) {
        console.error("Mongodb is not connected", error.message)
        process.exit(1)
    }
}
module.exports=connectDb;