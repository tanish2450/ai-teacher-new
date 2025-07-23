/**
 * Utility functions for document processing
 */

/**
 * Truncates document content if it's too large
 * @param content The document content to truncate
 * @param maxLength Maximum length (default: 100000 characters)
 * @returns Truncated document content
 */
export function truncateDocumentContent(content: string, maxLength: number = 100000): string {
  if (!content) return '';
  
  if (content.length > maxLength) {
    console.log(`Document content too large (${content.length} chars), truncating to ${maxLength} characters`);
    return content.substring(0, maxLength) + "\n\n[Content truncated due to length]";
  }
  
  return content;
}