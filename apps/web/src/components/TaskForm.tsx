import React, { useState } from 'react';
import { CreateTaskDTO } from '../types';

interface Props {
  onSubmit: (dto: CreateTaskDTO) => Promise<void>;
}

export function TaskForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [autoEnhance, setAutoEnhance] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ title, notes, autoEnhance });
      setTitle('');
      setNotes('');
      setAutoEnhance(false);
    } catch (error) {
      console.error('Failed to submit task:', error);
      // Optional: set local error state if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2 className="text-xl font-bold mb-4">New Task</h2>
      <input
        type="text"
        name="title"
        id="title"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        name="notes"
        id="notes"
        placeholder="Add some notes..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
      />
      <div className="flex items-center justify-between">
        <label htmlFor="autoEnhance" className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="autoEnhance"
            id="autoEnhance"
            checked={autoEnhance}
            onChange={(e) => setAutoEnhance(e.target.checked)}
            style={{ width: 'auto', margin: 0 }}
          />
          <span className="text-sm">Enhance with AI</span>
        </label>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Task'}
        </button>
      </div>
    </form>
  );
}
