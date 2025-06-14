import { calculateSJFWithPriority } from "../../services/scheduler.service"
import type { Task } from '../../models/task.model'

describe('calculateSJFWithPriority (BACKEND)', () => {
    it('ordena por duración (sin empates)', () => {
      const tasks: Task[] = [
        { id: 1, name: 'T1', arrival_time: 0, duration: 10, priority: 'media', status: 'pending' },
        { id: 2, name: 'T2', arrival_time: 0, duration:  5, priority: 'media', status: 'pending' },
        { id: 3, name: 'T3', arrival_time: 0, duration: 15, priority: 'media', status: 'pending' },
      ];
  
      const ordered = calculateSJFWithPriority(tasks);
      expect(ordered.map(t => t.id)).toEqual([2, 1, 3]);
    });
  
    it('deshace empates por prioridad (alta > media > baja)', () => {
      const tasks: Task[] = [
        { id: 1, name: 'A', arrival_time: 0, duration: 5, priority: 'media', status: 'pending' },
        { id: 2, name: 'B', arrival_time: 0, duration: 5, priority: 'alta',  status: 'pending' },
        { id: 3, name: 'C', arrival_time: 0, duration: 5, priority: 'baja',  status: 'pending' },
      ];
  
      const ordered = calculateSJFWithPriority(tasks);
      expect(ordered.map(t => t.id)).toEqual([2, 1, 3]);
    });
  
    it('respeta los tiempos de llegada', () => {
      const tasks: Task[] = [
        { id: 1, name: 'X', arrival_time: 0, duration: 4, priority: 'alta', status: 'pending' },
        { id: 2, name: 'Y', arrival_time: 3, duration: 2, priority: 'alta', status: 'pending' },
        { id: 3, name: 'Z', arrival_time: 5, duration: 1, priority: 'alta', status: 'pending' },
      ];
  
      const ordered = calculateSJFWithPriority(tasks);
      expect(ordered.map(t => t.id)).toEqual([1, 2, 3]);
    });
  
    it('escenario mixto de arrival, duration y priority', () => {
      const tasks: Task[] = [
        { id: 1, name: 'A', arrival_time: 0, duration:  8, priority: 'media', status: 'pending' },
        { id: 2, name: 'B', arrival_time: 1, duration:  4, priority: 'alta',  status: 'pending' },
        { id: 3, name: 'C', arrival_time: 2, duration:  9, priority: 'baja',  status: 'pending' },
        { id: 4, name: 'D', arrival_time: 3, duration:  5, priority: 'media', status: 'pending' },
        { id: 5, name: 'E', arrival_time: 5, duration:  2, priority: 'alta',  status: 'pending' },
      ];
  
      const ordered = calculateSJFWithPriority(tasks);
      // A(0–8), luego E(5–7), luego B(8–12), luego D, luego C
      expect(ordered.map(t => t.id)).toEqual([1, 5, 2, 4, 3]);
    });
  });