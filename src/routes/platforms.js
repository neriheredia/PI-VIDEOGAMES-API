const router = require('express').Router();
const { Platforms } = require('../db')
const axios = require('axios')
const { API_KEY } = process.env

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

router.get("/", async function (req, res) {
    let plat = await getApiGames()
    // console.log(plat);
    let plat2 = plat?.map(e => e.platforms).flat(5)
    // console.log(plat2);
    let plat3 = plat2?.map(e => e.name.trim())
    // console.log(plat3);
    let noRepeatedTemp = [...new Set(plat3)]
    // console.log(noRepeatedTemp);

    noRepeatedTemp.map((e) => {
        Platforms.findOrCreate({
            where: {
                name: e
            }
        })
    })
    const platform = await Platforms.findAll()
    // console.log(platform);
    res.send(platform)
})





// const apiInfo = async function () {
//     let allGames = []
//     let promises = []

//     try {
//         for (let i = 1; i <= 5; i++) {
//             promises.push(await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&page=${i}`)
//                 .then(response => {
//                     return response
//                 }))

//         }
//         await Promise.all(promises)
//             .then((response) => {
//                 for (let i = 0; i < promises.length; i++) {
//                     allGames = allGames.concat(response[i].data.results.map(e => {
//                         return {
//                             platforms: e.platforms.map(e => {
//                                 return {
//                                     name: e.platform.name
//                                 }
//                             }),
//                         }
//                     }))
//                 }
//             })
//         return allGames

//     } catch (error) {
//         console.log(error)
//     }
// }




// const getApiGames = async () => {
//     const apiGames = await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}`)

//     let apiGamesMapeados = await mapearReusltDeLaApi(apiGames.data.results)

//     let next = apiGames.data.next

//     while (apiGamesMapeados.length < 100) {
//         const proxNext = await axios.get(next)
//         const resultSum = await mapearReusltDeLaApi(proxNext.data.results)
//         apiGamesMapeados = [...apiGamesMapeados, ...resultSum]
//         next = proxNext.data.next
//     }
//     console.log(apiGamesMapeados.length);
//     return apiGamesMapeados
// }


// const dataBasePlatforms = async function () {  //TRAE INFO DE BD
//     const dataBd = await Platforms.findAll({
//         include: [
//             {
//                 model: Platforms,
//                 attributes: ["name"],
//                 through: {
//                     attributes: []
//                 }
//             }
//         ]
//     })
//     return dataBd
// }

// const responsePlatforms = async function () {  //JUNTA LAS DOS INFO
//     const apiData = await apiPlatforms()
//     const bdData = await dataBasePlatforms()
//     const allData = [...apiData, ...bdData]
//     return allData
// }

//GET GENRES
// router.get('/', async (req, res, next) => {
//     let arr = []
//     let promise = []
//     try {
//         const resultadoApi = await getApiGames()
//         arr = arr.push(resultadoApi)

//         const resBS = await Platforms.findAll()
//         console.log(resBS);
//         // res.status(200).json(resBS)
//     } catch (error) {
//         next(error)
//     }
// })

module.exports = router;