export type ProjectCategory = "Mobile" | "Web" | "Backend" | "SaaS" | "API" | "Other";

export interface ProjectItem {
  _id?: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  description: string;
  longDescription?: string;
  thumbnail?: string;
  gallery?: string[];
  videoUrl?: string;
  technologies: string[];
  client?: string;
  role?: string;
  features?: string[];
  challenges?: string;
  solutions?: string;
  results?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  order?: number;
}

export interface ExperienceItem {
  _id?: string;
  role: string;
  organization: string;
  startDate: string;
  endDate?: string;
  description?: string;
  achievements?: string[];
  technologies?: string[];
}

export interface ServiceItem {
  _id?: string;
  title: string;
  description: string;
  icon?: string;
  startingPrice?: string;
  timeline?: string;
  features?: string[];
}

export interface RateCardItem {
  _id?: string;
  name: string;
  billingType: "hourly" | "project" | "retainer";
  price: string;
  unit?: string;
  description?: string;
  features?: string[];
  recommended?: boolean;
}

export interface TestimonialItem {
  _id?: string;
  clientName: string;
  position?: string;
  company?: string;
  avatar?: string;
  quote: string;
  rating?: number;
  project?: string;
  featured?: boolean;
}

export interface FAQItem {
  _id?: string;
  question: string;
  answer: string;
}

export interface BookingStatus {
  New: "New";
  Contacted: "Contacted";
  InDiscussion: "In Discussion";
  ProposalSent: "Proposal Sent";
  Won: "Won";
  Lost: "Lost";
  Archived: "Archived";
}
