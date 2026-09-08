import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';
import { Badge } from '@/shared/components';
import { ItineraryItemNode, VoteState } from './ItineraryItemNode';

interface TimelineItem {
  id: string;
  time: string;
  name: string;
  note?: string;
  photoUrl?: string;
  voteState: VoteState;
  voteTally?: string;
}

interface DayTimelineStepperProps {
  dayNumber: number;
  dayTitle?: string;
  tripDate: string;
  arrivalNote?: string;
  items: TimelineItem[];
  disabled?: boolean;
  onSuggestVote?: (itemId: string) => void;
  onAddDetails?: (itemId: string) => void;
  onItemPress?: (itemId: string) => void;
  onEditItem?: (itemId: string) => void;
  onDeleteItem?: (itemId: string) => void;
}

/**
 * Day section of the vertical timeline/stepper.
 * Shows day label with Draft/Planning badge, date + arrival note,
 * and itinerary items as stepper nodes.
 */
export const DayTimelineStepper: React.FC<DayTimelineStepperProps> = ({
  dayNumber,
  dayTitle,
  tripDate,
  arrivalNote,
  items,
  disabled = false,
  onSuggestVote,
  onAddDetails,
  onItemPress,
  onEditItem,
  onDeleteItem,
}) => {
  const { colors, typography, spacing } = useTheme();

  const formatDate = (dateStr: string): string => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      const month = d.toLocaleString('en-US', { month: 'short' });
      const day = d.getDate();
      return `${month} ${day}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <View style={[styles.container, { marginBottom: spacing.lg }]}>
      {/* Day header */}
      <View style={[styles.dayHeader, { marginBottom: spacing.md, paddingHorizontal: spacing.lg }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={[typography.headlineSm, { color: colors.onSurface }]}>
            Day {dayNumber} Planning
          </Text>
          <Badge label="Draft" variant="outline" />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>
            {formatDate(tripDate)}
          </Text>
          {arrivalNote && (
            <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>
              {' '}• {arrivalNote}
            </Text>
          )}
        </View>
      </View>

      {/* Timeline items */}
      <View style={{ paddingHorizontal: spacing.lg }}>
        {items.map((item, index) => (
          <ItineraryItemNode
            key={item.id}
            id={item.id}
            time={item.time}
            name={item.name}
            note={item.note}
            photoUrl={item.photoUrl}
            voteState={item.voteState}
            voteTally={item.voteTally}
            isLast={index === items.length - 1}
            disabled={disabled}
            onSuggestVote={() => onSuggestVote?.(item.id)}
            onAddDetails={() => onAddDetails?.(item.id)}
            onPress={() => onItemPress?.(item.id)}
            onEdit={() => onEditItem?.(item.id)}
            onDelete={() => onDeleteItem?.(item.id)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  dayHeader: {},
});
