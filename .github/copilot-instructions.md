# GitHub Copilot Instructions - AI Guide Pro

## Project Overview

AI Guide Pro is an Arabic-language platform for AI courses, news, and educational content. You are the AI coding assistant for this repository, responsible for maintaining code quality and following established patterns.

---

## 1. Project Purpose

This is a full-stack Arabic educational platform that:
- Generates AI courses automatically using Gemini AI
- Aggregates and translates AI news/research to Arabic
- Provides community voting for course suggestions
- Offers interactive AI learning features
- Supports PWA functionality (offline mode, installable)
- Includes admin dashboard for content management

---

## 2. Technology Stack

### **Frontend**
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM v6
- **AI Integration**: Google Generative AI (Gemini)
- **PDF Processing**: pdfjs-dist
- **Icons**: Lucide React

### **Backend Proxy (Optional)**
- **Runtime**: Node.js with Express
- **Purpose**: CORS proxy for news feeds
- **Location**: `/server` directory

### **State Management**
- Local Storage for persistence
- React hooks and context for component state

---

## 3. Architecture Overview

### **Directory Structure**
```
/
├── components/          # React components
│   ├── *Page.tsx       # Full page components
│   ├── *Section.tsx    # Section components for home
│   └── *.tsx           # Reusable UI components
├── services/           # Business logic and integrations
│   ├── geminiService.ts       # Gemini AI interactions
│   ├── courseGenerator.ts     # Course generation logic
│   ├── autoCourseOrchestrator.ts  # Automation scheduling
│   ├── newsOrchestrator.ts    # News aggregation
│   ├── feeds.ts               # RSS feed processing
│   └── translationService.ts  # Arabic translation
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
├── data/               # Static data and generated content
├── server/             # Optional CORS proxy
└── public/             # Static assets
```

### **Key Services**

#### **Gemini AI Integration** (`services/geminiService.ts`)
- Course content generation
- Arabic translations
- News summarization
- Must handle API key from environment
- Graceful error handling for API failures

#### **Auto Course Flow** (`services/autoCourseOrchestrator.ts`)
- Daily: Generate course suggestions from research topics
- Weekly: Auto-generate top-voted courses
- Uses localStorage for scheduling
- Configurable via `VITE_AUTO_COURSES` env var

#### **News Aggregation** (`services/newsOrchestrator.ts`, `services/feeds.ts`)
- Fetches from arXiv, Google AI Blog, OpenAI, NVIDIA, etc.
- Translates to Arabic via Gemini
- Validates sources against whitelist
- Optional proxy support for CORS

---

## 4. Coding Guidelines

### **General Rules**
- ✅ Write clean, readable TypeScript with proper type definitions
- ✅ Follow existing code patterns and naming conventions
- ✅ Add JSDoc comments for complex functions
- ✅ Keep functions small and single-purpose
- ✅ Use React functional components with hooks
- ✅ Prefer composition over inheritance
- ⛔ Never hardcode API keys or secrets
- ⛔ Don't break existing component interfaces

### **React Component Guidelines**
```typescript
// Good: Typed props, functional component, proper exports
interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  const [state, setState] = useState<string>('');
  
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      {/* Component content */}
    </div>
  );
};

export default MyComponent;
```

### **Service Layer Guidelines**
```typescript
// Services should:
// 1. Export clear, typed functions
// 2. Handle errors gracefully
// 3. Return consistent data structures
// 4. Not directly manipulate DOM or React state

export async function generateCourse(topic: string): Promise<Course> {
  try {
    // Implementation
    return courseData;
  } catch (error) {
    console.error('Course generation failed:', error);
    throw new Error('Failed to generate course');
  }
}
```

### **Styling Guidelines**
- ✅ Use Tailwind utility classes
- ✅ Follow mobile-first responsive design
- ✅ Maintain RTL (right-to-left) support for Arabic
- ✅ Use semantic color classes: `text-blue-600`, `bg-white`, etc.
- ⛔ Avoid inline styles unless absolutely necessary
- ⛔ Don't create custom CSS files without justification

### **Arabic Content Handling**
- Always display Arabic text correctly (RTL)
- Use `dir="rtl"` attribute where needed
- Ensure proper font rendering for Arabic characters
- Maintain Arabic first, English second language priority
- When generating content via Gemini, always request Arabic output

---

## 5. Environment Variables

Required and optional environment variables:

```bash
# Required
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional - Feature Flags
VITE_AUTO_COURSES=true          # Enable auto course generation
VITE_NEWS_PROXY_URL=http://localhost:4000/proxy  # CORS proxy URL

# Optional - Configuration
VITE_NEWS_SOURCES=url1,url2     # Custom RSS feed sources
VITE_NEWS_ALLOWED_HOSTS=host1,host2  # Whitelist for news sources
```

### **Environment Variable Usage**
```typescript
// Always check for environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.warn('Gemini API key not configured');
  return fallbackBehavior();
}
```

---

## 6. Common Patterns

### **Local Storage Usage**
```typescript
// Services use localStorage for persistence
const STORAGE_KEY = 'feature_data';

export function saveData(data: MyData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data:', error);
  }
}

export function loadData(): MyData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load data:', error);
    return null;
  }
}
```

### **Gemini API Calls**
```typescript
// Use the geminiClient for all Gemini interactions
import { getGeminiClient } from './geminiClient';

const model = getGeminiClient();
if (!model) {
  throw new Error('Gemini not configured');
}

const prompt = `Your prompt here in Arabic or English`;
const result = await model.generateContent(prompt);
const text = result.response.text();
```

### **Error Boundaries**
- Use ErrorBoundary component for graceful error handling
- Provide user-friendly error messages in Arabic
- Log errors to console for debugging

---

## 7. Testing and Quality

### **Before Committing**
- ✅ Run `npm run dev` to verify development build works
- ✅ Run `npm run build` to ensure production build succeeds
- ✅ Check TypeScript compilation (`tsc --noEmit`)
- ✅ Test key user flows (course generation, news loading)
- ✅ Verify Arabic text renders correctly
- ✅ Check responsive design on mobile viewport

### **Code Review Checklist**
- [ ] TypeScript types are properly defined
- [ ] No console.errors in normal operation
- [ ] Environment variables are properly checked
- [ ] Error handling is graceful
- [ ] Arabic content displays correctly
- [ ] Component props are documented
- [ ] No hardcoded API keys or secrets

---

## 8. What Copilot Should Do

When generating code, Copilot should:

✅ **DO:**
- Follow the existing TypeScript patterns and component structure
- Use the established service layer for business logic
- Maintain Arabic-first language support
- Add proper error handling and type safety
- Suggest optimizations when patterns could be improved
- Keep components focused and reusable
- Use existing utility functions and services
- Follow Tailwind CSS conventions
- Respect the React 19 patterns (no deprecated APIs)

⛔ **DO NOT:**
- Invent or hardcode API keys
- Break existing component interfaces
- Add new dependencies without justification
- Create inline styles when Tailwind classes work
- Remove or modify TODOs without completing them
- Output placeholder comments like "// rest of implementation"
- Change the project structure without clear reason
- Use deprecated React patterns (class components, legacy lifecycle)

---

## 9. Feature-Specific Guidelines

### **Course Generation**
- Always use Gemini AI for content generation
- Structure courses with: title, description, modules, difficulty
- Store generated courses in localStorage
- Support import/export to JSON
- Maintain consistent Arabic terminology

### **News Aggregation**
- Validate all sources against whitelist
- Extract identifiers (arXiv ID, DOI) when available
- Translate all content to Arabic
- Cache results to minimize API calls
- Provide fallback content if fetching fails

### **Community Voting**
- Store votes in localStorage
- Prevent duplicate votes (basic client-side)
- Display vote counts prominently
- Sort suggestions by vote count

### **Admin Features**
- Protect admin routes with `utils/admin.ts`
- Enable via query param `?admin=1`
- Provide preview before publishing
- Support JSON export/import

---

## 10. Common Commands

```bash
# Development
npm run dev              # Start dev server (Vite)

# Building
npm run build            # Production build
npm run preview          # Preview production build

# Server Proxy (optional)
cd server
npm install
npm start               # Starts on port 4000
```

---

## 11. Important Files Reference

| File | Purpose |
|------|---------|
| `App.tsx` | Main app component with routing |
| `services/geminiService.ts` | All Gemini AI interactions |
| `services/autoCourseOrchestrator.ts` | Auto course generation scheduling |
| `services/newsOrchestrator.ts` | News aggregation orchestration |
| `components/AdminCourseGenerator.tsx` | Admin dashboard for courses |
| `components/NewsArabicImproved.tsx` | News display component |
| `data/coursesData.ts` | Static course data structure |
| `types/course.ts` | Course type definitions |
| `types/news.ts` | News item type definitions |
| `.env.example` | Environment variable template |

---

## 12. Deployment Notes

- Build outputs to `dist/` directory
- Only deploy the `dist/` folder (source code is private)
- Ensure `.env.local` is never committed
- PWA manifest and service worker are configured
- Static assets go in `public/` directory

---

## 13. Best Practices Summary

1. **Type Safety**: Use TypeScript strictly, no `any` types
2. **Error Handling**: Always handle async errors gracefully
3. **Arabic Support**: Test all text content in Arabic
4. **Performance**: Lazy load components where beneficial
5. **Accessibility**: Use semantic HTML and ARIA labels
6. **Security**: Never expose API keys, validate user input
7. **Modularity**: Keep services separate from UI components
8. **Documentation**: Add JSDoc for complex logic
9. **Consistency**: Follow existing patterns and conventions
10. **Testing**: Manually test critical paths before committing

---

## 14. When in Doubt

- Check existing similar components/services for patterns
- Maintain consistency with the current codebase style
- Prioritize simplicity and maintainability
- Ask for clarification on architectural changes
- Follow the principle of least surprise

---

**Remember**: This is an educational platform serving Arabic-speaking users. Code quality, Arabic language support, and user experience are top priorities.
