import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { KanbanTask, KanbanStage, GoogleSearchGroundingChunk, GeminiModel } from '../types';
import { MASTER_PROMPT_TEMPLATE, AVAILABLE_TEXT_MODELS } from '../constants';
import { geminiService } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { SparklesIcon, ArrowPathIcon } from '../components/icons/MiniIcons';

const VIDEO_DURATION_OPTIONS = [1, 3, 5, 10, 20, 30, 60];

const ContentPlanningPage: React.FC = () => {
  const {
    selectedChannel,
    addTask,
    updateTask,
    getTaskById,
    isLoading,
    setIsLoading,
    error,
    setError,
    moveTask,
    apiKeyStatus
  } = useAppContext();
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  const [currentTask, setCurrentTask] = useState<Partial<KanbanTask>>({
    title: '', // Core Topic
    channelTheme: selectedChannel.defaultTheme,
    targetAudience: selectedChannel.defaultAudience,
    toneAndManner: selectedChannel.defaultTone,
    selectedModel: selectedChannel.preferredModel || AVAILABLE_TEXT_MODELS[0],
    hookTitle: '',
    hookThumbnailText: '',
    hookOpeningMentions: '',
    nextVideoTeaser: '',
    generatedMasterPrompt: '',
    generatedScript: '',
    videoDuration: 5, // 기본값 5분
  });
  const [useGoogleSearch, setUseGoogleSearch] = useState(false);
  const [groundingChunks, setGroundingChunks] = useState<GoogleSearchGroundingChunk[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState<string>('');

  useEffect(() => {
    if (taskId) {
      const task = getTaskById(taskId);
      if (task) {
        setCurrentTask({
          ...task,
          selectedModel: task.selectedModel || selectedChannel.preferredModel || AVAILABLE_TEXT_MODELS[0]
        });
      } else {
        setError("작업을 찾을 수 없습니다. 대시보드로 리디렉션합니다.");
        navigate('/dashboard');
      }
    } else {
      // New task mode, prefill from selected channel and set default model
      setCurrentTask(prev => ({
        ...prev,
        title: '',
        channelTheme: selectedChannel.defaultTheme,
        targetAudience: selectedChannel.defaultAudience,
        toneAndManner: selectedChannel.defaultTone,
        selectedModel: selectedChannel.preferredModel || AVAILABLE_TEXT_MODELS[0],
        hookTitle: '',
        hookThumbnailText: '',
        hookOpeningMentions: '',
        nextVideoTeaser: '',
        generatedMasterPrompt: '',
        generatedScript: '',
      }));
    }
  }, [taskId, getTaskById, selectedChannel, navigate, setError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentTask(prev => ({
      ...prev,
      [name]: name === 'videoDuration' ? Number(value) : value
    }));
  };

  const generateMasterPrompt = useCallback(() => {
    if (!currentTask.title) {
      setError("핵심 주제를 입력해주세요.");
      return;
    }
    const durationText = currentTask.videoDuration
      ? `이 스크립트는 ${currentTask.videoDuration}분 분량의 영상에 맞게 작성해 주세요. `
      : '';
    const prompt = durationText + MASTER_PROMPT_TEMPLATE
      .replace('{channelTheme}', currentTask.channelTheme || selectedChannel.defaultTheme)
      .replace('{targetAudience}', currentTask.targetAudience || selectedChannel.defaultAudience)
      .replace('{coreTopic}', currentTask.title || '미정')
      .replace('{hookOpeningMentions}', currentTask.hookOpeningMentions || '흥미로운 사실')
      .replace('{nextVideoTeaser}', currentTask.nextVideoTeaser || '다음 영상의 주제')
      .replace('{toneAndManner}', currentTask.toneAndManner || selectedChannel.defaultTone);
    setCurrentTask(prev => ({ ...prev, generatedMasterPrompt: prompt }));
    setError(null);
  }, [currentTask, selectedChannel, setError]);

  const handleGenerateScript = async () => {
    if (!currentTask.generatedMasterPrompt) {
      setError("마스터 프롬프트를 먼저 생성해주세요.");
      return;
    }
    if (!currentTask.selectedModel) {
      setError("AI 모델을 선택해주세요.");
      return;
    }
    if (apiKeyStatus !== "API 키가 환경변수에 설정됨") {
      setError("API 키가 설정되지 않았습니다. 스크립트를 생성할 수 없습니다.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGroundingChunks([]);

    try {
      const { text, groundingMetadata } = await geminiService.generateContent(
        currentTask.generatedMasterPrompt,
        currentTask.selectedModel,
        useGoogleSearch
      );
      setCurrentTask(prev => ({ ...prev, generatedScript: text }));
      if (useGoogleSearch && groundingMetadata?.groundingChunks) {
        setGroundingChunks(groundingMetadata.groundingChunks as GoogleSearchGroundingChunk[]);
      }
    } catch (err: any) {
      setError(`스크립트 생성 오류: ${err.message}`);
      setCurrentTask(prev => ({ ...prev, generatedScript: '' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTask = async () => {
    if (!currentTask.title?.trim()) {
      setError("핵심 주제(제목)는 필수입니다.");
      return;
    }
    setSaveStatus('saving');
    setSaveMessage('');
    try {
      const taskToSave: KanbanTask = {
        id: taskId || `task-${Date.now()}`,
        stage: currentTask.stage || KanbanStage.PLANNING,
        channelId: selectedChannel.id,
        selectedModel: currentTask.selectedModel || selectedChannel.preferredModel || AVAILABLE_TEXT_MODELS[0],
        ...currentTask,
        title: currentTask.title.trim(),
      };
      if (taskId) {
        await updateTask(taskToSave);
      } else {
        await addTask(taskToSave);
      }
      if (taskToSave.generatedScript && taskToSave.stage === KanbanStage.PLANNING) {
        await moveTask(taskToSave.id, KanbanStage.SCRIPTING);
      }
      setSaveStatus('success');
      setSaveMessage('변경사항이 저장되었습니다!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200); // 1.2초 후 이동
    } catch (e) {
      setSaveStatus('error');
      setSaveMessage('저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  const formSectionStyle = "bg-white p-6 rounded-lg shadow mb-6";
  const labelStyle = "block text-sm font-medium text-slate-700 mb-1";
  const inputBaseStyle = "w-full p-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 placeholder-slate-500"; // Updated placeholder color
  const inputStyle = `${inputBaseStyle}`;
  const textareaStyle = `${inputBaseStyle} min-h-[100px]`;
  const selectStyle = `${inputBaseStyle} bg-white`;


  if (taskId && !getTaskById(taskId) && !isLoading && !error) {
    // If there's an error already (like "Task not found"), don't overwrite it.
    setError("선택한 작업을 찾을 수 없습니다. 대시보드로 돌아가세요.");
    return <div className="p-4 text-red-500">선택한 작업을 찾을 수 없습니다. 대시보드로 돌아가세요.</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">{taskId ? '콘텐츠 기획 수정' : '새 콘텐츠 기획'}</h2>

      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">{error}</div>}

      <div className={formSectionStyle}>
        <h3 className="text-xl font-semibold text-slate-700 mb-4">1. 기본 정보 설정</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className={labelStyle}>핵심 주제 (영상 제목 아이디어)</label>
            <input type="text" name="title" id="title" value={currentTask.title || ''} onChange={handleInputChange} className={inputStyle} placeholder="예: 엔비디아 액면분할, 지금 사도 될까?" />
          </div>
          <div>
            <label htmlFor="channelTheme" className={labelStyle}>채널 주제 (페르소나)</label>
            <input type="text" name="channelTheme" id="channelTheme" value={currentTask.channelTheme || ''} onChange={handleInputChange} className={inputStyle} placeholder="예: 20년 경력의 금융 애널리스트" />
          </div>
          <div>
            <label htmlFor="targetAudience" className={labelStyle}>타겟 시청자</label>
            <input type="text" name="targetAudience" id="targetAudience" value={currentTask.targetAudience || ''} onChange={handleInputChange} className={inputStyle} placeholder="예: 3040 직장인 투자자" />
          </div>
          <div>
            <label htmlFor="toneAndManner" className={labelStyle}>스타일 및 톤</label>
            <input type="text" name="toneAndManner" id="toneAndManner" value={currentTask.toneAndManner || ''} onChange={handleInputChange} className={inputStyle} placeholder="예: 권위 있지만 친절하게" />
          </div>
          <div>
            <label htmlFor="videoDuration" className={labelStyle}>영상 길이(분)</label>
            <select
              name="videoDuration"
              id="videoDuration"
              value={currentTask.videoDuration}
              onChange={handleInputChange}
              className={selectStyle}
            >
              {VIDEO_DURATION_OPTIONS.map(min => (
                <option key={min} value={min}>{min}분</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={formSectionStyle}>
        <h3 className="text-xl font-semibold text-slate-700 mb-4">2. 후킹 설계</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="hookOpeningMentions" className={labelStyle}>오프닝 후킹 멘트</label>
            <textarea name="hookOpeningMentions" id="hookOpeningMentions" value={currentTask.hookOpeningMentions || ''} onChange={handleInputChange} className={textareaStyle} placeholder="예: 여러분이 아는 액면분할은 착각입니다." />
          </div>
          <div>
            <label htmlFor="hookTitle" className={labelStyle}>썸네일용 제목 (선택)</label>
            <input type="text" name="hookTitle" id="hookTitle" value={currentTask.hookTitle || ''} onChange={handleInputChange} className={inputStyle} placeholder="예: 엔비디아 아직도 안샀다고요?" />
          </div>
          <div>
            <label htmlFor="hookThumbnailText" className={labelStyle}>썸네일 문구 (선택)</label>
            <input type="text" name="hookThumbnailText" id="hookThumbnailText" value={currentTask.hookThumbnailText || ''} onChange={handleInputChange} className={inputStyle} placeholder="예: 역대급 기회!" />
          </div>
          <div>
            <label htmlFor="nextVideoTeaser" className={labelStyle}>다음 영상 주제 예고</label>
            <input type="text" name="nextVideoTeaser" id="nextVideoTeaser" value={currentTask.nextVideoTeaser || ''} onChange={handleInputChange} className={inputStyle} placeholder="예: 테슬라의 다음 혁신 기술" />
          </div>
        </div>
      </div>

      <div className={formSectionStyle}>
        <h3 className="text-xl font-semibold text-slate-700 mb-4">참고: 분석 데이터 (시뮬레이션)</h3>
        <div className="space-y-3 p-3 bg-indigo-50 rounded-md">
          <h4 className="font-medium text-indigo-700">키워드 트렌드 (예: "{currentTask.title || '엔비디아'}")</h4>
          <p className="text-sm text-slate-600">최근 '{currentTask.title || '엔비디아'}' 관련 검색량 및 관심도가 급증하는 추세입니다. 특히 '액면분할', '실적 발표'와 같은 이벤트와 연관된 검색이 많습니다.</p>
          <h4 className="font-medium text-indigo-700 mt-2">경쟁 채널 벤치마킹 (예: "{currentTask.title || '엔비디아'}")</h4>
          <p className="text-sm text-slate-600">상위 노출 영상들은 다음과 같은 특징을 보입니다:</p>
          <ul className="list-disc list-inside text-sm text-slate-600 pl-4">
            <li>긴급성, 극단적 표현 사용 (예: "속보", "절대 사지 마세요")</li>
            <li>시청자에게 질문을 던지는 제목 (예: "...해도 될까?")</li>
            <li>붉은색/파란색 화살표, 유튜버의 표정을 활용한 썸네일</li>
            <li>통념을 깨는 도입부로 시작하는 스크립트 구조</li>
          </ul>
        </div>
      </div>

      <div className={formSectionStyle}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-slate-700">3. 마스터 프롬프트 생성</h3>
          <button
            onClick={generateMasterPrompt}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition duration-150"
            disabled={isLoading}
          >
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            프롬프트 생성/업데이트
          </button>
        </div>
        <textarea
          name="generatedMasterPrompt"
          value={currentTask.generatedMasterPrompt || ''}
          readOnly
          className={`${textareaStyle} bg-slate-50 min-h-[200px]`}
          placeholder="이곳에 생성된 마스터 프롬프트가 표시됩니다."
        />
      </div>

      <div className={formSectionStyle}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
          <h3 className="text-xl font-semibold text-slate-700">4. AI 스크립트 생성</h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="w-full sm:w-auto">
              <label htmlFor="selectedModel" className={`${labelStyle} sm:hidden`}>AI 모델 선택</label>
              <select
                name="selectedModel"
                id="selectedModel"
                value={currentTask.selectedModel || ''}
                onChange={handleInputChange}
                className={`${selectStyle} sm:min-w-[250px]`}
              >
                {AVAILABLE_TEXT_MODELS.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
            <label htmlFor="useGoogleSearch" className="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer pt-2 sm:pt-0">
              <input
                type="checkbox"
                id="useGoogleSearch"
                checked={useGoogleSearch}
                onChange={(e) => setUseGoogleSearch(e.target.checked)}
                className="form-checkbox h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
              />
              <span>Google 검색 활용 (최신 정보)</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleGenerateScript}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-150"
            disabled={isLoading || !currentTask.generatedMasterPrompt || apiKeyStatus !== "API 키가 환경변수에 설정됨" || !currentTask.selectedModel}
          >
            <SparklesIcon className="w-5 h-5 mr-2" />
            스크립트 생성 실행
          </button>
        </div>
        {apiKeyStatus !== "API 키가 환경변수에 설정됨" && (
          <p className="text-sm text-red-500 my-2">주의: API 키가 설정되지 않아 스크립트 생성이 비활성화되었습니다.</p>
        )}
        {isLoading && <div className="my-4"><LoadingSpinner text="AI가 스크립트를 생성 중입니다..." /></div>}
        <textarea
          name="generatedScript"
          value={currentTask.generatedScript || ''}
          onChange={handleInputChange}
          className={`${textareaStyle} bg-slate-50 min-h-[300px] mt-4`}
          placeholder="이곳에 AI가 생성한 스크립트 초안이 표시됩니다. 직접 수정할 수 있습니다."
        />
        {groundingChunks.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <h4 className="font-medium text-blue-700 mb-2">참고 자료 (Google 검색):</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {groundingChunks.map((chunk, index) => (
                chunk.web && chunk.web.uri && (
                  <li key={index}>
                    <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 hover:underline"> {/* Updated link color */}
                      {chunk.web.title || chunk.web.uri}
                    </a>
                  </li>
                )
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-8 mb-8 flex flex-col items-end space-y-2">
        {saveStatus === 'success' && (
          <div className="text-green-600 font-semibold mb-2">{saveMessage}</div>
        )}
        {saveStatus === 'error' && (
          <div className="text-red-600 font-semibold mb-2">{saveMessage}</div>
        )}
        <button
          onClick={handleSaveTask}
          className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-150 flex items-center ${saveStatus === 'saving' ? 'opacity-60 cursor-not-allowed' : ''}`}
          disabled={isLoading || saveStatus === 'saving'}
        >
          {saveStatus === 'saving' && (
            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          )}
          {taskId ? '변경사항 저장' : '기획 완료 및 저장'}
        </button>
      </div>
    </div>
  );
};

export default ContentPlanningPage;
