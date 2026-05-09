import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { trimString } from './transforms';

export class PatchItemDto {
  @Transform(trimString)
  @IsOptional()
  @IsString({ message: 'Title must be text.' })
  @IsNotEmpty({ message: 'Title is required.' })
  title?: string;

  @Transform(trimString)
  @IsOptional()
  @IsString({ message: 'Description must be text.' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'Completed must be true or false.' })
  completed?: boolean;
}
