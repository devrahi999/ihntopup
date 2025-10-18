'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient as createBrowserClient } from '@/lib/supabase/client';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock, FaPaperPlane } from 'react-icons/fa';

export default function SupportPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      console.log('Submitting support ticket:', formData);
      
      // Save to Supabase database
      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user?.id || null,
          user_name: formData.name,
          user_email: formData.email,
          user_phone: formData.phone || '',
          subject: formData.subject,
          message: formData.message,
          status: 'open',
          priority: 'medium'
        })
        .select();

      console.log('Insert result:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error saving support ticket:', error);
      alert('Failed to submit support request: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent mb-3">
            Support Center 💬
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            We're here to help! Get in touch with us for any questions or concerns.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Contact Information</h2>

            {/* Phone */}
            <div className="card p-4 sm:p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaPhone className="text-white text-lg" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1">Phone</h3>
                  <a href="tel:+8801712345678" className="text-primary hover:underline text-sm sm:text-base">
                    +880 1712-345678
                  </a>
                  <p className="text-xs text-gray-500 mt-1">Call us anytime</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="card p-4 sm:p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-white text-lg" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1">Email</h3>
                  <a href="mailto:support@ihntopup.com" className="text-primary hover:underline text-sm sm:text-base break-all">
                    support@ihntopup.com
                  </a>
                  <p className="text-xs text-gray-500 mt-1">24/7 email support</p>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="card p-4 sm:p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaWhatsapp className="text-white text-lg" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1">WhatsApp</h3>
                  <a href="https://wa.me/8801712345678" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm sm:text-base">
                    +880 1712-345678
                  </a>
                  <p className="text-xs text-gray-500 mt-1">Quick chat support</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="card p-4 sm:p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-white text-lg" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1">Office Address</h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Dhaka, Bangladesh
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Visit us</p>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="card p-4 sm:p-6 bg-gradient-to-br from-primary/10 to-primary/5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaClock className="text-white text-lg" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-2">Working Hours</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span className="font-semibold">9 AM - 11 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday - Sunday:</span>
                      <span className="font-semibold">10 AM - 10 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Support Form */}
          <div className="lg:col-span-2">
            <div className="card p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Send us a Message</h2>
              <p className="text-gray-600 text-sm mb-6">Fill out the form below and we'll get back to you as soon as possible.</p>

              {submitted && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg mb-6 animate-fade-in-up">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✅</span>
                    <div>
                      <p className="font-semibold">Message Sent Successfully!</p>
                      <p className="text-sm">We'll respond to your inquiry within 24 hours.</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                    placeholder="+880 1712-345678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="order-issue">Order Issue</option>
                    <option value="payment-problem">Payment Problem</option>
                    <option value="account-help">Account Help</option>
                    <option value="diamond-delivery">Diamond Delivery</option>
                    <option value="refund-request">Refund Request</option>
                    <option value="technical-issue">Technical Issue</option>
                    <option value="general-inquiry">General Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input-field min-h-[150px] resize-none"
                    placeholder="Describe your issue or question in detail..."
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary w-full text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPaperPlane />
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* FAQ Section */}
            <div className="card p-6 sm:p-8 mt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">How long does diamond delivery take?</h4>
                  <p className="text-sm text-gray-600">Usually within 5-30 minutes after payment confirmation.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">What if I entered the wrong UID?</h4>
                  <p className="text-sm text-gray-600">Contact support immediately with your order ID. We cannot guarantee refunds for incorrect UIDs.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">How do I get a refund?</h4>
                  <p className="text-sm text-gray-600">Submit a support request with your order details. Refunds are processed within 5-7 business days.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Can I change my order after payment?</h4>
                  <p className="text-sm text-gray-600">Orders cannot be modified once payment is completed. Please double-check before confirming.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
