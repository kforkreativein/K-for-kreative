import LegalPage from '../components/LegalPage.jsx'

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="June 26, 2026"
      description="How K For Kreative collects, uses, and protects your personal data, and the rights you have over it."
    >
      <p>
        This Privacy Policy explains how <strong>K For Kreative</strong> ("we", "us", "our"), a creative
        marketing agency owned by Krish Chhatrala, collects, uses, shares, and protects information about
        you when you visit <a href="https://kforkreative.in/">kforkreative.in</a> (the "Site") or contact us.
        We are committed to protecting your privacy and handling your data transparently.
      </p>
      <p>
        If you have any questions about this policy, contact us at{' '}
        <a href="mailto:info@kforkreative.in">info@kforkreative.in</a>.
      </p>

      <h2>1. Information we collect</h2>
      <p>We only collect information we need to respond to you and operate the Site:</p>
      <ul>
        <li>
          <strong>Information you give us.</strong> When you submit our contact form, we collect your name,
          email address, the project type you select, and the details of your message. If you email, call,
          or message us on WhatsApp, we receive whatever information you choose to share.
        </li>
        <li>
          <strong>Technical information.</strong> Like most websites, our hosting provider automatically
          logs basic technical data such as your IP address, browser type, device, and the pages you
          request. This is used to keep the Site secure and reliable.
        </li>
        <li>
          <strong>Local storage.</strong> We store a small preference in your browser's local storage to
          remember your light/dark theme choice and whether you have dismissed our cookie notice. This stays
          on your device and is not used to track you.
        </li>
      </ul>

      <h2>2. How we use your information</h2>
      <ul>
        <li>To respond to your enquiry and provide the next step for your project.</li>
        <li>To deliver, maintain, and improve our services and the Site.</li>
        <li>To keep the Site secure and prevent abuse or spam.</li>
        <li>To comply with our legal obligations.</li>
      </ul>
      <p>We do <strong>not</strong> sell your personal data, and we do not use it for automated decision-making or profiling.</p>

      <h2>3. Legal bases for processing (GDPR)</h2>
      <p>If you are in the European Economic Area or the UK, we rely on the following legal bases:</p>
      <ul>
        <li><strong>Consent</strong> — when you submit the contact form or contact us directly.</li>
        <li><strong>Legitimate interests</strong> — to operate, secure, and improve the Site and respond to enquiries.</li>
        <li><strong>Legal obligation</strong> — where we must retain or disclose information to comply with the law.</li>
      </ul>

      <h2>4. Cookies and similar technologies</h2>
      <p>
        We do not currently run third-party advertising or analytics cookies on the Site. We use only
        functional browser local storage (described above) that is necessary for the Site to remember your
        preferences. If we introduce analytics or marketing cookies in the future, we will update this
        policy and request your consent through our cookie notice first.
      </p>

      <h2>5. Third-party services</h2>
      <p>We rely on a small number of trusted providers to run the Site:</p>
      <ul>
        <li><strong>Web3Forms</strong> — processes and delivers our contact-form submissions to us by email.</li>
        <li><strong>Vercel</strong> — hosts and serves the Site.</li>
      </ul>
      <p>
        These providers process data on our behalf and only as needed to provide their service. We encourage
        you to review their respective privacy policies.
      </p>

      <h2>6. Sharing and disclosure</h2>
      <p>
        We do not sell, rent, or trade your personal information. We may share information only with the
        service providers above, where required by law, or to protect our rights, safety, and property.
      </p>

      <h2>7. Data retention</h2>
      <p>
        We keep contact enquiries only for as long as necessary to respond to you and to maintain a record
        of our communication, after which they are deleted or anonymised. Technical logs are retained for a
        limited period by our hosting provider for security purposes.
      </p>

      <h2>8. Your rights</h2>
      <p>Depending on where you live, you may have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you.</li>
        <li>Request correction of inaccurate or incomplete data.</li>
        <li>Request deletion of your data ("right to be forgotten").</li>
        <li>Object to or restrict certain processing.</li>
        <li>Request a copy of your data in a portable format.</li>
        <li>Withdraw consent at any time, without affecting prior processing.</li>
      </ul>
      <p>
        To exercise any of these rights, email{' '}
        <a href="mailto:info@kforkreative.in">info@kforkreative.in</a>. We will respond within the timeframe
        required by applicable law. You also have the right to lodge a complaint with your local data
        protection authority.
      </p>

      <h2>9. International transfers</h2>
      <p>
        We are based in India and use service providers that may store data in other countries. Where data
        is transferred internationally, we take reasonable steps to ensure it is treated securely and in line
        with this policy.
      </p>

      <h2>10. Children's privacy</h2>
      <p>
        The Site is not directed at children under 16, and we do not knowingly collect personal data from
        them. If you believe a child has provided us with personal data, please contact us so we can remove it.
      </p>

      <h2>11. Security</h2>
      <p>
        We use reasonable technical and organisational measures, including HTTPS encryption, to protect your
        information. No method of transmission over the internet is completely secure, but we work to protect
        your data against unauthorised access, alteration, or disclosure.
      </p>

      <h2>12. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The "Last updated" date above shows when it was
        last revised. Material changes will be reflected on this page.
      </p>

      <h2>13. Contact us</h2>
      <p>
        For any privacy question or to exercise your rights, contact our Data Protection contact:
      </p>
      <p>
        <strong>K For Kreative</strong><br />
        Email: <a href="mailto:info@kforkreative.in">info@kforkreative.in</a><br />
        Phone / WhatsApp: <a href="tel:+919724690118">+91 97246 90118</a>
      </p>

      <p className="legal-disclaimer">
        This document is provided as a starting template and may need review by a qualified legal
        professional to ensure it fits your specific circumstances and jurisdiction.
      </p>
    </LegalPage>
  )
}
