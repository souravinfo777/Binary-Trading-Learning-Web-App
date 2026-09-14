import { DailyChallengeRecord, DailyChallengeState, Scenario, StreakBadge } from "../types";
import { BUILTIN_SCENARIOS } from "../data/scenarios";
import { STREAK_BADGES } from "../data/dailyBadges";

const STORAGE_KEY = "otc_daily_challenge_state";

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDaysDifference(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

// Simple deterministic string hash
function stringToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Deterministically picks one scenario for today's date
export function getDailyScenarioForDate(dateStr: string): Scenario {
  const hash = stringToHash(dateStr);
  const index = hash % BUILTIN_SCENARIOS.length;
  return BUILTIN_SCENARIOS[index];
}

export function loadDailyChallengeState(): DailyChallengeState {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed: DailyChallengeState = JSON.parse(saved);
      // Validate streak expiry: if last completed was more than 1 day ago (not yesterday and not today), currentStreak is 0
      const today = getTodayDateString();
      if (parsed.lastCompletedDate) {
        const diff = getDaysDifference(parsed.lastCompletedDate, today);
        if (diff > 1 && parsed.lastCompletedDate !== today) {
          parsed.currentStreak = 0;
        }
      }
      return parsed;
    } catch (e) {
      console.warn("Failed to parse daily challenge state:", e);
    }
  }

  return {
    currentStreak: 0,
    bestStreak: 0,
    totalCompleted: 0,
    unlockedBadgeIds: [],
    history: [],
  };
}

export function saveDailyChallengeState(state: DailyChallengeState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function isDailyChallengeCompletedToday(state: DailyChallengeState): boolean {
  const today = getTodayDateString();
  return state.lastCompletedDate === today;
}

export function getTodayRecord(state: DailyChallengeState): DailyChallengeRecord | undefined {
  const today = getTodayDateString();
  return state.history.find((r) => r.date === today);
}

export function checkAndUnlockBadges(
  state: DailyChallengeState,
  latestRecord: DailyChallengeRecord
): { newlyUnlocked: StreakBadge[]; updatedState: DailyChallengeState } {
  const currentUnlocked = new Set(state.unlockedBadgeIds);
  const newlyUnlocked: StreakBadge[] = [];

  // Calculate recent consecutive wins in daily history
  let winStreak = 0;
  for (const item of state.history) {
    if (item.isWon) {
      winStreak++;
    } else {
      break;
    }
  }

  STREAK_BADGES.forEach((badge) => {
    if (currentUnlocked.has(badge.id)) return;

    let shouldUnlock = false;

    if (badge.category === "streak" && state.currentStreak >= badge.requirement) {
      shouldUnlock = true;
    } else if (badge.category === "grade") {
      if (badge.requirement === 90 && latestRecord.grade >= 90) {
        shouldUnlock = true;
      } else if (badge.requirement === 100 && latestRecord.grade === 100) {
        shouldUnlock = true;
      }
    } else if (badge.category === "win" && winStreak >= badge.requirement) {
      shouldUnlock = true;
    }

    if (shouldUnlock) {
      currentUnlocked.add(badge.id);
      newlyUnlocked.push(badge);
    }
  });

  const updatedState: DailyChallengeState = {
    ...state,
    unlockedBadgeIds: Array.from(currentUnlocked),
  };

  return { newlyUnlocked, updatedState };
}

export function recordDailyChallengeCompletion(
  currentState: DailyChallengeState,
  record: DailyChallengeRecord
): { updatedState: DailyChallengeState; newlyUnlocked: StreakBadge[] } {
  const today = getTodayDateString();
  
  let newCurrentStreak = currentState.currentStreak;
  
  if (currentState.lastCompletedDate) {
    if (currentState.lastCompletedDate === today) {
      // Already completed today, keep current streak
    } else {
      const diff = getDaysDifference(currentState.lastCompletedDate, today);
      if (diff === 1) {
        newCurrentStreak += 1;
      } else {
        newCurrentStreak = 1;
      }
    }
  } else {
    newCurrentStreak = 1;
  }

  const newBestStreak = Math.max(currentState.bestStreak, newCurrentStreak);
  const newTotalCompleted = currentState.totalCompleted + 1;

  // Filter out any previous attempt on the same day if re-taken
  const updatedHistory = [record, ...currentState.history.filter((h) => h.date !== today)];

  const interimState: DailyChallengeState = {
    ...currentState,
    currentStreak: newCurrentStreak,
    bestStreak: newBestStreak,
    totalCompleted: newTotalCompleted,
    lastCompletedDate: today,
    history: updatedHistory,
  };

  const { newlyUnlocked, updatedState } = checkAndUnlockBadges(interimState, record);
  saveDailyChallengeState(updatedState);

  return { updatedState, newlyUnlocked };
}
