// src/routes/task.routes.ts
import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         name:
 *           type: string
 *         arrival_time:
 *           type: integer
 *         duration:
 *           type: integer
 *         priority:
 *           type: string
 *       required:
 *         - id
 *         - name
 *         - arrival_time
 *         - duration
 *         - priority
 *
 *     CreateTask:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         arrival_time:
 *           type: integer
 *         duration:
 *           type: integer
 *         priority:
 *           type: string
 *       required:
 *         - name
 *         - arrival_time
 *         - duration
 *         - priority
 */


/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Crea una nueva tarea.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTask'
 *     responses:
 *       '201':
 *         description: Tarea creada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
router.post(
    '/tasks',
    async (req, res) => {
      await TaskController.create(req, res);
    }
  );
  
/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Lista todas las tareas.
 *     responses:
 *       '200':
 *         description: Array de tareas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get(
    '/tasks',
    async (req, res) => {
      await TaskController.list(req, res);
    }
  );

/**
 * @swagger
 * /tasks/schedule:
 *   get:
 *     summary: Obtiene el orden óptimo según SJF.
 *     responses:
 *       '200':
 *         description: Tareas ordenadas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get(
    '/tasks/schedule',
    async (req, res) => {
      await TaskController.schedule(req, res);
    }
  );



/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         name:
 *           type: string
 *         arrival_time:
 *           type: integer
 *         duration:
 *           type: integer
 *         priority:
 *           type: string
 *       required:
 *         - id
 *         - name
 *         - arrival_time
 *         - duration
 *         - priority
 */

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Obtiene una tarea por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Identificador de la tarea a buscar.
 *     responses:
 *       '200':
 *         description: La tarea encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       '404':
 *         description: Tarea no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Task not found
 */
router.get('/tasks/:id', async (req, res) => {
    await TaskController.getById(req, res);
  });
  
  /**
   * @swagger
   * /tasks/{id}:
   *   delete:
   *     summary: Elimina una tarea por su ID.
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: Identificador de la tarea a eliminar.
   *     responses:
   *       '200':
   *         description: Tarea eliminada correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Task deleted
   *                 task:
   *                   $ref: '#/components/schemas/Task'
   *       '404':
   *         description: Tarea no encontrada.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Task not found
   *       '500':
   *         description: Error interno al eliminar la tarea.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Error deleting task
   */
  router.delete('/tasks/:id', async (req, res) => {
    await TaskController.deleteById(req, res);
  });
  
  /**
   * @swagger
   * /tasks:
   *   delete:
   *     summary: Elimina todas las tareas (resetea la cola).
   *     responses:
   *       '200':
   *         description: Se eliminaron todas las tareas.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Deleted 3 tasks
   *       '500':
   *         description: Error interno al eliminar todas las tareas.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Error deleting all tasks
   */
  router.delete('/tasks', async (req, res) => {
    await TaskController.deleteAll(req, res);
  });

export default router;
