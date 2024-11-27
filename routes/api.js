'use strict';

const Issue = require('../models');

module.exports = (app) => {

  app.route('/api/issues/:project')
    .get(async (req, res) => {
      const filters = req.query;
      try {
        // Get issues
        const issues = await Issue.find({ project: req.params.project, ...filters });
        res.json(issues);
      } catch (error) {
        res.status(500).json({ error: 'could not retreive issues' });
      }
    })

    .post(async (req, res) => {
      // Check if required fields are missing
      const { issue_title, issue_text, created_by } = req.body;

      if (!issue_title || !issue_text || !created_by)
        return res.json({ error: 'required field(s) missing' });

      // Create new issue
      const newIssue = new Issue({
        project: req.params.project,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || "",
        status_text: req.body.status_text || "",
        created_on: new Date(),
        updated_on: new Date(),
        open: true,
      });
      await newIssue.save();
      res.json(newIssue);
    })

    .put(async (req, res) => {
      const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;
    
      // Check if _id is missing
      if (!_id) return res.json({ error: 'missing _id' });
    
      // Collect update fields
      let updateFields = {};
      if (issue_title) updateFields.issue_title = issue_title;
      if (issue_text) updateFields.issue_text = issue_text;
      if (created_by) updateFields.created_by = created_by;
      if (assigned_to) updateFields.assigned_to = assigned_to;
      if (status_text) updateFields.status_text = status_text;
      if (open !== undefined) updateFields.open = open;
    
      // Check if no update fields were provided
      if (Object.keys(updateFields).length == 0) {
        return res.json({ error: 'no update field(s) sent', _id }); 
      }
      updateFields.updated_on = new Date();
    
      try {
        // Update the issue
        const updatedIssue = await Issue.findByIdAndUpdate(_id, updateFields, { new: true });
    
        // If no issue is found and updated
        if (!updatedIssue) {
          return res.json({ error: 'could not update', _id });
        }
    
        // If update is successful
        res.json({ result: 'successfully updated', _id: updatedIssue._id });
      } catch (error) {
        // Catch any unexpected errors
        return res.json({ error: 'could not update', _id });
      }
    })
    
    .delete(async (req, res) => {
      if (!req.body._id) {
        return res.json({ error: 'missing _id' });
      }

      try {
        // Attempt to delete the issue by its _id
        const result = await Issue.findByIdAndDelete(req.body._id);

        // Check if an issue was found and deleted
        if (result) {
          return res.json({ result: 'successfully deleted', _id: req.body._id });
        } else {
          // If no issue was found with the provided _id
          return res.json({ error: 'could not delete', _id: req.body._id });
        }
      } catch {
        // Handle any database or other errors that occur
        return res.json({ error: 'could not delete', _id: req.body._id });
      }
    });

};
