import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Navigation, ExternalLink, Building2 } from 'lucide-react';
import { usePageMotion } from '../hooks/usePageMotion';

interface LocationInfo {
  id: 'office' | 'site';
  label: string;
  icon: typeof MapPin;
  title: string;
  address: string;
  landmark: string;
  query: string;
  embedUrl: string;
}

const LOCATIONS: LocationInfo[] = [
  {
    id: 'office',
    label: 'Office & Secretariat',
    icon: Building2,
    title: 'RSA Head Office & Secretariat',
    address: 'No. 52, MSP Pre-School, Anandanagar, Kilinochchi 44000, Sri Lanka',
    landmark: 'Central Kilinochchi administrative base for correspondence & registrations.',
    query: 'No. 52, MSP Pre-School, Anandanagar, Kilinochchi, Sri Lanka',
    embedUrl:
      'https://maps.google.com/maps?q=Anandanagar%2C+Kilinochchi%2C+Sri+Lanka&t=&z=15&ie=UTF8&iwloc=&output=embed',
  },
  {
    id: 'site',
    label: 'Training Site (5 Acres)',
    icon: Navigation,
    title: 'Institute Training Track & Campus',
    address: 'Umaiyalpuram, Kandawalai DS Division, Kilinochchi, Sri Lanka',
    landmark: '5-acre project campus along A9 Highway (Kandy-Jaffna) & Northern Railway line.',
    query: 'Umaiyalpuram, Kilinochchi, Sri Lanka',
    embedUrl:
      'https://maps.google.com/maps?q=Umaiyalpuram%2C+Kilinochchi%2C+Sri+Lanka&t=&z=14&ie=UTF8&iwloc=&output=embed',
  },
];

const infoCards = [
  {
    icon: MapPin,
    title: 'Address',
    lines: [
      'No. 52, MSP Pre-School',
      'Anandanagar, Post Code: 44000',
      'Kilinochchi, Sri Lanka.',
    ],
  },
  {
    icon: Phone,
    title: 'Phone',
    lines: ['+94 7777911944'],
  },
  {
    icon: Mail,
    title: 'Email',
    lines: ['roadsafetyacademy.lk@gmail.com'],
  },
  {
    icon: Clock,
    title: 'Secretary - RSA',
    lines: ['Rtn. (Eng., Dr.) T. Sivakumar'],
  },
];

const reasons = [
  'Road safety education and awareness programs',
  'Driver training & auditing inquiries',
  'Community empowerment & ambassador initiatives',
  'Crash victim support & counseling referrals',
  'Partnerships, research & advocacy collaborations',
];

export default function Contact() {
  const rootRef = usePageMotion<HTMLDivElement>();
  const [activeLocId, setActiveLocId] = useState<'office' | 'site'>('office');
  const activeLoc = LOCATIONS.find((l) => l.id === activeLocId) ?? LOCATIONS[0];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div ref={rootRef}>
      <section className="page-hero">
        <p className="eyebrow">Contact Us</p>
        <h1 className="heading-xl reveal-16" data-reveal data-delay="0">
          Let&rsquo;s build safer roads together.
        </h1>
        <p className="lead reveal-16" data-reveal data-delay="90">
          Have questions about the Academy, driver training programs, or wish to collaborate? Reach out to our team in Kilinochchi.
        </p>
      </section>

      <section className="section section--tight">
        <div className="card-grid cols-4">
          {infoCards.map((card, i) => (
            <div key={card.title} className="card reveal-32" data-reveal data-delay={i * 90}>
              <div className="icon-badge">
                <card.icon />
              </div>
              <p className="card-title">{card.title}</p>
              <p className="body-muted">
                {card.lines.map((line, li) => (
                  <span key={li}>
                    {line}
                    {li < card.lines.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--tight">
        <div className="form-grid">
          <div className="reveal-32" data-reveal data-delay="0">
            <p className="eyebrow">Get In Touch</p>
            <h2 className="heading-sm">Send us a message</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
              <div className="field">
                <label htmlFor="name">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+94 77 123 4567"
                />
              </div>
              <div className="field">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help you?"
                />
              </div>
              <div className="field">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Your message here..."
                ></textarea>
              </div>
              <button type="submit" className="btn btn-block">
                <Send />
                Send Message
              </button>
            </form>
          </div>

          <div className="reveal-32" data-reveal data-delay="120">
            <p className="eyebrow">Find Us</p>
            <h2 className="heading-sm">Visit the Office &amp; Site</h2>

            <div className="map-card">
              <div className="map-tabs" role="tablist">
                {LOCATIONS.map((loc) => {
                  const Icon = loc.icon;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      role="tab"
                      aria-selected={activeLocId === loc.id}
                      className={`map-tab-btn${activeLocId === loc.id ? ' active' : ''}`}
                      onClick={() => setActiveLocId(loc.id)}
                    >
                      <Icon />
                      <span>{loc.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="map-frame-wrapper">
                <iframe
                  title={activeLoc.title}
                  src={activeLoc.embedUrl}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <div className="map-meta-panel">
                <div className="map-meta-header">
                  <div className="map-meta-title">
                    <MapPin />
                    <span>{activeLoc.title}</span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeLoc.query)}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="map-directions-btn"
                  >
                    <span>Directions</span>
                    <ExternalLink />
                  </a>
                </div>
                <p className="map-meta-address">{activeLoc.address}</p>
                <p className="map-meta-context">{activeLoc.landmark}</p>
              </div>
            </div>
            <p className="eyebrow" style={{ marginTop: '2.5rem' }}>
              Why Contact Us?
            </p>
            <ul className="bullet-list">
              {reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
