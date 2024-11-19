import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, MongooseHealthIndicator, HealthCheck } from '@nestjs/terminus';
import { ApiOperation } from '@nestjs/swagger';
import { version } from '../../package.json';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private mongoose: MongooseHealthIndicator
    ){}

    @Get()
    @ApiOperation({ summary: 'Checks the operational status of the API', description: 'Checks the operational status of the API. Identifier will be Mongo Id or email' })
    @HealthCheck()
    async check() {
        const healthCheckResult = await this.health.check([
            // Mongoose check to ensure the MongoDB connection is healthy
            () => this.mongoose.pingCheck('mongoose'),
        ])
        return {
            ...healthCheckResult,
            msg: "Recreational sports league mgmt core service is healthy and ready to handle your requests.",
            app_version: version
        };
    }
}
