# 🎨 Footer Configuration Guide

## Overview

The MockForge footer is fully configurable through environment variables. You can customize every aspect of the footer including company information, contact details, social media links, creator credits, and legal pages.

**Key Feature**: If you don't provide a value for a field, it will be completely hidden from the footer (no placeholders shown).

---

## 📝 Configuration File

All footer settings are in your `.env` file (frontend root directory).

Copy from `.env.example`:
```bash
cp .env.example .env
```

---

## 🔧 Available Configuration Options

### 1. Company/Brand Information

```env
# Company name displayed in footer
VITE_FOOTER_COMPANY_NAME=MockForge

# Tagline/subtitle (shown below company name)
VITE_FOOTER_TAGLINE=Professional Portfolio Mockup Studio

# Description (shown in the "About" column)
VITE_FOOTER_DESCRIPTION=Create stunning portfolio mockups with our advanced design editor. Professional device mockups, smart backgrounds, and instant export.
```

**Example Output:**
```
🎨 MockForge
Professional Portfolio Mockup Studio

Create stunning portfolio mockups with our advanced design editor...
```

---

### 2. Contact Information

All contact fields are optional. Leave empty to hide the entire "Contact" column.

```env
# Email address (clickable mailto link)
VITE_FOOTER_EMAIL=contact@mockforge.com

# Phone number (clickable tel link)
VITE_FOOTER_PHONE=+1234567890

# Physical address
VITE_FOOTER_ADDRESS=123 Design Street, Creative City, CA 94102
```

**Example Output:**
```
Contact
📧 contact@mockforge.com
📞 +1 (234) 567-890
📍 123 Design Street, Creative City, CA 94102
```

**To Hide**: Leave all contact fields empty:
```env
VITE_FOOTER_EMAIL=
VITE_FOOTER_PHONE=
VITE_FOOTER_ADDRESS=
```

---

### 3. Social Media Links

All social links are optional. Icons only appear for provided URLs.

```env
# GitHub profile/repository
VITE_FOOTER_GITHUB=https://github.com/yourusername

# LinkedIn profile
VITE_FOOTER_LINKEDIN=https://linkedin.com/in/yourprofile

# Twitter/X profile
VITE_FOOTER_TWITTER=https://twitter.com/yourhandle

# Instagram profile
VITE_FOOTER_INSTAGRAM=https://instagram.com/yourprofile

# YouTube channel
VITE_FOOTER_YOUTUBE=https://youtube.com/@yourchannel

# Portfolio website
VITE_FOOTER_PORTFOLIO=https://yourportfolio.com

# Company/personal website
VITE_FOOTER_WEBSITE=https://yourwebsite.com
```

**Example Output:**
```
Connect
[GitHub Icon] [LinkedIn Icon] [Twitter Icon] [Portfolio Icon]
```

**To Hide Specific Links**: Leave that field empty:
```env
VITE_FOOTER_GITHUB=https://github.com/yourusername
VITE_FOOTER_LINKEDIN=  # This won't show
VITE_FOOTER_TWITTER=https://twitter.com/yourhandle
```

---

### 4. Creator/Developer Credits

Show who built the application with optional link to their portfolio.

```env
# Creator's name
VITE_FOOTER_CREATOR_NAME=John Doe

# Creator's role/title
VITE_FOOTER_CREATOR_ROLE=Full Stack Developer

# Link to creator's portfolio (clickable name)
VITE_FOOTER_CREATOR_PORTFOLIO=https://johndoe.dev
```

**Example Output:**
```
Crafted with ❤️ by John Doe • Full Stack Developer
```

**With Portfolio Link**: Name becomes clickable link to portfolio

**To Hide**: Leave creator name empty:
```env
VITE_FOOTER_CREATOR_NAME=
```

---

### 5. Legal Pages

Links to legal documents. All optional.

```env
# Privacy Policy URL
VITE_FOOTER_PRIVACY_POLICY=https://mockforge.com/privacy

# Terms of Service URL
VITE_FOOTER_TERMS_OF_SERVICE=https://mockforge.com/terms

# Cookie Policy URL
VITE_FOOTER_COOKIE_POLICY=https://mockforge.com/cookies
```

**Example Output:**
```
Privacy Policy | Terms of Service | Cookie Policy
```

**To Hide**: Leave all legal fields empty

---

### 6. Additional Quick Links

Extra navigation links in the "Quick Links" column.

```env
# Blog URL
VITE_FOOTER_BLOG=https://blog.mockforge.com

# Careers/Jobs page
VITE_FOOTER_CAREERS=https://mockforge.com/careers

# Support/Help page
VITE_FOOTER_SUPPORT=https://mockforge.com/support

# Documentation page
VITE_FOOTER_DOCUMENTATION=https://docs.mockforge.com
```

**Example Output:**
```
Quick Links
• Documentation
• Blog
• Support
• Careers
```

**To Hide**: Leave all quick link fields empty

---

### 7. Copyright Text

Custom copyright message. If empty, defaults to "© 2024 Company Name. All rights reserved."

```env
# Custom copyright text
VITE_FOOTER_COPYRIGHT_TEXT=© 2024 MockForge Inc. Made with love in San Francisco.
```

**Example Output:**
```
© 2024 MockForge Inc. Made with love in San Francisco.
```

**Default (if empty)**:
```
© 2024 MockForge. All rights reserved.
```

---

### 8. "Built With" Message

Show technology stack message at the bottom.

```env
# Show "Built with React, TypeScript, Node.js & MongoDB"
VITE_FOOTER_SHOW_BUILT_WITH=true

# Hide the message
VITE_FOOTER_SHOW_BUILT_WITH=false
```

---

## 🎯 Complete Example Configurations

### Minimal Footer (Company Only)

```env
VITE_FOOTER_COMPANY_NAME=MockForge
VITE_FOOTER_TAGLINE=Professional Portfolio Mockup Studio
VITE_FOOTER_DESCRIPTION=Create stunning portfolio mockups with our advanced design editor.

# Everything else empty
VITE_FOOTER_EMAIL=
VITE_FOOTER_GITHUB=
VITE_FOOTER_CREATOR_NAME=
```

**Result**: Shows only company info and copyright

---

### Full Professional Footer

```env
# Company
VITE_FOOTER_COMPANY_NAME=MockForge
VITE_FOOTER_TAGLINE=Professional Portfolio Mockup Studio
VITE_FOOTER_DESCRIPTION=Create stunning portfolio mockups with our advanced design editor. Professional device mockups, smart backgrounds, and instant export.

# Contact
VITE_FOOTER_EMAIL=hello@mockforge.com
VITE_FOOTER_PHONE=+14155552671
VITE_FOOTER_ADDRESS=123 Design Street, San Francisco, CA 94102

# Social
VITE_FOOTER_GITHUB=https://github.com/mockforge
VITE_FOOTER_LINKEDIN=https://linkedin.com/company/mockforge
VITE_FOOTER_TWITTER=https://twitter.com/mockforge
VITE_FOOTER_PORTFOLIO=https://mockforge.com

# Creator
VITE_FOOTER_CREATOR_NAME=Muzammil Ahmed
VITE_FOOTER_CREATOR_ROLE=Full Stack Developer
VITE_FOOTER_CREATOR_PORTFOLIO=https://muzammil.dev

# Legal
VITE_FOOTER_PRIVACY_POLICY=https://mockforge.com/privacy
VITE_FOOTER_TERMS_OF_SERVICE=https://mockforge.com/terms

# Quick Links
VITE_FOOTER_DOCUMENTATION=https://docs.mockforge.com
VITE_FOOTER_BLOG=https://blog.mockforge.com
VITE_FOOTER_SUPPORT=https://mockforge.com/support

# Copyright
VITE_FOOTER_COPYRIGHT_TEXT=© 2024 MockForge Inc. All rights reserved.

# Built with message
VITE_FOOTER_SHOW_BUILT_WITH=true
```

**Result**: Full 4-column footer with all features

---

### Developer Portfolio Footer

```env
# Personal branding
VITE_FOOTER_COMPANY_NAME=John Doe
VITE_FOOTER_TAGLINE=Full Stack Developer & Designer
VITE_FOOTER_DESCRIPTION=Building beautiful web applications with modern technologies.

# Contact
VITE_FOOTER_EMAIL=john@johndoe.dev
VITE_FOOTER_PHONE=+1234567890

# Social
VITE_FOOTER_GITHUB=https://github.com/johndoe
VITE_FOOTER_LINKEDIN=https://linkedin.com/in/johndoe
VITE_FOOTER_PORTFOLIO=https://johndoe.dev

# Creator (same as company for personal site)
VITE_FOOTER_CREATOR_NAME=John Doe
VITE_FOOTER_CREATOR_ROLE=Full Stack Developer

# Copyright
VITE_FOOTER_COPYRIGHT_TEXT=© 2024 John Doe. Built with React & Node.js.

VITE_FOOTER_SHOW_BUILT_WITH=false
```

---

## 🚫 Hiding Specific Elements

### Hide Entire Column

**Hide Contact Column**: Leave all contact fields empty
```env
VITE_FOOTER_EMAIL=
VITE_FOOTER_PHONE=
VITE_FOOTER_ADDRESS=
```

**Hide Quick Links Column**: Leave all quick link fields empty
```env
VITE_FOOTER_BLOG=
VITE_FOOTER_CAREERS=
VITE_FOOTER_SUPPORT=
VITE_FOOTER_DOCUMENTATION=
```

**Hide Social Icons**: Leave all social fields empty
```env
VITE_FOOTER_GITHUB=
VITE_FOOTER_LINKEDIN=
VITE_FOOTER_TWITTER=
VITE_FOOTER_INSTAGRAM=
VITE_FOOTER_YOUTUBE=
VITE_FOOTER_PORTFOLIO=
VITE_FOOTER_WEBSITE=
```

**Hide Creator Credit**: Leave creator name empty
```env
VITE_FOOTER_CREATOR_NAME=
```

**Hide Legal Links**: Leave all legal fields empty
```env
VITE_FOOTER_PRIVACY_POLICY=
VITE_FOOTER_TERMS_OF_SERVICE=
VITE_FOOTER_COOKIE_POLICY=
```

---

## 🔑 Special Keywords

You can use these keywords to explicitly hide a field:

- `none`
- `null`
- `undefined`
- `hide`
- `hidden`

**Example:**
```env
VITE_FOOTER_PHONE=none
VITE_FOOTER_ADDRESS=hide
```

These will be treated as empty and the field won't show.

---

## 🎨 Footer Layout

The footer has 4 columns (responsive):

### Desktop (4 columns)
```
┌─────────────────┬──────────────┬──────────────┬──────────────┐
│   Brand Info    │ Quick Links  │   Contact    │   Connect    │
│                 │              │              │              │
│ Logo + Name     │ • Docs       │ 📧 Email     │ [GitHub]     │
│ Tagline         │ • Blog       │ 📞 Phone     │ [LinkedIn]   │
│ Description     │ • Support    │ 📍 Address   │ [Twitter]    │
│                 │ • Careers    │              │ [Portfolio]  │
└─────────────────┴──────────────┴──────────────┴──────────────┘
┌────────────────────────────────────────────────────────────────┐
│  © 2024 Company Name. All rights reserved.                    │
│  Privacy Policy | Terms of Service | Cookie Policy            │
├────────────────────────────────────────────────────────────────┤
│  Crafted with ❤️ by Creator Name • Role                       │
├────────────────────────────────────────────────────────────────┤
│  Built with React, TypeScript, Node.js & MongoDB              │
└────────────────────────────────────────────────────────────────┘
```

### Tablet (2 columns)
```
┌──────────────────────────┬──────────────────────────┐
│      Brand Info          │      Quick Links         │
│                          │                          │
│      Contact             │      Connect             │
└──────────────────────────┴──────────────────────────┘
```

### Mobile (1 column)
```
┌──────────────────────────┐
│      Brand Info          │
├──────────────────────────┤
│      Quick Links         │
├──────────────────────────┤
│      Contact             │
├──────────────────────────┤
│      Connect             │
└──────────────────────────┘
```

---

## 🔄 After Making Changes

After updating `.env`, restart your development server:

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

For production, rebuild and redeploy:

```bash
npm run build
# Then deploy to Vercel
```

---

## 📋 Checklist

- [ ] Copy `.env.example` to `.env`
- [ ] Set company name and description
- [ ] Add contact info (or leave empty to hide)
- [ ] Add social media links (or leave empty to hide)
- [ ] Add creator credits (or leave empty to hide)
- [ ] Add legal page links (or leave empty to hide)
- [ ] Add quick links (or leave empty to hide)
- [ ] Customize copyright text (or leave empty for default)
- [ ] Restart development server
- [ ] Check footer in browser
- [ ] Deploy to production

---

## 💡 Tips

1. **Start Minimal**: Begin with just company info, then add more as needed
2. **Test Locally**: Always test footer changes locally before deploying
3. **Use Real URLs**: Make sure all links point to real, working pages
4. **Keep It Clean**: Don't overcrowd the footer with too many links
5. **Mobile Friendly**: Check how footer looks on mobile devices
6. **Consistent Branding**: Use colors and style that match your brand

---

## 🆘 Troubleshooting

### Footer not showing changes?
- Restart development server
- Clear browser cache
- Check `.env` file is in correct location (frontend root)

### Links not working?
- Verify URLs are complete (include https://)
- Check for typos in URLs
- Test links in browser directly

### Icons not showing?
- Make sure URL is provided (not empty)
- Check URL format is correct
- Verify social media platform is supported

### Column not appearing?
- All fields in that column must be empty to hide it
- Check for accidental spaces in empty values
- Restart server after changes

---

## 📞 Support

Need help with footer configuration?

1. Check this documentation
2. Review `.env.example` for all available options
3. Check browser console for errors
4. Review footer component code: `src/components/Footer.tsx`

---

**Your footer is now fully customizable!** 🎉
