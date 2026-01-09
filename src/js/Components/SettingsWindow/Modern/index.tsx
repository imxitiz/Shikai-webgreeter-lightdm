import { useState, useEffect, useRef, useCallback } from 'react'
import Draggable from 'react-draggable'
import { cn } from '@/js/lib/utils'
import { Button } from '@/js/Components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/js/Components/ui/tabs'
import { ScrollArea } from '@/js/Components/ui/scroll-area'
import { data } from '@/lang'
import useStore from '@/js/State/store'

import ModernBehaviourTab from './tabs/ModernBehaviourTab'
import ModernStyleTab from './tabs/ModernStyleTab'
import ModernThemesTab from './tabs/ModernThemesTab'

interface SettingsIconProps {
  className?: string
}

const SettingsIcon = ({ className }: SettingsIconProps) => (
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
    aria-label="Settings"
    className={className}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const CloseIcon = () => (
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
    aria-label="Close"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

const RecenterIcon = () => (
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
    aria-label="Recenter"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M3 12h3m12 0h3M12 3v3m0 12v3" />
  </svg>
)

const SETTINGS_WIDTH = 720
const SETTINGS_HEIGHT = 600

function clamp(v: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, v))
}

export default function ModernSettings() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('behaviour')
  const [isHovering, setIsHovering] = useState(false)
  const nodeRef = useRef<HTMLDivElement>(null)

  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    try {
      if (open) {
        document.body.classList.add('settings-open')
      } else {
        document.body.classList.remove('settings-open')
      }
    } catch {
      // ignore (e.g., server-side rendering)
    }
    return () => {
      try {
        document.body.classList.remove('settings-open')
      } catch {}
    }
  }, [open])

  const inactive = useStore((state) => state.runtime.events.inactivity)
  const evokerSetting = useStore((state) => state.settings.behaviour.evoker)
  const lang = useStore((state) => state.settings.behaviour.language)
  const updateSettings = useStore((state) => state.updateSettings)
  const saveSettings = useStore((state) => state.saveSettings)

  const evokerMode = String(evokerSetting) === 'hover' ? 'hover' : 'show'

  const getBounds = useCallback(() => {
    const availW =
      typeof screen !== 'undefined' && screen.availWidth
        ? screen.availWidth
        : window.innerWidth || 800
    const availH =
      typeof screen !== 'undefined' && screen.availHeight
        ? screen.availHeight
        : window.innerHeight || 600
    return {
      left: -(availW / 2 - SETTINGS_WIDTH / 2),
      right: availW / 2 - SETTINGS_WIDTH / 2,
      top: -(availH / 2 - SETTINGS_HEIGHT / 2),
      bottom: availH / 2 - SETTINGS_HEIGHT / 2
    }
  }, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('SettingsDrag')
      if (saved) {
        const parsed = JSON.parse(saved)
        const bounds = getBounds()
        setPosition({
          x: clamp(Number(parsed.x) || 0, bounds.left, bounds.right),
          y: clamp(Number(parsed.y) || 0, bounds.top, bounds.bottom)
        })
      }
    } catch (e) {
      console.warn('SettingsDrag read failed', e)
    }
  }, [getBounds])

  useEffect(() => {
    updateSettings()
  }, [updateSettings])

  const handleDrag = (_: unknown, dragData: { x: number; y: number }) => {
    setPosition({ x: dragData.x, y: dragData.y })
  }

  const handleDragStop = (_: unknown, dragData: { x: number; y: number }) => {
    const bounds = getBounds()
    const x = clamp(dragData.x, bounds.left, bounds.right)
    const y = clamp(dragData.y, bounds.top, bounds.bottom)
    setPosition({ x, y })
    try {
      localStorage.setItem('SettingsDrag', JSON.stringify({ x, y }))
    } catch (e) {
      console.warn('Failed to save SettingsDrag', e)
    }
  }

  const handleRecenter = () => {
    setPosition({ x: 0, y: 0 })
    try {
      localStorage.setItem('SettingsDrag', JSON.stringify({ x: 0, y: 0 }))
    } catch (e) {
      console.warn('Failed to save SettingsDrag', e)
    }
  }

  const handleClose = () => {
    setOpen(false)
    saveSettings()
  }

  const handleOpen = () => {
    if (!inactive) {
      setOpen(true)
    }
  }

  const evokerVisible = true
  const bounds = getBounds()

  return (
    <>
      {evokerVisible && (
        <button
          type="button"
          className="fixed bottom-6 right-6 z-40 p-0 m-0 bg-transparent border-none"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onFocus={() => setIsHovering(true)}
          onBlur={() => setIsHovering(false)}
          onClick={handleOpen}
          aria-label={data.get(lang, 'settings.open') || 'Open Settings'}
        >
          <span
            className={cn(
              'flex items-center justify-center',
              'w-14 h-14 rounded-full',
              'transition-all duration-300 ease-out',
              'shadow-lg hover:shadow-xl',
              'hover:scale-110 hover:rotate-90',
              'border border-border/50 hover:border-primary/50',
              'glass',
              evokerMode === 'hover' && !isHovering && 'opacity-0',
              evokerMode === 'hover' && isHovering && 'opacity-100',
              evokerMode === 'show' && 'opacity-70 hover:opacity-100'
            )}
            style={{
              background: 'var(--sidebar)',
              color: 'var(--sidebar-foreground)'
            }}
          >
            <SettingsIcon className="w-5 h-5" />
          </span>
        </button>
      )}

      {open && !inactive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <Draggable
            nodeRef={nodeRef}
            axis="both"
            handle=".settings-drag-handle"
            bounds={bounds}
            position={position}
            onDrag={handleDrag}
            onStop={handleDragStop}
          >
            <section
              ref={nodeRef}
              aria-label="Settings Panel"
              className={cn(
                'relative z-50 no-wall-change pointer-events-auto',
                'rounded-2xl',
                'flex flex-col',
                'shadow-2xl',
                'animate-in fade-in-0 zoom-in-95 duration-300',
                'bg-card/95 border border-border/50'
              )}
              style={{
                width: SETTINGS_WIDTH,
                height: SETTINGS_HEIGHT,
                maxWidth: '95vw',
                maxHeight: '90vh',
                backdropFilter: 'none',
                WebkitBackdropFilter: 'none'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  handleClose()
                }
              }}
              tabIndex={-1}
            >
              <div className="settings-drag-handle flex items-center justify-between px-6 py-4 border-b border-border/20 cursor-move select-none">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2.5 rounded-xl"
                    style={{
                      background: 'var(--sidebar-accent)',
                      color: 'var(--sidebar-accent-foreground)'
                    }}
                  >
                    <SettingsIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {data.get(lang, 'settings.title') || 'Settings'}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {data.get(lang, 'settings.subtitle') || 'Customize your greeter'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleRecenter}
                    className="opacity-60 hover:opacity-100"
                    title={data.get(lang, 'settings.recenter') || 'Recenter'}
                  >
                    <RecenterIcon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleClose}
                    className="opacity-60 hover:opacity-100 hover:bg-destructive/20 hover:text-destructive"
                  >
                    <CloseIcon />
                  </Button>
                </div>
              </div>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <div className="px-6 pt-4">
                  <TabsList className="w-full grid grid-cols-3 h-12 p-1 bg-muted/50 rounded-xl">
                    <TabsTrigger
                      value="behaviour"
                      className="rounded-lg text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
                    >
                      {data.get(lang, 'settings.behaviour.name') || 'Behaviour'}
                    </TabsTrigger>
                    <TabsTrigger
                      value="style"
                      className="rounded-lg text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
                    >
                      {data.get(lang, 'settings.style.name') || 'Style'}
                    </TabsTrigger>
                    <TabsTrigger
                      value="themes"
                      className="rounded-lg text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
                    >
                      {data.get(lang, 'settings.themes.name') || 'Themes'}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <ScrollArea className="flex-1 px-6 pb-6">
                  <TabsContent value="behaviour" className="mt-4 focus-visible:outline-none">
                    <ModernBehaviourTab />
                  </TabsContent>

                  <TabsContent value="style" className="mt-4 focus-visible:outline-none">
                    <ModernStyleTab />
                  </TabsContent>

                  <TabsContent value="themes" className="mt-4 focus-visible:outline-none">
                    <ModernThemesTab />
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </section>
          </Draggable>
        </div>
      )}
    </>
  )
}
