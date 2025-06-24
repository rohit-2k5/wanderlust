// ye jo class h nah ye express se error legi and hamare middle ware ko msg 
// degi then wo print kara dega jo error aa rahi hai and our server won't stop 

class ExpressError extends Error{
    constructor(statusCode, message){
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;