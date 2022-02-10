const router = require('express').Router();
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const videogamesRoute = require('./videogames')
const videogameRoute = require('./videogame')
const genreRoute = require('./genre')
const platformsRoute = require('./platforms')

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/videogames', videogamesRoute)
router.use('/videogame', videogameRoute)
router.use('/genres', genreRoute)
router.use('/platforms', platformsRoute)

module.exports = router;
