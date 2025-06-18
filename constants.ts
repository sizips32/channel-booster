import { KanbanStage, Channel, GeminiModel } from './types';

export const KANBAN_STAGES_ORDER: KanbanStage[] = [
  KanbanStage.IDEA,
  KanbanStage.PLANNING,
  KanbanStage.SCRIPTING,
  KanbanStage.PRODUCTION,
  KanbanStage.COMPLETED,
];

export const MASTER_PROMPT_TEMPLATE = `
# AI 유튜브 스크립트 생성 마스터 프롬프트

## 1. 역할 부여 (Persona)
너는 {channelTheme} 이자, 유튜브 알고리즘과 시청자 심리를 완벽하게 이해하는 최고의 스크립트 작가야.

## 2. 목표 (Objective)
- 영상 길이: 8~10분
- 목표: 시청자가 영상을 끝까지 보게 만들고, '이 채널은 진짜 전문가구나'라고 느끼게 하여 구독 버튼을 누르게 만드는 것.

## 3. 타겟 시청자 (Target Audience)
- {targetAudience}

## 4. 영상의 핵심 주제 (Core Topic)
- {coreTopic}

## 5. 반드시 포함할 스크립트 구조 (Mandatory Structure)
아래 구조를 반드시 지켜서, 각 파트별로 나눠서 작성해 줘.

### [오프닝: 후킹 (첫 30초)]
- '{hookOpeningMentions}'와(과) 같이, 시청자의 통념을 깨거나, 충격적인 사실을 제시하거나, 강력한 질문을 던져서 시작해.
- 이 영상이 왜 당신에게 꼭 필요한지 1~2 문장으로 요약해 줘.

### [본론: 정보와 스토리텔링]
- **(구조화)**: 소주제 3~4개로 내용을 명확히 구분해 줘. 각 소주제는 '첫째', '둘째'와 같이 명확히 시작해.
- **(권위)**: '하버드 연구에 따르면', '실제 데이터에 따르면'과 같은 표현으로 신뢰도를 높여줘.
- **(쉬운 비유)**: 어려운 개념은 초등학생도 이해할 수 있는 쉬운 비유로 설명해 줘.
- **(긴장감 유지)**: 중간중간 '하지만 이게 끝이 아닙니다', '가장 중요한 것은 마지막에 나옵니다'와 같은 멘트를 넣어 이탈을 방지해 줘.

### [결론: 각인과 행동 촉구 (마지막 1분)]
- 영상 전체 내용을 한 문장으로 강력하게 요약해 줘.
- 시청자에게 생각할 거리를 던져줘. (예: "여러분이라면 지금 어떻게 하시겠습니까?")
- "다음 영상에서는 {nextVideoTeaser}(을)를 다룰 예정이니, 인생을 바꿀 정보를 놓치지 않으려면 구독과 알림 설정은 필수입니다." 와 같이 강력한 구독 유도 멘트를 포함해 줘.

## 6. 스타일 및 톤 (Style & Tone)
- {toneAndManner}
- 문장은 짧고 간결하게 작성해 줘.

---
자, 이제 위의 모든 규칙을 적용하여 스크립트 작성을 시작해.
`;

export const AVAILABLE_TEXT_MODELS: GeminiModel[] = [
  GeminiModel.GEMINI_2_5_FLASH_PREVIEW,
  // Add other models from GeminiModel enum as they become available
];

export const DEFAULT_CHANNELS: Channel[] = [
  {
    id: 'channel_A',
    name: '채널 A (일반 교양)',
    defaultTheme: '지식 큐레이터',
    defaultAudience: '새로운 것을 배우고 싶은 모든 사람',
    defaultTone: '명확하고 이해하기 쉽게',
    preferredModel: GeminiModel.GEMINI_2_5_FLASH_PREVIEW,
  },
  {
    id: 'channel_B',
    name: '채널 B (금융투자)',
    defaultTheme: '20년 경력의 금융 애널리스트',
    defaultAudience: '3040 직장인 투자자',
    defaultTone: '권위 있지만 친절하게',
    preferredModel: GeminiModel.GEMINI_2_5_FLASH_PREVIEW,
  },
  {
    id: 'channel_C',
    name: '채널 C (기술 트렌드)',
    defaultTheme: '미래 기술 예측가',
    defaultAudience: 'AI 기술에 막 입문한 개발자 및 기획자',
    defaultTone: '최신 정보를 빠르게 전달하며 인사이트를 제공',
    preferredModel: GeminiModel.GEMINI_2_5_FLASH_PREVIEW,
  },
];

export const GEMINI_MODEL_IMAGE = 'imagen-3.0-generate-002'; // Though not used in this iteration for generation