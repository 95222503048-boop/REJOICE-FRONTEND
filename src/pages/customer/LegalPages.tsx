import React from 'react';
import { CustomerLayout } from '../../layouts/CustomerLayout';
import { BUSINESS_INFO } from '../../data/mockData';

const LegalPage: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <CustomerLayout>
    <section className="max-w-4xl mx-auto px-4 py-10">
      <article className="bg-white rounded-lg shadow-md p-6 sm:p-10">
        <p className="text-sm text-gray-500 mb-2">
          Last updated: 9 October 2026
        </p>

        <h1 className="font-playfair text-3xl font-bold text-chocolate mb-8">
          {title}
        </h1>

        <div className="space-y-6 text-gray-700 leading-7">
          {children}
        </div>
      </article>
    </section>
  </CustomerLayout>
);

const ContactDetails = () => (
  <p>
    Contact {BUSINESS_INFO.name} at {BUSINESS_INFO.phone}
    {BUSINESS_INFO.email && (
      <>
        {' '}or email{' '}
        <a
          className="text-chocolate underline"
          href={`mailto:${BUSINESS_INFO.email}`}
        >
          {BUSINESS_INFO.email}
        </a>
      </>
    )}.
  </p>
);

export const TermsPage: React.FC = () => (
  <LegalPage title="Terms & Conditions">
    <p>
      Welcome to {BUSINESS_INFO.name}. By using this website or placing
      an order, you agree to these terms. Please read them before ordering.
    </p>

    <section>
      <h2 className="font-bold text-chocolate text-xl mb-2">
        1. Accounts
      </h2>
      <p>
        You must provide accurate contact information when creating an
        account or placing an order. You are responsible for keeping your
        login details secure and for activity carried out through your account.
      </p>
    </section>

    <section>
      <h2 className="font-bold text-chocolate text-xl mb-2">
        2. Orders
      </h2>
      <p>
        Please check your product selection, quantity, delivery details,
        and requested date before submitting an order. An order request
        may require confirmation from us before preparation begins.
      </p>
    </section>

    <section>
      <h2 className="font-bold text-chocolate text-xl mb-2">
        3. Products and pricing
      </h2>
      <p>
        Product descriptions, images, prices, and availability are provided
        to help you choose your order. Appearance may vary slightly between
        handmade products and photographs. We will communicate any material
        changes to an order before proceeding.
      </p>
    </section>

    <section>
      <h2 className="font-bold text-chocolate text-xl mb-2">
        4. Delivery and pickup
      </h2>
      <p>
        Please provide an accurate delivery address and contact number where
        applicable. Delivery or pickup arrangements will be communicated
        during order confirmation. Contact us promptly if you need to change
        your order details.
      </p>
    </section>

    <section>
      <h2 className="font-bold text-chocolate text-xl mb-2">
        5. Cancellations and refunds
      </h2>
      <p>
        Contact us as soon as possible to request an order change or
        cancellation. Whether a request can be accommodated depends on the
        order's preparation status, the terms communicated when ordering,
        and applicable law. Your rights under applicable consumer law are
        not limited by these terms.
      </p>
    </section>

    <section>
      <h2 className="font-bold text-chocolate text-xl mb-2">
        6. Food allergies
      </h2>
      <p>
        If you have a food allergy or dietary restriction, contact us before
        ordering. Do not assume a product is free from a particular allergen
        unless we have explicitly confirmed this.
      </p>
    </section>

    <section>
      <h2 className="font-bold text-chocolate text-xl mb-2">
        7. Website security and use
      </h2>
      <p>
        You must not misuse the website, attempt unauthorized access, disrupt
        its operation, or interfere with its security measures.
      </p>
    </section>

    <section>
      <h2 className="font-bold text-chocolate text-xl mb-2">
        8. Contact
      </h2>
      <ContactDetails />
    </section>
  </LegalPage>
);

export const CookiePolicyPage: React.FC = () => (
  <LegalPage title="Cookie Policy">
    <p>
      This policy explains how {BUSINESS_INFO.name} uses cookies on this
      website.
    </p>

    <section>
      <h2 className="font-bold text-chocolate text-xl mb-2">
        1. Essential cookies
      </h2>
      <p>
        We use essential authentication and security cookies to support
        sign-in, maintain your authenticated session, refresh sessions when
        supported, and protect account requests against certain security attacks.
      </p>
      <p className="mt-2">
        These cookies support features you request, such as signing in and
        accessing your account. Blocking them may prevent login or other
        protected features from working correctly.
      </p>
    </section>

    <section>
      <h2 className="font-bold text-chocolate text-xl mb-2">
        2. Analytics and advertising
      </h2>
      <p>
        Our current website configuration does not use analytics or
        advertising cookies.
      </p>
    </section>

    <section>
      <h2 className="font-bold text-chocolate text-xl mb-2">
        3. Managing cookies
      </h2>
      <p>
        You can manage or delete cookies through your browser settings.
        Blocking essential cookies may cause login, registration, or
        account-related features to stop working.
      </p>
    </section>

    <section>
      <h2 className="font-bold text-chocolate text-xl mb-2">
        4. Changes to this policy
      </h2>
      <p>
        We may update this policy when our website or cookie usage changes.
        Please review this page periodically.
      </p>
    </section>

    <section>
      <h2 className="font-bold text-chocolate text-xl mb-2">
        5. Contact
      </h2>
      <ContactDetails />
    </section>
  </LegalPage>
);

export const PrivacyPolicyPage: React.FC = () => (
  <LegalPage title="Privacy Policy">
    <p>
      We respect your privacy. This policy explains how {BUSINESS_INFO.name}
      handles information you provide while using this website.
    </p>

    <section>
      <h2 className="font-bold text-chocolate text-xl mb-2">
        1. Information we collect
      </h2>
      <p>
        Depending on how you use the website, this may include your name,
        email address, phone number, account information, delivery address,
        order details, and communications with us.
      </p>
    </section>

    <section>
      <h2 className="font-bold text-chocolate text-xl mb-2">
        2. How information is used
      </h2>
      <p>
        We use this information to create and manage accounts, process order
        requests, coordinate delivery or pickup, respond to questions, and
        protect our website against unauthorized activity.
      </p>
    </section>

    <section>
      <h2 className="font-bold text-chocolate text-xl mb-2">
        3. Cookies and browser storage
      </h2>
      <p>
        We use essential authentication and security cookies. We do not
        currently use analytics or advertising cookies. If the website
        remembers that you dismissed its cookie notice for the current
        browser tab, that preference is stored in session storage.
      </p>
    </section>

    <section>
      <h2 className="font-bold text-chocolate text-xl mb-2">
        4. Service providers and disclosures
      </h2>
      <p>
        Information may be processed by service providers that support
        website hosting, application operation, and database storage.
        Information may also be disclosed where required by applicable law.
      </p>
    </section>

    <section>
      <h2 className="font-bold text-chocolate text-xl mb-2">
        5. Security and retention
      </h2>
      <p>
        We use security measures intended to protect account and order
        information. Information is retained according to operational,
        security, and applicable legal requirements.
      </p>
    </section>

    <section>
      <h2 className="font-bold text-chocolate text-xl mb-2">
        6. Your questions and requests
      </h2>
      <p>
        You may contact us to ask about your personal information or request
        a correction, subject to applicable law and any necessary verification.
      </p>
      <ContactDetails />
    </section>
  </LegalPage>
);