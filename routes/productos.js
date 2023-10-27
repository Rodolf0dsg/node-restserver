const { Router, request, response } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

const { obtenerProducto,
        obtenerProductos, 
        actualizarProducto,
        crearProducto,
        eliminarProducto } = require('../controllers/productos');


const { validarJWT, esAdminRole } = require('../middlewares');
const { existeProducto, existeCategoria } = require('../helpers/db-validators');


router.get('/', obtenerProductos )


router.get('/:id', [
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], obtenerProducto)


router.post('/',[
    validarJWT,
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    check('categoria', 'No es un id de mongo valido').isMongoId(),
    check('categoria').custom( existeCategoria ),
    validarCampos,
], crearProducto )


router.put('/:id', [
    validarJWT,
    check('id', 'No hay id en la peticion').not().isEmpty(),
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom( existeProducto ),
    check('nombre', 'Nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarProducto )


router.delete('/', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos,
], eliminarProducto)

module.exports = router;