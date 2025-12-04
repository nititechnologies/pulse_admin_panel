export const metadata = {
  title: 'Support - Pulse',
  description: 'Support information and contact details for Pulse application',
};

export default function SupportInfo() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        body {
          background-color: #ffffff !important;
          margin: 0;
          padding: 0;
        }
        .support-container * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        .support-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #ffffff;
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
          min-height: 100vh;
        }
        .support-container h1 {
          font-size: 28px;
          margin-bottom: 10px;
          color: #111827;
        }
        .support-container h2 {
          font-size: 20px;
          margin-top: 30px;
          margin-bottom: 15px;
          color: #111827;
        }
        .support-container p {
          margin-bottom: 15px;
          color: #333;
        }
        .support-container .last-updated {
          font-style: italic;
          color: #666;
          margin-bottom: 30px;
          font-size: 14px;
        }
        .support-container ul {
          margin-left: 20px;
          margin-bottom: 15px;
        }
        .support-container li {
          margin-bottom: 8px;
          color: #333;
        }
        .support-container .contact-info {
          background-color: #F8F9FA;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
          color: #333;
          line-height: 1.8;
        }
        .support-container .contact-info strong {
          color: #111827;
        }
        .support-container .contact-info a {
          color: #305030;
          text-decoration: none;
        }
        .support-container .contact-info a:hover {
          text-decoration: underline;
        }
        .support-container .info-box {
          background-color: #EFF6FF;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          color: #1E40AF;
          line-height: 1.8;
          border-left: 4px solid #3B82F6;
        }
        .support-container .info-box strong {
          color: #1E3A8A;
        }
      `}} />
      <div className="support-container">
        <h1>Support</h1>
        <p className="last-updated">Last updated: December 2024</p>

        <h2>Get Help</h2>
        <p>
          We&apos;re here to help! If you have any questions, issues, or need assistance with the Pulse app, 
          please don&apos;t hesitate to reach out to our support team.
        </p>

        <div className="info-box">
          <p>
            <strong>Response Time:</strong> We typically respond to support inquiries within <strong>24-48 hours</strong> during business days.
          </p>
        </div>

        <h2>How to Contact Support</h2>
        <p>You can reach our support team through the following methods:</p>
        <ul>
          <li><strong>Email:</strong> Send us an email with your question or issue</li>
          <li><strong>In-App Support:</strong> Use the support feature within the Pulse app</li>
          <li><strong>Phone:</strong> Call us during business hours for immediate assistance</li>
        </ul>

        <h2>Contact Information</h2>
        <div className="contact-info">
          <strong>Email:</strong> <a href="mailto:nititechnologies1@gmail.com?subject=Support%20Request">nititechnologies1@gmail.com</a><br />
          <strong>Phone:</strong> +91 98118 62846<br />
          <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM IST
        </div>

        <h2>Common Issues & Solutions</h2>
        <p>Before contacting support, you may find answers to common questions below:</p>
        <ul>
          <li><strong>Login Issues:</strong> Make sure you&apos;re using the correct email and password. You can reset your password from the login screen.</li>
          <li><strong>App Not Loading:</strong> Check your internet connection and try restarting the app.</li>
          <li><strong>Account Questions:</strong> Visit our Account Deletion page if you need to delete your account.</li>
          <li><strong>Technical Problems:</strong> Try updating the app to the latest version from the App Store.</li>
        </ul>

        <h2>What to Include in Your Support Request</h2>
        <p>To help us assist you more quickly, please include the following information:</p>
        <ul>
          <li>Your registered email address</li>
          <li>A clear description of the issue or question</li>
          <li>Steps to reproduce the issue (if applicable)</li>
          <li>Screenshots (if applicable)</li>
          <li>Device and app version information</li>
        </ul>

        <h2>Privacy & Security</h2>
        <p>
          Your privacy is important to us. When contacting support, we may ask for information to verify your identity 
          and help resolve your issue. All support communications are handled with confidentiality. 
          For more information, please review our <a href="/privacy-policy" style={{color: '#305030'}}>Privacy Policy</a>.
        </p>

        <h2>Additional Resources</h2>
        <p>You may also find helpful information in our other pages:</p>
        <ul>
          <li><a href="/privacy-policy" style={{color: '#305030'}}>Privacy Policy</a></li>
          <li><a href="/terms-and-conditions" style={{color: '#305030'}}>Terms and Conditions</a></li>
          <li><a href="/account-deletion" style={{color: '#305030'}}>Account Deletion</a></li>
        </ul>

        <div className="contact-info" style={{marginTop: '40px'}}>
          <p style={{marginBottom: '10px'}}>
            <strong>Need Immediate Assistance?</strong>
          </p>
          <p>
            For urgent matters, please call us at <strong>+91 98118 62846</strong> or email us at{' '}
            <a href="mailto:nititechnologies1@gmail.com?subject=Urgent%20Support%20Request">nititechnologies1@gmail.com</a>.
          </p>
        </div>
      </div>
    </>
  );
}

