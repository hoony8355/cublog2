import React, { useState } from 'react';
import Generator from './components/Generator';
import Guide from './components/Guide';
import Header from './components/Header';

type Tab = 'generator' | 'guide';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('generator');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'generator':
        return <Generator />;
      case 'guide':
        return <Guide />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 min-h-[70vh]">
          <div className="border-b border-slate-200 mb-6">
            <nav className="flex space-x-1 -mb-px" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('generator')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'generator'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                🤖 AI 블로그 생성기
              </button>
              <button
                onClick={() => setActiveTab('guide')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'guide'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                🚀 SEO 최적화 가이드
              </button>
            </nav>
          </div>
          {renderTabContent()}
        </div>
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm">
        <p>Powered by Google Gemini & React. Designed for Coupang Partners success.</p>
      </footer>
    </div>
  );
};

export default App;