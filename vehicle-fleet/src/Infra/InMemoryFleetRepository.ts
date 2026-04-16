import { FleetRepository } from '../App/Ports/FleetRepository';
import { Fleet } from '../Domain/Fleet';

export class InMemoryFleetRepository implements FleetRepository {
  private readonly fleets = new Map<string, Fleet>();

  save(fleet: Fleet): void {
    this.fleets.set(fleet.id, fleet);
  }

  getById(fleetId: string): Fleet {
    const fleet = this.fleets.get(fleetId);

    if (!fleet) {
      throw new Error(`Fleet ${fleetId} not found`);
    }

    return fleet;
  }
}