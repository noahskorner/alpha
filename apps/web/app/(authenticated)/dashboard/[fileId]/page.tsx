import { MarkdownEditor } from '@/components/markdown-editor/markdown-editor';

export interface FilePageProps {
  params: Promise<{ fileId: string }>;
}

export default async function FilePage() {
  // { params }: FilePageProps
  // const { fileId } = await params;
  const dummyMarkdown = `# Welcome to the Home Page

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

This is a sample markdown content.

## Features

- Easy to use
- Fast rendering
- Supports **bold** and _italic_ text

1. First item
2. Second item
3. Third item

- [ ] Checklist 1
- [ ] Checklist 2
- [ ] Checklist 3

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
    <div className="w-full flex justify-center p-8 gap-8">
      <div className="w-full max-w-3xl">
        <MarkdownEditor content={dummyMarkdown} />
      </div>
    </div>
  );
}
