import React from 'react';

type Props = {
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

type State = { hasError: boolean; message?: string };

export default class ErrorBoundary extends React.Component<Props, State> {
  declare props: Readonly<Props>;
  state: Readonly<State> = { hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, message: error instanceof Error ? error.message : String(error) };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="p-6 bg-red-900/20 border border-red-700 rounded-lg text-red-200">
          <h2 className="text-xl font-bold mb-2">حدث خطأ أثناء عرض الصفحة</h2>
          <p className="text-sm opacity-80">{this.state.message}</p>
          <p className="text-xs opacity-70 mt-2">جرّب تحديث الصفحة أو العودة إلى الصفحة الرئيسية.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
