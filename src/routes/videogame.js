const router = require('express').Router()
const { Videogame, Genre, Platforms } = require('../db')
const axios = require('axios')
const { response } = require('express')
const { API_KEY } = process.env


const infoDataBase = async function () {  //TRAE INFO DE BD
    const dataBd = await Videogame.findAll({
        include: [
            {
                model: Genre,
                attributes: ["name"],
                through: {
                    attributes: []
                }
            },
            {
                model: Platforms,
                attributes: ["name"],
                through: {
                    attributes: []
                }
            }
        ]
    })
    return dataBd
}





//GET VIDEO GAME IN ID
router.get('/:id', async (req, res, next) => {
    const { id } = req.params
    const arrApiInfo = []
    if (id.includes('-')) {
        try {
            const dataBaseInfoResult = await infoDataBase()
            const filterId = dataBaseInfoResult.filter(i => i.id == id)

            if (filterId.length > 0) {
                return res.status(200).send(filterId)
            } else {
                return res.status(404).send("No se encontro Video Game con ese ID")
            }

        } catch (error) {
            console.log(error);
        }
    } else {
        try {
            const gameByIdApi = await axios.get(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`)
            arrApiInfo.push(gameByIdApi.data)
            const dataApi = arrApiInfo.map(e => {
                return {
                    id: e.id,
                    name: e.name,
                    background_image: e.background_image,
                    description: e.description,
                    released: e.released,
                    rating: e.rating,
                    platforms: e.platforms.map(e => {
                        return {
                            name: e.platform.name
                        }
                    }),
                }
            })
            const game = dataApi?.filter(e => e.id == id)
            if (game.length > 0) {
                return res.status(200).send(game)
            } else {
                return res.status(404).send("No se encontro Videojuego con ese ID")
            }
        } catch (error) {
            console.log(error);
        }
        // console.log(gameByIdApi);
    }
})


//CREATE VIDEO GAME
router.post('/', async (req, res, next) => {
    const { name, description, released, rating, platforms, background_image, genres } = req.body
    try {
        if (name && description && genres && platforms) {
            let newGame = await Videogame.create({
                name,
                description,
                released,
                rating,
                background_image,
            })
            let genreDb = await Genre.findAll({
                where: {
                    name: genres
                }
            })

            let platformDb = await Platforms.findAll({
                where: {
                    name: platforms
                }
            })

            await newGame.addGenre(genreDb)
            await newGame.addPlatforms(platformDb)
            return res.status(200).send(newGame)
        } else {
            return res.status(404).send("Completar formulario correctamente")
        }
    } catch (error) {
        console.log(next);
    }
})

module.exports = router;