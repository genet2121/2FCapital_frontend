import BaseEntity from "./BaseEntity";

export default interface TicketNumber extends BaseEntity {
    CompanyId: number;
    ticketId: number;
    GameId: number;
    Number: number;
}