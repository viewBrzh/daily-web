const express = require('express');
const connection = require('./util/db');
const cors = require('cors');

const app = express();
const port = 10080;

app.use(express.json());

const ProjectRoutes = require('./route/projectRoute');
const MytasksRoutes = require('./route/myTaskRoute');
const dropDownUserRoutes = require('./route/dropDownRoute');
const memberRoute = require('./route/memberRoute');

app.use(cors());
app.use(express.json());

app.use("/members", memberRoute);
app.use("/projects", ProjectRoutes);
app.use("/myTasks", MytasksRoutes);
app.use("/dropDown", dropDownUserRoutes);

app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve users' });
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
