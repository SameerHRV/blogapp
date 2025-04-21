import React from "react";

const marqueeItems = [
  { name: "Fast Publishing", icon: "⚡" },
  { name: "SEO Optimized", icon: "🔍" },
  { name: "Responsive Design", icon: "📱" },
  { name: "Custom Domains", icon: "🌐" },
  { name: "Analytics", icon: "📊" },
  { name: "Markdown Support", icon: "📝" },
  { name: "Image Optimization", icon: "🖼️" },
  { name: "Dark Mode", icon: "🌙" },
  { name: "Social Sharing", icon: "🔗" },
  { name: "Comments", icon: "💬" },
];

const MarqueeSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 mb-8">
        <h2 className="text-4xl font-extrabold text-center mb-2 text-primary drop-shadow-lg">Packed with Features</h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto text-lg">
          Everything you need to create and manage your blog, all in one place.
        </p>
      </div>

      {/* Single Infinite Marquee */}
      <div className="relative w-full overflow-hidden">
        <div className="animate-marquee flex w-fit gap-8 py-6">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <div
              key={`marquee-${index}`}
              className="flex items-center justify-center px-8 py-4 rounded-xl bg-white/80 border border-primary/10 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 flex-shrink-0"
            >
              <span className="text-3xl mr-3">{item.icon}</span>
              <span className="font-semibold text-primary">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default MarqueeSection;
