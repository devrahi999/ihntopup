export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Refund Policy</h1>
      
      <div className="card p-6 space-y-4 text-gray-700">
        <p className="text-sm text-gray-500">Last Updated: October 14, 2025</p>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">1. Refund Eligibility</h2>
          <p>Refunds may be issued in the following cases:</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Payment was made but diamonds were not delivered within 24 hours</li>
            <li>Duplicate payment for the same order</li>
            <li>Technical error resulted in incorrect charge</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">2. Non-Refundable Cases</h2>
          <p>Refunds will NOT be issued in the following cases:</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Incorrect Player UID provided by the user</li>
            <li>Diamonds already delivered successfully</li>
            <li>User account banned by game publisher</li>
            <li>Change of mind after successful delivery</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">3. Refund Process</h2>
          <p>To request a refund:</p>
          <ol className="list-decimal list-inside ml-4 mt-2 space-y-1">
            <li>Contact our support team at support@ihntopup.com</li>
            <li>Provide your Order ID and payment details</li>
            <li>Explain the reason for refund request</li>
            <li>Wait for verification (1-3 business days)</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">4. Refund Timeline</h2>
          <p>
            Approved refunds will be processed within 5-7 business days. The refund amount will be credited to:
          </p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Your IHN TOPUP wallet (instant)</li>
            <li>Or your original payment method (5-7 business days)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">5. Cancellation Policy</h2>
          <p>
            Orders can only be cancelled before diamonds are delivered. Once delivery is initiated, cancellation is not possible.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">6. Wallet Refunds</h2>
          <p>
            Money added to wallet cannot be withdrawn. It can only be used for purchasing diamonds on our platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">7. Contact Support</h2>
          <p>
            For refund inquiries, please contact:<br />
            Email: refunds@ihntopup.com<br />
            Phone: +880 1712-345678<br />
            Support Hours: 9 AM - 11 PM (Daily)
          </p>
        </section>
      </div>
    </div>
  );
}

