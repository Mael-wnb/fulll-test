import { Location } from '../Domain/Location';
import { FleetRepository } from './Ports/FleetRepository';

export class LocalizeVehicle {
  constructor(private readonly fleetRepository: FleetRepository) {}

  async execute(input: {
    fleetId: string;
    vehiclePlateNumber: string;
    lat: number;
    lng: number;
    alt?: number;
  }): Promise<void> {
    const fleet = await this.fleetRepository.getById(input.fleetId);
    const location = new Location(input.lat, input.lng, input.alt);

    fleet.parkVehicle(input.vehiclePlateNumber, location);
    await this.fleetRepository.save(fleet);
  }
}