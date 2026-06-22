---
name: WordPress Block Theme Structure
description: How to build a custom WordPress FSE (Full Site Editing) block theme from scratch — file structure, required files, and patterns used
type: reference
originSessionId: 1ba9659b-9723-4649-94d3-5e901a6e8701
---
## What This Is
A WordPress Full Site Editing (FSE) / Block Theme. Uses `theme.json` for all design tokens, no classic PHP templates needed beyond `functions.php`.

## Required File Structure
```
my-theme/
├── style.css          ← Required. Contains theme metadata in header comment
├── functions.php      ← Enqueues styles, registers block patterns, theme support
├── theme.json         ← All design tokens: colors, typography, spacing, layout
├── parts/
│   ├── header.html    ← Reusable header block template part
│   └── footer.html    ← Reusable footer block template part
└── templates/
    ├── index.html     ← Required fallback template
    ├── home.html      ← Blog/home page
    ├── page.html      ← Default page
    ├── single.html    ← Single post
    ├── 404.html       ← 404 error page
    └── page-{slug}.html ← Custom template per page slug (e.g. page-contact.html)
```

## style.css Header (Required)
```css
/*
Theme Name: My Theme Name
Theme URI: https://example.com
Description: Short description
Version: 1.0.0
Requires at least: 6.0
Tested up to: 6.5
Requires PHP: 8.0
License: GPL-2.0-or-later
Text Domain: my-theme
*/
```

## theme.json Key Sections
- `settings.color.palette` — Define named colors with slug/color/name
- `settings.typography.fontFamilies` — Register font families
- `settings.typography.fontSizes` — Named size scale
- `settings.spacing.spacingSizes` — Named spacing scale
- `settings.layout.contentSize` / `wideSize` — Max widths
- `styles` — Global defaults for color, typography, elements (heading, link, button), and blocks

## functions.php Essentials
```php
add_action('after_setup_theme', function() {
    add_theme_support('wp-block-styles');
    add_theme_support('editor-styles');
});

add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style('theme-style', get_stylesheet_uri());
});
```

## How to Install on WordPress
1. Zip the theme folder (the folder itself, not just its contents)
2. WordPress Admin → Appearance → Themes → Add New → Upload Theme
3. Upload the .zip → Install → Activate

## Template Parts Usage (in .html templates)
```html
<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->
```

## Notes
- All layout is done with Gutenberg blocks inside .html files (no PHP templating)
- Colors referenced as: `var(--wp--preset--color--{slug})`
- Fonts referenced as: `var(--wp--preset--font-family--{slug})`
- Font sizes: `var(--wp--preset--font-size--{slug})`
- This pattern was built and tested in the happy-paws project (deleted 2026-05-03)
