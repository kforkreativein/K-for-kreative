import LegalPage from '../components/LegalPage.jsx'

export default function Accessibility() {
  return (
    <LegalPage
      title="Accessibility Statement"
      updated="June 26, 2026"
      description="K For Kreative's commitment to making its website accessible to everyone, and how to give feedback."
    >
      <p>
        <strong>K For Kreative</strong> is committed to making its website accessible to as many people as
        possible, including people with disabilities. We believe everyone should be able to learn about our
        services and get in touch with ease.
      </p>

      <h2>1. Our commitment</h2>
      <p>
        We aim to conform to the{' '}
        <a href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noreferrer noopener">
          Web Content Accessibility Guidelines (WCAG) 2.1
        </a>{' '}
        at Level AA. These guidelines explain how to make web content more accessible for people with a wide
        range of disabilities, including visual, auditory, motor, and cognitive needs.
      </p>

      <h2>2. Measures we take</h2>
      <ul>
        <li>Descriptive alternative text on meaningful images.</li>
        <li>Semantic HTML headings and landmarks for screen-reader navigation.</li>
        <li>Sufficient colour contrast and a light/dark theme option.</li>
        <li>Keyboard-accessible navigation, menus, and forms.</li>
        <li>Touch targets sized for comfortable use on mobile devices.</li>
        <li>Respect for the "reduced motion" preference to limit animation.</li>
        <li>Responsive layouts that adapt to different screen sizes and zoom levels.</li>
      </ul>

      <h2>3. Known limitations</h2>
      <p>
        Despite our efforts, some parts of the Site may not yet be fully accessible. We treat accessibility as
        an ongoing process and continue to test and improve the experience. If you encounter a barrier, please
        let us know — your feedback helps us prioritise fixes.
      </p>

      <h2>4. Feedback and contact</h2>
      <p>
        If you have difficulty accessing any part of this Site, or you have suggestions on how we can improve,
        please contact us and we will do our best to help and to provide the information you need in an
        accessible format:
      </p>
      <p>
        <strong>K For Kreative</strong><br />
        Email: <a href="mailto:info@kforkreative.in">info@kforkreative.in</a><br />
        Phone / WhatsApp: <a href="tel:+919724690118">+91 97246 90118</a>
      </p>
      <p>We aim to respond to accessibility feedback within five business days.</p>

      <p className="legal-disclaimer">
        This statement reflects our current accessibility efforts and will be updated as the Site evolves.
      </p>
    </LegalPage>
  )
}
