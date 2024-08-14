// import index
const app = require('../index');
const request = require('supertest');

// testing starts
describe('Auth tests', () => {
    it('should return 200', async () => {
        const res = await request(app).get('/');
        console.log(res.statusCode);
        expect(res.statusCode).toEqual(200);
    });



    // test for api/user/register
    it('Post api/user/register | response test', async () => {
        const res = await request(app).post('/api/user/register').send({
            firstName: 'test',
            lastName: 'test',
            email: 'test@mail.com',
            password: '12345678',
            address: 'test address',
        });
        console.log(res.statusCode);
        console.log(res.body);
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('user created sucessfully');
    }
    );
    it('Post api/user/register | response message', async () => {
        const res = await request(app).post('/api/user/register').send({
            firstName: 'test',
            lastName: 'test',
            email: 'test@gmail.com',
            password: '12345678',
            address: 'test address',
        });
        console.log(res.body);
        // check if the user is already exists 
        expect(res.body.message).toEqual('User Already Exists!');
    }
    );


    // test for api/user/login
    it('Post api/user/login | response test', async () => {
        const res = await request(app).post('/api/user/login').send({
            email: 'test@gmail.com',
            password: '1234567',
        });
        console.log(res.statusCode);
        console.log(res.body);
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Login Sucessfull!');
    }
    );
});

// test related to product
describe('Product tests', () => {
    token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YmNhYzhhNmJiNzFhOWZmZTJhMzg0YiIsImlhdCI6MTcyMzY0MTQzOCwiZXhwIjoxNzI0MjQ2MjM4fQ._JRzhwXNRKRDq-O-_Cme1XCiBL2DrWdLrujUjFeF6Bs'    // test for api/product/create
    it('Post api/product/create | response test without token', async () => {
        const res = await request(app).post('/api/product/create').send({
            name: 'test product',
            price: 100,
            description: 'test description',
        });
        console.log(res.statusCode);
        console.log(res.body);
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual('No authentication token, access denied');
    }
    );

    // test for api/product/ | get all products
    it('Get api/product/ | response test', async () => {
        // request with token header
        const res = await request(app).get('/api/product/').set('Authorization', `Bearer ${token}`);
        console.log(res.statusCode);
        console.log(res.body);
        expect(res.statusCode).toEqual(200);
    }
    );


});


//test related to customer  
describe('Customer tests', () => {
    token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YmNhYzhhNmJiNzFhOWZmZTJhMzg0YiIsImlhdCI6MTcyMzY0MTQzOCwiZXhwIjoxNzI0MjQ2MjM4fQ._JRzhwXNRKRDq-O-_Cme1XCiBL2DrWdLrujUjFeF6Bs'    // test for api/product/create

    // test for api/customer/create
    it('Post api/customer/create | response test without token', async () => {
        const res = await request(app).post('/api/customer/create').send({
            name: 'test customer',
            email: 'homer@mail.com',
            phone: '1234567890',
        });
        console.log(res.statusCode);
        console.log(res.body);
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual('No authentication token, access denied');
    });

    // test for api/customer/create | with token
    it('Post api/customer/create | response test with token', async () => {
        const res = await request(app).post('/api/customer/create').send({
            name: 'test customer',
            email: 'this@mail.com',
            phone: '1234567890',
            address: 'test address',
        }).set('Authorization', `Bearer ${token}`);
        console.log(res.statusCode);
        console.log(res.body);
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toEqual('test customer');
    });


    // test for api/customer/ | get all customers

    it('Get api/customer/ | response test', async () => {
        // request with token header
        const res = await request(app).get('/api/customer/').set('Authorization', `Bearer ${token}`);
        console.log(res.statusCode);
        console.log(res.body);
        expect(res.statusCode).toEqual(200);
    }
    );

    // test for api/customer/:id | delete customer by id
    it('Delete api/customer/:id | response test', async () => {
        // request with token header
        const res = await request(app).delete('/api/customer/delete/616caca6bb71a9ffe2a384b5').set('Authorization', `Bearer ${token}`);
        console.log(res.statusCode);
        console.log(res.body);
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Customer deleted successfully');
    }
    );

}
);