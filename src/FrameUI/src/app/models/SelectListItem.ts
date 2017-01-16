import { ISelectListGroup, SelectListGroup } from './SelectListGroup';

export interface ISelectListItem {
    disabled: boolean;
    group: ISelectListGroup;
    selected: boolean;
    text: string;
    value: string;

    }

export class SelectListItem {
    public disabled: boolean;
    public group: SelectListGroup;
    public selected: boolean;
    public text: string;
    public value: string;

    constructor(model: ISelectListItem) {
        this.disabled = model.disabled;
        this.group = model.group;
        this.selected = model.selected;
        this.text = model.text;
        this.value = model.value;
    }

}    