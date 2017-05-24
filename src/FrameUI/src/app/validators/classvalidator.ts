import { Validator } from "class-validator";
import { ValidationError } from "class-validator";

export class ClassValidator {

    validator: Validator;
    validationErrors: ValidationError[];

    constructor() {
        this.validator = new Validator();
        this.validationErrors = new Array<ValidationError>();
    }

    async validateForm(obj: any) {        
        try {
            this.validationErrors = await this.validator.validate(obj);
        } catch (e) { throw(e); }
    }

    async validate(obj: any, property: string): Promise<string> {
        try {
            if (!obj) throw("Unknow object for validation!");
            
            await this.validateForm(obj);        
            let error = this.validationErrors.find(f => f.property === property);
            if (error) {
                return JSON.stringify(error.constraints); //TODO: localization
            }
            
            return null;
        } catch (e) {
            return JSON.stringify(e);
        }
    }

    async callAction(obj: any, message: any, doit?: () => void): Promise<any> {
        await this.validateForm(obj);
        if (this.validationErrors.length === 0) {
            if (message instanceof Array) message = [];
            if (doit) doit();
        } else {            
            let classValidation = 
                this.validationErrors
                    .map(m => {
                        return { //TODO: localization
                            severity: 'error',
                            summary: m.property,
                            detail: JSON.stringify(m.constraints)
                        };
                    }) as typeof message;
            message = [...classValidation];
        }

        return message;
    }

}