

export interface ISelectListGroup {
    disabled: boolean;
    name: string;

    }

export class SelectListGroup {
    public disabled: boolean;
    public name: string;

    constructor(model: ISelectListGroup) {
        this.disabled = model.disabled;
        this.name = model.name;
    }

}    