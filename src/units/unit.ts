import { Creep, RoomPosition } from 'game/prototypes';

export interface IUnit {
  creep: Creep
  update(): void
}