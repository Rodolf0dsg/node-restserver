
const VALID_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif'];

const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * 
 * @param { Request } files archivos a subir 
 * @param {String} carpeta path de la carpeta
 * @param {Array<String>} extensionesValidas Array conteniendo extensiones personalizadas de archivos, en caso de querer aceptar mas extensiones de archivos
 * @returns {Promise<String>}
 */

const subirArchivo = ( files, extensionesValidas = [] , carpeta = '' ) => {

    return new Promise((resolve, reject) => {

        //extraer extension del archivo
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[ nombreCortado.length - 1 ];

        
        //validar extensiones

        if ( !VALID_EXTENSIONS.includes( extension ) && !extensionesValidas.includes( extension )) {
            return reject(`la extension ${extension} no es permitida`);    
        }

        //Generar un nombre con uuid
        const nombreTemp = uuidv4() + '.' + extension;

        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

        archivo.mv(uploadPath, (err) => {

            if (err) {
                console.log( err );
                return reject(err)
            }

            resolve( nombreTemp );
        });

    })
    
}

module.exports = {
    subirArchivo,
}