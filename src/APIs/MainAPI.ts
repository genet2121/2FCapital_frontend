
import IPagination from "../Intefaces/IPagination";
import { authFileRequest, Authorized, normal } from "./api";

class MainAPI {

    public static async getAll(token: string, tableName: string, pageNumber: number, pageSize: number, condition?: any): Promise<IPagination<any>> {

        try {
            return await Authorized(token).bodyRequest("post", `crud/getlist/${tableName}/${pageNumber}/${pageSize}`, condition);
        } catch (error: any) {
            console.log(error.message);
            return {
                Items: [],
                PageNumber: 1,
                PageSize: 10,
                TotalCount: 0
            };
        }
    }
    
    public static async getorAll(token: string, tableName: string, pageNumber: number, pageSize: number, condition?: any): Promise<IPagination<any>> {

        try {
            return await Authorized(token).bodyRequest("post", `crud/getorlist/${tableName}/${pageNumber}/${pageSize}?type=related`, condition ?? {});
        } catch (error: any) {
            console.log(error.message);
            return {
                Items: [],
                PageNumber: 1,
                PageSize: 10,
                TotalCount: 0
            };
        }
    }
    
    public static async loadAttachments(token: string, table: string, record_id: string): Promise<IPagination<any>> {

        try {
            return await Authorized(token).bodyRequest("post", `crud/getlist/attachment/1/100`, {
                "record": { eq: parseInt(record_id) },
                "table": { eq: table }
            });
        } catch (error: any) {
            return {
                Items: [],
                PageNumber: 1,
                PageSize: 10,
                TotalCount: 0
            };
        }
    }

    public static async getSingle(token: string, tableName: string, id: number): Promise<any> {
        try {
            return await Authorized(token).bodyRequest("get", `crud/getform/${tableName}/${id}`);
        } catch (error: any) {
            console.log(error.message);
            return null;
        }
    }

    public static async getSingleRelated(token: string, tableName: string, id: number): Promise<any> {
        try {
            return await Authorized(token).bodyRequest("get", `crud/getform/${tableName}/${id}?type=related`);
        } catch (error: any) {
            console.log(error.message);
            return null;
        }
    }

    public static async getAllRelated(token: string, tableName: string, pageNumber: number, pageSize: number, condition?: any): Promise<IPagination<any>> {

        try {
            return await Authorized(token).bodyRequest("post", `crud/getlist/${tableName}/${pageNumber}/${pageSize}?type=related`, condition);
        } catch (error: any) {
            console.log(error.message);
            return {
                Items: [],
                PageNumber: 1,
                PageSize: 10,
                TotalCount: 0
            };
        }
    }

    public static async createNew(token: string, table: string, new_data: any): Promise<any> {
        return await Authorized(token).bodyRequest("post", "crud/create", {tableName: table, data: new_data});
    }
    
    public static async createNewNoAuth(table: string, new_data: any): Promise<any> {
        return await normal().bodyRequest("post", "crud/create", {tableName: table, data: new_data});
    }

    public static async update(token: string, tableName: string, new_data: any): Promise<any> {
        return await Authorized(token).bodyRequest("put", "crud/update", {tableName, data: new_data});
    }

    public static async forSelectBox(token: string, table: string, as_id: string, as_label: string) {
        try {
            return await Authorized(token).bodyRequest("get", `crud/selectbox/${table}/${as_id}/${as_label}`);
        } catch (error: any) {
            return null;
        }
    }
    public static async delete(token: string, table: string, id: number) {
        return await Authorized(token).bodyRequest("post", `crud/delete/`, {
            "tableName": table,
            "id": [id]
        });
    }
    
    public static async deleteList(token: string, table: string, id_s: number[]) {
        return await Authorized(token).bodyRequest("post", `crud/delete`, {
            "tableName": table,
            "id": id_s
        });
    }

    public static async addAttachment(token: string, table: string, record: number, attachment: {file: any, name: string}){
        return await authFileRequest(token, "post", "file/upload", {table, record: `${record}`, ...attachment});
    }
}

export default MainAPI;