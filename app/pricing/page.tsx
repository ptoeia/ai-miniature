import type { Metadata } from 'next';
import PricingClientContent, { type Plan } from '@/components/pricing/PricingClientContent';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Pricing Plans - Flux Kontext',
  description: 'Explore Flux Kontext pricing plans. Choose the best AI image editing solution for your needs, from free trials to professional and team packages.',
  keywords: ['Flux Kontext pricing', 'AI photo editor cost', 'image editing plans', 'subscription', 'free AI editor'],
};

const PricingPage = async () => {
  const supabase = createClient();

  // Fetch active products from the database (snake_case schema)
  const { data: products, error } = await supabase
    .from('creem_product')
    .select('id, creem_id, name, description, price, grants_credits, features, is_popular, billing_period')
    .eq('active', true)
    .order('price', { ascending: true });

  if (error) {
    console.error('Error fetching pricing plans:', error);
    // Render an error state or an empty state
    return <PricingClientContent plans={[]} />;
  }

  // Map database data to the Plan interface for the client component
  const plans: Plan[] = products.map((product: any) => ({
    id: product.id,
    creemId: product.creem_id,
    name: product.name,
    price: `$${product.price}`,
    credits: product.grants_credits || 0,
    description: product.description || '',
    features: Array.isArray(product.features) ? product.features.map(String) : [],
    cta: 'Buy Now',
    isFeatured: product.is_popular || false,
    billingPeriod: product.billing_period || 'one_time',
  }));

  return <PricingClientContent plans={plans} />;
};

export default PricingPage;
