
const { Router } = require('express');
const { usuariosGet, 
        usuariosPost, 
        usuariosPut, 
        usuariosDelete, 
        usuariosPatch } = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet ); // no se deben ejecutar

router.put('/:id', usuariosPut ); //Ahora id viene configurado en express
//express se encarga de parsearlo y entregarlo como una variable
//se accede a el mediante params

router.post('/', usuariosPost );

router.delete('/', usuariosDelete );

router.patch('/', usuariosPatch );



module.exports = router;