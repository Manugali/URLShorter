"use client";

import { LoginForm } from "@/components/LoginForm";
import { SignupForm } from "@/components/SignupForm";
import { Link, Zap, Shield, BarChart3 } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`counter-${end}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [end]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, end, duration]);

  return (
    <span id={`counter-${end}`}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// Typewriter Component
function TypewriterText({ text, speed = 100 }: { text: string; speed?: number }) {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setIsComplete(true);
        // Remove cursor after a short delay
        setTimeout(() => setShowCursor(false), 1000);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span>
      {displayText}
      {showCursor && <span className="animate-pulse">|</span>}
    </span>
  );
}

// Live URL Shortener Demo Component
function LiveUrlShortener({ setIsSignup }: { setIsSignup: (value: boolean) => void }) {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasUsedDemo, setHasUsedDemo] = useState(false);

  // Check if user has already used the demo
  useEffect(() => {
    const demoUsed = localStorage.getItem('demo-used');
    if (demoUsed === 'true') {
      setHasUsedDemo(true);
    }
  }, []);

  const handleShorten = async () => {
    if (!url) return;
    
    // Check if user has already used the demo
    if (hasUsedDemo) {
      setError('Demo limit reached. Sign up for unlimited URL shortening!');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setShortUrl(data.shortUrl);
        // Mark demo as used
        localStorage.setItem('demo-used', 'true');
        setHasUsedDemo(true);
      } else {
        setError(data.error || 'Failed to shorten URL');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-xl">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Link className="h-5 w-5 text-purple-400" />
        {hasUsedDemo ? 'Try it live - signup required for more!' : 'Try it live - no signup required!'}
      </h3>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={hasUsedDemo ? "Demo limit reached - Sign up for unlimited access!" : "Enter your long URL here..."}
            disabled={hasUsedDemo}
            className={`flex-1 px-4 py-3 rounded-lg text-white transition-all ${
              hasUsedDemo 
                ? 'bg-gray-600/50 border border-gray-500/50 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-700/50 border border-gray-600/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50'
            }`}
          />
          <button
            onClick={handleShorten}
            disabled={isLoading || !url || hasUsedDemo}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
          >
            {isLoading ? 'Shortening...' : hasUsedDemo ? 'Sign Up Required' : 'Shorten'}
          </button>
        </div>
        
        {hasUsedDemo && (
          <div className="text-center">
            <p className="text-purple-400 text-sm font-medium">
              🎉 Demo complete! Sign up above for unlimited URL shortening
            </p>
          </div>
        )}
        
        {error && (
          <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-800/50">
            {error}
          </div>
        )}
        
        {shortUrl && (
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Your short URL:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shortUrl}
                readOnly
                className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LandingPageContent() {
  const searchParams = useSearchParams();
  const [isSignup, setIsSignup] = useState(false);

  // Check if we should show signup mode from URL params
  useEffect(() => {
    if (searchParams.get('mode') === 'signup') {
      setIsSignup(true);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl shadow-lg shadow-purple-500/25">
              <Link className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              Shortly
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="max-w-6xl w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[600px] animate-fade-in-up">
          {/* Left Side - Hero Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-6">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent leading-tight">
                <TypewriterText text="Shorten URLs" speed={150} />
                <br />
                <span className="text-purple-400">
                  <TypewriterText text="Instantly" speed={150} />
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Create short, memorable links that are easy to share and track. 
                Perfect for social media, marketing campaigns, and more.
              </p>
            </div>

            {/* Live Demo */}
            <LiveUrlShortener setIsSignup={setIsSignup} />

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="group relative flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-700/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer">
                <Zap className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                <span className="text-white font-medium group-hover:text-purple-100 transition-colors duration-300">Lightning Fast</span>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 w-64 text-center">
                  Generate short URLs in milliseconds with our optimized infrastructure. No waiting, no delays.
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
              
              <div className="group relative flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-700/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer">
                <Shield className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                <span className="text-white font-medium group-hover:text-purple-100 transition-colors duration-300">Secure</span>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 w-64 text-center">
                  Enterprise-grade security with encrypted links and privacy protection. Your data is always safe.
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
              
              <div className="group relative flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-700/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer">
                <BarChart3 className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                <span className="text-white font-medium group-hover:text-purple-100 transition-colors duration-300">Analytics</span>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 w-64 text-center">
                  Track clicks, locations, and engagement with detailed analytics. Make data-driven decisions.
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-6 py-8 border-t border-gray-700/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  <AnimatedCounter end={10000} suffix="+" />
                </div>
                <div className="text-sm text-gray-400">URLs Shortened</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  <AnimatedCounter end={99.9} suffix="%" />
                </div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  <AnimatedCounter end={1} suffix="ms" />
                </div>
                <div className="text-sm text-gray-400">Response Time</div>
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-4">
              <p className="text-lg text-gray-300">
                Ready to get started? {isSignup ? 'Create an account' : 'Sign in'} to create your first short URL.
              </p>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Toggle Button */}
            <div className="flex bg-gray-800/50 rounded-lg p-1 shadow-lg">
              <button
                onClick={() => setIsSignup(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  !isSignup
                    ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignup(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  isSignup
                    ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Sign Up
              </button>
            </div>
            
            {/* Auth Form */}
            {isSignup ? <SignupForm /> : <LoginForm />}
          </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-sm border-t border-gray-800/50 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 Shortly. Built with Next.js, Tailwind CSS, and Prisma.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          <span className="text-xl text-white">Loading...</span>
        </div>
      </div>
    }>
      <LandingPageContent />
    </Suspense>
  );
}
