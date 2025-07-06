import { ApiProperty } from '@nestjs/swagger';
import { Franchise, RequestStatus } from '../enums';

export class RequestLogResponseDto {
  @ApiProperty({ example: 'pokemon', enum: Franchise })
  franchise: Franchise;

  @ApiProperty({ example: 'v1' })
  version: string;

  @ApiProperty({
    example: { name: 'pikachu' },
    description: 'Metadata as object',
  })
  metadata: object;

  @ApiProperty({ example: '2024-07-06T12:00:00.000Z' })
  timestamp: Date;

  @ApiProperty({ example: 'success', enum: RequestStatus })
  status: RequestStatus;

  @ApiProperty({ example: '', required: false })
  errorMessage?: string;
}
