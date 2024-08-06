export default interface AuthResult {
    Token: string;
    Id: number;
    FullName: string;
    Email: string;
    Phone: string;
    Roles: string[];
}