import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

import { QUEUE_MESSAGE_NAMES } from '../common/constants';
import { amqpHelper } from '../common/helpers/amqp.helper';


export const TaskController = {
    async create(req: Request, res: Response) {
        try {
            const taskId = uuid();
            const { name, arrival_time, duration, priority } = req.body;

            await amqpHelper.publish(
                QUEUE_MESSAGE_NAMES.TASK_CREATE,
                { taskId, name, arrival_time, duration, priority }
            );

            return res.sendStatus(202);
        } catch (err) {
            console.error('[TaskController.create] error:', err);
            return res.status(500).json({ error: 'No se pudo encolar la tarea' });
        }
    },

    async list(req: Request, res: Response) {
        try {
            const buf = await amqpHelper.rpcCall(QUEUE_MESSAGE_NAMES.TASK_LIST);
            const tasks = JSON.parse(buf.toString());
            return res.json(tasks);
        } catch (err) {
            console.error('[TaskController.list] error:', err);
            return res.status(500).json({ error: 'No se pudo obtener la lista' });
        }
    },

    async schedule(req: Request, res: Response) {
        try {
            const buf = await amqpHelper.rpcCall(QUEUE_MESSAGE_NAMES.TASK_SCHEDULE);
            const tasks = JSON.parse(buf.toString());
            return res.json(tasks);
        } catch (error) {
            console.error('[TaskController.schedule] error:', error);
            return res.status(500).json({ error: 'Error calculando el scheduling' });
        }
    },


    async getById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const buf = await amqpHelper.rpcCall(
                QUEUE_MESSAGE_NAMES.TASK_GET_BY_ID,
                { id }
            );
            const task = JSON.parse(buf.toString());
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

            await amqpHelper.publish(
                QUEUE_MESSAGE_NAMES.TASK_DELETE_BY_ID,
                { id }
            );

            return res.sendStatus(202);
        } catch (err: any) {
            console.error('[TaskController.deleteById] error:', err);
            return res.status(500).json({ error: 'No se pudo encolar la eliminación' });
        }
    },

    async deleteAll(req: Request, res: Response) {
        try {
            const buf = await amqpHelper.rpcCall(
                QUEUE_MESSAGE_NAMES.TASK_DELETE
            );
            const count = JSON.parse(buf.toString());
            return res.json({ message: `Deleted ${count} tasks` });
        } catch (err) {
            console.error('[TaskController.deleteAll] error:', err);
            return res.status(500).json({ error: 'Error deleting all tasks' });
        }
    }

};
