import { WorkspaceFile } from '@modules/file/types'
import { LinkItem, PlaylistContentManagerItem, PlaylistItemType } from '@modules/playlist/types'
import { PlaylistContentService } from '@modules/playlistContentManager/services/PlaylistContentService'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type Item = PlaylistContentManagerItem

type AddableItem = WorkspaceFile | WorkspaceFile[]

type State = {
    items: Item[] | null
    currentLayoutSection: string | null
    currentLayoutSectionItems: Item[] | null
    initializedAt: Date | null
    isModified: boolean
}

type Action = {
    addItemsToCurrentLayoutSection: (type: PlaylistItemType, items: AddableItem) => void
    addItemsToLayoutSection: (sectionId: string | null, type: PlaylistItemType, items: AddableItem) => void
    addLinkToCurrentLayoutSection: (link: LinkItem, duration?: number) => void
    checkItemsModified: (initialItems: Item[]) => void
    clearState: () => void
    getLayoutSectionItems: (sectionId: string) => Item[] | null
    initStorage: (items: Item[], sectionId?: string) => void
    reorderLayoutSectionItems: (sectionId: string, items: Item[]) => void
    setItems: (items: Item[]) => void
    setLayoutSection: (sectionId: string) => void
    updateCurrentLayoutSectionItems: () => void
    getUnusedItems: (items: Item[], existingsectionIds: string[]) => Item[]
    removeItems: (id: string | string[]) => void
    updateItemDuration: (id: string, duration: number) => void
}

const emptyState = {
    items: null,
    currentLayoutSection: null,
    currentLayoutItems: null,
    currentLayoutSectionItems: null,
    initializedAt: null,
    isModified: false,
}

const filterItemsBySection = (items: Item[], sectionId: string) => {
    return items.filter((item) => item.playlistLayoutSectionId === sectionId)
}

const getMaxOrderForSection = (sectionItems: Item[]) => {
    return sectionItems.length > 0 ? Math.max(...sectionItems.map(item => item.order)) : 0
}

export const usePlaylistContentManagerStorage = create<State & Action>()(
    devtools(
        (set, get) => ({
            ...emptyState,

            checkItemsModified: (initialItems) => {
                const currentItems = get().items
                if (currentItems === null) return
                const isModified = !PlaylistContentService.arePlaylistItemsEqual(initialItems, currentItems)
                set({ isModified })
            },

            setLayoutSection: (sectionId) => {
                if (sectionId) {
                    set({ currentLayoutSection: sectionId })
                }
            },

            setItems: (items) => set({ items }),

            initStorage: (items, sectionId) => {
                set({
                    items,
                    currentLayoutSection: sectionId || get().currentLayoutSection,
                    initializedAt: new Date(),
                })
            },

            clearState: () => set(emptyState),

            updateCurrentLayoutSectionItems: () => {
                const currentLayoutSection = get().currentLayoutSection
                if (currentLayoutSection) {
                    const sectionItems = get().getLayoutSectionItems(currentLayoutSection)
                    set({ currentLayoutSectionItems: sectionItems })
                }
            },

            getLayoutSectionItems: (sectionId) => {
                const items = get().items
                if (!items || !sectionId) return null
                return filterItemsBySection(items, sectionId)
            },

            reorderLayoutSectionItems: (sectionId, items) => set((state) => {
                const otherItems = state.items?.filter(item => item.playlistLayoutSectionId !== sectionId) || []
                const reorderedSectionItems = items.map((item, index) => ({
                    ...item,
                    order: index + 1,
                }))
                return {
                    items: [...otherItems, ...reorderedSectionItems],
                }
            }),

            addItemsToCurrentLayoutSection: (type, items) => {
                const currentLayoutSection = get().currentLayoutSection
                get().addItemsToLayoutSection(currentLayoutSection, type, items)
            },

            addItemsToLayoutSection: (sectionId, type, items) => set((state) => {
                if (!sectionId || !state.items) return state
                const sectionItems = get().getLayoutSectionItems(sectionId) ?? []
                const maxOrder = getMaxOrderForSection(sectionItems)
                const itemsArray = Array.isArray(items) ? items : [items]
                const newItems = (() => {
                    switch (type) {
                        case 'file':
                            return PlaylistContentService.mapFileToPlaylistItem(itemsArray, sectionId, maxOrder)
                        default:
                            return []
                    }
                })()
                return {
                    items: [...state.items, ...newItems],
                }
            }),

            addLinkToCurrentLayoutSection: (link, duration = 30) => set((state) => {
                const currentLayoutSection = get().currentLayoutSection
                if (!currentLayoutSection || !state.items) return state
                const sectionItems = get().getLayoutSectionItems(currentLayoutSection) ?? []
                const maxOrder = getMaxOrderForSection(sectionItems)
                const newItem = PlaylistContentService.mapLinkToPlaylistItem(link, currentLayoutSection, maxOrder, duration)
                return {
                    items: [...state.items, newItem],
                }
            }),

            removeItems: (id) => set((state) => {
                const items = state.items
                if (!items) return state
                const ids = Array.isArray(id) ? id : [id]
                const newItems = items.filter((item) => !ids.includes(item.id))
                return { items: newItems }
            }),

            updateItemDuration: (id, duration) => set((state) => {
                const items = state.items
                if (!items) return state
                const newItems = items.map((item) =>
                    item.id === id ? { ...item, duration } : item
                )
                return { items: newItems }
            }),
        }),
        {
            name: 'playlist-content-manager-storage',
        }
    )
)
