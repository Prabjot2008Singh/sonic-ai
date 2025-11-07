import React from 'react';
import PageWrapper from './PageWrapper';

interface TermsPageProps {
  onBack: () => void;
}

const TermsPage: React.FC<TermsPageProps> = ({ onBack }) => {
  return (
    <PageWrapper title="Terms and Conditions" onBack={onBack}>
      <h2>1. Introduction</h2>
      <p>Welcome to Sonic.AI ("we", "our", "us"). These Terms and Conditions govern your use of our application. By using Sonic.AI, you agree to these terms in full. If you disagree with these terms or any part of these terms, you must not use our application.</p>
      
      <h2>2. License to Use Application</h2>
      <p>Unless otherwise stated, we own the intellectual property rights for all material on Sonic.AI. All intellectual property rights are reserved. You may view and/or print pages from the app for your own personal use subject to restrictions set in these terms and conditions.</p>
      
      <h2>3. Acceptable Use</h2>
      <p>You must not use our application in any way that causes, or may cause, damage to the application or impairment of the availability or accessibility of the application; or in any way which is unlawful, illegal, fraudulent, or harmful.</p>
      
      <h2>4. User Content</h2>
      <p>In these terms and conditions, "your user content" means material (including without limitation text, images, audio material) that you submit to our application. You grant to us a worldwide, irrevocable, non-exclusive, royalty-free license to use, reproduce, and adapt your user content in any existing or future media.</p>

      <h2>5. Limitations of Liability</h2>
      <p>The information on this application is provided "as-is" without any representations or warranties, express or implied. We will not be liable to you in relation to the contents of, or use of, or otherwise in connection with, this application.</p>

      <h2>6. Changes to Terms</h2>
      <p>We reserve the right to revise these terms and conditions from time to time. The revised terms and conditions shall apply to the use of our application from the date of publication of the revised terms and conditions on our application.</p>
    </PageWrapper>
  );
};

export default TermsPage;
