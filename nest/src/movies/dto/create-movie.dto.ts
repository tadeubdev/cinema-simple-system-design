import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNumber()
  durationMin: number;

  @IsString()
  dateStart: string;

  @IsString()
  dateEnd: string;
}
