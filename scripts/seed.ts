/**
 * Seeds the database with the demo content used throughout the design phase.
 * Run with: npm run seed   (make sure MONGODB_URI is set in .env.local first)
 */
import { connectDB } from "../src/lib/mongodb";
import Project from "../src/models/Project";
import Experience from "../src/models/Experience";
import Service from "../src/models/Service";
import RateCard from "../src/models/RateCard";
import Testimonial from "../src/models/Testimonial";
import FAQ from "../src/models/FAQ";
import SiteSettings from "../src/models/SiteSettings";

async function seed() {
  await connectDB();
  console.log("Connected. Seeding...");

  await SiteSettings.findOneAndUpdate(
    { key: "main" },
    {
      key: "main",
      name: "Daniel Olojo",
      title: "Software Developer",
      bio: "Software developer building mobile, web and backend products that hold up under real use.",
      email: "hello@example.com",
      location: "Remote — open worldwide",
      availability: true,
      socials: { github: "https://github.com", linkedin: "https://linkedin.com", twitter: "" },
      heroHeadline: "Software Developer",
      heroSubtext: "Mobile • Web • Backend",
    },
    { upsert: true }
  );

  await Project.deleteMany({});
  await Project.insertMany([
    {
      title: "Monthly Quiz Competition",
      slug: "monthly-quiz-competition",
      category: "Mobile",
      description: "A live monthly quiz competition inside a mobile app.",
      longDescription: "Paginated leaderboards, celebratory winner cards, and automatic wallet crediting for prize payouts, built with React Native and a Node.js/MongoDB backend.",
      technologies: ["React Native", "Node.js", "MongoDB"],
      features: ["Live leaderboard", "Automatic prize wallet crediting", "Push notifications for results"],
      featured: true,
      order: 1,
    },
    {
      title: "Gospel Network Global",
      slug: "gospel-network-global",
      category: "Mobile",
      description: "A podcast player rebuilt around full-bleed artwork and gesture-driven playback.",
      technologies: ["React Native", "Redux Toolkit", "Audio Pro"],
      features: ["Frosted-glass control panel", "Draggable queue sheet"],
      featured: true,
      order: 2,
    },
    {
      title: "Gospel Network — Scripture",
      slug: "gospel-network-scripture",
      category: "Mobile",
      description: "A scripture reading app with a three-step verse-grid navigator.",
      technologies: ["React Native", "Context API"],
      order: 3,
    },
    {
      title: "Dextrous — Filmmaker Site",
      slug: "dextrous-filmmaker-site",
      category: "Web",
      description: "A cinematic Next.js portfolio for a filmmaker brand.",
      technologies: ["Next.js", "TypeScript", "GSAP"],
      order: 4,
    },
    {
      title: "Exam Bank Pipeline",
      slug: "exam-bank-pipeline",
      category: "Backend",
      description: "A batch pipeline converting DOCX question banks into schema-validated JSON.",
      technologies: ["Node.js", "JSON Schema"],
      order: 5,
    },
    {
      title: "AI Proxy Layer",
      slug: "ai-proxy-layer",
      category: "Backend",
      description: "A provider-agnostic AI proxy migrated live from Anthropic to Gemini.",
      technologies: ["Next.js API Routes", "Gemini 2.5"],
      order: 6,
    },
  ]);

  await Experience.deleteMany({});
  await Experience.insertMany([
    { role: "Software Developer", organization: "Guru EduTech", startDate: "2023", endDate: "Present", description: "Building mobile apps, an exam-prep content pipeline, and the backend behind a monthly quiz competition.", technologies: ["React Native", "Node.js", "MongoDB", "Next.js"], order: 1 },
    { role: "Full-Stack Developer", organization: "Freelance", startDate: "2021", endDate: "2023", description: "Shipped web and mobile products for independent clients.", technologies: ["React", "Next.js", "Express"], order: 2 },
    { role: "Self-Taught Foundations", organization: "Independent Study", startDate: "2019", endDate: "2021", description: "Learned JavaScript, React and React Native by building.", technologies: ["JavaScript", "React", "React Native"], order: 3 },
  ]);

  await Service.deleteMany({});
  await Service.insertMany([
    { title: "Mobile Development", description: "React Native apps built for real users.", icon: "Smartphone", order: 1 },
    { title: "Web Development", description: "Next.js sites with motion and structure that earn attention.", icon: "Globe", order: 2 },
    { title: "Backend & APIs", description: "Node.js and MongoDB systems built to stay boring under real traffic.", icon: "Server", order: 3 },
    { title: "MVP Development", description: "Ship a working product fast.", icon: "Rocket", order: 4 },
    { title: "Performance Optimization", description: "Faster loads, leaner bundles, fewer re-renders.", icon: "Zap", order: 5 },
    { title: "Maintenance & Scaling", description: "Keeping shipped products healthy as usage grows.", icon: "Wrench", order: 6 },
  ]);

  await RateCard.deleteMany({});
  await RateCard.insertMany([
    { name: "Hourly", billingType: "hourly", price: "$35", unit: "/ hour", description: "For focused, well-scoped work.", features: ["Flexible engagement", "Weekly time logs"], order: 1 },
    { name: "Project-Based", billingType: "project", price: "$1,200", unit: "starting at", description: "For a defined product or feature set.", features: ["Fixed scope & timeline", "30 days post-launch support"], recommended: true, order: 2 },
    { name: "Monthly Retainer", billingType: "retainer", price: "$800", unit: "/ month", description: "For ongoing product partnership.", features: ["Priority response time", "Cancel anytime"], order: 3 },
  ]);

  await Testimonial.deleteMany({});
  await Testimonial.insertMany([
    { clientName: "Amaka O.", position: "Product Lead", company: "EdTech Startup", quote: "Daniel took a messy content pipeline and turned it into something our whole team could rely on.", rating: 5, featured: true },
    { clientName: "Tomiwa A.", position: "Founder", company: "Media Network", quote: "The podcast app redesign felt like a completely different product.", rating: 5 },
  ]);

  await FAQ.deleteMany({});
  await FAQ.insertMany([
    { question: "What technologies do you use?", answer: "React Native, Next.js, Node.js and MongoDB, with TypeScript throughout.", order: 1 },
    { question: "Do you work with startups?", answer: "Yes — early-stage products are a lot of what I build.", order: 2 },
    { question: "Do you work remotely?", answer: "Yes, fully remote, async-friendly across time zones.", order: 3 },
  ]);

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
