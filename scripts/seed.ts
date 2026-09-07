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
import TechStack from "../src/models/TechStack";
import Stat from "../src/models/Stat";
import WorkflowStep from "../src/models/WorkflowStep";
import PhilosophyLine from "../src/models/PhilosophyLine";
import Photo from "../src/models/Photo";
import ProjectVideo from "../src/models/ProjectVideo";

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
      meetDeveloperBio: "Outside the editor, I care a lot about how things look and feel — visual design and presentation are as much a part of the process for me as the code underneath. A few short clips below give a closer look at how a build actually comes together.",
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

  await TechStack.deleteMany({});
  await TechStack.insertMany([
    { name: "React", iconUrl: "https://cdn.simpleicons.org/react/39FF14", showInHero: true, showInMarquee: true, order: 1 },
    { name: "Next.js", iconUrl: "https://cdn.simpleicons.org/nextdotjs/39FF14", showInHero: true, showInMarquee: true, order: 2 },
    { name: "Node.js", iconUrl: "https://cdn.simpleicons.org/nodedotjs/39FF14", showInHero: true, showInMarquee: true, order: 3 },
    { name: "TypeScript", iconUrl: "https://cdn.simpleicons.org/typescript/39FF14", showInHero: false, showInMarquee: true, order: 4 },
    { name: "MongoDB", iconUrl: "https://cdn.simpleicons.org/mongodb/39FF14", showInHero: false, showInMarquee: true, order: 5 },
    { name: "Tailwind CSS", iconUrl: "https://cdn.simpleicons.org/tailwindcss/39FF14", showInHero: false, showInMarquee: true, order: 6 },
    { name: "Redux Toolkit", iconUrl: "https://cdn.simpleicons.org/redux/39FF14", showInHero: false, showInMarquee: true, order: 7 },
    { name: "Express", iconUrl: "https://cdn.simpleicons.org/express/39FF14", showInHero: false, showInMarquee: true, order: 8 },
    { name: "GSAP", iconUrl: "https://cdn.simpleicons.org/greensock/39FF14", showInHero: false, showInMarquee: true, order: 9 },
  ]);

  await seedNewCollections();

  console.log("Seed complete.");
  process.exit(0);
}

async function seedNewCollections() {
  await Stat.deleteMany({});
  await Stat.insertMany([
    { icon: "Award", value: 3, suffix: "+", label: "Years building software", order: 1 },
    { icon: "Code2", value: 6, suffix: "+", label: "Products shipped", order: 2 },
    { icon: "Users", value: 8, suffix: "+", label: "Clients & collaborators", order: 3 },
    { icon: "Cpu", value: 12, suffix: "+", label: "Technologies used in production", order: 4 },
  ]);

  await WorkflowStep.deleteMany({});
  await WorkflowStep.insertMany([
    { icon: "Search", title: "Discover", description: "Understand the problem before touching code.", order: 1 },
    { icon: "PenTool", title: "Plan", description: "Map scope, architecture and milestones.", order: 2 },
    { icon: "Code2", title: "Design", description: "Structure the data, screens and flows.", order: 3 },
    { icon: "Hammer", title: "Build", description: "Ship in small, reviewable increments.", order: 4 },
    { icon: "TestTube2", title: "Test", description: "Catch issues before your users do.", order: 5 },
    { icon: "Rocket", title: "Launch", description: "Ship it — deploy, monitor, stabilize.", order: 6 },
    { icon: "TrendingUp", title: "Scale", description: "Grow the system as real usage arrives.", order: 7 },
  ]);

  await PhilosophyLine.deleteMany({});
  await PhilosophyLine.insertMany([
    { text: "Build things that matter.", order: 1 },
    { text: "Keep it simple.", order: 2 },
    { text: "Engineer for scale.", order: 3 },
    { text: "Performance is a feature.", order: 4 },
    { text: "Great software feels invisible.", order: 5 },
  ]);

  await Photo.deleteMany({});
  await Photo.insertMany([
    { src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80", caption: "At the desk", order: 1 },
    { src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=80", caption: "Mid-build", order: 2 },
    { src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=80", caption: "Sketching architecture", order: 3 },
  ]);

  await ProjectVideo.deleteMany({});
  await ProjectVideo.insertMany([
    { title: "A day in my workflow", duration: "1:24", thumb: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=700&q=80", src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", order: 1 },
    { title: "Why I build for education", duration: "0:52", thumb: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=700&q=80", src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", order: 2 },
    { title: "Quick studio tour", duration: "2:10", thumb: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=700&q=80", src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", order: 3 },
  ]);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
