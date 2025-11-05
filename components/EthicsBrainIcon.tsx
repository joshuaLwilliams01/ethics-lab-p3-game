'use client';

export default function EthicsBrainIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Brain silhouette */}
      <defs>
        <linearGradient id="brainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="1" />
          <stop offset="30%" stopColor="#14B8A6" stopOpacity="1" />
          <stop offset="60%" stopColor="#3B82F6" stopOpacity="1" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="1" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Central brain */}
      <path
        d="M 100 20 Q 130 30 140 50 Q 145 70 145 90 Q 145 110 140 130 Q 135 150 125 165 Q 115 180 100 185 Q 85 180 75 165 Q 65 150 60 130 Q 55 110 55 90 Q 55 70 60 50 Q 65 30 100 20 Z"
        fill="url(#brainGradient)"
        filter="url(#glow)"
      />
      
      {/* Central divide line */}
      <line
        x1="100"
        y1="25"
        x2="100"
        y2="180"
        stroke="#FFFFFF"
        strokeWidth="2"
        opacity="0.8"
      />
      
      {/* Neural pathway dots */}
      <circle cx="90" cy="50" r="2" fill="#FFFFFF" opacity="0.9" />
      <circle cx="110" cy="55" r="2" fill="#FFFFFF" opacity="0.9" />
      <circle cx="95" cy="80" r="2.5" fill="#FFFFFF" opacity="0.9" />
      <circle cx="105" cy="85" r="2.5" fill="#FFFFFF" opacity="0.9" />
      <circle cx="100" cy="110" r="3" fill="#FFFFFF" opacity="0.9" />
      <circle cx="90" cy="130" r="2" fill="#FFFFFF" opacity="0.9" />
      <circle cx="110" cy="135" r="2" fill="#FFFFFF" opacity="0.9" />
      <circle cx="95" cy="155" r="2" fill="#FFFFFF" opacity="0.9" />
      <circle cx="105" cy="160" r="2" fill="#FFFFFF" opacity="0.9" />
      
      {/* Connected concept spheres */}
      {/* Ethics - Top Left */}
      <g>
        <circle cx="40" cy="40" r="18" fill="#10B981" opacity="0.7" stroke="#FFFFFF" strokeWidth="2" />
        <text x="40" y="45" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">ETHICS</text>
        <line x1="60" y1="40" x2="85" x2="85" y2="50" stroke="#333" strokeWidth="1.5" opacity="0.5" />
      </g>
      
      {/* Efficiency - Top Right */}
      <g>
        <circle cx="160" cy="50" r="18" fill="#14B8A6" opacity="0.7" stroke="#FFFFFF" strokeWidth="2" />
        <text x="160" y="55" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">EFFICIENCY</text>
        <line x1="142" y1="50" x2="115" x2="115" y2="60" stroke="#333" strokeWidth="1.5" opacity="0.5" />
      </g>
      
      {/* Security - Bottom Left */}
      <g>
        <circle cx="50" cy="150" r="18" fill="#3B82F6" opacity="0.7" stroke="#FFFFFF" strokeWidth="2" />
        <text x="50" y="155" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">SECURITY</text>
        <line x1="68" y1="150" x2="85" x2="85" y2="140" stroke="#333" strokeWidth="1.5" opacity="0.5" />
      </g>
      
      {/* Growth - Bottom Right */}
      <g>
        <circle cx="150" cy="160" r="18" fill="#8B5CF6" opacity="0.7" stroke="#FFFFFF" strokeWidth="2" />
        <text x="150" y="165" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">GROWTH</text>
        <line x1="132" y1="160" x2="115" x2="115" y2="150" stroke="#333" strokeWidth="1.5" opacity="0.5" />
      </g>
      
      {/* Connecting lines between spheres */}
      <line x1="58" y1="40" x2="142" y2="50" stroke="#333" strokeWidth="1" opacity="0.3" />
      <line x1="68" y1="150" x2="132" y2="160" stroke="#333" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

