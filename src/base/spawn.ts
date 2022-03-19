import {
    ATTACK, CARRY, MOVE, WORK,
    RESOURCE_ENERGY,
} from 'game/constants';
import { StructureContainer, StructureSpawn } from 'game/prototypes';
import { getObjectsByPrototype } from 'game/utils';
import { Context } from 'serivces/context';
import { StateMachine } from "serivces/state-machine";
import { Attacker } from 'units/attacker';
import { Worker } from 'units/worker';

export class Spawn {
    private ctx: Context
    private sm: StateMachine
    private spawn: StructureSpawn

    constructor(ctx: Context, self: StructureSpawn) {
        this.ctx = ctx
        this.spawn = self

        this.sm = new StateMachine(this, false)
            .addState('idle', {
                onUpdate: this.onIdle
            })
            .addState('attacker', {
                onUpdate: this.onSpawnAttacker
            })
            .addState('worker', {
                onUpdate: this.onSpawnWorker
            })

        this.sm.setState('idle')
    }

    public update() {
        this.sm.update()
    }

    private onIdle() {
        var result = this.ctx.myUnits.some(_ => _ instanceof Worker)
        if (result == false) {
            this.sm.setState('worker')
        } else {
            this.sm.setState('attacker')
        }
    }

    private onSpawnAttacker() {
        let result = this.spawn.spawnCreep([MOVE, ATTACK]);
        if (result.object) {
            let unit = new Attacker(this.ctx, result.object)

            var target = this.ctx.theirSpawns.at(0)
            unit.attack(target)

            this.ctx.myUnits.push(unit)
        }

        this.sm.setState('idle')
    }

    private onSpawnWorker() {
        let result = this.spawn.spawnCreep([MOVE, CARRY, WORK]);
        if (result.object) {
            let unit = new Worker(this.ctx, result.object)

            var containers = getObjectsByPrototype(StructureContainer)
            containers = this.spawn.findInRange(containers, 10)
            unit.gather(containers, [this.spawn], RESOURCE_ENERGY)

            this.ctx.myUnits.push(unit)
        }

        this.sm.setState('idle')
    }
}