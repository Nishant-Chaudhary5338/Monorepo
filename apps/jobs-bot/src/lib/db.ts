import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../../data/applications.db');

// ensure data dir exists
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id        TEXT UNIQUE,
    title         TEXT NOT NULL,
    company       TEXT NOT NULL,
    location      TEXT,
    job_url       TEXT,
    platform      TEXT DEFAULT 'linkedin',
    resume_variant TEXT,
    status        TEXT DEFAULT 'applied',
    applied_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes         TEXT
  );

  CREATE TABLE IF NOT EXISTS skipped (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id   TEXT UNIQUE,
    reason   TEXT,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export type ApplicationStatus = 'applied' | 'interviewing' | 'rejected' | 'offer' | 'ghosted';

export interface Application {
  id?: number;
  job_id: string;
  title: string;
  company: string;
  location?: string;
  job_url?: string;
  platform?: string;
  resume_variant?: string;
  status?: ApplicationStatus;
  applied_at?: string;
  notes?: string;
}

export const appDb = {
  insert(app: Application) {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO applications (job_id, title, company, location, job_url, platform, resume_variant, status)
      VALUES (@job_id, @title, @company, @location, @job_url, @platform, @resume_variant, @status)
    `);
    return stmt.run(app);
  },

  alreadyApplied(job_id: string): boolean {
    const row = db.prepare('SELECT id FROM applications WHERE job_id = ?').get(job_id);
    const skipped = db.prepare('SELECT id FROM skipped WHERE job_id = ?').get(job_id);
    return !!row || !!skipped;
  },

  skip(job_id: string, reason: string) {
    db.prepare('INSERT OR IGNORE INTO skipped (job_id, reason) VALUES (?, ?)').run(job_id, reason);
  },

  updateStatus(job_id: string, status: ApplicationStatus, notes?: string) {
    db.prepare('UPDATE applications SET status = ?, notes = ? WHERE job_id = ?').run(status, notes ?? null, job_id);
  },

  stats() {
    return {
      total: (db.prepare('SELECT COUNT(*) as c FROM applications').get() as { c: number }).c,
      byStatus: db.prepare(`
        SELECT status, COUNT(*) as count FROM applications GROUP BY status
      `).all() as { status: string; count: number }[],
      recent: db.prepare(`
        SELECT title, company, location, resume_variant, status, applied_at
        FROM applications ORDER BY applied_at DESC LIMIT 20
      `).all() as Application[],
    };
  },

  todayCount(): number {
    const row = db.prepare(`
      SELECT COUNT(*) as c FROM applications WHERE DATE(applied_at) = DATE('now')
    `).get() as { c: number };
    return row.c;
  },
};
