import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Landmark, Send, Upload } from 'lucide-react';
import { usePageMotion } from '../hooks/usePageMotion';

const bankDetails = [
  { key: 'Bank Name', value: 'Bank of Ceylon' },
  { key: 'Account Name', value: 'Ayubowan Gifts Collection' },
  { key: 'Account Number', value: '0012 3456 7890' },
  { key: 'Branch', value: 'Colombo 03' },
  { key: 'SWIFT Code', value: 'BCEYLKLX' },
];

export default function Donate() {
  const rootRef = usePageMotion<HTMLDivElement>();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    remarks: '',
  });
  const [slipFileName, setSlipFileName] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSlipFileName(e.target.files?.[0]?.name ?? '');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert('Thank you for your donation! We will verify your payment and send you a confirmation shortly.');
    setFormData({ name: '', email: '', phone: '', amount: '', remarks: '' });
    setSlipFileName('');
  };

  return (
    <div ref={rootRef}>
      <section className="page-hero">
        <p className="eyebrow">Donate</p>
        <h1 className="heading-xl reveal-16" data-reveal data-delay="0">
          Help us build what&rsquo;s next.
        </h1>
        <p className="lead reveal-16" data-reveal data-delay="90">
          Your contribution helps us complete community and heritage projects across Sri Lanka.
        </p>
      </section>

      <section className="section section--tight">
        <div className="form-grid">
          <div className="reveal-32" data-reveal data-delay="0">
            <p className="eyebrow">Bank Details</p>
            <h2 className="heading-sm">Direct bank transfer</h2>
            <div className="card" style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div className="icon-badge">
                  <Landmark />
                </div>
                <p className="card-title" style={{ marginTop: 0 }}>
                  Ayubowan Gifts Collection
                </p>
              </div>
              <ul className="info-list">
                {bankDetails.map((row) => (
                  <li key={row.key}>
                    <span className="info-key">{row.key}</span>
                    <span className="info-value">{row.value}</span>
                  </li>
                ))}
              </ul>
              <p className="caption-muted">
                After transferring, please fill in the form with your payment slip so we can
                confirm your donation.
              </p>
            </div>
          </div>

          <div className="reveal-32" data-reveal data-delay="120">
            <p className="eyebrow">Donation Details</p>
            <h2 className="heading-sm">Tell us about your gift</h2>
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
                <label htmlFor="phone">Contact Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+94 77 123 4567"
                />
              </div>
              <div className="field">
                <label htmlFor="amount">Donation Amount *</label>
                <input
                  type="text"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  placeholder="LKR 5,000"
                />
              </div>
              <div className="field">
                <label htmlFor="remarks">Remarks</label>
                <textarea
                  id="remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Any message or dedication for your donation..."
                ></textarea>
              </div>
              <div className="field">
                <label htmlFor="slip">Upload Payment Slip *</label>
                <label htmlFor="slip" className="upload-field">
                  <Upload />
                  <span>{slipFileName || 'Choose a file (JPG, PNG or PDF)'}</span>
                </label>
                <input
                  type="file"
                  id="slip"
                  name="slip"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  required
                  className="field-file"
                />
              </div>
              <button type="submit" className="btn btn-block">
                <Send />
                Submit Donation
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
