const router = require('express').Router();
const { Videogame, Genre, Platforms } = require('../db')
const axios = require('axios')
const { API_KEY } = process.env
const { Op } = require('sequelize');

/* FUNCION PARA MAPEAR LOS GAMES DE LA API */
const mapearReusltDeLaApi = async (arr) => {
    const result = arr.map(e => {
        return {
            id: e.id,
            name: e.name,
            background_image: e.background_image,
            genres: e.genres.map(e => {
                return {
                    name: e.name
                }
            }),
            platforms: e.platforms.map(e => {
                return {
                    name: e.platform.name
                }
            }),
            rating: e.rating
        }
    })
    return result;
};

/* FUNCION PARA TRAER LOS GAMES DE LA API */

const getApiGames = async () => {
    const apiGames = await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}`)

    let apiGamesMapeados = await mapearReusltDeLaApi(apiGames.data.results)

    let next = apiGames.data.next

    while (apiGamesMapeados.length < 100) {
        const proxNext = await axios.get(next)
        const resultSum = await mapearReusltDeLaApi(proxNext.data.results)
        apiGamesMapeados = [...apiGamesMapeados, ...resultSum]
        next = proxNext.data.next
    }
    // console.log(apiGamesMapeados.length);
    return apiGamesMapeados
}

const dataBaseInfo = async function () {
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


const allData = async function () {
    const apiData = await getApiGames()
    const bdData = await dataBaseInfo()
    const allData = [...apiData, ...bdData]
    return allData
}

router.get("/", async function (req, res) {
    const { name } = req.query
    try {
        const allVideogames = await allData()

        if (name && name !== "") {
            const resApiName = await axios.get(`https://api.rawg.io/api/games?search=${name}&key=${API_KEY}`)
            // console.log(resApiName.data.results);

            let gameDataBase = await Videogame.findAll({
                where: {
                    name: { [Op.like]: `%${name}%` }
                },
                include: Genre
            });
            Promise.all([resApiName, gameDataBase])
                .then((respuesta) => {
                    const [respuestaApi, gameDataBase] = respuesta
                    // console.log(respuestaApi.data.results);
                    const mapResApiGame = respuestaApi.data.results.map(e => {
                        return {
                            id: e.id,
                            name: e.name,
                            background_image: e.background_image,
                            genres: e.genres.map(e => {
                                return {
                                    name: e.name
                                }
                            }),
                            platforms: e.platforms.map(e => {
                                return {
                                    name: e.platform.name
                                }
                            }),
                            rating: e.rating
                        }
                    });
                    const resultGamesDataBaseAndApi = [...mapResApiGame, ...gameDataBase]
                    // console.log(resultGamesDataBaseAndApi);
                    if (resultGamesDataBaseAndApi.length) {
                        res.status(200).json(resultGamesDataBaseAndApi)
                    } else {
                        res.status(404).send('Juego no encontrado')
                    }
                })
        } else {
            res.status(200).send(allVideogames)
        }
    } catch (error) {
        console.log(error)
    }
})



// async function apiInfo() { //TRAE INFO DE API
//     let promises = []
//     let allGames = []
//     try {
//         for (let i = 1; i <= 5; i++) {
//             promises.push(await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&page=${i}`)
//                 .then((response) => {
//                     return response
//                 }))

//         }
//         await Promise.all(promises)
//             .then((response) => {
//                 for (let i = 0; i < promises.length; i++) {
//                     allGames = allGames.concat(response[i].data.results.map(e => {
//                         return {
//                             id: e.id,
//                             name: e.name,
//                             background_image: e.background_image,
//                             genres: e.genres.map(e => {
//                                 return {
//                                     name: e.name
//                                 }
//                             }),
//                             platforms: e.platforms.map(e => {
//                                 return {
//                                     name: e.platform.name
//                                 }
//                             }),
//                             rating: e.rating
//                         }
//                     }))
//                 }
//             })
//         return allGames
//     } catch (error) {
//         console.log(error)
//     }
// }


// router.get('/platforms', async (req, res, next) => {
//     try {
//         const allDataResp = await apiInfo()
//         console.log(allDataResp);
//         const result = allDataResp.map(p => {
//             return {
//                 platforms: p.platforms.map(r => {
//                     return {
//                         name: r.name
//                     }
//                 })
//             }
//         })
//         res.json(result);
//     } catch (error) {
//         next(error)
//     }
// })

/* FUNCION PARA MAPEAR LOS GAMES DE LA API */
// const mapearReusltDeLaApi = async (arr) => {
//     const result = arr.map(game => {
//         return {
//              id: e.id,
//              name: e.name,
//              background_image: e.background_image,
//              genres: e.genres.map(e => {
//                  return {
//                      name: e.name
//                  }
//              }),
//              platforms: e.platforms.map(e => {
//                  return {
//                      name: e.platform.name
//                  }
//              }),
//              rating: e.rating
//         }
//     })
//     return result;
// };



/* FUNCION PARA TRAER LOS GAMES DE LA BASE DE DATOS */

// const getDataBaseGames = async () => {
//     return await Videogame.findAll({
//         include: [
//             {
//                 model: Genre,
//                 attributes: ['name'],
//                 through: {
//                     attributes: []
//                 }
//             }
//         ]
//     })
// }

/* FUNCION PARA TRAER TODO LOS GAMES DE LA BASE DE DATOS Y LA API */

// const allsApiDataBaseGames = async () => {
//     const resultApi = await getApiGames()
//     const resultDataBase = await getDataBaseGames()
//     const resultAlls = [...resultApi, resultDataBase]
//     return resultAlls
// }

/* GET FINAL! */
// router.get('/', async (req, res, next) => {
//     const { name } = req.query;
//     try {
//         if (name) {
//             // console.log(name);
//             const resApiName = await axios.get(`https://api.rawg.io/api/games?search=${name}&key=${API_KEY}`)
//             // console.log(resApiName.data.results);

//             let gameDataBase = await Videogame.findAll({
//                 where: {
//                     name: { [Op.like]: `%${name}%` }
//                 },
//                 include: [
//                     {
//                         model: Genre,
//                         attributes: ['name'],
//                         through: {
//                             attributes: []
//                         }
//                     }
//                 ]
//             });
//             Promise.all([resApiName, gameDataBase])
//                 .then((respuesta) => {
//                     const [respuestaApi, respuestaDataBase] = respuesta
//                     console.log(respuestaApi.data.results);
//                     const mapResApiGame = respuestaApi.data.results.map(dat => {
//                         return {
//                             id: dat.id,
//                             name: dat.name,
//                             img: dat.background_image,
//                             genres: dat.genres.map(gen => gen.name),
//                             rating: dat.rating_top,
//                             platforms: dat.parent_platforms.map(plat => {
//                                 return {
//                                     name: plat.name
//                                 }
//                             }),
//                             released: dat.released
//                         }
//                     });
//                     const resultGamesDataBaseAndApi = [...mapResApiGame, ...respuestaDataBase]
//                     // console.log(resultGamesDataBaseAndApi);
//                     if (resultGamesDataBaseAndApi) {
//                         res.status(200).json(resultGamesDataBaseAndApi)
//                     } else {
//                         res.status(404).send('Game Not Exist')
//                     }
//                 })
//             // let results = { ...mapResApiGame, ...gameDataBase }
//             // if (results) {
//             //     res.status(200).send(results)
//             // } else {
//             //     res.status(404).send('Game Not Exist!s')
//             // }
//         } else {
//             const allsTheGames = await allsApiDataBaseGames()
//             // console.log(allsTheGames);
//             res.status(200).json(allsTheGames)
//         }
//     } catch (error) {
//         next(error)
//     }

// })


//GET PRUEBA DATA BASE
// router.get('/', async (req, res, next) => {
//     try {
//         let getDataBase = await Videogame.findAll({
//             include: Genre
//         })
//         res.status(200).json(getDataBase)
//     } catch (error) {
//         next(error)
//     }

// })

//GET PRUEBA API GAMES
// router.get('/', async (req, res, next) => {
//     try {
//         const apiGames = await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}`)
//         let apiGamesMapeados = await mapearReusltDeLaApi(apiGames.data.results)
//         res.status(200).json(apiGamesMapeados)
//     } catch (error) {
//         next(error)
//     }
// })

//GET PRUEBA ALLS API AND DATA BASE
// router.get('/', async (req, res, next) => {
//     try {
//         const allsApiAndDataBaseGames = await allsApiDataBaseGames()
//         res.status(200).json(allsApiAndDataBaseGames)
//     } catch (error) {
//         next(error)
//     }
// })

module.exports = router;