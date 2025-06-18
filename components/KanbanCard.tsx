
import React from 'react';
import { KanbanTask, KanbanStage } from '../types';
import { KANBAN_STAGES_ORDER } from '../constants';
import { useAppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { PencilIcon, TrashIcon, PlayIcon } from './icons/MiniIcons';

interface KanbanCardProps {
  task: KanbanTask;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ task }) => {
  const { moveTask, deleteTask } = useAppContext();
  const navigate = useNavigate();

  const handleStageChange = (newStage: KanbanStage) => {
    moveTask(task.id, newStage);
  };

  const handleEdit = () => {
    if (task.stage === KanbanStage.SCRIPTING || task.stage === KanbanStage.PLANNING || task.stage === KanbanStage.IDEA) {
      navigate(`/planning/${task.id}`);
    } else if (task.stage === KanbanStage.PRODUCTION) {
      navigate(`/production/${task.id}`);
    } else {
      // For completed or other stages, maybe a view-only mode or back to planning
      navigate(`/planning/${task.id}`);
    }
  };
  
  const handleGoToProduction = () => {
    navigate(`/production/${task.id}`);
  };

  return (
    <div className="bg-white p-3 rounded-md shadow-sm hover:shadow-lg transition-shadow duration-150 border border-slate-300">
      <h4 className="font-medium text-slate-800 mb-2 break-all">{task.title}</h4>
      <div className="text-xs text-slate-600 mb-3">ID: {task.id}</div> {/* Updated text color */}
      
      <div className="mb-3">
        <label htmlFor={`stage-select-${task.id}`} className="block text-xs font-medium text-slate-700 mb-1">상태 변경:</label> {/* Updated text color */}
        <select
          id={`stage-select-${task.id}`}
          value={task.stage}
          onChange={(e) => handleStageChange(e.target.value as KanbanStage)}
          className="w-full p-1.5 border border-slate-300 rounded-md text-xs text-slate-700 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
        >
          {KANBAN_STAGES_ORDER.map(stage => (
            <option key={stage} value={stage}>{stage}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-between items-center space-x-1">
        <button
          onClick={handleEdit}
          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
          title="기획/수정"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
        {task.stage === KanbanStage.SCRIPTING && (
           <button
            onClick={handleGoToProduction}
            className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
            title="영상 제작으로 이동"
          >
            <PlayIcon className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => { if (window.confirm(`'${task.title}' 아이디어를 삭제하시겠습니까?`)) deleteTask(task.id)}}
          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
          title="삭제"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default KanbanCard;