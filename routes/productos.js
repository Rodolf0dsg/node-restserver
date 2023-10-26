const { Router, request, response } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

const { obtenerProducto,
        obtenerProductos, 
        actualizarProducto,
        crearProducto,
        eliminarProducto } = require('../controllers/productos');


const { validarJWT } = require('../middlewares');


router.get('/', obtenerProductos)


router.get('/:id', obtenerProducto)


router.post('/', ( req, res = response) => {
    res.json({
        'msg': 'todo va bien'
    })
} )


router.put('/:id', actualizarProducto )


router.delete('/', eliminarProducto)

module.exports = router;