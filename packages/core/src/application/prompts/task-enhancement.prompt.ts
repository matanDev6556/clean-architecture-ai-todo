 const ENHANCE_TASK_PROMPT = (title: string, notes?: string) => `
You are an expert project manager and task optimizer.
Target Audience: Task management system users.
Goal: Create a structured JSON output for the task.

Task Details:
- Title: "${title}"
- Notes: "${notes || 'N/A'}"

Response Format (JSON Schema):
{
  "summary": "string",
  "steps": ["string"],
  "risks": ["string"],
  "estimateHours": number
}
`;

export default ENHANCE_TASK_PROMPT;
