export abstract class Broker<T> {
  abstract connect(url: string): Promise<void>
  abstract send(queueOptions: T, message: string): void
  abstract consume(
    queueOptions: T,
    callback: (msg: unknown) => void,
  ): Promise<void>
}
