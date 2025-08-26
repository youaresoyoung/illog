import { Tag } from 'services/app/src/types'
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

interface TagState {
  tags: Tag[]
  loadTags: () => Promise<void>
  createTag: (tag: Partial<Tag>) => Promise<Tag>
  updateTag: (id: string, contents: Partial<Tag>) => Promise<Tag>
  deleteTag: (id: string) => Promise<void>
}

export const useTagStore = create<TagState>(
  combine({ tags: [] as Tag[] }, (set, get) => ({
    loadTags: async () => {
      const tags = await window.api.tag.getAll()
      set({ tags })
    },
    createTag: async (tag: Partial<Tag>) => {
      const AddedTag = await window.api.tag.create(tag)
      set({ tags: [...get().tags, AddedTag] })
      return AddedTag
    },
    updateTag: async (id: string, contents: Partial<Tag>) => {
      const updatedTag = await window.api.tag.update(id, contents)
      set({
        tags: get().tags.map((tag) => (tag.id === id ? updatedTag : tag))
      })
      return updatedTag
    },
    deleteTag: async (id: string) => {
      await window.api.tag.softDelete(id)
      set({
        tags: get().tags.filter((tag) => tag.id !== id)
      })
    }
  }))
)
