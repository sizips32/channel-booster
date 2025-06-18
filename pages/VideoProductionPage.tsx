
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { KanbanTask } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlayIcon } from '../components/icons/MiniIcons';

const VideoProductionPage: React.FC = () => {
  const { getTaskById, updateTask, isLoading, setIsLoading, setError, moveTask, selectedChannel } = useAppContext();
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<KanbanTask | null>(null);
  const [simulatedClips, setSimulatedClips] = useState<{ paragraph: string, clipIdea: string, imageUrl: string }[]>([]);

  useEffect(() => {
    if (taskId) {
      const foundTask = getTaskById(taskId);
      if (foundTask) {
        setTask(foundTask);
        if (foundTask.generatedScript) {
          if (!foundTask.videoClips || foundTask.videoClips.length === 0) {
            const paragraphs = foundTask.generatedScript.split('\n\n').filter(p => p.trim() !== '');
            const clips = paragraphs.map((p, index) => ({
              paragraph: p.substring(0, 100) + (p.length > 100 ? '...' : ''), 
              clipIdea: `AI 추천: "${p.substring(0, 30).trim()}..." 관련 역동적인 영상 클립`,
              imageUrl: `https://picsum.photos/seed/${taskId}${index}/300/200` 
            }));
            setSimulatedClips(clips);
            updateTask({ ...foundTask, videoClips: clips.map(c => ({paragraph: c.paragraph, clipIdea: c.clipIdea})) }); // Save without imageUrl
          } else {
             setSimulatedClips(foundTask.videoClips.map((clip, index) => ({
                ...clip,
                imageUrl: `https://picsum.photos/seed/${taskId}${index}/300/200`
             })));
          }
        }
      } else {
        setError("작업을 찾을 수 없습니다.");
        navigate('/dashboard');
      }
    }
  }, [taskId, getTaskById, navigate, setError, updateTask]);

  const handleSimulateRendering = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`"${task?.title}" 영상 렌더링이 (시뮬레이션으로) 완료되었습니다!`);
      // Optionally move task to 'Completed' or next stage if task exists
      if (task) {
          // You might want to move to a 'RENDERED' stage or 'COMPLETED'
          // For now, let's assume it implies the task is ready for the next step.
          // Example: moveTask(task.id, KanbanStage.COMPLETED);
      }
    }, 2000);
  };

  if (!task && !isLoading) { // if task is null and not loading, it means it wasn't found or error occurred
    return <div className="p-6 text-red-500">작업을 불러오는 중 오류가 발생했거나 작업을 찾을 수 없습니다. 대시보드로 돌아가세요.</div>;
  }
  if (!task && isLoading) { // still loading
     return <div className="p-6"><LoadingSpinner text="작업 로딩 중..." /></div>;
  }
  // This check is primarily for TypeScript to know task is not null beyond this point.
  if (!task) return null; 


  return (
    <div className="container mx-auto max-w-6xl p-6">
      <h2 className="text-3xl font-bold text-slate-800 mb-2">영상 제작 (시뮬레이션)</h2>
      <p className="text-lg text-slate-600 mb-6">주제: {task.title}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow h-[70vh] overflow-y-auto">
          <h3 className="text-xl font-semibold text-slate-700 mb-4">스크립트</h3>
          <pre className="whitespace-pre-wrap text-sm text-slate-700">{task.generatedScript || "스크립트가 없습니다."}</pre>
        </div>

        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow h-[70vh] overflow-y-auto">
          <h3 className="text-xl font-semibold text-slate-700 mb-4">AI 영상 소스 (Veo 3 시뮬레이션)</h3>
          {simulatedClips.length > 0 ? (
            <div className="space-y-4">
              {simulatedClips.map((clip, index) => (
                <div key={index} className="border border-slate-200 p-3 rounded-md bg-slate-50">
                  <p className="text-xs text-slate-500 mb-1">문단 {index + 1} 미리보기: "{clip.paragraph}"</p>
                  <img src={clip.imageUrl} alt={`Simulated clip for paragraph ${index + 1}`} className="w-full h-auto rounded-md mb-2 aspect-video object-cover"/>
                  <p className="text-sm font-medium text-indigo-600">{clip.clipIdea}</p>
                  <button className="text-xs text-blue-500 hover:underline mt-1">다른 영상 생성 (시뮬)</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">스크립트를 기반으로 AI 영상 클립을 생성합니다.</p>
          )}
        </div>

        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow h-[70vh] flex flex-col">
          <h3 className="text-xl font-semibold text-slate-700 mb-4">(Filmora 시뮬레이션) 타임라인 & 편집</h3>
          <div className="flex-grow bg-slate-200 p-3 rounded-md overflow-y-auto space-y-2 mb-4">
            {simulatedClips.map((clip, index) => (
              <div key={index} className="bg-blue-100 p-2 rounded text-sm text-blue-700 flex items-center">
                <PlayIcon className="w-4 h-4 mr-2 text-blue-500"/>
                <span>클립 {index + 1}: {clip.paragraph.substring(0,20)}... (음성 더빙됨)</span>
              </div>
            ))}
            {simulatedClips.length === 0 && <p className="text-slate-500 text-sm">영상 클립을 타임라인에 추가하세요.</p>}
          </div>
          <div className="space-y-2 mb-4">
             <button className="w-full py-2 px-3 bg-slate-300 text-slate-700 rounded hover:bg-slate-400 text-sm">AI 보이스 변경 (시뮬)</button>
             <button className="w-full py-2 px-3 bg-slate-300 text-slate-700 rounded hover:bg-slate-400 text-sm">자막 스타일 변경 (시뮬)</button>
             <button className="w-full py-2 px-3 bg-slate-300 text-slate-700 rounded hover:bg-slate-400 text-sm">배경음악 추가 (시뮬)</button>
          </div>
          <button 
            onClick={handleSimulateRendering}
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition duration-150"
          >
            {isLoading ? <LoadingSpinner size="w-5 h-5" color="text-white" text="" /> : <PlayIcon className="w-5 h-5 mr-2" />}
            {isLoading ? "렌더링 중..." : "원클릭 렌더링 (시뮬)"}
          </button>
        </div>
      </div>
       <button 
          onClick={() => navigate('/dashboard')} 
          className="mt-8 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150"
        >
          대시보드로 돌아가기
        </button>
    </div>
  );
};

export default VideoProductionPage;