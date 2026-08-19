'use strict';

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title:       'CloudStay API',
      version:     '1.0.0',
      description: 'Student Hostel Booking System — REST API Documentation',
      contact:     { name: 'CloudStay Team', email: 'admin@cloudstay.edu' },
    },
    servers: [
      { url: 'http://localhost:5000/api', description: 'Development server' },
      { url: 'https://<ec2-public-ip>/api', description: 'Production server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        RegisterInput: {
          type: 'object', required: ['name','email','studentId','password'],
          properties: {
            name:      { type: 'string', example: 'Abena Mensah' },
            email:     { type: 'string', format: 'email', example: 'abena@student.edu' },
            studentId: { type: 'string', example: 'STU-2024-001' },
            password:  { type: 'string', minLength: 8, example: 'Student@1234' },
          },
        },
        LoginInput: {
          type: 'object', required: ['email','password'],
          properties: {
            email:    { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        Hostel: {
          type: 'object',
          properties: {
            id:             { type: 'integer' },
            name:           { type: 'string' },
            location:       { type: 'string' },
            description:    { type: 'string' },
            amenities:      { type: 'array', items: { type: 'string' } },
            total_rooms:    { type: 'integer' },
            available_rooms:{ type: 'integer' },
          },
        },
        Room: {
          type: 'object',
          properties: {
            id:                  { type: 'integer' },
            room_number:         { type: 'string' },
            room_type:           { type: 'string', enum: ['single','double','triple','suite'] },
            capacity:            { type: 'integer' },
            price_per_semester:  { type: 'number' },
            status:              { type: 'string', enum: ['available','booked','maintenance'] },
            hostel_name:         { type: 'string' },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            id:             { type: 'integer' },
            status:         { type: 'string', enum: ['pending','approved','rejected','cancelled'] },
            check_in_date:  { type: 'string', format: 'date' },
            check_out_date: { type: 'string', format: 'date' },
            receipt_url:    { type: 'string', nullable: true },
            student_name:   { type: 'string' },
            room_number:    { type: 'string' },
            hostel_name:    { type: 'string' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth',    description: 'Authentication endpoints' },
      { name: 'Hostels', description: 'Hostel management' },
      { name: 'Rooms',   description: 'Room management' },
      { name: 'Bookings',description: 'Booking lifecycle' },
      { name: 'Admin',   description: 'Admin-only operations' },
    ],
  },
  apis: ['./src/controllers/*.js', './src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
