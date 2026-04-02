// src/utils/pdfExtractor.js
// Extracts plain text from a PDF File object using pdf.js

import * as pdfjsLib from 'pdfjs-dist';

// Point the worker at the CRA public folder copy
pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

/**
 * extractTextFromPDF
 * @param {File} file  — A PDF File object from an <input type="file">
 * @returns {Promise<string>}  All text content joined across pages
 */
export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();

  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  let fullText = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    // Join items, insert newline when vertical position changes significantly
    let lastY = null;
    let pageText = '';

    for (const item of textContent.items) {
      if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
        pageText += '\n';
      }
      pageText += item.str + ' ';
      lastY = item.transform[5];
    }

    fullText += pageText + '\n\n';
  }

  return fullText.trim();
}

/**
 * validatePDF
 * @param {File} file
 * @returns {{ valid: boolean, error?: string }}
 */
export function validatePDF(file) {
  if (!file) return { valid: false, error: 'No file selected.' };
  if (file.type !== 'application/pdf') {
    return { valid: false, error: 'Only PDF files are supported. Please convert your resume to PDF.' };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: 'File is too large (max 10 MB). Please compress your PDF.' };
  }
  return { valid: true };
}
