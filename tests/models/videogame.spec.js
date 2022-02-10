const { Videogame, conn } = require('../../src/db.js');
const { expect } = require('chai');

describe('Videogame model', () => {
    before(() => conn.authenticate()
        .catch((err) => {
            console.error('Unable to connect to the database:', err);
        }));
    describe('Validators', () => {
        beforeEach(() => Videogame.sync({ force: true }));
        describe('name', () => {
            it('should throw an error if name is null', (done) => {
                Videogame.create({})
                    .then(() => done(new Error('It requires a valid name')))
                    .catch(() => done());
            });
            describe('genre', () => {
                it('should error if genre is null', (done) => {
                    Videogame.create({})
                        .then(() => done(new Error('It requires a valid genre')))
                        .catch(() => done());
                })
            })
            describe('platforms', () => {
                it('should error if platforms is null', (done) => {
                    Videogame.create({})
                        .then(() => done(new Error('It requires a valid platforms')))
                        .catch(() => done());
                })
            })
        });
    });
});
