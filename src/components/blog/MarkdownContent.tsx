"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

function slugify(text: string): string {
  return String(text)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/^-|-$/g, "");
}

const components: Components = {
  h2: ({ children }) => (
    <h2
      id={slugify(String(children))}
      className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-gray-200 scroll-mt-20"
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      id={slugify(String(children))}
      className="text-lg font-bold text-gray-900 mt-8 mb-3 scroll-mt-20"
    >
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-gray-600 leading-relaxed my-5">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-6 space-y-2 my-5 text-gray-600">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 space-y-2 my-5 text-gray-600">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed pl-1">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-brand-400 bg-brand-50 pl-5 py-3 pr-4 my-6 rounded-r-xl">
      <div className="text-gray-700 leading-relaxed [&>p]:my-0">{children}</div>
    </blockquote>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-brand-600 hover:text-brand-700 underline underline-offset-2"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  pre: ({ children }) => (
    <pre className="bg-gray-900 text-gray-100 rounded-xl p-5 my-6 overflow-x-auto text-sm font-mono leading-relaxed">
      {children}
    </pre>
  ),
  code: ({ children, className }) =>
    className ? (
      <code className={`font-mono text-sm ${className}`}>{children}</code>
    ) : (
      <code className="bg-gray-100 text-brand-700 px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-gray-100">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
  th: ({ children }) => (
    <th className="text-left px-4 py-2.5 font-semibold text-gray-700 border-b border-gray-200">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2.5 text-gray-600 border-b border-gray-50 last:border-0">
      {children}
    </td>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-gray-50/50 transition-colors">{children}</tr>
  ),
  hr: () => <hr className="border-gray-200 my-10" />,
};

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="max-w-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
