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
    private workers: number
    private attackers: number

    // 7500 RESOURCE_ENERGY

    constructor(ctx: Context, self: StructureSpawn) {
        this.ctx = ctx
        this.spawn = self
        this.workers = 1
        this.attackers = Infinity

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
        var workers = this.ctx.myUnits.filter(_ => _.creep.exists).filter(_ => _ instanceof Worker).length
        if (workers < this.workers) {
            this.sm.setState('worker')
            return
        }

        var attackers = this.ctx.myUnits.filter(_ => _.creep.exists).filter(_ => _ instanceof Attacker).length
        if (attackers < this.attackers) {
            this.sm.setState('attacker')
            return
        }
    }

    private onSpawnAttacker() {
        let result = this.spawn.spawnCreep([MOVE, ATTACK]);
        if (result.object) {
            let unit = new Attacker(this.ctx, result.object)
            var target = this.ctx.theirSpawns[0]
            unit.attack(target)
            this.ctx.myUnits.push(unit)
        }

        this.sm.setState('idle')
    }

    private onSpawnWorker() {
        let result = this.spawn.spawnCreep([MOVE, MOVE, CARRY, WORK]);
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