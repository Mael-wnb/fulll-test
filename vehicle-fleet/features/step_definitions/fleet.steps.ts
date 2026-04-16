import { Before, Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { Location } from '../../src/Domain/Location';
import {
  VehicleAlreadyParkedAtLocationError,
  VehicleAlreadyRegisteredError,
} from '../../src/Domain/errors';
import { InMemoryFleetRepository } from '../../src/Infra/InMemoryFleetRepository';
import { CreateFleet } from '../../src/App/CreateFleet';
import { RegisterVehicle } from '../../src/App/RegisterVehicle';
import { LocalizeVehicle } from '../../src/App/LocalizeVehicle';

type TestContext = {
  myFleetId?: string;
  anotherFleetId?: string;
  vehiclePlateNumber?: string;
  location?: Location;
  error?: Error;
};

const context: TestContext = {};
let fleetRepository: InMemoryFleetRepository;
let createFleet: CreateFleet;
let registerVehicle: RegisterVehicle;
let localizeVehicle: LocalizeVehicle;

Before(function () {
  context.myFleetId = undefined;
  context.anotherFleetId = undefined;
  context.vehiclePlateNumber = undefined;
  context.location = undefined;
  context.error = undefined;

  fleetRepository = new InMemoryFleetRepository();
  createFleet = new CreateFleet(fleetRepository);
  registerVehicle = new RegisterVehicle(fleetRepository);
  localizeVehicle = new LocalizeVehicle(fleetRepository);
});

Given('my fleet', async function () {
  context.myFleetId = 'fleet-1';
  await createFleet.execute({ fleetId: context.myFleetId, userId: 'user-1' });
});

Given('the fleet of another user', async function () {
  context.anotherFleetId = 'fleet-2';
  await createFleet.execute({ fleetId: context.anotherFleetId, userId: 'user-2' });
});

Given('a vehicle', function () {
  context.vehiclePlateNumber = 'AA-123-BB';
});

Given('I have registered this vehicle into my fleet', async function () {
  await registerVehicle.execute({
    fleetId: context.myFleetId!,
    vehiclePlateNumber: context.vehiclePlateNumber!,
  });
});

Given("this vehicle has been registered into the other user's fleet", async function () {
  await registerVehicle.execute({
    fleetId: context.anotherFleetId!,
    vehiclePlateNumber: context.vehiclePlateNumber!,
  });
});

Given('a location', function () {
  context.location = new Location(48.8566, 2.3522);
});

Given('my vehicle has been parked into this location', async function () {
  await localizeVehicle.execute({
    fleetId: context.myFleetId!,
    vehiclePlateNumber: context.vehiclePlateNumber!,
    lat: context.location!.lat,
    lng: context.location!.lng,
    alt: context.location!.alt,
  });
});

When('I register this vehicle into my fleet', async function () {
  await registerVehicle.execute({
    fleetId: context.myFleetId!,
    vehiclePlateNumber: context.vehiclePlateNumber!,
  });
});

When('I try to register this vehicle into my fleet', async function () {
  try {
    await registerVehicle.execute({
      fleetId: context.myFleetId!,
      vehiclePlateNumber: context.vehiclePlateNumber!,
    });
  } catch (error) {
    context.error = error as Error;
  }
});

When('I park my vehicle at this location', async function () {
  await localizeVehicle.execute({
    fleetId: context.myFleetId!,
    vehiclePlateNumber: context.vehiclePlateNumber!,
    lat: context.location!.lat,
    lng: context.location!.lng,
    alt: context.location!.alt,
  });
});

When('I try to park my vehicle at this location', async function () {
  try {
    await localizeVehicle.execute({
      fleetId: context.myFleetId!,
      vehiclePlateNumber: context.vehiclePlateNumber!,
      lat: context.location!.lat,
      lng: context.location!.lng,
      alt: context.location!.alt,
    });
  } catch (error) {
    context.error = error as Error;
  }
});

Then('this vehicle should be part of my vehicle fleet', async function () {
  const fleet = await fleetRepository.getById(context.myFleetId!);
  assert.equal(fleet.hasVehicle(context.vehiclePlateNumber!), true);
});

Then(
  'I should be informed this this vehicle has already been registered into my fleet',
  function () {
    assert.ok(context.error instanceof VehicleAlreadyRegisteredError);
  }
);

Then('the known location of my vehicle should verify this location', async function () {
  const fleet = await fleetRepository.getById(context.myFleetId!);
  const location = fleet.getVehicleLocation(context.vehiclePlateNumber!);

  assert.ok(location);
  assert.equal(location?.equals(context.location!), true);
});

Then('I should be informed that my vehicle is already parked at this location', function () {
  assert.ok(context.error instanceof VehicleAlreadyParkedAtLocationError);
});