import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { Suspense, useState } from 'react'
import { useDebounce } from '@uidotdev/usehooks'
import { Input } from '@shared/ui/input/Input'
import { FileSelectorFileList } from './FileSelector/FileSelectorFileList'
import { usePlaylistContentManagerStorage } from '@stores/usePlaylistContentManagerStorage'
import { v4 as uuidv4 } from 'uuid'

const AddLinkForm = () => {
    const [url, setUrl] = useState('')
    const [name, setName] = useState('')
    const [duration, setDuration] = useState(30)
    const addLinkToCurrentLayoutSection = usePlaylistContentManagerStorage(s => s.addLinkToCurrentLayoutSection)

    const handleAdd = () => {
        if (!url.trim()) return
        const link = {
            id: uuidv4(),
            name: name || url,
            type: 'webpage',
            url: url.trim(),
            refreshInterval: null,
            defaultDuration: duration
        }
        addLinkToCurrentLayoutSection(link, duration)
        setUrl('')
        setName('')
        setDuration(30)
    }

    return (
        <div className='flex flex-col gap-3 p-3 border rounded-lg bg-gray-50'>
            <div className='text-sm font-medium text-gray-700'>Add URL / Dashboard</div>
            <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name (optional)"
            />
            <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/dashboard"
            />
            <div className='flex items-center gap-2'>
                <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                    placeholder="Duration (seconds)"
                    min={1}
                />
                <span className='text-xs text-gray-500 whitespace-nowrap'>seconds</span>
            </div>
            <button
                onClick={handleAdd}
                disabled={!url.trim()}
                className='w-full py-2 px-4 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
            >
                + Add to Section
            </button>
        </div>
    )
}

export const ContentManagerFileSelector = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [activeTab, setActiveTab] = useState<'files' | 'url'>('files')
    const debouncedSearchTerm = useDebounce(searchTerm, 300)

    return (
        <>
            <div className='flex border-b mb-4'>
                <button
                    onClick={() => setActiveTab('files')}
                    className={`flex-1 py-2 text-sm font-medium ${activeTab === 'files' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                >
                    Files
                </button>
                <button
                    onClick={() => setActiveTab('url')}
                    className={`flex-1 py-2 text-sm font-medium ${activeTab === 'url' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                >
                    URL
                </button>
            </div>

            {activeTab === 'files' ? (
                <>
                    <div className='mb-4'>
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search files..."
                        />
                    </div>
                    <QueryErrorResetBoundary>
                        <ErrorBoundary fallbackRender={() => (
                            <div>There was an error!</div>
                        )}>
                            <Suspense fallback={<>Loading</>}>
                                <FileSelectorFileList search={debouncedSearchTerm} />
                            </Suspense>
                        </ErrorBoundary>
                    </QueryErrorResetBoundary>
                </>
            ) : (
                <AddLinkForm />
            )}
        </>
    )
}
