<h1 align="center">Shikai</h1>
<div align="center">
    <a href="https://github.com/imxitiz/Shikai-webgreeter-lightdm">
        <img width="400" src="./assets/logo.png" alt="Shikai Logo">
    </a>
</div>
<p align="center">Modern LightDM WebKit2 Theme</p>

<h2 align="center">Contributing</h2>

<p align="center">
    Thank you for your interest in contributing! Every contribution, big or small, helps improve Shikai.
</p>

## Team Members

- **Owner & Maintainer**: [imxitiz](https://github.com/imxitiz) => <imxitiz@proton.me>

## Contributing Index

- [Adding new features][new-features]
- [Adding a translation][translation]
- [Other contributions][other]

## Adding New Features [[↑][index]]

Thank you for considering a code contribution!

Follow these steps to submit a pull request:

1. **Fork** this repository using the [Fork button][fork].
2. **Clone** your fork locally.
3. Create a new branch for your changes (`git checkout -b my-feature`).
4. Make your changes and additions.
5. Update the [CHANGELOG.md][changelog] file (follow existing structure; add under **Unreleased** if pre-release).
6. Bump the version in [package.json][package] and [CITATION.cff][citation] following [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
7. **(Optional)** If adding entirely new source files, consider including a brief comment header with the file's purpose and the standard GPLv3 notice (see existing files for examples).
8. Add yourself to [CONTRIBUTORS.md][contributors] (follow the existing format).
9. Commit, push to your fork, and open a **Pull Request** against the `master` branch.
10. Your PR will be reviewed promptly — feel free to ping if needed!

> [!TIP]  
> Run `bun run build` (or `npm run build`) locally to ensure the theme builds without errors before submitting.

## Adding a Translation [[↑][index]]

Translations are greatly appreciated!

The process is similar to feature contributions (steps 1–10 above), with these additional guidelines:

- All translation-related instructions are in [`src/lang/CONTRIBUTING.md`][lang-contributing].
- Add/edit JSON files in `src/lang/locales/`.
- Update `src/lang/credits.js` with your name and language if desired.
- Test your translation by changing the browser/language settings in the running theme.

## Other Contributions [[↑][index]]

You can help in many ways beyond code:

- Report bugs or request features via [Issues](https://github.com/imxitiz/Shikai-webgreeter-lightdm/issues).
- Share ideas in [Discussions > Ideas](https://github.com/imxitiz/Shikai-webgreeter-lightdm/discussions/categories/ideas).
- Improve documentation (README, this file, etc.).
- Help others in Discussions or Issues.
- Submit screenshots or wallpapers via pull request.

All forms of help are valued!

<h2 align="center">Current Maintainer</h2>
<div align="center">
    <a href="https://github.com/imxitiz">
        <img width="200" height="200" src="./assets/profile.png" alt="imxitiz">
    </a>
</div>
<h4 align="center">imxitiz — Maintainer since v2.0.0</h4>

<small>
    This project began as <a href="https://github.com/TheWisker/Shikai">TheWisker/Shikai</a>.  
    The v2.0.0 rewrite and ongoing maintenance are led by imxitiz.
</small>

[index]: #contributing-index
[new-features]: #adding-new-features-
[translation]: #adding-a-translation-
[other]: #other-contributions-
[fork]: https://github.com/imxitiz/Shikai-webgreeter-lightdm/fork
[changelog]: ./CHANGELOG.md
[package]: ./package.json
[citation]: ./CITATION.cff
[contributors]: ./CONTRIBUTORS.md
[lang-contributing]: ./src/lang/CONTRIBUTING.md
