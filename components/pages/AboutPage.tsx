import React from 'react';
import PageWrapper from './PageWrapper';

interface AboutPageProps {
  onBack: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  return (
    <PageWrapper title="About Sonic.AI" onBack={onBack}>
      <h2>Our Mission</h2>
      <p>Sonic.AI was born from a simple idea: music is the universal language of emotion. Our mission is to bridge the gap between how you feel and what you hear. We believe that the right song at the right moment can change your day, and we've harnessed the power of advanced AI to make that connection seamless and intuitive.</p>
      
      <h2>How It Works</h2>
      <p>When you tell Sonic.AI how you're feeling, we don't just look for keywords. Our powerful AI model analyzes the sentiment, context, and nuance of your words to understand your emotional state. It then scours a curated database of Bollywood and Punjabi music to find tracks that perfectly match your vibe, whether you need a boost of energy, a moment of calm, or a song that understands your sorrow.</p>
      
      <h2>The Technology</h2>
      <p>This application is powered by state-of-the-art generative AI. We utilize large language models to perform sophisticated sentiment analysis, ensuring that our recommendations are not just accurate, but emotionally intelligent. The front-end is built with modern web technologies to provide a smooth, responsive, and beautiful user experience.</p>

      <h2>The Creator</h2>
      <p>Sonic.AI was conceptualized and developed by Mr. Prabjot Singh, a visionary who believes in the therapeutic power of combining technology and art. His goal was to create an application that doesn't just play music, but feels with you.</p>

      <h2>Join Us on Our Journey</h2>
      <p>We are constantly improving and expanding our musical library and AI capabilities. Thank you for being a part of our community. Feel the Magic in Every Beat!</p>
    </PageWrapper>
  );
};

export default AboutPage;
