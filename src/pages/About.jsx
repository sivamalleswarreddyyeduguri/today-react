// import React from 'react';
// import '../styles/About.css';

// const About = () => {
//   return (
//     <div className="about-page">
//       {/* Hero */}
//       <section className="hero">
//         <div className="hero-inner">
//           <h1>The Ultimate Guide to Quality Inspection in Manufacturing</h1>
//           <p className="date">November 30th, 2025</p>
//           <p className="lead">Delivering consistent product quality is an absolute necessity – not an option.</p>
//           <p className="lead-muted">A single defective item can severely tarnish a brand’s reputation and erode hard-earned customer trust.</p>
//         </div>
//       </section>

//       {/* Intro */}
//       <section className="content-section">
//         <div className="prose">
//           <p>
//             This is where the vital significance of quality inspection comes into play – a meticulous process that acts as the gatekeeper for product excellence.
//           </p>
//         </div>
//       </section>

//       {/* Key Highlights */}
//       <section className="content-section">
//         <h2>Key Highlights</h2>
//         <ul className="pill-list">
//           <li>Understanding its fundamental principles</li>
//           <li>Implementing cutting-edge inspection technologies</li>
//           <li>Knowledge and tools necessary to elevate your quality control</li>
//           <li>Various types of quality inspections</li>
//           <li>Best practices, statistical sampling methods</li>
//           <li>Practical tips</li>
//         </ul>
//       </section>

//       {/* Fundamentals */}
//       <section className="content-section">
//         <h2>Mastering the Fundamentals: What is Quality Inspection?</h2>
//         <p>
//           Quality inspection refers to the process of examining, testing, measuring, and evaluating products or services against pre-defined standards and specifications.
//         </p>
//         <p>
//           This crucial undertaking ensures that what is being produced meets the required levels of quality, safety, and performance before reaching end-users.
//         </p>
//         <p>
//           While often used interchangeably, quality inspection is distinct from quality control and quality assurance.
//           Quality control encompasses the entire framework of activities and techniques aimed at preventing defects, whereas quality inspection focuses specifically on evaluating the final product or service against established criteria.
//         </p>
//         <p>
//           Quality assurance, on the other hand, refers to the overarching processes and systems that govern quality management within an organization, ensuring that products consistently meet customer requirements and industry standards.
//         </p>
//       </section>

//       {/* Process Cards (inspired by screenshot 1) */}
//       <section className="cards-section">
//         <h2>Quality Inspection Process</h2>
//         <div className="cards-grid">
//           <article className="card blue">
//             <h3>Incoming Material Inspections</h3>
//             <ul>
//               <li>Visual Inspection</li>
//               <li>Dimensional Checks</li>
//               <li>Material Testing</li>
//             </ul>
//           </article>

//           <article className="card green">
//             <h3>In-Process Checks</h3>
//             <ul>
//               <li>Process Monitoring</li>
//               <li>Intermediate Inspections</li>
//               <li>Defect Tracking</li>
//             </ul>
//           </article>

//           <article className="card red">
//             <h3>Final Product Evaluations</h3>
//             <ul>
//               <li>Functional Testing</li>
//               <li>Compliance Verification</li>
//               <li>Packaging Inspection</li>
//             </ul>
//           </article>
//         </div>
//       </section>

//       {/* Ring Diagram (inspired by screenshot 2) */}
//       <section className="ring-section">
//         <h2>Quality Inspection</h2>
//         <div className="ring">
//           <div className="center">🔍</div>
//           <div className="ring-item" style={{'--i': 0}}>Inspect Materials</div>
//           <div className="ring-item" style={{'--i': 1}}>Identify Defects</div>
//           <div className="ring-item" style={{'--i': 2}}>Implement Quality Checks</div>
//           <div className="ring-item" style={{'--i': 3}}>Enhance</div>
//           <div className="ring-item" style={{'--i': 4}}>Reduce</div>
//           <div className="ring-item" style={{'--i': 5}}>Maintain Reputation</div>
//           <div className="ring-item" style={{'--i': 6}}>Gain Competitive Advantage</div>
//         </div>
//       </section>

//       {/* Lifecycle */}
//       <section className="content-section">
//         <h2>The Quality Inspection Lifecycle: Types and Timing</h2>
//         <p>
//           Quality inspections are not a one-time event but rather an ongoing process that spans the entire product lifecycle.
//           Different types of inspections are conducted at various stages to ensure quality is maintained from the procurement of raw materials to the final delivery of finished goods.
//         </p>
//       </section>

//       {/* Newsletter style CTA */}
//       <section className="cta">
//         <div className="cta-card">
//           <h3>Stay up to date</h3>
//           <p>Get the latest articles and tips on quality inspection.</p>
//           <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
//             <input type="email" placeholder="Enter your email" aria-label="Email address" />
//             <button type="submit">Subscribe</button>
//           </form>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default About;


import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/About.css';

const About = () => {
  const navigate = useNavigate();

  // 🔧 JS-safe state (no TypeScript generic here)
  const [tab, setTab] = useState('none'); // 'none' | 'how' | 'features'

  // Re-trigger animation when tab changes
  const animKey = useMemo(() => `${tab}-${Date.now()}`, [tab]);

  const goHome = () => navigate('/login');

  return (
    <div className="about-page">
      {/* ===== Top Text Bar (white text) ===== */}
      <div className="about-topbar">
        <button
          type="button"
          className={`topbar-link ${tab === 'how' ? 'active' : ''}`}
          onClick={() => setTab('how')}
          aria-label="Show How it works"
        >
          How it works
        </button>

        <button
          type="button"
          className={`topbar-link ${tab === 'features' ? 'active' : ''}`}
          onClick={() => setTab('features')}
          aria-label="Show Features"
        >
          Features
        </button>

        <button
          type="button"
          className="topbar-link"
          onClick={goHome}
          aria-label="Go to Home (Login)"
        >
          Home
        </button>
      </div>

      {/* ===== Animated inline section container ===== */}
      <div className="inline-animate-wrapper">
        {tab === 'how' && (
          <div key={animKey} className="inline-animate-card slide-in">
            <h3>How it works</h3>
            <div className="how-grid">
              <div className="how-item">
                <h4>1. Receive Materials</h4>
                <p>Materials arrive and are tagged to vendors and plants.</p>
              </div>
              <div className="how-item">
                <h4>2. Create Inspection Lots</h4>
                <p>System or inspector creates lots with standard characteristics.</p>
              </div>
              <div className="how-item">
                <h4>3. Capture Actuals</h4>
                <p>Inspectors measure characteristics and upload supporting files.</p>
              </div>
              <div className="how-item">
                <h4>4. Auto Evaluate</h4>
                <p>Pass/Fail is auto-calculated using tolerance limits.</p>
              </div>
              <div className="how-item">
                <h4>5. Report & Status</h4>
                <p>Remarks, status updates, and PDF report generated for records.</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'features' && (
          <div key={animKey} className="inline-animate-card fade-in">
            <h3>Features</h3>
            <ul className="features-list">
              <li>Role-based access for Admin, Inspector, and Vendor</li>
              <li>Master data: Plant, Material, Vendor, Characteristics</li>
              <li>Auto Lot ID generation & full audit trail</li>
              <li>Tolerance-based Pass/Fail evaluation</li>
              <li>PDF reports (OpenPDF) & Excel exports (Apache POI)</li>
              <li>Attachments: photos, test reports, certificates</li>
              <li>Clean UI with animated sections on this About page</li>
            </ul>
          </div>
        )}
      </div>

      {/* ===== Your existing content (unchanged) ===== */}

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <h1>The Ultimate Guide to Quality Inspection in Manufacturing</h1>
          <p className="date">November 30th, 2025</p>
          <p className="lead">
            Delivering consistent product quality is an absolute necessity – not an option.
          </p>
          <p className="lead-muted">
            A single defective item can severely tarnish a brand’s reputation and erode hard-earned customer trust.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="content-section">
        <div className="prose">
          <p>
            This is where the vital significance of quality inspection comes into play – a meticulous process that acts as the gatekeeper for product excellence.
          </p>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="content-section">
        <h2>Key Highlights</h2>
        <ul className="pill-list">
          <li>Understanding its fundamental principles</li>
          <li>Implementing cutting-edge inspection technologies</li>
          <li>Knowledge and tools necessary to elevate your quality control</li>
          <li>Various types of quality inspections</li>
          <li>Best practices, statistical sampling methods</li>
          <li>Practical tips</li>
        </ul>
      </section>

      {/* Fundamentals */}
      <section className="content-section">
        <h2>Mastering the Fundamentals: What is Quality Inspection?</h2>
        <p>
          Quality inspection refers to the process of examining, testing, measuring, and evaluating
          products or services against pre-defined standards and specifications.
        </p>
        <p>
          This crucial undertaking ensures that what is being produced meets the required levels of
          quality, safety, and performance before reaching end-users.
        </p>
        <p>
          While often used interchangeably, quality inspection is distinct from quality control and
          quality assurance. Quality control encompasses the entire framework of activities and
          techniques aimed at preventing defects, whereas quality inspection focuses specifically on
          evaluating the final product or service against established criteria.
        </p>
        <p>
          Quality assurance, on the other hand, refers to the overarching processes and systems that
          govern quality management within an organization, ensuring that products consistently meet
          customer requirements and industry standards.
        </p>
      </section>

      {/* Process Cards */}
      <section className="cards-section">
        <h2>Quality Inspection Process</h2>
        <div className="cards-grid">
          <article className="card blue">
            <h3>Incoming Material Inspections</h3>
            <ul>
              <li>Visual Inspection</li>
              <li>Dimensional Checks</li>
              <li>Material Testing</li>
            </ul>
          </article>

          <article className="card green">
            <h3>In-Process Checks</h3>
            <ul>
              <li>Process Monitoring</li>
              <li>Intermediate Inspections</li>
              <li>Defect Tracking</li>
            </ul>
          </article>

          <article className="card red">
            <h3>Final Product Evaluations</h3>
            <ul>
              <li>Functional Testing</li>
              <li>Compliance Verification</li>
              <li>Packaging Inspection</li>
            </ul>
          </article>
        </div>
      </section>

      {/* Ring Diagram */}
      <section className="ring-section">
        <h2>Quality Inspection</h2>
        <div className="ring">
          <div className="center">🔍</div>
          <div className="ring-item" style={{ '--i': 0 }}>Inspect Materials</div>
          <div className="ring-item" style={{ '--i': 1 }}>Identify Defects</div>
          <div className="ring-item" style={{ '--i': 2 }}>Implement Quality Checks</div>
          <div className="ring-item" style={{ '--i': 3 }}>Enhance</div>
          <div className="ring-item" style={{ '--i': 4 }}>Reduce</div>
          <div className="ring-item" style={{ '--i': 5 }}>Maintain Reputation</div>
          <div className="ring-item" style={{ '--i': 6 }}>Gain Competitive Advantage</div>
        </div>
      </section>

      {/* Lifecycle */}
      <section className="content-section">
        <h2>The Quality Inspection Lifecycle: Types and Timing</h2>
        <p>
          Quality inspections are not a one-time event but rather an ongoing process that spans the
          entire product lifecycle. Different types of inspections are conducted at various stages to
          ensure quality is maintained from the procurement of raw materials to the final delivery of
          finished goods.
        </p>
      </section>

      {/* Newsletter style CTA */}
      <section className="cta">
        <div className="cta-card">
          <h3>Stay up to date</h3>
          <p>Get the latest articles and tips on quality inspection.</p>
          <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" aria-label="Email address" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default About;
