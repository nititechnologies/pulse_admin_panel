export const metadata = {
  title: 'Privacy Policy - Pulse',
  description: 'Privacy Policy for Pulse application',
};

export default function PrivacyPolicy() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .privacy-policy-container * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        .privacy-policy-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #ffffff;
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
          min-height: 100vh;
        }
        .privacy-policy-container h1 {
          font-size: 28px;
          margin-bottom: 10px;
          color: #111827;
        }
        .privacy-policy-container h2 {
          font-size: 20px;
          margin-top: 30px;
          margin-bottom: 15px;
          color: #111827;
        }
        .privacy-policy-container p {
          margin-bottom: 15px;
          color: #333;
        }
        .privacy-policy-container .last-updated {
          font-style: italic;
          color: #666;
          margin-bottom: 30px;
          font-size: 14px;
        }
        .privacy-policy-container ul {
          margin-left: 20px;
          margin-bottom: 15px;
        }
        .privacy-policy-container li {
          margin-bottom: 8px;
          color: #333;
        }
        .privacy-policy-container .contact-info {
          background-color: #F8F9FA;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
          color: #333;
          line-height: 1.8;
        }
        .privacy-policy-container .contact-info strong {
          color: #111827;
        }
      `}} />
      <div className="privacy-policy-container">
      
      <h1>Privacy Policy</h1>
      <p className="last-updated">Last updated: December 2024</p>

      <h2>1. Information We Collect</h2>
      <p>
        We collect information you provide directly to us, such as when you create an account, 
        use our services, or contact us for support. This may include:
      </p>
      <ul>
        <li>Personal information (name, email address, phone number)</li>
        <li>Account credentials and preferences</li>
        <li>Content you create, upload, or share through our services</li>
        <li>Communication data when you contact us</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>
        We use the information we collect to:
      </p>
      <ul>
        <li>Provide, maintain, and improve our services</li>
        <li>Process transactions and send related information</li>
        <li>Send technical notices, updates, and support messages</li>
        <li>Respond to your comments and questions</li>
        <li>Personalize your experience and provide relevant content</li>
      </ul>

      <h2>3. Information Sharing</h2>
      <p>
        We do not sell, trade, or otherwise transfer your personal information to third parties 
        without your consent, except in the following circumstances:
      </p>
      <ul>
        <li>With service providers who assist us in operating our services</li>
        <li>When required by law or to protect our rights</li>
        <li>In connection with a business transfer or acquisition</li>
      </ul>

      <h2>4. Data Security</h2>
      <p>
        We implement appropriate security measures to protect your personal information against 
        unauthorized access, alteration, disclosure, or destruction. However, no method of 
        transmission over the internet is 100% secure.
      </p>

      <h2>5. Your Rights</h2>
      <p>
        You have the right to:
      </p>
      <ul>
        <li>Access and update your personal information</li>
        <li>Delete your account and associated data</li>
        <li>Opt out of certain communications</li>
        <li>Request a copy of your data</li>
      </ul>

      <h2>6. Cookies and Tracking</h2>
      <p>
        We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
        and provide personalized content. You can control cookie settings through your browser.
      </p>

      <h2>7. Children&apos;s Privacy</h2>
      <p>
        Our services are not intended for children under 13. We do not knowingly collect 
        personal information from children under 13.
      </p>

      <h2>8. Changes to This Policy</h2>
      <p>
        We may update this privacy policy from time to time. We will notify you of any changes 
        by posting the new policy on this page and updating the &quot;Last updated&quot; date.
      </p>

      <h2>9. Contact Us</h2>
      <p>
        If you have any questions about this privacy policy, please contact us at:
      </p>
      <div className="contact-info">
        <strong>Email:</strong> nititechnologies1@gmail.com<br />
        <strong>Phone:</strong> +91 98118 62846
      </div>
      </div>
    </>
  );
}

