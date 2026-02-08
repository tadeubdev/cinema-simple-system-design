export class MovieCreatedEvent {
  constructor(
    public readonly movieId: string,
    public readonly requestId?: string,
  ) {}
}
