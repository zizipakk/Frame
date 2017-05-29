import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";
import { ConfigService } from '../services/configService';
 
export function IsEqualThan(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "IsEqualThan",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: ConfigService.resolveMessage("IsEqualThan", validationOptions),
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    return  typeof value === "string" &&
                            typeof relatedValue === "string" &&
                            value === relatedValue; // you can return a Promise<boolean> here as well, if you want to make async validation 
                }
            }
        });
    };
}

export function Required(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        ConfigService.getMessage("Required", validationOptions)
            .subscribe(options =>
            registerDecorator({
                name: "Required",
                target: object.constructor,
                propertyName: propertyName,
                options: options,
                validator: {
                    validate(value: any, args: ValidationArguments) {
                        return value ? true : false;
                    }
                }
            })
        )
   };
}