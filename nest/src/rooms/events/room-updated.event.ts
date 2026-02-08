export class RoomUpdatedEvent {
  constructor(
    public readonly roomId: string,
    public readonly capacity: number,
    public readonly requestId?: string,
  ) {}
}
