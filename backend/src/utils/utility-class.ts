class ErrorHandler extends Error{
    constructor(public message:string,public statusCode:number){
        super(message);
        this.statusCode=statusCode;
        this.message=message;
    }
}

export default ErrorHandler;