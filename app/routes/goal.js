// app/routes/goal.js

var Goal      = require('../models/goal');
var Milestone = require('../models/milestone');

module.exports = function(app) {
    //get all goals
    app.get('/api/goals', function(req, res) {
        Goal.find(function(err, goals) {
            if (err) res.send(err);

            res.json(goals);
        });
    });

    //get all goals for a project
    app.get('/api/goals/by-project/:project_id', function(req, res) {
        Goal.find({ projectId : req.params.project_id }, function(err, goals) {
            if (err) res.send(err);

            res.json(goals);
        });
    });

    //get all top-level goals for a project
    app.get('/api/goals/by-project/:project_id/top', function(req, res) {
        Goal.find({ projectId : req.params.project_id, parentId : null }, function(err, goals) {
            if (err) res.send(err);

            res.json(goals);
        });
    });

    //get all child goals for a parent
    app.get('/api/goals/by-parent/:parent_id', function(req, res) {
        Goal.find({ parentId : req.params.parent_id }, function(err, goals) {
            if (err) res.send(err);

            res.json(goals);
        });
    });

    // get a single goal
    app.get('/api/goals/:goal_id', function(req, res) {
        Goal.findById(req.params.goal_id, function(err, goal) {
            if (err) res.send(err);

            res.json(goal);
        });
    });

    // update a single goal
    app.put('/api/goals/:goal_id', function(req, res) {
        Goal.findById(req.params.goal_id, function(err, goal) {
            if (err) res.send(err);

            goal.name = req.body.name;
            goal.description = req.body.description;
            goal.beginDate = req.body.beginDate;
            goal.endDate = req.body.endDate;
            goal.color = req.body.color;
            goal.percentComplete = req.body.percentComplete;
            goal.parentId = req.body.parentId;
            goal.projectId = req.body.projectId;

            goal.save(function(err) {
                if (err) res.send(err);

                res.json({ success: 'Goal Updated'});
            });
        });
    });

    // create a goal
    app.post('/api/goals', function(req, res) {
        if (req.body.parentId == "") {
            delete req.body.parentId;
        }

        var goal = new Goal(req.body);

        goal.save(function(err) {
            if (err) res.send(err);

            res.json({success: 'Goal Created'});
        });
    });

    // delete a goal
    app.delete('/api/goals/:goal_id', function(req, res) {
        Goal.remove({
            _id: req.params.goal_id
        }, function(err, goal) {
            if (err) res.send(err);
        });

        Goal.remove({
            parentId: req.params.goal_id
        }, function(err, goal) {
            if (err) res.send(err);
        });

        Milestone.remove({
            parentId: req.params.goal_id
        }, function(err, goal) {
            if (err) res.send(err);
        });

        res.json({ success: 'Goal Deleted' });
    });
};