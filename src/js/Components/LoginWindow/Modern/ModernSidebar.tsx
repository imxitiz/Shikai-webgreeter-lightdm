import { useState, useEffect, useRef } from 'react'
import { Switch } from '@/js/Components/ui/switch'
import { cn } from '@/js/lib/utils'
import { Button } from '@/js/Components/ui/button'
import { Separator } from '@/js/Components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/js/Components/ui/tooltip'
import { data } from '@/lang'
import { shutdown, restart, sleep, hibernate } from '@/js/Greeter/Commands'
import { time } from '@/js/Tools/Formatter'
import { ScrollArea } from '../../ui/scroll-area'
import useStore from '@/js/State/store'

declare global {
  interface Window {
    __is_debug?: boolean
  }
  const lightdm: any
}

const PowerIcon = () => (
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
    aria-label="Power"
  >
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
    <line x1="12" x2="12" y1="2" y2="12" />
  </svg>
)

const RestartIcon = () => (
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
    aria-label="Restart"
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
)

const SleepIcon = () => (
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
    aria-label="Sleep"
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
)

const HibernateIcon = () => (
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
    aria-label="Hibernate"
  >
    <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
  </svg>
)

const commandOptions = [
  { key: 'sleep', icon: SleepIcon, func: sleep },
  { key: 'reboot', icon: RestartIcon, func: restart },
  { key: 'shutdown', icon: PowerIcon, func: shutdown },
  { key: 'hibernate', icon: HibernateIcon, func: hibernate }
]

export default function ModernSidebar() {
  const [currentTime, setCurrentTime] = useState('--:--')
  const sidebarRef = useRef<HTMLDivElement>(null)

  const commands = useStore((state) => state.settings.behaviour.commands)
  const clockEnabled = useStore((state) => state.settings.behaviour.clock.enabled)
  const clockFormat = useStore((state) => state.settings.behaviour.clock.format)
  const lang = useStore((state) => state.settings.behaviour.language)
  const logoSrc = useStore((state) => state.settings.style.sidebar.logo)
  const darkMode = useStore((state) => state.settings.behaviour.dark_mode)
  const showLogo = useStore((state) => state.settings.behaviour.logo)
  const showHostname = useStore((state) => state.settings.behaviour.hostname)
  const toggleSetting = useStore((state) => state.toggleSetting)
  const saveSettings = useStore((state) => state.saveSettings)

  useEffect(() => {
    if (!clockEnabled) return
    const updateTime = () => setCurrentTime(time(clockFormat))
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [clockEnabled, clockFormat])

  const hostname = window.__is_debug ? 'hostname' : lightdm?.hostname || 'Unknown'

  return (
    <div
      ref={sidebarRef}
      className="relative w-[320px] h-full flex flex-col p-6 bg-card/40 border-r border-border/30 no-wall-change"
    >
      <ScrollArea className="absolute inset-0">
        {showLogo && (
          <div className="flex items-center justify-center py-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl" />
              <img
                src={logoSrc || '/assets/media/logos/shikai.png'}
                alt="Logo"
                className="relative w-32 h-32 object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        )}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-gradient">Shikai</h1>
          <p className="text-lg text-foreground mt-1">Modern Greeter</p>
          <p className="text-sm text-foreground mt-1">
            Made with{' '}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="inline w-4 h-4 text-red-500 mx-1"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
              />
            </svg>{' '}
            by imxitiz
          </p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="text-lg text-foreground font-medium">
              {darkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
            <Switch
              checked={darkMode}
              onCheckedChange={() => {
                toggleSetting('behaviour.dark_mode')
                saveSettings()
              }}
            />
          </div>
        </div>

        <div className="flex-1">
          <p className="text-sm text-foreground uppercase tracking-wider m-4">
            {data.get(lang, 'commands.title') || 'Quick Actions'}
          </p>

          <TooltipProvider delayDuration={200}>
            <div className="grid grid-cols-2 gap-3">
              {commandOptions
                .filter((cmd) => commands[cmd.key as keyof typeof commands])
                .map((cmd) => (
                  <Tooltip key={cmd.key}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className={cn(
                          'w-full h-16 flex flex-col gap-1 transition-all duration-300',
                          'hover:scale-105 active:scale-95',
                          'bg-muted/50 hover:bg-muted border-border/50 hover:border-primary/50',
                          'text-foreground hover:text-primary'
                        )}
                        onClick={cmd.func}
                      >
                        <cmd.icon />
                        <span className="text-[14px] font-[1000] capitalize">
                          {data.get(lang, `commands.names.${cmd.key}`)}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{data.get(lang, `commands.names.${cmd.key}`)}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
            </div>
          </TooltipProvider>
        </div>

        <div className="mt-auto space-y-4">
          <Separator className="bg-border/30" />

          {showHostname && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground font-medium">Host</span>
              <span className="font-mono text-foreground">{hostname}</span>
            </div>
          )}
          {clockEnabled && (
            <div className="text-center">
              <div className="text-3xl font-light tracking-wide text-gradient">
                {currentTime}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
