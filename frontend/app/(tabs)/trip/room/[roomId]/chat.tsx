import React, { useState, useRef, useCallback } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  mockMessages,
  mockDecisionCards,
  mockTripRooms,
  mockVotes,
} from '@/features/trip-room/data/mock-trip-room';
import {
  DecisionPollCard,
  SystemNoticePill,
  MascotMessageCard,
  MessageBubble,
  ArchivedBanner,
  MessageComposer,
  ProposeVoteSheet,
} from '@/features/trip-room/presentation/components';
import { Message } from '@/models/chat';
import { DecisionCard, DecisionTriggerType, Vote } from '@/models/decision';

/**
 * Discussion (Chat Room) tab — Screen 15 per SCREEN_SPEC.
 *
 * Renders the content *inside* the Discussion tab only.
 * Does NOT rebuild the Trip Room header, tab row, or stage indicator
 * (those live in the [roomId]/_layout.tsx shell).
 */
export default function TripChatScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { colors, spacing } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  // Resolve room and its stage
  const room = mockTripRooms.find((r) => r.id === roomId) || mockTripRooms[0];
  const isArchived = room.stage === 'archived';

  // Filter messages and cards for this room
  const [messages, setMessages] = useState<Message[]>(
    mockMessages.filter((m) => m.room_id === (roomId || room.id)),
  );
  const [decisionCards, setDecisionCards] = useState<DecisionCard[]>(
    mockDecisionCards.filter((c) => c.room_id === (roomId || room.id)),
  );
  const [votes, setVotes] = useState(
    mockVotes.filter((v) =>
      mockDecisionCards
        .filter((c) => c.room_id === (roomId || room.id))
        .some((c) => c.id === v.decision_card_id),
    ),
  );

  const [inputText, setInputText] = useState('');
  const [voteModalVisible, setVoteModalVisible] = useState(false);

  // Current user's vote for a given card
  const getUserVoteForCard = useCallback(
    (cardId: string): string | null => {
      const vote = votes.find(
        (v) => v.decision_card_id === cardId && v.user_id === (user?.id || 'demo-user-1'),
      );
      return vote?.chosen_option || null;
    },
    [votes, user],
  );

  // Send a text message
  const handleSendMessage = useCallback(() => {
    if (!inputText.trim() || isArchived) return;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      room_id: roomId || room.id,
      sender_id: user?.id || 'demo-user-1',
      sender_type: 'user',
      sender_name: user?.name || 'Alex Chen',
      sender_avatar: user?.avatar,
      text: inputText.trim(),
      type: 'text',
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [inputText, isArchived, roomId, room.id, user]);

  // Cast / update a vote
  const handleCastVote = useCallback(
    (cardId: string, optionId: string) => {
      if (isArchived) return;
      const userId = user?.id || 'demo-user-1';
      const existingVote = votes.find(
        (v) => v.decision_card_id === cardId && v.user_id === userId,
      );

      if (existingVote) {
        // Update existing vote
        const oldOption = existingVote.chosen_option;
        setVotes((prev) =>
          prev.map((v) =>
            v.id === existingVote.id ? { ...v, chosen_option: optionId } : v,
          ),
        );
        // Adjust counts
        setDecisionCards((prev) =>
          prev.map((card) => {
            if (card.id !== cardId) return card;
            return {
              ...card,
              options: card.options.map((opt) => {
                if (opt.id === oldOption) {
                  return { ...opt, votes_count: Math.max(0, (opt.votes_count || 0) - 1) };
                }
                if (opt.id === optionId) {
                  return { ...opt, votes_count: (opt.votes_count || 0) + 1 };
                }
                return opt;
              }),
            };
          }),
        );
      } else {
        // New vote
        setVotes((prev: Vote[]) => [
          ...prev,
          {
            id: `vote-${Date.now()}`,
            decision_card_id: cardId,
            user_id: userId,
            chosen_option: optionId,
            created_at: new Date().toISOString(),
          },
        ]);
        setDecisionCards((prev) =>
          prev.map((card) => {
            if (card.id !== cardId) return card;
            return {
              ...card,
              options: card.options.map((opt) =>
                opt.id === optionId
                  ? { ...opt, votes_count: (opt.votes_count || 0) + 1 }
                  : opt,
              ),
            };
          }),
        );
      }
    },
    [isArchived, votes, user],
  );

  // Publish a new vote from the Propose Vote sheet
  const handlePublishVote = useCallback(
    (data: {
      title: string;
      triggerType: DecisionTriggerType;
      options: string[];
      anonymous: boolean;
    }) => {
      if (isArchived) return;
      const newCard: DecisionCard = {
        id: `card-${Date.now()}`,
        room_id: roomId || room.id,
        trigger_type: data.triggerType,
        title: data.title,
        description: 'Custom group decision proposed by member.',
        options: data.options.map((label, i) => ({
          id: `opt-${Date.now()}-${i}`,
          label,
          votes_count: 0,
        })),
        status: 'active',
        anonymous: data.anonymous,
        created_at: new Date().toISOString(),
      };

      setDecisionCards((prev) => [...prev, newCard]);

      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        room_id: roomId || room.id,
        sender_id: user?.id || 'demo-user-1',
        sender_type: 'user',
        sender_name: user?.name || 'Alex Chen',
        sender_avatar: user?.avatar,
        text: `🗳️ Proposed a new vote: "${data.title}"`,
        type: 'decision_card',
        payload: { card_id: newCard.id },
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMsg]);
      setVoteModalVisible(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    },
    [isArchived, roomId, room.id, user],
  );

  // Navigate to Safety Alert Detail
  const handleSafetyAlertPress = useCallback(
    (alertId: string) => {
      router.push(`/(tabs)/home/safety-alert/${alertId}` as any);
    },
    [router],
  );

  // Navigate to Itinerary Day (thread chip deep-link)
  const handleThreadChipPress = useCallback(
    (itineraryDayId: string) => {
      router.push(
        `/(tabs)/trip/room/${roomId || room.id}/itinerary` as any,
      );
    },
    [router, roomId, room.id],
  );

  // Render a single feed item
  const renderFeedItem = (msg: Message) => {
    // System message → centered pill notice
    if (msg.sender_type === 'system' && msg.type !== 'decision_card') {
      return <SystemNoticePill key={msg.id} text={msg.text} />;
    }

    // Mascot message → distinct mascot card
    if (msg.sender_type === 'mascot') {
      return <MascotMessageCard key={msg.id} message={msg} />;
    }

    // Decision card message → inline poll card
    if (msg.type === 'decision_card' && msg.payload?.card_id) {
      const card = decisionCards.find((c) => c.id === msg.payload.card_id);
      if (!card) return null;

      return (
        <DecisionPollCard
          key={msg.id}
          card={card}
          onVote={handleCastVote}
          onSafetyAlertPress={handleSafetyAlertPress}
          isArchived={isArchived}
          userVoteOptionId={getUserVoteForCard(card.id)}
        />
      );
    }

    // Regular user message → bubble
    if (msg.sender_type === 'user') {
      const isMe = msg.sender_id === (user?.id || 'demo-user-1');
      return (
        <MessageBubble
          key={msg.id}
          message={msg}
          isOwnMessage={isMe}
          onThreadChipPress={handleThreadChipPress}
        />
      );
    }

    return null;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{
          paddingTop: spacing.md,
          paddingBottom: 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Archived State Banner */}
        {isArchived && <ArchivedBanner />}

        {/* Chronological message feed */}
        {messages.map(renderFeedItem)}
      </ScrollView>

      {/* Composer / Archived disabled state */}
      <MessageComposer
        isArchived={isArchived}
        inputText={inputText}
        onChangeText={setInputText}
        onSend={handleSendMessage}
        onProposeVote={() => setVoteModalVisible(true)}
      />

      {/* Propose Vote Modal Sheet (FR-2-6a) */}
      {!isArchived && (
        <ProposeVoteSheet
          visible={voteModalVisible}
          onClose={() => setVoteModalVisible(false)}
          onPublish={handlePublishVote}
        />
      )}
    </KeyboardAvoidingView>
  );
}
