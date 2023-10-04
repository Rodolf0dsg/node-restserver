const { validationResult } = require("express-validator");


const validarCampos = ( req, res, next ) => {

    const errors = validationResult(req); //se importa de express-validator

    if ( !errors.isEmpty() ) { //si errores NO esta vacio, significa que huvieron errores
        console.log('Hola');
        return res.status(400).json(errors);
        
    }

    next(); 
    //next significa que si llega a ese punto siga con el siguiente middleware o el controlador en caso de no haber mas middlewares
}

module.exports = {
    validarCampos,
}