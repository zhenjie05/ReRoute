import { User } from '@/models/user';
import { TripRoom, TripRoomMember, TripPreferences, TravelCompanions, TravelStyle, TravelPace } from '@/models/trip-room';
import { ItineraryDay, ItineraryItem } from '@/models/itinerary';
import { Message } from '@/models/chat';
import { DecisionCard, Vote } from '@/models/decision';
import { BudgetCategory, Expense, ExpenseSplit, ReceiptScan, Settlement, SplitType } from '@/models/budget';
import { AlbumPhoto } from '@/models/album';
import { Landmark } from '@/models/landmark';
import { SafetyAlert } from '@/models/safety';
import { CommunityPost, StarredTrip } from '@/models/discover';
import { LanguageLesson } from '@/models/language';
import { Badge } from '@/models/badge';
import { AppNotification } from '@/models/notification';

import {
  mockStandardUsers,
  currentDemoUser,
  mockStandardTripRooms,
  mockStandardTripMembers,
  mockStandardPreferences,
  mockStandardItineraryDays,
  mockStandardItineraryItems,
  mockStandardMessages,
  mockStandardDecisionCards,
  mockStandardVotes,
  mockStandardBudgetCategories,
  mockStandardExpenses,
  mockStandardExpenseSplits,
  mockStandardReceiptScans,
  mockStandardSettlements,
  mockStandardAlbumPhotos,
  mockStandardLandmarks,
  mockStandardSafetyAlerts,
  mockStandardCommunityPosts,
  mockStandardStarredTrips,
  mockStandardLanguageLessons,
  mockStandardBadges,
  mockStandardNotifications,
} from '@/shared/data/standard-mock-data';

// ========================================================================
// In-Memory Mutable State Store (Pretending Backend Database)
// ========================================================================

const state = {
  users: [...mockStandardUsers],
  tripRooms: [...mockStandardTripRooms],
  roomMembers: [...mockStandardTripMembers],
  tripPreferences: { ...mockStandardPreferences },
  itineraryDays: [...mockStandardItineraryDays],
  itineraryItems: [...mockStandardItineraryItems],
  messages: [...mockStandardMessages],
  decisionCards: [...mockStandardDecisionCards],
  votes: [...mockStandardVotes],
  budgetCategories: [...mockStandardBudgetCategories],
  expenses: [...mockStandardExpenses],
  expenseSplits: [...mockStandardExpenseSplits],
  receiptScans: [...mockStandardReceiptScans],
  settlements: [...mockStandardSettlements],
  albumPhotos: [...mockStandardAlbumPhotos],
  landmarks: [...mockStandardLandmarks],
  safetyAlerts: [...mockStandardSafetyAlerts],
  communityPosts: [...mockStandardCommunityPosts],
  starredTrips: [...mockStandardStarredTrips],
  languageLessons: [...mockStandardLanguageLessons],
  badges: [...mockStandardBadges],
  notifications: [...mockStandardNotifications],
};

/**
 * Simulates network latency for asynchronous backend API calls
 */
const simulateLatency = (ms: number = 80): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ========================================================================
// 1. User API Service
// ========================================================================
export const mockUserService = {
  async getCurrentUser(): Promise<User> {
    await simulateLatency();
    return { ...currentDemoUser };
  },

  async getUserById(id: string): Promise<User | null> {
    await simulateLatency();
    const user = state.users.find((u) => u.id === id);
    return user ? { ...user } : null;
  },

  async getAllUsers(): Promise<User[]> {
    await simulateLatency();
    return state.users.map((u) => ({ ...u }));
  },

  async updateUserProfile(id: string, updates: Partial<User>): Promise<User> {
    await simulateLatency();
    const index = state.users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error(`User with ID ${id} not found`);
    state.users[index] = { ...state.users[index], ...updates };
    return { ...state.users[index] };
  },
};

// ========================================================================
// 2. Trip Room API Service
// ========================================================================
export const mockTripRoomService = {
  async getTripRooms(userId?: string): Promise<TripRoom[]> {
    await simulateLatency();
    const uid = userId || currentDemoUser.id;
    const memberRoomIds = state.roomMembers
      .filter((m) => m.user_id === uid)
      .map((m) => m.room_id);
    return state.tripRooms
      .filter((r) => memberRoomIds.includes(r.id) || r.created_by === uid)
      .map((r) => ({ ...r }));
  },

  async getTripRoomById(roomId: string): Promise<TripRoom | null> {
    await simulateLatency();
    const room = state.tripRooms.find((r) => r.id === roomId);
    return room ? { ...room } : null;
  },

  async getActiveLiveRoom(userId?: string): Promise<TripRoom | null> {
    await simulateLatency();
    const uid = userId || currentDemoUser.id;
    const liveMember = state.roomMembers.find(
      (m) => m.user_id === uid && m.is_live_for_user === true
    );
    if (!liveMember) return null;
    const room = state.tripRooms.find((r) => r.id === liveMember.room_id);
    return room ? { ...room } : null;
  },

  async createTripRoom(room: Omit<TripRoom, 'id'>): Promise<TripRoom> {
    await simulateLatency();
    const newRoom: TripRoom = {
      ...room,
      id: `room-${Date.now()}`,
    };
    state.tripRooms.unshift(newRoom);
    state.roomMembers.push({
      room_id: newRoom.id,
      user_id: currentDemoUser.id,
      role: 'owner',
      location_sharing_opt_in: true,
      is_live_for_user: false,
      joined_at: new Date().toISOString(),
      user: {
        name: currentDemoUser.name,
        avatar: currentDemoUser.avatar,
      },
    });
    return { ...newRoom };
  },

  async updateTripRoom(roomId: string, updates: Partial<TripRoom>): Promise<TripRoom> {
    await simulateLatency();
    const idx = state.tripRooms.findIndex((r) => r.id === roomId);
    if (idx === -1) throw new Error(`Trip room ${roomId} not found`);
    state.tripRooms[idx] = { ...state.tripRooms[idx], ...updates };
    return { ...state.tripRooms[idx] };
  },

  async getRoomMembers(roomId: string): Promise<TripRoomMember[]> {
    await simulateLatency();
    return state.roomMembers
      .filter((m) => m.room_id === roomId)
      .map((m) => ({ ...m }));
  },

  async getRoomPreferences(roomId: string): Promise<TripPreferences | null> {
    await simulateLatency();
    const pref = state.tripPreferences[roomId];
    return pref ? { ...pref } : null;
  },

  async updateRoomPreferences(
    roomId: string,
    updates: Partial<TripPreferences>
  ): Promise<TripPreferences> {
    await simulateLatency();
    const existing = state.tripPreferences[roomId];
    const newPref: TripPreferences = {
      room_id: roomId,
      companions: updates.companions || existing?.companions || ('couple' as TravelCompanions),
      travel_style: updates.travel_style || existing?.travel_style || ('cultural' as TravelStyle),
      travel_pace: updates.travel_pace || existing?.travel_pace || ('moderate' as TravelPace),
      updated_at: new Date().toISOString(),
    };
    state.tripPreferences[roomId] = newPref;
    return { ...newPref };
  },
};

// ========================================================================
// 3. Itinerary API Service
// ========================================================================
export const mockItineraryService = {
  async getItineraryDays(roomId: string): Promise<ItineraryDay[]> {
    await simulateLatency();
    return state.itineraryDays
      .filter((d) => d.room_id === roomId)
      .sort((a, b) => a.day_number - b.day_number)
      .map((d) => ({ ...d }));
  },

  async getItineraryItems(dayId: string): Promise<ItineraryItem[]> {
    await simulateLatency();
    return state.itineraryItems
      .filter((item) => item.day_id === dayId)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => ({ ...item }));
  },

  async getAllItemsForRoom(roomId: string): Promise<ItineraryItem[]> {
    await simulateLatency();
    const dayIds = state.itineraryDays
      .filter((d) => d.room_id === roomId)
      .map((d) => d.id);
    return state.itineraryItems
      .filter((item) => dayIds.includes(item.day_id))
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => ({ ...item }));
  },

  async createItineraryItem(item: Omit<ItineraryItem, 'id'>): Promise<ItineraryItem> {
    await simulateLatency();
    const newItem: ItineraryItem = {
      ...item,
      id: `item-${Date.now()}`,
    };
    state.itineraryItems.push(newItem);
    return { ...newItem };
  },

  async updateItineraryItem(
    itemId: string,
    updates: Partial<ItineraryItem>
  ): Promise<ItineraryItem> {
    await simulateLatency();
    const idx = state.itineraryItems.findIndex((i) => i.id === itemId);
    if (idx === -1) throw new Error(`Itinerary item ${itemId} not found`);
    state.itineraryItems[idx] = { ...state.itineraryItems[idx], ...updates };
    return { ...state.itineraryItems[idx] };
  },

  async deleteItineraryItem(itemId: string): Promise<boolean> {
    await simulateLatency();
    const idx = state.itineraryItems.findIndex((i) => i.id === itemId);
    if (idx === -1) return false;
    state.itineraryItems.splice(idx, 1);
    return true;
  },

  async reorderItineraryItems(dayId: string, itemIds: string[]): Promise<ItineraryItem[]> {
    await simulateLatency();
    itemIds.forEach((id, index) => {
      const item = state.itineraryItems.find((i) => i.id === id && i.day_id === dayId);
      if (item) item.sort_order = index + 1;
    });
    return state.itineraryItems
      .filter((i) => i.day_id === dayId)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((i) => ({ ...i }));
  },
};

// ========================================================================
// 4. Chat & Decisions API Service
// ========================================================================
export const mockChatDecisionService = {
  async getMessages(roomId: string): Promise<Message[]> {
    await simulateLatency();
    return state.messages
      .filter((m) => m.room_id === roomId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((m) => ({ ...m }));
  },

  async sendMessage(
    roomId: string,
    message: Omit<Message, 'id' | 'created_at'>
  ): Promise<Message> {
    await simulateLatency();
    const newMsg: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      room_id: roomId,
      created_at: new Date().toISOString(),
    };
    state.messages.push(newMsg);
    return { ...newMsg };
  },

  async getDecisionCards(roomId: string): Promise<DecisionCard[]> {
    await simulateLatency();
    return state.decisionCards
      .filter((d) => d.room_id === roomId)
      .map((d) => ({
        ...d,
        options: d.options.map((opt) => ({
          ...opt,
          votes_count: state.votes.filter(
            (v) => v.decision_card_id === d.id && v.chosen_option === opt.id
          ).length,
        })),
      }));
  },

  async getDecisionCardById(cardId: string): Promise<DecisionCard | null> {
    await simulateLatency();
    const card = state.decisionCards.find((d) => d.id === cardId);
    if (!card) return null;
    return {
      ...card,
      options: card.options.map((opt) => ({
        ...opt,
        votes_count: state.votes.filter(
          (v) => v.decision_card_id === card.id && v.chosen_option === opt.id
        ).length,
      })),
    };
  },

  async castVote(cardId: string, userId: string, chosenOptionId: string): Promise<Vote> {
    await simulateLatency();
    const existingIdx = state.votes.findIndex(
      (v) => v.decision_card_id === cardId && v.user_id === userId
    );
    if (existingIdx >= 0) {
      state.votes[existingIdx].chosen_option = chosenOptionId;
      state.votes[existingIdx].created_at = new Date().toISOString();
      return { ...state.votes[existingIdx] };
    }
    const newVote: Vote = {
      id: `v-${Date.now()}`,
      decision_card_id: cardId,
      user_id: userId,
      chosen_option: chosenOptionId,
      created_at: new Date().toISOString(),
    };
    state.votes.push(newVote);
    return { ...newVote };
  },
};

// ========================================================================
// 5. Budget & Settlement API Service
// ========================================================================
export const mockBudgetService = {
  async getCategories(roomId: string): Promise<BudgetCategory[]> {
    await simulateLatency();
    return state.budgetCategories
      .filter((c) => c.room_id === roomId)
      .map((c) => ({ ...c }));
  },

  async getExpenses(roomId: string): Promise<Expense[]> {
    await simulateLatency();
    return state.expenses
      .filter((e) => e.room_id === roomId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map((e) => ({ ...e }));
  },

  async createExpense(
    expense: Omit<Expense, 'id' | 'created_at'>,
    splits?: {
      user_id: string;
      split_type: SplitType;
      share_value: number;
      amount_owed: number;
      user_name?: string;
    }[]
  ): Promise<Expense> {
    await simulateLatency();
    const newExpense: Expense = {
      ...expense,
      id: `exp-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    state.expenses.unshift(newExpense);
    if (splits && splits.length > 0) {
      const generatedSplits: ExpenseSplit[] = splits.map((s, idx) => ({
        id: `sp-${Date.now()}-${idx}`,
        expense_id: newExpense.id,
        user_id: s.user_id,
        split_type: s.split_type,
        share_value: s.share_value,
        amount_owed: s.amount_owed,
        user_name: s.user_name,
      }));
      newExpense.splits = generatedSplits;
      state.expenseSplits.push(...generatedSplits);
    }
    return { ...newExpense };
  },

  async getExpenseSplits(expenseId: string): Promise<ExpenseSplit[]> {
    await simulateLatency();
    return state.expenseSplits
      .filter((s) => s.expense_id === expenseId)
      .map((s) => ({ ...s }));
  },

  async getReceiptScans(roomId: string): Promise<ReceiptScan[]> {
    await simulateLatency();
    return state.receiptScans
      .filter((r) => !r.expense_id || state.expenses.some((e) => e.id === r.expense_id && e.room_id === roomId))
      .map((r) => ({ ...r }));
  },

  async getSettlements(roomId: string): Promise<Settlement[]> {
    await simulateLatency();
    return state.settlements
      .filter((s) => s.room_id === roomId)
      .map((s) => ({ ...s }));
  },

  async createSettlement(settlement: Omit<Settlement, 'id'>): Promise<Settlement> {
    await simulateLatency();
    const newSettlement: Settlement = {
      ...settlement,
      id: `set-${Date.now()}`,
    };
    state.settlements.push(newSettlement);
    return { ...newSettlement };
  },

  async updateSettlementStatus(
    settlementId: string,
    settledDate: string
  ): Promise<Settlement> {
    await simulateLatency();
    const idx = state.settlements.findIndex((s) => s.id === settlementId);
    if (idx === -1) throw new Error(`Settlement ${settlementId} not found`);
    state.settlements[idx] = {
      ...state.settlements[idx],
      settled_at: settledDate,
    };
    return { ...state.settlements[idx] };
  },
};

// ========================================================================
// 6. Album & Photos API Service
// ========================================================================
export const mockAlbumService = {
  async getAlbumPhotos(roomId: string): Promise<AlbumPhoto[]> {
    await simulateLatency();
    return state.albumPhotos
      .filter((p) => p.room_id === roomId)
      .sort((a, b) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime())
      .map((p) => ({ ...p }));
  },

  async uploadPhoto(photo: Omit<AlbumPhoto, 'id'>): Promise<AlbumPhoto> {
    await simulateLatency();
    const newPhoto: AlbumPhoto = {
      ...photo,
      id: `photo-${Date.now()}`,
      taken_at: photo.taken_at || new Date().toISOString(),
    };
    state.albumPhotos.unshift(newPhoto);
    return { ...newPhoto };
  },

  async deletePhoto(photoId: string): Promise<boolean> {
    await simulateLatency();
    const idx = state.albumPhotos.findIndex((p) => p.id === photoId);
    if (idx === -1) return false;
    state.albumPhotos.splice(idx, 1);
    return true;
  },
};

// ========================================================================
// 7. Discover & Community Feed API Service
// ========================================================================
export const mockDiscoverService = {
  async getCommunityPosts(options?: {
    destination?: string;
    type?: string;
  }): Promise<CommunityPost[]> {
    await simulateLatency();
    let posts = [...state.communityPosts];
    if (options?.destination) {
      posts = posts.filter((p) =>
        p.destination.toLowerCase().includes(options.destination!.toLowerCase())
      );
    }
    if (options?.type) {
      posts = posts.filter((p) => p.type === options.type);
    }
    return posts.map((p) => ({ ...p }));
  },

  async getCommunityPostById(postId: string): Promise<CommunityPost | null> {
    await simulateLatency();
    const post = state.communityPosts.find((p) => p.id === postId);
    return post ? { ...post } : null;
  },

  async toggleStarPost(postId: string, userId: string = currentDemoUser.id): Promise<boolean> {
    await simulateLatency();
    const post = state.communityPosts.find((p) => p.id === postId);
    if (!post) return false;

    const starIdx = state.starredTrips.findIndex(
      (s) => s.post_id === postId && s.user_id === userId
    );
    if (starIdx >= 0) {
      state.starredTrips.splice(starIdx, 1);
      post.stars_count = Math.max(0, post.stars_count - 1);
      post.is_starred = false;
      return false;
    } else {
      state.starredTrips.push({
        user_id: userId,
        post_id: postId,
        starred_at: new Date().toISOString(),
      });
      post.stars_count += 1;
      post.is_starred = true;
      return true;
    }
  },

  async getStarredTrips(userId: string = currentDemoUser.id): Promise<StarredTrip[]> {
    await simulateLatency();
    return state.starredTrips
      .filter((s) => s.user_id === userId)
      .map((s) => ({ ...s }));
  },
};

// ========================================================================
// 8. Landmarks & 3D Assets API Service
// ========================================================================
export const mockLandmarkService = {
  async getLandmarks(destination?: string): Promise<Landmark[]> {
    await simulateLatency();
    if (destination) {
      return state.landmarks
        .filter((l) => l.destination.toLowerCase().includes(destination.toLowerCase()))
        .map((l) => ({ ...l }));
    }
    return state.landmarks.map((l) => ({ ...l }));
  },

  async getLandmarkById(landmarkId: string): Promise<Landmark | null> {
    await simulateLatency();
    const landmark = state.landmarks.find((l) => l.id === landmarkId);
    return landmark ? { ...landmark } : null;
  },
};

// ========================================================================
// 9. Safety Alerts & Emergency Directory API Service
// ========================================================================
export const mockSafetyService = {
  async getSafetyAlerts(destination?: string): Promise<SafetyAlert[]> {
    await simulateLatency();
    if (destination) {
      return state.safetyAlerts
        .filter((a) => a.destination.toLowerCase().includes(destination.toLowerCase()))
        .map((a) => ({ ...a }));
    }
    return state.safetyAlerts.map((a) => ({ ...a }));
  },

  async getEmergencyDirectory(country: string): Promise<{
    police: string;
    ambulance: string;
    fire: string;
    general: string;
  }> {
    await simulateLatency();
    const directory: Record<string, { police: string; ambulance: string; fire: string; general: string }> = {
      Japan: { police: '110', ambulance: '119', fire: '119', general: '110' },
      Switzerland: { police: '117', ambulance: '144', fire: '118', general: '112' },
      Indonesia: { police: '110', ambulance: '118', fire: '113', general: '112' },
    };
    return directory[country] || { police: '112', ambulance: '112', fire: '112', general: '112' };
  },
};

// ========================================================================
// 10. Language Lessons & Quizzes API Service
// ========================================================================
export const mockLanguageService = {
  async getLanguageLessons(destination?: string): Promise<LanguageLesson[]> {
    await simulateLatency();
    if (destination) {
      return state.languageLessons
        .filter((l) => l.destination.toLowerCase().includes(destination.toLowerCase()))
        .map((l) => ({ ...l }));
    }
    return state.languageLessons.map((l) => ({ ...l }));
  },

  async getLessonById(lessonId: string): Promise<LanguageLesson | null> {
    await simulateLatency();
    const lesson = state.languageLessons.find((l) => l.id === lessonId);
    return lesson ? { ...lesson } : null;
  },

  async completeLesson(
    lessonId: string,
    _score: number
  ): Promise<{ earnedXp: number; isCompleted: boolean }> {
    await simulateLatency();
    const lesson = state.languageLessons.find((l) => l.id === lessonId);
    if (!lesson) throw new Error(`Lesson ${lessonId} not found`);
    lesson.is_completed = true;
    return { earnedXp: lesson.xp_reward, isCompleted: true };
  },
};

// ========================================================================
// 11. Profile & Gamification Badges API Service
// ========================================================================
export const mockProfileBadgeService = {
  async getUserBadges(userId: string = currentDemoUser.id): Promise<Badge[]> {
    await simulateLatency();
    return state.badges
      .filter((b) => b.user_id === userId)
      .map((b) => ({ ...b }));
  },

  async getUnifiedProfile(userId: string = currentDemoUser.id): Promise<{
    user: User;
    pastTrips: TripRoom[];
    badges: Badge[];
    starredTrips: CommunityPost[];
  }> {
    await simulateLatency();
    const user = state.users.find((u) => u.id === userId) || currentDemoUser;
    const memberRoomIds = state.roomMembers
      .filter((m) => m.user_id === userId)
      .map((m) => m.room_id);
    const pastTrips = state.tripRooms
      .filter((r) => memberRoomIds.includes(r.id))
      .map((r) => ({ ...r }));
    const badges = state.badges
      .filter((b) => b.user_id === userId)
      .map((b) => ({ ...b }));
    const starredPostIds = state.starredTrips
      .filter((s) => s.user_id === userId)
      .map((s) => s.post_id);
    const starredTrips = state.communityPosts
      .filter((p) => starredPostIds.includes(p.id) || p.is_starred)
      .map((p) => ({ ...p, is_starred: true }));

    return {
      user: { ...user },
      pastTrips,
      badges,
      starredTrips,
    };
  },
};

// ========================================================================
// 12. Notification Center API Service
// ========================================================================
export const mockNotificationService = {
  async getNotifications(): Promise<AppNotification[]> {
    await simulateLatency();
    return state.notifications.map((n) => ({ ...n }));
  },

  async markAsRead(notificationId: string): Promise<boolean> {
    await simulateLatency();
    const notif = state.notifications.find((n) => n.id === notificationId);
    if (!notif) return false;
    notif.isRead = true;
    return true;
  },

  async markAllAsRead(): Promise<boolean> {
    await simulateLatency();
    state.notifications.forEach((n) => {
      n.isRead = true;
    });
    return true;
  },

  async clearNotification(notificationId: string): Promise<boolean> {
    await simulateLatency();
    const idx = state.notifications.findIndex((n) => n.id === notificationId);
    if (idx === -1) return false;
    state.notifications.splice(idx, 1);
    return true;
  },
};

// ========================================================================
// Unified Mock API Gateway Export
// ========================================================================
export const MockApiService = {
  user: mockUserService,
  tripRoom: mockTripRoomService,
  itinerary: mockItineraryService,
  chatDecision: mockChatDecisionService,
  budget: mockBudgetService,
  album: mockAlbumService,
  discover: mockDiscoverService,
  landmark: mockLandmarkService,
  safety: mockSafetyService,
  language: mockLanguageService,
  profileBadge: mockProfileBadgeService,
  notification: mockNotificationService,
};

export default MockApiService;
