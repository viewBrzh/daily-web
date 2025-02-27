const dropDownUserModel = require("../model/dropDownModel");

exports.getDropDownUser = async (req, res) => {
  try {
    const searchValue = req.body.searchValue; 
    const dropDownUser = dropDownUserModel.getUserDropdown(searchValue);
    res.status(200).json((await dropDownUser));
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
};

exports.getDropDownUserByProject = async (req, res) => {
  try {
    const projectId = req.body.projectId; 
    const dropDownUser = dropDownUserModel.getUserDropdownByProject(projectId);
    res.status(200).json((await dropDownUser).finalResult || []);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
};

exports.getTaskfilterDropdown= async (req, res) => {
  try {
    const sprintId = req.body.sprintId; 
    const dropDownUser = dropDownUserModel.getTaskFilterDropdown(sprintId);
    res.status(200).json((await dropDownUser) || []);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
};

