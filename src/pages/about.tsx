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

const teamMembers = [
  {
    name: 'Mr. Aloysious Santhiapillai',
    role: 'Project Champion & Senior Accident Investigator (Bergen, Norway)',
    initials: 'AS',
  },
  {
    name: 'Mr. S. Muralitharan',
    role: 'Government Agent & District Secretary, Kilinochchi',
    initials: 'SM',
  },
  {
    name: 'Rtn. R. Kajendrakumar',
    role: 'Project Lead, Rotary Club of Kilinochchi Town',
    initials: 'RK',
  },
  {
    name: 'Rtn. (Eng., Dr.) T. Sivakumar',
    role: 'Secretary - RSA & Lead Coordinator',
    initials: 'TS',
  },
  {
    name: 'Eng. (Dr.) Tissa U. Liyanage',
    role: 'Team Leader / Highway & Traffic Engineer (Mhec)',
    initials: 'TL',
  },
  {
    name: 'Eng. Gayashan Dalpethado',
    role: 'Civil Design Engineer (Geometric & Drainage)',
    initials: 'GD',
  },
  {
    name: 'Eng. H. M. G. G. Bandara',
    role: 'Transportation Planner (Traffic Simulation)',
    initials: 'GB',
  },
  {
    name: 'Eng. Kelum De Silva',
    role: 'Electrical & ICT Engineer (CCTV, GPS & Simulators)',
    initials: 'KS',
  },
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
          Driver Training &amp; Road Safety Institute &bull; Kilinochchi, Sri Lanka
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

      <section id="origin" className="section section--tight">
        <p className="eyebrow">The Origin &amp; Background</p>
        <h2 className="heading-lg reveal-32" data-reveal data-delay="0">
          A Bilateral Vision for Sri Lanka&rsquo;s Roads.
        </h2>
        <p className="lead reveal-16" data-reveal data-delay="90" style={{ maxWidth: '85ch', marginTop: '1rem' }}>
          Road safety remains an urgent crisis across Sri Lanka, where inadequate training infrastructure contributes to over 2,500 fatal accidents every year (~6.5 deaths each day). Recognising this severe gap, the Academy was established as a public&ndash;private civic partnership to bring international road safety standards to the Northern Province.
        </p>

        <div className="card-grid cols-3" style={{ marginTop: '2.5rem' }}>
          <div className="card reveal-32" data-reveal data-delay="0">
            <span className="story-index">01</span>
            <p className="card-title">Norwegian &ldquo;Vision Zero&rdquo; Expertise</p>
            <p className="body-muted">
              Initiated by Mr. Aloysious Santhiapillai, retired Chief Engineer from the Vehicle Management &amp; Traffic Accident Investigation Unit of the Norwegian Public Roads Administration (Bergen, Norway). The initiative introduces Scandinavia&rsquo;s renowned Vision Zero principle — designing forgiving transport systems where human error does not lead to death.
            </p>
          </div>

          <div className="card reveal-32" data-reveal data-delay="90">
            <span className="story-index">02</span>
            <p className="card-title">Rotary Club of Kilinochchi Town</p>
            <p className="body-muted">
              Deeply shaken by attending numerous funerals of friends, family, and community members lost to road traffic accidents in Kilinochchi, the Rotary Club of Kilinochchi Town (District 3220) embraced the proposal as a flagship civic mission to transform regional driver education.
            </p>
          </div>

          <div className="card reveal-32" data-reveal data-delay="180">
            <span className="story-index">03</span>
            <p className="card-title">5-Acre Government Land Allocation</p>
            <p className="body-muted">
              Presented to Mr. S. Muralitharan, the Government Agent of Kilinochchi District, who responded decisively by sanctioning 5.0 acres in Umaiyalpuram: Lot 1 (1.0 acre) for administration, classrooms, and simulation labs, and Lot 2 (4.0 acres) for a 1.5 km closed-loop physical driver training track.
            </p>
          </div>
        </div>
      </section>

      <section id="principles" className="section section--tight">
        <p className="eyebrow">Operational Philosophy</p>
        <h2 className="heading-lg reveal-32" data-reveal data-delay="0">
          Safety. Realism. Efficiency.
        </h2>
        <div className="card-grid cols-3" style={{ marginTop: '2.5rem' }}>
          <div className="card reveal-32" data-reveal data-delay="0">
            <p className="card-title">Safety First</p>
            <p className="body-muted">
              A risk-free, controlled simulation environment allowing trainees to master hazard perception, vehicle stability, and defensive reactions before driving on public highways.
            </p>
          </div>
          <div className="card reveal-32" data-reveal data-delay="90">
            <p className="card-title">Real-World Realism</p>
            <p className="body-muted">
              Purpose-built track elements mirroring actual Sri Lankan road networks: 4-lane &amp; 2-lane divided carriageways, roundabouts, railway crossings, pedestrian pelican crossings, and skid control zones.
            </p>
          </div>
          <div className="card reveal-32" data-reveal data-delay="180">
            <p className="card-title">Operational Efficiency</p>
            <p className="body-muted">
              A structured 4-stage pedagogical framework transitioning students from theory and virtual simulation to closed-loop physical track control and standardized competency assessment.
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

      <section id="leadership" className="section section--tight">
        <p className="eyebrow">Governance &amp; Project Leadership</p>
        <h2 className="heading-lg reveal-32" data-reveal data-delay="0">
          The team driving the vision.
        </h2>
        <div className="team-grid">
          {teamMembers.map((member, i) => (
            <div key={member.name} className="team-card reveal-32" data-reveal data-delay={(i % 4) * 90}>
              <div className="team-avatar">{member.initials}</div>
              <p className="team-name">{member.name}</p>
              <p className="team-role">{member.role}</p>
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
