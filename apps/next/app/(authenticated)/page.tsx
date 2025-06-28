import { Markdown } from './markdown';

export default async function HomePage() {
  const dummyMarkdown = `
# Welcome to the Home Page

This is a sample markdown content.

## Features

- Easy to use
- Fast rendering
- Supports **bold** and _italic_ text

### Example Code

\`\`\`js
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Table

| Feature   | Supported |
|-----------|-----------|
| Headings  | Yes       |
| Lists     | Yes       |
| Code      | Yes       |
| Tables    | Yes       |

> This is a blockquote.

Enjoy exploring!
`;

  return (
    <div className="w-full flex items-center justify-center p-8">
      <Markdown content={dummyMarkdown} />
    </div>
  );
}
