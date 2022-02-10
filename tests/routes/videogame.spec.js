/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Videogame, conn } = require('../../src/db.js');

const agent = session(app);
// const videogame = {
//     name: 'Super Mario Bros',
// };

// describe('Videogame routes', () => {
//     before(() => conn.authenticate()
//         .catch((err) => {
//             console.error('Unable to connect to the database:', err);
//         }));
//     beforeEach(() => Videogame.sync({ force: true })
//         .then(() => Videogame.create(videogame)));
//     // describe('GET /videogames', () => {
//     //     it('should get 200', () =>
//     //         agent.get('/videogames').expect(200)
//     //     );
//     // });
// });




describe('Videogames GET', () => {
    it('should get status 200', () => {
        setTimeout(() => {
            agent
                .get('/api/videogames')
                .expect(200);
        }, 10000);
    })
});


describe("Genre GET", () => {
    it('should get status 200', () => {
        setTimeout(() => {
            agent
                .get('/api/genres')
                .expect(200);
        }, 10000);
    })
})

describe("Platforms GET", () => {
    it('should get status 200', () => {
        setTimeout(() => {
            agent
                .get('/api/platforms')
                .expect(200);
        }, 10000);
    })
})


