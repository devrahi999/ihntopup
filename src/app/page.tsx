import HeroSlider from '@/components/home/HeroSlider';
import TopupCard from '@/components/home/TopupCard';
import { FaBolt, FaShieldAlt, FaHeadset, FaGem } from 'react-icons/fa';
import { createClient as createServerClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = createServerClient();
  
  // Get active banners from Supabase
  const { data: banners, error: bannersError } = await supabase
    .from('banners')
    .select('*')
    .eq('isActive', true)
    .order('created_at', { ascending: true });

  // Get active categories from Supabase
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  // Get topup cards with their packs from Supabase
  const { data: topupCards, error: cardsError } = await supabase
    .from('topup_cards')
    .select(`
      *,
      card_packs (*)
    `)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  console.log('HomePage Data:', {
    banners: banners?.length,
    categories: categories?.length,
    topupCards: topupCards?.length,
    errors: { bannersError, categoriesError, cardsError }
  });

  // Create sections from topup cards grouped by category
  const sections = [];
  if (topupCards && categories) {
    for (const category of categories) {
      const cardsInCategory = topupCards.filter(card => card.category_id === category.id);
      if (cardsInCategory.length > 0) {
        sections.push({
          category,
          cards: cardsInCategory
        });
      }
    }
  }

  return (
    <div className="page-container">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Hero Slider */}
        <div className="animate-fade-in-up">
          <HeroSlider banners={banners || []} />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="glass-card p-4 text-center">
            <FaBolt className="text-3xl text-primary mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-gray-800">5 Min</div>
            <div className="text-xs sm:text-sm text-gray-600">Delivery</div>
          </div>
          <div className="glass-card p-4 text-center">
            <FaShieldAlt className="text-3xl text-blue-500 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-gray-800">100%</div>
            <div className="text-xs sm:text-sm text-gray-600">Secure</div>
          </div>
          <div className="glass-card p-4 text-center">
            <FaHeadset className="text-3xl text-purple-500 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-gray-800">24/7</div>
            <div className="text-xs sm:text-sm text-gray-600">Support</div>
          </div>
          <div className="glass-card p-4 text-center">
            <FaGem className="text-3xl text-yellow-500 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-gray-800">50K+</div>
            <div className="text-xs sm:text-sm text-gray-600">Orders</div>
          </div>
        </div>

        {sections.map((section, index) => (
          <section key={section.category.id} className="mb-6 sm:mb-8 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{ backgroundColor: section.category.color + '20' }}
                >
                  {section.category.icon}
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                  {section.category.display_name}
                </h2>
              </div>
              <span className="text-xs sm:text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-md">
                {section.cards.length} cards
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {section.cards.map((card) => (
                <TopupCard key={card.id} card={card} />
              ))}
            </div>
          </section>
        ))}
        {sections.length === 0 && (
          <section className="mb-6 sm:mb-8 animate-fade-in-up text-center py-12">
            <FaGem className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Topup Cards Available</h2>
            <p className="text-gray-600">Check back later for new topup offers.</p>
          </section>
        )}

        {/* Why Choose Us */}
        <section className="card-gradient p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Why Choose IHN TOPUP?</h3>
            <p className="text-gray-600 text-sm sm:text-base">The best Free Fire diamond service in Bangladesh</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mx-auto mb-3">
                <FaBolt className="text-white text-xl sm:text-2xl" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">Instant Delivery</h4>
              <p className="text-xs sm:text-sm text-gray-600">Get diamonds within 5 minutes</p>
            </div>

            <div className="text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaShieldAlt className="text-white text-xl sm:text-2xl" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">100% Secure</h4>
              <p className="text-xs sm:text-sm text-gray-600">Safe payment gateway</p>
            </div>

            <div className="text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaHeadset className="text-white text-xl sm:text-2xl" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">24/7 Support</h4>
              <p className="text-xs sm:text-sm text-gray-600">Always here to help</p>
            </div>

            <div className="text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaGem className="text-white text-xl sm:text-2xl" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">Best Price</h4>
              <p className="text-xs sm:text-sm text-gray-600">Lowest rates guaranteed</p>
            </div>
          </div>
        </section>

        {/* Customer Reviews */}
        <section className="mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">What Our Customers Say ⭐</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="card p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold">
                  R
                </div>
                <div>
                  <div className="font-bold text-sm sm:text-base">Rakib Ahmed</div>
                  <div className="text-xs text-gray-500">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">"Very fast delivery! Got my diamonds in just 2 minutes. Highly recommended! 💯"</p>
            </div>

            <div className="card p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div>
                  <div className="font-bold text-sm sm:text-base">Sadia Khan</div>
                  <div className="text-xs text-gray-500">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">"Best price in Bangladesh! Customer service is excellent. Will buy again! 🔥"</p>
            </div>

            <div className="card p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  F
                </div>
                <div>
                  <div className="font-bold text-sm sm:text-base">Farhan Islam</div>
                  <div className="text-xs text-gray-500">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">"Trusted seller! Been buying for months. No issues at all. Keep it up! 👍"</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
