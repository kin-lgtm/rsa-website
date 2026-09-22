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
    title: 'Artisan Skills Training Program',
    description:
      'A hands-on training initiative that equipped local artisans with advanced weaving and batik techniques, helping preserve traditional craftsmanship for the next generation.',
    image: '/gallery-1.JPG',
    status: 'Completed',
    location: 'Kandy, Sri Lanka',
    year: '2023',
  },
  {
    id: '2',
    title: 'Tea Estate Community Support',
    description:
      'Provided clean water access and school supplies to families working across three tea estates in the central highlands.',
    image: '/gallery-2.JPG',
    status: 'Completed',
    location: 'Nuwara Eliya, Sri Lanka',
    year: '2022',
  },
  {
    id: '3',
    title: 'Heritage Craft Documentation',
    description:
      'Recorded and archived traditional handicraft techniques from senior artisans to safeguard cultural knowledge for future generations.',
    image: '/gallery-3.JPG',
    status: 'Completed',
    location: 'Colombo, Sri Lanka',
    year: '2021',
  },
  {
    id: '4',
    title: 'Women Artisan Cooperative',
    description:
      'Established a cooperative workspace giving women artisans fair access to tools, materials and markets for their handmade products.',
    image: '/gallery-4.JPG',
    status: 'Planned',
    location: 'Galle, Sri Lanka',
    year: '2026',
  },
  {
    id: '5',
    title: 'Rural Craft Education Centre',
    description:
      'A proposed learning centre offering free craft and business training to young people in rural communities.',
    image: '/gallery-5.JPG',
    status: 'Planned',
    location: 'Matara, Sri Lanka',
    year: '2026',
  },
];
