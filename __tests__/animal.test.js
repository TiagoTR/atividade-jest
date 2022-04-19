const request = require('supertest');
const app = require('../src/app');
const animalsData = require('../src/data/animals.json');
const fs = require('fs');

describe('Cadastro de animais', () => {
    afterAll( ()=> {
        while (animalsData.length > 0){
            animalsData.pop();
        }
        fs.writeFileSync('src/data/animals.json', JSON.stringify(animalsData));
    });

    it('deve cadastrar um animal com sucesso', async () => {
        const res = await request(app).post('/animais?nome=Spike&especie=Cachorro&idade=3');
        expect(res.status).toBe(201);
    });

    it('deve falhar no cadastro do animal por que idade deve ser um numero', async () => {
        const res = await request(app).post('/animais?nome=Mimi&especie=Gato&idade=jovem');
        expect(res.status).toBe(400);
    });

    it('deve falhar no cadastro do animal por que nome é muito curto', async () => {
        const res = await request(app).post('/animais?nome=J&especie=Hamster&idade=1');
        expect(res.status).toBe(400);
    });
});

describe('Retorno da lista de animais', ()=>{
    beforeAll( ()=> {
        animalsData.push({
            'id': 'idteste',
            'nome': 'Toby',
            'especie': 'Cachorro',
            'idade': 3,
        });
        animalsData.push({
            'id': 'idteste2',
            'nome': 'Ted',
            'especie': 'Cachorro',
            'idade': 2,
        });
        animalsData.push({
            'id': 'idteste3',
            'nome': 'Tuio',
            'especie': 'Cachorro',
            'idade': 1,
        });
        fs.writeFileSync('src/data/animals.json', JSON.stringify(animalsData));
    });

    afterAll( ()=> {
        while (animalsData.length > 0){
            animalsData.pop();
        }
        fs.writeFileSync('src/data/animals.json', JSON.stringify(animalsData));
    });

    it('deve retornar uma lista com todos os animais', async () => {
        const res = await request(app).get('/animais');
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(3); 
    });
});