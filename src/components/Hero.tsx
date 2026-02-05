import { ShieldIcon } from './common/ShieldIcon';

export const Hero = () => {
  return (
    <header className="relative bg-gradient-to-br from-navy-dark via-navy-mid to-navy-dark overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-7 py-16 md:py-24">
        <div className="relative flex items-center justify-between gap-12">
          {/* Hero Content */}
          <div className="flex-1 max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-text">Master the </span>
              <em className="text-gold not-italic font-black">Network.</em>
              <br />
              <span className="text-text">Ace the Exam.</span>
            </h1>

            <p className="text-lg md:text-xl text-text-muted leading-relaxed mb-8 max-w-xl">
              A comprehensive CCNA 200-301 preparation platform. Study six core domains,
              practice with real exam questions, and simulate live network topologies.
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-3" role="list">
              {[
                { text: '6 Domains', label: 'Six study domains available' },
                { text: '12+ Questions', label: 'Over 12 practice questions' },
                { text: 'Network Lab', label: 'Interactive network lab' },
                { text: 'Progress Tracking', label: 'Track your progress' }
              ].map((badge, i) => (
                <span
                  key={i}
                  role="listitem"
                  aria-label={badge.label}
                  className="badge"
                >
                  {badge.text}
                </span>
              ))}
            </div>
          </div>

          {/* Hero Emblem */}
          <div className="hidden lg:block flex-shrink-0" aria-hidden="true">
            <div className="relative">
              <div className="absolute inset-0 bg-gold/10 blur-3xl rounded-full" />
              <ShieldIcon size={140} opacity={0.22} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
