import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsAfterConstraint implements ValidatorConstraintInterface {
  validate(endDate: any, args: ValidationArguments) {
    const [startDatePropertyName] = args.constraints;
    const startDate = args.object[startDatePropertyName];

    if (!startDate || !endDate) {
      return false;
    }
    return new Date(startDate) < new Date(endDate);
  }
  defaultMessage(args: ValidationArguments) {
    const [startDatePropertyName] = args.constraints;
    return `$property must be after ${startDatePropertyName}`;
  }
}

export const IsAfter = (
  startDatePropertyName: string,
  validationOptions?: ValidationOptions,
) => {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [startDatePropertyName],
      validator: IsAfterConstraint,
    });
  };
};
