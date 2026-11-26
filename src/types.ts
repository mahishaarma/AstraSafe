export type VerificationStatus = 'unverified' | 'pending' | 'verified_explorer' | 'vetted_guide';

export interface PrivacySettings {
  locationVisibility: 'exact' | 'fuzzy_3km' | 'hidden';
  nameDisplay: 'full' | 'first_initial' | 'handle_only';
  contactVisibility: 'in_app_only' | 'emergency_circle_only' | 'hidden';
  showItinerary: boolean;
  showProfession: boolean;
  showAge: boolean;
  anonymousQueryMode: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  age: number;
  profession: string;
  homeCity: string;
  verificationStatus: VerificationStatus;
  idType?: 'passport' | 'national_id' | 'driver_license';
  verifiedDate?: string;
  trustScore: number; // e.g. 98%
  badges: string[];
  privacy: PrivacySettings;
  emergencyContacts: { name: string; relation: string; phone: string }[];
  bloodGroup?: string;
  medicalNotes?: string;
  currentTrip?: {
    destination: string;
    checkInDate: string;
    checkOutDate: string;
    registeredWithGovt: boolean;
    registrationId?: string;
  };
}

export type AmenityCategory = 'petrol_pump' | 'medical_pharmacy' | 'washroom' | 'police' | 'hospital' | 'female_safe_stay' | 'market' | 'transport_hub';

export interface InfrastructureItem {
  id: string;
  name: string;
  category: AmenityCategory;
  address: string;
  distanceKm: number;
  phone: string;
  operatingHours: string;
  rating: number;
  womenSafeFeatures: string[];
  isAllWomenManaged?: boolean;
  cleanlinessScore?: number; // e.g. 4.9/5
  is24x7?: boolean;
  hasSanitaryAmenities?: boolean;
  lat?: number;
  lng?: number;
}

export interface LocalEmergencyContact {
  id?: string;
  title: string;
  number: string;
  alternateNumber?: string;
  description: string;
  is24x7: boolean;
  category: 'police' | 'medical' | 'women_helpline' | 'mountain_rescue' | 'disaster' | 'tourism_board' | 'taxi_union' | 'crisis_center';
  location?: string;
  officerInCharge?: string;
  address?: string;
  verificationBadge?: string;
}

export interface SafetyAdvisory {
  id: string;
  destinationId: string;
  type: 'past_incident' | 'weather_hazard' | 'harassment_alert' | 'route_blocked' | 'positive_update';
  title: string;
  description: string;
  date: string;
  locationName: string;
  reportedBy: string;
  isVerified: boolean;
  severity: 'low' | 'medium' | 'high';
  actionableTip: string;
}

export interface SafetyScorePillar {
  name: string;
  score: number; // 0-10
  weightPercentage: number;
  description: string;
  dataSource: string;
  keyMetrics: string[];
}

export interface SafetyScoreMethodology {
  overallScore: number;
  lastAuditedDate: string;
  auditAgency: string;
  pillars: SafetyScorePillar[];
  dataCollectionProcess: string;
  disclaimer: string;
}

export interface OfflineMapRegion {
  id: string;
  name: string;
  sizeMB: number;
  isDownloaded: boolean;
  downloadProgress: number; // 0 - 100
  lastUpdated: string;
  emergencySheltersCount: number;
  medicalPointsCount: number;
  policePostsCount: number;
  waterPointsCount: number;
  deadZonesCount: number;
  waypoints: {
    name: string;
    type: 'shelter' | 'police' | 'medical' | 'fuel' | 'washroom' | 'dead_zone' | 'viewpoint';
    lat: number;
    lng: number;
    elevation: string;
    notes: string;
  }[];
}

export interface GuideExperience {
  yearsInField: number;
  totalTreksLed: number;
  soloFemaleLedCount: number;
  safetyIncidentRate: string; // e.g. "0.0% Incident Free"
  certifications: {
    name: string;
    issuer: string;
    year: number;
    badgeIcon?: string;
  }[];
  terrainExpertise: string[];
  safetyEquipmentCarried: string[];
  testimonials: {
    travelerName: string;
    verifiedTrip: string;
    date: string;
    rating: number;
    comment: string;
  }[];
}

export interface MountainGuide {
  id: string;
  name: string;
  avatar: string;
  gender: 'female' | 'male';
  isPartneredMaleGuide?: boolean;
  location: string;
  specialties: string[];
  languages: string[];
  rating: number;
  reviewCount: number;
  pricePerDayINR: number;
  policeClearanceVerified: boolean;
  policeClearanceCertId?: string;
  criminalRecordCheckDate?: string;
  cleanPastRecordVerified?: boolean;
  backgroundCheckedBy: string;
  femaleEndorsementScore?: string; // e.g. "99.8% Female Traveler Trust"
  bio: string;
  trekExperienceYears: number;
  availableFrom: string;
  experienceDetails: GuideExperience;
}

// Keep alias for backwards compatibility
export type FemaleLocalGuide = MountainGuide;

export interface PeerTraveler {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  homeCity: string;
  destination: string;
  travelDates: string;
  interests: string[];
  trustScore: number;
  verificationBadge: boolean;
  bio: string;
  lookingFor: string;
  privacy: PrivacySettings;
}

export interface TouristRegistrationData {
  fullName: string;
  idNumber: string;
  emergencyPhone: string;
  destination: string;
  trekRoute?: string;
  startDate: string;
  endDate: string;
  accommodationDetails: string;
  checkInTimerHours: number;
  notifyLocalPolice: boolean;
}

export interface DestinationDossier {
  id: string;
  name: string;
  region: string;
  country: string;
  heroImage: string;
  safetyIndex: number; // e.g. 9.2 out of 10
  nightSafetyScore: number;
  femaleComfortScore: number;
  cellNetworkCoverage: {
    jio: 'Strong' | 'Moderate' | 'Weak' | 'No Signal';
    airtel: 'Strong' | 'Moderate' | 'Weak' | 'No Signal';
    bsnl: 'Strong' | 'Moderate' | 'Weak' | 'No Signal';
  };
  accreditationBadge: string;
  govtTouristRegRequired: boolean;
  activeTouristCountEstimate: number;
  overview: string;
  whyWomenLoveIt: string[];
  localCulturalNorms: string[];
  infrastructure: InfrastructureItem[];
  emergencyContacts: LocalEmergencyContact[];
  advisories: SafetyAdvisory[];
  scoreMethodology: SafetyScoreMethodology;
  offlineMap: OfflineMapRegion;
}

export interface CabSafetyState {
  isActive: boolean;
  phase: 'pre_ride_check' | 'inside_cab_alert' | 'active_ride_monitor';
  vehiclePlate: string;
  driverName: string;
  cabService: string;
  childLockVerifiedPreRide: boolean;
  plateMatched: boolean;
  driverMatched: boolean;
  insideHandleTested: boolean;
  rideStartedAt?: string;
  sharedWithContacts: boolean;
}

export type PlanCategory =
  | 'cafe_work'
  | 'sunset_hike'
  | 'cab_split'
  | 'monastery_art'
  | 'food_walk'
  | 'shopping_chill'
  | 'sunrise_yoga'
  | 'sightseeing';

export interface PlanParticipant {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  homeCity?: string;
  verified: boolean;
  trustScore: number;
  joinedAt: string;
}

export interface FreeDayPlan {
  id: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorAge?: number;
  authorHomeCity: string;
  authorVerificationBadge: boolean;
  authorTrustScore: number;
  destinationId: string;
  destinationName: string;
  title: string;
  description: string;
  date: string; // e.g. "Tomorrow, Aug 25"
  timeSlot: string; // e.g. "09:30 AM - 02:00 PM"
  category: PlanCategory;
  meetingPoint: string;
  maxBuddies: number;
  joinedBuddies: PlanParticipant[];
  estimatedCost: string;
  safetyNotes: string;
  status: 'open' | 'full' | 'completed';
  createdAt: string;
  tags: string[];
}

export interface DirectChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientId: string;
  planId?: string;
  text: string;
  timestamp: string;
  isEncrypted: boolean;
  status: 'sent' | 'delivered' | 'read';
  locationShared?: { name: string; coordinates?: string };
  audioNoteDuration?: string;
}

export interface DirectCallState {
  isActive: boolean;
  recipient: {
    id: string;
    name: string;
    avatar: string;
    handle: string;
    location: string;
    trustScore: number;
  };
  callType: 'audio' | 'video';
  callStatus: 'ringing' | 'connected' | 'ended';
  durationSeconds: number;
  isMuted: boolean;
  isSpeaker: boolean;
  isVideoOn: boolean;
  isEncrypted: boolean;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorHomeCity?: string;
  destinationId: string;
  location: string;
  timeAgo: string;
  category: 'safety_tip' | 'hazard_warning' | 'cafe_review' | 'transport_update' | 'photo_spot' | 'female_stay';
  title: string;
  content: string;
  photoUrl?: string;
  photoCaption?: string;
  isPinnedCritical?: boolean;
  criticalAlertBadge?: string;
  upvotes: number;
  userUpvoted?: boolean;
  verifiedIDBadge: boolean;
}

export type CabRideType = 'city_safe' | 'mountain_suv' | 'night_escort' | 'sightseeing_day' | 'airport_rail';

export interface VettedDriverDetails {
  name: string;
  phone: string;
  avatar: string;
  rating: number;
  tripsCompleted: number;
  licensePlate: string;
  vehicleModel: string;
  vehicleColor: string;
  unionId: string;
  policeBadgeId: string;
  isFemaleDriver: boolean;
  otp: string;
}

export interface CabBooking {
  id: string;
  userId: string;
  userName: string;
  pickupLocation: string;
  dropoffLocation: string;
  destinationId: string;
  destinationName: string;
  rideType: CabRideType;
  rideTypeName: string;
  departureTime: string; // e.g. "Instant (within 5 mins)" or scheduled time
  fareEstimateINR: number;
  distanceKm: number;
  durationMinutes: number;
  specialRequests: {
    femaleDriverPreferred?: boolean;
    nightEscortActive?: boolean;
    autoShareRouteWithCircle?: boolean;
    quietRide?: boolean;
  };
  status: 'confirmed' | 'arriving' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  driver?: VettedDriverDetails;
  childLockVerified?: boolean;
  cabGuardArmed?: boolean;
}

