
import React, { useState } from 'react';

interface CodeBlockProps {
  content: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ content, language = 'text' }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative bg-slate-800 rounded-md">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 px-3 py-1 bg-slate-600 text-white text-xs font-semibold rounded hover:bg-slate-500 transition-colors"
      >
        {isCopied ? '복사 완료!' : '복사'}
      </button>
      <pre className="p-4 text-white overflow-x-auto">
        <code className={`language-${language}`}>{content}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
