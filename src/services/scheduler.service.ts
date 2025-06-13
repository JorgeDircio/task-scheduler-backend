
import { Task } from '../models/task.model';

function priorityWeight(p: string): number {
  switch (p) {
    case 'alta':  return 3;
    case 'media': return 2;
    case 'baja':  return 1;
    default:      return 0;
  }
}

/**
 * Shortest Job First no-preemptive, desempate por prioridad.
 */
export function calculateSJFWithPriority(tasks: Task[]): Task[] {
  const timeline: Task[] = [];
  let clock = 0;

  const pending = [...tasks].sort((a,b) => a.arrival_time - b.arrival_time);
  const queue: Task[] = [];

  while (pending.length || queue.length) {
    while (pending.length && pending[0].arrival_time <= clock) {
      queue.push(pending.shift()!);
    }

    if (!queue.length) {
      clock = pending[0].arrival_time;
      continue;
    }

    queue.sort((a, b) => {
      const diffDur = a.duration - b.duration;
      if (diffDur !== 0) return diffDur;
      return priorityWeight(b.priority) - priorityWeight(a.priority);
    });

    const next = queue.shift()!;
    timeline.push(next);
    clock += next.duration;
  }

  return timeline;
}
