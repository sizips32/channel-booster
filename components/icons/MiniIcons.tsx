
import React from 'react';

// Using Heroicons v2 Mini SVGs

export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 10.707V17.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10.707a1 1 0 0 1 .293-.707l7-7Z" clipRule="evenodd" />
  </svg>
);

export const LightBulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M10 2a.75.75 0 0 1 .75.75v1.256a.75.75 0 0 1-.5.707A4.488 4.488 0 0 0 8.002 9.25a.75.75 0 0 1-.5.707A4.493 4.493 0 0 0 5.006 14c0 .034.002.067.004.1a.75.75 0 0 1-1.498.086A6.002 6.002 0 0 1 3.504 14c0-2.38.994-4.516 2.623-5.99a5.987 5.987 0 0 1 2.93-1.636.75.75 0 0 1 .437-.692A4.486 4.486 0 0 0 11.998 3a.75.75 0 0 1-.5-.707A4.487 4.487 0 0 0 9.254 4.02a.75.75 0 0 1-.5-.707V2.05A.75.75 0 0 1 10 2Z" />
    <path d="M10 15.5a.75.75 0 0 1 .75.75v.038a.751.751 0 0 1-.723.758A2.001 2.001 0 0 1 8 15.25a.75.75 0 0 1 .75-.75h1.25a.75.75 0 0 1 .75.75V17a.75.75 0 0 1-1.5 0v-.25A.75.75 0 0 1 10 15.5Z" />
  </svg>
);

export const PencilSquareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343Z" />
  </svg>
);

export const VideoCameraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l3.22-3.22a.75.75 0 0 0-1.06-1.06L6.22 8.72Z" />
    <path d="m3.47 10.97 3.5-3.5a.75.75 0 0 1 1.06 0l3.5 3.5a.75.75 0 0 1-1.06 1.06L8.25 8.31V15.5a.75.75 0 0 1-1.5 0V8.31L3.47 11.03a.75.75 0 0 1-1.06-1.06Zm13.06-2.02a.75.75 0 0 0-1.06 0L12 12.47l-.22-.22a.75.75 0 0 0-1.06 1.06l.5.5c.3.3.77.3 1.06 0l3.5-3.5a.75.75 0 0 0 0-1.06Z" />
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-5.5-2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" clipRule="evenodd" />
  </svg>
);

export const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
  <path d="M12 5.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75V5.25Zm-3 0a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75V5.25Zm-3 0a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75V5.25Z" />
  <path fillRule="evenodd" d="M2.227 3.344c0-.85.694-1.544 1.543-1.544h12.46c.85 0 1.543.694 1.543 1.544v11.112c0 .85-.694 1.544-1.543 1.544H3.77c-.85 0-1.543-.694-1.543-1.544V3.344ZM3.77 1.25C2.495 1.25 1.43 2.316 1.43 3.594v10.812C1.43 15.684 2.495 16.75 3.77 16.75h12.46c1.275 0 2.34-1.066 2.34-2.344V3.594c0-1.278-1.065-2.344-2.34-2.344H3.77Z" clipRule="evenodd" />
</svg>
);

export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
  </svg>
);

export const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
  </svg>
);

export const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343Z" />
  </svg>
);

export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.58.177-2.365.297a.75.75 0 0 0-.5.858v1.61c0 .093.03.183.084.258l3.016 4.475A2.75 2.75 0 0 0 8.75 13h2.5a2.75 2.75 0 0 0 2.565-1.761l3.016-4.475a.43.43 0 0 0 .084-.258V5.35a.75.75 0 0 0-.5-.858C15.58 4.37 14.795 4.27 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM6.54 5.923a.75.75 0 1 0-1.08 1.036l.22-.198a.75.75 0 0 0 1.08-1.036l-.22.198ZM13.46 5.923a.75.75 0 1 1 1.08 1.036l-.22-.198a.75.75 0 0 1-1.08-1.036l.22.198ZM8.75 7.5a.75.75 0 0 1 .75.75v3.25a.75.75 0 0 1-1.5 0V8.25a.75.75 0 0 1 .75-.75Zm2.5 0a.75.75 0 0 1 .75.75v3.25a.75.75 0 0 1-1.5 0V8.25a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    <path d="M4.193 3.99A2.25 2.25 0 0 0 2 6.242v9.016A2.25 2.25 0 0 0 4.25 17.5h11.5A2.25 2.25 0 0 0 18 15.258V6.242A2.25 2.25 0 0 0 15.807 3.99c-.28.02-.55.053-.807.097V3.75a1.25 1.25 0 0 0-1.25-1.25h-2.5A1.25 1.25 0 0 0 10 3.75v.337c-.257-.044-.527-.077-.807-.097Z" />
  </svg>
);

export const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.89a1.5 1.5 0 0 0 0-2.537L6.3 2.841Z" />
  </svg>
);

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.393c-.842.07-1.168 1.063-.544 1.631l3.675 3.18-1.103 4.636c-.194.813.691 1.456 1.405 1.02L10 15.591l4.024 2.477c.714.436 1.598-.207 1.404-1.02l-1.103-4.636 3.675-3.18c.624-.568.297-1.561-.544-1.631l-4.753-.393L10.868 2.884Z" clipRule="evenodd" />
  </svg>
);

export const ArrowPathIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
  <path fillRule="evenodd" d="M15.312 11.424c-.18-.54-.693-.848-1.257-.848H6.034l1.452-1.452a.75.75 0 0 0-1.06-1.06l-2.752 2.752a.75.75 0 0 0 0 1.06l2.752 2.752a.75.75 0 1 0 1.06-1.06L6.034 12.024h7.926c.074 0 .149.006.221.017l-.285.285a.75.75 0 0 0 1.06 1.06l1.75-1.75a.75.75 0 0 0-.093-1.168Z" clipRule="evenodd" />
  <path fillRule="evenodd" d="M4.688 8.576c.18.54.693.848 1.257.848h7.926l-1.452 1.452a.75.75 0 1 0 1.06 1.06l2.752-2.752a.75.75 0 0 0 0-1.06L13.48 5.372a.75.75 0 1 0-1.06 1.06l1.452 1.452H5.945c-.074 0-.149-.006-.221-.017l.285-.285a.75.75 0 0 0-1.06-1.06l-1.75 1.75a.75.75 0 0 0 .093 1.168Z" clipRule="evenodd" />
</svg>
);
