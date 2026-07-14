export const SITE_CONFIG = {
  name: "Nexivio Care",
  phone: "01700-938055",
  whatsapp: "01700938055",
  email: "nexiviocare@gmail.com",
  address: "ঢাকা, বাংলাদেশ",
  facebookUrl: "https://facebook.com/nexiviocare",
  youtubeUrl: "https://youtube.com/@nexiviocare",
  linkedinUrl: "https://linkedin.com/company/nexiviocare",
  instagramUrl: "https://instagram.com/nexiviocare",
  messengerUrl: "https://m.me/nexiviocare",
} as const;

export const SERVICE_CATEGORIES = [
  { key: "nursing", slug: "nursing-service" },
  { key: "caregiver", slug: "caregiver-service" },
  { key: "babyCare", slug: "baby-nanny-care" },
  { key: "elderCare", slug: "elder-care" },
  { key: "others", slug: "other-services" },
] as const;

export const TRAINING_CATEGORIES = [
  { key: "caregiver", slug: "caregiver-training" },
  { key: "babyCare", slug: "baby-care-training" },
  { key: "elderCare", slug: "elder-care-training" },
  { key: "basicNursing", slug: "basic-nursing-training" },
  { key: "homeCare", slug: "home-care-training" },
  { key: "others", slug: "other-training" },
] as const;

export const PAYMENT_METHODS = [
  { value: "bkash", label: "bKash" },
  { value: "nagad", label: "Nagad" },
  { value: "rocket", label: "Rocket" },
  { value: "card", label: "Card" },
  { value: "cash", label: "Cash on Service" },
] as const;

export const NOTICE_TYPES = ["general", "training", "circular", "job"] as const;

export const GALLERY_TYPES = ["photo", "video", "event"] as const;

export const RATING_OPTIONS = [1, 2, 3, 4, 5] as const;

export const PAGINATION_LIMIT = 12;
