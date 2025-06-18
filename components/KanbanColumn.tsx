
import React from 'react';
import { KanbanStage, KanbanTask } from '../types';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
  stage: KanbanStage;
  tasks: KanbanTask[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ stage, tasks }) => {
  return (
    <div className="bg-slate-200 rounded-lg p-4 shadow">
      <h3 className="text-lg font-semibold mb-4 text-slate-700 border-b border-slate-300 pb-2">{stage} ({tasks.length})</h3>
      <div className="space-y-3 min-h-[200px] max-h-[60vh] overflow-y-auto">
        {tasks.length === 0 && <p className="text-sm text-slate-600 italic">항목 없음</p>}
        {tasks.map(task => (
          <KanbanCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;