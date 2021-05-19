# module /game
## object arenaInfo
name: string
The name of the arena.

level: number
Currently equals to 1 for basic arena and 2 for advanced.

season: string
Currently equals to "alpha".

# module /game/prototypes/room-object
## class RoomObject
### Properties
exists: boolean
Returns true if this object is live in the game at the moment. Check this property to verify cached or newly created object instances.

id: string
The unique ID of this object that you can use in /game/utils::getObjectById.

x: number
The X coordinate in the room.

y: number
The Y coordinate in the room.

### Methods
findPathTo(pos, opts): array
See /game/utils::findPath.

findInRange(positions, range)
See /game/utils::findInRange.

findClosestByRange(positions)
See /game/utils::findClosestByRange.

findClosestByPath(positions, opts)
See /game/utils::findClosestByPath.

getRangeTo(pos)
See /game/utils::getRange.

# module /game/prototypes/creep
## class Creep Extends RoomObject.
### Properties
body: array
An array describing the creep’s body. Each element contains the following properties:
type: string (One of the body part types constants)
hits: number (The remaining amount of hit points of this body part)

hits: number
The current amount of hit points of the creep.

hitsMax: number
The maximum amount of hit points of the creep.

my: boolean
Whether it is your creep.

fatigue: number
Fatigue indicator of the creep. It can move only when fatigue equals to 0.

store: Store
An object that contains store contents of this creep.

### Methods
attack(target)
Attack another creep or structure in a short-ranged attack. Requires the ATTACK body part. The target has to be at an adjacent square to the creep.

heal(target)
Heal self or another creep. It will restore the target creep’s damaged body parts function and increase the hits counter. Requires the HEAL body part. The target has to be at an adjacent square to the creep.

move(direction: number)
Move the creep one square in the specified direction. direction must be one of the following constants:
- TOP
- TOP_RIGHT
- RIGHT
- BOTTOM_RIGHT
- BOTTOM
- BOTTOM_LEFT
- LEFT
- TOP_LEFT

moveTo(target, [opts])
Find the optimal path to the target within the same room and move to it. A shorthand to consequent calls of findPathTo() and move() methods. target can be any object containing x and y properties. opts is an optional object containing additional options. See /game/utils::findPath for details.

rangedAttack(target)
A ranged attack against another creep or structure. Requires the RANGED_ATTACK body part. The target has to be within 3 squares range of the creep.

rangedHeal(target)
Heal another creep at a distance. It will restore the target creep’s damaged body parts function and increase the hits counter. Requires the HEAL body part. The target has to be within 3 squares range of the creep.

rangedMassAttack()
A ranged attack against all hostile creeps or structures within 3 squares range. Requires the RANGED_ATTACK body part. The attack power depends on the range of each target. Friendly units are not affected.

# module /game/prototypes/structure
## class Structure Extends RoomObject.
### Properties
hits: number
The current amount of hit points of the tower.

hitsMax: number
The maximum amount of hit points of the tower.

### module /game/prototypes/owned-structure
## class OwnedStructure Extends Structure.

Properties
my: boolean
Returns true for your tower, false for a hostile tower, undefined for a neutral tower.

# module /game/prototypes/tower
## class StructureTower Extends OwnedStructure.
### Properties
store: Store
An object that contains store contents of this structure. Towers can contain only energy.

### Methods
attack(target)
Remotely attack any creep or structure. The target has to be within 50 squares range of the tower.

heal(target)
Remotely heal any creep. The target has to be within 50 squares range of the tower.

# module /game/prototypes/wall
## class StructureWall Extends RoomObject.
### Properties
hits: number
The current amount of hit points of the wall.

hitsMax: number
The maximum amount of hit points of the wall.

# module /game/prototypes/store
## class Store
An object that can contain resources in its cargo.

There are two types of stores in the game: general purpose stores and limited stores.
General purpose stores can contain any resource within its capacity (e.g. creeps, containers, storages, terminals).

Limited stores can contain only a few types of resources needed for that particular object (e.g. spawns, extensions, labs, nukers).
The Store prototype is the same for both types of stores, but they have different behavior depending on the resource argument in its methods.

You can get specific resources from the store by addressing them as object properties:
console.log(creep.store[RESOURCE_ENERGY]);

### Methods
getCapacity([resourceType])
Returns capacity of this store for the specified resource. For a general purpose store, it returns total capacity if resource is undefined.

getFreeCapacity([resource])
Returns free capacity for the store. For a limited store, it returns the capacity available for the specified resource if resource is defined and valid for this store.

getUsedCapacity([resource])
Returns the capacity used by the specified resource. For a general purpose store, it returns total used capacity if resource is undefined.

# module /game/path-finder
searchPath(origin, goal, options)
Find an optimal path between origin and goal. Note that searchPath without costMatrix specified (see below) use terrain data only.
A goal is either an object containing x and y properties or an object as defined below.
pos: object (an object containing x and y properties)
range: number (range to pos before the goal is considered reached. The default is 0)
If more than one goal is supplied (as an array of goals) then the cheapest path found out of all the goals will be returned.
opts is an object containing additional pathfinding flags:
- costMatrix: CostMatrix (Container for custom navigation cost data)
- plainCost: number (Cost for walking on plain positions. The default is 1)
- swampCost: number (Cost for walking on swamp positions. The default is 5)
- flee: boolean (Instead of searching for a path to the goals this will search for a path away from the goals. The cheapest path that is out of range of every goal will be returned. The default is false)
- maxOps: number (The maximum allowed pathfinding operations. The default value is 50000)
- maxCost: number (The maximum allowed cost of the path returned. The default is Infinity.)
- heuristicWeight: number (Weight from 1 to 9 to apply to the heuristic in the A* formula F = G + weight * H. The default value is 1.2)
Returns an object containing the following properties:
- path: array (The path found as an array of objects containing x and y properties)
- ops: number (Total number of operations performed before this path was calculated)
- cost: number (The total cost of the path as derived from plainCost, swampCost, and given CostMatrix instance)
- incomplete: boolean (If the pathfinder fails to find a complete path, this will be true)

## class CostMatrix
###  Methods
constructor()
Creates a new CostMatrix containing 0's for all positions. searchPath use terrain cost for positions with 0 cost

clone()
Copy this CostMatrix into a new CostMatrix with the same data.

set(x, y, cost)
Set the cost of a position in this CostMatrix.

get(x,y)
Get the cost of a position in this CostMatrix.

# module /game/utils
getTime()
Get count of game ticks passed since the start of the game

getObjectById(id)
Get an object with the specified unique ID.

getObjects()
Get all objects in the game.

getObjectsByPrototype(prototype)
Get all objects in the game with the specified prototype, for example, all creeps

getHeapStatistics()
Use this method to get heap statistics for your virtual machine

getDirection(dx, dy)
Get linear direction by differences of x and y

findPath(fromPos, toPos, opts)
Find an optimal path between fromPos and toPos. Unlike searchPath,
findPath avoid all obstacles by default (unless costMatrix is specified).
opts object containing additional options:
ignore: array (objects which should be treated as obstacles during the search)
Any options supported by searchPath method

getRange(a, b)
Get linear range between two objects. a and b may be any object containing x and y properties.

getTerrainAt(pos)
Get an integer representation of the terrain at the given position. pos should be an object containing x and y properties. Returns TERRAIN_WALL, TERRAIN_SWAMP, or 0.

findInRange(fromPos, positions, range)
Find all positions from the given positions array within the specified linear range.

findClosestByRange(fromPos, positions)
Find a position with the shortest linear distance from the given position, or null otherwise.

findClosestByPath(fromPos, positions, opts)
Find a position with the shortest path from the given position, or null otherwise.