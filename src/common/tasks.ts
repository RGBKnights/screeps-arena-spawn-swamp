import { EventDispatcher, SignalDispatcher } from "common/dispatchers"
import { Unit } from "common/units"

export type StatusPending = "PENDING"
export const StatusPending: StatusPending = "PENDING"
export type StatusInprocess = "INPROCESS"
export const StatusInprocess: StatusInprocess = "INPROCESS"
export type StatusComplete = "COMPLETE"
export const StatusComplete: StatusComplete = "COMPLETE"

export type Status = StatusPending | StatusInprocess | StatusComplete

// How / Whom to create new Request...?
export abstract class TaskRequest {
  public task: TaskAction
  public status: Status

  constructor(task: TaskAction) {
    this.status = StatusPending

    this.task = task
    this.task.onStarted.subscribe(() => { this.status = StatusInprocess })
    this.task.onCompleted.subscribe((evt) => { this.status = StatusComplete })
  }
}

export class TaskActionCompletedEvent {
  public readonly sucessfull: boolean

  constructor(sucessfull: boolean) {
    this.sucessfull = sucessfull
  }
}

export abstract class TaskAction {
  protected prereqs: TaskPrerequisite[]
  protected generator: Generator | undefined

  public status: Status
  public onStarted: SignalDispatcher
  public onCompleted: EventDispatcher<TaskActionCompletedEvent>

  constructor(prereqs: TaskPrerequisite[]) {
    this.prereqs = prereqs
    this.status = StatusPending
    this.onStarted = new SignalDispatcher()
    this.onCompleted = new EventDispatcher<TaskActionCompletedEvent>()
  }

  protected * steps(unit: Unit): Generator<void, boolean, unknown> {
    console.log("TaskAction", `step for creep: ${unit.creep.id}`)
    return true
  }

  public action(unit: Unit): void {
    switch (this.status) {
      case StatusPending:
        this.status = StatusInprocess
        this.onStarted.dispatch()
        this.generator = this.steps(unit)
      case StatusInprocess:
        let result = this.generator?.next()
        if (result?.done == true) {
          this.status = StatusComplete
          var evt = new TaskActionCompletedEvent(result.value)
          this.onCompleted.dispatch(evt)
        }
        break
      case StatusComplete:
      default:
        return
    }
  }

  public cost(unit: Unit): number {
    return Number.MAX_VALUE
  }
}

export abstract class TaskPrerequisite {
  public meets(unit: Unit): boolean {
    return false
  }
  public toMeet(unit: Unit): TaskAction[] {
    return []
  }
}

// class BuildRequest extends TaskRequest {
//   constructor(site: ConstructionSite) {
//     super(new BuildAction(site))
//   }
// }
