import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskList } from './TaskList';
import { Task } from '../types';
import '@testing-library/jest-dom';

describe('TaskList', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    status: 'open',
    createdAt: new Date().toISOString(),
    enhancedDescription: '{"summary":"AI Summary","steps":[],"risks":[],"estimateHours":1}',
    isAiGenerated: true,
  };

  it('should switch to edit mode and save changes', () => {
    const onUpdate = vi.fn();
    render(<TaskList tasks={[mockTask]} onUpdate={onUpdate} onDelete={vi.fn()} onEnhance={vi.fn()} />);
    
    // Click Edit
    fireEvent.click(screen.getByTitle('Edit Task'));
    
    // Change Title
    const titleInput = screen.getByDisplayValue('Test Task');
    fireEvent.change(titleInput, { target: { value: 'Updated Task' } });
    
    // Change Enhanced Description
    const enhancedInput = screen.getByDisplayValue(mockTask.enhancedDescription!);
    fireEvent.change(enhancedInput, { target: { value: 'User Edited Description' } });
    
    // Save
    fireEvent.click(screen.getByText('Save'));
    
    expect(onUpdate).toHaveBeenCalledWith('1', expect.objectContaining({
      title: 'Updated Task',
      enhancedDescription: 'User Edited Description',
      isAiGenerated: false, // Should be false because description changed
    }));
  });
});
