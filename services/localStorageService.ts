// services/localStorageService.ts
import { KanbanCard, KanbanTask } from '../types';

const STORAGE_KEY = 'kanbanCards';

// 카드 목록 저장 (에러 처리 추가)
export function saveCards(cards: KanbanCard[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch (error) {
    // 저장 실패 시 콘솔에 에러 출력
    console.error('카드 저장 실패:', error);
  }
}

// 카드 목록 불러오기 (에러 처리 추가)
export function loadCards(): KanbanCard[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    // 불러오기/파싱 실패 시 빈 배열 반환
    console.error('카드 불러오기 실패:', error);
    return [];
  }
}

// 카드 추가
export function addCard(card: KanbanCard) {
  const cards = loadCards();
  cards.push(card);
  saveCards(cards);
}

// 카드 삭제
export function removeCard(cardId: string) {
  const cards = loadCards().filter(card => card.id !== cardId);
  saveCards(cards);
}

// KanbanTask 목록 저장 (에러 처리 추가)
const TASKS_STORAGE_KEY = 'kanbanTasks';

export function saveTasks(tasks: KanbanTask[]) {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('작업(Task) 저장 실패:', error);
  }
}

// KanbanTask 목록 불러오기 (에러 처리 추가)
export function loadTasks(): KanbanTask[] {
  try {
    const data = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('작업(Task) 불러오기 실패:', error);
    return [];
  }
}
