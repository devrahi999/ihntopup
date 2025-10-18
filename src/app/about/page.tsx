export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">About IHN TOPUP</h1>
      
      <div className="card p-6 space-y-4">
        <p className="text-gray-700">
          IHN TOPUP is Bangladesh's leading Free Fire diamond top-up service. We provide instant and secure diamond delivery to Free Fire players across the country.
        </p>
        
        <h2 className="text-xl font-bold text-gray-800 mt-6">Our Mission</h2>
        <p className="text-gray-700">
          To make gaming more accessible and affordable for everyone in Bangladesh by providing the best prices and fastest delivery of in-game currency.
        </p>

        <h2 className="text-xl font-bold text-gray-800 mt-6">Why Choose Us?</h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">✓</span>
            <span><strong>Instant Delivery:</strong> Get your diamonds within minutes of payment confirmation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">✓</span>
            <span><strong>Best Prices:</strong> Most competitive rates in Bangladesh</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">✓</span>
            <span><strong>Secure Payments:</strong> Multiple payment options including bKash, Nagad, and Rocket</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">✓</span>
            <span><strong>24/7 Support:</strong> Our customer service team is always ready to help</span>
          </li>
        </ul>

        <h2 className="text-xl font-bold text-gray-800 mt-6">Contact Us</h2>
        <p className="text-gray-700">
          Email: support@ihntopup.com<br />
          Phone: +880 1712-345678<br />
          Address: Dhaka, Bangladesh
        </p>
      </div>
    </div>
  );
}

