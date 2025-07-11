import { Request, Response } from "hyper-express";

 

export interface Response extends Response {
    view(view : string,data? : any) : void,
    inertia(view : string, inertiaProps? : any, viewProps? : any) : void,
    flash(message : string, data : any) : Response,
}


export interface Request extends Request {
    user : any,
    share : any,
    session : any,
}
