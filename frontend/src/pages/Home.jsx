import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import * as THREE from "three";
import {
  ArrowRight, Sparkles, Brain, Target, 
  LayoutDashboard, Users, TrendingUp, HandHeart
} from "lucide-react";

// --- Framer Motion Animation Variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const imageReveal = {
  hidden: { opacity: 0, scale: 0.95, filter: "blur(10px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 1, ease: "easeOut" } }
};

// --- Data ---
const ZIG_ZAG_FEATURES = [
  {
    tag: "Smart Matching",
    title: "Find your perfect cause, instantly.",
    body: "Our intelligent engine analyses 40+ skill dimensions to surface the highest-impact pairings between volunteers and NGOs. Stop searching and start doing.",
    image: "/img4.png",
    Icon: Brain,
    colorClass: "text-primary-600",
    bgClass: "bg-primary-50",
  },
  {
    tag: "Precision Filtering",
    title: "Volunteering on your own terms.",
    body: "Whether you have one hour a week or ten, our location, availability, and expertise filters ensure every opportunity suggested genuinely fits your lifestyle.",
    image: "/img2.png",
    Icon: Target,
    colorClass: "text-emerald-600",
    bgClass: "bg-emerald-50",
  },
  {
    tag: "Role-Based Dashboards",
    title: "Everything you need, nothing you don't.",
    body: "Experience dedicated, clutter-free views tailored exactly for your role. Track hours, communicate with teams, and measure your real-world impact seamlessly.",
    image: "/img3.png",
    Icon: LayoutDashboard,
    colorClass: "text-teal-600",
    bgClass: "bg-teal-50",
  },
];

const STEPS = [
  { n: "01", title: "Create your profile", sub: "Share your skills, availability, and the causes that move you." },
  { n: "02", title: "Get matched seamlessly", sub: "Our system connects you with NGOs that desperately need your exact expertise." },
  { n: "03", title: "Collaborate & track impact", sub: "Manage your volunteer hours, communicate with teams, and see your real-world impact." },
];

const CAUSES = [
  "Education", "Environment", "Healthcare", "Animal Welfare",
  "Disaster Relief", "Mental Health", "Food Security", "Human Rights"
];

// --- 3D Globe Component ---
function ThreeDCorner() {
  const mountRef = useRef(null);

  useEffect(() => {
    const w = 400;
    const h = 400;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const geometry = new THREE.IcosahedronGeometry(1.5, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x16a34a,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      sphere.rotation.x += 0.002;
      sphere.rotation.y += 0.003;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      ref={mountRef} 
      className="absolute top-0 right-0 -translate-y-16 translate-x-16 pointer-events-none z-0 hidden lg:block"
      style={{ width: '400px', height: '400px' }}
    />
  );
}

export default function Home() {
  // Scroll Progress Bar Logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-[#F9F6F0] font-sans text-slate-800 antialiased overflow-x-hidden selection:bg-primary-200 selection:text-primary-900 relative">
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 bg-primary-600 origin-left z-[100]" 
        style={{ scaleX }} 
      />

      {/* HEADER */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-[#F9F6F0]/80 backdrop-blur-md border-b border-[#E8E3D9]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 no-underline group">
            {/* Replaced Heart Icon with your public logo */}
            <img 
              src="/logo.png" 
              alt="VolunteerConnect Logo" 
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-300" 
            />
            <span className="font-display text-lg sm:text-xl text-slate-900 font-bold tracking-tight">
              VolunteerConnect
            </span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">
              Log in
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
        <ThreeDCorner />
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-primary-200/40 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            <motion.div 
              className="w-full lg:w-1/2 flex flex-col items-start"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeUp} className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-[#E8E3D9] shadow-sm text-primary-700 text-xs sm:text-sm font-bold tracking-wide backdrop-blur-sm">
                  <Sparkles size={14} className="text-primary-500" /> 
                  Humanizing Social Impact
                </span>
              </motion.div>
              
              <motion.h1 variants={fadeUp} className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-slate-900 mb-6">
                Connect your passion with <span className="text-primary-600 italic">purpose.</span>
              </motion.h1>
              
              <motion.p variants={fadeUp} className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-lg mb-10 font-medium">
                We bridge the gap between dedicated volunteers and transformative NGOs. Create real, lasting change in your community today.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 mb-12">
                <Link
                  to="/register?role=volunteer"
                  className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-2xl bg-primary-600 text-white font-bold text-base hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/20 transition-all duration-300"
                >
                  Join as Volunteer <ArrowRight size={18} />
                </Link>
                <Link
                  to="/register?role=ngo"
                  className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-2xl bg-white border border-[#E8E3D9] text-slate-700 font-bold text-base hover:border-primary-300 hover:text-primary-700 hover:shadow-md transition-all duration-300"
                >
                  Register an NGO
                </Link>
              </motion.div>
            </motion.div>

            <motion.div 
              className="w-full lg:w-1/2 relative"
              initial="hidden"
              animate="visible"
              variants={imageReveal}
            >
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-900/10 border-8 border-white">
                <img
                  src="/img1.png"
                  alt="Volunteers making an impact"
                  className="w-full h-auto object-cover aspect-[4/3] sm:aspect-square lg:aspect-[4/3] bg-[#E8E3D9] hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary-100 rounded-full z-0 border border-primary-200 pointer-events-none" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="bg-white border-y border-[#E8E3D9] py-5 overflow-hidden shadow-sm" aria-hidden="true">
        <div className="flex whitespace-nowrap" style={{ animation: 'slide 35s linear infinite' }}>
          {[...Array(4)].flatMap((_, gi) =>
            CAUSES.map((c) => (
              <span className="inline-flex items-center gap-8 px-6 text-sm font-bold text-slate-400 tracking-widest uppercase" key={`${c}-${gi}`}>
                {c} <span className="text-primary-300">✦</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ZIG-ZAG FEATURES SECTION */}
      <section className="py-24 lg:py-32 relative bg-[#F9F6F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center max-w-2xl mx-auto mb-20 lg:mb-32"
          >
            <p className="inline-flex items-center justify-center gap-2 text-sm font-bold text-primary-600 tracking-widest uppercase mb-4">
              <TrendingUp size={16} /> Why Choose Us
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-slate-900 font-bold tracking-tight">
              Designed for human connection.
            </h2>
          </motion.div>

          <div className="space-y-32">
            {ZIG_ZAG_FEATURES.map((feature, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div 
                  key={feature.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={staggerContainer}
                  className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${isEven ? '' : 'lg:flex-row-reverse'}`}
                >
                  {/* Text Content */}
                  <motion.div variants={fadeUp} className="w-full lg:w-1/2">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 shadow-sm border border-white ${feature.bgClass}`}>
                      <feature.Icon size={24} className={feature.colorClass} />
                    </div>
                    <p className={`text-sm font-bold uppercase tracking-widest mb-3 ${feature.colorClass}`}>
                      {feature.tag}
                    </p>
                    <h3 className="font-display text-3xl md:text-4xl text-slate-900 font-bold tracking-tight mb-6 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-slate-600 leading-relaxed font-medium">
                      {feature.body}
                    </p>
                  </motion.div>

                  {/* Image Graphic */}
                  <motion.div variants={imageReveal} className="w-full lg:w-1/2 relative">
                    <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-900/10 border-8 border-white group">
                      <img 
                        src={feature.image} 
                        alt={feature.title} 
                        className="w-full h-auto aspect-[4/3] object-cover bg-white group-hover:scale-105 transition-transform duration-700 ease-out" 
                      />
                      {/* Optional Overlay gradient for premium feel */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                    </div>
                    {/* Decorative Background Element */}
                    <div className={`absolute -inset-4 rounded-[3rem] opacity-30 blur-2xl z-0 ${feature.bgClass}`} />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-24 lg:py-32 bg-white border-y border-[#E8E3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
             <p className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 tracking-widest uppercase mb-4">
                <Users size={16} /> The Process
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-slate-900 font-bold tracking-tight mb-6">
                Three steps to transform your community.
              </h2>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-12 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-[#E8E3D9] z-0" />

            {STEPS.map((s, idx) => (
              <motion.div key={s.n} variants={fadeUp} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-[#E8E3D9] flex items-center justify-center font-display text-2xl font-bold text-slate-400 mb-8 shadow-sm group-hover:bg-primary-600 group-hover:border-primary-600 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium max-w-sm">{s.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 lg:py-32 relative overflow-hidden bg-[#F9F6F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-primary-900 rounded-[3rem] p-10 sm:p-16 lg:p-20 text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-800 to-primary-950 z-0" />
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary-500 rounded-full blur-[100px] z-0 opacity-50" />
            
            <div className="relative z-10">
              <HandHeart size={56} className="text-primary-300 mx-auto mb-8 animate-pulse" />
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white font-bold tracking-tight mb-6">
                Ready to make a difference?
              </h2>
              <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                Join thousands of dedicated volunteers and hundreds of organizations creating a better world, one connection at a time.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-5">
                <Link
                  to="/register?role=volunteer"
                  className="px-8 py-4 rounded-2xl bg-white text-primary-900 font-bold text-lg hover:bg-primary-50 hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  Start Volunteering
                </Link>
                <Link
                  to="/register?role=ngo"
                  className="px-8 py-4 rounded-2xl border-2 border-primary-600 text-white font-bold text-lg hover:bg-primary-800 hover:border-primary-500 transition-all duration-300"
                >
                  Register NGO
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-[#E8E3D9] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-3 no-underline mb-6">
                 <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                <span className="font-display text-xl text-slate-900 font-bold">
                  VolunteerConnect
                </span>
              </Link>
              <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
                Empowering communities by connecting passionate individuals with impactful non-profit organizations globally.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Platform</h4>
              <ul className="space-y-4">
                <li><Link to="/about" className="text-slate-500 hover:text-primary-600 font-medium transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-slate-500 hover:text-primary-600 font-medium transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="text-slate-500 hover:text-primary-600 font-medium transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Get Involved</h4>
              <ul className="space-y-4">
                <li><Link to="/register?role=volunteer" className="text-slate-500 hover:text-primary-600 font-medium transition-colors">Become a Volunteer</Link></li>
                <li><Link to="/register?role=ngo" className="text-slate-500 hover:text-primary-600 font-medium transition-colors">Register NGO</Link></li>
                <li><Link to="/login" className="text-slate-500 hover:text-primary-600 font-medium transition-colors">Sign In</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#E8E3D9] pt-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 font-medium text-sm">
              © {new Date().getFullYear()} VolunteerConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Global CSS animation for the ticker */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}