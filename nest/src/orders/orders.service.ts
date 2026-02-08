export default class OrdersService {
  async createOrder() {
    // TODO: Implement order creation logic
    // await dataSource.transaction(async manager => {
    //   // 1. Lock seats
    //   const seats = await manager
    //     .createQueryBuilder(SessionSeat, 'ss')
    //     .where('ss.sessionId = :sessionId', { sessionId })
    //     .andWhere('ss.seatId IN (:...seatIds)', { seatIds })
    //     .andWhere('ss.status = :status', { status: 'AVAILABLE' })
    //     .setLock('pessimistic_write')
    //     .getMany();
    //   if (seats.length !== seatIds.length) {
    //     throw new ConflictException('Some seats are no longer available');
    //   }
    //   // 2. Mark as RESERVED
    //   await manager.update(
    //     SessionSeat,
    //     seats.map(s => s.id),
    //     { status: 'RESERVED' },
    //   );
    //   // 3. Create order
    //   const order = manager.create(Order, {
    //     sessionId,
    //     customerEmail,
    //   });
    //   await manager.save(order);
    //   return order;
    // });
  }

  async confirmOrder(orderId: string) {
    // TODO: Implement order confirmation logic
    // Load order
    // Load RESERVED session seats
    // Mark them as SOLD
    // Create tickets
    // Mark order as CONFIRMED
    // for (const seat of sessionSeats) {
    //   await manager.save(
    //     manager.create(Ticket, {
    //       orderId: order.id,
    //       sessionSeatId: seat.id,
    //     }),
    //   );
    // }
    return Promise.resolve({
      message: `Order ${orderId} confirmed successfully`,
    });
  }
}
