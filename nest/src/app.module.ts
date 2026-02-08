import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MoviesModule } from './movies/movies.module';
import { DatabaseModule } from './infra/database/database.module';
import { CacheModule } from './infra/cache/cache.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { v4 as uuidv4 } from 'uuid';
import { ClsModule } from 'nestjs-cls';
import { RoomsModule } from './rooms/rooms.module';
import { SessionsModule } from './sessions/sessions.module';
import { OrdersModule } from './orders/orders.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [
    // Register the ClsModule,
    ClsModule.forRoot({
      global: true,
      middleware: {
        // automatically mount the
        // ClsMiddleware for all routes
        mount: true,
        // and use the setup method to
        // provide default store values.
        setup: (cls, req) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          cls.set('requestId', req.headers['x-request-id'] || uuidv4());
        },
      },
    }),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    CacheModule,
    MoviesModule,
    RoomsModule,
    SessionsModule,
    OrdersModule,
    TicketsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
