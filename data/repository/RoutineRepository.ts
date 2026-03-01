import { dao } from "../db/dao";

export class RoutineRepository {
  get(day: string) { return dao.byDay(day); }
  add(r: any) { dao.insert(r); }
  delete(id: string) { dao.delete(id); }
}