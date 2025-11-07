import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon } from './Icons';

interface TourStep {
  selector: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  steps: Readonly<TourStep[]>;
  currentStep: number;
  onStepChange: (step: number) => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onClose, steps, currentStep, onStepChange }) => {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && steps[currentStep]) {
      const targetElement = document.querySelector(steps[currentStep].selector);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        setTargetRect(rect);
        // Avoid scrolling for the language selector as it's already in view
        if (steps[currentStep].selector !== '#language-selector-container') {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
      } else {
        // If element not found, skip to next step or close
        handleNext();
      }
    }
  }, [isOpen, currentStep, steps]);
  
  if (!isOpen || !targetRect) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const getTooltipPosition = () => {
    const position = step.position || 'bottom';
    const gap = 15;
    let style: React.CSSProperties = { transition: 'top 0.3s ease-in-out, left 0.3s ease-in-out' };

    if (!tooltipRef.current) return style;

    const tooltipWidth = tooltipRef.current.offsetWidth;
    const tooltipHeight = tooltipRef.current.offsetHeight;

    let top, left;

    switch (position) {
      case 'top':
        top = targetRect.top - tooltipHeight - gap;
        left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
        left = targetRect.left - tooltipWidth - gap;
        break;
      case 'right':
         top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
         left = targetRect.right + gap;
         break;
      case 'bottom':
      default:
        top = targetRect.bottom + gap;
        left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
    }

    if (left < gap) left = gap;
    if (left + tooltipWidth > window.innerWidth - gap) left = window.innerWidth - tooltipWidth - gap;
    if (top < gap) top = gap;
    if (top + tooltipHeight > window.innerHeight - gap) top = window.innerHeight - tooltipHeight - gap;
    
    style.top = `${top}px`;
    style.left = `${left}px`;
    
    return style;
  };

  const getArrowStyles = (): React.CSSProperties => {
    const position = step.position || 'bottom';
    const size = 8;
    let styles: React.CSSProperties = {
        position: 'absolute',
        width: 0,
        height: 0,
        borderStyle: 'solid',
        transition: 'all 0.3s ease-in-out',
    };

    const commonDarkBorder = document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff';

    switch (position) {
        case 'top':
            styles = { ...styles, bottom: -size, left: '50%', transform: 'translateX(-50%)', borderWidth: `${size}px ${size}px 0 ${size}px`, borderColor: `${commonDarkBorder} transparent transparent transparent` };
            break;
        case 'bottom':
            styles = { ...styles, top: -size, left: '50%', transform: 'translateX(-50%)', borderWidth: `0 ${size}px ${size}px ${size}px`, borderColor: `transparent transparent ${commonDarkBorder} transparent` };
            break;
        case 'right':
            styles = { ...styles, left: -size, top: '50%', transform: 'translateY(-50%)', borderWidth: `${size}px ${size}px ${size}px 0`, borderColor: `transparent ${commonDarkBorder} transparent transparent` };
            break;
        case 'left':
            styles = { ...styles, right: -size, top: '50%', transform: 'translateY(-50%)', borderWidth: `${size}px 0 ${size}px ${size}px`, borderColor: `transparent transparent transparent ${commonDarkBorder}` };
            break;
    }
    return styles;
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-[100] transition-opacity duration-300">
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            style={{
                clipPath: `path('M0,0H${window.innerWidth}V${window.innerHeight}H0V0ZM${targetRect.x - 4},${targetRect.y - 4}H${targetRect.x + targetRect.width+4}V${targetRect.y + targetRect.height+4}H${targetRect.x-4}V${targetRect.y-4}Z')`,
                transition: 'clip-path 0.3s ease-in-out',
            }}
            onClick={onClose}
        ></div>
        <div 
            className="fixed rounded-lg border-2 border-purple-500 shadow-2xl pointer-events-none animate-pulse-strong"
            style={{
                width: `${targetRect.width + 8}px`,
                height: `${targetRect.height + 8}px`,
                top: `${targetRect.top - 4}px`,
                left: `${targetRect.left - 4}px`,
                transition: 'all 0.3s ease-in-out',
            }}
        ></div>
        
        <div
            ref={tooltipRef}
            className="fixed z-[101] bg-white dark:bg-gray-800 rounded-lg shadow-xl w-72 p-4 animate-fade-in"
            style={getTooltipPosition()}
        >
            <div style={getArrowStyles()}></div>
            <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-1 transition-colors">
                <CloseIcon className="w-4 h-4" />
            </button>
            <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">{step.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{step.content}</p>

            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mb-4">
              <div
                className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{currentStep + 1} / {steps.length}</span>
                <div className="space-x-2">
                    {currentStep > 0 && (
                        <button onClick={handlePrev} className="px-4 py-1.5 text-sm font-semibold rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                            Prev
                        </button>
                    )}
                    <button onClick={handleNext} className="px-4 py-1.5 text-sm font-semibold rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                        {isLastStep ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
        <style>{`
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
                animation: fade-in 0.3s ease-out forwards;
            }
            @keyframes pulse-strong {
                0%, 100% {
                    box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.7);
                }
                50% {
                    box-shadow: 0 0 0 8px rgba(168, 85, 247, 0);
                }
            }
            .animate-pulse-strong {
                animation: pulse-strong 2s infinite;
            }
        `}</style>
    </div>
  );
};

export default OnboardingTour;