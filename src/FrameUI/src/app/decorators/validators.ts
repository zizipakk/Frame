import * as def from "class-validator";
import { LocalizationService } from '../services/localizationService';

// CUSTOM
 
// TODO: async validator
@def.ValidatorConstraint({ name: "Required", async: true })
export class RequiredConstraint implements def.ValidatorConstraintInterface {
    validate(value: any, args: def.ValidationArguments) {
        return value ? true : false;
    }

    defaultMessage(args: def.ValidationArguments) {
        return LocalizationService.getValdationErrorMessage("Required");
    }
}

export function Required(validationOptions?: def.ValidationOptions) {
    return function (object: Object, propertyName: string) {
        def.registerDecorator({
            name: "Required",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: def.ValidationArguments) {
                    return value ? true : false;
                },
                defaultMessage(args: def.ValidationArguments) {
                    return LocalizationService.getValdationErrorMessage("Required");
                }
            } //RequiredConstraint
        })
   };
}

export function IsEqualThan(property: string, validationOptions?: def.ValidationOptions) {
    return function (object: Object, propertyName: string) {
        def.registerDecorator({
            name: "IsEqualThan",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: def.ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    return typeof value === "string" &&
                        typeof relatedValue === "string" &&
                        value === relatedValue;
                },
                defaultMessage(args: def.ValidationArguments) {
                    return LocalizationService.getValdationErrorMessage("IsEqualThan");
                }
            }
        });
    };
}

// LEGACY wrapper
const validator = new def.Validator();

@def.ValidatorConstraint({ name: "IsEmail", async: false })
export class IsEmail implements def.ValidatorConstraintInterface {

    validate(value: any, args: def.ValidationArguments) {
        return validator.isEmail(value, args);
    }

    defaultMessage(args: def.ValidationArguments) {
        return LocalizationService.getValdationErrorMessage("IsEmail");
    }

}

@def.ValidatorConstraint({ name: "Length", async: false })
export class Length implements def.ValidatorConstraintInterface {

    validate(value: any, args: def.ValidationArguments) {
        return validator.length(value, args.constraints[0]["min"], args.constraints[0]["max"]);
    }

    defaultMessage(args: def.ValidationArguments) {
        return LocalizationService.getValdationErrorMessage("Length");
    }

}
