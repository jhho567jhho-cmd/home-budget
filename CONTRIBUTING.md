# 🤝 Contributing to Budget Buddy

First off, thank you for considering contributing to Budget Buddy! It's people like you that make Budget Buddy such a great tool.

## 🎯 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## 🚀 Getting Started

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/home-budget.git
   cd home-budget
   ```

3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/jhho567jhho-cmd/home-budget.git
   ```

4. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. Install dependencies:
   ```bash
   npm install
   ```

6. Start development:
   ```bash
   npm run dev
   ```

---

## 💻 Development Workflow

### Before You Start

1. Check [existing issues](https://github.com/jhho567jhho-cmd/home-budget/issues)
2. Check [pull requests](https://github.com/jhho567jhho-cmd/home-budget/pulls)
3. Discuss your idea in [discussions](https://github.com/jhho567jhho-cmd/home-budget/discussions)

### Making Changes

1. Create descriptive commits:
   ```bash
   git commit -m "Add Hebrew sentiment analysis to NLP engine"
   ```

2. Keep commits focused and atomic
3. Reference issues in commit messages (e.g., "Fixes #123")

4. Run linter before committing:
   ```bash
   npm run lint
   ```

---

## 🏗️ Project Structure

```
budget-buddy-nlp/
├── app/
│   ├── api/chat/route.ts      # Chat endpoint
│   ├── components/            # React components
│   │   ├── ChatMessage.tsx    # Message display
│   │   ├── ChatInput.tsx      # Input field
│   │   ├── VoiceInput.tsx     # Voice recognition
│   │   ├── AnalyticsPanel.tsx # Analytics dashboard
│   │   ├── StatsChart.tsx     # Data visualization
│   │   ├── BudgetGoals.tsx    # Budget goals UI
│   │   └── SettingsPanel.tsx  # Settings/export
│   ├── utils/
│   │   ├── nlp.ts            # Core NLP engine
│   │   ├── nlpAdvanced.ts    # Advanced analytics
│   │   ├── storage.ts        # Data persistence
│   │   └── export.ts         # Export utilities
│   ├── page.tsx               # Main page
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── FEATURES.md                # Feature documentation
├── API_DOCS.md                # API reference
└── README.md                  # Project readme
```

---

## 🎨 Code Style

### TypeScript
- Use strict mode
- Type all function parameters and returns
- Avoid `any` type

### React
- Use functional components with hooks
- Use descriptive component names
- Keep components small and focused

### Naming Conventions
- Components: PascalCase (e.g., `ChatMessage`)
- Functions: camelCase (e.g., `extractExpenseData`)
- Constants: UPPER_SNAKE_CASE (e.g., `STORAGE_KEY`)
- CSS classes: kebab-case (e.g., `chat-message`)

### Comments
- Use sparingly - code should be self-documenting
- Explain "why", not "what"
- Use Hebrew comments for Hebrew-specific logic

---

## 🧪 Testing

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Text input works correctly
- [ ] Voice input recognizes Hebrew
- [ ] Categories are classified correctly
- [ ] Amount extraction works
- [ ] Analytics display correctly
- [ ] Export/import functionality works
- [ ] Settings panel opens/closes
- [ ] Data persists after refresh
- [ ] Responsive design on mobile

### Testing Different Scenarios

```
Test with various expense types:
- "קניתי לחם ב-12 שקל" (groceries)
- "הוצאתי 200 על דלק" (fuel)
- "קורס אונליין 150" (education)
- "קפה בקניון 25" (entertainment)

Edge cases:
- Very large amounts: "₪10,000"
- Decimal amounts: "12.50 שקל"
- No amount: "קניתי דברים"
- Only amount: "150"
```

---

## 🔧 Making Changes

### Adding a New Feature

1. Create an issue describing the feature
2. Get feedback from maintainers
3. Create a feature branch:
   ```bash
   git checkout -b feature/feature-name
   ```
4. Implement the feature
5. Test thoroughly
6. Create a pull request

### Fixing a Bug

1. Create an issue describing the bug
2. Create a fix branch:
   ```bash
   git checkout -b fix/bug-name
   ```
3. Implement the fix
4. Add tests if applicable
5. Create a pull request

### Documentation

1. Update relevant `.md` files
2. Update comments in code
3. Update TypeScript types if changed
4. Update API documentation

---

## 📝 Pull Request Process

### Before Submitting

1. Pull latest from upstream:
   ```bash
   git fetch upstream
   git rebase upstream/budget-buddy-nlp
   ```

2. Run linter:
   ```bash
   npm run lint
   ```

3. Test your changes thoroughly

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Related Issues
Fixes #(issue number)

## Testing Done
- [ ] Manual testing
- [ ] Browser compatibility
- [ ] Hebrew input
- [ ] Mobile responsive

## Checklist
- [ ] Code follows style guidelines
- [ ] Comments added where needed
- [ ] Documentation updated
- [ ] No new warnings generated
```

---

## 🐛 Bug Reports

### Submitting a Bug Report

Include:
1. **Title**: Clear, concise description
2. **Description**: What happened, what should happen
3. **Steps to Reproduce**: Exact steps to reproduce
4. **Expected Result**: What should happen
5. **Actual Result**: What actually happened
6. **Environment**: Browser, OS, version
7. **Screenshots**: If applicable

### Example

```markdown
## Bug: Voice input not working in Hebrew

### Environment
- Browser: Chrome 120.0
- OS: Windows 11
- Device: Desktop

### Steps to Reproduce
1. Open Budget Buddy
2. Click voice input button
3. Say "קניתי לחם"
4. Voice doesn't recognize Hebrew

### Expected Result
Hebrew speech recognized and expense added

### Actual Result
Silent failure, no error shown
```

---

## 💡 Feature Requests

### Submitting a Feature Request

Include:
1. **Title**: Clear description of feature
2. **Problem**: What problem does it solve?
3. **Solution**: How should it work?
4. **Examples**: Usage examples

### Example

```markdown
## Feature: Budget Categories Customization

### Problem
Current categories are fixed. Users can't create custom categories like "Subscriptions" or "Hobbies"

### Solution
Allow users to create, edit, delete custom expense categories

### Examples
- User creates category "Software Subscriptions"
- Monthly prediction considers custom categories
```

---

## 🔐 Security

### Reporting Security Issues

**Do not** open public issues for security vulnerabilities!

Email: security@budgetbuddy.dev (or contact maintainers privately)

Include:
- Description of vulnerability
- Steps to reproduce
- Potential impact

---

## 📚 Documentation

### Documentation Standards

- Write in clear, simple English/Hebrew
- Use examples where possible
- Include code snippets
- Link to related sections
- Keep it up-to-date

### Types of Documentation

1. **README.md**: Project overview
2. **FEATURES.md**: Detailed features
3. **API_DOCS.md**: API reference
4. **GETTING_STARTED.md**: Quick start guide
5. **Code comments**: Inline explanations

---

## 🚀 Release Process

### Version Numbering

We use Semantic Versioning (MAJOR.MINOR.PATCH)

- **MAJOR**: Breaking changes
- **MINOR**: New features
- **PATCH**: Bug fixes

### Changelog

Update `CHANGELOG.md` with:
```markdown
## [1.1.0] - 2026-09-18

### Added
- New feature description

### Fixed
- Bug fix description

### Changed
- Change description
```

---

## 📞 Getting Help

- **Discussions**: [GitHub Discussions](https://github.com/jhho567jhho-cmd/home-budget/discussions)
- **Issues**: [GitHub Issues](https://github.com/jhho567jhho-cmd/home-budget/issues)
- **Email**: maintainers@budgetbuddy.dev

---

## 🎓 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## 💖 Recognition

Contributors will be recognized in:
- README.md Contributors section
- Release notes
- GitHub contributors page

---

Thank you for contributing! 🙏

Made with ❤️ by the Budget Buddy community
