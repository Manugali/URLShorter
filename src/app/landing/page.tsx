"use client";

import { LoginForm } from "@/components/LoginForm";
import { SignupForm } from "@/components/SignupForm";
import { Link, Zap, Shield, BarChart3, ExternalLink, Copy, Clock, Upload, CheckCircle, ArrowRight } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const element = document.getElementById(`counter-${end}`);
    if (element) {
      observer.observe(element);
    }

    // Fallback for mobile - start animation after a short delay if not triggered by intersection
    const fallbackTimer = setTimeout(() => {
      if (!hasAnimated) {
        setIsVisible(true);
        setHasAnimated(true);
      }
    }, 1000);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [end, hasAnimated]);

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
function TypewriterText({ text, speed = 100, coloredText = "", coloredStart = 0 }: { text: string; speed?: number; coloredText?: string; coloredStart?: number }) {
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

  const renderText = () => {
    if (coloredText && displayText.length > coloredStart) {
      const beforeColored = text.slice(0, coloredStart);
      const coloredPart = displayText.slice(coloredStart);
      const remainingColored = coloredText.slice(0, coloredPart.length);
      
      return (
        <>
          {beforeColored}
          <span className="text-purple-400">{remainingColored}</span>
        </>
      );
    }
    return displayText;
  };

  return (
    <span>
      {renderText()}
      {showCursor && <span className="animate-pulse text-purple-400">|</span>}
    </span>
  );
}

// Floating URL Card Component
function FloatingUrlCard({ 
  originalUrl, 
  shortUrl, 
  clicks, 
  delay = 0
}: { 
  originalUrl: string; 
  shortUrl: string; 
  clicks: number; 
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } transition-all duration-1000 ease-out`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 shadow-xl
        ${isHovered ? 'scale-105 shadow-2xl shadow-purple-500/20' : 'scale-100'}
        transition-all duration-300 ease-out
        animate-float
        max-w-xs
      `}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-purple-500/20 rounded-lg">
            <Link className="h-4 w-4 text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-400 font-medium">Recently Shortened</div>
            <div className="text-xs text-gray-500">2 minutes ago</div>
          </div>
          <div className="flex items-center gap-1 text-xs text-green-400">
            <Clock className="h-3 w-3" />
            <span>Live</span>
          </div>
        </div>

        {/* Original URL */}
        <div className="mb-2">
          <div className="text-xs text-gray-400 mb-1">Original URL</div>
          <div className="text-sm text-white truncate bg-gray-700/50 rounded px-2 py-1">
            {originalUrl}
          </div>
        </div>

        {/* Short URL */}
        <div className="mb-3">
          <div className="text-xs text-gray-400 mb-1">Short URL</div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-purple-400 font-mono bg-purple-500/10 rounded px-2 py-1 flex-1 truncate">
              {shortUrl}
            </div>
            <button className="p-1 hover:bg-gray-700/50 rounded transition-colors cursor-pointer">
              <Copy className="h-3 w-3 text-gray-400 hover:text-white" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-gray-400">
            <ExternalLink className="h-3 w-3" />
            <span>{clicks} clicks</span>
          </div>
          <div className="flex items-center gap-1 text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Floating Cards Container
function FloatingCardsContainer() {
  const [currentCard, setCurrentCard] = useState(0);
  
  const urlExamples = [
    {
      originalUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      shortUrl: "short.ly/rickroll",
      clicks: 1247
    },
    {
      originalUrl: "https://github.com/vercel/next.js",
      shortUrl: "short.ly/nextjs",
      clicks: 892
    },
    {
      originalUrl: "https://www.amazon.com/dp/B08N5WRWNW",
      shortUrl: "short.ly/amazon-deal",
      clicks: 634
    },
    {
      originalUrl: "https://docs.microsoft.com/en-us/azure/",
      shortUrl: "short.ly/azure-docs",
      clicks: 421
    },
    {
      originalUrl: "https://stackoverflow.com/questions/ask",
      shortUrl: "short.ly/so-help",
      clicks: 298
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % urlExamples.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-1/2 right-8 transform -translate-y-1/2 flex flex-col space-y-6 w-80">
      <FloatingUrlCard 
        {...urlExamples[currentCard]}
        delay={0}
      />
      <FloatingUrlCard 
        {...urlExamples[(currentCard + 1) % urlExamples.length]}
        delay={800}
      />
      <FloatingUrlCard 
        {...urlExamples[(currentCard + 2) % urlExamples.length]}
        delay={1600}
      />
    </div>
  );
}

// Drag and Drop URL Shortener Component
function DragDropUrlShortener({ setIsSignup }: { setIsSignup: (value: boolean) => void }) {
  const [draggedUrl, setDraggedUrl] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isOverDropZone, setIsOverDropZone] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasUsedDemo, setHasUsedDemo] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Check if user has already used the demo
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const demoUsed = localStorage.getItem('demo-used');
      if (demoUsed === 'true') {
        setHasUsedDemo(true);
      }
    }
  }, []);

  const handleDragStart = (e: React.DragEvent, url: string) => {
    setDraggedUrl(url);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', url);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedUrl('');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOverDropZone(true);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = () => {
    setIsOverDropZone(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsOverDropZone(false);
    setIsDragging(false);
    
    if (hasUsedDemo) {
      setIsSignup(true);
      return;
    }

    const url = e.dataTransfer.getData('text/plain');
    if (!url) return;

    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setShortenedUrl(data.shortUrl);
        setIsCompleted(true);
        
        // Mark demo as used
        if (typeof window !== 'undefined') {
          localStorage.setItem('demo-used', 'true');
        }
        setHasUsedDemo(true);
      } else {
        // Handle API error - show error state
        console.error('API Error:', data.error);
        // For demo purposes, still show a shortened URL
        const fallbackUrl = `short.ly/${Math.random().toString(36).substring(2, 8)}`;
        setShortenedUrl(fallbackUrl);
        setIsCompleted(true);
        setHasUsedDemo(true);
      }
    } catch (error) {
      console.error('Network Error:', error);
      // Fallback to demo URL
      const fallbackUrl = `short.ly/${Math.random().toString(36).substring(2, 8)}`;
      setShortenedUrl(fallbackUrl);
      setIsCompleted(true);
      setHasUsedDemo(true);
    } finally {
      setIsProcessing(false);
    }
  };

  // Mobile tap-to-shorten handler
  const handleMobileUrlTap = async (url: string) => {
    if (hasUsedDemo) {
      setIsSignup(true);
      return;
    }

    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setShortenedUrl(data.shortUrl);
        setIsCompleted(true);
        
        // Mark demo as used
        if (typeof window !== 'undefined') {
          localStorage.setItem('demo-used', 'true');
        }
        setHasUsedDemo(true);
      } else {
        console.error('Failed to shorten URL:', data.error);
      }
    } catch (error) {
      console.error('Error shortening URL:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shortenedUrl);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shortenedUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Show a fallback message or handle the error gracefully
      alert('Failed to copy to clipboard. Please copy manually: ' + shortenedUrl);
    }
  };

  const sampleUrls = [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://github.com/vercel/next.js",
    "https://www.amazon.com/dp/B08N5WRWNW",
    "https://docs.microsoft.com/en-us/azure/",
    "https://stackoverflow.com/questions/ask"
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-xl">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Upload className="h-5 w-5 text-purple-400" />
        <span className="hidden sm:inline">Drag & Drop URL Shortening</span>
        <span className="sm:hidden">Tap to Shorten URLs</span>
      </h3>
      
      <div className="space-y-6">
         {/* Sample URLs to Drag - Desktop Only */}
         <div className="hidden sm:block space-y-3">
           <p className="text-sm text-gray-400">Drag any URL below to the drop zone:</p>
           <div className="grid grid-cols-1 gap-2">
             {sampleUrls.map((url, index) => (
               <div
                 key={index}
                 draggable={!hasUsedDemo}
                 onDragStart={(e) => handleDragStart(e, url)}
                 onDragEnd={handleDragEnd}
                 className={`p-3 bg-gray-700/50 rounded-lg border border-gray-600/50 cursor-grab active:cursor-grabbing transition-all duration-200 ${
                   hasUsedDemo 
                     ? 'opacity-50 cursor-not-allowed' 
                     : 'hover:bg-gray-600/50 hover:border-purple-500/50 hover:scale-105 active:scale-95'
                 } ${isDragging && draggedUrl === url ? 'opacity-50 scale-95' : ''}`}
               >
                 <div className="flex items-center gap-2">
                   <Link className="h-4 w-4 text-purple-400 flex-shrink-0" />
                   <span className="text-sm text-white truncate">{url}</span>
                 </div>
               </div>
             ))}
           </div>
         </div>

         {/* Mobile URL Selection & Result Display */}
         <div className="sm:hidden">
           {!hasUsedDemo && !isProcessing && !isCompleted ? (
             <div className="space-y-3">
               <p className="text-sm text-gray-400">Tap any URL below to shorten it:</p>
               <div className="grid grid-cols-1 gap-2">
                 {sampleUrls.map((url, index) => (
                   <div
                     key={index}
                     onClick={() => handleMobileUrlTap(url)}
                     className="p-3 bg-gray-700/50 rounded-lg border border-gray-600/50 transition-all duration-200 hover:bg-gray-600/50 hover:border-purple-500/50 hover:scale-105 active:scale-95 cursor-pointer"
                   >
                     <div className="flex items-center gap-2">
                       <Link className="h-4 w-4 text-purple-400 flex-shrink-0" />
                       <span className="text-sm text-white truncate">{url}</span>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           ) : isProcessing ? (
             <div className="text-center space-y-4 py-6">
               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-400 mx-auto"></div>
               <p className="text-purple-400 font-medium">Shortening URL...</p>
             </div>
           ) : isCompleted ? (
             <div className="space-y-4 py-4">
               <div className="text-center">
                 <CheckCircle className="h-10 w-10 text-green-400 mx-auto mb-3" />
                 <p className="text-green-400 font-medium mb-4">URL Shortened Successfully!</p>
               </div>
               <div className="bg-gray-800/50 rounded-lg p-4">
                 <div className="text-sm text-gray-400 mb-2">Your short URL:</div>
                 <div className="flex flex-col gap-2">
                   <div className="text-purple-400 font-mono text-sm break-all">{shortenedUrl}</div>
                   <button
                     onClick={copyToClipboard}
                     className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                       isCopied 
                         ? 'bg-green-500 hover:bg-green-600' 
                         : 'bg-purple-600 hover:bg-purple-700'
                     }`}
                   >
                     {isCopied ? '✓ Copied!' : 'Copy'}
                   </button>
                 </div>
               </div>
               <p className="text-center text-sm text-purple-400">Demo complete! Sign up for unlimited URL shortening</p>
             </div>
           ) : hasUsedDemo ? (
             <div className="text-center space-y-4 py-6">
               <Upload className="h-10 w-10 text-gray-500 mx-auto" />
               <p className="text-gray-400">Demo limit reached</p>
               <p className="text-sm text-purple-400">Sign up above for unlimited URL shortening</p>
             </div>
           ) : null}
         </div>

        {/* Drop Zone - Desktop Only */}
        <div
          data-drop-zone
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`hidden sm:block relative p-8 rounded-xl border-2 border-dashed transition-all duration-300 ${
            isOverDropZone
              ? 'border-purple-500 bg-purple-500/10 scale-105'
              : hasUsedDemo
              ? 'border-gray-600 bg-gray-700/30'
              : 'border-gray-600 bg-gray-700/30 hover:border-purple-400 hover:bg-purple-500/5'
          }`}
        >
          {isProcessing ? (
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
              <p className="text-purple-400 font-medium">Shortening URL...</p>
            </div>
          ) : isCompleted ? (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
              <div className="space-y-3">
                <p className="text-green-400 font-medium">URL Shortened Successfully!</p>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">Your short URL:</div>
                  <div className="flex items-center gap-2">
                    <div className="text-purple-400 font-mono text-lg flex-1 truncate">{shortenedUrl}</div>
                    <button
                      onClick={copyToClipboard}
                      className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                        isCopied 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : 'bg-purple-600 hover:bg-purple-700'
                      }`}
                    >
                      {isCopied ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-purple-400">Demo complete! Sign up for unlimited URL shortening</p>
              </div>
            </div>
          ) : hasUsedDemo ? (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <Upload className="h-12 w-12 text-gray-500" />
              </div>
              <p className="text-gray-400">Demo limit reached</p>
              <p className="text-sm text-purple-400">Sign up above for unlimited URL shortening</p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <ArrowRight className="h-12 w-12 text-purple-400" />
              </div>
              <p className="text-white font-medium">Drop URL here to shorten</p>
              <p className="text-sm text-gray-400">Drag any URL from above to this area</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Live URL Shortener Demo Component
function LiveUrlShortener({ setIsSignup }: { setIsSignup: (value: boolean) => void }) {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasUsedDemo, setHasUsedDemo] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Check if user has already used the demo
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const demoUsed = localStorage.getItem('demo-used');
      if (demoUsed === 'true') {
        setHasUsedDemo(true);
      }
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
        if (typeof window !== 'undefined') {
          localStorage.setItem('demo-used', 'true');
        }
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

  const copyToClipboard = async () => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shortUrl);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shortUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      // Reset the copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Show a fallback message or handle the error gracefully
      alert('Failed to copy to clipboard. Please copy manually: ' + shortUrl);
    }
  };

  // Show loading state until client is ready
  if (!isClient) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-xl">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Link className="h-5 w-5 text-purple-400" />
          Try it live - no signup required!
        </h3>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              value=""
              readOnly
              placeholder="Enter your long URL here..."
              className="flex-1 px-4 py-3 rounded-lg text-white bg-gray-700/50 border border-gray-600/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
            />
            <button
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium transition-all duration-200 whitespace-nowrap"
            >
              Shorten
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-xl">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Link className="h-5 w-5 text-purple-400" />
        {hasUsedDemo ? 'Try it live - signup required for more!' : 'Try it live - no signup required!'}
      </h3>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
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
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:hover:scale-100 whitespace-nowrap cursor-pointer"
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
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={shortUrl}
                readOnly
                className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white text-sm"
              />
              <button
                onClick={copyToClipboard}
                className={`px-4 py-3 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap cursor-pointer ${
                  isCopied 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isCopied ? '✓ Copied!' : 'Copy'}
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
  const [currentSection, setCurrentSection] = useState('hero');

  // Check if we should show signup mode from URL params
  useEffect(() => {
    if (searchParams.get('mode') === 'signup') {
      setIsSignup(true);
    }
  }, [searchParams]);

  // Handle custom events from auth forms
  useEffect(() => {
    const handleSwitchToSignup = () => {
      setIsSignup(true);
      setCurrentSection('auth');
    };
    
    const handleSwitchToSignin = () => {
      setIsSignup(false);
      setCurrentSection('auth');
    };

    window.addEventListener('switchToSignup', handleSwitchToSignup);
    window.addEventListener('switchToSignin', handleSwitchToSignin);

    return () => {
      window.removeEventListener('switchToSignup', handleSwitchToSignup);
      window.removeEventListener('switchToSignin', handleSwitchToSignin);
    };
  }, []);

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
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl shadow-lg shadow-purple-500/25">
                <Link className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                Shortly
              </h1>
            </a>
            
             {/* Mobile Auth Buttons */}
             <div className="lg:hidden">
               <div className="flex items-center gap-2">
                 <button
                   type="button"
                   onClick={(e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     setCurrentSection('auth');
                     setIsSignup(false);
                   }}
                   className="px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all cursor-pointer"
                 >
                   Sign In
                 </button>
                 <button
                   type="button"
                   onClick={(e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     setCurrentSection('auth');
                     setIsSignup(true);
                   }}
                   className="px-3 py-1.5 text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all cursor-pointer"
                 >
                   Sign Up
                 </button>
               </div>
             </div>
          </div>
        </div>
      </header>

       {/* Mobile Navigation */}
       <div className="lg:hidden bg-black/50 backdrop-blur-sm border-b border-gray-800/50 sticky top-16 z-40">
         <div className="flex justify-center space-x-2 py-3 px-4">
           <button
             onClick={() => setCurrentSection('hero')}
             className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
               currentSection === 'hero' 
                 ? 'bg-purple-600 text-white shadow-lg' 
                 : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
             }`}
           >
             Demo
           </button>
           <button
             onClick={() => setCurrentSection('features')}
             className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
               currentSection === 'features' 
                 ? 'bg-purple-600 text-white shadow-lg' 
                 : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
             }`}
           >
             Features
           </button>
         </div>
       </div>

       {/* Hero Section */}
       <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-12 relative z-10">
         {/* Floating Cards - Desktop Only */}
         <div className="hidden lg:block">
           <FloatingCardsContainer />
         </div>
         
         <div className="max-w-6xl w-full">
           <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 items-center min-h-[250px] sm:min-h-[300px] lg:min-h-[500px] animate-fade-in-up">
          {/* Left Side - Hero Content */}
          <div className={`space-y-4 sm:space-y-6 text-center lg:text-left ${currentSection !== 'hero' ? 'lg:block hidden' : ''}`}>
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent leading-tight">
                <div className="inline-block min-w-full whitespace-nowrap">
                  <TypewriterText 
                    text="Shorten URLs Instantly" 
                    speed={150} 
                    coloredText="Instantly" 
                    coloredStart={13}
                  />
                </div>
              </h1>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Create short, memorable links that are easy to share and track. 
                Perfect for social media, marketing campaigns, and more.
              </p>
            </div>

            {/* Interactive Demo */}
            <DragDropUrlShortener setIsSignup={setIsSignup} />

            {/* Features - Desktop Only */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-3 gap-6">
                <div className="group relative flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-700/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer">
                  <Zap className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                  <span className="text-white font-medium group-hover:text-purple-100 transition-colors duration-300">Lightning Fast</span>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 pointer-events-none z-50 w-64 text-center">
                    Generate short URLs in milliseconds with our optimized infrastructure. No waiting, no delays.
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
                
                <div className="group relative flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-700/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer">
                  <Shield className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                  <span className="text-white font-medium group-hover:text-purple-100 transition-colors duration-300">Secure</span>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 pointer-events-none z-50 w-64 text-center">
                    Enterprise-grade security with encrypted links and privacy protection. Your data is always safe.
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
                
                <div className="group relative flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-700/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer">
                  <BarChart3 className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                  <span className="text-white font-medium group-hover:text-purple-100 transition-colors duration-300">Analytics</span>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 pointer-events-none z-50 w-64 text-center">
                    Track clicks, locations, and engagement with detailed analytics. Make data-driven decisions.
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>

               {/* Statistics - Desktop Only */}
               <div className="grid grid-cols-3 gap-4 py-4">
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
            </div>

             {/* CTA */}
             <div className="text-center">
               <p className="text-sm sm:text-base text-gray-300">
                 Ready to get started? {isSignup ? 'Create an account' : 'Sign in'} to create your first short URL.
               </p>
             </div>
          </div>

           {/* Features Section - Mobile Only */}
           <div className={`lg:hidden ${currentSection !== 'features' ? 'hidden' : ''}`}>
             <div className="space-y-6">
               <div className="text-center">
                 <h2 className="text-2xl font-bold text-white mb-2">Features</h2>
                 <p className="text-gray-300 text-sm">Everything you need to manage your URLs</p>
               </div>
               
               <div className="space-y-4">
                 <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                   <Zap className="h-6 w-6 text-purple-400 flex-shrink-0" />
                   <div>
                     <h3 className="text-white font-semibold text-sm">Lightning Fast</h3>
                     <p className="text-gray-400 text-xs">Generate short URLs in milliseconds with our optimized infrastructure.</p>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                   <Shield className="h-6 w-6 text-purple-400 flex-shrink-0" />
                   <div>
                     <h3 className="text-white font-semibold text-sm">Secure</h3>
                     <p className="text-gray-400 text-xs">Enterprise-grade security with encrypted links and privacy protection.</p>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                   <BarChart3 className="h-6 w-6 text-purple-400 flex-shrink-0" />
                   <div>
                     <h3 className="text-white font-semibold text-sm">Analytics</h3>
                     <p className="text-gray-400 text-xs">Track clicks, locations, and engagement with detailed analytics.</p>
                   </div>
                 </div>
               </div>

               {/* Statistics */}
               <div className="grid grid-cols-3 gap-3 py-4">
                 <div className="text-center">
                   <div className="text-xl font-bold text-purple-400">
                     <AnimatedCounter end={10000} suffix="+" />
                   </div>
                   <div className="text-xs text-gray-400">URLs Shortened</div>
                 </div>
                 <div className="text-center">
                   <div className="text-xl font-bold text-purple-400">
                     <AnimatedCounter end={99.9} suffix="%" />
                   </div>
                   <div className="text-xs text-gray-400">Uptime</div>
                 </div>
                 <div className="text-center">
                   <div className="text-xl font-bold text-purple-400">
                     <AnimatedCounter end={1} suffix="ms" />
                   </div>
                   <div className="text-xs text-gray-400">Response Time</div>
                 </div>
               </div>
             </div>
           </div>

          {/* Right Side - Auth Form */}
          <div className={`flex flex-col items-center justify-center space-y-4 ${currentSection !== 'auth' ? 'hidden lg:flex' : ''}`}>
            {/* Toggle Button - Desktop Only */}
            <div className="hidden lg:flex bg-gray-800/50 rounded-lg p-1 shadow-lg">
              <button
                onClick={() => setIsSignup(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 cursor-pointer ${
                  !isSignup
                    ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignup(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 cursor-pointer ${
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
       <footer className="bg-black/50 backdrop-blur-sm border-t border-gray-800/50 mt-8">
         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
           <div className="text-center text-gray-400">
             <p>&copy; 2024 Shortly. Transform long URLs into short, shareable links with enterprise-grade security and analytics.</p>
           </div>
         </div>
       </footer>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div suppressHydrationWarning>
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
    </div>
  );
}
