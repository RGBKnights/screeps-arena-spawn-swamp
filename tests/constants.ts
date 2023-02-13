export const ATTACK = "attack";
export const ATTACK_POWER = 30;

export const BODYPART_COST = {
  move: 50,
  work: 100,
  attack: 80,
  carry: 50,
  heal: 250,
  ranged_attack: 150,
  tough: 10,
  claim: 0
};
export const BODYPART_HITS = 100;
export const BOTTOM = 5;
export const BOTTOM_LEFT = 6;
export const BOTTOM_RIGHT = 4;
export const BUILD_POWER = 5;
export const CARRY = "carry";
export const CARRY_CAPACITY = 50;
export const CONSTRUCTION_COST = {
  StructureTower: 5000,
  StructureExtension: 200,
  StructureRoad: 10,
  StructureContainer: 100,
  StructureWall: 100,
  StructureRampart: 200,
  StructureSpawn: 3000
};
export const CONSTRUCTION_COST_ROAD_SWAMP_RATIO = 5;
export const CONSTRUCTION_COST_ROAD_WALL_RATIO = 150;
export const CONTAINER_CAPACITY = 2000;
export const CONTAINER_HITS = 300;
export const CREEP_SPAWN_TIME = 3;
export const DISMANTLE_COST = 0.005;
export const DISMANTLE_POWER = 50;
export const ERR_BUSY = -4;
export const ERR_FULL = -8;
export const ERR_INVALID_ARGS = -10;
export const ERR_INVALID_TARGET = -7;
export const ERR_NAME_EXISTS = -3;
export const ERR_NOT_ENOUGH_ENERGY = -6;
export const ERR_NOT_ENOUGH_EXTENSIONS = -6;
export const ERR_NOT_ENOUGH_RESOURCES = -6;
export const ERR_NOT_FOUND = -5;
export const ERR_NOT_IN_RANGE = -9;
export const ERR_NOT_OWNER = -1;
export const ERR_NO_BODYPART = -12;
export const ERR_NO_PATH = -2;
export const ERR_TIRED = -11;
export const EXTENSION_ENERGY_CAPACITY = 100;
export const EXTENSION_HITS = 100;
export const HARVEST_POWER = 2;
export const HEAL = "heal";
export const HEAL_POWER = 12;
export const LEFT = 7;
export const MAX_CONSTRUCTION_SITES = 10;
export const MAX_CREEP_SIZE = 50;
export const MOVE = "move";
export const OBSTACLE_OBJECT_TYPES = ["creep", "tower", "constructedWall", "spawn", "extension", "link"];
export const OK = 0;
export const RAMPART_HITS = 10000;
export const RAMPART_HITS_MAX = 10000;
export const RANGED_ATTACK = "ranged_attack";
export const RANGED_ATTACK_DISTANCE_RATE = { 0: 1, 1: 1, 2: 0.4, 3: 0.1 };
export const RANGED_ATTACK_POWER = 10;
export const RANGED_HEAL_POWER = 4;
export const REPAIR_COST = 0.01;
export const REPAIR_POWER = 100;
export const RESOURCES_ALL = ["energy"];
export const RESOURCE_DECAY = 1000;
export const RESOURCE_ENERGY = "energy";
export const RIGHT = 3;
export const ROAD_HITS = 500;
export const ROAD_WEAROUT = 1;
export const SOURCE_ENERGY_REGEN = 10;
export const SPAWN_ENERGY_CAPACITY = 1000;
export const SPAWN_HITS = 3000;
export const SPAWN_TIME = 3;
export const STRUCTURE_PROTOTYPES = {
  StructureTower: "tower",
  StructureSpawn: "spawn",
  StructureRoad: "road",
  StructureRampart: "rampart",
  StructureExtension: "extension",
  StructureWall: "constructedWall",
  StructureContainer: "container"
};
export const TERRAIN_SWAMP = 2;
export const TERRAIN_WALL = 1;
export const TOP = 1;
export const TOP_LEFT = 8;
export const TOP_RIGHT = 2;
export const TOUGH = "tough";
export const TOWER_CAPACITY = 50;
export const TOWER_COOLDOWN = 10;
export const TOWER_ENERGY_COST = 10;
export const TOWER_FALLOFF = 0.75;
export const TOWER_FALLOFF_RANGE = 20;
export const TOWER_HITS = 3000;
export const TOWER_OPTIMAL_RANGE = 5;
export const TOWER_POWER_ATTACK = 600;
export const TOWER_POWER_HEAL = 400;
export const TOWER_POWER_REPAIR = 800;
export const TOWER_RANGE = 50;
export const WALL_HITS = 10000;
export const WALL_HITS_MAX = 10000;
export const WORK = "work";
