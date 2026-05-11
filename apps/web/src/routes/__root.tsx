/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
  Outlet,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import { ApolloProvider } from '@apollo/client/react'
import { client } from '~/utils/apollo'
import { useSession, signOut } from '~/utils/auth-client'
import { useThemeStore } from '~/utils/theme'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import appCss from '~/styles/app.css?url'
import { seo } from '~/utils/seo'
import { User, Moon, Sun, LogOut, ChevronDown } from 'lucide-react'

// Avatar Component with Fallback
function Avatar({ src, name, className }: { src?: string | null, name: string, className?: string }) {
  const [error, setError] = React.useState(false)
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  
  if (!src || error) {
    return (
      <div className={`rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-semibold text-xs ${className}`}>
        {initials}
      </div>
    )
  }
  
  return (
    <img 
      src={src} 
      className={`rounded-full object-cover ${className}`}
      alt={name}
      onError={() => setError(true)}
      referrerPolicy="no-referrer"
    />
  )
}

// Theme Toggle Switch Component
function ThemeToggle({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) {
  return (
    <button 
      onClick={toggleTheme}
      className="relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none"
      style={{ backgroundColor: theme === 'dark' ? '#374151' : '#d1d5db' }}
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center"
        style={{ transform: theme === 'dark' ? 'translateX(24px)' : 'translateX(0)' }}
      >
        {theme === 'dark' ? <Moon className="w-3 h-3 text-gray-700" /> : <Sun className="w-3 h-3 text-amber-500" />}
      </span>
    </button>
  )
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ...seo({
        title: 'Eternal Echoes | Your Digital Time Capsule',
        description: 'Send letters to the future. A cinematic way to preserve memories and voices.',
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  component: RootDocument,
})

function RootDocument() {
  const { data: session, isPending } = useSession()
  const { theme, toggleTheme } = useThemeStore()
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <ApolloProvider client={client}>
      <html lang="en" className={theme}>
        <head>
          <HeadContent />
        </head>
        <body className="min-h-screen flex flex-col theme-transition">
          <nav className="border-b sticky top-0 z-50 theme-transition" 
               style={{ 
                 backgroundColor: 'var(--card-bg)', 
                 borderColor: 'var(--border-color)',
                 backdropFilter: 'blur(12px)'
               }}>
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-red-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-white font-serif italic text-lg">E</span>
                </div>
                <span className="font-serif italic text-xl tracking-tight theme-transition" style={{ color: 'var(--text-primary)' }}>
                  Eternal Echoes
                </span>
              </Link>

              <div className="flex items-center gap-6 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                {session ? (
                  <>
                    <Link to="/dashboard" activeProps={{ style: { color: '#8B1D1D' } }} 
                          className="hover:text-red-700 transition-colors">Dashboard</Link>
                    <Link to="/compose" activeProps={{ style: { color: '#8B1D1D' } }} 
                          className="hover:text-red-700 transition-colors">Write Letter</Link>
                    
                    {/* Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                      <button 
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-3 pl-6 border-l theme-transition hover:text-red-700"
                        style={{ borderColor: 'var(--border-color)' }}
                      >
                        <span className="hidden sm:inline">Hello, {session.user.name.split(' ')[0]}</span>
                        <Avatar 
                          src={session.user.image} 
                          name={session.user.name} 
                          className="w-8 h-8 ring-2 ring-[var(--border-color)]"
                        />
                        <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Dropdown Menu */}
                      {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl py-2 z-50 theme-transition dropdown-menu"
                             style={{ 
                               backgroundColor: 'var(--bg-primary)', 
                               border: '1px solid var(--border-color)',
                               boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                             }}>
                          <div className="px-4 py-3 border-b theme-transition" style={{ borderColor: 'var(--border-color)' }}>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{session.user.name}</p>
                            <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>{session.user.email}</p>
                          </div>
                          
                          <Link to="/dashboard" 
                                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors w-full text-left"
                                style={{ color: 'var(--text-secondary)' }}
                                onClick={() => setDropdownOpen(false)}>
                            <User className="w-4 h-4" />
                            Dashboard
                          </Link>
                          
                          <div className="flex items-center justify-between px-4 py-2.5">
                            <span className="text-sm flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                              {theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                              {theme === 'light' ? 'Light' : 'Dark'}
                            </span>
                            <ThemeToggle theme={theme} toggleTheme={() => { toggleTheme(); setDropdownOpen(false); }} />
                          </div>
                          
                          <div className="border-t my-2 theme-transition" style={{ borderColor: 'var(--border-color)' }} />
                          
                          <button 
                            onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = '/' } } })}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-red-600"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  !isPending && <Link to="/login" className="btn-primary py-2 px-4 text-sm">Sign In</Link>
                )}
              </div>
            </div>
          </nav>

          <main className="flex-1">
            <Outlet />
          </main>

          <footer className="border-t py-4 mt-auto flex flex-col items-center gap-1 text-xs theme-transition" 
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-tertiary)' }}>
            <p>© 2026 Eternal Echoes. Preservation is an Art.</p>
          </footer>

          <TanStackRouterDevtools position="bottom-right" />
          <Scripts />
        </body>
      </html>
    </ApolloProvider>
  )
}
