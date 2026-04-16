export class VehicleAlreadyRegisteredError extends Error {
    constructor() {
      super('Vehicle is already registered in this fleet');
    }
  }
  
  export class VehicleAlreadyParkedAtLocationError extends Error {
    constructor() {
      super('Vehicle is already parked at this location');
    }
  }
  
  export class VehicleNotRegisteredError extends Error {
    constructor() {
      super('Vehicle is not registered in this fleet');
    }
  }