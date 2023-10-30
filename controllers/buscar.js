const { request, response } = require("express");


const buscar = ( req = request, res = response ) => {

    return res.json({
        "msg": "buscar"
    })

}

module.exports = {
    buscar,
}