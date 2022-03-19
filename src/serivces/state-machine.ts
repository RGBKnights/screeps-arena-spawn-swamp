
interface IState
{
	name: string
	onEnter?: () => void
	onUpdate?: () => void
	onExit?: () => void
}

export class StateMachine
{
  private changeStateQueue = new Array<string>()
	private states = new Map<string, IState>()
	private currentState?: IState
  private isChangingState = false
  private context?: object
  private log: boolean

  constructor(context?: object, log: boolean = true)
	{
    this.log = log
		this.context = context
	}

	addState(name: string, config?: { onEnter?: () => void, onUpdate?: () => void, onExit?: () => void })
	{
		  const context = this.context
	
      this.states.set(name, {
        name,
        onEnter: config?.onEnter?.bind(context),
        onUpdate: config?.onUpdate?.bind(context),
        onExit: config?.onExit?.bind(context)
      })

      return this
	}

  isCurrentState(name: string)
	{
		if (!this.currentState)
		  return false

		return this.currentState.name === name
	}

	setState(name: string)
	{
    if (!this.states.has(name))
    {
      if(this.log) {
        console.warn(`Tried to change to unknown state: ${name}`)
      }
      return
    }
  
    if (this.isCurrentState(name))
    {
      return
    }
  
    if (this.isChangingState)
    {
      this.changeStateQueue.push(name)
      return
    }
  
    this.isChangingState = true
  
    if(this.log) {
      console.log(`Change from ${this.currentState?.name ?? 'none'} to ${name}`)
    }
  
    if (this.currentState && this.currentState.onExit)
    {
      this.currentState.onExit()
    }
  
    this.currentState = this.states.get(name)!
  
    if (this.currentState.onEnter)
    {
      this.currentState.onEnter()
    }
  
    this.isChangingState = false
	}

	update()
	{
    if (this.changeStateQueue.length > 0)
    {
      this.setState(this.changeStateQueue.shift()!)
      return
    }
  
    if (this.currentState && this.currentState.onUpdate)
    {
      this.currentState.onUpdate()
    }
	}
}