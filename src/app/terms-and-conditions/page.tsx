export const metadata = {
  title: 'Terms and Conditions - Pulse',
  description: 'Terms and Conditions for Pulse application',
};

export default function TermsAndConditions() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .terms-container * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        .terms-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #ffffff;
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
          min-height: 100vh;
        }
        .terms-container h1 {
          font-size: 28px;
          margin-bottom: 10px;
          color: #111827;
        }
        .terms-container h2 {
          font-size: 20px;
          margin-top: 30px;
          margin-bottom: 15px;
          color: #111827;
        }
        .terms-container p {
          margin-bottom: 15px;
          color: #333;
        }
        .terms-container .last-updated {
          font-style: italic;
          color: #666;
          margin-bottom: 30px;
          font-size: 14px;
        }
        .terms-container ul {
          margin-left: 20px;
          margin-bottom: 15px;
        }
        .terms-container li {
          margin-bottom: 8px;
          color: #333;
        }
        .terms-container .contact-info {
          background-color: #F8F9FA;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
          color: #333;
          line-height: 1.8;
        }
        .terms-container .contact-info strong {
          color: #111827;
        }
      `}} />
      <div className="terms-container">
      
      <h1>Terms & Conditions</h1>
      <p className="last-updated">Last updated: December 2024</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using Pulse, you accept and agree to be bound by the terms and 
        provision of this agreement. If you do not agree to abide by the above, please 
        do not use this service.
      </p>

      <h2>2. Use License</h2>
      <p>
        Permission is granted to temporarily download one copy of Pulse for personal, 
        non-commercial transitory viewing only. This is the grant of a license, not a 
        transfer of title, and under this license you may not:
      </p>
      <ul>
        <li>Modify or copy the materials</li>
        <li>Use the materials for any commercial purpose or for any public display</li>
        <li>Attempt to reverse engineer any software contained in the app</li>
        <li>Remove any copyright or other proprietary notations from the materials</li>
      </ul>

      <h2>3. User Accounts</h2>
      <p>
        When you create an account with us, you must provide information that is accurate, 
        complete, and current at all times. You are responsible for safeguarding the password 
        and for all activities that occur under your account.
      </p>

      <h2>4. Prohibited Uses</h2>
      <p>
        You may not use our service:
      </p>
      <ul>
        <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
        <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
        <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
        <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
        <li>To submit false or misleading information</li>
      </ul>

      <h2>5. Content</h2>
      <p>
        Our service allows you to post, link, store, share and otherwise make available certain 
        information, text, graphics, videos, or other material. You are responsible for the 
        content that you post to the service, including its legality, reliability, and appropriateness.
      </p>

      <h2>6. Privacy Policy</h2>
      <p>
        Your privacy is important to us. Please review our Privacy Policy, which also governs 
        your use of the service, to understand our practices.
      </p>

      <h2>7. Termination</h2>
      <p>
        We may terminate or suspend your account and bar access to the service immediately, 
        without prior notice or liability, under our sole discretion, for any reason whatsoever 
        and without limitation, including but not limited to a breach of the Terms.
      </p>

      <h2>8. Disclaimer</h2>
      <p>
        The information on this service is provided on an &quot;as is&quot; basis. To the fullest extent 
        permitted by law, this Company excludes all representations, warranties, conditions and 
        terms relating to our service and the use of this service.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        In no event shall Pulse, nor its directors, employees, partners, agents, suppliers, 
        or affiliates, be liable for any indirect, incidental, special, consequential, or 
        punitive damages, including without limitation, loss of profits, data, use, goodwill, 
        or other intangible losses, resulting from your use of the service.
      </p>

      <h2>10. Governing Law</h2>
      <p>
        These Terms shall be interpreted and governed by the laws of the United States, 
        without regard to its conflict of law provisions. Our failure to enforce any right 
        or provision of these Terms will not be considered a waiver of those rights.
      </p>

      <h2>11. Changes</h2>
      <p>
        We reserve the right, at our sole discretion, to modify or replace these Terms at 
        any time. If a revision is material, we will provide at least 30 days notice prior 
        to any new terms taking effect.
      </p>

      <h2>12. Contact Information</h2>
      <p>
        If you have any questions about these Terms and Conditions, please contact us:
      </p>
      <div className="contact-info">
        <strong>Email:</strong> nititechnologies1@gmail.com<br />
        <strong>Phone:</strong> +91 98118 62846
      </div>
      </div>
    </>
  );
}

