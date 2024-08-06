import React, { useEffect, useState } from 'react';

function CustomeSelectBox({givenValue, onChange, title, readonly, disabled, id, onFocus, onBlur, options}: {
    givenValue: any,
    options: {value: any, label: string}[]
    onChange?: (event: any) => Promise<void>,
    title?: string,
    readonly?: boolean,
    disabled?: boolean,
    id?: number|string,
    onFocus?: (event?: any) => void,
    onBlur?: (event?: any) => void,
}) {

    const [controlledValue, setControlledValue] = useState<any>();
    const [selectedOption, setSelectedOption] = useState<{value: any, label: string}>();
    const [searchWord, setSearchWord] = useState<string>("");
    const [controlledOptions, setControlledOptions] = useState<{value: any, label: string}[]>([]);

    useEffect(() => {

        if(givenValue != undefined) {

            // console.log("change happen ", givenValue[id ?? 0]);
            console.log("change happen ", givenValue);
            setControlledValue(givenValue);
            // let selected = controlledOptions.find(opt => (opt.value == givenValue));
            // if(selected) {
            //     setSelectedOption(selected);
            // }
        }

    }, [givenValue]);
    
    
    useEffect(() => {
        
        setControlledOptions(options);
        
    }, [options]);
    

    const selectOption = (selected_option: {value: any, label: string}) => {

        // let selected = options.find(opt => (opt.value == value))
        // if(selected){
        // }
        // setSelectedOption(selected_option);
        console.log("working inside ", selected_option);
        setSearchWord("");
        setControlledOptions(options);
        if(onChange){
            onChange(selected_option);
        }

    }

    return (
        <div className="dropdown w-100 p-0 m-0">
            <button 
                className={`btn ${readonly || disabled ? "bg-secondary-subtle" : "bg-white"} form-control border text-start`}
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                disabled={disabled}
            >
                {selectedOption ? selectedOption.label : "None"}
            </button>
            <ul className="dropdown-menu w-100">
                <li className="p-2 bg-light">
                    <input 
                        className="form-control"
                        value={searchWord}
                        onChange={(event: any) => {
                            setSearchWord(event.target.value);
                            setControlledOptions(options.filter(opt => (opt.label.toLowerCase().includes(event.target.value.toLowerCase()))));
                        }}
                        placeholder='Search Here'
                    />
                </li>
                {controlledOptions.map(opt => (
                    <li 
                        className={`dropdown-item ${selectedOption?.value == opt.value ? "active" : ""}`}
                        style={{cursor: "pointer"}}
                        onClick={() => {
                            selectOption(opt);
                        }}
                    >{opt.label}</li>
                ))}
            </ul>
        </div>
    );

}

export default CustomeSelectBox;