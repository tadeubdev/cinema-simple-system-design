import { Controller, Get, Param, Post } from '@nestjs/common';
import OrdersService from './orders.service';

@Controller('orders')
export default class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('/')
  getAllOrders() {
    return [];
  }

  @Post('/')
  createOrder() {
    // TODO: Implement order creation logic
    // {
    //   "sessionId": "uuid",
    //   "seatIds": ["001", "002"],
    //   "customerEmail": "user@email.com"
    // }
  }

  @Post('/:id/confirm')
  confirmOrder(@Param('id') id: string) {
    return this.ordersService.confirmOrder(id);
  }
}
