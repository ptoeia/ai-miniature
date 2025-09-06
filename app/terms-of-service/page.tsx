import Link from 'next/link';
import config from '@/config';

export default function Page() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6 md:px-8">
      <div className="prose prose-lg dark:prose-invert mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <p className="mb-8">
          Welcome to {config.appName}! Our website (&ldquo;Website&rdquo;) is dedicated to providing a service for creating and sharing tier lists, where users can browse, create, and share tier list content. By accessing or using our Website, you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree with any part of these terms, you are prohibited from using the Website.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Use License</h2>
        <p className="mb-4">
          You are granted a limited license to use the Website and its services, provided that you do not attack or harm the Website in any way.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. User Data Collection</h2>
        <p className="mb-4">
          We collect personal data (name, email, and login information) and non-personal data (web cookies) to improve our services. The use of this data is governed by our Privacy Policy, which can be found on the Privacy Policy page.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Content Creation and Sharing</h2>
        <p className="mb-4">
          Users can create and share tier list content on the platform. Users are fully responsible for the content they create and must not upload illegal, infringing, or inappropriate content. The platform reserves the right to remove content that violates these guidelines.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Governing Law</h2>
        <p className="mb-4">
          These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which {config.appName} operates, without regard to its conflict of law provisions.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Changes to Terms</h2>
        <p className="mb-4">
          {config.appName} reserves the right, at our sole discretion, to modify or replace these Terms at any time. We will notify users of any changes by email or by posting a notice on the Website. Your continued use of the Website after any change in these Terms will constitute your acceptance of such changes.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact Information</h2>
        <p className="mb-4">
          If you have any questions about these Terms, please contact us at <a href={`mailto:${config.contact_us_email}`} className="text-primary hover:underline">{config.contact_us_email}</a>.
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
