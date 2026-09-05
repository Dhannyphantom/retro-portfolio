import Project from "@/models/Project";
import Experience from "@/models/Experience";
import Service from "@/models/Service";
import RateCard from "@/models/RateCard";
import Testimonial from "@/models/Testimonial";
import FAQ from "@/models/FAQ";
import Booking from "@/models/Booking";
import Skill from "@/models/Skill";
import BlogPost from "@/models/BlogPost";
import TechStack from "@/models/TechStack";
import Stat from "@/models/Stat";
import WorkflowStep from "@/models/WorkflowStep";
import PhilosophyLine from "@/models/PhilosophyLine";
import Photo from "@/models/Photo";
import ProjectVideo from "@/models/ProjectVideo";

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
  bookings: Booking,
  skills: Skill,
  blogposts: BlogPost,
  techstack: TechStack,
  stats: Stat,
  workflowsteps: WorkflowStep,
  philosophylines: PhilosophyLine,
  photos: Photo,
  projectvideos: ProjectVideo,
};
