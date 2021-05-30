const express = require("express");
const app = express();

// simple route
app.get("/", (req, res) => {  
  res.json({ message: "Welcome to my CRUD application." });
});

app.use(express.json());

const mongoose = require('mongoose')

mongoose
  .connect('mongodb://localhost:27017/User', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    // initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });
//Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  country: String
});

const Users = mongoose.model('Users',userSchema)

// routes
//Post request to create a new data 
app.post('/create', (req, res)=> {
 Users.create({
   name: req.body.name,
   email: req.body.email,
   country: req.body.country
 }, (err, newUser)=> {
   if(err){
     res.status(500).json({message: 'An error occured'})
   }else{
     res.status(200).json({message: 'New user created', newUser})
   }
 })
})
//Get request to get the data created
app.get('/users', (req,res)=> {
  Users.find({}, (err, users)=>{
    if (err){
      res.status(500).json({message: 'An error ccured'})
    } else {
      res.status(200).json({users})
    }
  })
})
//Put request to update the data
app.put('/users/:id', (req,res)=>{
  Users.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    country: req.body.country
  }, (err, user)=>{
    if(err){
      res.status(500).json({message: 'Oops, error occured'})
    }else if(!user){
      res.status(404).json({message: 'User not found'})
    }else {
      user.save((err, saveduser)=>{
        if (err){
          res.status(500).json({message: 'Error: User not updated'})
        }else{
          res.status(200).json({message: 'user updated', saveduser})
        }
      })
    }
  })
});
//Delete request delete data
app.delete('users/:id', (req, res) => {
  Users.findByIdAndDelete(req.params.id, (err, user)=>{
    if(err){
      res.status(500).json({message: 'Error deleting this user'})
    } else if (!user){
      res.status(404).json({message: 'oops, book with id ' + req.params.id + 'does not exist'})
    }else {
      res.status(200).json({message: user + 'deleted sucessfully'})
    }
  })
})

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});