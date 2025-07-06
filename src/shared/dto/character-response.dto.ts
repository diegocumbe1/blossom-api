import { ApiProperty } from '@nestjs/swagger';

export class CharacterResponseDto {
  @ApiProperty({
    description: 'Name of the character',
    example: 'pikachu',
  })
  name: string;

  @ApiProperty({
    description: 'Weight of the character (optional)',
    example: 60,
    required: false,
  })
  weight?: number;

  @ApiProperty({
    description: 'List of powers/abilities of the character',
    example: ['static', 'lightning-rod'],
    type: [String],
  })
  powers: string[];

  @ApiProperty({
    description: 'List of possible evolutions of the character',
    example: ['pichu', 'pikachu', 'raichu'],
    type: [String],
  })
  evolutions: string[];
}
