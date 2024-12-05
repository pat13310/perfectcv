import { GlobalWorkerOptions } from 'pdfjs-dist';

export function initPdfWorker() {
  GlobalWorkerOptions.workerSrc = '/pdfjs-dist/build/pdf.worker.js';
}
