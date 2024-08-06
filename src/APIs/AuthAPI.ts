import {Authorized, normal} from "./api";

export async function Login(email: string, password: string){

    try{

        let response = await normal().bodyRequest("post", "auth/login", {
            email,
            password
        });

        return response;

    }catch(error){
        throw error;
    }

}

export async function information(token: string): Promise<{status: boolean, data: (any | null)}> {

    try{

        let response = await Authorized(token).bodyRequest("get", "auth/authorize");
        
        return {
            status: true,
            data: {...response, token: token}
        };

    }catch (error: any){
        console.log(error.message);
    }

    return {
        status: false,
        data: null
    };

}

export async function createUser(token: string, user_data: {
    name: string,
    email: string,
    password: string,
}) {
    try{
        let response = await Authorized(token).bodyRequest("post", "/Users/create", user_data);
    }catch(error){
        throw error;
    }
}
