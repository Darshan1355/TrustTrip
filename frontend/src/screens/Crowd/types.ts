export type CrowdStatus = 'LOW' | 'MODERATE' | 'HIGH' | 'OVERCROWDED';

export interface CrowdLocationApiResponse {
  location_id: number;
  location_name: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  capacity: number;
  crowd_count: number;
  occupancy_percentage: number;
  crowd_status: CrowdStatus;
  last_updated?: string;
}

export interface CrowdLocationCardItem {
  name: string;
  current: number;
  max: number;
  percent: number;
  level: CrowdStatus;
  dotColor: string;
  barColor: string;
  raw: CrowdLocationApiResponse;
}

export interface CrowdMapPin {
  id: number;
  x: number;
  y: number;
  color: string;
  icon: string;
  label: string;
  raw: CrowdLocationApiResponse;
  isMain: boolean;
}

export interface CrowdHistoryDataPoint {
  location_id: number;
  crowd_count: number;
  capacity: number;
  occupancy_percentage: number;
  crowd_status: CrowdStatus;
  created_at: string;
}

export interface CrowdTrendPoint {
  label: string;
  value: number;
  isHighlight: boolean;
}

export type CrowdStackParamList = {
  Crowd: undefined;
  CrowdMap: undefined;
  CrowdLocationDetail: { location: CrowdLocationApiResponse };
  CrowdHistory: { location: CrowdLocationApiResponse };
};
