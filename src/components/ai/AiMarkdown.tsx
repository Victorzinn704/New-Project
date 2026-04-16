import Markdown from 'react-markdown';
import { sanitizeMarkdown } from '../../utils/sanitize';

interface AiMarkdownProps {
  content: string | null;
}

export function AiMarkdown({ content }: AiMarkdownProps) {
  return <Markdown>{sanitizeMarkdown(content)}</Markdown>;
}
