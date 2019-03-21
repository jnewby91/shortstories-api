'use strict'
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/shortStories';
// exports.TEST_DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/';
exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
exports.JWT_SECRET=process.env.JWT_SECRET; 
exports.JWT_EXPIRY=process.env.JWT_EXPIRY || '2d'; 
exports.PORT = process.env.PORT || 8080; 