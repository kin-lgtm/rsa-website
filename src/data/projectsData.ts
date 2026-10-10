export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  status: 'Completed' | 'Planned';
  location: string;
  year: string;
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'Road Safety Awareness Workshop',
    description:
      'Jointly organized by the District Secretariat Kilinochchi and the Rotary Club of Kilinochchi Town at the Conference Hall, building regional stakeholder momentum.',
    image: '/gallery-1.JPG',
    status: 'Completed',
    location: 'District Secretariat, Kilinochchi',
    year: '2026',
  },
  {
    id: '2',
    title: 'Murugananda School Road Safety Campaign',
    description:
      'A grassroots road safety awareness session organized at Murugananda School, Murasumoddai, igniting the community initiative to protect student pedestrians.',
    image: '/gallery-2.png',
    status: 'Completed',
    location: 'Murasumoddai, Kilinochchi',
    year: '2024',
  },
  {
    id: '3',
    title: 'Driver Training Track Development (Phase 1)',
    description:
      'Construction of the 1.5 km closed-loop physical driver training track on Lot 2 (4.0 acres), featuring roundabouts, intersections, signals, and maneuvering bays.',
    image: '/facility-track.jpg',
    status: 'Planned',
    location: 'Umaiyalpuram, Kilinochchi',
    year: '2026 – 2027',
  },
  {
    id: '4',
    title: 'High-Fidelity Simulation Labs (Phase 2)',
    description:
      'Permanent simulation suites featuring multi-screen cockpits replicating rain, mist, night driving, and critical emergency response in a zero-risk virtual setting.',
    image: '/facility-simulation.jpg',
    status: 'Planned',
    location: 'Umaiyalpuram, Kilinochchi',
    year: '2027 – 2028',
  },
  {
    id: '5',
    title: 'Cargo Weighbridge & Roller Brake Tester (Phase 2)',
    description:
      'Axle-load weighing deck and computerized roller brake tester (RBT) to train commercial vehicle drivers, evaluate braking force, and support regulatory inspections.',
    image: '/facility-inspection.jpg',
    status: 'Planned',
    location: 'Umaiyalpuram, Kilinochchi',
    year: '2027 – 2028',
  },
  {
    id: '6',
    title: 'Academic & Administrative Campus (Phase 3)',
    description:
      '7,000 sq.ft building blending Northern local architecture, featuring multimedia lecture halls, central CCTV observation tower, residential lodging, and cafeteria.',
    image: '/facility-campus.jpg',
    status: 'Planned',
    location: 'Umaiyalpuram, Kilinochchi',
    year: '2028+',
  },
];
