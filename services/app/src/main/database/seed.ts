import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { sql } from 'drizzle-orm'
import * as schema from './schema'
import { taskTypes, taskSubtypes } from './schema'
import { TaskTypeColor } from './schema/taskType'

interface DefaultTaskType {
  name: string
  color: TaskTypeColor
  subtypes: string[]
}

const DEFAULT_TASK_TYPES: DefaultTaskType[] = [
  {
    name: 'Development',
    color: 'blue',
    subtypes: ['Frontend', 'Backend', 'API', 'Database', 'Infrastructure', 'Bug Fix']
  },
  {
    name: 'Design',
    color: 'purple',
    subtypes: ['UI Design', 'UX Research', 'Prototyping', 'Design System', 'Visual Design']
  },
  {
    name: 'Meeting',
    color: 'yellow',
    subtypes: ['Team Sync', 'Client Meeting', '1:1', 'Workshop']
  },
  {
    name: 'Research',
    color: 'green',
    subtypes: ['Technical Research', 'Competitor Analysis', 'User Research']
  },
  {
    name: 'Planning',
    color: 'gray',
    subtypes: ['Sprint Planning', 'Roadmap', 'Estimation']
  },
  {
    name: 'Review',
    color: 'red',
    subtypes: ['Code Review', 'Design Review', 'Document Review']
  },
  {
    name: 'Documentation',
    color: 'blue',
    subtypes: ['Technical Docs', 'User Guide', 'API Docs']
  },
  {
    name: 'Testing',
    color: 'green',
    subtypes: ['Unit Testing', 'Integration Testing', 'Manual QA']
  }
]

export function seedDefaultTaskTypes(db: BetterSQLite3Database<typeof schema>): void {
  const result = db
    .select({ count: sql<number>`COUNT(*)` })
    .from(taskTypes)
    .get()

  if (result && result.count > 0) return

  for (const type of DEFAULT_TASK_TYPES) {
    const inserted = db
      .insert(taskTypes)
      .values({ name: type.name, color: type.color })
      .returning()
      .get()

    for (const subtypeName of type.subtypes) {
      db.insert(taskSubtypes).values({ taskTypeId: inserted.id, name: subtypeName }).run()
    }
  }
}
