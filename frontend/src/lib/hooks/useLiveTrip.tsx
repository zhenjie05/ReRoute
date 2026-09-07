import React, { createContext, useContext, useState } from 'react';
import { TripRoom } from '@/models/trip-room';

interface LiveTripContextType {
  liveTrip: TripRoom | null;
  hasLiveTrip: boolean;
  setLiveTrip: (trip: TripRoom | null) => void;
  startTrip: (trip: TripRoom) => void;
  endTrip: () => void;
}

const mockActiveLiveTrip: TripRoom = {
  id: 'room-tokyo-2026',
  name: 'Tokyo Autumn Escape 🍁',
  destination: 'Tokyo, Japan',
  stage: 'active',
  created_by: 'demo-user-1',
  start_date: '2026-10-10',
  end_date: '2026-10-16',
  theme_color: '#FB8C00',
  is_public: true,
  invite_code: 'TOK26A',
  cover_image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&fit=crop',
};

const LiveTripContext = createContext<LiveTripContextType | null>(null);

export const LiveTripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [liveTrip, setLiveTrip] = useState<TripRoom | null>(mockActiveLiveTrip);

  const startTrip = (trip: TripRoom) => {
    const activeTrip: TripRoom = {
      ...trip,
      stage: 'active',
    };
    setLiveTrip(activeTrip);
  };

  const endTrip = () => {
    setLiveTrip(null);
  };

  return (
    <LiveTripContext.Provider
      value={{
        liveTrip,
        hasLiveTrip: !!liveTrip,
        setLiveTrip,
        startTrip,
        endTrip,
      }}
    >
      {children}
    </LiveTripContext.Provider>
  );
};

export const useLiveTrip = () => {
  const context = useContext(LiveTripContext);
  if (!context) {
    throw new Error('useLiveTrip must be used within a LiveTripProvider');
  }
  return context;
};
