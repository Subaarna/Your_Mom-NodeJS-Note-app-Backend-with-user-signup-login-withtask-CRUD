const  openCollection = require("../database/databaseConnection");
const User = require("../models/userModel").User;
const Tasks = require("../models/tasksModel").Tasks;
const GenerateAccessToken = require("../helpers/authHelper").GenerateAccessToken;
const GenerateRefreshToken = require("../helpers/authHelper").GenerateRefreshToken;
const GetIdFromAccessToken = require("../helpers/authHelper").GetIdFromAccessToken;
const bcrypt = require('bcrypt');
const { promisify } = require('util');
const sleep = promisify(setTimeout);
const { ObjectId } = require('mongodb');
const { message } = require("statuses");
const { error } = require("console");


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

async function login(req, res) {
  try {
      const userCollection = await openCollection("users");

      const user = new User(req.body.email, req.body.password);
      const existingUser = await userCollection.findOne({ email: user.email });
      if (!existingUser) {
          return res.json({ message: "User with this email does not exist" });
      }

      const isPasswordValid = await bcrypt.compare(user.password, existingUser.password);
      if (!isPasswordValid) {
          return res.json({ message: "Invalid password" });
      }
        console.log('existingUser._id:', existingUser._id); // Add this line for debugging

      const accessToken = GenerateAccessToken(existingUser._id.toHexString());
      const refreshToken = GenerateRefreshToken(existingUser._id.toHexString());

      return res.json({
          message: "User logged in successfully",
          ID: existingUser._id,
          email: existingUser.email,
          accessToken: accessToken,
          refreshToken: refreshToken,
      });
  } catch (error) {
      console.error('Error during login:', error);
      return res.json({ error: 'Internal server error' });
  }
}

async function addTask(req, res) {
  try {
    const userCollection = await openCollection('users');
    const tasksCollection = await openCollection('tasks');

    // Get user ID from the access token
    const accessTokenId = GetIdFromAccessToken(req);

    // Destructure the task details from the request body
    const { title, description, priority } = req.body;

    // Find the user with the given user ID
    const user = await userCollection.findOne({ _id: new ObjectId(accessTokenId) });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new Task instance with userId included
    const task = new Tasks(title, description, priority, user._id); // user._id is the user's ObjectId

    // Insert the task into the tasks collection
    const result = await tasksCollection.insertOne(task);

    if (result.acknowledged && result.insertedId) {
      return res.status(201).json({ message: 'Task added successfully', taskId: result.insertedId });
    } else {
      return res.status(500).json({ error: 'Failed to add task' });
    }
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
async function getAllTasks(req, res) {
  try {
    //opens the collection task if it doesnot exists it creates it
    const tasksCollection = await openCollection('tasks');

    // Get user ID from the access token
    const accessTokenId = GetIdFromAccessToken(req);

    // Find all tasks for the given user ID
    const tasks = await tasksCollection.find({ userId: new ObjectId(accessTokenId) }).sort({_id :-1}).toArray();

    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateTask(req, res) {
  try {
    const userCollection = await openCollection("users");
    const tasksCollection = await openCollection("tasks");

    // User Id from access token
    const accessTokenId = GetIdFromAccessToken(req);

    const { title, description, priority } = req.body;

    // Searching for user
    const user = await userCollection.findOne({ _id: new ObjectId(accessTokenId) });
    if (!user) {
      throw new Error("User not found");
    }

    // Update the task with the given user ID
    const result = await tasksCollection.updateOne(
      { userId: user._id }, // Update tasks based on user ID
      { $set: { title, description, priority } }
    );

    if (result.acknowledged && result.modifiedCount > 0) {
      return res.status(201).json({ message: "Task updated successfully" });
    } else {
      throw new Error("Failed to update task");
    }
  } catch (error) {
    console.error('Error in updateTask:', error.stack);
    return res.status(500).json({ message: "Internal server error", error });
  }
}


async function deleteTask(req, res) {
  try {
    const tasksCollection = await openCollection("tasks");
    const userCollection = await openCollection("users");

    const accessTokenId = GetIdFromAccessToken(req);

    // Destructure the taskId from the request body
    const { taskId } = req.body;

    // Find user
    const user = await userCollection.findOne({ _id: new ObjectId(accessTokenId) });
    if (!user) {
      return res.json("User not found");
    }

    const deletedTask = await tasksCollection.findOneAndDelete({ _id: new ObjectId(taskId) });

    if (deletedTask.value) {
      return res.status(201).json({ message: "Task deleted successfully" });
    } else {
      throw new Error("Failed to delete task");
    }
  } catch (error) {
    console.error('Error in deleteTask:', error.stack);
    return res.status(500).json({ message: "Internal server error", error });
  }
}



module.exports = {
  posts,
  createUser,
  login,
addTask,
updateTask,
getAllTasks,
deleteTask
};