import React from 'react';

interface AiModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
    isLoading: boolean;
    error: string;
}

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
);

// Helper function to parse basic inline markdown (bold)
const renderInline = (text: string) => {
    // Split by bold syntax, keeping the delimiters
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        return part;
    });
};

// Renders basic markdown for lists and paragraphs.
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={`ul-${elements.length}`} className="list-disc list-inside my-2 space-y-1">
                    {listItems.map((item, i) => (
                        <li key={i} className="ml-4">{renderInline(item)}</li>
                    ))}
                </ul>
            );
            listItems = [];
        }
    };

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
            listItems.push(trimmedLine.replace(/^(\*|-)\s*/, ''));
        } else if (trimmedLine === '') {
            // If we are in a list, a blank line doesn't terminate it.
            // If we are not in a list, it's just a blank line between paragraphs.
            // In our simple parser, we can effectively ignore it to maintain list continuity.
            if (listItems.length > 0) {
              // We could add a blank item if we wanted space, but for now we'll just continue the list
            }
        } else {
            flushList();
            if (trimmedLine) {
                elements.push(<p key={`p-${index}`}>{renderInline(line)}</p>);
            }
        }
    });

    flushList(); // Add any trailing list

    return <>{elements}</>;
};


const AiModal: React.FC<AiModalProps> = ({ isOpen, onClose, title, content, isLoading, error }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-modal-title"
        >
            <div
                className="bg-slate-800 rounded-xl p-6 md:p-8 border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10"
                    aria-label="Close modal"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <header className="mb-6 pr-8">
                    <h2 id="ai-modal-title" className="text-2xl font-bold text-white">{title}</h2>
                </header>

                <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-ul:list-disc prose-li:my-1">
                    {isLoading && <LoadingSpinner />}
                    {error && <p className="text-red-400">{error}</p>}
                    {content && !isLoading && <MarkdownRenderer content={content} />}
                </div>
            </div>
             <style>{`
                @keyframes fade-in {
                  from { opacity: 0; transform: scale(0.95); }
                  to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                  animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default AiModal;
