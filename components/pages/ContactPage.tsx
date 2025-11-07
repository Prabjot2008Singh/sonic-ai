import React from 'react';
import PageWrapper from './PageWrapper';

interface ContactPageProps {
  onBack: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  return (
    <PageWrapper title="Contact Us" onBack={onBack}>
      <h2>Get in Touch</h2>
      <p>We'd love to hear from you! Whether you have a question, feedback, or a song suggestion, please don't hesitate to reach out. We are always looking for ways to improve Sonic.AI and make it a better experience for our users.</p>
      
      <h3>General Inquiries & Support</h3>
      <p>For general questions or if you need help with the app, please email our support team. We'll do our best to get back to you within 48 hours.</p>
      <p><strong>Email:</strong> <a href="mailto:support@sonicai.app" className="text-pink-400 hover:underline">support@sonicai.app</a></p>
      
      <h3>Feedback & Suggestions</h3>
      <p>Have an idea for a new feature? Or want to suggest some songs we might have missed? We are all ears! Your feedback is invaluable in helping us grow.</p>
      <p><strong>Email:</strong> <a href="mailto:feedback@sonicai.app" className="text-pink-400 hover:underline">feedback@sonicai.app</a></p>

      <h3>Partnerships</h3>
      <p>For business inquiries and partnership opportunities, please contact our business development team.</p>
      <p><strong>Email:</strong> <a href="mailto:partners@sonicai.app" className="text-pink-400 hover:underline">partners@sonicai.app</a></p>
    </PageWrapper>
  );
};

export default ContactPage;
