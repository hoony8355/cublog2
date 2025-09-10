
import React from 'react';

const GuideCard: React.FC<{ title: string; children: React.ReactNode; icon: string; }> = ({ title, children, icon }) => (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center">
            <span className="text-2xl mr-3">{icon}</span>
            {title}
        </h3>
        <div className="space-y-2 text-slate-600">{children}</div>
    </div>
);


const Guide: React.FC = () => {
  return (
    <div className="space-y-8">
        <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-800">쿠팡 파트너스 SEO 성공 가이드</h2>
            <p className="mt-2 text-lg text-slate-500">수동 작업을 넘어, 자동화된 시스템으로 검색 노출을 극대화하세요.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
            <GuideCard title="현재 방식의 한계" icon="🤔">
                <p>GitHub Pages에 수동으로 HTML 파일을 업로드하는 방식은 몇 가지 명확한 한계가 있습니다.</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                    <li><strong>수동 업데이트의 비효율</strong>: 새 글을 추가할 때마다 네비게이션 메뉴, 사이트맵을 직접 수정해야 합니다.</li>
                    <li><strong>확장성 부족</strong>: 글이 100개, 1000개로 늘어나면 관리가 거의 불가능해집니다.</li>
                    <li><strong>SEO 기회 손실</strong>: sitemap.xml, robots.txt 등의 자동 생성이 어려워 검색 엔진 최적화에 불리합니다.</li>
                </ul>
            </GuideCard>

            <GuideCard title="추천 워크플로우: 자동화" icon="🚀">
                <p>정적 사이트 생성기(SSG)와 최신 호스팅 플랫폼을 활용해 이 모든 과정을 자동화할 수 있습니다.</p>
                <ol className="list-decimal list-inside space-y-1 pl-2 font-semibold">
                    <li><span className="font-normal">글 데이터를 Markdown 파일로 관리</span></li>
                    <li><span className="font-normal"><strong>Next.js</strong>나 <strong>Astro</strong> 같은 프레임워크로 웹사이트 빌드</span></li>
                    <li><span className="font-normal">GitHub에 코드 푸시</span></li>
                    <li><span className="font-normal"><strong>Vercel</strong> 또는 <strong>Netlify</strong>에서 자동으로 빌드 및 배포</span></li>
                </ol>
                 <div className="mt-4 p-3 bg-slate-100 rounded-md text-sm text-center font-mono">
                    <p>Git Push ➡️ 자동 빌드 ➡️ 사이트맵 생성 ➡️ 전세계 CDN 배포 ✨</p>
                </div>
            </GuideCard>
        </div>

        <GuideCard title="핵심 SEO 체크리스트" icon="✅">
            <p>검색 엔진이 당신의 사이트를 좋아하게 만들 필수 요소들입니다.</p>
            <ul className="list-disc list-inside grid sm:grid-cols-2 gap-x-6 gap-y-2">
                <li><strong>sitemap.xml</strong>: 사이트의 모든 페이지 목록을 제공하여 검색엔진이 쉽게 크롤링하도록 돕습니다.</li>
                <li><strong>robots.txt</strong>: 검색엔진 크롤러에게 어떤 페이지를 수집하고, 어떤 페이지를 무시할지 알려줍니다.</li>
                <li><strong>시맨틱 HTML</strong>: <code>&lt;h1&gt;</code>, <code>&lt;article&gt;</code> 등 의미에 맞는 태그를 사용하여 콘텐츠 구조를 명확히 합니다.</li>
                <li><strong>구조화된 데이터 (Schema)</strong>: 상품 정보, 리뷰 등을 검색엔진이 이해하기 쉬운 형태로 제공하여 검색 결과에 더 풍부하게 표시되도록 합니다.</li>
                 <li><strong>빠른 로딩 속도</strong>: Vercel/Netlify 같은 플랫폼은 이미지 최적화와 CDN을 통해 최고의 속도를 보장합니다.</li>
                <li><strong>모바일 최적화</strong>: 반응형 디자인은 필수입니다. Tailwind CSS가 큰 도움이 됩니다.</li>
            </ul>
        </GuideCard>

        <div className="text-center mt-10">
            <a href="https://vercel.com/templates/next.js/blog-starter-kit" target="_blank" rel="noopener noreferrer" className="inline-block bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                Next.js 블로그 스타터로 시작하기
            </a>
        </div>
    </div>
  );
};

export default Guide;
