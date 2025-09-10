import React, { useState, useCallback } from 'react';
import { ProductInput, RenderableBlogPost } from '../types';
import { generateBlogPost } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import CodeBlock from './CodeBlock';

// --- Helper Functions & Sub-Components ---

const generateHtmlForExport = (blogPost: RenderableBlogPost): string => {
  const productHtml = blogPost.products.map(p => `
    <div class="mb-12">
      <h2 class="text-3xl font-bold mb-4">${p.rank}. ${p.productName}</h2>
      <div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/3">
          <img src="${p.imageUrl}" alt="${p.productName}" class="rounded-lg shadow-lg w-full">
        </div>
        <div class="md:w-2/3">
          <p class="text-lg mb-4">${p.description}</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-bold text-green-800 mb-2">장점 (Pros)</h3>
              <ul class="list-disc list-inside text-green-700">${p.pros.map(pro => `<li>${pro}</li>`).join('')}</ul>
            </div>
            <div class="bg-red-50 p-4 rounded-lg">
              <h3 class="font-bold text-red-800 mb-2">단점 (Cons)</h3>
              <ul class="list-disc list-inside text-red-700">${p.cons.map(con => `<li>${con}</li>`).join('')}</ul>
            </div>
          </div>
          <a href="${p.coupangLink}" target="_blank" rel="noopener sponsored" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors duration-300 no-underline">쿠팡에서 최저가 확인하기</a>
        </div>
      </div>
    </div>
  `).join('');

  const faqHtml = blogPost.faq.map(f => `
    <div class="mb-4">
      <h3 class="text-xl font-semibold">${f.question}</h3>
      <p class="text-gray-600 mt-1">${f.answer}</p>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${blogPost.blogTitle}</title>
  <meta name="description" content="${blogPost.metaDescription}">
  <meta name="keywords" content="${blogPost.keywords.join(', ')}">
  <script src="https://cdn.tailwindcss.com"></script>
  <script type="application/ld+json">${blogPost.schemaMarkup}<\/script>
</head>
<body class="bg-gray-50 font-sans">
  <main class="container mx-auto p-8 bg-white shadow-lg my-8 rounded-lg">
    <article>
      <header>
        <h1 class="text-5xl font-extrabold text-gray-900 mb-4">${blogPost.blogTitle}</h1>
        <p class="text-xl text-gray-600 mb-8">${blogPost.introduction}</p>
      </header>
      
      <section class="mb-12">
        ${productHtml}
      </section>

      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-4">결론</h2>
        <p class="text-lg">${blogPost.conclusion}</p>
      </section>

      <section>
        <h2 class="text-3xl font-bold mb-4">자주 묻는 질문 (FAQ)</h2>
        ${faqHtml}
      </section>
    </article>
    <footer class="text-center text-sm text-gray-500 mt-12 pt-6 border-t">
      <p>이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</p>
    </footer>
  </main>
</body>
</html>`;
};

const generateMarkdownForExport = (blogPost: RenderableBlogPost): string => {
  const frontmatter = `---
title: "${blogPost.blogTitle.replace(/"/g, '\\"')}"
date: '${new Date().toISOString().split('T')[0]}'
description: "${blogPost.metaDescription.replace(/"/g, '\\"')}"
keywords: [${blogPost.keywords.map(k => `"${k}"`).join(', ')}]
---
`;

  const productsMarkdown = blogPost.products.map(p => `
### ${p.rank}. ${p.productName}

![${p.productName}](${p.imageUrl})

${p.description}

**장점:**
${p.pros.map(pro => `- ${pro}`).join('\n')}

**단점:**
${p.cons.map(con => `- ${con}`).join('\n')}

<a href="${p.coupangLink}" target="_blank" rel="noopener sponsored" style="display:inline-block; background-color:#0073e6; color:white; font-weight:bold; padding: 12px 24px; border-radius: 8px; text-align:center; text-decoration: none;">쿠팡에서 최저가 확인하기</a>
`).join('\n\n---\n');

  const faqMarkdown = blogPost.faq.map(f => `
### ${f.question}
${f.answer}
`).join('\n\n');

  const schemaScript = `<script type="application/ld+json">${blogPost.schemaMarkup}<\/script>`;

  const affiliateDisclaimer = `
*이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.*
`;

  return `${frontmatter}
${blogPost.introduction}

## 추천 상품 목록

${productsMarkdown}

## 결론

${blogPost.conclusion}

## 자주 묻는 질문 (FAQ)

${faqMarkdown}

---

${affiliateDisclaimer}

${schemaScript}
`;
};


const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => {
                const ratingValue = i + 1;
                return (
                    <svg key={i} aria-hidden="true" className={`w-5 h-5 ${ratingValue <= rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                );
            })}
            <span className="ml-2 text-sm font-medium text-gray-500">{rating.toFixed(1)}</span>
        </div>
    );
};


const ExportModal: React.FC<{ content: string; language: 'html' | 'markdown'; onClose: () => void }> = ({ content, language, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-bold">{language.toUpperCase()}로 내보내기</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>
                <div className="p-4 overflow-y-auto">
                    <CodeBlock content={content} language={language} />
                </div>
                 <div className="p-4 border-t text-sm text-gray-600">
                    <p>위 코드를 복사하여 {language === 'html' ? 'HTML 파일로 저장하거나, 블로그 에디터의 HTML 모드에' : '새로운 .md 파일에'} 붙여넣으세요.</p>
                </div>
            </div>
        </div>
    );
};

// --- Main Generator Component ---

const Generator: React.FC = () => {
  const [topic, setTopic] = useState<string>('2024년 최고의 가성비 무선 청소기 추천 TOP 3');
  const [productInputs, setProductInputs] = useState<ProductInput[]>([
    { id: crypto.randomUUID(), coupangLink: '', jsonLd: '', isJsonLdVisible: false },
  ]);
  const [generatedPost, setGeneratedPost] = useState<RenderableBlogPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalLanguage, setModalLanguage] = useState<'html' | 'markdown'>('html');

  const updateProduct = (id: string, newValues: Partial<ProductInput>) => {
    setProductInputs(prev => prev.map(p => p.id === id ? { ...p, ...newValues } : p));
  };

  const handleAddProduct = () => {
    setProductInputs(prev => [...prev, { id: crypto.randomUUID(), coupangLink: '', jsonLd: '', isJsonLdVisible: false }]);
  };

  const handleRemoveProduct = (id: string) => {
    setProductInputs(prev => prev.filter(p => p.id !== id));
  };

  const handleParseJsonLd = (id: string) => {
    const product = productInputs.find(p => p.id === id);
    if (!product || !product.jsonLd.trim()) {
        setError('JSON-LD 데이터를 입력해주세요.');
        return;
    }
    try {
        const parsed = JSON.parse(product.jsonLd);
        const productSchema = Array.isArray(parsed['@graph']) 
            ? parsed['@graph'].find((item: any) => item['@type'] === 'Product') 
            : parsed;
        
        if (productSchema && productSchema['@type'] === 'Product') {
            const rating = productSchema.aggregateRating;
            updateProduct(id, {
                productName: productSchema.name,
                imageUrl: productSchema.image,
                price: productSchema.offers?.price,
                brand: productSchema.brand?.name,
                aggregateRating: rating ? { ratingValue: parseFloat(rating.ratingValue), ratingCount: parseInt(rating.reviewCount) } : undefined,
                isJsonLdVisible: false,
            });
            setError(null);
        } else {
            throw new Error("유효한 'Product' 타입의 Schema를 찾을 수 없습니다.");
        }
    } catch(e) {
        console.error(e);
        setError(`JSON-LD 파싱 오류: ${(e as Error).message}`);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
        setError('블로그 주제를 입력해주세요.');
        return;
    }
    if (productInputs.some(p => !p.productName || !p.coupangLink)) {
        setError('모든 상품의 링크를 입력하고, 정보 자동 채우기를 완료해주세요.');
        return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedPost(null);

    try {
      const response = await generateBlogPost(topic, productInputs);
      const renderablePost: RenderableBlogPost = {
        ...response,
        products: response.products.map((p, index) => {
          const input = productInputs[index];
          return {
            ...p,
            imageUrl: input.imageUrl,
            coupangLink: input.coupangLink,
          };
        }),
      };
      setGeneratedPost(renderablePost);
    } catch (err) {
      setError('콘텐츠 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [topic, productInputs]);
  
  const openExportModal = (type: 'html' | 'markdown') => {
    if (!generatedPost) return;
    const content = type === 'html' ? generateHtmlForExport(generatedPost) : generateMarkdownForExport(generatedPost);
    setModalContent(content);
    setModalLanguage(type);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* --- INPUT FORM --- */}
      {!generatedPost && <div className="space-y-6">
         <div>
            <label htmlFor="blog-topic" className="block text-lg font-bold text-slate-800 mb-2">
                1. 블로그 주제
            </label>
            <input
                type="text"
                id="blog-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="예: 2024년 최고의 게이밍 마우스 추천"
                className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
            />
        </div>
        <div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">2. 상품 정보 입력</h2>
            <div className="space-y-4">
                 {productInputs.map((p, index) => (
                    <div key={p.id} className="bg-slate-50 border border-slate-200 p-4 rounded-lg relative">
                       <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">상품 {index + 1}</span>
                             {productInputs.length > 1 && <button onClick={() => handleRemoveProduct(p.id)} className="text-red-500 hover:text-red-700 font-bold">&times; 삭제</button>}
                       </div>

                       {p.productName && <p className="mb-2 font-semibold text-slate-700">{p.productName}</p>}
                       
                        <input
                            type="url"
                            placeholder="쿠팡 파트너스 링크"
                            value={p.coupangLink}
                            onChange={(e) => updateProduct(p.id, { coupangLink: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-md mb-2"
                        />
                        <button onClick={() => updateProduct(p.id, {isJsonLdVisible: !p.isJsonLdVisible})} className="text-sm text-blue-600 hover:underline mb-2">
                            상품 정보 자동 채우기 (JSON-LD) {p.isJsonLdVisible ? '▲ 닫기' : '▼ 열기'}
                        </button>

                       {p.isJsonLdVisible && <div className="space-y-2">
                            <p className="text-xs text-slate-500">쿠팡 상품 페이지 &gt; F12 개발자 도구 &gt; Console 탭 &gt; `copy(JSON.stringify(window.__PRELOADED_STATE__.product.product.schema))` 입력 후 결과 붙여넣기</p>
                            <textarea
                                value={p.jsonLd}
                                onChange={(e) => updateProduct(p.id, { jsonLd: e.target.value })}
                                placeholder="여기에 JSON-LD를 붙여넣으세요"
                                className="w-full h-24 p-2 border border-slate-300 rounded-md font-mono text-xs"
                            />
                            <button onClick={() => handleParseJsonLd(p.id)} className="px-4 py-2 bg-slate-600 text-white text-sm rounded-md hover:bg-slate-700">적용하기</button>
                        </div>}
                    </div>
                 ))}
                 <button onClick={handleAddProduct} className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:bg-slate-100 hover:border-slate-400 transition">
                    + 상품 추가하기
                </button>
            </div>
        </div>
         <div className="text-center pt-4">
            <button onClick={handleGenerate} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-4 px-10 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 text-lg">
                {isLoading ? '생성 중...' : '✨ AI로 블로그 포스트 생성하기'}
            </button>
        </div>
      </div>}

      {/* --- LOADING & ERROR --- */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center text-center p-8">
            <LoadingSpinner />
            <p className="mt-4 text-slate-600 font-medium">AI가 최고의 블로그 포스트를 작성하고 있습니다...</p>
            <p className="text-sm text-slate-500">잠시만 기다려주세요. (최대 1분 소요)</p>
        </div>
      )}
      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert"><p>{error}</p></div>}
      
      {/* --- BLOG POST DISPLAY --- */}
      {generatedPost && !isLoading && (
        <div className="animate-fade-in space-y-12">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800">🎉 AI 생성 완료!</h2>
                    <p className="text-slate-500 mt-1">아래에서 생성된 콘텐츠를 확인하고 원하는 형식으로 내보내세요.</p>
                </div>
                <div className="flex items-center space-x-2">
                     <button onClick={() => setGeneratedPost(null)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300">다시 생성</button>
                     <button onClick={() => openExportModal('markdown')} className="px-6 py-2 bg-slate-700 text-white font-semibold rounded-md hover:bg-slate-800">🚀 Markdown으로 내보내기</button>
                     <button onClick={() => openExportModal('html')} className="px-6 py-2 bg-black text-white font-semibold rounded-md hover:bg-gray-800">HTML로 내보내기</button>
                </div>
            </div>
            <article className="prose max-w-none p-6 border rounded-lg bg-white">
                <h1>{generatedPost.blogTitle}</h1>
                <p className="lead">{generatedPost.introduction}</p>
                
                {generatedPost.products.map(p => (
                    <div key={p.rank} className="my-8">
                        <h2>{p.rank}. {p.productName}</h2>
                         <div className="flex items-center mb-2">
                             <StarRating rating={p.aggregateRating.ratingValue} />
                             <span className="ml-3 text-sm text-gray-500">({p.aggregateRating.ratingCount}개의 리뷰)</span>
                        </div>
                        <img src={p.imageUrl} alt={p.productName} className="rounded-lg shadow-md my-4" />
                        <p>{p.description}</p>
                        <div className="grid grid-cols-2 gap-4 my-4">
                            <div className="bg-green-50 p-3 rounded">
                                <h3 className="text-green-800 font-bold">장점</h3>
                                <ul className="text-green-700">{p.pros.map(pro => <li key={pro}>{pro}</li>)}</ul>
                            </div>
                            <div className="bg-red-50 p-3 rounded">
                                <h3 className="text-red-800 font-bold">단점</h3>
                                <ul className="text-red-700">{p.cons.map(con => <li key={con}>{con}</li>)}</ul>
                            </div>
                        </div>
                         <a href={p.coupangLink} target="_blank" rel="noopener sponsored" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors duration-300 no-underline">
                            쿠팡에서 최저가 확인하기
                        </a>
                    </div>
                ))}

                <h2>결론</h2>
                <p>{generatedPost.conclusion}</p>

                <h2>자주 묻는 질문 (FAQ)</h2>
                {generatedPost.faq.map(f => (
                    <div key={f.question}>
                        <h3>{f.question}</h3>
                        <p>{f.answer}</p>
                    </div>
                ))}
            </article>
            {isModalOpen && <ExportModal content={modalContent} language={modalLanguage} onClose={() => setIsModalOpen(false)} />}
        </div>
      )}
    </div>
  );
};

export default Generator;