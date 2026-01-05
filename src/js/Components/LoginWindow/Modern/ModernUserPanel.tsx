import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/js/lib/utils'
import { Button } from '@/js/Components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/js/Components/ui/avatar'
import { Badge } from '@/js/Components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/js/Components/ui/select'
import { data } from '@/lang'
import type { LightDMUser } from '@/js/State/types'
import { getUserImage, getSessions } from '@/js/Greeter/Operations'
import { types, notify } from '@/js/Greeter/ModernNotifications'
import { date } from '@/js/Tools/Formatter'
import { ScrollArea } from '../../ui/scroll-area'
import useStore from '@/js/State/store'

declare global {
  interface Lightdm {
    users?: { username?: string; display_name?: string }[]
    authenticate?: (user?: string | null) => void
    cancel_authentication?: () => void
    respond?: (password: string) => void
    authenticate_as_guest?: () => void
    is_authenticated?: boolean
    has_guest_account?: boolean
    show_prompt?: { connect: (fn: () => void) => void; disconnect: (fn: () => void) => void }
    authentication_complete?: { connect: (fn: () => void) => void; disconnect: (fn: () => void) => void }
    start_session?: (key?: string | null) => void
  }

  interface Window {
    __is_debug?: boolean
    accounts?: { guestUser?: { username?: string }; getDefaultAccount?: () => { username?: string } }
    sessions?: { getSelectedSession?: () => { key?: string } }
    wait?: (ms: number) => Promise<void>
  }

}


interface ModernUserPanelProps {
  onRecenter: () => void
}

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    aria-label="Lock"
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const UnlockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    aria-label="Unlock"
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </svg>
)

const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    aria-label="Previous"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    aria-label="Next"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
)

const GripIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    aria-label="Drag"
  >
    <circle cx="9" cy="12" r="1" />
    <circle cx="9" cy="5" r="1" />
    <circle cx="9" cy="19" r="1" />
    <circle cx="15" cy="12" r="1" />
    <circle cx="15" cy="5" r="1" />
    <circle cx="15" cy="19" r="1" />
  </svg>
)

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Show">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Hide">
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.86 21.86 0 0 1 5.06-6.94" />
    <path d="M1 1l22 22" />
  </svg>
)

export default function ModernUserPanel({ onRecenter }: ModernUserPanelProps) {
  const passwordRef = useRef<HTMLInputElement>(null)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)

  const user = useStore((state) => state.runtime.user)
  const session = useStore((state) => state.runtime.session)
  const lang = useStore((state) => state.settings.behaviour.language)
  const dateEnabled = useStore((state) => state.settings.behaviour.date.enabled)
  const dateFormat = useStore((state) => state.settings.behaviour.date.format)
  const showAvatar = useStore((state) => state.settings.behaviour.avatar)
  const showUser = useStore((state) => state.settings.behaviour.user)
  const showSession = useStore((state) => state.settings.behaviour.session)
  const inactive = useStore((state) => state.runtime.events.inactivity)
  const switchUser = useStore((state) => state.switchUser)
  const switchSession = useStore((state) => state.switchSession)
  const startEvent = useStore((state) => state.startEvent)

  const sessions = getSessions()

  const users: { username?: string; display_name?: string }[] = window.__is_debug
    ? typeof lightdm !== 'undefined'
      ? lightdm.users ?? []
      : [{ username: 'user', display_name: 'User' }]
    : typeof lightdm !== 'undefined'
      ? lightdm.users ?? []
      : []

  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    if (!dateEnabled) return
    setCurrentDate(date(dateFormat))
    const interval = setInterval(() => setCurrentDate(date(dateFormat)), 60000)
    return () => clearInterval(interval)
  }, [dateEnabled, dateFormat])

  useEffect(() => {
    passwordRef.current?.focus()
  }, [])

  // small helper for waits
  const wait = useCallback((ms: number) => new Promise((res) => setTimeout(res, ms)), [])

  const doRespond = useCallback(() => {
    if (!passwordRef.current) return
    const currentUser = user

    passwordRef.current.blur()
    passwordRef.current.disabled = true

    if (currentUser === window.accounts?.guestUser && window.lightdm?.has_guest_account) {
      window.lightdm.authenticate_as_guest()
    } else {
      window.lightdm?.respond(password)
    }
  }, [user, password])

  const startAuthentication = useCallback(() => {
    window.lightdm?.cancel_authentication()
    const currentUser = user
    if (currentUser === window.accounts?.guestUser && window.lightdm?.has_guest_account) return
    window.lightdm?.authenticate(currentUser?.username ?? '')
  }, [user])


  useEffect(() => {
    if (window.__is_debug) return
    startAuthentication()
    return () => {
      window.lightdm?.cancel_authentication()
    }
  }, [startAuthentication])

  const handleLogin = () => {
    if (isLoading || !password) return

    setIsLoading(true)

    if (window.__is_debug) {
      setTimeout(() => {
        if (password === 'password') {
          handleLoginSuccess()
        } else {
          handleLoginFailure()
        }
      }, 1000)
    } else {
      doRespond()
    }
  }

  const handleLoginSuccess = useCallback(() => {
    notify(`${data.get(lang, 'notifications.logged_in')} ${user?.username}!`, types.Success)
    startEvent('loginSuccess')
    setIsLoading(false)
  }, [lang, user?.username, startEvent])

  const handleLoginFailure = useCallback(() => {
    notify(data.get(lang, 'notifications.wrong_password'), types.Error)
    startEvent('loginFailure')
    setPassword('')
    setShake(true)
    setTimeout(() => setShake(false), 500)
    setIsLoading(false)
    if (passwordRef.current) {
      passwordRef.current.disabled = false
      passwordRef.current.focus()
    }
  }, [lang, startEvent])

  useEffect(() => {
    if (window.__is_debug) return

    const onAuthComplete = () => {
      if (lightdm?.is_authenticated) {
        ;(async () => {
          handleLoginSuccess()
          const form = document.querySelector('#login-form')
          form?.classList.add('success')
          await wait(500)
          const defSession = window.sessions?.getSelectedSession?.()
          const body = document.querySelector('body')
          if (body) body.style.opacity = '0'
          await wait(1000)
          window.lightdm?.start_session(defSession?.key ?? null)
        })()
      } else {
        handleLoginFailure()
      }
    }

    lightdm?.authentication_complete?.connect(onAuthComplete)
    return () => lightdm?.authentication_complete?.disconnect(onAuthComplete)
  }, [handleLoginFailure, handleLoginSuccess, wait])

  const handleUserSwitch = (direction: 'next' | 'prev') => {
    const currentIndex = users.findIndex((u) => u.username === user?.username)
    const newIndex =
      direction === 'next'
        ? (currentIndex + 1) % users.length
        : (currentIndex - 1 + users.length) % users.length

    switchUser(users[newIndex] as unknown as LightDMUser)
    setPassword('')
    // restart auth flow for the newly selected user
    if (!window.__is_debug) startAuthentication()
  }

  const handleSessionChange = (sessionKey: string) => {
    const newSession = sessions.find((s) => s.key === sessionKey)
    if (newSession) {
      switchSession(newSession)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleLogin()
    }
  }

  const userInitials =
    user?.display_name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) ||
    user?.username?.slice(0, 2).toUpperCase() ||
    '??'

  return (
    <form className="flex-1 flex flex-col relative no-wall-change" aria-label="Login form">
      <button
        type="button"
        className="login-handle absolute top-0 left-0 right-0 h-12 flex items-center justify-center cursor-grab active:cursor-grabbing group"
        onDoubleClick={onRecenter}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onRecenter()
          }
        }}
      >
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/50 hover:bg-muted/70 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm">
          <GripIcon />
          <span className="text-sm text-foreground font-medium">Drag to move</span>
        </div>
      </button>

      <div className="flex-1 flex flex-col items-center justify-center px-12 py-8">
        <ScrollArea>
          <div className="flex items-center justify-center gap-6 mb-8">
            {users?.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleUserSwitch('prev')}
                className="opacity-60 hover:opacity-100"
              >
                <ChevronLeftIcon />
              </Button>
            )}

            {showAvatar && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300" />
                <Avatar className="w-28 h-28 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300 shadow-lg shadow-primary/10">
                  <AvatarImage src={user ? getUserImage(user) : ''} alt={user?.display_name} />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-primary/20 to-accent/20">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}

            {users.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleUserSwitch('next')}
                className="opacity-60 hover:opacity-100"
              >
                <ChevronRightIcon />
              </Button>
            )}
          </div>

          {showUser && (
            <div className="text-center mb-8">
              <h2 className="text-4xl font-semibold text-foreground mb-1">
                {user?.display_name || user?.username || 'Unknown User'}
              </h2>
              <p className="text-base font-medium text-foreground/90">@{user?.username || 'unknown'}</p>
            </div>
          )}
          <div
            className={cn(
              'w-full max-w-sm mb-6',
              shake && 'animate-[shake_0.5s_ease-in-out]'
            )}
          >
            <div className="relative group">
              <div className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center">
                <div
                  className="absolute left-4 text-foreground/80 group-focus-within:text-primary transition-colors"
                  aria-hidden
                >
                  <LockIcon />
                </div>
                <label className="sr-only" htmlFor="password-input">
                  {data.get(lang, 'login.password') || 'Password'}
                </label>
                <input
                  id="password-input"
                  ref={passwordRef}
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={inactive || isLoading}
                  aria-label={data.get(lang, 'login.password') || 'Password'}
                  placeholder={data.get(lang, 'login.password') || 'Password'}
                  className={cn(
                    'w-full h-16 pl-16 pr-12 rounded-xl py-2 leading-normal text-lg',
                    'bg-card/70 border border-border/30 hover:border-border/50',
                    'text-foreground placeholder:text-foreground/70',
                    'focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary',
                    'transition-all duration-300',
                    'disabled:opacity-80 disabled:cursor-not-allowed disabled:bg-card/60',
                    'shadow-sm hover:shadow-md group-focus-within:shadow-lg group-focus-within:shadow-primary/20'
                  )}
                />
                <button
                  type="button"
                  onClick={() => {
                    setPasswordVisible((v) => !v)
                    passwordRef.current?.focus()
                  }}
                  className="absolute right-4 text-foreground/70 hover:text-foreground/90"
                  aria-label={passwordVisible ? data.get(lang, 'login.hide_password') || 'Hide password' : data.get(lang, 'login.show_password') || 'Show password'}
                  title={passwordVisible ? data.get(lang, 'login.hide_password') || 'Hide password' : data.get(lang, 'login.show_password') || 'Show password'}
                >
                  {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={!password || isLoading}
            size="lg"
            className={cn(
              'w-full max-w-sm h-14 text-lg font-medium',
              'bg-primary hover:bg-primary/90 text-primary-foreground disabled:text-foreground/80',
              'shadow-lg shadow-primary/25 hover:shadow-lg hover:shadow-primary/40',
              'transition-all duration-300',
              'disabled:opacity-80 disabled:cursor-not-allowed disabled:bg-card/60',
              isLoading && 'animate-pulse'
            )}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span className="font-medium text-primary-foreground">
                  {data.get(lang, 'login.logging_in') || 'Signing in...'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <UnlockIcon />
                <span className="font-medium ">{data.get(lang, 'login.button') || 'Sign In'}</span>
              </div>
            )}
          </Button>

          {showSession && (
            <div className="mt-8 w-full max-w-sm">
              <Select value={session?.key || ''} onValueChange={handleSessionChange}>
                <SelectTrigger className="w-full h-12 text-lg bg-card/80 border-input hover:border-input/80 px-4 rounded-xl transition-colors text-foreground">
                  <SelectValue placeholder={data.get(lang, 'login.session') || 'Select session'} />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((s) => (
                    <SelectItem key={s.key} value={s.key} aria-label={`${s.type?.toUpperCase() || 'X11'} ${s.name}`}>
                      <span className="inline-flex items-center gap-2" aria-hidden>
                        <Badge variant="outline" className="text-[10px]">
                          {s.type?.toUpperCase() || 'X11'}
                        </Badge>
                        {'\u00A0'}
                        <span className="text-base text-foreground font-medium">{s.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="px-8 py-4 border-t border-border/30 flex items-center justify-between bg-muted/20">
        <div className="text-sm text-foreground font-medium">
          {users.length > 1 && (
            <span>
              {users.length} {data.get(lang, 'login.users') || 'users'}
            </span>
          )}
        </div>

        {dateEnabled && <div className="text-sm text-foreground">{currentDate}</div>}
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
      `}</style>
    </form>
  )
}
