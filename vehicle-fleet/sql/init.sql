CREATE TABLE IF NOT EXISTS fleets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS fleet_vehicles (
  fleet_id TEXT NOT NULL,
  vehicle_plate_number TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  alt DOUBLE PRECISION,
  PRIMARY KEY (fleet_id, vehicle_plate_number),
  FOREIGN KEY (fleet_id) REFERENCES fleets(id) ON DELETE CASCADE
);