import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { LogQueryService } from '../../../application/services/log-query.service';
import { RequestLogResponseDto } from '../../../shared/dto/request-log-response.dto';
import { Franchise } from '../../../shared/enums';

@ApiTags('Logs')
@Controller('api/logs')
export class LogController {
  constructor(private readonly logQueryService: LogQueryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all request logs' })
  @ApiResponse({
    status: 200,
    description: 'All request logs',
    type: [RequestLogResponseDto],
  })
  async getAllLogs(): Promise<RequestLogResponseDto[]> {
    const logs = await this.logQueryService.getAllLogs();
    return logs.map((log) => ({ ...log }));
  }

  @Get(':franchise')
  @ApiOperation({ summary: 'Get request logs by franchise' })
  @ApiParam({ name: 'franchise', enum: Franchise, example: 'pokemon' })
  @ApiResponse({
    status: 200,
    description: 'Logs for the given franchise',
    type: [RequestLogResponseDto],
  })
  @ApiBadRequestResponse({ description: 'Invalid franchise' })
  async getLogsByFranchise(
    @Param('franchise') franchise: string,
  ): Promise<RequestLogResponseDto[]> {
    if (!Object.values(Franchise).includes(franchise as Franchise)) {
      throw new HttpException('Invalid franchise', HttpStatus.BAD_REQUEST);
    }
    const logs = await this.logQueryService.getLogsByFranchise(
      franchise as Franchise,
    );
    return logs.map((log) => ({ ...log }));
  }
}
