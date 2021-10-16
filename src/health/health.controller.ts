import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private database: TypeOrmHealthIndicator,
    private http: HttpHealthIndicator,
  ) {}
  @Get()
  @HealthCheck()
  readiness() {
    return this.health.check([
      async () => this.database.pingCheck('database', { timeout: 300 }),
      () =>
        this.http.pingCheck('Frontend-Container', 'https://www.google.com/'),
    ]);
  }
}
