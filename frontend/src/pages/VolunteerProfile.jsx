import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import {
  User, MapPin, Phone, Clock, CheckCircle,
  Edit2, Save, X, AlertCircle, Loader2, Sparkles, Briefcase, Heart, Plus
} from 'lucide-react';

/* ───── Animation Variants ───── */
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

/* ───── Premium Glass Classes ───── */
const glassCardClass = "bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_4px_24px_rgba(5,150,105,0.04)] rounded-[1.5rem] overflow-hidden";
const glassInputClass = "w-full bg-white/50 border border-white/80 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/90 transition-all backdrop-blur-sm shadow-inner placeholder:text-slate-400";
const glassLabelClass = "block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5 ml-1";

const PREDEFINED_SKILLS = ['Tree Planting', 'Teaching', 'Cleaning', 'Technical Support', 'Event Management', 'Graphic Design', 'Mentoring'];

/* ───────────────── Main Component ───────────────── */
export default function VolunteerProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [customSkill, setCustomSkill] = useState('');
  
  // Base State structure
  const [profile, setProfile] = useState({
    bio: '',
    skills: '', 
    interests: '', 
    location: '',
    phone: '',
    availability: '',
    gender: ''
  });

  const [formData, setFormData] = useState({ ...profile });

  useEffect(() => {
    let cancelled = false;
    async function fetchProfile() {
      try {
        const { data } = await api.get('/volunteer/profile');
        if (!cancelled) {
          const formattedData = {
            bio: data.bio || '',
            skills: Array.isArray(data.skills) ? data.skills.join(', ') : data.skills || '',
            interests: Array.isArray(data.interests) ? data.interests.join(', ') : data.interests || '',
            location: data.location || '',
            phone: data.phone || '',
            availability: data.availability || '',
            gender: data.gender || ''
          };
          setProfile(formattedData);
          setFormData(formattedData);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load profile. Please try refreshing.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchProfile();
    return () => { cancelled = true; };
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddCustomSkill = (e) => {
    e?.preventDefault();
    if (!customSkill.trim()) return;
    const currentSkills = formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    if (!currentSkills.includes(customSkill.trim())) {
      setFormData(prev => ({ ...prev, skills: [...currentSkills, customSkill.trim()].join(', ') }));
    }
    setCustomSkill('');
  };

  const removeSkill = (skillToRemove) => {
    const currentSkills = formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    setFormData(prev => ({ ...prev, skills: currentSkills.filter(s => s !== skillToRemove).join(', ') }));
  };

  const togglePredefinedSkill = (skill) => {
    const currentSkills = formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    if (currentSkills.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: currentSkills.filter(s => s !== skill).join(', ') }));
    } else {
      setFormData(prev => ({ ...prev, skills: [...currentSkills, skill].join(', ') }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean),
      };
      await api.put('/volunteer/profile', payload);
      setProfile(formData);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const skillsArray = profile.skills ? profile.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
  const interestsArray = profile.interests ? profile.interests.split(',').map(s => s.trim()).filter(Boolean) : [];
  
  // Determine Profile Image based on Gender
  const isFemale = profile.gender?.toLowerCase() === 'female';
  const profileImgSrc = isFemale ? '/p2.jpg' : '/p1.jpg';

  return (
    <div className="relative min-h-screen bg-[#F9F6F0] overflow-hidden py-6 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Ambient Background Blobs */}
      <div className="fixed top-[0%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-emerald-300/20 blur-[100px] pointer-events-none mix-blend-multiply animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-teal-200/25 blur-[120px] pointer-events-none mix-blend-multiply animate-[pulse_10s_ease-in-out_infinite_reverse]" />
      
      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        
        {loading ? (
           <div className="flex flex-col items-center justify-center py-32 h-[50vh]">
            <div className="relative w-12 h-12 flex items-center justify-center">
               <div className="absolute inset-0 rounded-full border-4 border-emerald-100"></div>
               <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
            </div>
            <span className="mt-4 text-xs font-bold tracking-widest text-emerald-600 uppercase">Fetching Profile...</span>
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
            
            {/* Error State */}
            {error && (
              <motion.div variants={fadeUp} className="bg-red-50/80 backdrop-blur-md border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-center gap-3 shadow-sm">
                <AlertCircle size={18} className="text-red-500" />
                <span className="font-medium">{error}</span>
              </motion.div>
            )}

            {/* ── Profile Header Card ── */}
            <motion.div variants={fadeUp} className={`${glassCardClass} p-6 md:p-8 relative overflow-visible`}>
              <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                <Sparkles size={100} className="text-emerald-600" />
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 p-1 shadow-md flex-shrink-0">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center relative overflow-hidden">
                    <img src={profileImgSrc} alt="Profile Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center shadow-sm">
                    <CheckCircle size={14} className="text-white" strokeWidth={3} />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 border border-white/80 shadow-sm text-emerald-700 text-[10px] font-bold tracking-widest uppercase mb-2 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active Volunteer
                  </div>
                  <h1 className="font-display text-3xl font-extrabold text-slate-800 tracking-tight leading-none mb-1.5">
                    {user?.name}
                  </h1>
                  <p className="text-sm font-bold text-slate-500">{user?.email}</p>
                </div>
                
                {/* Edit Button (Only visible in View mode) */}
                {!isEditing && (
                  <button
                    onClick={() => { setIsEditing(true); setFormData(profile); setError(null); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/60 border border-white/80 shadow-sm rounded-xl text-sm font-bold text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-md mt-4 sm:mt-0"
                  >
                    <Edit2 size={16} /> Edit Profile
                  </button>
                )}
              </div>
            </motion.div>

            {/* ── Content Area: View OR Edit ── */}
            <AnimatePresence mode="wait">
              {!isEditing ? (
                // =============== VIEW MODE ===============
                <motion.div
                  key="view"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeUp}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {/* Left Column (Bio & Tags) */}
                  <div className="md:col-span-2 space-y-6">
                    
                    {/* Biography */}
                    <div className={`${glassCardClass} p-6 md:p-8`}>
                      <div className="flex items-center gap-2 mb-4 text-emerald-700">
                        <User size={18} strokeWidth={2.5} />
                        <h2 className="font-display text-lg font-bold text-slate-800">Biography</h2>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        {profile.bio || "No biography provided yet. Click 'Edit Profile' to add a personal touch!"}
                      </p>
                    </div>

                    {/* Skills & Causes Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className={`${glassCardClass} p-6`}>
                        <div className="flex items-center gap-2 mb-4 text-blue-600">
                          <Briefcase size={18} strokeWidth={2.5} />
                          <h2 className="font-display text-base font-bold text-slate-800">Interests / Skills</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {skillsArray.length > 0 ? skillsArray.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-white/60 border border-white/80 rounded-lg text-xs font-bold text-slate-700 shadow-sm backdrop-blur-sm">
                              {skill}
                            </span>
                          )) : <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">None added</span>}
                        </div>
                      </div>
                      
                      <div className={`${glassCardClass} p-6`}>
                        <div className="flex items-center gap-2 mb-4 text-rose-500">
                          <Heart size={18} strokeWidth={2.5} />
                          <h2 className="font-display text-base font-bold text-slate-800">Causes Supported</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {interestsArray.length > 0 ? interestsArray.map((interest, idx) => (
                            <span key={idx} className="px-3 py-1 bg-rose-50/60 border border-rose-100/80 rounded-lg text-xs font-bold text-rose-700 shadow-sm backdrop-blur-sm">
                              {interest}
                            </span>
                          )) : <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">None added</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Details) */}
                  <div className="space-y-6">
                    <div className={`${glassCardClass} p-6 flex flex-col gap-6`}>
                      <h2 className="font-display text-base font-bold text-slate-800 mb-2 border-b border-slate-200/50 pb-4">Contact & Availability</h2>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-emerald-100/50 rounded-xl text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/50">
                          <MapPin size={18} strokeWidth={2} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
                          <p className="text-sm font-bold text-slate-800">{profile.location || "Not specified"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-100/50 rounded-xl text-blue-600 flex items-center justify-center shrink-0 border border-blue-200/50">
                          <Phone size={18} strokeWidth={2} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                          <p className="text-sm font-bold text-slate-800">{profile.phone || "Not specified"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-amber-100/50 rounded-xl text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/50">
                          <Clock size={18} strokeWidth={2} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">General Availability</p>
                          <p className="text-sm font-bold text-slate-800">{profile.availability || "Not specified"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                
                // =============== EDIT MODE ===============
                <motion.form
                  key="edit"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeUp}
                  onSubmit={handleSubmit}
                  className={`${glassCardClass} p-6 sm:p-8`}
                >
                  <div className="flex items-center justify-between mb-8 border-b border-white/60 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100/50 rounded-lg text-emerald-600">
                        <Edit2 size={20} />
                      </div>
                      <h2 className="font-display text-xl font-bold text-slate-800">Editing Profile Information</h2>
                    </div>
                    <button type="button" onClick={() => setIsEditing(false)} className="p-2 bg-white/40 hover:bg-white/80 border border-white/60 rounded-xl text-slate-500 hover:text-slate-800 transition-colors">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className={glassLabelClass}>Biography</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Tell organizations a little about who you are and why you volunteer..."
                        className={`${glassInputClass} resize-none`}
                      ></textarea>
                    </div>

                    {/* Interactive Interests/Skills Editor */}
                    <div className="md:col-span-2 bg-white/30 p-4 rounded-xl border border-white/50">
                      <label className={glassLabelClass}>Interests / Skills</label>
                      
                      <div className="mb-4">
                        <p className="text-xs text-slate-500 mb-2 font-medium">Select common skills or add your own:</p>
                        <div className="flex flex-wrap gap-2">
                          {PREDEFINED_SKILLS.map(skill => {
                            const currentSkills = formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
                            const isSelected = currentSkills.includes(skill);
                            return (
                              <button
                                type="button"
                                key={skill}
                                onClick={() => togglePredefinedSkill(skill)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 border ${
                                  isSelected 
                                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-md' 
                                    : 'bg-white/60 text-slate-600 border-white/80 hover:bg-white/90 hover:shadow-sm'
                                }`}
                              >
                                {skill}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex gap-2 items-center mb-4">
                        <input
                          type="text"
                          value={customSkill}
                          onChange={(e) => setCustomSkill(e.target.value)}
                          onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddCustomSkill(); } }}
                          placeholder="Add custom interest/skill..."
                          className={glassInputClass}
                        />
                        <button 
                          type="button" 
                          onClick={handleAddCustomSkill} 
                          className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition-colors"
                        >
                          <Plus size={20} />
                        </button>
                      </div>

                      {/* Display current skills as removable tags */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/50">
                        {formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean).map((skill, idx) => (
                          <span key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold">
                            {skill}
                            <button type="button" onClick={() => removeSkill(skill)} className="text-emerald-500 hover:text-emerald-700">
                              <X size={14} />
                            </button>
                          </span>
                        )) : <span className="text-xs text-slate-400">No skills added yet.</span>}
                      </div>
                    </div>

                    <div>
                      <label className={glassLabelClass}>Causes you care about <span className="text-slate-400 font-semibold normal-case">(Comma separated)</span></label>
                      <input
                        type="text"
                        name="interests"
                        value={formData.interests}
                        onChange={handleChange}
                        placeholder="e.g. Environment, Animal Welfare, Education"
                        className={glassInputClass}
                      />
                    </div>

                    <div>
                      <label className={glassLabelClass}>Location</label>
                      <div className="relative">
                        <MapPin size={18} className="absolute left-4 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="e.g. New York, NY"
                          className={`${glassInputClass} pl-12`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={glassLabelClass}>Phone Number</label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-4 top-2.5 text-slate-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 000-0000"
                          className={`${glassInputClass} pl-12`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={glassLabelClass}>Availability</label>
                      <div className="relative">
                        <Clock size={18} className="absolute left-4 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          name="availability"
                          value={formData.availability}
                          onChange={handleChange}
                          placeholder="e.g. Weekends only, Tuesday evenings"
                          className={`${glassInputClass} pl-12`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="mt-10 flex justify-end gap-3 pt-6 border-t border-white/60">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      disabled={saving}
                      className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-white/40 hover:bg-white/80 border border-white/60 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-8 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      {saving ? 'Saving...' : 'Save Profile Details'}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}