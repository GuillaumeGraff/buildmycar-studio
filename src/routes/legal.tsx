import { createFileRoute } from '@tanstack/react-router';
import { pageHead } from '@/components/bmc/metadata';

export const Route = createFileRoute('/legal')({ head: () => pageHead('Legal notice', 'Publisher and legal information for the BuildMyCar website.'), component: Legal });

function Legal() {
  return <div className="page">
    <div className="wrap narrow page-head"><span className="label">Information</span><h2>Legal <em>notice</em></h2></div>
    <div className="wrap narrow legal">
      <h3>Publisher</h3><p>BuildMyCar, coachbuilder, Munich, Germany. Contact: atelier@buildmycar.example.</p>
      <h3>Hosting</h3><p>This prototype is hosted for demonstration purposes only.</p>
      <h3>Intellectual property</h3><p>The BMC name, drawings and texts on this site are protected. They may not be reproduced without written permission.</p>
      <h3>Prices and images</h3><p>Configurations, estimates and drawings are illustrative and do not form an offer. Every car is confirmed in writing by the atelier.</p>
      <p className="disclaimer">Prototype by Yellow Team, ESSEC hackathon. Company details are placeholders.</p>
    </div>
  </div>;
}
