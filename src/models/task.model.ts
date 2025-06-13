import { prisma } from '../db';

export interface Task {
  id: number;
  name: string;
  arrival_time: number;
  duration: number;
  priority: string;
}

export const TaskModel = {
  /**
   * Crea una nueva tarea en la base de datos.
   * @param data Datos de la tarea sin el id
   * @returns La tarea recién creada
   */
  async create(data: Omit<Task, 'id'>): Promise<Task> {
    return await prisma.task.create({ data });
  },

  /**
   * Obtiene todas las tareas, ordenadas por tiempo de llegada.
   * @returns Array de tareas
   */
  async findAll(): Promise<Task[]> {
    return await prisma.task.findMany({
      orderBy: { arrival_time: 'asc' }
    });
  },

  /**
 * Busca una tarea por su ID.
 * @param {number} id Identificador de la tarea
 * @returns {Promise<Task|null>} La tarea, o null si no existe
 */
  async findById(id: number): Promise<Task | null> {
    return prisma.task.findUnique({ where: { id } });
  },

  /**
 * Elimina una tarea por su ID.
 * @param {number} id Identificador de la tarea a eliminar
 * @returns {Promise<Task>} La tarea eliminada
 */
  async deleteById(id: number): Promise<Task> {
    return prisma.task.delete({ where: { id } });
  },

  /**
 * Elimina todas las tareas de la tabla.
 * @returns {Promise<number>} Número de tareas eliminadas
 */
  async deleteAll(): Promise<number> {
    const { count } = await prisma.task.deleteMany({});
    return count;
  }

};
