# CI / CD & Local Development

## Goals ✅

- One-time install; subsequent builds should just update the live folder.
- Super-fast CI builds with caching and small deploy step.
- Real-time local development: edits feel immediate via watch + rsync.
- Optional deploy via GitHub Actions over SSH or using a self-hosted runner on the greeter host.

## One-time setup (dev & prod separation)

Important: `shikai` (production) and `shikai-live` (development) are separate themes so you can debug without changing the production theme.

1. Prepare the development folder (runs once):

   ```bash
   sudo ./scripts/symlink.sh
   ```

   This creates `/usr/share/web-greeter/themes/shikai-live` and grants your user write access (via ACL) so you can sync without using `sudo` repeatedly.

2. (Optional) If you want to use the production install (no dev changes), install once:

   ```bash
   sudo ./scripts/install.sh
   ```

3. To switch which theme the greeter loads (dev <-> prod), use the helper:

   ```bash
   sudo ./scripts/theme-switch.sh shikai-live    # use live dev theme
   sudo ./scripts/theme-switch.sh shikai         # use production theme
   ```

   When working with `shikai-live`, you can open the greeter in debug mode to see continuous output:

   ```bash
   sudo -u lightdm sea-greeter -d
   ```

   Or, run the full interactive dev flow (sets theme to `shikai-live`, runs watcher, and reverts to `shikai` on exit):

   ```bash
   # start dev flow (no greeter auto-launch)
   bun run dev-ci

   # start dev flow and auto-launch sea-greeter in debug mode (if you want it started automatically)
   bun run dev-ci:launch
   ```

   Note: many greeters read configuration only at startup — if a greeter process is already running it may not pick up the theme change until restarted. The `--launch-greeter` mode will try to start `sea-greeter -d` as the `lightdm` user for testing.

   This approach avoids re-installing the production theme after every edit.

## Fast local development (instant feel)

- Start a watch + auto-sync that builds on change and rsyncs to the live folder:

  ```bash
  sudo ./scripts/dev-sync.sh
  ```

  Note: either run with sudo or make `/usr/share/web-greeter/themes/shikai-live` writable for your user.

- Or run the single helper which will prepare the dev folder, switch the greeter to `shikai-live`, run the watch+sync and **revert the greeter back to `shikai` when you stop it**:

  ```bash
  # using bun (recommended)
  bun run dev-ci

  # or using npm/yarn
  npm run dev-ci
  yarn dev-ci
  ```

- The watcher will build on changes and push incremental updates to the live folder; your greeter will pick them up immediately.

## CI: GitHub Actions (already added)

- The workflow `/.github/workflows/ci.yml` builds on push and PR and uploads `dist` as an artifact.
- Optional deploy job will rsync files to a remote host if you set these repo secrets:
  - `SSH_HOST`
  - `SSH_USER`
  - `SSH_KEY` (private key)

- For the fastest possible deploys, run a self-hosted GitHub Actions runner on the greeter host so the job performs local file operations only.

## Notes & tips 💡

- `rsync` is used to perform fast, incremental updates. For atomic releases we copy to a temp folder and swap symlinks (future enhancement).
- If you want an even shorter feedback loop, set up a self-hosted runner or an HTTP webhook to trigger a pull on the greeter host.
- I can add a small systemd service or optional `inotify` script on the greeter host to auto-apply deployments server-side.

---
If you want, I can now:

- Add an atomic `releases/` flow (copy to `releases/<sha>/` and update `current` symlink),
- Add the optional systemd `shikai-update.service` and example unit,
- Or push the README additions linking to this doc.
