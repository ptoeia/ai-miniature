'use client';

import React, { useEffect, useRef } from 'react';
import Script from 'next/script';

interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
  className?: string;
}

export default function ImageComparison({
  beforeImage,
  afterImage,
  beforeAlt,
  afterAlt,
  className = '',
}: ImageComparisonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeSlider = () => {
      // 等待一段时间确保脚本已加载
      setTimeout(() => {
        const slider = containerRef.current?.querySelector('img-comparison-slider');
        if (slider) {
          console.log('Slider element found, initializing...');
          // 设置滑块属性
          slider.setAttribute('value', '50');
          slider.setAttribute('hover', 'true');
          slider.setAttribute('direction', 'horizontal');
          slider.setAttribute('keyboard', 'true');
          console.log('Slider initialized successfully');
        } else {
          console.error('Slider element not found in DOM');
        }
      }, 500);
    };

    // 检查脚本是否已加载
    if (typeof customElements !== 'undefined' && customElements.get('img-comparison-slider')) {
      initializeSlider();
    } else {
      // 如果脚本还没加载，等待一下再试
      setTimeout(initializeSlider, 1000);
    }
  }, []);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/img-comparison-slider@8/dist/index.js"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log('img-comparison-slider script loaded from CDN');
        }}
        onError={(e) => {
          console.error('Failed to load img-comparison-slider script:', e);
        }}
      />
      <div ref={containerRef} className={`w-full ${className}`}>
        <img-comparison-slider>
          <img 
            slot="first" 
            src={beforeImage} 
            alt={beforeAlt}
            className="w-full h-auto"
          />
          <img 
            slot="second" 
            src={afterImage} 
            alt={afterAlt}
            className="w-full h-auto"
          />
        </img-comparison-slider>
      </div>
    </>
  );
} 