import { Label } from '@/js/Components/ui/label'
import { Switch } from '@/js/Components/ui/switch'
import { Button } from '@/js/Components/ui/button'
import { Input } from '@/js/Components/ui/input'
import { Separator } from '@/js/Components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/js/Components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/js/Components/ui/card'
import { data, names as languageNames } from '@/lang'
import { types, notify } from '@/js/Greeter/Notifications'
import useStore from '@/js/State/store'

interface SettingRowProps {
  label: string
  description?: string
  children: React.ReactNode
}

function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="space-y-0.5 flex-1 pr-4">
        <Label className="text-sm font-medium text-foreground">{label}</Label>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  )
}

interface SettingSectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

function SettingSection({ title, description, children }: SettingSectionProps) {
  return (
    <Card className="mb-4 bg-sidebar/30 border-sidebar-border/50 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-foreground">{title}</CardTitle>
        {description && <CardDescription className="text-muted-foreground">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-1">{children}</CardContent>
    </Card>
  )
}

export default function ModernBehaviourTab() {
  const behaviour = useStore((state) => state.settings.behaviour)
  const lang = behaviour.language || 'english'
  const toggleSetting = useStore((state) => state.toggleSetting)
  const setSetting = useStore((state) => state.setSetting)
  const saveSettings = useStore((state) => state.saveSettings)

  const toggle = (key: string) => {
    toggleSetting(`behaviour.${key}`)
    saveSettings()
  }

  const set = (key: string, value: unknown) => {
    setSetting(`behaviour.${key}`, value)
    saveSettings()
  }

  const handleClearStorage = () => {
    localStorage.clear()
    notify(data.get(lang, 'notifications.delete_local') || 'Local storage cleared!', types.Success)
  }

  const evokerValue = String(behaviour.evoker) === 'hover' ? 'hover' : 'show'

  return (
    <div className="space-y-4 pb-4">
      <SettingSection
        title={data.get(lang, 'settings.behaviour.sections.general.name') || 'General'}
        description={data.get(lang, 'settings.behaviour.sections.general.description') || 'Configure visibility of UI elements'}
      >
        <SettingRow
          label={data.get(lang, 'settings.behaviour.sections.general.options.logo') || 'Show Logo'}
        >
          <Switch checked={behaviour.logo ?? true} onCheckedChange={() => toggle('logo')} />
        </SettingRow>
        <Separator className="my-1 bg-border/30" />
        <SettingRow
          label={data.get(lang, 'settings.behaviour.sections.general.options.hostname') || 'Show Hostname'}
        >
          <Switch checked={behaviour.hostname ?? true} onCheckedChange={() => toggle('hostname')} />
        </SettingRow>
        <Separator className="my-1 bg-border/30" />
        <SettingRow
          label={data.get(lang, 'settings.behaviour.sections.general.options.avatar') || 'Show Avatar'}
        >
          <Switch checked={behaviour.avatar ?? true} onCheckedChange={() => toggle('avatar')} />
        </SettingRow>
        <Separator className="my-1 bg-border/30" />
        <SettingRow
          label={data.get(lang, 'settings.behaviour.sections.general.options.dark_mode') || 'Dark Mode'}
        >
          <Switch checked={behaviour.dark_mode ?? true} onCheckedChange={() => toggle('dark_mode')} />
        </SettingRow>
        <Separator className="my-1 bg-border/30" />
        <SettingRow
          label={data.get(lang, 'settings.behaviour.sections.general.options.username') || 'Show Username'}
        >
          <Switch checked={behaviour.user ?? true} onCheckedChange={() => toggle('user')} />
        </SettingRow>
        <Separator className="my-1 bg-border/30" />
        <SettingRow
          label={data.get(lang, 'settings.behaviour.sections.general.options.session') || 'Show Session'}
        >
          <Switch checked={behaviour.session ?? true} onCheckedChange={() => toggle('session')} />
        </SettingRow>
      </SettingSection>

      <SettingSection
        title={data.get(lang, 'settings.behaviour.sections.lang.name') || 'Language'}
        description={data.get(lang, 'settings.behaviour.sections.lang.description') || 'Select your preferred language'}
      >
        <Select value={behaviour.language || 'english'} onValueChange={(v) => set('language', v)}>
          <SelectTrigger className="w-full h-11 bg-input/50 border-border/50 shadow-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="no-wall-change">
            {languageNames.map((name) => (
              <SelectItem key={name} value={name}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingSection>

      <SettingSection
        title={data.get(lang, 'settings.behaviour.sections.commands.name') || 'Commands'}
        description={data.get(lang, 'settings.behaviour.sections.commands.description') || 'Enable or disable power commands'}
      >
        <SettingRow
          label={data.get(lang, 'settings.behaviour.sections.commands.options.shutdown') || 'Shutdown'}
        >
          <Switch
            checked={behaviour.commands?.shutdown ?? true}
            onCheckedChange={() => toggle('commands.shutdown')}
          />
        </SettingRow>
        <Separator className="my-1 bg-border/30" />
        <SettingRow
          label={data.get(lang, 'settings.behaviour.sections.commands.options.reboot') || 'Reboot'}
        >
          <Switch
            checked={behaviour.commands?.reboot ?? true}
            onCheckedChange={() => toggle('commands.reboot')}
          />
        </SettingRow>
        <Separator className="my-1 bg-border/30" />
        <SettingRow
          label={data.get(lang, 'settings.behaviour.sections.commands.options.sleep') || 'Sleep'}
        >
          <Switch
            checked={behaviour.commands?.sleep ?? true}
            onCheckedChange={() => toggle('commands.sleep')}
          />
        </SettingRow>
        <Separator className="my-1 bg-border/30" />
        <SettingRow
          label={data.get(lang, 'settings.behaviour.sections.commands.options.hibernate') || 'Hibernate'}
        >
          <Switch
            checked={behaviour.commands?.hibernate ?? true}
            onCheckedChange={() => toggle('commands.hibernate')}
          />
        </SettingRow>
      </SettingSection>

      <SettingSection
        title={data.get(lang, 'settings.behaviour.sections.time.name') || 'Time & Date'}
        description={data.get(lang, 'settings.behaviour.sections.time.description') || 'Configure clock and date display'}
      >
        <SettingRow
          label={data.get(lang, 'settings.behaviour.sections.time.options.clock.enabled') || 'Show Clock'}
        >
          <Switch
            checked={behaviour.clock?.enabled ?? true}
            onCheckedChange={() => toggle('clock.enabled')}
          />
        </SettingRow>
        {behaviour.clock?.enabled && (
          <div className="py-2">
            <Label className="text-xs text-muted-foreground mb-2 block">
              {data.get(lang, 'settings.behaviour.sections.time.options.clock.format') || 'Clock Format'}
            </Label>
            <Input
              value={behaviour.clock?.format || '%H:%K:%S'}
              onChange={(e) => set('clock.format', e.target.value)}
              className="h-10 bg-input/50 border-border/50 shadow-sm"
              placeholder="%H:%K:%S"
            />
          </div>
        )}
        <Separator className="my-1 bg-border/30" />
        <SettingRow
          label={data.get(lang, 'settings.behaviour.sections.time.options.date.enabled') || 'Show Date'}
        >
          <Switch
            checked={behaviour.date?.enabled ?? true}
            onCheckedChange={() => toggle('date.enabled')}
          />
        </SettingRow>
        {behaviour.date?.enabled && (
          <div className="py-2">
            <Label className="text-xs text-muted-foreground mb-2 block">
              {data.get(lang, 'settings.behaviour.sections.time.options.date.format') || 'Date Format'}
            </Label>
            <Input
              value={behaviour.date?.format || '%B %D, %Y'}
              onChange={(e) => set('date.format', e.target.value)}
              className="h-10 bg-input/50 border-border/50 shadow-sm"
              placeholder="%B %D, %Y"
            />
          </div>
        )}
      </SettingSection>

      <SettingSection
        title={data.get(lang, 'settings.behaviour.sections.misc.name') || 'Miscellaneous'}
        description={data.get(lang, 'settings.behaviour.sections.misc.description') || 'Other settings'}
      >
        <SettingRow
          label={data.get(lang, 'settings.behaviour.sections.misc.options.idle.enabled') || 'Enable Idle'}
        >
          <Switch
            checked={behaviour.idle?.enabled ?? true}
            onCheckedChange={() => toggle('idle.enabled')}
          />
        </SettingRow>
        {behaviour.idle?.enabled && (
          <div className="py-2">
            <Label className="text-xs text-muted-foreground mb-2 block">
              {data.get(lang, 'settings.behaviour.sections.misc.options.idle.value') || 'Idle Timeout (ms)'}
            </Label>
            <Input
              type="number"
              value={behaviour.idle?.timeout || 60}
              onChange={(e) => set('idle.timeout', Number(e.target.value))}
              className="h-10 bg-input/50 border-border/50 shadow-sm"
              placeholder="60"
            />
          </div>
        )}
        <Separator className="my-1 bg-border/30" />
        <SettingRow
          label={data.get(lang, 'settings.behaviour.sections.misc.options.evoker') || 'Settings Button'}
          description={data.get(lang, 'settings.behaviour.sections.misc.evoker_description') || 'Show, show on hover, or hide the settings button'}
        >
          <Select value={evokerValue} onValueChange={(v) => set('evoker', v)}>
            <SelectTrigger
              className="w-32 h-10 bg-input/50 border-border/50 shadow-sm"
              aria-label={data.get(lang, 'settings.behaviour.sections.misc.evoker_description') || 'Show, show on hover, or hide the settings button'}
              title={data.get(lang, 'settings.behaviour.sections.misc.evoker_description') || 'Show, show on hover, or hide the settings button'}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="no-wall-change">
              <SelectItem value="show">{data.get(lang, 'settings.behaviour.sections.misc.evoker_values.show') || 'Always'}</SelectItem>
              <SelectItem value="hover">{data.get(lang, 'settings.behaviour.sections.misc.evoker_values.hover') || 'On Hover'}</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>
      </SettingSection>

      <Card className="mb-4 bg-destructive/10 border-destructive/30 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-destructive">
            {data.get(lang, 'settings.danger.title') || 'Danger Zone'}
          </CardTitle>
          <CardDescription className="text-destructive/80">
            {data.get(lang, 'settings.danger.description') || 'These actions are irreversible'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleClearStorage} className="w-full shadow-md">
            {data.get(lang, 'buttons.delete_local') || 'Clear Local Storage'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
