require('dotenv').config()
const express = require('express')
const app = express()

const connectDb = require('./config/db')
const AuthRoutes = require('./Routes/authRoute')
const heroRoutes = require('./Routes/heroRoute');
const skillRoutes = require('./Routes/skillRoute');
const serviceRoutes = require('./Routes/serviceRoute')
const projectRoutes = require('./Routes/projectRoute')
const contactMsg = require('./Routes/ContactMsgRoute')
const contactInfo = require('./Routes/ContactInfoRoute')

const cors = require('cors')

// middleware
app.use(express.json())

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// routes
app.use('/api/auth', AuthRoutes)
app.use("/api/hero", heroRoutes);
app.use("/api/skill", skillRoutes);
app.use('/api/project', projectRoutes)
app.use('/api/service', serviceRoutes)
app.use('/api/contact-msg', contactMsg)
app.use('/api/contact-info', contactInfo)
// error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong" });
});

// server
const PORT = process.env.PORT || 3000

connectDb().then(() =>
    app.listen(PORT, () =>
        console.log(`server is running at http://localhost:${PORT}`)
    )
)
