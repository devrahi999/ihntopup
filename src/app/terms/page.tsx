export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms & Conditions</h1>
      
      <div className="card p-6 space-y-4 text-gray-700">
        <p className="text-sm text-gray-500">Last Updated: October 14, 2025</p>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing and using IHN TOPUP, you accept and agree to be bound by the terms and conditions of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">2. Service Description</h2>
          <p>
            IHN TOPUP provides Free Fire diamond top-up services. We act as an intermediary between users and the game publisher to deliver in-game currency.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">3. User Obligations</h2>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Provide accurate Player UID information</li>
            <li>Complete payment for orders</li>
            <li>Not use the service for fraudulent purposes</li>
            <li>Maintain the confidentiality of your account</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">4. Payment Terms</h2>
          <p>
            All prices are in Bangladeshi Taka (BDT). Payment must be completed before order processing. We accept bKash, Nagad, Rocket, and Wallet payments.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">5. Delivery</h2>
          <p>
            Diamonds are typically delivered within 5-30 minutes after payment confirmation. Delivery times may vary during high traffic periods.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">6. Refund Policy</h2>
          <p>
            Please refer to our separate Refund Policy for detailed information about refunds and cancellations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">7. Limitation of Liability</h2>
          <p>
            IHN TOPUP is not responsible for any issues arising from incorrect Player UID provided by users or game server issues beyond our control.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">8. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">9. Contact Information</h2>
          <p>
            For any questions regarding these terms, please contact:<br />
            Email: support@ihntopup.com
          </p>
        </section>
      </div>
    </div>
  );
}

