import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskForm } from './TaskForm';
import '@testing-library/jest-dom';

describe('TaskForm', () => {
  it('should call onSubmit with title', () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<TaskForm onSubmit={onSubmit} />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    fireEvent.change(input, { target: { value: 'New Task' } });
    
    const button = screen.getByText('Add Task');
    fireEvent.click(button);
    
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ title: 'New Task' }));
  });
});
