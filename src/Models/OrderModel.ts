
class Order{

    id;
    deviceId;
    serviceId;
    price;
    imei;
    userId;
    date;
    number;
    rating;
    state;
    technician;
    warrantyAmount;
    warrantyDate;
    closingDate

    constructor({
        id, 
        deviceId,
        serviceId,
        price,
        imei,      
        userId,
        date,
        number,
        rating,
        state,
        warrantyAmount,
        warrantyDate,
        closingDate,
        technician
    }: { 
        id: number,
        deviceId: any,
        serviceId: any,
        price: any,
        imei: any,      
        userId: any,
        date: any,
        number: any,
        rating: any,
        state: any,
        warrantyAmount: any,
        warrantyDate: any,
        closingDate: any,
        technician: any
    }){  
            
        this.id = id;
        this.deviceId = deviceId;
        this.serviceId = serviceId;
        this.price = price;
        this.imei = imei;
        this.userId = userId;
        this.serviceId = serviceId;
        this.date = date;
        this.number = number;
        this.rating = rating;
        this.state = state;
        this.technician = technician;
        this.warrantyAmount = warrantyAmount;
        this.warrantyDate = warrantyDate;
        this.closingDate = closingDate;
    }


}

export default Order;