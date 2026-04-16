import { Fleet } from '../../Domain/Fleet';

export interface FleetRepository {
  save(fleet: Fleet): void | Promise<void>;
  getById(fleetId: string): Fleet | Promise<Fleet>;
}