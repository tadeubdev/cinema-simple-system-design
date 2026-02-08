export class RoomDeletedEvent {
  constructor(
    public readonly roomId: string,
    public readonly requestId?: string,
  ) {}
}
