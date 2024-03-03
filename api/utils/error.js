// manually created function to throw an  http response status code and a error message 
export const errorHandler = (statusCode,message)=>{ 
    const error = new Error()
    error.statusCode = statusCode;
    error.message = message;
    return error;
}