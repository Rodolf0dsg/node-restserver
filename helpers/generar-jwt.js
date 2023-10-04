const jwt = require('jsonwebtoken');

const generarJWT = ( uid = '') => {

    return new Promise ((resolve, reject) => {

        const payload = { uid } //payload es la informacion del JWT

        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h',
        }, (err, token) => {

            if(err){
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve( token );
            }

        });
    });
}

// jwt.sign( payload, 'llavesecreta', { expiresIn: 'Tiempo de expiracion'}, (err, token ) => { /** */ })

module.exports = generarJWT;