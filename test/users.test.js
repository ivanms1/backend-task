process.env.NODE_ENV = 'test'

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

let token = 'null';

describe('/GET login', () => {
	it('should login with correct credentials', done => {
		chai.request(app)
		.post('/users/login')
		.send({
			username: 'ivan',
			password: '123456'
		})
		.end((err, res) => {
			res.should.have.status(200);
			res.body.should.have.property('token');
			done();
		})
	})
	it('should not login with incorrect credentials', done => {
		chai.request(app)
		.post('/users/login')
		.send({
			username: 'ivan',
			password: '1234567'
		})
		.end((err, res) => {
			res.should.have.status(400);
			done();
		})
	})
})

describe('/PATCH jsonpatch', () => {
	before(done => {
		chai.request(app)
		.post('/users/login')
		.send({
			username: 'ivan',
			password: '123456'
		})
		.end((err, res) => {
			token = res.body.token;
			done();
		})
	})

	it('should apply the patch when sending correct document', done => {
		chai.request(app)
		.patch('/users/jsonpatch')
		.set('Authorization', token)
		.send({
			json: {
			  			"baz": "qux",
			  			"foo": "bar"
					},
			patch: [
						{ "op": "replace", "path": "/baz", "value": "patched" }
					]
		})
		.end((err, res) => {
			res.should.have.status(200);
			done();
		})
	})

	it('should reject patch if document is not jsonpatch', done => {
		chai.request(app)
		.patch('/users/jsonpatch')
		.set('Authorization', token)
		.send({
			json: {
			  			"baz": "qux",
			  			"foo": "bar"
					}
		})
		.end((err, res) => {
			res.should.have.status(400);
			done();
		})
	})

	it('should not apply patch if token is missing', done => {
		chai.request(app)
		.patch('/users/jsonpatch')
		.send({
			json: {
			  			"baz": "qux",
			  			"foo": "bar"
					},
			patch: [
						{ "op": "replace", "path": "/baz", "value": "patched" }
					]
		})
		.end((err, res) => {
			res.should.have.status(401);
			done();
		})
	})
})

describe('/POST thumbnail', () => {
	before(done => {
		chai.request(app)
		.post('/users/login')
		.send({
			username: 'ivan',
			password: '123456'
		})
		.end((err, res) => {
			token = res.body.token;
			done();
		})
	})

	it('should create a thumbnail', done => {
		chai.request(app)
		.post('/users/thumbnail')
		.set('Authorization', token)
		.send({
			url: 'https://cdn.pixabay.com/photo/2018/07/06/19/48/charles-chaplin-3521070_960_720.jpg'
		})
		.end((err, res) => {
			res.should.have.status(200);
			done();
		})
	})

	it('should not create thumbnail if url is invalid', done => {
		chai.request(app)
		.post('/users/thumbnail')
		.set('Authorization', token)
		.send({
			url: 'https://cdn.pixabay.com'
		})
		.end((err, res) => {
			res.should.have.status(400);
			done();
		})
	})

	it('should not create a thumbnail if token is missing', done => {
		chai.request(app)
		.post('/users/thumbnail')
		.send({
			url: 'https://cdn.pixabay.com/photo/2018/07/06/19/48/charles-chaplin-3521070_960_720.jpg'
		})
		.end((err, res) => {
			res.should.have.status(401);
			done();
		})
	})
})