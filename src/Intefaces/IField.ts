import FieldTypes from "../Enums/FiedTypes";
import Operators from "../Enums/Operators";

export default interface IField {
    id: string;
    label: string;
    type: FieldTypes;
    description: string;
    value: any;
    filter?: Operators;
    displayValue?: any;
    order: number;
    references?: string,
    required: boolean;
    visible: boolean;
    readonly?: boolean;
    options?: {value: string, label: string}[];
    
    onchange: (token: string, fields: IField[], value: any, set_field: (vl: IField) => void) => Promise<any>
}