type EventCallback = (event: unknown) => void

export class EventDispatcher {
  private static listenersMap: Map<string, EventCallback[]> = new Map()

  public static register(event: string, listener: EventCallback): void {
    if (!this.listenersMap.has(event)) {
      this.listenersMap.set(event, [])
    }

    this.listenersMap.get(event)!.push(listener)
  }

  public static unregister(event: string, listener: EventCallback): void {
    if (!this.listenersMap.has(event)) {
      return
    }

    const listeners = this.listenersMap.get(event)
    const index = listeners!.indexOf(listener)

    if (index > -1) {
      listeners!.splice(index, 1)
    }
  }

  public static unregisterAll(): void {
    this.listenersMap = new Map()
  }

  public static dispatch(event: string, data: any): void {
    if (!this.listenersMap.has(event)) {
      return
    }

    this.listenersMap.get(event)!.forEach((listener: EventCallback) => {
      listener(data)
    })
  }
}
