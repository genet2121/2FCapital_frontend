import React, { useContext, useEffect, useState } from "react";
import TopNav from "../Components/NavBars/TopNav";
import { useNavigate, useParams } from "react-router-dom";
import CompanyList from "./CompanyList";
import Forms from "./Forms";
import IForm from "../Intefaces/IForm";
import AuthContext from "../Contexts/AuthContext";
import IPagination from "../Intefaces/IPagination";
import AlertContext from "../Contexts/AlertContext";
import Empty from "../Components/Extra/Empty";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterWindow from "../Components/FilterWindow";
import Utils from "../Models/Utils";
import Waiting from "../Components/Extra/Waiting";
import MainAPI from "../APIs/MainAPI";
import UserRoles from "../Enums/UserRoles";

function TablePage(props: {
    formName: string;
    //dataLoader?: (token: string, parent_value: any, pageNumber: number, pageSize: number, localData: any) => Promise<IPagination<any>>;
    isRelatedList: boolean;
    condition: any;
    parentValue?: any;
}) {

    const { setAlert, setMenu, menu } = useContext(AlertContext);
    const { loggedUser, isLoggedIn, cookies, localData } = useContext(AuthContext);

    // const params = useParams();
    const navigate = useNavigate();
    const [showWaiting, setWaiting] = useState<boolean>(false);
    const [form, setForm] = useState<IForm | null>();
    const [records, setRecords] = useState<IPagination<any>>({
        Items: [],
        PageNumber: 1,
        PageSize: 10,
        TotalCount: 0
    });
    const [pageSetting, setPageSetting] = useState<{ pageSize: number, pageNumber: number }>({
        pageSize: 10,
        pageNumber: 1
    });
    const [visibleWindow, setVisibleWindow] = useState<string>("");
    const [filterConditions, setFilterConditions] = useState<any>({});
    const [filterQuery, setFilterQuery] = useState<string>("");
    const [selectedIds, setSelectedIds] = useState<any[]>([]);

    useEffect(() => {
        let found_form = Forms.find(frm => (frm.id == props.formName));
        // console.log("found form", found_form);
        if (found_form && found_form.roles.includes(loggedUser.Roles[0])) {
            setForm(found_form);
            setFilterConditions({...filterConditions, ...props.condition});
            setPageSetting({
                pageSize: 10,
                pageNumber: 1
            });
            // getData(found_form);
        } else {
            setRecords({
                Items: [],
                PageNumber: 1,
                PageSize: 10,
                TotalCount: 0
            });
            setForm(null);
        }
    }, [props]);

    useEffect(() => {
        let temp_qs = Utils.objectToQueryString(filterConditions);
        setFilterQuery(temp_qs);
        getData();
    }, [filterConditions,form, pageSetting]);
    
    const getData = async (form_given?: IForm) => {
        // setTimeout(() => {setWaiting(true)}, 1);
        if (form_given && form_given?.listLoader) {
            setRecords(await form_given.listLoader(cookies.login_token, pageSetting.pageNumber, pageSetting.pageSize, localData, filterConditions ?? {}));
        } else if (form?.listLoader ) {
            setRecords(await form.listLoader(cookies.login_token, pageSetting.pageNumber, pageSetting.pageSize, localData, filterConditions ?? {}));
        } else {
            setRecords({ Items: [], PageNumber: pageSetting.pageNumber, PageSize: pageSetting.pageSize, TotalCount: 0 });
        }
        // setTimeout(() => {setWaiting(false)}, 1);
        // setWaiting(false);

        /*

        else {

                setRecords(
                    props.dataLoader ?
                        await props.dataLoader(cookies.login_token, props.parentValue, pageSetting.pageNumber, pageSetting.pageSize, localData) :
                        { Items: [], PageNumber: pageSetting.pageNumber, PageSize: pageSetting.pageSize, TotalCount: 0 }
                );
            }

             else {

                setRecords(
                    props.dataLoader ?
                        await props.dataLoader(cookies.login_token, props.parentValue, pageSetting.pageNumber, pageSetting.pageSize, localData) :
                        { Items: [], PageNumber: pageSetting.pageNumber, PageSize: pageSetting.pageSize, TotalCount: 0 }
                );

            }

        */

    }

    const goToForm = (id: number) => {
        navigate(`/form/${props.formName}/${id}`);
    }

    const openWindow = (winId = "") => {
        setVisibleWindow(winId);
    }

    const nextPage = () => {
        if(records.TotalCount/pageSetting.pageSize > pageSetting.pageNumber){
            setPageSetting({...pageSetting, pageNumber: pageSetting.pageNumber + 1});
        }
    }

    const previousPage = () => {
        if(pageSetting.pageNumber != 1){
            setPageSetting({...pageSetting, pageNumber: pageSetting.pageNumber - 1});
        }
    }

    const deleteSelected = async () => {
        // window.prompt("Are you sure? all selected records will be deleted.");
        if(window.confirm("Are you sure? all selected records will be deleted.")) {
            await MainAPI.deleteList(cookies.login_token, (form?.id.replace("tbl_", "") ?? ""), selectedIds);
            setSelectedIds([]);
            setRecords(recs => ({...recs, Items: records.Items.filter(rc => selectedIds.includes(rc.id))}));
            // console.log("deletion confirmed ", selectedIds);
            setAlert(`${selectedIds.length} records has been deleted!`, "success");
        }

    }

    return (
        <div className="w-100 h-100" style={{ display: "flex", flexDirection: "column" }}>
            {
                form ? (<div className="d-flex justify-content-between pt-2 pb-2 ps-4 pe-4 border-bottom bg-light">
                    <div className="d-flex">
                        <h5 className="card-title me-3">{form.title}</h5>
                        <button className={`btn ${filterQuery != "" ? "btn-primary" : "btn-light"} btn-sm shadow-sm`} title="filter" onClick={() => { openWindow("filter"); }}>
                            <FilterAltIcon sx={{ fontSize: 20 }} />
                        </button>
                    </div>
                    <div className="btn-group">
                        {
                            (selectedIds.length > 0 && loggedUser.Roles.includes(UserRoles.ADMIN)) && (<button className="btn btn-danger btn-sm me-3" onClick={() => { deleteSelected(); }}>Delete</button>)
                        }
                        <button className="btn btn-primary btn-sm" onClick={() => { goToForm(-1) }}>New</button>
                    </div>
                </div>) : (<></>)
            }
            {
                form ? (<div className={props.isRelatedList ? "w-100" : "h-100 w-100"} style={{ overflow: "auto" }}>
                    <CompanyList cols={form.fields} rows={records ? records.Items : []} selector={goToForm} emitOnSelect={(recs => {setSelectedIds(recs)})} />
                </div>) : (<div className="h-100 container p-3"><Empty message="List Not Available! It is may be because you have no role on this! Contanct your administrator to fix this issue." /></div>)
            }
            {
                form ? (<div className="d-flex justify-content-center p-2 bg-white border-top">
                    <div className="btn-group">
                        <button className="btn btn-sm btn-primary" onClick={previousPage}>Previous</button>
                        <input value={pageSetting.pageNumber} onChange={(event) => { setPageSetting({ ...pageSetting, pageNumber: parseInt(event.target.value) }) }} type="number" className="form-control form-control-sm" style={{ width: "75px" }} placeholder="Page" />
                        <button className="btn btn-sm btn-primary">/{(records?.Items ? Math.ceil(records.TotalCount / pageSetting.pageSize) : 1)}</button>
                        <button className="btn btn-sm btn-primary" onClick={nextPage}>Next</button>
                    </div>
                </div>) : (<></>)
            }

            {
                (form && visibleWindow == "filter") ? (
                    <FilterWindow 
                        form={form} 
                        closeWindow={() => {openWindow()}} 
                        conditions={filterConditions} 
                        filter={(conditions) => {setFilterConditions(conditions); openWindow()}} 
                    />
                ) : (<></>)
            }
            {showWaiting ? (<Waiting />) : ""}
        </div>
    );
}

export default TablePage;