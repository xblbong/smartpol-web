import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Card, Typography, Steps } from 'antd';
import { FaHome, FaVoteYea, FaGavel, FaUser, FaUserShield, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const Tutorial = ({ visible, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightElement, setHighlightElement] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const tooltipRef = useRef(null);

  const tutorialSteps = [
    {
      title: "Selamat Datang di SmartPol",
      content: "Platform transparansi politik untuk partisipasi aktif masyarakat dalam proses demokrasi.",
      icon: <FaHome />,
      selector: null,
      description: "Mari mulai tur untuk memahami fitur-fitur yang tersedia di SmartPol."
    },
    {
      title: "Beranda - Chat dengan PICO AI",
      content: "Halaman utama tempat Anda dapat berinteraksi dengan PICO, asisten virtual SmartPol.",
      icon: <FaHome />,
      selector: ".chat-container",
      description: "Di sini Anda dapat mengajukan pertanyaan tentang kebijakan, pengaduan, atau navigasi platform. Gunakan tombol + untuk memulai chat baru."
    },
    {
      title: "Polling - Berpartisipasi dalam Survei",
      content: "Ikuti polling dan berikan suara Anda pada isu-isu penting.",
      icon: <FaVoteYea />,
      selector: "[data-tutorial='polling']",
      description: "Klik menu Polling untuk melihat survei aktif dan berpartisipasi dalam pengambilan keputusan publik."
    },
    {
      title: "Kebijakan - Informasi Terkini",
      content: "Akses informasi kebijakan terbaru dan berikan feedback.",
      icon: <FaGavel />,
      selector: "[data-tutorial='kebijakan']",
      description: "Menu Kebijakan menyediakan akses ke informasi kebijakan terbaru yang dapat Anda baca dan komentari."
    },
    {
      title: "Edit Profile - Kelola Akun Anda",
      content: "Perbarui informasi profil dan data pribadi Anda.",
      icon: <FaUser />,
      selector: "[data-tutorial='edit-profile']",
      description: "Gunakan fitur Edit Profile untuk memperbarui nama, email, dan informasi pribadi lainnya."
    },
    {
      title: "Verifikasi NIK - Keamanan Akun",
      content: "Verifikasi identitas Anda untuk meningkatkan keamanan dan kredibilitas.",
      icon: <FaUserShield />,
      selector: "[data-tutorial='nik-verification']",
      description: "Verifikasi NIK membantu memastikan keamanan akun dan meningkatkan kredibilitas partisipasi Anda."
    }
  ];

  const calculateTooltipPosition = (element) => {
    if (!element) return { top: 0, left: 0 };
    
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    // Position tooltip to the right of the element, or left if not enough space
    const windowWidth = window.innerWidth;
    const tooltipWidth = 400; // Estimated tooltip width
    
    let left = rect.right + scrollLeft + 20;
    if (left + tooltipWidth > windowWidth) {
      left = rect.left + scrollLeft - tooltipWidth - 20;
    }
    
    const top = rect.top + scrollTop;
    
    return { top, left };
  };

  const highlightElementBySelector = (selector) => {
    if (!selector) {
      setTooltipVisible(true);
      return;
    }
    
    // Remove previous highlights
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
    });
    
    // Add highlight to current element
    const element = document.querySelector(selector);
    if (element) {
      element.classList.add('tutorial-highlight');
      
      // Scroll element into view smoothly but don't center it
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setHighlightElement(element);
      
      // Calculate and set tooltip position immediately for smooth transition
      const position = calculateTooltipPosition(element);
      setTooltipPosition(position);
      setTooltipVisible(true);
    } else {
      setTooltipVisible(true);
    }
  };

  useEffect(() => {
    if (visible && currentStep < tutorialSteps.length) {
      const step = tutorialSteps[currentStep];
      highlightElementBySelector(step.selector);
    }
    
    return () => {
      // Cleanup highlights when component unmounts
      document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
      });
    };
  }, [currentStep, visible]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
    });
    onClose();
  };

  const currentStepData = tutorialSteps[currentStep];

  return (
    <>
      {/* Overlay */}
      {visible && (
        <div 
          className="tutorial-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Floating Tooltip */}
      {visible && tooltipVisible && (
        <div
          ref={tooltipRef}
          className="tutorial-tooltip"
          style={{
            position: 'absolute',
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            zIndex: 1001,
            maxWidth: '400px',
            minWidth: '300px',
            pointerEvents: 'auto',
            transition: 'top 0.3s ease, left 0.3s ease'
          }}
        >
          <Card 
            className="shadow-2xl border-2"
            style={{ 
              borderColor: '#01077A',
              backgroundColor: 'white'
            }}
          >
            {/* Progress indicator */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <Text className="text-xs font-semibold" style={{ color: '#01077A' }}>
                  Tutorial SmartPol
                </Text>
                <Text className="text-xs text-gray-500">
                  {currentStep + 1} / {tutorialSteps.length}
                </Text>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="h-1 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${((currentStep + 1) / tutorialSteps.length) * 100}%`,
                    backgroundColor: '#01077A'
                  }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex items-start mb-4">
              <div className="text-xl mr-3 mt-1" style={{ color: '#01077A' }}>
                {currentStepData.icon}
              </div>
              <div className="flex-1">
                <Title level={5} className="mb-2" style={{ color: '#01077A' }}>
                  {currentStepData.title}
                </Title>
                <Paragraph className="text-sm text-gray-600 mb-2">
                  {currentStepData.content}
                </Paragraph>
                <Text className="text-xs text-gray-500">
                  {currentStepData.description}
                </Text>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <Button
                size="small"
                onClick={handlePrev}
                disabled={currentStep === 0}
                icon={<FaArrowLeft />}
              >
                Sebelumnya
              </Button>
              
              <Button
                size="small"
                onClick={handleClose}
                type="text"
                className="text-gray-500"
              >
                Tutup
              </Button>
              
              {currentStep < tutorialSteps.length - 1 ? (
                <Button
                  size="small"
                  type="primary"
                  onClick={handleNext}
                  style={{ backgroundColor: '#01077A', borderColor: '#01077A' }}
                >
                  Selanjutnya <FaArrowRight />
                </Button>
              ) : (
                <Button
                  size="small"
                  type="primary"
                  onClick={handleClose}
                  style={{ backgroundColor: '#01077A', borderColor: '#01077A' }}
                >
                  Selesai
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Center modal for first step */}
      {visible && !tooltipVisible && (
        <Modal
          title="Tutorial Pemakaian SmartPol"
          open={true}
          onCancel={handleClose}
          footer={null}
          width={500}
          centered
          style={{ zIndex: 1050 }}
        >
          <div className="text-center py-4">
            <div className="text-4xl mb-4" style={{ color: '#01077A' }}>
              {currentStepData.icon}
            </div>
            <Title level={3} style={{ color: '#01077A' }}>
              {currentStepData.title}
            </Title>
            <Paragraph className="text-gray-600 mb-4">
              {currentStepData.content}
            </Paragraph>
            <Text className="text-sm text-gray-500">
              {currentStepData.description}
            </Text>
            <div className="mt-6">
              <Button
                type="primary"
                size="large"
                onClick={handleNext}
                style={{ backgroundColor: '#01077A', borderColor: '#01077A' }}
              >
                Mulai Tutorial <FaArrowRight />
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* CSS for highlighting */}
      <style jsx global>{`
        .tutorial-highlight {
          position: relative;
          z-index: 1000;
          box-shadow: 0 0 0 4px rgba(1, 7, 122, 0.3), 0 0 0 8px rgba(1, 7, 122, 0.1) !important;
          border-radius: 8px !important;
          transition: all 0.3s ease;
        }
        
        .tutorial-highlight::before {
          content: '';
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          background: rgba(1, 7, 122, 0.1);
          border-radius: 8px;
          z-index: -1;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(1, 7, 122, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(1, 7, 122, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(1, 7, 122, 0);
          }
        }
      `}</style>
    </>
  );
};

export default Tutorial;