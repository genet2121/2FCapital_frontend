import BaseEntity from "./BaseEntity";
import UserRoles from "../Enums/UserRoles";

export default interface User extends BaseEntity {
    FullName: string;
    Username: string;
    Email: string;
    Role: UserRoles;
    Status: ("active"|"inactive");
    Password: string;
}
