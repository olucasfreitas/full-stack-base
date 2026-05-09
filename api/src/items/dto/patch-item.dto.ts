import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

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
