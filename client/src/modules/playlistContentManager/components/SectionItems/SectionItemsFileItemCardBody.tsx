import { FileThumbnail } from '@modules/file/components/FileThumbnail'
import { PlaylistContentManagerItem } from '@modules/playlist/types'
import { usePlaylistContentManagerStorage } from '@stores/usePlaylistContentManagerStorage'

export const SectionItemsFileItemCardBody = ({ item }: { item: PlaylistContentManagerItem }) => {
    const { file, link } = item
    const removeItems = usePlaylistContentManagerStorage(s => s.removeItems)
    const updateItemDuration = usePlaylistContentManagerStorage(s => s.updateItemDuration)

    if (item.type === 'link' && link) {
        return (
            <div className="flex items-center justify-between gap-2">
                <div className="w-14 h-14 flex-shrink-0 bg-blue-100 rounded flex items-center justify-center text-2xl">
                    🌐
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{link.name}</div>
                    <div className="text-xs text-gray-400 truncate">{link.url}</div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0" onPointerDown={e => e.stopPropagation()}>
                    <input
                        type="number"
                        min={1}
                        max={3600}
                        value={item.duration ?? 30}
                        onChange={(e) => {
                            const val = parseInt(e.target.value)
                            if (!isNaN(val) && val > 0) {
                                updateItemDuration(item.id, val)
                            }
                        }}
                        className="w-16 text-xs border rounded px-1 py-0.5 text-center"
                        title="Duration in seconds"
                    />
                    <span className="text-xs text-gray-400">s</span>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); removeItems(item.id) }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50 flex-shrink-0"
                    title="Remove"
                >
                    ✕
                </button>
            </div>
        )
    }

    if (!file) {
        return <div>File not found</div>
    }

    return (
        <div className="flex items-center justify-between gap-2">
            <div className="w-14 h-14 flex-shrink-0">
                <FileThumbnail file={file} />
            </div>
            <div className="flex-1 text-sm truncate">{file.name}</div>
            <div className="flex items-center gap-1 flex-shrink-0" onPointerDown={e => e.stopPropagation()}>
                <input
                    type="number"
                    min={1}
                    max={3600}
                    value={item.duration ?? 15}
                    onChange={(e) => {
                        const val = parseInt(e.target.value)
                        if (!isNaN(val) && val > 0) {
                            updateItemDuration(item.id, val)
                        }
                    }}
                    className="w-16 text-xs border rounded px-1 py-0.5 text-center"
                    title="Duration in seconds"
                />
                <span className="text-xs text-gray-400">s</span>
            </div>
            <button
                onClick={(e) => { e.stopPropagation(); removeItems(item.id) }}
                onPointerDown={(e) => e.stopPropagation()}
                className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50 flex-shrink-0"
                title="Remove"
            >
                ✕
            </button>
        </div>
    )
}
