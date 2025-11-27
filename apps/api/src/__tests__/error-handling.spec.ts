import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../presentation/middlewares/error-handler';
import { NotFoundError, ValidationError, ServiceUnavailableError } from '@todo/core';
import { z } from 'zod';

describe('Error Handling Middleware', () => {
  let app: express.Application;

  beforeEach(() => {
    // Setup minimal app for each test
    app = express();
    app.use(express.json());
  });

  describe('Domain Errors', () => {
    it('should handle NotFoundError with 404 status', async () => {
      app.get('/test-404', (req: Request, res: Response, next: NextFunction) => {
        next(new NotFoundError('Task with id xyz not found'));
      });
      app.use(errorHandler);

      const response = await request(app).get('/test-404');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: 'NotFoundError',
        message: 'Task with id xyz not found'
      });
    });

    it('should handle ValidationError with 400 status and details', async () => {
      app.post('/test-validation', (req: Request, res: Response, next: NextFunction) => {
        next(new ValidationError('Invalid input', {
          field: 'title',
          issue: 'too long'
        }));
      });
      app.use(errorHandler);

      const response = await request(app).post('/test-validation');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'ValidationError',
        message: 'Invalid input',
        details: {
          field: 'title',
          issue: 'too long'
        }
      });
    });

    it('should handle ServiceUnavailableError with 503 status', async () => {
      app.post('/test-503', (req: Request, res: Response, next: NextFunction) => {
        next(new ServiceUnavailableError('AI service is temporarily unavailable'));
      });
      app.use(errorHandler);

      const response = await request(app).post('/test-503');

      expect(response.status).toBe(503);
      expect(response.body).toEqual({
        error: 'ServiceUnavailableError',
        message: 'AI service is temporarily unavailable'
      });
    });
  });

  describe('Zod Validation Errors', () => {
    it('should handle Zod validation errors with formatted details', async () => {
      const TestSchema = z.object({
        title: z.string().min(1, 'Title is required'),
        priority: z.number().min(1).max(3)
      });

      app.post('/test-zod', (req: Request, res: Response, next: NextFunction) => {
        try {
          TestSchema.parse(req.body);
          res.json({ success: true });
        } catch (error) {
          next(error);
        }
      });
      app.use(errorHandler);

      const response = await request(app)
        .post('/test-zod')
        .send({ title: '', priority: 5 }); // Invalid data

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation Error');
      expect(response.body.message).toBe('Invalid request data');
      expect(response.body.details).toBeInstanceOf(Array);
      expect(response.body.details.length).toBeGreaterThan(0);
      
      // Check that details are properly formatted
      const titleError = response.body.details.find((d: any) => d.field === 'title');
      expect(titleError).toBeDefined();
      expect(titleError.message).toBe('Title is required');
    });
  });

  describe('Unexpected Errors', () => {
    it('should handle unexpected errors with 500 status', async () => {
      // Save original NODE_ENV
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      app.get('/test-500', (req: Request, res: Response, next: NextFunction) => {
        next(new Error('Database connection failed'));
      });
      app.use(errorHandler);

      const response = await request(app).get('/test-500');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal Server Error');
      expect(response.body.message).toBe('An unexpected error occurred');
      
      // In production, shouldn't leak error details
      expect(response.body.stack).toBeUndefined();

      // Restore NODE_ENV
      process.env.NODE_ENV = originalEnv;
    });

    it('should show error message in development mode', async () => {
      // Save original NODE_ENV
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      app.get('/test-dev-error', (req: Request, res: Response, next: NextFunction) => {
        next(new Error('Detailed error message'));
      });
      app.use(errorHandler);

      const response = await request(app).get('/test-dev-error');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Detailed error message');

      // Restore NODE_ENV
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Error Logging', () => {
    it('should log errors to console', async () => {
      const { vi } = await import('vitest');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      app.get('/test-logging', (req: Request, res: Response, next: NextFunction) => {
        next(new Error('This should be logged'));
      });
      app.use(errorHandler);

      await request(app).get('/test-logging');

      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy.mock.calls[0][0]).toBe('Error:');
      
      consoleSpy.mockRestore();
    });
  });
});
