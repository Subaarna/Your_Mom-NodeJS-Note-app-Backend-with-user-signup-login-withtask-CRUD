const  openCollection = require("../database/databaseConnection");
const User = require("../models/userModel").User;
const bcrypt = require("bcrypt");

const posts = [
    {
        user: "kim",
        title: "dictator"
    },
    {
        user: "kong",
        title: "monkey"
    }
];

const saltRounds= 5; //rounds to hash the password
async function createUser(req, res) {
  try {
    const userCollection = await openCollection("users");

    // Create a new User object from the request body
    const user = new User(req.body.email, req.body.password);

    // Check if the email already exists
    const existingUser = await userCollection.findOne({ email: user.email });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password= hashedPassword;
    // Insert the new user into the database
    const result = await userCollection.insertOne(user);

    // Check if the insertion was successful
    if (result.acknowledged && result.insertedId) {
      return res.json({ message: 'User created successfully' });
    } else {
      return res.json({ error: 'Failed to create user' });
    }
  } catch (error) {
    console.error('Error creating user:', error);
    return res.json({ error: 'Internal server error' });
  }
}
async function login(req, res){
  try{
    
    const userCollection= await openCollection("users");

    const user = new User(req.body.email, req.body.password);
   const existingUserEmail = await userCollection.findOne({email:user.email})
    if(!existingUserEmail){
      return res.json({message: "User with this email does not exist"})
    }

    const existingUserPass = await userCollection.findOne({password: user.password})
    if (!existingUserPass){
      return res.json({message:"Invalid password"})
    }
    return res.json({message:"User logged in successfully!"})
  }
  catch (error) {
    console.error('Error during login:', error);
    return res.json({ error: 'Internal server error' });
  }
}




module.exports = {
  posts,
  createUser,
  login,
};