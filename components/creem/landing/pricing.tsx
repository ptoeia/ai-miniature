"use client";

import clsx from 'clsx';
import { Container } from './container'; // Assuming this is a local container component
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';

// Define the ProductPlan interface based on your CreemProduct table and API response
interface ProductPlanData {
  id: string; // UUID or Text, depending on your DB schema for CreemProduct.id
  name: string | null;
  description: string | null;
  price: number | null;
  currency: string | null;
  creemId: string | null; // Creem's Product ID
  active: boolean | null;
  plan_tier: string | null;
  billing_period: string | null;
  grants_credits: number | null;
  display_credits_per_month: number | null;
  interval: string | null;
  interval_count: number | null;
  is_popular: boolean | null;
  features: string[] | null; // Assuming features are stored as JSON array of strings
  button_text: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

function SwirlyDoodle(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 281 40"
      preserveAspectRatio="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M240.172 22.994c-8.007 1.246-15.477 2.23-31.26 4.114-18.506 2.21-26.323 2.977-34.487 3.386-2.971.149-3.727.324-6.566 1.523-15.124 6.388-43.775 9.404-69.425 7.31-26.207-2.14-50.986-7.103-78-15.624C10.912 20.7.988 16.143.734 14.657c-.066-.381.043-.344 1.324.456 10.423 6.506 49.649 16.322 77.8 19.468 23.708 2.65 38.249 2.95 55.821 1.156 9.407-.962 24.451-3.773 25.101-4.692.074-.104.053-.155-.058-.135-1.062.195-13.863-.271-18.848-.687-16.681-1.389-28.722-4.345-38.142-9.364-15.294-8.15-7.298-19.232 14.802-20.514 16.095-.934 32.793 1.517 47.423 6.96 13.524 5.033 17.942 12.326 11.463 18.922l-.859.874.697-.006c2.681-.026 15.304-1.302 29.208-2.953 25.845-3.07 35.659-4.519 54.027-7.978 9.863-1.858 11.021-2.048 13.055-2.145a61.901 61.901 0 0 0 4.506-.417c1.891-.259 2.151-.267 1.543-.047-.402.145-2.33.913-4.285 1.707-4.635 1.882-5.202 2.07-8.736 2.903-3.414.805-19.773 3.797-26.404 4.829Zm40.321-9.93c.1-.066.231-.085.29-.041.059.043-.024.096-.183.119-.177.024-.219-.007-.107-.079ZM172.299 26.22c9.364-6.058 5.161-12.039-12.304-17.51-11.656-3.653-23.145-5.47-35.243-5.576-22.552-.198-33.577 7.462-21.321 14.814 12.012 7.205 32.994 10.557 61.531 9.831 4.563-.116 5.372-.288 7.337-1.559Z"
      />
    </svg>
  )
}

function CheckIcon({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      aria-hidden="true"
      className={clsx(
        'h-6 w-6 flex-none fill-current stroke-current',
        className,
      )}
      {...props}
    >
      <path
        d="M9.307 12.248a.75.75 0 1 0-1.114 1.004l1.114-1.004ZM11 15.25l-.557.502a.75.75 0 0 0 1.15-.043L11 15.25Zm4.844-5.041a.75.75 0 0 0-1.188-.918l1.188.918Zm-7.651 3.043 2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004Zm3.4 2.457 4.25-5.5-1.187-.918-4.25 5.5 1.188.918Z"
        strokeWidth={0}
      />
      <circle
        cx={12}
        cy={12}
        r={8.25}
        fill="none"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Updated Plan component props
interface PlanProps {
  plan: ProductPlanData;
  // href: string; // We might generate this dynamically or handle click differently
}

function Plan({ plan }: PlanProps) {
  const { 
    name, 
    price, 
    currency, 
    description, 
    features, 
    is_popular,
    button_text,
    display_credits_per_month,
    creemId // useful for checkout link
  } = plan;

  // Format price
  const formattedPrice = price !== null 
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(price)
    : 'N/A';

  // Construct a checkout URL (example, adjust as per your Creem integration)
  // This is a placeholder. You'll need to replace this with your actual checkout initiation logic.
  const checkoutUrl = creemId ? `/api/checkout/create-session?creemId=${creemId}` : '/register';

  return (
    <section
      className={clsx(
        'flex flex-col rounded-3xl px-6 sm:px-8',
        is_popular ? 'order-first bg-neutral-900 py-8 lg:order-none' : 'lg:py-8',
      )}
    >
      <h3 className="mt-5 font-display text-lg text-white">{name || 'Unnamed Plan'}</h3>
      {display_credits_per_month && (
        <p className={clsx('mt-1 text-sm', is_popular ? 'text-neutral-300' : 'text-neutral-400')}>
          {display_credits_per_month} credits/month
        </p>
      )}
      <p
        className={clsx(
          'mt-2 text-base min-h-[4.5rem]', // Added min-height for consistent description box size
          is_popular ? 'text-white' : 'text-neutral-400',
        )}
      >
        {description || 'No description available.'}
      </p>
      <p className="order-first font-display text-5xl font-light tracking-tight text-white">
        {formattedPrice}
      </p>
      {features && features.length > 0 && (
        <ul
          role="list"
          className={clsx(
            'order-last mt-10 flex flex-col gap-y-3 text-sm',
            is_popular ? 'text-white' : 'text-neutral-200',
          )}
        >
          {features.map((feature) => (
            <li key={feature} className="flex">
              <CheckIcon className={is_popular ? 'text-white' : 'text-neutral-400'} />
              <span className="ml-4">{feature}</span>
            </li>
          ))}
        </ul>
      )}
      <Button
        asChild // Use asChild if you want the Button to render an 'a' tag for navigation
        variant={"default"}
        // color="white" // This prop might not be standard for Shadcn Button, variant handles styling
        className="mt-8 bg-white text-neutral-900 hover:bg-neutral-200"
        aria-label={`Get started with the ${name} plan for ${formattedPrice}`}
      >
        <a href={checkoutUrl}>{button_text || 'Get Started'}</a>
      </Button>
    </section>
  )
}

export function Pricing() {
  const [products, setProducts] = useState<ProductPlanData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        const data = await response.json();
        // Normalize API snake_case to client camelCase and parse features when needed
        const normalized: ProductPlanData[] = data.map((p: any) => ({
          id: p.id,
          name: p.name ?? null,
          description: p.description ?? null,
          price: p.price ?? null,
          currency: p.currency ?? null,
          creemId: p.creem_id ?? p.creemId ?? null,
          active: p.active ?? null,
          plan_tier: p.plan_tier ?? null,
          billing_period: p.billing_period ?? null,
          grants_credits: p.grants_credits ?? null,
          display_credits_per_month: p.display_credits_per_month ?? null,
          interval: p.interval ?? null,
          interval_count: p.interval_count ?? null,
          is_popular: p.is_popular ?? null,
          features: typeof p.features === 'string' ? JSON.parse(p.features) : (p.features ?? null),
          button_text: p.button_text ?? null,
          createdAt: p.created_at ?? p.createdAt ?? null,
          updatedAt: p.updated_at ?? p.updatedAt ?? null,
        }));
        setProducts(normalized);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        }
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <Container className="py-20 sm:py-32 text-center">
        <p className="text-white text-xl">Loading pricing plans...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-20 sm:py-32 text-center">
        <p className="text-red-500 text-xl">Error loading plans: {error}</p>
      </Container>
    );
  }

  if (products.length === 0) {
    return (
      <Container className="py-20 sm:py-32 text-center">
        <p className="text-white text-xl">No pricing plans available at the moment.</p>
      </Container>
    );
  }

  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className="bg-neutral-950 py-20 sm:py-32" // Changed background for better contrast if needed
    >
      <Container>
        <div className="md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            <span className="relative whitespace-nowrap">
              <SwirlyDoodle className="absolute left-0 top-1/2 h-[1em] w-full fill-neutral-400" />
              <span className="relative">Simple pricing,</span>
            </span>{' '}
            for everyone.
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            Choose the plan that best fits your needs and start creating today.
          </p>
        </div>
        <div className="-mx-4 mt-16 grid max-w-2xl grid-cols-1 gap-y-10 sm:mx-auto lg:-mx-8 lg:max-w-none lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:mx-0 xl:gap-x-8">
          {products.map((product) => (
            <Plan key={product.id} plan={product} />
          ))}
        </div>
      </Container>
    </section>
  )
}
