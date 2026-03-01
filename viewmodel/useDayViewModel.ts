import { useEffect, useState } from "react";
import { RoutineRepository } from "../data/repository/RoutineRepository";

export function useDayViewModel(day: string) {
  const repo = new RoutineRepository();
  const [routines, setRoutines] = useState<any[]>([]);

  const refresh = async () => setRoutines(await repo.get(day));

  useEffect(() => { refresh(); }, [day]);

  return {
    routines,
    add: async (r: any) => { repo.add(r); refresh(); },
    update: async (r: any) => { repo.add(r); refresh(); },
    delete: async (id: string) => { repo.delete(id); refresh(); }
  };
}