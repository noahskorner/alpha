'use client';

import { UpdateFileRequest } from '@/app/api/files/[id]/update-file.request';
import { MarkdownEditor } from '@/components/markdown-editor/markdown-editor';
import { toast } from 'sonner';
import { useMemo } from 'react';
import debounce from 'lodash/debounce';

export interface FileProps {
  id: string;
  content: string;
}

export function File({ id, content }: FileProps) {
  const _onContentChange = useMemo(() => {
    return async (content: string) => {
      try {
        await fetch(`/api/files/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            content: content,
          } satisfies UpdateFileRequest),
        });
        toast.success('Successfully saved file!');
      } catch (error) {
        console.error(error);
        toast.error('Unable to save file. Please try again later.');
      }
    };
  }, [id]);
  const onContentChange = useMemo(() => debounce(_onContentChange, 500), [_onContentChange]);

  return <MarkdownEditor content={content} onContentChange={onContentChange} />;
}
