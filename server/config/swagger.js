const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'AgroPlay Authentication API',
            version: '1.0.0',
            description: 'JWT Authentication API for AgroPlay Smart Farming Platform',
            contact: {
                name: 'AgroPlay Team'
            }
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        uid: { type: 'string', example: 'u-1234567890-abc123' },
                        name: { type: 'string', example: 'Modern Farmer' },
                        email: { type: 'string', example: 'farmer@example.com' },
                        phone: { type: 'string', example: '+91-9876543210' },
                        role: { type: 'string', enum: ['Farmer', 'Learner', 'Expert'] },
                        points: { type: 'integer', example: 1250 },
                        ecoPoints: { type: 'integer', example: 100 },
                        badges: { type: 'array', items: { type: 'object' } },
                        location: { type: 'string', example: 'India' },
                        soilType: { type: 'string', example: 'Alluvial Soil' },
                        farmSize: { type: 'string', example: '5 acres' },
                        onboardingComplete: { type: 'boolean', example: false },
                        avatar: { type: 'string', example: 'https://example.com/avatar.png' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Login successful.' },
                        user: { $ref: '#/components/schemas/User' },
                        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                        refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Error message' }
                    }
                }
            }
        },
        paths: {
            '/api/auth/register': {
                post: {
                    tags: ['Authentication'],
                    summary: 'Register a new user',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'password'],
                                    properties: {
                                        name: { type: 'string', example: 'John Farmer' },
                                        email: { type: 'string', example: 'john@example.com' },
                                        password: { type: 'string', example: 'securePassword123' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '201': {
                            description: 'Registration successful',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } }
                        },
                        '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                        '409': { description: 'User already exists', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                    }
                }
            },
            '/api/auth/login': {
                post: {
                    tags: ['Authentication'],
                    summary: 'Login with email and password',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'password'],
                                    properties: {
                                        email: { type: 'string', example: 'john@example.com' },
                                        password: { type: 'string', example: 'securePassword123' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': {
                            description: 'Login successful',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } }
                        },
                        '401': { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                    }
                }
            },
            '/api/auth/google': {
                post: {
                    tags: ['Authentication'],
                    summary: 'Google OAuth login (demo)',
                    responses: {
                        '200': {
                            description: 'Google auth successful',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } }
                        }
                    }
                }
            },
            '/api/auth/refresh': {
                post: {
                    tags: ['Authentication'],
                    summary: 'Refresh access token',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['refreshToken'],
                                    properties: {
                                        refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': {
                            description: 'Token refreshed',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean' },
                                            accessToken: { type: 'string' },
                                            refreshToken: { type: 'string' }
                                        }
                                    }
                                }
                            }
                        },
                        '401': { description: 'Invalid refresh token' }
                    }
                }
            },
            '/api/auth/me': {
                get: {
                    tags: ['User'],
                    summary: 'Get current user profile',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        '200': {
                            description: 'User profile',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean' },
                                            user: { $ref: '#/components/schemas/User' }
                                        }
                                    }
                                }
                            }
                        },
                        '401': { description: 'Unauthorized' }
                    }
                }
            },
            '/api/auth/profile': {
                put: {
                    tags: ['User'],
                    summary: 'Update user profile',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string' },
                                        phone: { type: 'string' },
                                        farmSize: { type: 'string' },
                                        location: { type: 'string' },
                                        onboardingComplete: { type: 'boolean' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': { description: 'Profile updated' },
                        '401': { description: 'Unauthorized' }
                    }
                }
            },
            '/api/auth/logout': {
                post: {
                    tags: ['Authentication'],
                    summary: 'Logout user',
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        refreshToken: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': { description: 'Logged out successfully' }
                    }
                }
            }
        }
    },
    apis: []
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
