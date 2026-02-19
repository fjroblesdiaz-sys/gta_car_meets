const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let data = {
  users: [],
  cars: [],
  meets: [],
  messages: []
};

// Users
app.get('/api/users', (req, res) => {
  res.json(data.users);
});

app.post('/api/users', (req, res) => {
  const { username, email, password } = req.body;
  if (data.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email ya registrado' });
  }
  const newUser = {
    id: crypto.randomUUID(),
    username,
    email,
    password,
    createdAt: Date.now()
  };
  data.users.push(newUser);
  res.json(newUser);
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = data.users.find(u => u.email === email && u.password === password);
  if (user) {
    res.json(user);
  } else {
    res.status(401).json({ error: 'Credenciales incorrectas' });
  }
});

// Cars
app.get('/api/cars', (req, res) => {
  res.json(data.cars);
});

app.post('/api/cars', (req, res) => {
  const { userId, name, model, mods, imageUrl } = req.body;
  const newCar = {
    id: crypto.randomUUID(),
    userId,
    name,
    model,
    mods: mods || [],
    imageUrl,
    createdAt: Date.now()
  };
  data.cars.push(newCar);
  res.json(newCar);
});

app.delete('/api/cars/:id', (req, res) => {
  data.cars = data.cars.filter(c => c.id !== req.params.id);
  res.json({ success: true });
});

// Meets
app.get('/api/meets', (req, res) => {
  res.json(data.meets);
});

app.post('/api/meets', (req, res) => {
  const { userId, title, description, location, date, time } = req.body;
  const newMeet = {
    id: crypto.randomUUID(),
    userId,
    title,
    description,
    location,
    date,
    time,
    participants: [],
    createdAt: Date.now()
  };
  data.meets.push(newMeet);
  res.json(newMeet);
});

app.delete('/api/meets/:id', (req, res) => {
  data.meets = data.meets.filter(m => m.id !== req.params.id);
  res.json({ success: true });
});

app.post('/api/meets/:id/join', (req, res) => {
  const { playerName } = req.body;
  const meet = data.meets.find(m => m.id === req.params.id);
  if (meet && !meet.participants.includes(playerName)) {
    meet.participants.push(playerName);
  }
  res.json(meet);
});

app.post('/api/meets/:id/leave', (req, res) => {
  const { playerName } = req.body;
  const meet = data.meets.find(m => m.id === req.params.id);
  if (meet) {
    meet.participants = meet.participants.filter(p => p !== playerName);
  }
  res.json(meet);
});

// Messages
app.get('/api/messages', (req, res) => {
  res.json(data.messages);
});

app.post('/api/messages', (req, res) => {
  const { userId, username, text } = req.body;
  const newMessage = {
    id: crypto.randomUUID(),
    userId,
    username,
    text,
    createdAt: Date.now()
  };
  data.messages.push(newMessage);
  res.json(newMessage);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
