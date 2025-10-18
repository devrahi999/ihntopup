export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
      
      <div className="card p-6 space-y-4 text-gray-700">
        <p className="text-sm text-gray-500">Last Updated: October 14, 2025</p>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">1. Information We Collect</h2>
          <p>We collect information that you provide directly to us, including:</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Name and contact information</li>
            <li>Payment information</li>
            <li>Free Fire Player UID</li>
            <li>Transaction history</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Process your diamond top-up orders</li>
            <li>Manage your wallet and transactions</li>
            <li>Provide customer support</li>
            <li>Send important updates about your orders</li>
            <li>Improve our services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">3. Information Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. All payment transactions are processed through secure payment gateways.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">4. Data Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share information only with trusted payment processors to complete transactions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Access your personal information</li>
            <li>Update or correct your information</li>
            <li>Request deletion of your account</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:<br />
            Email: privacy@ihntopup.com
          </p>
        </section>
      </div>
    </div>
  );
}

