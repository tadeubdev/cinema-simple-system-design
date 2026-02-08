import { IsNotEmpty, IsString, Validate } from 'class-validator';
import {
  IsDateEndAfterDateStartConstraint,
  IsDateValidConstraint,
} from 'src/common/validations/date.validations';

export class CreateSessionQueryDto {
  @IsNotEmpty()
  @IsString()
  movie_id: string;

  @IsNotEmpty()
  @IsString()
  room_id: string;

  @IsNotEmpty()
  @IsString()
  @Validate(IsDateValidConstraint)
  date_start: string;

  @IsNotEmpty()
  @IsString()
  @Validate(IsDateEndAfterDateStartConstraint)
  @Validate(IsDateValidConstraint)
  date_end: string;
}
