import React from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

interface OnboardingTourProps {
  run: boolean;
  onClose: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ run, onClose }) => {
  const steps: Step[] = [
    {
      target: 'body',
      placement: 'center',
      title: 'Welcome to Butterflies',
      content: 'Your all-in-one study and exam companion. Let’s take a quick tour!'
    },
    {
      target: '[data-tour="study-tools"]',
      title: 'Smart Study Tools',
      content: 'Access timers, flashcards, mind maps and more to make studying engaging.'
    },
    {
      target: '[data-tour="notifications"]',
      title: 'Smart Notifications',
      content: 'Stay on top of upcoming exams, deadlines and personalized reminders.'
    },
    {
      target: '[data-tour="profile"]',
      title: 'Your Profile',
      content: 'Track progress, achievements and customize your experience.'
    },
  ];

  const handleCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      onClose();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      showSkipButton
      spotlightPadding={10}
      styles={{
        options: {
          arrowColor: 'rgba(17,24,39,0.9)',
          backgroundColor: 'rgba(17,24,39,0.9)',
          overlayColor: 'rgba(0,0,0,0.5)',
          primaryColor: '#8b5cf6',
          textColor: '#fff',
          zIndex: 1000,
        },
      }}
      callback={handleCallback}
    />
  );
};

export default OnboardingTour;


