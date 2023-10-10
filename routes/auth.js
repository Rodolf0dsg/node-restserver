const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contrase;a es obligatoria').not().isEmpty(),
    validarCampos,
] , login );

router.post('/google',[
    check('id_token', 'No se recibio un token').not().isEmpty(),
    validarCampos,
] , googleSignIn );
module.exports = router;