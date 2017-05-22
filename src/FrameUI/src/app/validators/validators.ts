import { ValidatorInterface } from "validator.ts/ValidatorInterface";
import { ValidatorConstraint } from "validator.ts/decorator/Validation";

@ValidatorConstraint()
export class SameAs implements ValidatorInterface {

    validate(text0: string, text1: string): boolean {
        return text0 === text1;
    }

}