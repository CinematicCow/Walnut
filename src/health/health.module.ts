import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { DatabaseModule } from 'src/database/database.module';
import { HealthController } from './health.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DatabaseModule, TerminusModule, HttpModule],
  controllers: [HealthController],
})
export class HealthModule {}
