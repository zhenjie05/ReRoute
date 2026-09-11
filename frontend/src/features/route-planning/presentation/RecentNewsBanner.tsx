import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { mockSafetyAlerts } from '@/features/route-planning/data/mock-route-planning';
import { useLiveTrip } from '@/lib/hooks/useLiveTrip';

export const RecentNewsBanner: React.FC = () => {
  const { colors, typography, spacing, rounded, shadows } = useTheme();
  const router = useRouter();
  const { liveTrip } = useLiveTrip();

  // Scoped to the user's active/planning trip destinations per FR-NAV-6
  const userDestinations = [liveTrip?.destination || 'Tokyo, Japan', 'Kyoto, Japan'];

  const alerts = mockSafetyAlerts.filter((alert) =>
    userDestinations.some(
      (dest) =>
        dest.toLowerCase().includes(alert.destination.toLowerCase()) ||
        alert.destination.toLowerCase().includes(dest.toLowerCase())
    )
  );

  // If no user trips or no alerts exist for destination, seamlessly hide banner (FR-NAV-6)
  if (alerts.length === 0) {
    return null;
  }

  const handleAlertPress = (alertId: string) => {
    router.push(`/(tabs)/home/safety-alert/${alertId}` as any);
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'high':
      case 'severe':
        return { bg: '#fee2e2', text: '#b02500', border: '#fca5a5' };
      case 'moderate':
        return { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' };
      case 'low':
      default:
        return { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' };
    }
  };

  return (
    <View style={{ marginHorizontal: spacing.lg, marginVertical: spacing.sm }}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.surfaceContainerHigh,
            borderRadius: rounded['2xl'],
            padding: spacing.md,
            ...shadows.soft,
          },
        ]}
      >
        {/* Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.headerTitleGroup}>
            <Text style={[typography.labelMd, { color: colors.onSurface, fontWeight: '800' }]}>
              Recent News & Safety Alerts
            </Text>
          </View>
          <Text style={[typography.utilityTiny, { color: colors.outline }]}>
            Personalized to Your Trips
          </Text>
        </View>

        {/* Alert Items List */}
        <View style={{ marginTop: spacing.sm }}>
          {alerts.map((alert, index) => {
            const badgeStyle = getRiskBadgeColor(alert.risk_level);
            return (
              <TouchableOpacity
                key={alert.id}
                activeOpacity={0.8}
                onPress={() => handleAlertPress(alert.id)}
                style={[
                  styles.alertItem,
                  index > 0 && {
                    borderTopWidth: 1,
                    borderTopColor: colors.surfaceContainerHigh,
                    paddingTop: spacing.sm,
                    marginTop: spacing.sm,
                  },
                ]}
              >
                <View style={styles.alertTopRow}>
                  <View
                    style={[
                      styles.riskBadge,
                      {
                        backgroundColor: badgeStyle.bg,
                        borderColor: badgeStyle.border,
                        borderRadius: rounded.md,
                      },
                    ]}
                  >
                    <Text style={[typography.utilityTiny, { color: badgeStyle.text, fontWeight: '800' }]}>
                      {alert.risk_level.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={[typography.utilityTiny, { color: colors.outline }]}>
                    {alert.destination}
                  </Text>
                </View>

                <Text
                  style={[
                    typography.bodySm,
                    { color: colors.onSurface, fontWeight: '700', marginTop: 4, lineHeight: 18 },
                  ]}
                  numberOfLines={2}
                >
                  {alert.title}
                </Text>

                <View style={styles.alertFooterRow}>
                  <Text style={[typography.utilityTiny, { color: colors.primary, fontWeight: '700' }]}>
                    {alert.source_name} ↗
                  </Text>
                  <Text style={[typography.utilityTiny, { color: colors.outline }]}>
                    Read details →
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertItem: {
    width: '100%',
  },
  alertTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riskBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
  },
  alertFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
});
