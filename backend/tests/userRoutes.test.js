const request = require('supertest');
const app = require('../app'); // Assuming app.js exports the Express app
const mongoose = require('mongoose');
const User = require('../models/User'); // Import your User model for database checks

// Setup and teardown for tests
beforeAll(async () => {
  // Connect to in-memory DB or test DB (you may want to use MongoMemoryServer for testing)
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/finance_test';
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Registration and Login', () => {
  it('should successfully register a new user and return a JWT token', async () => {
    const user = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/api/users/register')
      .send(user);

    expect(response.status).toBe(201); // Status code for successful creation
    expect(response.body).toHaveProperty('token'); // Check if token is returned
    expect(response.body.user).toHaveProperty('name', user.name); // Check if name matches
  });

  it('should return an error if email already exists', async () => {
    const user = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    };

    // Register the user first
    await request(app).post('/api/users/register').send(user);

    // Try to register again with the same email
    const response = await request(app)
      .post('/api/users/register')
      .send(user);

    expect(response.status).toBe(400); // Expect a conflict error since email exists
    expect(response.body.message).toBe('User already exists');
  });
});


describe('User Login', () => {
  it('should login a user and return a JWT token', async () => {
    const user = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    };

    // Register the user first (assuming registration works)
    await request(app).post('/api/users/register').send(user);

    // Login the user
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({
        email: user.email,
        password: user.password,
      });

    expect(loginResponse.status).toBe(200); // Expect success
    expect(loginResponse.body).toHaveProperty('token'); // Check if token is returned
  });

  it('should return an error for invalid login credentials', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'wronguser@example.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(400); // Invalid credentials
    expect(response.body.message).toBe('Invalid credentials');
  });
});
