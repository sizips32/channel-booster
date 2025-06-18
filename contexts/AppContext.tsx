
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { KanbanTask, KanbanStage, Channel, GeminiModel } from '../types';
import { DEFAULT_CHANNELS, AVAILABLE_TEXT_MODELS } from '../constants';

interface AppContextType {
  tasks: KanbanTask[];
  addTask: (task: KanbanTask) => void;
  updateTask: (updatedTask: KanbanTask) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, newStage: KanbanStage) => void;
  getTaskById: (taskId: string) => KanbanTask | undefined;
  channels: Channel[];
  selectedChannel: Channel;
  setSelectedChannel: (channel: Channel) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  apiKeyStatus: string; // e.g., "Not set", "Valid", "Invalid" - for display only
  setApiKeyStatus: (status: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<KanbanTask[]>(() => {
    const savedTasks = localStorage.getItem('kanbanTasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks) as KanbanTask[];
      // Ensure existing tasks have a default model if undefined
      return parsedTasks.map(task => ({
        ...task,
        selectedModel: task.selectedModel || DEFAULT_CHANNELS.find(c => c.id === task.channelId)?.preferredModel || AVAILABLE_TEXT_MODELS[0]
      }));
    }
    return [];
  });
  
  const [channels] = useState<Channel[]>(DEFAULT_CHANNELS);
  const [selectedChannel, setSelectedChannelState] = useState<Channel>(channels[1]); // Default to Channel B

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyStatus, setApiKeyStatus] = useState<string>(
    process.env.API_KEY ? "API 키가 환경변수에 설정됨" : "API 키가 설정되지 않음 (기능 제한)"
  );

  const saveTasksToLocalStorage = (currentTasks: KanbanTask[]) => {
    localStorage.setItem('kanbanTasks', JSON.stringify(currentTasks));
  };

  const addTask = useCallback((task: KanbanTask) => {
    const taskWithDefaults: KanbanTask = {
      ...task,
      selectedModel: task.selectedModel || selectedChannel.preferredModel || AVAILABLE_TEXT_MODELS[0],
    };
    setTasks(prevTasks => {
      const newTasks = [...prevTasks, taskWithDefaults];
      saveTasksToLocalStorage(newTasks);
      return newTasks;
    });
  }, [selectedChannel.preferredModel]);

  const updateTask = useCallback((updatedTask: KanbanTask) => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.map(task => task.id === updatedTask.id ? {
        ...updatedTask,
        selectedModel: updatedTask.selectedModel || selectedChannel.preferredModel || AVAILABLE_TEXT_MODELS[0]
      } : task);
      saveTasksToLocalStorage(newTasks);
      return newTasks;
    });
  }, [selectedChannel.preferredModel]);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.filter(task => task.id !== taskId);
      saveTasksToLocalStorage(newTasks);
      return newTasks;
    });
  }, []);
  
  const moveTask = useCallback((taskId: string, newStage: KanbanStage) => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.map(task =>
        task.id === taskId ? { ...task, stage: newStage } : task
      );
      saveTasksToLocalStorage(newTasks);
      return newTasks;
    });
  }, []);

  const getTaskById = useCallback((taskId: string) => {
    return tasks.find(task => task.id === taskId);
  }, [tasks]);

  const setSelectedChannel = (channel: Channel) => {
    setSelectedChannelState(channel);
  };

  return (
    <AppContext.Provider value={{ 
        tasks, addTask, updateTask, deleteTask, moveTask, getTaskById,
        channels, selectedChannel, setSelectedChannel,
        isLoading, setIsLoading, error, setError,
        apiKeyStatus, setApiKeyStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};