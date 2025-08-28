CREATE TABLE IF NOT EXISTS project (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT 'blue' CHECK (color IN ('blue', 'green', 'yellow', 'purple', 'red', 'gray')),
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS tag (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT 'gray' CHECK (color IN ('blue', 'green', 'yellow', 'purple', 'red', 'gray')),
  created_at TEXT,
  updated_at TEXT,
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS task_tag (
  task_id TEXT NOT NULL,
  tag_id TEXT,
  PRIMARY KEY (task_id, tag_id),
  FOREIGN KEY (task_id) REFERENCES task (id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tag (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS task (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  project_id TEXT REFERENCES project (id) ON DELETE CASCADE,
  end_time TEXT,
  created_at TEXT,
  updated_at TEXT,
  done_at TEXT DEFAULT NULL,
  deleted_at TEXT DEFAULT NULL,
  FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS task_note (
  task_id TEXT PRIMARY KEY,
  content TEXT,
  updated_at TEXT,
  FOREIGN KEY (task_id) REFERENCES task (id) ON DELETE CASCADE
);
