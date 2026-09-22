import { usePageMotion } from '../hooks/usePageMotion';

const objectives = [
  {
    title: 'Education & Awareness',
    description:
      'To build road-safety knowledge, attitudes and awareness among children, youth, drivers and the wider public through structured educational programmes, campaigns and continuous learning initiatives.',
  },
  {
    title: 'Community Empowerment',
    description:
      'To engage communities as active partners in road safety, developing individuals, schools and community groups as Road Safety Ambassadors who promote safer behaviour and strengthen local ownership of road-safety initiatives.',
  },
  {
    title: 'Community Healing & Counselling',
    description:
      'To provide compassionate support to road-crash victims and affected families through counselling, appropriate financial or material assistance, referral networks and community-based support for recovery and reintegration.',
  },
  {
    title: 'Advocacy on Traffic Safety',
    description:
      'To engage government institutions, regulatory authorities, enforcement agencies, professional bodies, civil society and other stakeholders at local, provincial and national levels to promote coordinated road-safety action and sustainable policy change.',
  },
  {
    title: 'Road Safety Research',
    description:
      'To strengthen road-safety decision-making through scientific research, systematic data collection and analysis, innovation and knowledge dissemination, while developing researchers and professionals capable of sustaining evidence-based road-safety initiatives.',
  },
  {
    title: 'Driver Training',
    description:
      'To improve driver competence, discipline and responsible behaviour through structured theoretical instruction, simulation-based learning and practical training in controlled environments, progressively developing knowledge, skills, hazard perception and safe-driving behaviour.',
  },
  {
    title: 'Road Safety Auditing',
    description:
      'To develop professional capacity and promote a strong independent road-safety auditing culture, enabling systematic identification of safety risks and supporting continuous improvement of road infrastructure and the wider road environment.',
  },
];

const protectMap = [
  { letter: 'P', objective: 'EDUCATE with Purpose', expression: 'Purposeful Education' },
  { letter: 'R', objective: 'EMPOWER through Collaboration', expression: 'Responsible Empowerment' },
  { letter: 'O', objective: 'HEAL with Compassion', expression: 'Outreach with Compassion for Healing' },
  { letter: 'T', objective: 'ADVOCATE with Responsibility', expression: 'Transformative Advocacy' },
  { letter: 'E', objective: 'RESEARCH with Evidence', expression: 'Evidence-led Research' },
  { letter: 'C', objective: 'TRAIN for Behavioural Change', expression: 'Competency & Behavioural Change' },
  { letter: 'T', objective: 'AUDIT with integrity', expression: 'Trustworthy Auditing' },
];

const values = [
  {
    title: 'Life First',
    statement: 'Every life matters.',
    description:
      'We place the protection of human life and the prevention of road trauma at the heart of every decision, programme and action.',
  },
  {
    title: 'Responsibility',
    statement: 'Road safety is a shared responsibility.',
    description:
      'We encourage every road user, professional, institution and community to recognise their role and take responsibility for creating safer roads.',
  },
  {
    title: 'Learning & Behavioural Change',
    statement: 'Knowledge must lead to safer behaviour.',
    description:
      'We believe education, awareness, practical training and continuous learning should translate into responsible choices and safer road-user behaviour.',
  },
  {
    title: 'Community & Compassion',
    statement: 'We work with people, for people.',
    description:
      'We empower communities to become agents of change while extending dignity, care, counselling and support to those affected by road crashes.',
  },
  {
    title: 'Evidence & Innovation',
    statement: 'Our actions are guided by evidence.',
    description:
      'We value research, reliable data, professional knowledge, innovation and continuous evaluation as foundations for effective and sustainable road-safety solutions.',
  },
  {
    title: 'Independence & Integrity',
    statement: 'Safety comes before influence or interest.',
    description:
      'We uphold professional independence, impartiality, transparency and ethical practice, particularly in road-safety auditing, research and technical advice.',
  },
  {
    title: 'Collaboration for Sustainable Change',
    statement: 'Safer roads require collective action.',
    description:
      'We build partnerships among communities, academia, professionals, government institutions and other stakeholders to transform good initiatives into lasting road-safety improvements.',
  },
];

const identity = [
  { label: 'RSA Vision', value: 'Every Journey Safe. Every Life Valued.' },
  { label: 'RSA Core Principle', value: 'Life First' },
  { label: 'RSA Values', value: 'Protect' },
  { label: 'RSA Action', value: 'Seven Objectives' },
];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export default function About() {
  const rootRef = usePageMotion<HTMLDivElement>();

  return (
    <div ref={rootRef}>
      <section className="page-hero">
        <p className="eyebrow">About Us</p>
        <h1 className="heading-xl reveal-16" data-reveal data-delay="0">
          Road Safety Academy (RSA)
        </h1>
        <p className="lead reveal-16" data-reveal data-delay="90">
          Every Journey Safe. Every Life Valued.
        </p>
      </section>

      <section id="vision-mission" className="section">
        <div className="pillar-grid">
          <div className="pillar reveal-32" data-reveal data-delay="0">
            <p className="eyebrow">Vision</p>
            <p className="pillar-quote">
              Every Journey Safe. Every Life Valued.
            </p>
            <p className="body-muted">
              A Sri Lanka where every road user is knowledgeable, skilled and responsible; every
              community is empowered to champion road safety; and every journey has the best
              possible chance of ending safely.
            </p>
          </div>
          <div className="pillar reveal-32" data-reveal data-delay="90">
            <p className="eyebrow">Mission</p>
            <p className="pillar-quote">
              To build safer road users, safer communities and safer road systems through
              education, empowerment, training, research, advocacy, auditing and care.
            </p>
            <p className="body-muted">
              To save lives and reduce road traffic injuries by advancing road-safety education,
              empowering communities, developing competent and responsible drivers, supporting
              people affected by road crashes, advocating for safer policies and practices,
              strengthening evidence-based research, and promoting independent road-safety
              auditing.
            </p>
          </div>
        </div>
      </section>

      <section id="objectives" className="section section--tight section-divider">
        <p className="eyebrow">RSA Objectives</p>
        <h2 className="heading-lg reveal-32" data-reveal data-delay="0">
          Seven objectives, one mission.
        </h2>
        <div className="card-grid cols-4">
          {objectives.map((item, i) => (
            <div key={item.title} className="card reveal-32" data-reveal data-delay={(i % 4) * 90}>
              <span className="story-index">{pad(i + 1)}</span>
              <p className="card-title">{item.title}</p>
              <p className="body-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="protect" className="section section--tight">
        <p className="eyebrow">RSA Objective &ndash; Value Mapping</p>
        <h2 className="heading-lg reveal-32" data-reveal data-delay="0">
          We PROTECT Life.
        </h2>
        <div className="protect-grid">
          {protectMap.map((row, i) => (
            <div key={i} className="protect-row reveal-32" data-reveal data-delay={(i % 4) * 90}>
              <p className="protect-letter">{row.letter}</p>
              <p className="protect-objective">{row.objective}</p>
              <p className="protect-expression">
                {row.letter} &ndash; {row.expression}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="values" className="section section--tight">
        <p className="eyebrow">RSA Value Statements</p>
        <h2 className="heading-lg reveal-32" data-reveal data-delay="0">
          What we stand for.
        </h2>
        <div className="card-grid cols-4">
          {values.map((item, i) => (
            <div key={item.title} className="card reveal-32" data-reveal data-delay={(i % 4) * 90}>
              <span className="story-index">{pad(i + 1)}</span>
              <p className="card-title">{item.title}</p>
              <p className="statement">{item.statement}</p>
              <p className="body-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="identity" className="section section--tight">
        <p className="eyebrow">RSA Identity</p>
        <h2 className="heading-lg reveal-32" data-reveal data-delay="0">
          One line, four ways.
        </h2>
        <div className="identity-grid">
          {identity.map((item, i) => (
            <div key={item.label} className="identity-cell reveal-32" data-reveal data-delay={i * 90}>
              <p className="identity-label">{item.label}</p>
              <p className="identity-value">{item.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
