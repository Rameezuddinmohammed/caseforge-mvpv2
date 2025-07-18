'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Trophy, 
  Target, 
  BookOpen, 
  Zap, 
  Clock,
  Star,
  Mail,
  TrendingUp,
  Play
} from 'lucide-react';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [joinedCount, setJoinedCount] = useState(1247);

  // Animated counter for joined users
  useEffect(() => {
    const timer = setInterval(() => {
      setJoinedCount(prev => prev + Math.floor(Math.random() * 3));
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitted(true);
    setIsLoading(false);
    setJoinedCount(prev => prev + 1);
  };

  const domains = ['Strategy', 'Finance', 'Marketing', 'Operations', 'Consulting'];
  const [currentDomain, setCurrentDomain] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDomain(prev => (prev + 1) % domains.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      title: "Real McKinsey Cases",
      description: "Practice with actual cases from top consulting firms",
      icon: <Target className="w-5 h-5" />
    },
    {
      title: "AI-Powered Feedback",
      description: "Get instant, personalized feedback on your solutions",
      icon: <Zap className="w-5 h-5" />
    },
    {
      title: "Gamified Learning",
      description: "Earn XP, unlock achievements, and climb leaderboards",
      icon: <Trophy className="w-5 h-5" />
    },
    {
      title: "Live Practice Sessions",
      description: "Practice with peers in real-time interview simulations",
      icon: <Users className="w-5 h-5" />
    }
  ];

  const stats = [
    { value: "10,000+", label: "Cases Solved" },
    { value: "94%", label: "Success Rate" },
    { value: "2.5x", label: "Faster Learning" },
    { value: "500+", label: "Companies" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "McKinsey Intern",
      text: "Caseforge got me ready for my McKinsey interview. The gamification made practice actually fun!",
      initials: "SC"
    },
    {
      name: "David Kumar",
      role: "BCG Associate",
      text: "The AI feedback was incredibly detailed. It's like having a personal case coach 24/7.",
      initials: "DK"
    },
    {
      name: "Emma Rodriguez",
      role: "Bain Consultant",
      text: "I improved my case performance by 40% in just 3 weeks. The structured approach works.",
      initials: "ER"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Subtle animated background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/5"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Caseforge</span>
          </div>
          <motion.div 
            className="flex items-center space-x-2 text-sm text-gray-300"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>{joinedCount.toLocaleString()} joined</span>
          </motion.div>
        </div>
      </motion.header>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 text-sm font-medium">
                <Star className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300">Join 10,000+ future consultants</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Master Business Cases
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Like Never Before
                </span>
              </h1>
              
              <div className="text-xl md:text-2xl text-gray-300">
                Practice{' '}
                <motion.span 
                  key={currentDomain}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-blue-400 font-semibold"
                >
                  {domains[currentDomain]}
                </motion.span>
                {' '}cases with AI-powered feedback
              </div>
              
              <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Get ready for McKinsey, BCG, and Bain interviews with our gamified platform. 
                Practice real cases, get instant feedback, and land your dream consulting job.
              </p>
            </motion.div>

            {/* Waitlist Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="mt-10 max-w-md mx-auto"
            >
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                          className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-11 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 min-w-[140px]"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isLoading ? (
                          <motion.div
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                        ) : (
                          <>
                            <span>Join Waitlist</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </motion.button>
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                      Join {joinedCount.toLocaleString()}+ ambitious students preparing for consulting interviews
                    </p>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-center py-8"
                  >
                    <motion.div
                      className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.6 }}
                    >
                      <CheckCircle className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2">You're In! 🎉</h3>
                    <p className="text-gray-400">
                      We'll notify you when Caseforge launches. Get ready to ace those interviews!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                  className="p-4"
                >
                  <div className="text-3xl font-bold text-blue-400 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Why Top Students Choose Caseforge</h2>
              <p className="text-gray-400 text-lg">The most advanced case practice platform ever built</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                  className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/40 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">From Students to Consultants</h2>
              <p className="text-gray-400 text-lg">See how Caseforge helped them land their dream jobs</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                  className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {testimonial.initials}
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-sm">{testimonial.name}</div>
                      <div className="text-xs text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">"{testimonial.text}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8"
            >
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Career?</h2>
              <p className="text-gray-400 mb-6 text-lg">
                Join thousands of students who are already practicing with Caseforge
              </p>
              <motion.button
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all flex items-center space-x-2 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <span>Get Early Access</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Caseforge</span>
          </div>
          <p className="text-gray-400 text-sm">&copy; 2025 Caseforge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}