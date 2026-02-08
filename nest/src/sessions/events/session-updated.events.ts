export class SessionUpdatedEvent {
  constructor(
    public readonly sessionId: string,
    public readonly movieId: string,
    public readonly roomId: string,
    public readonly dateStart: string,
    public readonly dateEnd: string,
    public readonly requestId?: string,
  ) {}
}
