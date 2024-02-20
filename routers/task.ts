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

taskRouter.put('/:id', async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const userId = req.body.user;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        if (task.user.toString() !== userId) {
            return res.status(403).json({ error: 'You do not have permission to edit this task' });
        }

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.status = req.body.status || task.status;

        await task.save();

        res.json(task);
    } catch (e) {
        next(e);
    }
});

taskRouter.delete('/:id', async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const userId = req.body.user;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        if (task.user.toString() !== userId) {
            return res.status(403).json({ error: 'You do not have permission to delete this task' });
        }

        await Task.deleteOne({ _id: taskId });

        res.json({ message: 'Task deleted successfully' });
    } catch (e) {
        next(e);
    }
});

export default taskRouter;