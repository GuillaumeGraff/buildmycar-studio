import { createFileRoute } from '@tanstack/react-router';
import { pageHead } from '@/components/bmc/metadata';

export const Route = createFileRoute('/privacy')({ head: () => pageHead('Privacy policy', 'How BuildMyCar collects and protects your personal data.'), component: Privacy });

function Privacy() {
  return <div className="page">
    <div className="wrap narrow page-head"><span className="label">Information</span><h2>Privacy <em>policy</em></h2><p className="muted">Last updated October 2026</p></div>
    <div className="wrap narrow legal">
      <p>Discretion is part of every BMC car. This policy explains what personal data we collect through this website, why, and the rights you have under the EU General Data Protection Regulation (GDPR).</p>
      <h3>Who is responsible</h3><p>BuildMyCar, Munich, Germany, is the data controller. You can reach our data protection contact at privacy@buildmycar.example.</p>
      <h3>What we collect</h3><ul><li>The details you give us when you request a consultation: name, email and your configuration.</li><li>Technical data needed to run the site, such as your browser type and IP address.</li><li>With your consent only, anonymous measurement of how pages are used.</li></ul>
      <h3>Why we use it</h3><ul><li>To answer your request and prepare your car (pre-contractual steps).</li><li>To keep the site secure and working (legitimate interest).</li><li>To improve the site, if you accept measurement cookies (consent).</li></ul>
      <h3>How long we keep it</h3><p>Consultation requests are kept for up to three years after our last contact, unless you become a client. Technical logs are deleted after 30 days.</p>
      <h3>Who sees it</h3><p>Only the BMC team and the service providers who host this site, under strict contracts. We never sell your data.</p>
      <h3>Your rights</h3><p>You can ask to access, correct, delete or move your data, object to its use, or withdraw consent at any time by writing to privacy@buildmycar.example. You may also complain to your data protection authority.</p>
      <h3>Cookies</h3><p>Essential cookies keep the site running. Measurement cookies are used only if you accept them, and you can change your choice at any time in Cookie settings at the bottom of every page.</p>
      <p className="disclaimer">Sample policy for the hackathon prototype.</p>
    </div>
  </div>;
}
