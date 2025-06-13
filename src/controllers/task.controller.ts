import { Request, Response } from 'express';
import { TaskModel, Task } from '../models/task.model';
import { calculateSJFWithPriority } from '../services/scheduler.service';

export const TaskController = {
  async create(req: Request, res: Response) {
    try {
      const data = req.body as Omit<Task,'id'>;
      const task = await TaskModel.create(data);
      return res.status(201).json(task);
    } catch (error) {
      console.error('[TaskController.create] error:', error);
      return res.status(500).json({ error: 'Error creando la tarea' });
    }
  },

  async list(req: Request, res: Response) {
    try {
      const tasks = await TaskModel.findAll();
      return res.json(tasks);
    } catch (error) {
      console.error('[TaskController.list] error:', error);
      return res.status(500).json({ error: 'Error obteniendo las tareas' });
    }
  },

  async schedule(req: Request, res: Response) {
    try {
      const tasks = await TaskModel.findAll();
      const ordered = calculateSJFWithPriority(tasks);
      return res.json(ordered);
    } catch (error) {
      console.error('[TaskController.schedule] error:', error);
      return res.status(500).json({ error: 'Error calculando el scheduling' });
    }
  },


  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const task = await TaskModel.findById(id);
      if (!task) return res.status(404).json({ error: 'Task not found' });
      return res.json(task);
    } catch (err) {
      console.error('[TaskController.getById] error:', err);
      return res.status(500).json({ error: 'Error fetching task' });
    }
  },

  async deleteById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const deleted = await TaskModel.deleteById(id);
      return res.json({ message: 'Task deleted', task: deleted });
    } catch (err: any) {
      console.error('[TaskController.deleteById] error:', err);
      if (err.code === 'P2025') {
        // Prisma error: record not found
        return res.status(404).json({ error: 'Task not found' });
      }
      return res.status(500).json({ error: 'Error deleting task' });
    }
  },

  async deleteAll(req: Request, res: Response) {
    try {
      const count = await TaskModel.deleteAll();
      return res.json({ message: `Deleted ${count} tasks` });
    } catch (err) {
      console.error('[TaskController.deleteAll] error:', err);
      return res.status(500).json({ error: 'Error deleting all tasks' });
    }
  }

};
