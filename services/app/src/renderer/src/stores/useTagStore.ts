import { OmittedTag, Tag } from 'services/app/src/types'
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

interface TagState {
  tags: Tag[]
  loadTags: () => Promise<void>
  createTag: (tag: Partial<OmittedTag>) => Promise<string>
  updateTag: (id: string, contents: Partial<OmittedTag>) => Promise<void>
  deleteTag: (id: string) => Promise<void>
}

export const useTagStore = create<TagState>(
  combine({ tags: [] as Tag[] }, (set, get) => ({
    loadTags: async () => {
      const tags = await window.api.tag.getAll()
      set({ tags })
    },
    createTag: async (tag: Partial<OmittedTag>) => {
      const createdTag = await window.api.tag.create(tag)
      set({ tags: [...get().tags, createdTag] })
      return createdTag.id
    },
    updateTag: async (id: string, contents: Partial<OmittedTag>) => {
      const updatedTag = await window.api.tag.update(id, contents)
      set({
        tags: get().tags.map((tag) => (tag.id === id ? updatedTag : tag))
      })
    },
    deleteTag: async (id: string) => {
      await window.api.tag.softDelete(id)
      set({
        tags: get().tags.filter((tag) => tag.id !== id)
      })
    }
  }))
)
