const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');

const User = require('./model/user');
const app = express();
app.use(express.json());
require('dotenv').config()

const port = 3010;

app.use(express.static('static'));


const MONGOO_URI = process.env.MONGOO_URI;

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

mongoose.connect(MONGOO_URI,{
  useNewUrlParser: true,
  useUnifiedTopology:true
})
.then(()=> console.log('Connected to MongoDB Atlas'))
.catch((err)=>console.error('MongoDB connection error :',err))

// Create a new user (POST request)
app.post('/addUser', async (req, res) => {
    try {
        const { name, email } = req.body;
        const newUser = new User({ name, email });
        await newUser.save();
        res.json({ message: 'User added successfully', user: newUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.put('/updateUser/:id', async (req, res) => {
  try {
      const user = await User.findByIdAndUpdate(req.params.id, { email: req.body.email }, { new: true });
      res.json({ message: 'User updated successfully', user });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
