import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharacterController } from './infrastructure/adapters/http/character.controller';
import { LogController } from './infrastructure/adapters/http/log.controller';
import { CharacterService } from './application/services/character.service';
import { RequestLogService } from './application/services/request-log.service';
import { LogQueryService } from './application/services/log-query.service';
import { ExternalApiAdapter } from './infrastructure/adapters/external-apis/external-api.adapter';
import PokemonApiAdapter from './infrastructure/adapters/external-apis/pokemon-api.adapter';
import DigimonApiAdapter from './infrastructure/adapters/external-apis/digimon-api.adapter';
import { RequestLogEntity } from './infrastructure/adapters/database/request-log.entity';
import { TypeOrmDatabaseAdapter } from './infrastructure/adapters/database/typeorm-database.adapter';
import { ConfigModule } from '@nestjs/config';
import { ConfigValidator } from './infrastructure/config/config-validator';
import { TypeOrmRequestLogRepository } from './infrastructure/adapters/database/typeorm-request-log.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'logs.sqlite',
      entities: [RequestLogEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([RequestLogEntity]),
  ],
  controllers: [AppController, CharacterController, LogController],
  providers: [
    AppService,
    CharacterService,
    RequestLogService,
    LogQueryService,
    ExternalApiAdapter,
    PokemonApiAdapter,
    DigimonApiAdapter,
    TypeOrmDatabaseAdapter,
    ConfigValidator,
    {
      provide: 'RequestLogRepository',
      useClass: TypeOrmRequestLogRepository,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
