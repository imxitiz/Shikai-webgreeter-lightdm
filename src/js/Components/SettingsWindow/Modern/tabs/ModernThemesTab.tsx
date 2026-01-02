import { useState } from 'react'
import { cn } from '@/js/lib/utils'
import { Badge } from '@/js/Components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/js/Components/ui/card'
import { data } from '@/lang'
import { types, notify } from '@/js/Greeter/Notifications'
import useStore from '@/js/State/store'

interface PresetTheme {
  id: string
  name: string
  description: string
  preview: {
    primary: string
    secondary: string
    background: string
  }
  settings: Record<string, string>
}

const presetThemes: PresetTheme[] = [
  {
    id: 'midnight',
    name: 'Midnight Blue',
    description: 'Deep blue tones with purple accents',
    preview: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      background: '#0f172a'
    },
    settings: {
      'main.textcolor': '#f8fafc',
      'sidebar.background': '#1e293b',
      'userbar.background.top': '#0f172a',
      'userbar.background.bottom': '#020617',
      'userbar.avatar.color': '#3b82f6',
      'main.icons.background': '#1e40af',
      'main.icons.foreground': '#60a5fa'
    }
  },
  {
    id: 'emerald',
    name: 'Emerald Forest',
    description: 'Nature-inspired green palette',
    preview: {
      primary: '#10b981',
      secondary: '#059669',
      background: '#022c22'
    },
    settings: {
      'main.textcolor': '#ecfdf5',
      'sidebar.background': '#064e3b',
      'userbar.background.top': '#022c22',
      'userbar.background.bottom': '#0f0f0f',
      'userbar.avatar.color': '#10b981',
      'main.icons.background': '#047857',
      'main.icons.foreground': '#34d399'
    }
  },
  {
    id: 'rose',
    name: 'Rose Garden',
    description: 'Elegant pink and rose tones',
    preview: {
      primary: '#f43f5e',
      secondary: '#ec4899',
      background: '#1f1215'
    },
    settings: {
      'main.textcolor': '#fdf2f8',
      'sidebar.background': '#3d1520',
      'userbar.background.top': '#1f1215',
      'userbar.background.bottom': '#0a0506',
      'userbar.avatar.color': '#f43f5e',
      'main.icons.background': '#be123c',
      'main.icons.foreground': '#fb7185'
    }
  },
  {
    id: 'amber',
    name: 'Golden Sunset',
    description: 'Warm amber and orange hues',
    preview: {
      primary: '#f59e0b',
      secondary: '#ea580c',
      background: '#1c1510'
    },
    settings: {
      'main.textcolor': '#fffbeb',
      'sidebar.background': '#422006',
      'userbar.background.top': '#1c1510',
      'userbar.background.bottom': '#0a0705',
      'userbar.avatar.color': '#f59e0b',
      'main.icons.background': '#b45309',
      'main.icons.foreground': '#fbbf24'
    }
  },
  {
    id: 'violet',
    name: 'Deep Violet',
    description: 'Rich purple and violet shades',
    preview: {
      primary: '#8b5cf6',
      secondary: '#a855f7',
      background: '#0f0a19'
    },
    settings: {
      'main.textcolor': '#f5f3ff',
      'sidebar.background': '#2e1065',
      'userbar.background.top': '#0f0a19',
      'userbar.background.bottom': '#050209',
      'userbar.avatar.color': '#8b5cf6',
      'main.icons.background': '#6d28d9',
      'main.icons.foreground': '#a78bfa'
    }
  },
  {
    id: 'mono',
    name: 'Monochrome',
    description: 'Classic black and white',
    preview: {
      primary: '#ffffff',
      secondary: '#a1a1aa',
      background: '#000000'
    },
    settings: {
      'main.textcolor': '#fafafa',
      'sidebar.background': '#18181b',
      'userbar.background.top': '#09090b',
      'userbar.background.bottom': '#000000',
      'userbar.avatar.color': '#71717a',
      'main.icons.background': '#27272a',
      'main.icons.foreground': '#d4d4d8'
    }
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    description: 'Calm cyan and teal waters',
    preview: {
      primary: '#06b6d4',
      secondary: '#14b8a6',
      background: '#042f2e'
    },
    settings: {
      'main.textcolor': '#ecfeff',
      'sidebar.background': '#134e4a',
      'userbar.background.top': '#042f2e',
      'userbar.background.bottom': '#021716',
      'userbar.avatar.color': '#06b6d4',
      'main.icons.background': '#0e7490',
      'main.icons.foreground': '#22d3ee'
    }
  },
  {
    id: 'crimson',
    name: 'Crimson Night',
    description: 'Bold red and dark tones',
    preview: {
      primary: '#dc2626',
      secondary: '#b91c1c',
      background: '#1a0a0a'
    },
    settings: {
      'main.textcolor': '#fef2f2',
      'sidebar.background': '#450a0a',
      'userbar.background.top': '#1a0a0a',
      'userbar.background.bottom': '#0a0505',
      'userbar.avatar.color': '#dc2626',
      'main.icons.background': '#991b1b',
      'main.icons.foreground': '#f87171'
    }
  }
]

interface ThemeCardProps {
  theme: PresetTheme
  onApply: (theme: PresetTheme) => void
  isActive: boolean
}

function ThemeCard({ theme, onApply, isActive }: ThemeCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-300 hover:scale-[1.02]',
        'bg-sidebar/30 border-sidebar-border/50 hover:border-primary/50 shadow-md',
        isActive && 'ring-2 ring-primary border-primary'
      )}
      onClick={() => onApply(theme)}
    >
      <CardContent className="p-4">
        <div className="flex gap-2 mb-3">
          <div
            className="flex-1 h-12 rounded-lg border border-border/20"
            style={{ backgroundColor: theme.preview.background }}
          >
            <div className="h-full flex items-center justify-center gap-2 px-2">
              <div
                className="w-6 h-6 rounded-full shadow-sm"
                style={{ backgroundColor: theme.preview.primary }}
              />
              <div
                className="w-4 h-4 rounded-full shadow-sm"
                style={{ backgroundColor: theme.preview.secondary }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium text-sm text-foreground">{theme.name}</h4>
            <p className="text-xs text-muted-foreground">{theme.description}</p>
          </div>
          {isActive && (
            <Badge variant="default" className="text-[10px]">
              Active
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function ModernThemesTab() {
  const [activeTheme, setActiveTheme] = useState<string | null>(null)

  const lang = useStore((state) => state.settings.behaviour.language)
  const setSetting = useStore((state) => state.setSetting)
  const saveSettings = useStore((state) => state.saveSettings)

  const applyTheme = (theme: PresetTheme) => {
    Object.entries(theme.settings).forEach(([key, value]) => {
      setSetting(`style.${key}`, value)
    })
    setActiveTheme(theme.id)
    saveSettings()
    notify(
      `${theme.name} ${data.get(lang, 'notifications.theme_applied') || 'theme applied!'}`,
      types.Success
    )
  }

  return (
    <div className="space-y-4 pb-4">
      <Card className="bg-sidebar/30 border-sidebar-border/50 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-foreground">
            {data.get(lang, 'settings.themes.presets') || 'Theme Presets'}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {data.get(lang, 'settings.themes.description') ||
              'Choose a preset theme or customize your own in the Style tab'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {presetThemes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                onApply={applyTheme}
                isActive={activeTheme === theme.id}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
                role="img"
                aria-label="Palette"
              >
                <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
                <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
                <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
                <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm text-foreground">
                {data.get(lang, 'settings.themes.custom_hint.title') || 'Create Custom Theme'}
              </h4>
              <p className="text-xs text-muted-foreground">
                {data.get(lang, 'settings.themes.custom_hint.description') ||
                  'Use the Style tab to customize individual colors and create your own unique theme'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
