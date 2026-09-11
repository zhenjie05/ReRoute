import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { AppNotification } from '@/models/notification';
import { Feather, Ionicons } from '@expo/vector-icons';

// Import feature-owned notification rendering components (ownership breakdown preserved)
import { SafetyAlertNotificationItem } from '@/features/route-planning/presentation/SafetyAlertNotificationItem';
import { DecisionCardNotificationItem } from '@/features/trip-room/presentation/DecisionCardNotificationItem';
import { BudgetNotificationItem } from '@/features/trip-room/presentation/BudgetNotificationItem';
import { MascotNotificationItem } from '@/features/mascot/presentation/MascotNotificationItem';
import { SOSNotificationItem } from '@/features/sos/presentation/SOSNotificationItem';
import { CommunityStarNotificationItem } from '@/features/discover/presentation/CommunityStarNotificationItem';

const rotiImage = require('../../../assets/Roti.png');

type CategoryFilter = 'all' | 'safety' | 'votes' | 'mascot';

export const NotificationCenter: React.FC = () => {
  const { colors, typography, spacing, rounded, shadows } = useTheme();
  const router = useRouter();
  const {
    isCenterOpen,
    closeNotificationCenter,
    unreadCount,
    markAsRead,
    markAllAsRead,
    filterNotifications,
  } = useNotifications();

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [inquireQuery, setInquireQuery] = useState('');

  const filterTabs: { key: CategoryFilter; label: string; icon: (c: string) => React.ReactNode }[] = [
    { key: 'all', label: 'All', icon: (c) => <Feather name="bell" size={12} color={c} /> },
    { key: 'safety', label: 'Safety & Weather', icon: (c) => <Feather name="cloud-rain" size={12} color={c} /> },
    { key: 'votes', label: 'Trip Room Votes', icon: (c) => <Feather name="check-square" size={12} color={c} /> },
    { key: 'mascot', label: 'Mascot Tips', icon: (c) => <Feather name="info" size={12} color={c} /> },
  ];

  const items = filterNotifications(activeCategory);

  const handleItemPress = (notif: AppNotification) => {
    markAsRead(notif.id);
    closeNotificationCenter();
    if (notif.routeTarget) {
      try {
        router.push(notif.routeTarget as any);
      } catch {
        // Fallback for mock/stub routes
      }
    }
  };

  const renderNotificationItem = (notif: AppNotification) => {
    switch (notif.type) {
      case 'safety_risk':
        return (
          <SafetyAlertNotificationItem
            key={notif.id}
            notification={notif}
            onPress={() => handleItemPress(notif)}
          />
        );
      case 'decision_card':
        return (
          <DecisionCardNotificationItem
            key={notif.id}
            notification={notif}
            onPress={() => handleItemPress(notif)}
          />
        );
      case 'budget_alert':
        return (
          <BudgetNotificationItem
            key={notif.id}
            notification={notif}
            onPress={() => handleItemPress(notif)}
          />
        );
      case 'mascot_advisory':
        return (
          <MascotNotificationItem
            key={notif.id}
            notification={notif}
            onPress={() => handleItemPress(notif)}
          />
        );
      case 'sos_alert':
        return (
          <SOSNotificationItem
            key={notif.id}
            notification={notif}
            onPress={() => handleItemPress(notif)}
          />
        );
      case 'community_star':
        return (
          <CommunityStarNotificationItem
            key={notif.id}
            notification={notif}
            onPress={() => handleItemPress(notif)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={isCenterOpen}
      transparent
      animationType="slide"
      onRequestClose={closeNotificationCenter}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity
          style={styles.scrim}
          activeOpacity={1}
          onPress={closeNotificationCenter}
        />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              borderTopLeftRadius: rounded.cardLarge,
              borderTopRightRadius: rounded.cardLarge,
              paddingTop: spacing.md,
              ...shadows.medium,
            },
          ]}
        >
          {/* Top Drag Handle */}
          <View
            style={[
              styles.handle,
              { backgroundColor: colors.outlineVariant, borderRadius: rounded.full },
            ]}
          />

          {/* Header Bar */}
          <View style={[styles.headerBar, { paddingHorizontal: spacing.lg }]}>
            <View style={styles.headerLeft}>
              <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: '800' }]}>
                Notifications
              </Text>
              {unreadCount > 0 && (
                <View
                  style={[
                    styles.unreadPill,
                    { backgroundColor: colors.primary, borderRadius: rounded.full },
                  ]}
                >
                  <Text style={[typography.utilityTiny, { color: '#ffffff', fontWeight: '800' }]}>
                    {unreadCount} new
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.headerRight}>
              {unreadCount > 0 && (
                <TouchableOpacity
                  onPress={markAllAsRead}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={{ marginRight: spacing.md }}
                >
                  <Text style={[typography.utilityTiny, { color: colors.primary, fontWeight: '700' }]}>
                    Mark all read
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={closeNotificationCenter}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={{ fontSize: 18, color: colors.outline }}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick AI Inquire Input Box */}
          <View style={{ paddingHorizontal: spacing.lg, marginVertical: spacing.xs }}>
            <View
              style={[
                styles.inquireBox,
                {
                  backgroundColor: colors.surfaceContainerLow,
                  borderColor: colors.surfaceContainerHigh,
                  borderRadius: rounded.xl,
                  paddingHorizontal: spacing.md,
                },
              ]}
            >
              <Image source={rotiImage} style={styles.inquireMascot} resizeMode="contain" />
              <TextInput
                value={inquireQuery}
                onChangeText={setInquireQuery}
                placeholder="Ask Roti about your trip alerts..."
                placeholderTextColor={colors.outline}
                style={[
                  typography.bodySm,
                  styles.inquireInput,
                  { color: colors.onSurface },
                ]}
              />
              {inquireQuery.length > 0 && (
                <TouchableOpacity onPress={() => setInquireQuery('')}>
                  <Text style={{ fontSize: 14, color: colors.outline }}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Quick AI Inquire Prompt Chips */}
          <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xs }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 6, paddingVertical: 2 }}
            >
              {[
                { label: 'Plan indoor route', icon: <Feather name="map-pin" size={12} color={colors.onSurfaceVariant} /> },
                { label: 'Flight status', icon: <Ionicons name="airplane-outline" size={12} color={colors.onSurfaceVariant} /> },
                { label: 'Nearby dining', icon: <Feather name="coffee" size={12} color={colors.onSurfaceVariant} /> }
              ].map((chip) => (
                <TouchableOpacity
                  key={chip.label}
                  activeOpacity={0.75}
                  onPress={() => setInquireQuery(chip.label)}
                  style={[
                    styles.inquireChip,
                    {
                      backgroundColor: colors.surfaceContainerLow,
                      borderColor: colors.surfaceContainerHigh,
                      borderRadius: rounded.full,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6
                    },
                  ]}
                >
                  {chip.icon}
                  <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, fontWeight: '700' }]}>
                    {chip.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Filter Pills Tabs */}
          <View style={{ paddingHorizontal: spacing.lg, marginVertical: spacing.xs }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
            >
              {filterTabs.map((tab) => {
                const isActive = activeCategory === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    activeOpacity={0.8}
                    onPress={() => setActiveCategory(tab.key)}
                    style={[
                      styles.filterTab,
                      {
                        backgroundColor: isActive
                          ? colors.primary
                          : colors.surfaceContainerLow,
                        borderRadius: rounded.full,
                        borderColor: isActive
                          ? colors.primary
                          : colors.surfaceContainerHigh,
                      },
                    ]}
                  >
                    {tab.icon(isActive ? '#ffffff' : colors.onSurface)}
                    <Text
                      style={[
                        typography.utilityTiny,
                        {
                          color: isActive ? '#ffffff' : colors.onSurface,
                          fontWeight: isActive ? '800' : '600',
                          marginLeft: 4,
                        },
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Notifications Scroll List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContent,
              { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
            ]}
          >
            {items.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={{ fontSize: 36, marginBottom: spacing.xs }}>🏖️</Text>
                <Text
                  style={[
                    typography.labelMd,
                    { color: colors.onSurface, fontWeight: '700', textAlign: 'center' },
                  ]}
                >
                  All caught up!
                </Text>
                <Text
                  style={[
                    typography.utilityTiny,
                    { color: colors.outline, textAlign: 'center', marginTop: 2 },
                  ]}
                >
                  No active alerts or voting cards in this category.
                </Text>
              </View>
            ) : (
              items.map((item) => renderNotificationItem(item))
            )}
          </ScrollView>

          {/* Archive / Preferences Footer Link */}
          <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, paddingTop: 4 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                closeNotificationCenter();
                router.push('/(tabs)/profile/settings' as any);
              }}
              style={[
                styles.archiveBtn,
                {
                  backgroundColor: colors.surfaceContainerLow,
                  borderColor: colors.surfaceContainerHigh,
                  borderRadius: rounded.xl,
                },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Feather name="clock" size={14} color={colors.primary} />
                <Text style={[typography.utilityTiny, { color: colors.primary, fontWeight: '700', textAlign: 'center' }]}>
                  View notification archive & preferences →
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 15, 17, 0.55)',
    justifyContent: 'flex-end',
  },
  scrim: {
    flex: 1,
  },
  sheet: {
    maxHeight: '88%',
    width: '100%',
  },
  handle: {
    width: 36,
    height: 4,
    alignSelf: 'center',
    marginBottom: 10,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  inquireBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    height: 40,
  },
  inquireMascot: {
    width: 22,
    height: 22,
  },
  inquireInput: {
    flex: 1,
    marginLeft: 8,
    height: 38,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  listContent: {
    gap: 8,
    paddingTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  inquireChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  archiveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
