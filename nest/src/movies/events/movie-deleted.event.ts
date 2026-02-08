export class MovieDeletedEvent {
  constructor(
    public readonly movieId: string,
    public readonly requestId?: string,
  ) {}
}
