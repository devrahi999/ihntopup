'use client';

import React from 'react';
import { usePopup } from '@/contexts/PopupContext';
import { FaCheckCircle, FaExclamationTriangle, FaTimes, FaInfoCircle } from 'react-icons/fa';

const PopupContainer: React.FC = () => {
  const { popups, hidePopup } = usePopup();

  const getPopupStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-500',
          text: 'text-green-800',
          icon: <FaCheckCircle className="text-green-500 text-xl" />,
          progress: 'bg-green-500'
        };
      case 'error':
        return {
          bg: 'bg-red-50 border-red-500',
          text: 'text-red-800',
          icon: <FaExclamationTriangle className="text-red-500 text-xl" />,
          progress: 'bg-red-500'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-500',
          text: 'text-yellow-800',
          icon: <FaExclamationTriangle className="text-yellow-500 text-xl" />,
          progress: 'bg-yellow-500'
        };
      case 'info':
        return {
          bg: 'bg-blue-50 border-blue-500',
          text: 'text-blue-800',
          icon: <FaInfoCircle className="text-blue-500 text-xl" />,
          progress: 'bg-blue-500'
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-500',
          text: 'text-gray-800',
          icon: <FaInfoCircle className="text-gray-500 text-xl" />,
          progress: 'bg-gray-500'
        };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {popups.map((popup) => {
        const styles = getPopupStyles(popup.type);
        
        return (
          <div
            key={popup.id}
            className={`${styles.bg} border-l-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out animate-fade-in-up`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {styles.icon}
                </div>
                <div className="ml-3 flex-1">
                  <h3 className={`text-sm font-semibold ${styles.text}`}>
                    {popup.title}
                  </h3>
                  <p className={`mt-1 text-sm ${styles.text}`}>
                    {popup.message}
                  </p>
                </div>
                <button
                  onClick={() => hidePopup(popup.id)}
                  className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>
            </div>
            {/* Progress bar for auto-dismiss */}
            {popup.duration && popup.duration > 0 && (
              <div className="w-full h-1 bg-gray-200 rounded-b-lg overflow-hidden">
                <div 
                  className={`h-full ${styles.progress} transition-all duration-linear`}
                  style={{ 
                    animation: `shrinkWidth ${popup.duration}ms linear forwards`,
                    width: '100%'
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
      
      <style jsx>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default PopupContainer;
