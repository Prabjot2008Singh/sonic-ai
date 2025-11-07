import React from 'react';
import PageWrapper from './PageWrapper';

interface PrivacyPageProps {
  onBack: () => void;
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack }) => {
  return (
    <PageWrapper title="Privacy Policy" onBack={onBack}>
      <h2>1. Information We Collect</h2>
      <p>We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our app, register on the app, and in connection with other activities, services, features or resources we make available on our App. We only collect the information you provide to us directly, such as your mood descriptions.</p>
      
      <h2>2. How We Use Collected Information</h2>
      <p>Sonic.AI may collect and use Users personal information for the following purposes:
        <ul>
          <li>- To improve customer service: Information you provide helps us respond to your customer service requests and support needs more efficiently.</li>
          <li>- To personalize user experience: We may use information in the aggregate to understand how our Users as a group use the services and resources provided on our App.</li>
          <li>- To improve our App: We may use feedback you provide to improve our products and services.</li>
        </ul>
      </p>
      
      <h2>3. How We Protect Your Information</h2>
      <p>We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information and data stored on our App.</p>
      
      <h2>4. Sharing Your Personal Information</h2>
      <p>We do not sell, trade, or rent Users personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners for the purposes outlined above.</p>

      <h2>5. Changes to This Privacy Policy</h2>
      <p>Sonic.AI has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the bottom of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect.</p>

      <h2>6. Your Acceptance of These Terms</h2>
      <p>By using this App, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our App. Your continued use of the App following the posting of changes to this policy will be deemed your acceptance of those changes.</p>
    </PageWrapper>
  );
};

export default PrivacyPage;
