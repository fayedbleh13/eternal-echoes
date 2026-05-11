import { createFileRoute, Navigate, Link } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { gql } from '@apollo/client'
import { useQuery, useMutation } from '@apollo/client/react'
import { useSession } from '~/utils/auth-client'
import { Clock, Plus, Lock, Unlock, Mail, Share2, Send, Edit3, CheckCircle2, ChevronDown, Filter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { QRModal } from '~/components/QRModal'
import { Snackbar } from '~/components/Snackbar'

const GET_MY_CAPSULES = gql`
  query GetMyCapsules {
    myCapsules {
      id
      title
      status
      recipientName
      recipientEmail
      deliveryDate
      createdAt
      shareToken
    }
  }
`

const SEND_CAPSULE = gql`
  mutation SendCapsule($id: ID!) {
    sendCapsule(id: $id) {
      id
      status
    }
  }
`

const REVOKE_CAPSULE = gql`
  mutation RevokeCapsule($id: ID!) {
    revokeCapsule(id: $id) {
      id
      status
    }
  }
`

type SortOption = 'newest' | 'oldest' | 'delivery' | 'alphabetical'
type FilterOption = 'all' | 'draft' | 'sealed' | 'delivered'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const { data: session, isPending: sessionPending } = useSession()
  const [selectedQR, setSelectedQR] = useState<{ token: string, title: string } | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [snackbar, setSnackbar] = useState({ isOpen: false, message: '', type: 'success' as 'success' | 'error' | 'info' })
  const [sendingId, setSendingId] = useState<string | null>(null)
  const [revokingId, setRevokingId] = useState<string | null>(null)
  
  const { data, loading, error, refetch } = useQuery<{ myCapsules: any[] }>(GET_MY_CAPSULES, {
    skip: !session,
  })

  const [sendCapsule] = useMutation(SEND_CAPSULE)
  const [revokeCapsule] = useMutation(REVOKE_CAPSULE)

  const sortedAndFilteredCapsules = useMemo(() => {
    if (!data?.myCapsules) return []
    
    let filtered = data.myCapsules
    
    // Apply filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(c => c.status.toLowerCase() === filterBy)
    }
    
    // Apply sort
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'delivery':
          if (!a.deliveryDate) return 1
          if (!b.deliveryDate) return -1
          return new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime()
        case 'alphabetical':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })
  }, [data, sortBy, filterBy])

  const handleSend = async (id: string, title: string) => {
    setSendingId(id)
    try {
      await sendCapsule({ variables: { id } })
      await refetch()
      setSnackbar({ isOpen: true, message: `"${title}" has been delivered!`, type: 'success' })
    } catch (error: any) {
      setSnackbar({ isOpen: true, message: error.message || 'Failed to send capsule', type: 'error' })
    } finally {
      setSendingId(null)
    }
  }

  const handleRevoke = async (id: string, title: string) => {
    setRevokingId(id)
    try {
      await revokeCapsule({ variables: { id } })
      await refetch()
      setSnackbar({ isOpen: true, message: `"${title}" has been revoked and sealed.`, type: 'success' })
    } catch (error: any) {
      setSnackbar({ isOpen: true, message: error.message || 'Failed to revoke capsule', type: 'error' })
    } finally {
      setRevokingId(null)
    }
  }

  const hideSnackbar = () => {
    setSnackbar(prev => ({ ...prev, isOpen: false }))
  }

  if (sessionPending) return null
  if (!session) return <Navigate to="/login" />

  const sortLabels: Record<SortOption, string> = {
    newest: 'Newest First',
    oldest: 'Oldest First',
    delivery: 'Delivery Date',
    alphabetical: 'Alphabetical'
  }

  const filterLabels: Record<FilterOption, string> = {
    all: 'All Capsules',
    draft: 'Drafts',
    sealed: 'Ready to Send',
    delivered: 'Delivered'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-serif italic mb-2" style={{ color: 'var(--text-primary)' }}>Your Echoes</h1>
          <p style={{ color: 'var(--text-tertiary)' }}>Managing {sortedAndFilteredCapsules.length} preserved capsules.</p>
        </div>
        
        <Link to="/compose" className="btn-primary flex items-center gap-2 self-start md:self-auto">
          <Plus className="w-4 h-4" />
          Create New
        </Link>
      </header>

      {/* Filters & Sort */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {/* Filter Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
          >
            <Filter className="w-4 h-4" />
            {filterLabels[filterBy]}
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {showFilterDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 w-48 rounded-lg shadow-xl z-20"
                style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
              >
                {(Object.keys(filterLabels) as FilterOption[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => { setFilterBy(key); setShowFilterDropdown(false) }}
                    className="w-full text-left px-4 py-2 text-sm transition-colors hover:bg-red-50/50 dark:hover:bg-red-950/10 first:rounded-t-lg last:rounded-b-lg"
                    style={{ color: filterBy === key ? '#dc2626' : 'var(--text-secondary)' }}
                  >
                    {filterLabels[key]}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
          >
            <Clock className="w-4 h-4" />
            {sortLabels[sortBy]}
            <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {showSortDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 w-48 rounded-lg shadow-xl z-20"
                style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
              >
                {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => { setSortBy(key); setShowSortDropdown(false) }}
                    className="w-full text-left px-4 py-2 text-sm transition-colors hover:bg-red-50/50 dark:hover:bg-red-950/10 first:rounded-t-lg last:rounded-b-lg"
                    style={{ color: sortBy === key ? '#dc2626' : 'var(--text-secondary)' }}
                  >
                    {sortLabels[key]}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-48 glass-card animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)' }} />)}
        </div>
      )}

      {error && (
        <div className="p-8 glass-card text-center" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <p className="text-red-500">Failed to load capsules. Please ensure the server is running.</p>
        </div>
      )}

      {!loading && sortedAndFilteredCapsules.length === 0 && (
         <div className="py-24 text-center glass-card border-dashed" style={{ borderStyle: 'dashed' }}>
            <Mail className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
            <h3 className="text-xl font-serif mb-2" style={{ color: 'var(--text-primary)' }}>
              {filterBy === 'all' ? 'The vault is empty' : `No ${filterLabels[filterBy].toLowerCase()}`}
            </h3>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              {filterBy === 'all' ? "You haven't preserved any memories yet." : `No capsules match the "${filterLabels[filterBy]}" filter.`}
            </p>
            <Link to="/compose" className="btn-primary">Write your first letter</Link>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAndFilteredCapsules.map((capsule: any) => (
          <motion.div 
            layoutId={capsule.id}
            key={capsule.id}
            className="glass-card hover:border-red-500/30 transition-all group flex flex-col"
            style={{ 
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          >
            {/* Status Badge */}
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${
                capsule.status === 'DELIVERED' ? 'bg-green-500/10 text-green-600' :
                capsule.status === 'SEALED' ? 'bg-amber-500/10 text-amber-600' :
                'bg-zinc-500/10 text-zinc-600'
              }`}>
                {capsule.status === 'DELIVERED' ? <CheckCircle2 className="w-5 h-5" /> :
                 capsule.status === 'SEALED' ? <Lock className="w-5 h-5" /> :
                 <Edit3 className="w-5 h-5" />}
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-widest font-bold ${
                capsule.status === 'DELIVERED' ? 'bg-green-500/10 text-green-600' :
                capsule.status === 'SEALED' ? 'bg-amber-500/10 text-amber-600' :
                'bg-zinc-500/10 text-zinc-600'
              }`}>
                {capsule.status === 'DRAFT' ? 'Draft' :
                 capsule.status === 'SEALED' ? 'Ready to Send' :
                 'Delivered'}
              </span>
            </div>

            <h3 className="text-xl font-serif group-hover:text-red-600 transition-colors truncate" style={{ color: 'var(--text-primary)' }}>
              {capsule.title}
            </h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>To: {capsule.recipientName}</p>

            {/* Action Buttons based on status */}
            <div className="mt-4 mb-6 flex gap-2 min-h-[40px]">
              {capsule.status === 'DRAFT' && (
                <Link
                  to="/compose"
                  search={{ edit: capsule.id }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-zinc-100"
                  style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                >
                  <Edit3 className="w-3 h-3" />
                  Continue Editing
                </Link>
              )}
              {(capsule.status === 'DRAFT' || capsule.status === 'SEALED') && (
                <button 
                  onClick={() => handleSend(capsule.id, capsule.title)}
                  disabled={sendingId === capsule.id}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white transition-all disabled:opacity-50"
                  style={{ backgroundColor: '#dc2626' }}
                >
                  {sendingId === capsule.id ? (
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-3 h-3" />
                  )}
                  {sendingId === capsule.id ? 'Sending...' : capsule.status === 'DRAFT' ? 'Send Now' : 'Deliver'}
                </button>
              )}
              {capsule.status === 'DELIVERED' && (
                <>
                  <a
                    href={`/unlock/${capsule.shareToken}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-zinc-100"
                    style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    View Capsule
                  </a>
                  <button
                    onClick={() => handleRevoke(capsule.id, capsule.title)}
                    disabled={revokingId === capsule.id}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
                    style={{ backgroundColor: '#dc2626', color: 'white' }}
                  >
                    {revokingId === capsule.id ? (
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Lock className="w-3 h-3" />
                    )}
                    Revoke
                  </button>
                </>
              )}
            </div>

            <div className="mt-auto pt-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--border-color)' }}>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                 <Clock className="w-3 h-3" />
                 <span>{capsule.deliveryDate ? format(new Date(capsule.deliveryDate), 'MMM d, yyyy') : 'Immediate'}</span>
              </div>
              
              <button 
                onClick={() => setSelectedQR({ token: capsule.shareToken, title: capsule.title })}
                className="p-2 rounded-lg transition-all hover:text-red-600 hover:bg-red-50"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <QRModal 
        isOpen={!!selectedQR} 
        onClose={() => setSelectedQR(null)}
        shareToken={selectedQR?.token || ''}
        title={selectedQR?.title || ''}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        message={snackbar.message}
        isOpen={snackbar.isOpen}
        onClose={hideSnackbar}
        type={snackbar.type}
        duration={5000}
      />
    </div>
  )
}
