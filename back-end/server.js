const express = require('express');
const connection = require('./util/db'); // Ensure this connects to MySQL
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
const port = 10080;

app.use(express.json());
app.use(bodyParser.json());

const SECRET_KEY = 'your_jwt_secret';

const ProjectRoutes = require('./route/projectRoute');
const TasksRoutes = require('./route/taskRoute');
const dropDownUserRoutes = require('./route/dropDownRoute');
const memberRoute = require('./route/memberRoute');
const calendarRoute = require('./route/calendarRoute');
const dashboardRoute = require('./route/dashboardRoute');
const authenRoute = require('./route/authenRoute');

app.use(cors());
app.use(express.json());

app.use("/members", memberRoute);
app.use("/projects", ProjectRoutes);
app.use("/tasks", TasksRoutes);
app.use("/dropDown", dropDownUserRoutes);
app.use("/calendar", calendarRoute);
app.use("/dashboard", dashboardRoute);
app.use("/auth", authenRoute);

// Login Route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log('Login attempt:', username);

  connection.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      if (!res.headersSent) res.status(500).send('Database error');
      return;
    }
    if (results.length === 0) {
      console.log('Invalid login attempt for:', username);
      if (!res.headersSent) res.status(401).send('Invalid credentials');
      return;
    }

    const user = results[0];
    console.log(user)

    try {
      const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch)

      if (isMatch) {
        console.log('Login successful for:', username);
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        if (!res.headersSent) res.json({ token });
      } else {
        console.log('Wrong password for:', username);
        if (!res.headersSent) res.status(401).send('Invalid credentials');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      if (!res.headersSent) res.status(500).send('Error verifying password');
    }
  });
});

// Middleware for JWT Authentication
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Protected Route
app.get('/protected', authenticateJWT, (req, res) => {
  res.send(`Hello ${req.user.username}, you have accessed a protected route!`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
