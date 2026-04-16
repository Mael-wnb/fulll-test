import { Pool } from 'pg';
import { FleetRepository } from '../App/Ports/FleetRepository';
import { Fleet } from '../Domain/Fleet';
import { Location } from '../Domain/Location';

export class PostgresFleetRepository implements FleetRepository {
  constructor(private readonly pool: Pool) {}

  async save(fleet: Fleet): Promise<void> {
    await this.pool.query(
      `
      INSERT INTO fleets (id, user_id)
      VALUES ($1, $2)
      ON CONFLICT (id) DO NOTHING
      `,
      [fleet.id, fleet.userId]
    );

    await this.pool.query(
      `
      DELETE FROM fleet_vehicles
      WHERE fleet_id = $1
      `,
      [fleet.id]
    );

    for (const vehicle of fleet.toPrimitives().vehicles) {
      await this.pool.query(
        `
        INSERT INTO fleet_vehicles (fleet_id, vehicle_plate_number, lat, lng, alt)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          fleet.id,
          vehicle.vehiclePlateNumber,
          vehicle.location?.lat ?? null,
          vehicle.location?.lng ?? null,
          vehicle.location?.alt ?? null,
        ]
      );
    }
  }

  async getById(fleetId: string): Promise<Fleet> {
    const fleetResult = await this.pool.query(
      `
      SELECT id, user_id
      FROM fleets
      WHERE id = $1
      `,
      [fleetId]
    );

    if (fleetResult.rowCount === 0) {
      throw new Error(`Fleet ${fleetId} not found`);
    }

    const fleetRow = fleetResult.rows[0];

    const vehiclesResult = await this.pool.query(
      `
      SELECT vehicle_plate_number, lat, lng, alt
      FROM fleet_vehicles
      WHERE fleet_id = $1
      `,
      [fleetId]
    );

    const fleet = new Fleet(fleetRow.id, fleetRow.user_id);

    for (const row of vehiclesResult.rows) {
      fleet.registerVehicle(row.vehicle_plate_number);

      if (row.lat !== null && row.lng !== null) {
        fleet.parkVehicle(
          row.vehicle_plate_number,
          new Location(row.lat, row.lng, row.alt ?? undefined)
        );
      }
    }

    return fleet;
  }
}