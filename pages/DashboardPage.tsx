
import React from 'react';
import KanbanBoard from '../components/KanbanBoard';
import { useAppContext } from '../contexts/AppContext';

const DashboardPage: React.FC = () => {
  const { apiKeyStatus } = useAppContext();
  return (
    <div className="container mx-auto">
      {apiKeyStatus !== "API 키가 환경변수에 설정됨" && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p className="font-bold">API 키 경고</p>
          <p>{apiKeyStatus}. 스크립트 생성 기능이 작동하지 않을 수 있습니다. `process.env.API_KEY`를 설정해주세요.</p>
        </div>
      )}
      <KanbanBoard />
    </div>
  );
};

export default DashboardPage;
