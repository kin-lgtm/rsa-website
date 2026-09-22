import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { usePageMotion } from '../hooks/usePageMotion';

const infoCards = [
  {
    icon: MapPin,
    title: 'Address',
    lines: ['123 Galle Road', 'Colombo 03', 'Sri Lanka'],
  },
  {
    icon: Phone,
    title: 'Phone',
    lines: ['+94 11 234 5678', '+94 77 123 4567'],
  },
  {
    icon: Mail,
    title: 'Email',
    lines: ['info@ayubowan.lk', 'support@ayubowan.lk'],
  },
  {
    icon: Clock,
    title: 'Business Hours',
    lines: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 9:00 AM - 2:00 PM'],
  },
];

const reasons = [
  'Custom orders and bulk purchases',
  'Product inquiries and availability',
  'International shipping information',
  'Partnership and wholesale opportunities',
  'General support and assistance',
];

export default function Contact() {
  const rootRef = usePageMotion<HTMLDivElement>();
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
          Let&rsquo;s talk heritage.
        </h1>
        <p className="lead reveal-16" data-reveal data-delay="90">
          Have questions? We&rsquo;d love to hear from you. Send us a message and we&rsquo;ll
          respond as soon as possible.
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
            <h2 className="heading-sm">Visit the store</h2>
            <div className="map-placeholder">
              <MapPin />
              <p>Map will be displayed here</p>
              <p className="map-sub">Google Maps Integration</p>
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
