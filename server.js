const express = require("express");
const connectDB = require('./config/db');
const app = express();
//Connect Database
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));
//Init Middleware

const PORT = process.env.PORT || 5000;

app.get("/", (req,res) => {
    console.log(res);
    res.send("API Running");
});

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
});