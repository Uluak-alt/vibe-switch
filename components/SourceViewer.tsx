import React, { useState } from 'react';
import { Copy, Check, FileJson, FileCode, FileType } from 'lucide-react';
import { ExtensionFile } from '../types';

interface SourceViewerProps {
  files: ExtensionFile[];
}

export const SourceViewer: React.FC<SourceViewerProps> = ({ files }) => {
  const [selectedFile, setSelectedFile] = useState<ExtensionFile>(files[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIcon = (name: string) => {
    if (name.endsWith('.json')) return <FileJson size={14} className="text-yellow-500" />;
    if (name.endsWith('.ts') || name.endsWith('.js')) return <FileCode size={14} className="text-blue-500" />;
    return <FileType size={14} />;
  };

  return (
    <div className="flex h-full bg-slate-50">
      {/* File Explorer */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-700">Project Files</h3>
          <p className="text-xs text-gray-500 mt-1">Ready for Chrome Web Store</p>
        </div>
        <div className="p-2 space-y-1">
          {files.map((file) => (
            <button
              key={file.name}
              onClick={() => setSelectedFile(file)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                selectedFile.name === file.name
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {getIcon(file.name)}
              {file.name}
            </button>
          ))}
        </div>
        <div className="mt-auto p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
          <p>Download these files and load as an "Unpacked Extension" in chrome://extensions</p>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="h-12 border-b border-gray-200 bg-white flex items-center justify-between px-4">
          <span className="text-sm font-medium text-gray-600">{selectedFile.path}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition-colors"
          >
            {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
        <div className="flex-1 overflow-auto bg-[#1e1e1e] p-4">
          <pre className="font-mono text-sm text-gray-300 whitespace-pre">
            <code>{selectedFile.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
