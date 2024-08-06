import React, { useContext, useEffect, useState } from "react";
import TopNav from "../Components/NavBars/TopNav";
import IField from "../Intefaces/IField";
import { useNavigate, useParams } from "react-router-dom";
import IForm from "../Intefaces/IForm";
import AlertContext from "../Contexts/AlertContext";
import AuthContext from "../Contexts/AuthContext";
import FieldTypes from "../Enums/FiedTypes";
import Forms from "./Forms";
import Empty from "../Components/Extra/Empty";
import TablePage from "./TablePage";
import { authFileRequest, props, Request } from "../APIs/api";
import MainAPI from "../APIs/MainAPI";
import IRelatedList from "../Intefaces/IRelatedList";
import PushPinIcon from '@mui/icons-material/PushPin';
import UserRoles from "../Enums/UserRoles";
import IFormAction from "../Intefaces/IFormAction";
import CustomeSelectBox from "../Components/Reusables/CustomeSelectBox";


function CreateCompany() {

    const { setAlert, setWaiting, setMenu, menu } = useContext(AlertContext);
    const { loggedUser, isLoggedIn, cookies, localData } = useContext(AuthContext);

    // const [fields, setFields] = useState<IField[]>([]);
    const [form, setForm] = useState<IForm>();
    const [fieldValues, setFieldValues] = useState<any>({});
    const [currentRelatedList, setCurrentRelatedList] = useState<string>("");
    const [allRelatedList, setAllRelatedList] = useState<IRelatedList[]>([]);
    const [recordAttachments, setRecordAttachments] = useState<any[]>([]);

    const [attachment, setAttachment] = useState<{
        file: any,
        name: string
    }>({
        file: null,
        name: ""
    });

    const params = useParams();
    const navigate = useNavigate();

    const prepareForm = async () => {

        let spec = getFormSpec(params.name ?? "");
        if (!spec.roles.includes(loggedUser.Roles[0])) {
            setFieldValues({});
            return;
        }
        let new_fields = await spec.onload(cookies.login_token, spec.fields, localData, loggedUser, params.r_id);
        // console.log("organized data", new_fields);
        spec.fields = new_fields;
        // let temp_fields: any = {};
        let temp_fields: any = new Object();
        new_fields.forEach(({ id, value }) => {
            // temp_fields[id] = value;
            Object.defineProperty(temp_fields, id, {
                value: value,
                writable: true,
            });
        })
        // console.log("new_fields", new_fields)
        // console.log("inputs", temp_fields)
        setFieldValues(temp_fields);
        setForm(spec);
        setAllRelatedList(spec.relatedList);
        loadAttachment();
        setCurrentRelatedList(spec.relatedList.length > 0 ? spec.relatedList[0].id : "");
    }

    useEffect(() => {
        prepareForm();
    }, [params]);

    const fieldSetter = (value: IField) => {
        if (form) {
            let temp = form;
            temp.fields = temp.fields.map(fld => (fld.id == value.id ? value : fld));
            setForm(frm => temp);

            // fieldValues[value.id] = value.value;
            let temp_fld = new Object(fieldValues);
            for (let i = 0; i < temp.fields.length; i++) {
                Object.defineProperty(temp_fld, `${temp.fields[i].id}`, {
                    value: (
                        (temp.fields[i].type == FieldTypes.NUMBER || temp.fields[i].type == FieldTypes.REFERENCE) ? (Number.isInteger(temp.fields[i].value) ? parseInt(temp.fields[i].id == value.id ? value.value : temp.fields[i].value) : parseFloat(temp.fields[i].id == value.id ? value.value : temp.fields[i].value)) : (temp.fields[i].id == value.id ? value.value : temp.fields[i].value)),
                    writable: true,
                });
            }

            // console.log("any change", temp_fld);
            setFieldValues({ ...temp_fld });
        }
    }

    const submitForm = async (event: any) => {

        event.preventDefault();

        setTimeout(() => {
            setWaiting(true);
        }, 1);

        try {
            let response = await form?.onsubmit(cookies.login_token, form.fields);
            setAlert("Record Created Successfully", "success");
            navigate(`/list/${params.name}`);
        } catch (error: any) {
            setAlert(error.message, "error");
        }

        setTimeout(() => {
            setWaiting(false);
        }, 2);


    }
    const insertAndStay = async (event: any) => {

        event.preventDefault();

        setTimeout(() => {
            setWaiting(true);
        }, 1);

        try {
            let response = await form?.onsubmit(cookies.login_token, form.fields);
            setAlert("Record Created Successfully", "success");
            navigate(`/form/${params.name}/${response.data.id}`);
        } catch (error: any) {
            setAlert(error.message, "error");
        }

        setTimeout(() => {
            setWaiting(false);
        }, 2);


    }

    const getFormSpec = (form_name: string): IForm => {

        let found_form = Forms.find(frm => (frm.id == form_name));
        if (!found_form) {
            throw new Error("Form not found");
        }

        return found_form;
    }

    const actionCall = async (formAction: IFormAction, frm: any) => {
        setTimeout(() => {
            setWaiting(true);
        }, 1);

        try {
            await formAction.action(cookies.login_token, frm.fields, loggedUser);
            setAlert("Action Successful", "success");
            setTimeout(() => {
                setWaiting(false);
            }, 1);

            if(formAction.backToList) {
                navigate(`/list/${params.name}`);
            }
        } catch (error: any) {
            setAlert(error.message, "error");
            setTimeout(() => { setWaiting(false); }, 1);
        }
    }

    const addAttachment = async (event: any) => {

        event.preventDefault();

        setTimeout(() => {
            setWaiting(true);
        }, 1);
        
        try {
            if(!attachment.file){
                setAlert("Select a file to attach", "error");
                setTimeout(() => {
                    setWaiting(false);
                }, 1);
                return;
            }
            
            if(attachment.name == "") {
                setAlert("fill attachment name", "error");
                setTimeout(() => {
                    setWaiting(false);
                }, 1);
                return;
            }

            let response = await authFileRequest(cookies.login_token, "post", "file/upload", { table: params?.name?.replace("tbl_", ""), record: params?.r_id, ...attachment });
            // await form?.onsubmit(cookies.login_token, form.fields);
            setAlert("Record Created Successfully", "success");
            setRecordAttachments(att => ([...att, response]));
            // navigate(`/list/${params.name}`);
        } catch (error: any) {
            setAlert(error.message, "error");
        }

        setWaiting(false);

    };

    const loadAttachment = async () => {
        let response = await MainAPI.loadAttachments(cookies.login_token, params?.name?.replace("tbl_", "") ?? "unknown", params.r_id ?? "0");
        setRecordAttachments(rat => (response.Items));
    }

    const attachmentOnChange = (event: any) => {
        // console.log((event.target.name == "file" ? event.target.files : event.target.value));
        setAttachment(att => ({ ...att, [event.target.name]: (event.target.name == "file" ? event.target.files[0] : event.target.value) }))
    };

    const goToReference = (ref_id: any, ref_table: string) => {
        navigate(`/form/${ref_table}/${ref_id}`);
    }

    return (
        <div className="w-100">
            <TopNav />
            {form ? (
                <div className="d-flex justify-content-between pt-2 pb-2 ps-4 pe-4 border-bottom bg-light">
                    <h5 className="card-title">{form?.title}</h5>
                    <div className="btn-groups">

                        {
                            form.actions.map(action => (params.r_id && parseInt(params.r_id) > 0 && action.roles.includes(loggedUser.Roles[0]) && ((!action.condition) || (action.condition && (action.condition(cookies.login_token, form.fields, loggedUser))))) ? (
                                <button className={`btn btn-sm me-3 ${action.class}`} onClick={() => { actionCall(action, form) }}>{action.lable}</button>
                            ) : (<></>))
                        }
                        {
                            (params.r_id && parseInt(params.r_id) < 1) &&
                            (<button className="btn btn-primary btn-sm me-3" onClick={submitForm} >Submit</button>)
                        }
                        {
                            (params.r_id && parseInt(params.r_id) < 1) &&
                            (<button className="btn btn-outline-primary btn-sm" onClick={insertAndStay} >Save Stay</button>)
                        }
                    </div>
                </div>) : (<></>)}
            {form ? (
                <div className="row p-0 m-0">
                    {
                        (params.r_id && parseInt(params.r_id) > 0) && (
                            <div className="col-sm-12 col-md-12 col-lg-3 p-0 border-end">
                                <div className="w-100 px-3 py-2 border-bottom bg-white">Attachments</div>
                                <div className="card mt-3">
                                    <div className="card-body">
                                        <input type="text" onChange={attachmentOnChange} name="name" placeholder="Attachment Title" value={attachment.name} className="form-control form-control-sm mb-3" />
                                        <input type="file" onChange={attachmentOnChange} name="file" className="form-control form-control-sm mb-3" />
                                        <button className="btn btn-sm btn-success w-100" onClick={addAttachment}>Add Attachment</button>
                                    </div>
                                </div>
                                <div className="px-2 pt-3">
                                    {
                                        recordAttachments?.map(rec => (
                                            <div className="card mb-3">
                                                <div className="card-body">
                                                    <h5 className="card-title">{rec?.name}</h5>
                                                    <div className="card-subtitle mb-4">{rec?.extension}</div>

                                                    <a className="btn btn-sm btn-success me-3" href={`${props.baseURL}/file/${rec?.id}`} >Download</a>
                                                    {/* {(loggedUser.Roles.includes(UserRoles.ADMIN)) && (<button className="btn btn-sm btn-danger">Delete</button>)} */}
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                    <div className={(params.r_id && parseInt(params.r_id) > 0) ? "col-sm-12 col-md-12 col-lg-9" : "col-12"}>
                        <div className="container mt-4">
                            <div className="form_section w-100 mb-4">
                                <div className="row">
                                    {
                                        form?.fields.map(field => {
                                            if (!field.visible) {
                                                return <></>;
                                            } else {
                                                if ([FieldTypes.TEXT, FieldTypes.EMAIL, FieldTypes.PASSWORD, FieldTypes.NUMBER, FieldTypes.DATE, FieldTypes.DATETIME].includes(field.type)) {
                                                    return (
                                                        <div key={field.id} className="col-sm-12 col-md-6 col-lg-4">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    {(field.required) && (<b style={{color: "red", fontSize: "20px"}}>*</b>)}
                                                                    {field.label}
                                                                </label>
                                                                <input
                                                                    id={field.id}
                                                                    placeholder={field.label}
                                                                    type={field.type}
                                                                    value={fieldValues[field.id]}
                                                                    className="form-control"
                                                                    required={field.required}
                                                                    disabled={field.readonly}
                                                                    readOnly={field.readonly}
                                                                    title={field.description}
                                                                    onChange={async (event: any) => {
                                                                        await field.onchange(cookies.login_token, form.fields, event.target.value, fieldSetter);
                                                                        let tmp = field;
                                                                        if(field.type == FieldTypes.NUMBER) {
                                                                            tmp.value = Number.isInteger(event.target.value) ? parseInt(event.target.value) : parseFloat(event.target.value);
                                                                        }else {
                                                                            tmp.value = event.target.value;
                                                                        }
                                                                        fieldSetter(tmp);
                                                                    }}
                                                                    
                                                                    onFocus={() => {
                                                                        let element = document.getElementById(`${field.id}_help`);
                                                                        if(element) {
                                                                            element.style.display = "";
                                                                        }
                                                                    }}

                                                                    onBlur={() => {
                                                                        let element = document.getElementById(`${field.id}_help`);
                                                                        if(element) {
                                                                            element.style.display = "none";
                                                                        }
                                                                    }}
                                                                />
                                                                <div id={`${field.id}_help`} style={{display: "none"}} className="form-text">{field.description}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                if (FieldTypes.SELECT == field.type || FieldTypes.REFERENCE == field.type) {
                                                    return (
                                                        <div key={field.id} className="col-sm-12 col-md-6 col-lg-4">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    {(field.required) && (<b style={{color: "red", fontSize: "20px"}}>*</b>)}
                                                                    {field.label}
                                                                </label>
                                                                <div className="d-flex w-100">
                                                                    <select
                                                                        id={field.id}
                                                                        title={field.description}
                                                                        className="form-control"
                                                                        value={fieldValues[field.id]}
                                                                        required={field.required}
                                                                        disabled={field.readonly}
                                                                        onChange={async (event: any) => {
                                                                            await field.onchange(cookies.login_token, form.fields, event.target.value, fieldSetter);
                                                                            let tmp = field;
                                                                            if(field.type == FieldTypes.REFERENCE) {
                                                                                tmp.value = Number.isInteger(event.target.value) ? parseInt(event.target.value) : parseFloat(event.target.value);
                                                                            }else {
                                                                                tmp.value = event.target.value;
                                                                            }
                                                                            fieldSetter(tmp);
                                                                        }}

                                                                        onFocus={() => {
                                                                            let element = document.getElementById(`${field.id}_help`);
                                                                            if(element) {
                                                                                element.style.display = "";
                                                                            }
                                                                        }}
    
                                                                        onBlur={() => {
                                                                            let element = document.getElementById(`${field.id}_help`);
                                                                            if(element) {
                                                                                element.style.display = "none";
                                                                            }
                                                                        }}
                                                                    >
                                                                        <option value="">None</option>
                                                                        {field.options?.map(option => {
                                                                            return (
                                                                                (field.value == option.value) ?
                                                                                    (<option value={option.value} selected>{option.label}</option>) :
                                                                                    (<option value={option.value}>{option.label}</option>)
                                                                            );
                                                                        })}
                                                                    </select>
                                                                    {
                                                                        (FieldTypes.REFERENCE == field.type && params.r_id != "-1" && Number.isInteger(field.value)) && (
                                                                            <button className="btn btn-light ms-2 shadow-sm" onClick={() => {
                                                                                goToReference(parseInt(field.value), field.references ?? "")
                                                                            }}>
                                                                                <PushPinIcon />
                                                                            </button>
                                                                        )
                                                                    }
                                                                </div>
                                                                <div id={`${field.id}_help`} style={{display: "none"}} className="form-text">{field.description}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                if (FieldTypes.IMAGE == field.type) {
                                                    return (
                                                        <div key={field.id} className="col-sm-12 col-md-6 col-lg-4">
                                                            <div className="mb-3">
                                                                <label className="form-label" id={`input_label_${field.id}`}>
                                                                    {(field.required) && (<b style={{color: "red", fontSize: "20px"}}>*</b>)}
                                                                    {field.label}
                                                                </label>
                                                                {(field.value != 0 && field.value != "") && (<img src={`${props.baseURL}file/${field.value}`} className="rounded my-2" style={{ width: "100%", height: "auto" }} alt="attachement" />)}
                                                                <input
                                                                    id={field.id}
                                                                    type="file"
                                                                    title={field.description}
                                                                    className="form-control"
                                                                    required={field.required}
                                                                    disabled={field.readonly}
                                                                    readOnly={field.readonly}
                                                                    onChange={async (event: any) => {
                                                                        let tmp = field;
                                                                        tmp.value = await field.onchange(cookies.login_token, form.fields, event.target, fieldSetter);
                                                                        // tmp.value = event.target.value;
                                                                        fieldSetter(tmp);
                                                                    }}
                                                                    onFocus={() => {
                                                                        let element = document.getElementById(`${field.id}_help`);
                                                                        if(element) {
                                                                            element.style.display = "";
                                                                        }
                                                                    }}

                                                                    onBlur={() => {
                                                                        let element = document.getElementById(`${field.id}_help`);
                                                                        if(element) {
                                                                            element.style.display = "none";
                                                                        }
                                                                    }}
                                                                />
                                                                <div id={`${field.id}_help`} style={{display: "none"}} className="form-text">{field.description}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                if (FieldTypes.TEXTAREA == field.type) {
                                                    return (
                                                        <div key={field.id} className="col-12">
                                                            <div className="mb-3">
                                                                <label className="form-label" id={`input_label_${field.id}`}>
                                                                    {(field.required) && (<b style={{color: "red", fontSize: "20px"}}>*</b>)}
                                                                    {field.label}
                                                                </label>
                                                                <textarea
                                                                    id={field.id}
                                                                    placeholder="body"
                                                                    style={{ height: "150px" }}
                                                                    className="form-control"
                                                                    title={field.description}
                                                                    value={fieldValues[field.id]}
                                                                    required={field.required}
                                                                    disabled={field.readonly}
                                                                    readOnly={field.readonly}
                                                                    onChange={async (event: any) => {
                                                                        await field.onchange(cookies.login_token, form.fields, event.target.value, fieldSetter);
                                                                        let tmp = field;
                                                                        tmp.value = event.target.value;
                                                                        fieldSetter(tmp);
                                                                    }}

                                                                    onFocus={() => {
                                                                        let element = document.getElementById(`${field.id}_help`);
                                                                        if(element) {
                                                                            element.style.display = "";
                                                                        }
                                                                    }}

                                                                    onBlur={() => {
                                                                        let element = document.getElementById(`${field.id}_help`);
                                                                        if(element) {
                                                                            element.style.display = "none";
                                                                        }
                                                                    }}
                                                                >
                                                                    {field.value}
                                                                </textarea>
                                                                <div id={`${field.id}_help`} style={{display: "none"}} className="form-text">{field.description}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            }
                                        })
                                    }

                                </div>

                                {
                                    (params.r_id && parseInt(params.r_id) < 1) &&
                                    (<button type="button" className="btn btn-primary btn-sm ms-3" onClick={submitForm} >Submit</button>)
                                }
                                {
                                    form.actions.map(action => (params.r_id && parseInt(params.r_id) > 0 && action.roles.includes(loggedUser.Roles[0]) && ((!action.condition) || (action.condition && (action.condition(cookies.login_token, form.fields, loggedUser))))) ? (
                                        <button className={`btn btn-sm me-3 ${action.class}`} onClick={() => { actionCall(action, form) }}>{action.lable}</button>
                                    ) : (<></>))
                                }
                            </div>

                            {(allRelatedList.length > 0 && params.r_id != "-1") ? (
                                <div className="w-100">
                                    <ul className="nav nav-tabs">
                                        {allRelatedList.map(rl => (<li key={`rl_selector_${rl.id}`} className="nav-item">
                                            <button
                                                className={`btn nav-link ${rl.id == currentRelatedList ? "active" : ""}`}
                                                aria-current="page"
                                                onClick={() => { setCurrentRelatedList(rl.id); }}
                                            >
                                                {rl.lable}
                                            </button>
                                        </li>))}
                                    </ul>
                                    {allRelatedList.map(rl => (<div
                                        key={`rl_body_${rl.id}`}
                                        className="w-100 p-2"
                                        style={{ display: (rl.id == currentRelatedList ? "" : "none") }}
                                    >
                                        <TablePage formName={rl.form} parentValue={form.fields.find(fld => fld.id == "id")?.value} isRelatedList={true} condition={rl.loader(form.fields)} />
                                    </div>))}
                                </div>
                            ) : (<></>)}
                        </div>
                    </div>
                </div>
            ) : (<Empty message="Form Not found! It is may be because you have no role on this! Contanct your administrator to fix this issue." />)}
        </div>
    );
}

export default CreateCompany;