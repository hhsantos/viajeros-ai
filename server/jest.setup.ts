// Jest setup file
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set default test environment variables
process.env.NODE_ENV = 'test';
process.env.USE_MOCK_AI = 'true';
process.env.PORT = '3002';
process.env.CLAUDE_API_KEY = 'test-api-key';