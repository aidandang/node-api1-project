const express = require('express');
const shortid = require('shortid');

const server = express();
server.use(express.json());

let users = [];

// GET all users
server.get('/api/users', (req, res) => {
  if (!users) {
    res.status(500).json({ errorMessage: "The users information could not be retrieved." });
  } else {
    res.status(200).json({ users });
  }
})

// GET user by Id
server.get('/api/users/:id', (req, res) => {
  const { id } = req.params;

  if (!users) {
    res.status(500).json({ errorMessage: "The user information could not be retrieved." });
  } else {
    const user = users.find(user => user.id === id);
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ message: "The user with the specified ID does not exist." });
    }
  }
})

// POST new user
server.post('/api/users', (req, res) => {
  const newUser = { ...req.body };
  newUser.id = shortid.generate();

  if ((!newUser.name) || (!newUser.bio)) {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user."})
  } else {
    users.push(newUser);
    if (users.find(user => user.id === newUser.id)) {
      res.status(201).json({ user: newUser })
    } else {
      res.status(500).json({ errorMessage: "There was an error while saving the user to the database." })
    }
  }
})

// DELETE user by Id
server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;

  if (!users) {
    res.status(500).json({ errorMessage: "The user could not be removed." });
  } else {
    const user = users.find(user => user.id === id);
    if (user) {
      users = users.filter(user => user.id !== id);
      res.status(200).json(user)
    } else {
      res.status(404).json({ message: "The user with the specified ID does not exist." });
    }
  }
})

// UPDATE user by Id
server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  changes.id = id;

  if (!users) {
    res.status(500).json({ errorMessage: "The user information could not be modified." });
  } else if ((!changes.name) || (!changes.bio)) {
      res.status(400).json({ errorMessage: "Please provide name and bio for the user."})
  } else {
    let found = users.find(user => user.id === id);
    if (found) {
      Object.assign(found, changes);
      res.status(200).json(changes)
    } else {
      res.status(404).json({ message: "The user with the specified ID does not exist." });
    }
  }
})

const PORT = 5000;
server.listen(PORT, () => console.log('API running on port:', 5000));