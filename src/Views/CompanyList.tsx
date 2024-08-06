import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import IField from "../Intefaces/IField";
import FieldTypes from "../Enums/FiedTypes";
import { props } from "../APIs/api";

function CompanyList({ selector, cols, rows, emitOnSelect }: { selector: (id: number) => void, cols: IField[], rows: any[], emitOnSelect: (selected_records: any[]) => void }) {

    const [columns, setColumns] = useState<IField[]>([]);
    const [records, setRecords] = useState<any[]>([]);
    const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);

    useEffect(() => {
        setColumns(cols);
        setRecords(rows);
    }, [cols, rows]);

    useEffect(() => {
        
        let temp_selected: any[] = [];
        if(selectAll) {
            temp_selected = records.map(rc => rc.id);
        }
        
        setSelectedRecords(srec => temp_selected);
        emitOnSelect(temp_selected);

    }, [selectAll]);

    const selectRecord = (rec_id: any) => {

        let temp_selected: any[] = [];
        if(!selectedRecords.includes(rec_id)) {
            temp_selected = [...selectedRecords, rec_id];
            console.log("selected ", rec_id);
        }else {
            temp_selected = selectedRecords.filter(r => (r != rec_id));
            console.log("un selected ", rec_id);
        }
        
        emitOnSelect(temp_selected);
        setSelectedRecords(sr => temp_selected);

    }

    return (
        <div className="d-flex" style={{ flexWrap: "wrap" }}>
            <div className="col"></div>
            <div className={isMobile ? "w-100 bg-white" : "col-xlg-10 col-lg-12 bg-white"}>
                <div className="card-body" style={{ width: "100%", overflowX: "auto" }}>
                    <table className="table table-white table-striped table-hover">
                        <thead>
                            <tr>
                                <td scope="col">
                                    <input className="form-check-input" type="checkbox" checked={selectAll} title="Select all records" onChange={() => {setSelectAll(!selectAll)}} />
                                </td>
                                {columns.map(col => (col.visible ? (<th key={col.id} id={col.id}>{col.label}</th>) : <></>))}
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(rec => (
                                <tr key={`row_${rec.id}`}>{
                                    columns.map(col => {
                                        if(col.visible){
                                            if((col.id.toLowerCase()) == "id") {
                                                return (
                                                    <>
                                                        <td scope="row" key={`select_col_${rec.id}`} >
                                                            <input className="form-check-input" type="checkbox" checked={selectedRecords.includes(rec.id)} title="select this record" onChange={(event: any) => {selectRecord(rec.id)}} />
                                                        </td>
                                                        <td key={`${col.id}_col_${rec.id}`}>
                                                            <button className="btn btn-link btn-sm" onClick={() => { selector(rec.id) }}>{rec[col.id.toLowerCase()]}</button>
                                                        </td>
                                                    </>
                                                );
                                            } else if(col.type == FieldTypes.IMAGE) {
                                                return (<td scope="row" key={`${col.id}_col_${rec.id}`}>
                                                    <img src={`${props.baseURL}file/${rec[col.id]}`} className="rounded my-2" style={{ width: "100px", height: "auto" }} alt="attached image" />
                                                </td>);
                                            } else {
                                                return (<td scope="row" key={`${col.id}_col_${rec.id}`}>{rec[col.id]}</td>);
                                            }
                                        }else {
                                            return (<></>);
                                        }
                                    })
                                }</tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="col"></div>
        </div>
    );
}

export default CompanyList;