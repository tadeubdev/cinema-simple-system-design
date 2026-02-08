import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { CreateSessionQueryDto } from 'src/sessions/dtos/create-session.query';

@ValidatorConstraint({ name: 'IsDateValid', async: false })
export class IsDateValidConstraint implements ValidatorConstraintInterface {
  validate(date: string) {
    return !isNaN(Date.parse(date));
  }

  defaultMessage() {
    return 'date must be a valid date string: YYYY-MM-DDTHH:mm:ssZ';
  }
}

@ValidatorConstraint({ name: 'IsDateEndAfterDateStart', async: false })
export class IsDateEndAfterDateStartConstraint implements ValidatorConstraintInterface {
  validate(dateEnd: string, args: ValidationArguments) {
    const obj = args.object as CreateSessionQueryDto;
    const dateStart = new Date(obj.date_start);
    const dateEndDate = new Date(dateEnd);
    return dateEndDate > dateStart;
  }

  defaultMessage() {
    return 'date_end must be after date_start';
  }
}
