import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, MongooseHealthIndicator, HealthCheck } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private mongoose: MongooseHealthIndicator
    ){}

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            // Mongoose check to ensure the MongoDB connection is healthy
            () => this.mongoose.pingCheck('mongoose'),
        ])
    }
}
