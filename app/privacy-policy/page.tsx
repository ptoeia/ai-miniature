import Link from 'next/link';
import config from '@/config';

export default function Page() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6 md:px-8">
      <div className="prose prose-lg dark:prose-invert mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <p className="mb-8">
          At {config.appName}, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
        <p className="mb-4">
          We collect several types of information from and about users of our website, including:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            <strong>Personal Information:</strong> Email address, name, and profile information when you register for an account.
          </li>
          <li>
            <strong>Authentication Data:</strong> Information required to authenticate your account when you log in, especially if using third-party authentication providers.
          </li>
          <li>
            <strong>Usage Data:</strong> Information about how you use our website, including your browsing actions, tier lists created, and user interactions.
          </li>

          <li>
            <strong>Cookies and Similar Technologies:</strong> We use cookies to enhance your experience on our website. You can set your browser to refuse all or some browser cookies, but this may prevent some parts of our website from functioning properly.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
        <p className="mb-4">
          We use the information we collect about you for various purposes, including:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>To provide and maintain our website&apos;s functionality</li>
          <li>To process and complete transactions</li>
          <li>To manage your account and provide you with customer support</li>
          <li>To personalize and improve your experience on our website</li>
          <li>To send you technical notices, updates, security alerts, and support messages</li>
          <li>To communicate with you about products, services, offers, and events</li>
          <li>To monitor usage of our website for research and analysis</li>
          <li>To protect our website and users from fraudulent, unauthorized, or illegal activity</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Storage and Security</h2>
        <p className="mb-4">
          We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
        </p>
        <p className="mb-4">
          We use Supabase for user authentication and data storage, which employs industry-standard security practices. Your data is stored in secure servers with encryption protocols in place.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Sharing and Disclosure</h2>
        <p className="mb-4">
          We do not sell your personal information. We may share your information in the following circumstances:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            <strong>Service Providers:</strong> Third-party vendors and service providers who require access to your information to help us provide our services.
          </li>
          <li>
            <strong>Legal Requirements:</strong> To comply with applicable law, regulation, legal process, or governmental request.
          </li>
          <li>
            <strong>Business Transfers:</strong> In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business.
          </li>
          <li>
            <strong>Protection of Rights:</strong> To protect our rights, privacy, safety, or property, and that of our users or others.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Rights and Choices</h2>
        <p className="mb-4">
          Depending on your location, you may have certain rights regarding your personal information:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Access, update, or delete your personal information</li>
          <li>Object to our processing of your personal information</li>
          <li>Request restriction of processing your personal information</li>
          <li>Data portability</li>
          <li>Opt-out of marketing communications</li>
        </ul>
        <p className="mb-4">
          To exercise these rights, please contact us using the information provided in the &ldquo;Contact Us&rdquo; section.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Children&apos;s Privacy</h2>
        <p className="mb-4">
          Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will delete such information from our systems.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to Our Privacy Policy</h2>
        <p className="mb-4">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &ldquo;Last Updated&rdquo; date. You are advised to review this Privacy Policy periodically for any changes.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at: <a href={`mailto:${config.contact_us_email}`} className="text-primary hover:underline">{config.contact_us_email}</a>
        </p>
        
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: August 27, 2025
          </p>
        </div>
      </div>
    </div>
  );
}
