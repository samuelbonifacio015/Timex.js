import JSZip from 'jszip';
import type { StopwatchSession } from '../contexts/ConfigContext';

export const SESSIONS_ZIP_FILENAME = 'tus-sesiones.zip';
export const SESSIONS_JSON_FILENAME = 'sesiones.json';

type SessionsZipOutputType = 'blob' | 'nodebuffer';

export function createSessionsZip(sessions: StopwatchSession[]): Promise<Blob>;
export function createSessionsZip(sessions: StopwatchSession[], type: 'blob'): Promise<Blob>;
export function createSessionsZip(sessions: StopwatchSession[], type: 'nodebuffer'): Promise<Uint8Array>;
export async function createSessionsZip(
  sessions: StopwatchSession[],
  type: SessionsZipOutputType = 'blob',
): Promise<Blob | Uint8Array> {
  const zip = new JSZip();

  zip.file(SESSIONS_JSON_FILENAME, JSON.stringify(sessions, null, 2));

  return zip.generateAsync({ type }) as Promise<Blob | Uint8Array>;
}
