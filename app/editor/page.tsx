'use client';

import {useState} from 'react'
import { MarkdownEditor } from '@/components/MarkdownEditor'
const Editor = () => {
  const [content, setContent] = useState<string>("**Hello world!!!**");

  return (
    <div>
      <MarkdownEditor content={content} setContent={setContent} />
    </div>
  )
}

export default Editor
