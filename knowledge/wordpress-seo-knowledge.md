# WordPress SEO Knowledge Base

## Key Resource
- **Ferdy Korpershoek** (YouTube: @ferdycom) — 1.24M subscribers, 595 videos
  - Channel: Ferdy.com | focuses on WordPress, Elementor, Elementor Pro, Divi, ecommerce, online business
  - Teaches how to build WordPress websites from scratch
  - Covers: Elementor tutorials, email marketing (ConvertKit, Mailchimp), WooCommerce, online business
  - Style: step-by-step beginner-friendly tutorials, very thorough walkthroughs

---

## Essential SEO Plugins

### Rank Math (Recommended)
- Free tier covers most needs: schema, redirects, 404 monitor, keyword tracking
- Set focus keyword per post, target score 80+
- Enable "Content AI" for keyword suggestions
- Better than Yoast for free features

### Yoast SEO
- Industry standard, reliable
- Use "SEO Analysis" and "Readability Analysis" tabs
- Green lights = good, but don't chase all green — focus on the important ones
- Premium needed for redirect manager and internal linking suggestions

### Rank Math vs Yoast
- New sites: use Rank Math (more features free)
- Existing Yoast sites: no need to switch unless specific reason

---

## Site Setup (Do First)

### Permalinks
- Go to Settings > Permalinks
- Set to "Post name" — /%postname%/
- Never use default "?p=123" — not SEO friendly

### Reading Settings
- Settings > Reading
- Make sure "Discourage search engines" is UNCHECKED on live site
- Common mistake after migration

### XML Sitemap
- Enable in Rank Math or Yoast
- Submit to Google Search Console: yourdomain.com/sitemap_index.xml
- Submit to Bing Webmaster Tools too

### Robots.txt
- Access via Rank Math > General Settings > Edit robots.txt
- Block: /wp-admin/, /wp-includes/, duplicate pages
- Basic robots.txt:
  ```
  User-agent: *
  Disallow: /wp-admin/
  Allow: /wp-admin/admin-ajax.php
  Sitemap: https://yourdomain.com/sitemap_index.xml
  ```

---

## On-Page SEO Per Post/Page

### Title Tag
- Include primary keyword near the beginning
- Max 60 characters
- Format: Primary Keyword - Brand Name
- Example: "Toyota Camry Review 2024 - AutoPhilippines"

### Meta Description
- Max 160 characters
- Include primary keyword naturally
- Write for clicks, not just keywords
- Add a call to action: "Learn more", "Get the guide"

### URL / Slug
- Short, keyword-focused
- No dates, no stop words (a, the, is)
- Good: /toyota-camry-review/
- Bad: /2024/03/my-review-of-the-new-toyota-camry-2024/

### H1 Tag
- Only ONE H1 per page
- Should contain primary keyword
- WordPress page title = H1 automatically

### Header Structure
- H1: Page title (primary keyword)
- H2: Main sections
- H3: Sub-sections under H2
- Don't skip levels (H1 > H3 without H2)

### Image Optimization
- Filename: toyota-camry-2024.jpg (not IMG_0032.jpg)
- Alt text: describe the image with keyword if natural
- Compress before upload: use Smush or ShortPixel plugin
- Use WebP format when possible

### Internal Linking
- Link to 3-5 related posts per article
- Use descriptive anchor text (not "click here")
- Link from high-authority pages to new pages

---

## Technical SEO

### Site Speed (Core Web Vitals)
- Target: LCP under 2.5s, CLS under 0.1, FID under 100ms
- Use WP Rocket or LiteSpeed Cache for caching
- Enable lazy loading for images
- Use a CDN (Cloudflare free tier works)
- Check score: PageSpeed Insights

### Caching Plugins
- WP Rocket — best but paid (~$59/yr)
- LiteSpeed Cache — free, best for LiteSpeed servers
- W3 Total Cache — free, complex setup
- WP Super Cache — free, simple

### Image Compression
- ShortPixel — best compression quality
- Smush — popular, good free tier
- Imagify — easy to use

### SSL / HTTPS
- Must have HTTPS for ranking
- Force HTTPS in WordPress settings
- Fix mixed content issues (HTTP images on HTTPS site)

### Mobile Optimization
- Use mobile-responsive theme
- Test: Google Mobile-Friendly Test
- Avoid font sizes under 16px
- Buttons minimum 44x44px tap target

---

## Schema Markup

### What It Is
- Structured data that tells Google what your content is about
- Helps get rich snippets (stars, FAQs, prices in search results)

### Types to Use
- **Article** — blog posts
- **LocalBusiness** — local businesses
- **Product** — ecommerce
- **FAQ** — FAQ sections (adds expandable Q&A in search results)
- **Review** — product/service reviews
- **HowTo** — step-by-step guides

### How to Add (Rank Math)
- Edit post > Rank Math tab > Schema
- Select schema type, fill in fields
- Validate: Google Rich Results Test

### FAQ Schema Example
- Add FAQ block in Gutenberg editor
- Rank Math auto-detects and adds FAQ schema
- Shows expanded Q&A directly in Google search results — increases CTR

---

## Common WordPress SEO Mistakes

1. **Duplicate content from categories/tags**
   - Fix: noindex category/tag pages in Rank Math or Yoast
   - Or: canonicalize them to the main post

2. **WWW vs non-WWW inconsistency**
   - Pick one and redirect the other
   - Set in Google Search Console

3. **Slow page speed**
   - Most common issue on WordPress
   - Use caching + image compression + CDN

4. **No internal linking**
   - Link related posts together
   - Helps Google understand site structure

5. **Thin content**
   - Pages with less than 300 words rarely rank
   - Aim for comprehensive coverage of the topic

6. **Missing alt text on images**
   - Every image needs descriptive alt text
   - Use Yoast/Rank Math to find posts with missing alt text

7. **Not submitting sitemap to GSC**
   - Always submit sitemap after launch
   - Speeds up indexing

8. **Using page builders that kill speed**
   - Elementor/Divi heavy on JS/CSS
   - Use lightweight theme + Gutenberg when possible
   - If using Elementor: enable performance settings, use Elementor Hosting or optimize aggressively

---

## WordPress + WooCommerce SEO

### Product Pages
- Unique product descriptions (no manufacturer copy-paste)
- Add primary keyword in product title and first paragraph
- Use product schema (Rank Math auto-adds for WooCommerce)

### Category Pages
- Add 150-300 word description to each category
- Target category-level keywords (e.g., "men's running shoes Philippines")

### Breadcrumbs
- Enable breadcrumbs in Rank Math/Yoast
- Helps Google understand site hierarchy
- Shows in search results for rich snippets

### Reviews
- Enable product reviews in WooCommerce
- Generates review schema automatically
- More reviews = better CTR in search results

---

## Recommended WordPress SEO Stack

| Need | Plugin |
|------|--------|
| SEO (on-page) | Rank Math (free) |
| Caching | WP Rocket or LiteSpeed Cache |
| Image compression | ShortPixel |
| CDN | Cloudflare (free) |
| Analytics | Google Site Kit (connects GA4 + GSC) |
| Redirects | Rank Math (free) or Redirection plugin |
| Broken links | Broken Link Checker |

---

## Google Search Console Setup

1. Add property: Search Console > Add property > Domain
2. Verify via DNS TXT record (recommended) or HTML file
3. Submit sitemap: Sitemaps > Add sitemap > sitemap_index.xml
4. Monitor: Coverage errors, Core Web Vitals, Search Performance
5. Use "URL Inspection" to request indexing of new posts

---

## Quick Win Checklist for New WordPress Site

- [ ] Set permalink to /%postname%/
- [ ] Install Rank Math, configure basics
- [ ] Submit sitemap to Google Search Console
- [ ] Enable HTTPS, force redirect
- [ ] Install caching plugin
- [ ] Compress all images
- [ ] Connect Cloudflare CDN
- [ ] Add FAQ schema to key pages
- [ ] Internal link all new posts to 3+ existing posts
- [ ] Set up Google Analytics 4
