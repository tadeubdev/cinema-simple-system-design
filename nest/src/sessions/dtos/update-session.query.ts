import { PartialType } from '@nestjs/mapped-types/dist/partial-type.helper';
import { CreateSessionQueryDto } from './create-session.query';

export class UpdateSessionQueryDto extends PartialType(CreateSessionQueryDto) {}
