import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";
import { LocalizationService } from '../services/localizationService';
 
export function IsEqualThan(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "IsEqualThan",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    return  typeof value === "string" &&
                            typeof relatedValue === "string" &&
                            value === relatedValue;
                },
                defaultMessage(args: ValidationArguments) {
                    return LocalizationService.getValdationErrorMessage("IsEqualThan");
                }
            }
        });
    };
}

// TODO: async validator
//@ValidatorConstraint({ name: "Required", async: true })
//export class RequiredConstraint implements ValidatorConstraintInterface {
//    validate(value: any, args: ValidationArguments) {
//        return value ? true : false;
//    }

//    defaultMessage(args: ValidationArguments) {
//        return LocalizationService.getValdationErrorMessage("Required");
//    }
//}

export function Required(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "Required",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            //constraints: [],
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return value ? true : false;
                },
                defaultMessage(args: ValidationArguments) {
                    return LocalizationService.getValdationErrorMessage("Required");
                }
            } //RequiredConstraint
        })
   };
}