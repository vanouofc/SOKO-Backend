export class ErreurMetier extends Error {

    constructor(message, statusCode = 400) {
        super(message);
        this.name = "ErreurMetier";
        this.statusCode = statusCode;
        this.isErreurMetier = true;

        // Conserve une stack trace propre (sans cette ligne, la stack pointerait vers le constructeur lui-même)
        Error.captureStackTrace(this, this.constructor);
    };
};