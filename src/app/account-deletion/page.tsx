export const metadata = {
  title: 'Account Deletion - Pulse',
  description: 'Account deletion request information for Pulse application',
};

export default function AccountDeletion() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        body {
          background-color: #ffffff !important;
          margin: 0;
          padding: 0;
        }
        .account-deletion-container * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        .account-deletion-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #ffffff;
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
          min-height: 100vh;
        }
        @media (prefers-color-scheme: dark) {
          .account-deletion-container {
            background-color: #1F2937;
            color: #F9FAFB;
          }
          .account-deletion-container h1, .account-deletion-container h2 {
            color: #FFFFFF;
          }
          .account-deletion-container .info-box, .account-deletion-container .warning-box {
            background-color: #374151;
            color: #F9FAFB;
          }
          .account-deletion-container .button {
            background-color: #305030;
          }
          .account-deletion-container .button:hover {
            background-color: #3d663d;
          }
        }
        .account-deletion-container h1 {
          font-size: 28px;
          margin-bottom: 10px;
          color: #111827;
        }
        .account-deletion-container h2 {
          font-size: 20px;
          margin-top: 30px;
          margin-bottom: 15px;
          color: #111827;
        }
        .account-deletion-container p {
          margin-bottom: 15px;
          color: #6B7280;
        }
        .account-deletion-container .last-updated {
          font-style: italic;
          color: #9CA3AF;
          margin-bottom: 30px;
          font-size: 14px;
        }
        .account-deletion-container ul {
          margin-left: 20px;
          margin-bottom: 15px;
        }
        .account-deletion-container li {
          margin-bottom: 8px;
          color: #6B7280;
        }
        .account-deletion-container .info-box {
          background-color: #F8F9FA;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          color: #374151;
          line-height: 1.8;
          border-left: 4px solid #305030;
        }
        .account-deletion-container .warning-box {
          background-color: #FEF3C7;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          color: #92400E;
          line-height: 1.8;
          border-left: 4px solid #F59E0B;
        }
        .account-deletion-container .warning-box strong {
          color: #78350F;
        }
        .account-deletion-container .info-box strong {
          color: #111827;
        }
        .account-deletion-container .button {
          display: inline-block;
          background-color: #305030;
          color: #FFFFFF;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin-top: 10px;
          font-weight: 600;
          transition: background-color 0.3s;
        }
        .account-deletion-container .button:hover {
          background-color: #3d663d;
        }
        .account-deletion-container .contact-info {
          background-color: #F8F9FA;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
          color: #374151;
          line-height: 1.8;
        }
        .account-deletion-container .contact-info strong {
          color: #111827;
        }
        .account-deletion-container .contact-info a {
          color: #305030;
          text-decoration: none;
        }
        .account-deletion-container .contact-info a:hover {
          text-decoration: underline;
        }
        .account-deletion-container .steps {
          background-color: #F8F9FA;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          counter-reset: step-counter;
        }
        .account-deletion-container .step {
          margin-bottom: 15px;
          padding-left: 30px;
          position: relative;
        }
        .account-deletion-container .step::before {
          content: counter(step-counter);
          counter-increment: step-counter;
          position: absolute;
          left: 0;
          top: 0;
          background-color: #305030;
          color: #FFFFFF;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
        }
      `}} />
      <div className="account-deletion-container">
        <h1>Account Deletion Request</h1>
        <p className="last-updated">Last updated: December 2024</p>

        <h2>How to Delete Your Account</h2>
        <p>
          You can delete your Pulse account at any time. We offer two methods to delete your account:
        </p>

        <div className="steps">
          <div className="step">
            <strong>Method 1: Delete from the App</strong>
            <p>Open the Pulse app → Go to Settings → Tap &quot;Delete Profile&quot; → Confirm deletion</p>
          </div>
          <div className="step">
            <strong>Method 2: Request via Email</strong>
            <p>Send an email to us with your account email address requesting account deletion</p>
          </div>
        </div>

        <h2>What Happens When You Delete Your Account?</h2>
        <div className="warning-box">
          <strong>⚠️ Important:</strong> Account deletion is permanent and cannot be undone.
        </div>
        <p>When you delete your account, we will:</p>
        <ul>
          <li>Permanently delete your profile information (name, email, phone number, preferences)</li>
          <li>Remove all your bookmarked articles</li>
          <li>Delete your account data from our servers</li>
          <li>Remove your authentication credentials</li>
        </ul>
        <p>
          <strong>Note:</strong> Some data may be retained for legal or regulatory purposes as required by law. 
          This includes transaction records and data required for compliance.
        </p>

        <h2>Processing Time</h2>
        <div className="info-box">
          <p>
            Account deletion requests are typically processed within <strong>7 business days</strong> of receipt. 
            You will receive a confirmation email once your account has been deleted.
          </p>
        </div>

        <h2>Request Account Deletion</h2>
        <p>
          To request account deletion via email, please send an email to us with the following information:
        </p>
        <ul>
          <li>Subject: &quot;Account Deletion Request&quot;</li>
          <li>Your registered email address</li>
          <li>Your full name (as registered)</li>
          <li>Confirmation that you want to delete your account</li>
        </ul>

        <div className="contact-info">
          <strong>Email:</strong> <a href="mailto:nititechnologies1@gmail.com?subject=Account%20Deletion%20Request">nititechnologies1@gmail.com</a><br />
          <strong>Subject:</strong> Account Deletion Request
        </div>

        <a 
          href="mailto:nititechnologies1@gmail.com?subject=Account%20Deletion%20Request&body=Please%20delete%20my%20Pulse%20account.%0A%0AEmail%20Address%3A%20%0AFull%20Name%3A%20%0A%0AThank%20you." 
          className="button"
        >
          Request Account Deletion via Email
        </a>

        <h2>Questions?</h2>
        <p>
          If you have any questions about account deletion or need assistance, please contact us at:
        </p>
        <div className="contact-info">
          <strong>Email:</strong> nititechnologies1@gmail.com<br />
          <strong>Phone:</strong> +91 98118 62846
        </div>
      </div>
    </>
  );
}

