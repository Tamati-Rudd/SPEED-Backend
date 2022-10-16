const chai = require('chai');
const chaiHTTP = require('chai-http');
const { expect } = require('chai');
const testEnvironment = require('./setupTests');
chai.use(chaiHTTP);
let server;

/**
 * Before all: wait for the server to be setup and get the server object to use for testing
 */
before(async function () {
    this.timeout(10000);
    await testEnvironment.setup();
    server = testEnvironment.getServer();
});

/**
 * Analyse route unit tests
 */
describe('Analyse Route', function () {
    /**
     * Test accepted article retrieval
     */
    it('Accepted articles retrieval', async function () {
        chai
            .request(server)
            .get('/analyse/retrieve')
            .end((err, res) => {
                expect(res.status).to.be.equal(200);
                expect(err).to.be.equal(null);
                expect(res.body[0]._id).to.be.equal("6334080b423576d8a3beba63");
            });
    })

    /**
     * Test submission of analysis
     */
    it('Analysis submission', async function () {
        chai
            .request(server)
            .post('/analyse/submit')
            .send({
                "_id": "6334080b423576d8a3beba63",
                "title": "An experimental evaluation of test driven development vs. test-last development with industry professionals",
                "author": "Munir, H., Wnuk, K., Petersen, K., Moayyed, M.",
                "source": "EASE2014",
                "publication_year": "2014",
                "volume_number": "4",
                "issue_number": "",
                "doi": "https://doi.org/10.1145/2601248.2601267",
                "se_practice": "TDD",
                "claimed_benefit": "Code Quality Improvement",
                "level_of_evidence": "High"
            })
            .end((err, res) => {
                expect(res.status).to.be.equal(201);
                expect(err).to.be.equal(null);
            });
    })
});