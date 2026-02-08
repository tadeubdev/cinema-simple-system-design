export class MovieUpdatedEvent {
  constructor(
    public readonly movieId: string,
    public readonly requestId?: string,
  ) {}
}
