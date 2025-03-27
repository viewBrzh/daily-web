const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const serverless = require('serverless-http');
const ProjectRoutes = require('../route/projectRoute');
const TasksRoutes = require('../route/taskRoute');
const dropDownUserRoutes = require('../route/dropDownRoute');
const memberRoute = require('../route/memberRoute');
const calendarRoute = require('../route/calendarRoute');
const dashboardRoute = require('../route/dashboardRoute');
const authenRoute = require('../route/authenRoute');
const PORT = process.env.PORT || 3000;

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

module.exports = app;
module.exports.handler = serverless(app); 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});