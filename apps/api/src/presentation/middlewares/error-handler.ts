import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { DomainError } from '@todo/core';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error for debugging
  console.error('Error:', {
    name: error.name,
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });

  // Zod validation errors
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid request data',
      details: error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message
      }))
    });
  }

  // Custom domain errors
  if (error instanceof DomainError) {
    const response: any = {
      error: error.name,
      message: error.message
    };
    
    if ('details' in error && error.details) {
      response.details = error.details;
    }
    
    return res.status(error.statusCode).json(response);
  }

  // Default to 500 server error
  return res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : error.message
  });
};
