import { FleetRepository } from './Ports/FleetRepository';

export class RegisterVehicle {
  constructor(private readonly fleetRepository: FleetRepository) {}

  async execute(input: {
    fleetId: string;
    vehiclePlateNumber: string;
  }): Promise<void> {
    const fleet = await this.fleetRepository.getById(input.fleetId);
    fleet.registerVehicle(input.vehiclePlateNumber);
    await this.fleetRepository.save(fleet);
  }
}