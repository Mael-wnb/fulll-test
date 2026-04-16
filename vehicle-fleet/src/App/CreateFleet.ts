import { Fleet } from '../Domain/Fleet';
import { FleetRepository } from './Ports/FleetRepository';

export class CreateFleet {
  constructor(private readonly fleetRepository: FleetRepository) {}

  async execute(input: { fleetId: string; userId: string }): Promise<void> {
    const fleet = new Fleet(input.fleetId, input.userId);
    await this.fleetRepository.save(fleet);
  }
}