import { PlaylistLayout } from '@modules/workspace/modules/playlistLayout/types'
import { WorkspaceFile } from '../file/types'

export type PlaylistType = 'standard' | 'nestable'

export type Playlist = {
    id: string
    workspaceId: string
    layout?: PlaylistLayout
    description: string
    name: string
    type: PlaylistType
    isPublished: boolean
    priority: number
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    size: number
    _count: {
        screens: number
        items: number
        parentPlaylists?: number
    }
}

export type GetPlaylistQueryData = Playlist & {
    schedules: PlaylistSchedule[];
}

export type CreatePlaylistRequestData = {
    name: string
    workspaceId: string
    type: PlaylistType
}

export type DeletePlaylistsRequestData = {
    playlistIds: string[]
    workspaceId: string
}

export type RestorePlaylistsRequestData = {
    playlistIds: string[]
    workspaceId: string
}

export type Weekday =
        | 'MONDAY'
        | 'TUESDAY'
        | 'WEDNESDAY'
        | 'THURSDAY'
        | 'FRIDAY'
        | 'SATURDAY'
        | 'SUNDAY';

export type PlaylistSchedule = {
    id: string
    playlistId: string
    startAt: string
    endAt: string
    startTime: string
    endTime: string
    createdAt: string
    updatedAt: string
    weekdays: Weekday[]
}

export type CreatePlaylistScheduleRequestData = {
    playlistId: string
    startAt: string
    endAt: string | null
    startTime: string | null
    endTime: string | null
    weekdays: Weekday[]
}

export type UpdatePlaylistScheduleRequestData = {
    playlistId: string
    startAt: string
    endAt: string
    startTime: string
    endTime: string
    weekdays: Weekday[]
}

export type DeletePlaylistScheduleRequestData = {
    scheduleId: string
}

export type AddScreensToPlaylistRequestData = {
    playlistId: string
    screenIds: string[]
}

export type RemoveScreensFromPlaylistRequestData = {
    playlistId: string
    screenIds: string[]
}

export type PlaylistItemType = 'file' | 'nested_playlist' | 'link'

export type LinkItem = {
    id: string
    name: string
    type: string
    url: string
    refreshInterval: number | null
    defaultDuration: number | null
}

export type PlaylistItem = {
    id: string
    playlistId: string
    type: PlaylistItemType
    duration: number
    playlistLayoutSectionId: string
    order: number
    createdAt: string | null
    updatedAt: string | null
    nestedPlaylistId: string | null
    nestedPlaylist: Playlist | null
    fileId: string | null
    file: WorkspaceFile | null
    linkId: string | null
    link: LinkItem | null
}

export type PlaylistContentManagerItem = Omit<PlaylistItem, 'createdAt' | 'updatedAt' | 'playlistId'>

export type FilePlaylistItem = PlaylistItem & {
    fileId: string
    file: WorkspaceFile
}

export type SubplaylistPlaylistItem = PlaylistItem & {
    nestedPlaylistId: string
    nestedPlaylist: Playlist
}

export type LinkPlaylistItem = PlaylistItem & {
    linkId: string
    link: LinkItem
}
