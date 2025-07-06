import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ConfigQueryDto {
  @ApiProperty({
    description: 'Base URL for the external API',
    example: 'https://pokeapi.co/api/v2',
  })
  @IsString()
  baseUrl: string;

  @ApiProperty({
    description: 'API key for authentication (optional)',
    example: 'your-api-key',
    required: false,
  })
  @IsOptional()
  @IsString()
  apiKey?: string;
}
