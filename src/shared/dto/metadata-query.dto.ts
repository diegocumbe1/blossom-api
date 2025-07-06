import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class MetadataQueryDto {
  @ApiProperty({
    description: 'Name of the character (for Pokemon)',
    example: 'pikachu',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'ID of the character (for Digimon)',
    example: 42,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  id?: number;
}
