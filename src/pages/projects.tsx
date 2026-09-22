import { useState } from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { projects } from '../data/projectsData';
import { usePageMotion } from '../hooks/usePageMotion';
import { useLiquidImages } from '../hooks/useLiquidImages';

type StatusFilter = 'All' | 'Completed' | 'Planned';
const FILTERS: StatusFilter[] = ['All', 'Completed', 'Planned'];

export default function Projects() {
  const rootRef = usePageMotion<HTMLDivElement>();
  useLiquidImages(rootRef);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('All');

  const filteredProjects =
    selectedStatus === 'All' ? projects : projects.filter((p) => p.status === selectedStatus);

  return (
    <div ref={rootRef}>
      <section className="page-hero">
        <p className="eyebrow">Our Projects</p>
        <h1 className="heading-xl reveal-16" data-reveal data-delay="0">
          Community, built to last.
        </h1>
        <p className="lead reveal-16" data-reveal data-delay="90">
          Heritage and community initiatives we have completed, and the ones we are planning
          next.
        </p>
      </section>

      <section className="section section--tight">
        <div className="filter-tabs">
          {FILTERS.map((status) => (
            <button
              key={status}
              className={`filter-tab${selectedStatus === status ? ' active' : ''}`}
              onClick={() => setSelectedStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="project-grid">
          {filteredProjects.map((project, i) => (
            <div key={project.id} className="reveal-32" data-reveal data-delay={(i % 3) * 100}>
              <div className="project-liquid">
                <span className={`status-badge${project.status === 'Completed' ? ' completed' : ''}`}>
                  {project.status}
                </span>
                <div
                  className="liquid"
                  style={{ position: 'absolute', inset: 0 }}
                  data-alt={project.title}
                  data-src={project.image}
                ></div>
              </div>
              <p className="project-title">{project.title}</p>
              <p className="project-desc">{project.description}</p>
              <div className="project-meta">
                <span>
                  <MapPin />
                  {project.location}
                </span>
                <span>
                  <Calendar />
                  {project.year}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <p className="body-muted" style={{ marginTop: '3rem', textAlign: 'center' }}>
            No projects found for this status.
          </p>
        )}
      </section>
    </div>
  );
}
