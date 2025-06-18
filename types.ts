export enum KanbanStage {
  IDEA = '아이디어',
  PLANNING = '기획 중',
  SCRIPTING = '스크립트 작성 중',
  PRODUCTION = '영상 제작 중',
  COMPLETED = '업로드 완료',
}

export enum GeminiModel {
  GEMINI_2_5_FLASH_PREVIEW = 'gemini-2.5-flash-preview-04-17',
  // Add other text models here if they become available and are desired
  // e.g. GEMINI_PRO = 'gemini-pro', // Placeholder for older model, ensure compatibility if re-added
}

export interface KanbanTask {
  id: string;
  title: string; // This will be the Core Topic
  stage: KanbanStage;
  channelId: string; // To associate with a channel
  selectedModel?: GeminiModel; // Model selected for this specific task
  // Content Planning Data
  channelTheme?: string;
  targetAudience?: string;
  toneAndManner?: string;
  hookTitle?: string;
  hookThumbnailText?: string;
  hookOpeningMentions?: string;
  nextVideoTeaser?: string;
  generatedMasterPrompt?: string;
  generatedScript?: string;
  // (Simulated) Production Data
  videoClips?: { paragraph: string; clipIdea: string }[];
}

export interface Channel {
  id: string;
  name: string;
  defaultTheme: string;
  defaultAudience: string;
  defaultTone: string;
  preferredModel?: GeminiModel; // Default model for new tasks in this channel
}

export interface GoogleSearchGroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
  // Other types of chunks can exist, but we are interested in web for URLs
}

// KanbanBoard의 카드(간단 메모 등)에 사용되는 타입
export interface KanbanCard {
  id: string;
  title: string;
  description: string;
}
