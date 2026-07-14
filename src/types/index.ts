export type Language = "en" | "bn";

export type PaymentMethod = "bkash" | "nagad" | "rocket" | "card" | "cash";

export type NoticeType = "general" | "training" | "circular" | "job";

export type BannerType = "offer" | "campaign" | "training" | "service";

export type GalleryType = "photo" | "video" | "event";

// ─── Domain Models ────────────────────────────────────────────────────────────

export interface Banner {
  id: string;
  titleEn: string;
  titleBn: string;
  subtitleEn?: string;
  subtitleBn?: string;
  image: string;
  ctaLink?: string;
  type: BannerType;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export interface ServicePackage {
  tier: 'basic' | 'standard' | 'premium';
  nameEn: string;
  nameBn: string;
  dutyHours: number;
  dailyPrice: number;
  weeklyPrice: number;
  monthlyPrice: number;
  includedFeatures: string[];
}

export interface Service {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  shortDescEn: string;
  shortDescBn: string;
  image: string;
  icon?: string;
  featuresEn: string[];
  featuresBn: string[];
  packages: ServicePackage[];
  isActive: boolean;
  createdAt: string;
}

export interface OtherService {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  descriptionEn?: string;
  descriptionBn?: string;
  shortDescEn?: string;
  shortDescBn?: string;
  image?: string;
  imagePublicId?: string;
  icon?: string;
  featuresEn: string[];
  featuresBn: string[];
  packages?: ServicePackage[];
  isActive: boolean;
  order: number;
  createdAt: string;
}

export interface Training {
  id: string;
  slug: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  image: string;
  duration: string;
  weeklyClasses?: string;
  totalHours?: string;
  fee: number;
  classType: string;
  syllabusEn: string[];
  syllabusBn: string[];
  syllabusModules?: { titleEn: string; titleBn: string; items: string[] }[];
  certificateInfoEn: string;
  certificateInfoBn: string;
  isActive: boolean;
  createdAt: string;
}

export interface TrainingEnrollmentFormData {
  trainingId: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  education?: string;
  message?: string;
}

export interface Notice {
  id: string;
  titleEn: string;
  titleBn: string;
  contentEn: string;
  contentBn: string;
  type: NoticeType;
  documentUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  commentEn: string;
  commentBn: string;
  serviceUsed: string;
  isApproved: boolean;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  type: GalleryType;
  titleEn: string;
  titleBn: string;
  url: string;
  thumbnail?: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  nameEn: string;
  nameBn: string;
  roleEn: string;
  roleBn: string;
  image: string;
  order: number;
}

export interface JobApplication {
  id?: string;
  name: string;
  phone: string;
  experience: string;
  education: string;
  cvUrl?: string;
  status?: "pending" | "reviewed" | "shortlisted" | "rejected";
  createdAt?: string;
}

// ─── Form Inputs ──────────────────────────────────────────────────────────────

export interface BookingFormData {
  name: string;
  phone: string;
  address: string;
  serviceType: string;
  date: string;
  time: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface JobApplicationFormData {
  name: string;
  phone: string;
  experience: string;
  education: string;
  cv: FileList;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
}

export interface ReviewFormData {
  customerName: string;
  rating: number;
  commentEn: string;
  commentBn?: string;
  serviceUsed: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin";
}

export interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
}
