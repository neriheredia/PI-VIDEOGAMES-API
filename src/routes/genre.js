const router = require('express').Router();
const { Genre } = require('../db')
const axios = require('axios')
const { API_KEY } = process.env


const loadGenres = async () => {
    try {
        let gen = await Genre.count()
        if (gen === 0) {
            const genresApi = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`)
            const responseApi = genresApi.data.results
            for (let i = 0; i < responseApi.length; i++) {
                const { name } = responseApi[i];
                await Genre.create({
                    name: name
                })
            }
        }
    } catch (error) {
        console.log(error);
    }
}

//GET GENRES
router.get('/', async (req, res, next) => {
    try {
        await loadGenres()
        res.status(200).send(await Genre.findAll())
    } catch (error) {
        next(error)
    }
})



module.exports = router;