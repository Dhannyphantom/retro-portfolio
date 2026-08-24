import Project from "@/models/Project";
import Experience from "@/models/Experience";
import Service from "@/models/Service";
import RateCard from "@/models/RateCard";
import Testimonial from "@/models/Testimonial";
import FAQ from "@/models/FAQ";
import Message from "@/models/Message";
import Booking from "@/models/Booking";
import Skill from "@/models/Skill";
import BlogPost from "@/models/BlogPost";
import TechStack from "@/models/TechStack";

// Maps a URL segment (/api/admin/<collection>) to its Mongoose model.
// Add a new collection to the admin dashboard by adding one line here —
// no new route files needed, GET/POST/PATCH/DELETE all work through it.
export const REGISTRY: Record<string, any> = {
  projects: Project,
  experience: Experience,
  services: Service,
  ratecards: RateCard,
  testimonials: Testimonial,
  faqs: FAQ,
  messages: Message,
  bookings: Booking,
  skills: Skill,
  blogposts: BlogPost,
  techstack: TechStack,
};
