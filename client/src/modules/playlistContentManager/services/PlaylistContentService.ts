import { areItemsEqual } from '@shared/helpers/areItemsEqual.js'
import { LinkItem, PlaylistContentManagerItem } from '../../playlist/types.js'
import { WorkspaceFile } from '@modules/file/types.js'
import { v4 as uuidv4 } from 'uuid'

export class PlaylistContentService {
    static playlistComparableFields: (keyof PlaylistContentManagerItem)[] = ['type', 'duration', 'order', 'nestedPlaylistId', 'fileId', 'linkId']

    static arePlaylistItemsEqual = (a: PlaylistContentManagerItem[], b: PlaylistContentManagerItem[]) => {
        return areItemsEqual(a, b, PlaylistContentService.playlistComparableFields)
    }

    static mapFileToPlaylistItem = (files: WorkspaceFile[], sectionId: string, maxOrder: number) => {
        return files.map((item, index) => ({
            id: uuidv4(),
            playlistLayoutSectionId: sectionId,
            order: maxOrder + index + 1,
            fileId: item.id,
            file: item,
            type: 'file',
            duration: item.duration || 15,
            nestedPlaylistId: null,
            nestedPlaylist: null,
            linkId: null,
            link: null
        } as PlaylistContentManagerItem))
    }

    static mapLinkToPlaylistItem = (link: LinkItem, sectionId: string, maxOrder: number, duration: number = 30): PlaylistContentManagerItem => {
        return {
            id: uuidv4(),
            playlistLayoutSectionId: sectionId,
            order: maxOrder + 1,
            fileId: null,
            file: null,
            type: 'link',
            duration,
            nestedPlaylistId: null,
            nestedPlaylist: null,
            linkId: link.id,
            link
        } as PlaylistContentManagerItem
    }
}
