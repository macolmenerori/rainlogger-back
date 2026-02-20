// SET UP MONGODB
// Switch to mongoDB admin database
db = db.getSiblingDB("admin");

// Create database admin with root privileges
db.createUser({
  user: "admindb",
  pwd: "admindb",
  roles: [{ role: "root", db: "admin" }],
});

// SET UP OPENSESAME
// Create opensesame database
db = db.getSiblingDB("opensesame");

// Create users collection
db.createCollection("users");

// Insert default user. user: admin@admin.com, password: administrator
db.users.insertOne({
  name: "Admin",
  email: "admin@admin.com",
  role: "admin",
  password: "$2b$12$GhCoggnxkqF1WtU/KIxmjuouaMexO4cZBbkP8mzVWCnq56mqqcQfG",
  passwordChangedAt: new Date(),
  permissions: [],
});

// SET UP RAINLOGGER
// Create rainlogger database
db = db.getSiblingDB("rainlogger");

// Create rainlogs collection
db.createCollection("rainlogs");

// Insert sample rain log entries for January 2026, location: Castraz
db.rainlogs.insertMany([
  {
    date: new Date("2026-01-01T00:00:00.000Z"),
    records: [],
    measurement: 0.5,
    realReading: true,
    location: "Castraz",
    timestamp: new Date("2026-01-01T08:00:00.000Z"),
    loggedBy: "admin@admin.com",
  },
  {
    date: new Date("2026-01-03T00:00:00.000Z"),
    records: [],
    measurement: 0.1,
    realReading: true,
    location: "Castraz",
    timestamp: new Date("2026-01-03T08:00:00.000Z"),
    loggedBy: "admin@admin.com",
  },
  {
    date: new Date("2026-01-08T00:00:00.000Z"),
    records: [],
    measurement: 1,
    realReading: true,
    location: "Castraz",
    timestamp: new Date("2026-01-08T08:00:00.000Z"),
    loggedBy: "admin@admin.com",
  },
  {
    date: new Date("2026-01-13T00:00:00.000Z"),
    records: [],
    measurement: 5,
    realReading: true,
    location: "Castraz",
    timestamp: new Date("2026-01-13T08:00:00.000Z"),
    loggedBy: "admin@admin.com",
  },
  {
    date: new Date("2026-01-17T00:00:00.000Z"),
    records: [],
    measurement: 5.2,
    realReading: false,
    location: "Castraz",
    timestamp: new Date("2026-01-17T08:00:00.000Z"),
    loggedBy: "admin@admin.com",
  },
  {
    date: new Date("2026-01-21T00:00:00.000Z"),
    records: [],
    measurement: 5.1,
    realReading: true,
    location: "Castraz",
    timestamp: new Date("2026-01-21T08:00:00.000Z"),
    loggedBy: "admin@admin.com",
  },
  {
    date: new Date("2026-01-24T00:00:00.000Z"),
    records: [],
    measurement: 17.5,
    realReading: true,
    location: "Castraz",
    timestamp: new Date("2026-01-24T08:00:00.000Z"),
    loggedBy: "admin@admin.com",
  },
  {
    date: new Date("2026-01-25T00:00:00.000Z"),
    records: [],
    measurement: 3.5,
    realReading: true,
    location: "Castraz",
    timestamp: new Date("2026-01-25T08:00:00.000Z"),
    loggedBy: "admin@admin.com",
  },
  {
    date: new Date("2026-01-27T00:00:00.000Z"),
    records: [],
    measurement: 25,
    realReading: true,
    location: "Castraz",
    timestamp: new Date("2026-01-27T08:00:00.000Z"),
    loggedBy: "admin@admin.com",
  },
  {
    date: new Date("2026-01-31T00:00:00.000Z"),
    records: [],
    measurement: 27,
    realReading: true,
    location: "Castraz",
    timestamp: new Date("2026-01-31T08:00:00.000Z"),
    loggedBy: "admin@admin.com",
  },
]);

// Create unique index on date + location (matches the Mongoose model)
db.rainlogs.createIndex({ date: 1, location: 1 }, { unique: true });
