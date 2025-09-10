import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-3xl" role="img" aria-label="robot">🤖</span>
            </div>
            <div className="ml-4">
              <h1 className="text-xl font-bold text-slate-800">AI 쿠팡 파트너스 블로그 생성기</h1>
              <p className="text-sm text-slate-500">리뷰, FAQ, SEO 스키마까지 완벽한 블로그 포스트를 AI로 생성하세요.</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;