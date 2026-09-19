# 🎨 Footer Configuration - Quick Reference Card

## 📋 All Available Variables

### Company Info (Always Shown)
```env
VITE_FOOTER_COMPANY_NAME=Your Company
VITE_FOOTER_TAGLINE=Your Tagline
VITE_FOOTER_DESCRIPTION=Your description...
```

### Contact (Hide All to Remove Column)
```env
VITE_FOOTER_EMAIL=your@email.com
VITE_FOOTER_PHONE=+1234567890
VITE_FOOTER_ADDRESS=Your Address
```

### Social Media (Hide All to Remove Column)
```env
VITE_FOOTER_GITHUB=https://github.com/you
VITE_FOOTER_LINKEDIN=https://linkedin.com/in/you
VITE_FOOTER_TWITTER=https://twitter.com/you
VITE_FOOTER_INSTAGRAM=https://instagram.com/you
VITE_FOOTER_YOUTUBE=https://youtube.com/@you
VITE_FOOTER_PORTFOLIO=https://yourportfolio.com
VITE_FOOTER_WEBSITE=https://yourwebsite.com
```

### Creator Credit (Hide to Remove)
```env
VITE_FOOTER_CREATOR_NAME=Your Name
VITE_FOOTER_CREATOR_ROLE=Your Role
VITE_FOOTER_CREATOR_PORTFOLIO=https://yourportfolio.com
```

### Legal Links (Hide All to Remove)
```env
VITE_FOOTER_PRIVACY_POLICY=https://yoursite.com/privacy
VITE_FOOTER_TERMS_OF_SERVICE=https://yoursite.com/terms
VITE_FOOTER_COOKIE_POLICY=https://yoursite.com/cookies
```

### Quick Links (Hide All to Remove Column)
```env
VITE_FOOTER_DOCUMENTATION=https://docs.yoursite.com
VITE_FOOTER_BLOG=https://blog.yoursite.com
VITE_FOOTER_SUPPORT=https://yoursite.com/support
VITE_FOOTER_CAREERS=https://yoursite.com/careers
```

### Other Settings
```env
VITE_FOOTER_COPYRIGHT_TEXT=Your custom copyright
VITE_FOOTER_SHOW_BUILT_WITH=true  # or false
```

---

## 🎯 Quick Recipes

### Recipe 1: Minimal Footer
```env
VITE_FOOTER_COMPANY_NAME=MyApp
VITE_FOOTER_TAGLINE=Simple App
VITE_FOOTER_DESCRIPTION=A simple app.
```

### Recipe 2: Contact Only
```env
VITE_FOOTER_COMPANY_NAME=MyApp
VITE_FOOTER_EMAIL=hello@myapp.com
VITE_FOOTER_PHONE=+1234567890
```

### Recipe 3: Social Only
```env
VITE_FOOTER_COMPANY_NAME=MyApp
VITE_FOOTER_GITHUB=https://github.com/myapp
VITE_FOOTER_LINKEDIN=https://linkedin.com/company/myapp
```

### Recipe 4: Full Professional
```env
VITE_FOOTER_COMPANY_NAME=MyApp
VITE_FOOTER_TAGLINE=Professional App
VITE_FOOTER_DESCRIPTION=Professional description.
VITE_FOOTER_EMAIL=hello@myapp.com
VITE_FOOTER_PHONE=+1234567890
VITE_FOOTER_ADDRESS=123 Main St, City
VITE_FOOTER_GITHUB=https://github.com/myapp
VITE_FOOTER_LINKEDIN=https://linkedin.com/company/myapp
VITE_FOOTER_CREATOR_NAME=John Doe
VITE_FOOTER_CREATOR_ROLE=Developer
VITE_FOOTER_DOCUMENTATION=https://docs.myapp.com
VITE_FOOTER_PRIVACY_POLICY=https://myapp.com/privacy
VITE_FOOTER_TERMS_OF_SERVICE=https://myapp.com/terms
```

### Recipe 5: Personal Portfolio
```env
VITE_FOOTER_COMPANY_NAME=John Doe
VITE_FOOTER_TAGLINE=Developer
VITE_FOOTER_DESCRIPTION=I build things.
VITE_FOOTER_EMAIL=john@example.com
VITE_FOOTER_GITHUB=https://github.com/johndoe
VITE_FOOTER_LINKEDIN=https://linkedin.com/in/johndoe
VITE_FOOTER_PORTFOLIO=https://johndoe.dev
VITE_FOOTER_CREATOR_NAME=John Doe
VITE_FOOTER_CREATOR_ROLE=Full Stack Developer
VITE_FOOTER_SHOW_BUILT_WITH=false
```

---

## 🚫 Hide Specific Elements

### Hide Phone Number
```env
VITE_FOOTER_PHONE=
```

### Hide Email
```env
VITE_FOOTER_EMAIL=
```

### Hide Address
```env
VITE_FOOTER_ADDRESS=
```

### Hide Specific Social Icon
```env
VITE_FOOTER_TWITTER=  # Twitter icon won't show
```

### Hide Creator Credit
```env
VITE_FOOTER_CREATOR_NAME=
```

### Hide "Built With" Message
```env
VITE_FOOTER_SHOW_BUILT_WITH=false
```

### Hide Legal Links
```env
VITE_FOOTER_PRIVACY_POLICY=
VITE_FOOTER_TERMS_OF_SERVICE=
VITE_FOOTER_COOKIE_POLICY=
```

---

## ✨ Special Keywords

Use these to explicitly hide fields:
- `none`
- `null`
- `undefined`
- `hide`
- `hidden`

Example:
```env
VITE_FOOTER_PHONE=none
VITE_FOOTER_ADDRESS=hide
```

---

## 🔄 After Changes

```bash
# Restart development server
npm run dev

# OR for production
npm run build
# Then deploy
```

---

## 📚 Documentation Links

- **Complete Guide**: `FOOTER_CONFIG_GUIDE.md`
- **Visual Examples**: `FOOTER_VISUAL_PREVIEW.md`
- **Summary**: `FOOTER_SUMMARY.md`
- **Sample File**: `.env.sample`
- **Template**: `.env.example`

---

## 🎨 Footer Layout

```
┌────────────────────────────────────────────────────────┐
│  Column 1  │  Column 2  │  Column 3  │  Column 4      │
│  Brand     │  Links     │  Contact   │  Social        │
├────────────────────────────────────────────────────────┤
│  Copyright  │  Legal Links                             │
├────────────────────────────────────────────────────────┤
│  Creator Credit (if provided)                          │
├────────────────────────────────────────────────────────┤
│  Built With (if enabled)                               │
└────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist

- [ ] Copy `.env.example` to `.env`
- [ ] Set company name
- [ ] Add tagline (optional)
- [ ] Add description (optional)
- [ ] Add contact info (or leave empty)
- [ ] Add social links (or leave empty)
- [ ] Add creator info (or leave empty)
- [ ] Add legal links (or leave empty)
- [ ] Add quick links (or leave empty)
- [ ] Customize copyright (or leave empty)
- [ ] Set show_built_with (true/false)
- [ ] Restart server
- [ ] Test in browser
- [ ] Deploy to production

---

## 💡 Pro Tips

1. **Start minimal**, add more as needed
2. **Test locally** before deploying
3. **Use real URLs** that work
4. **Keep it clean** - don't overcrowd
5. **Check mobile** view
6. **Match branding** colors/style
7. **Update regularly** as needed

---

## 🆘 Quick Troubleshooting

**Footer not updating?**
→ Restart server: `npm run dev`

**Links not working?**
→ Check URLs include `https://`

**Icons not showing?**
→ Make sure URL is provided (not empty)

**Column not hiding?**
→ Check ALL fields in that column are empty

---

**Configure. Restart. Enjoy!** 🎉
