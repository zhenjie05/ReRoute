import React, { createContext, useContext, useState } from 'react';
import { TripRoom } from '@/models/trip-room';
import { mockTripRooms } from '@/features/trip-room/data/mock-trip-room';

interface LiveTripContextType {
  liveTrip: TripRoom | null;
  hasLiveTrip: boolean;
  setLiveTrip: (trip: TripRoom | null) => void;
  startTrip: (trip: TripRoom) => void;
  endTrip: () => void;
}


const LiveTripContext = createContext<LiveTripContextType | null>(null);

export const LiveTripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [liveTrip, setLiveTrip] = useState<TripRoom | null>(() => {
    const room = mockTripRooms.find((item) => item.stage === 'active');
    return room ? { ...room, stage: 'active' } : null;
  });

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
