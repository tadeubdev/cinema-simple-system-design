import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNumber()
  duration_min: number;

  @IsString()
  date_start: string;

  @IsString()
  date_end: string;
}
