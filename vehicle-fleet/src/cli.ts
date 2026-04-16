import { Pool } from 'pg';
import { CreateFleet } from './App/CreateFleet';
import { RegisterVehicle } from './App/RegisterVehicle';
import { LocalizeVehicle } from './App/LocalizeVehicle';
import { PostgresFleetRepository } from './Infra/PostgresFleetRepository';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const fleetRepository = new PostgresFleetRepository(pool);

const createFleet = new CreateFleet(fleetRepository);
const registerVehicle = new RegisterVehicle(fleetRepository);
const localizeVehicle = new LocalizeVehicle(fleetRepository);

const [, , command, ...args] = process.argv;

function printUsage(): void {
  console.log('Usage:');
  console.log('  npm run cli -- create <userId>');
  console.log('  npm run cli -- register-vehicle <fleetId> <vehiclePlateNumber>');
  console.log('  npm run cli -- localize-vehicle <fleetId> <vehiclePlateNumber> lat lng [alt]');
}

async function main(): Promise<void> {
  if (!command) {
    printUsage();
    process.exit(1);
  }

  if (command === 'create') {
    const [userId] = args;

    if (!userId) {
      printUsage();
      process.exit(1);
    }

    const fleetId = `fleet-${Date.now()}`;
    await createFleet.execute({ fleetId, userId });
    console.log(fleetId);
    return;
  }

  if (command === 'register-vehicle') {
    const [fleetId, vehiclePlateNumber] = args;

    if (!fleetId || !vehiclePlateNumber) {
      printUsage();
      process.exit(1);
    }

    await registerVehicle.execute({ fleetId, vehiclePlateNumber });
    console.log('Vehicle registered');
    return;
  }

  if (command === 'localize-vehicle') {
    const [fleetId, vehiclePlateNumber, lat, lng, alt] = args;

    if (!fleetId || !vehiclePlateNumber || !lat || !lng) {
      printUsage();
      process.exit(1);
    }

    await localizeVehicle.execute({
      fleetId,
      vehiclePlateNumber,
      lat: Number(lat),
      lng: Number(lng),
      alt: alt ? Number(alt) : undefined,
    });

    console.log('Vehicle localized');
    return;
  }

  printUsage();
  process.exit(1);
}

main()
  .catch((error) => {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(message);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });