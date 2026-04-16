import { Location } from './Location';
import {
  VehicleAlreadyParkedAtLocationError,
  VehicleAlreadyRegisteredError,
  VehicleNotRegisteredError,
} from './errors';

type FleetVehicleState = {
  vehiclePlateNumber: string;
  location?: Location;
};

export class Fleet {
  private readonly vehicles = new Set<string>();
  private readonly vehicleLocations = new Map<string, Location>();

  constructor(
    public readonly id: string,
    public readonly userId: string
  ) {}

  registerVehicle(vehiclePlateNumber: string): void {
    if (this.vehicles.has(vehiclePlateNumber)) {
      throw new VehicleAlreadyRegisteredError();
    }

    this.vehicles.add(vehiclePlateNumber);
  }

  hasVehicle(vehiclePlateNumber: string): boolean {
    return this.vehicles.has(vehiclePlateNumber);
  }

  parkVehicle(vehiclePlateNumber: string, location: Location): void {
    if (!this.vehicles.has(vehiclePlateNumber)) {
      throw new VehicleNotRegisteredError();
    }

    const currentLocation = this.vehicleLocations.get(vehiclePlateNumber);

    if (currentLocation && currentLocation.equals(location)) {
      throw new VehicleAlreadyParkedAtLocationError();
    }

    this.vehicleLocations.set(vehiclePlateNumber, location);
  }

  getVehicleLocation(vehiclePlateNumber: string): Location | undefined {
    return this.vehicleLocations.get(vehiclePlateNumber);
  }

  toPrimitives(): { vehicles: FleetVehicleState[] } {
    return {
      vehicles: Array.from(this.vehicles).map((vehiclePlateNumber) => ({
        vehiclePlateNumber,
        location: this.vehicleLocations.get(vehiclePlateNumber),
      })),
    };
  }
}