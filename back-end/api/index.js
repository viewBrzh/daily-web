const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const serverless = require('serverless-http');
const ProjectRoutes = require('../routes/projectRoute');
const TasksRoutes = require('../routes/taskRoute');
const dropDownUserRoutes = require('../routes/dropDownRoute');
const memberRoute = require('../routes/memberRoute');
const calendarRoute = require('../routes/calendarRoute');
const dashboardRoute = require('../routes/dashboardRoute');
const authenRoute = require('../routes/authenRoute');

const app = express();

app.use(cors());
app.use(express.json());  
app.use(bodyParser.json())

// Example route
app.use("/hello", (req, res) => {
  res.status(200).json({ mesg: "hello" });
});

app.use("/members", memberRoute);
app.use("/projects", ProjectRoutes);
app.use("/tasks", TasksRoutes);
app.use("/dropDown", dropDownUserRoutes);
app.use("/calendar", calendarRoute);
app.use("/dashboard", dashboardRoute);
app.use("/auth", authenRoute);

// Wrap the app using serverless-http
module.exports.handler = serverless(app);
