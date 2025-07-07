import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
  Query,
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

  @Get('paginated')
  async getPaginatedLogs(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('franchise') franchise?: Franchise,
    @Query('status') status?: string,
    @Query('version') version?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
  ): Promise<{ data: RequestLogResponseDto[]; total: number }> {
    const filters = {
      franchise,
      status,
      version,
      fechaDesde: fechaDesde ? new Date(fechaDesde) : undefined,
      fechaHasta: fechaHasta ? new Date(fechaHasta) : undefined,
    };
    const { data, total } =
      await this.logQueryService.getLogsPaginatedAndFiltered(
        Number(page),
        Number(limit),
        filters,
      );
    return { data, total };
  }
}
