"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PromptData } from '../../types/prompts';

interface Props {
  data: PromptData;
}

const PromptCard = ({ data }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = data.promptText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <article className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200 flex flex-col">
      <div className="relative w-full aspect-[4/3] bg-muted min-h-[260px] sm:min-h-[320px] lg:min-h-[380px]">
        <Image
          src={data.exampleImage}
          alt={data.title}
          fill
          className="object-contain rounded-md"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Prompt preview - extends to bottom */}
      <div 
        onClick={handleCopy}
        className={`flex-1 text-sm bg-black bg-opacity-60 text-white cursor-pointer hover:bg-opacity-70 transition-all overflow-hidden relative group p-4 ${copied ? 'bg-green-600 bg-opacity-70' : ''}`}
        title={data.promptText}
      >
        <code className="whitespace-pre-line break-words">{data.promptText}</code>
        {copied && (
          <div className="text-xs text-green-200 mt-1 font-medium">Copied!</div>
        )}
        
        {/* Try Now button - floating in top right */}
        <Link
          href="/#tool-area"
          className="absolute top-2 right-2 px-3 py-1.5 rounded text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors opacity-90 hover:opacity-100 font-medium before:content-['Try'] before:block"
        >
        </Link>
        
        {/* Tooltip on hover */}
        <div className="absolute invisible group-hover:visible bg-black bg-opacity-90 text-white text-xs rounded-lg p-3 bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 max-h-48 overflow-y-auto shadow-2xl w-80 max-w-sm">
          <code className="whitespace-pre-line break-words">{data.promptText}</code>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
        </div>
      </div>
    </article>
  );
};

export default PromptCard;
