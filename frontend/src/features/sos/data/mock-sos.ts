export interface EmergencyContact {
  destination: string;
  police: string;
  ambulance: string;
  fire: string;
  general: string;
}

export const mockEmergencyDirectory: Record<string, EmergencyContact> = {
  'Japan': {
    destination: 'Japan',
    police: '110',
    ambulance: '119',
    fire: '119',
    general: '110',
  },
  'Switzerland': {
    destination: 'Switzerland',
    police: '117',
    ambulance: '144',
    fire: '118',
    general: '112',
  },
  'Indonesia': {
    destination: 'Indonesia',
    police: '110',
    ambulance: '118',
    fire: '113',
    general: '112',
  },
};
