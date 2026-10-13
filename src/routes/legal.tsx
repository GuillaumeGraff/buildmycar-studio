import { createFileRoute } from '@tanstack/react-router';
import { pageHead } from '@/components/bmc/metadata';

export const Route = createFileRoute('/legal')({ head: () => pageHead('Legal notice', 'Publisher and legal information for the BuildMyCat website.'), component: Legal });

function Legal() {
  return <div className="page">
    <div className="wrap narrow page-head"><span className="label">Information</span><h2>Legal <em>notice</em></h2></div>
    <div className="wrap narrow legal">
      <h3>Publisher</h3><p>BuildMyCat, cat adoption house, Munich, Germany. Contact: hello@buildmycat.example.</p>
      <h3>Hosting</h3><p>This prototype is hosted for demonstration purposes only.</p>
      <h3>Intellectual property</h3><p>The BMC name, drawings and texts on this site are protected. The cats are not, and know it. They may not be reproduced without written permission.</p>
      <h3>Kittens and images</h3><p>The kitten configurator is a joke: configurations, estimates and drawings are illustrative and do not form an offer. Every adoption follows a meeting, a home visit and a signed adoption agreement.</p>
      <p className="disclaimer">Prototype by Yellow Team, ESSEC hackathon. Company details are placeholders.</p>
    </div>
  </div>;
}
