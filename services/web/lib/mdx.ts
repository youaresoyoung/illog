import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'docs')

export type DocMeta = {
  title: string
  description: string
  category: string
  slug: string[]
  order?: number
  storybookUrl?: string
}

export function getDocBySlug(slug: string[]): {
  meta: DocMeta
  content: string
} {
  const filePath = path.join(CONTENT_DIR, ...slug) + '.mdx'
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  return {
    meta: { ...data, slug } as DocMeta,
    content
  }
}

function walkDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath))
    } else if (entry.name.endsWith('.mdx')) {
      files.push(fullPath)
    }
  }
  return files
}

export function getAllDocs(): DocMeta[] {
  const files = walkDir(CONTENT_DIR)
  const docs = files.map((file) => {
    const raw = fs.readFileSync(file, 'utf8')
    const { data } = matter(raw)
    const relativePath = path.relative(CONTENT_DIR, file)
    const slug = relativePath.replace(/\.mdx$/, '').split(path.sep)
    return { ...data, slug } as DocMeta
  })

  return docs.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category)
    return (a.order ?? 999) - (b.order ?? 999)
  })
}

export function getDocSlugs(): string[][] {
  const files = walkDir(CONTENT_DIR)
  return files.map((file) => {
    const relativePath = path.relative(CONTENT_DIR, file)
    return relativePath.replace(/\.mdx$/, '').split(path.sep)
  })
}
