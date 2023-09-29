const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { esRoleValido, existeEmail, existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet, 
        usuariosPost, 
        usuariosPut, 
        usuariosDelete, 
        usuariosPatch } = require('../controllers/usuarios');


const router = Router();

router.get('/', usuariosGet ); // no se deben ejecutar

router.put('/:id', [

        check('id', 'No es un id valido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        check('rol').custom( esRoleValido ), //lo malo es que ahora sera obligatorio enviar el rol
        validarCampos

] ,usuariosPut ); 

//Ahora id viene configurado en express
//express se encarga de parsearlo y entregarlo como una variable
//se accede a el mediante params
//basicamente id se envia en el url, ejemplo si se pone http://localhost:8080/23 ... 23 lo toma como id

router.post('/', [

        check('correo', 'correo no valido').isEmail(),
        //check es una funcion de express-validator
        //recibe el nombre del campo (en este caso el correo: "sdfa" )
        //y el mensaje de error, y por ultimo hay que especificar que se va a validar en este caso isEmail()

        check('correo').custom( existeEmail ),

        check('nombre', 'nombre es obligatorio').not().isEmpty(),
        check('password', 'contrase;a tiene que ser de mas de 6 caracteres').isLength({ min: 6 }),
        //isLength ya se encarga de hacer el campo obligatorio

        // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']), 
        //que el campo tenga alguno de esos valores ADMIN_ROLE' o 'USER_ROLE'

        check('rol').custom( esRoleValido ),

        validarCampos

], usuariosPost ); 

//el segundo argumento (si se mandan 3 ) sera un middleware.
//en caso de querer enviar mas de un middleware, se envian como un array de middlewares

router.delete('/:id', [
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        validarCampos,
],  usuariosDelete );

router.patch('/', usuariosPatch );



module.exports = router;