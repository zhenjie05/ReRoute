import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Avatar, Card, Badge, Button, ModalSheet } from '@/shared/components';
import { mockMessages, mockDecisionCards } from '@/features/trip-room/data/mock-trip-room';
import { useAuth } from '@/lib/hooks/useAuth';

export default function TripChatScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { colors, typography, spacing, rounded } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState(mockMessages);
  const [inputText, setInputText] = useState('');
  const [decisionCards, setDecisionCards] = useState(mockDecisionCards);

  // Propose Vote Modal State (FR-2-6a)
  const [voteModalVisible, setVoteModalVisible] = useState(false);
  const [voteTitle, setVoteTitle] = useState('');
  const [voteOption1, setVoteOption1] = useState('');
  const [voteOption2, setVoteOption2] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      room_id: (roomId as string) || 'room-tokyo-2026',
      sender_id: user?.id || 'demo-user-1',
      sender_type: 'user' as const,
      sender_name: user?.name || 'Alex Chen',
      sender_avatar: user?.avatar,
      text: inputText.trim(),
      type: 'text' as const,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  const handleCastVote = (cardId: string, optionId: string) => {
    setDecisionCards((prev) =>
      prev.map((card) => {
        if (card.id === cardId) {
          return {
            ...card,
            options: card.options.map((opt) =>
              opt.id === optionId
                ? { ...opt, votes_count: (opt.votes_count || 0) + 1 }
                : opt
            ),
          };
        }
        return card;
      })
    );
  };

  const handlePublishVote = () => {
    if (!voteTitle.trim() || !voteOption1.trim() || !voteOption2.trim()) return;

    const newCard = {
      id: `card-${Date.now()}`,
      room_id: (roomId as string) || 'room-tokyo-2026',
      trigger_type: 'conflict' as const,
      title: voteTitle.trim(),
      description: 'Custom group decision proposed by member.',
      options: [
        { id: `opt-${Date.now()}-1`, label: voteOption1.trim(), votes_count: 0 },
        { id: `opt-${Date.now()}-2`, label: voteOption2.trim(), votes_count: 0 },
      ],
      status: 'active' as const,
      anonymous: isAnonymous,
      created_at: new Date().toISOString(),
    };

    setDecisionCards((prev) => [newCard, ...prev]);

    const newMsg = {
      id: `msg-${Date.now()}`,
      room_id: (roomId as string) || 'room-tokyo-2026',
      sender_id: user?.id || 'demo-user-1',
      sender_type: 'user' as const,
      sender_name: user?.name || 'Alex Chen',
      text: `🗳️ Proposed a new vote: "${voteTitle}"`,
      type: 'decision_card' as const,
      payload: { card_id: newCard.id },
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setVoteModalVisible(false);
    setVoteTitle('');
    setVoteOption1('');
    setVoteOption2('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        contentContainerStyle={{ padding: spacing.md, paddingBottom: 96 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Messages Stream */}
        {messages.map((msg) => {
          const isMe = msg.sender_id === user?.id;
          const isMascot = msg.sender_type === 'mascot';

          if (isMascot) {
            // Mascot Message Card (FR-2-7, FR-9-2)
            return (
              <Card
                key={msg.id}
                variant="season"
                style={{
                  marginVertical: spacing.xs,
                  borderLeftWidth: 4,
                  borderLeftColor: colors.season.main,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={{ fontSize: 18, marginRight: 6 }}>🦉</Text>
                  <Text style={[typography.labelSm, { color: colors.season.text, fontWeight: '800' }]}>
                    {msg.sender_name || 'Paku Mascot'}
                  </Text>
                  <Badge label="AI Assistant" variant="season" style={{ marginLeft: 6 }} />
                </View>
                <Text style={[typography.bodyMd, { color: colors.onSurface, lineHeight: 20 }]}>
                  {msg.text}
                </Text>
              </Card>
            );
          }

          if (msg.type === 'decision_card' && msg.payload?.card_id) {
            const card = decisionCards.find((c) => c.id === msg.payload.card_id);
            if (!card) return null;

            // In-Feed Decision Card (FR-2-6, FR-2-6a, FR-1-9)
            return (
              <Card
                key={msg.id}
                variant="outlined"
                style={{
                  marginVertical: spacing.sm,
                  backgroundColor: '#ffffff',
                  borderColor: card.trigger_type === 'safety_risk' ? colors.warning : colors.primary,
                  borderWidth: 2,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Badge
                    label={
                      card.trigger_type === 'safety_risk'
                        ? '⚠️ Safety Risk Decision'
                        : card.trigger_type === 'disruption'
                        ? '⚡ Disruption Vote'
                        : '🤝 Group Vote'
                    }
                    variant={card.trigger_type === 'safety_risk' ? 'warning' : 'season'}
                  />
                  {card.anonymous ? (
                    <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>
                      🔒 Anonymous
                    </Text>
                  ) : null}
                </View>

                <Text style={[typography.headlineSm, { color: colors.onSurface, marginTop: spacing.xs }]}>
                  {card.title}
                </Text>
                <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginBottom: spacing.md }]}>
                  {card.description}
                </Text>

                {/* Safety Alert link-out if safety_risk */}
                {card.safety_alert_id ? (
                  <TouchableOpacity
                    onPress={() => router.push(`/(tabs)/home/safety-alert/${card.safety_alert_id}` as any)}
                    style={{ marginBottom: spacing.md }}
                  >
                    <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>
                      View Weather & Risk Report →
                    </Text>
                  </TouchableOpacity>
                ) : null}

                {/* Options List */}
                <View style={{ gap: spacing.xs }}>
                  {card.options.map((opt) => (
                    <TouchableOpacity
                      key={opt.id}
                      onPress={() => handleCastVote(card.id, opt.id)}
                      style={[
                        styles.voteOptionBtn,
                        {
                          backgroundColor: colors.surfaceContainerLow,
                          borderRadius: rounded.md,
                          padding: spacing.md,
                        },
                      ]}
                    >
                      <Text style={[typography.bodyMd, { color: colors.onSurface, fontWeight: '600', flex: 1 }]}>
                        {opt.label}
                      </Text>
                      <Badge label={`${opt.votes_count || 0} votes`} variant="outline" />
                    </TouchableOpacity>
                  ))}
                </View>
              </Card>
            );
          }

          // Regular User Chat Bubble
          return (
            <View
              key={msg.id}
              style={[
                styles.bubbleRow,
                isMe ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' },
              ]}
            >
              {!isMe ? <Avatar uri={msg.sender_avatar} name={msg.sender_name} size={32} /> : null}
              <View
                style={[
                  styles.bubble,
                  {
                    backgroundColor: isMe ? colors.primary : colors.card,
                    borderRadius: rounded.lg,
                    padding: spacing.md,
                    marginLeft: !isMe ? spacing.xs : 0,
                    marginRight: isMe ? spacing.xs : 0,
                  },
                ]}
              >
                {!isMe && msg.sender_name ? (
                  <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, marginBottom: 2 }]}>
                    {msg.sender_name}
                  </Text>
                ) : null}
                <Text
                  style={[
                    typography.bodyMd,
                    { color: isMe ? colors.onPrimary : colors.onSurface },
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Composer Toolbar (with Propose Vote trigger) */}
      <View
        style={[
          styles.composerBar,
          {
            backgroundColor: '#ffffff',
            borderTopColor: colors.cardBorder,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
          },
        ]}
      >
        {/* Propose Vote Action (FR-2-6a) */}
        <TouchableOpacity
          onPress={() => setVoteModalVisible(true)}
          style={[styles.voteToolBtn, { backgroundColor: colors.surfaceContainerLow, borderRadius: rounded.md }]}
        >
          <Text style={{ fontSize: 18 }}>🗳️</Text>
        </TouchableOpacity>

        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Message group or ask Paku..."
          placeholderTextColor={colors.outline}
          style={[
            styles.textInput,
            {
              backgroundColor: colors.surfaceContainerLow,
              borderRadius: rounded.full,
              paddingHorizontal: spacing.md,
              color: colors.onSurface,
            },
          ]}
        />

        <Button
          title="Send"
          onPress={handleSendMessage}
          variant="primary"
          size="sm"
        />
      </View>

      {/* Propose Vote Composer Modal Sheet (FR-2-6a) */}
      <ModalSheet
        visible={voteModalVisible}
        onClose={() => setVoteModalVisible(false)}
        title="Propose Group Vote 🗳️"
      >
        <View style={{ gap: spacing.md }}>
          <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '700' }]}>
            Decision Question / Topic
          </Text>
          <TextInput
            value={voteTitle}
            onChangeText={setVoteTitle}
            placeholder="e.g. Which ramen shop for dinner?"
            placeholderTextColor={colors.outline}
            style={[styles.modalInput, { borderColor: colors.outlineVariant, borderRadius: rounded.md, padding: spacing.md }]}
          />

          <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '700' }]}>
            Option 1
          </Text>
          <TextInput
            value={voteOption1}
            onChangeText={setVoteOption1}
            placeholder="e.g. Ichiran Shibuya"
            placeholderTextColor={colors.outline}
            style={[styles.modalInput, { borderColor: colors.outlineVariant, borderRadius: rounded.md, padding: spacing.md }]}
          />

          <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '700' }]}>
            Option 2
          </Text>
          <TextInput
            value={voteOption2}
            onChangeText={setVoteOption2}
            placeholder="e.g. Afuri Harajuku"
            placeholderTextColor={colors.outline}
            style={[styles.modalInput, { borderColor: colors.outlineVariant, borderRadius: rounded.md, padding: spacing.md }]}
          />

          <TouchableOpacity
            onPress={() => setIsAnonymous(!isAnonymous)}
            style={{ flexDirection: 'row', alignItems: 'center', marginVertical: spacing.xs }}
          >
            <Text style={{ fontSize: 18, marginRight: 8 }}>{isAnonymous ? '☑️' : '◻️'}</Text>
            <Text style={[typography.bodySm, { color: colors.onSurface }]}>
              Anonymous Voting (hide member picks)
            </Text>
          </TouchableOpacity>

          <Button
            title="Publish Vote to Room Chat"
            onPress={handlePublishVote}
            variant="primary"
            size="lg"
          />
        </View>
      </ModalSheet>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 4,
  },
  bubble: {
    maxWidth: '78%',
  },
  voteOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  composerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    gap: 8,
  },
  voteToolBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    height: 38,
    fontSize: 14,
  },
  modalInput: {
    borderWidth: 1,
    fontSize: 14,
  },
});
