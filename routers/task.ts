import express from "express";
import Task from "../models/Task";
import {ITask} from "../type";
import User from "../models/User";

const taskRouter = express.Router();

taskRouter.get('/', async (_req, res) => {
   try {
        const task = await Task.find();
        res.send(task);
   } catch (error) {
       console.error(error);
       res.status(500).send({ error: 'Internal Server Error' });
   }
});

taskRouter.post('/', async (req, res, next) => {
   try {
       const taskData: ITask = {
           user: req.body.user,
           title: req.body.title,
           description: req.body.description,
           status: req.body.status,
       }

       const task = new Task(taskData);

       const user = await User.findById(req.body.user);

       if (!['new', 'in_progress', 'complete'].includes(req.body.status)) {
           return res.status(404).json({ error: 'There is no such status' });
       }

       if (!user) {
           return res.status(404).json({ error: 'User not found' });
       } else {
           await task.save();
           res.send(task);
       }
   } catch (e) {
       next(e);
   }
});

export default taskRouter;