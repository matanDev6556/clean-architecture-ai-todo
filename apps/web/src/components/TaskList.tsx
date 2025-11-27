import { useState } from 'react';
import { Task, LLMResponse } from '../types';
import { Edit2, Trash2, Sparkles, Save, X, Clock } from 'lucide-react';
import './TaskList.css';

interface Props {
  tasks: Task[];
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onEnhance: (id: string) => Promise<void>;
}

export function TaskList({ tasks, onUpdate, onDelete, onEnhance }: Props) {
  if (tasks.length === 0) {
    return <div className="text-center text-gray p-8">No tasks yet. Add one above!</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onEnhance={onEnhance}
        />
      ))}
    </div>
  );
}

function TaskItem({ task, onUpdate, onDelete, onEnhance }: { task: Task } & Omit<Props, 'tasks'>) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editNotes, setEditNotes] = useState(task.notes || '');
  const [editEnhanced, setEditEnhanced] = useState(task.enhancedDescription || '');

  const handleEnhance = async () => {
    setIsEnhancing(true);
    try {
      await onEnhance(task.id);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Try to parse JSON for display, but fallback to string if invalid or user edited
  let enhancedData: LLMResponse | null = null;
  let enhancedTextDisplay = task.enhancedDescription;

  try {
    if (task.enhancedDescription) {
      enhancedData = JSON.parse(task.enhancedDescription);
    }
  } catch (e) {
    // Not JSON, treat as plain text
    enhancedData = null;
  }

  const handleSave = () => {
    const updates: Partial<Task> = {
      title: editTitle,
      notes: editNotes,
    };

    if (editEnhanced !== task.enhancedDescription) {
      updates.enhancedDescription = editEnhanced;
      updates.isAiGenerated = false; // User edited it
    }

    onUpdate(task.id, updates);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditNotes(task.notes || '');
    setEditEnhanced(task.enhancedDescription || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="card border-primary">
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="font-bold"
            placeholder="Task Title"
          />
          <textarea
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
            placeholder="Notes"
            rows={2}
          />
          
          <div>
            <label className="text-xs font-bold text-gray uppercase mb-1 block">Enhanced Description</label>
            <textarea
              value={editEnhanced}
              onChange={(e) => setEditEnhanced(e.target.value)}
              placeholder="Enhanced description..."
              rows={4}
              className="text-sm font-mono bg-gray-50"
            />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button className="secondary" onClick={handleCancel}>Cancel</button>
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card ${task.status === 'done' ? 'opacity-75' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3 flex-1">
          <input
            type="checkbox"
            checked={task.status === 'done'}
            onChange={(e) => onUpdate(task.id, { status: e.target.checked ? 'done' : 'open' })}
            style={{ width: '1.5rem', height: '1.5rem', margin: 0 }}
          />
          <div className="flex-1">
            <h3 className={`text-lg font-bold ${task.status === 'done' ? 'line-through text-gray' : ''}`}>
              {task.title}
            </h3>
            {task.notes && <p className="text-gray text-sm mt-1">{task.notes}</p>}
          </div>
        </div>
        <div className="flex gap-1 ml-4 items-start">
          <button 
            className="icon-btn text-gray hover:text-primary" 
            onClick={() => setIsEditing(true)}
            title="Edit Task"
          >
            <Edit2 size={18} />
          </button>
          
          {task.status !== 'done' && (
            <button 
              className="icon-btn text-gray hover:text-primary" 
              onClick={handleEnhance}
              title="Enhance with AI"
              disabled={isEnhancing}
            >
              {isEnhancing ? <Sparkles size={18} className="ai-loading" /> : <Sparkles size={18} />}
            </button>
          )}
          
          <button 
            className="icon-btn text-gray hover:text-danger" 
            onClick={() => onDelete(task.id)}
            title="Delete Task"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {task.enhancedDescription && (
        <div className="enhanced-box relative">
          {isEnhancing ? (
             <div className="ai-loading">
               <Sparkles size={24} />
             </div>
          ) : enhancedData ? (
            <>
              <div className="flex justify-between items-center mb-2 pr-20">
                <h4 className="text-sm font-bold uppercase tracking-wide m-0">AI Suggestions</h4>
                <span className="text-xs text-gray flex items-center gap-1">
                  <Clock size={12} /> {enhancedData.estimateHours}h
                </span>
              </div>
              <p className="text-sm mb-2 italic">{enhancedData.summary}</p>
              
              {enhancedData.steps.length > 0 && (
                <div className="mb-2">
                  <strong className="text-xs">Steps:</strong>
                  <ul className="text-sm mt-1">
                    {enhancedData.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {enhancedData.risks.length > 0 && (
                 <div>
                  <strong className="text-xs text-danger">Risks:</strong>
                  <ul className="text-sm mt-1 text-danger">
                    {enhancedData.risks.map((risk, i) => (
                      <li key={i}>{risk}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="mt-4">
               <h4 className="text-sm font-bold uppercase tracking-wide mb-2">Description</h4>
               <p className="text-sm whitespace-pre-wrap">{task.enhancedDescription}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
