import React, { useState, useEffect } from 'react';
import { KanbanStage, KanbanTask, KanbanCard } from '../types';
import { KANBAN_STAGES_ORDER } from '../constants';
import KanbanColumn from './KanbanColumn';
import { useAppContext } from '../contexts/AppContext';
import { PlusIcon } from './icons/MiniIcons';
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';
import { loadTasks, saveTasks, loadCards, addCard, removeCard } from '../services/localStorageService';

const KanbanBoard: React.FC = () => {
  const { tasks, addTask, selectedChannel } = useAppContext();
  const [showAddIdeaModal, setShowAddIdeaModal] = useState(false);
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const navigate = useNavigate();
  const [cards, setCards] = useState<KanbanCard[]>([]);

  useEffect(() => {
    setCards(loadCards());
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const handleAddIdea = () => {
    if (newIdeaTitle.trim()) {
      const newTask: KanbanTask = {
        id: `task-${Date.now()}`,
        title: newIdeaTitle.trim(),
        stage: KanbanStage.IDEA,
        channelId: selectedChannel.id,
        selectedModel: selectedChannel.preferredModel, // Ensure model is set
      };
      addTask(newTask);
      setNewIdeaTitle('');
      setShowAddIdeaModal(false);
      navigate(`/planning/${newTask.id}`); // Navigate to planning page for the new idea
      setCards(loadCards());
    }
  };

  const handleAddCard = () => {
    const newCard: KanbanCard = {
      id: Date.now().toString(),
      title: '새 카드',
      description: '설명',
    };
    addCard(newCard);
    setCards(loadCards());
  };

  const handleRemoveCard = (id: string) => {
    removeCard(id);
    setCards(loadCards());
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-700">콘텐츠 파이프라인 ({selectedChannel.name})</h2>
        <button
          onClick={() => setShowAddIdeaModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-150"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          새 아이디어 추가
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {KANBAN_STAGES_ORDER.map(stage => (
          <KanbanColumn
            key={stage}
            stage={stage}
            tasks={tasks.filter(task => task.stage === stage && task.channelId === selectedChannel.id)}
          />
        ))}
      </div>
      {showAddIdeaModal && (
        <Modal title="새 아이디어 추가" onClose={() => setShowAddIdeaModal(false)}>
          <div className="space-y-4">
            <input
              type="text"
              value={newIdeaTitle}
              onChange={(e) => setNewIdeaTitle(e.target.value)}
              placeholder="새 콘텐츠 아이디어 (핵심 주제)"
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 placeholder-slate-500" // Updated placeholder
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddIdeaModal(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300"
              >
                취소
              </button>
              <button
                onClick={handleAddIdea}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                추가 및 기획 시작
              </button>
            </div>
          </div>
        </Modal>
      )}
      <button onClick={handleAddCard}>카드 추가</button>
      <ul>
        {cards.map(card => (
          <li key={card.id}>
            <strong>{card.title}</strong> - {card.description}
            <button onClick={() => handleRemoveCard(card.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KanbanBoard;
