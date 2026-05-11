# 📝 Eternal Echoes - Revised Implementation Plan

## ✅ Completed Changes (April 2026)

### 1. Theme System Implementation
- **Default Theme**: Light (paper white aesthetic)
- **Dark Mode**: Available via toggle
- **Implementation**: `theme.ts` store, CSS variables, all components theme-aware

### 2. Profile Dropdown Menu
- Location: Top navigation bar with user info, profile link, theme toggle, logout

### 3. Recipient Letter Redesign
- Title/heart in header, "Dear [Name]" drop cap, proper content flow

### 4. Ghost Writer Modal
- Full-screen modal with 5 tone options

### 5. Email Notifications (Resend)
- Working email service with lazy initialization
- HTML email templates with unlock links

### 6. Unlock Page Animations
- CapsuleContainer → ThreeEnvelope → Letter unfolding sequence

---

## 📋 Phase 1: Immediate UI/UX Fixes (Current)

### Compose Page Layout Issues
- [ ] **Stepper spacing** - Increase gap between stepper and card (gap-8)
- [ ] **Vertical centering** - Card centered in viewport, not top-aligned
- [ ] **Footer visibility** - "Continue" button visible without scrolling
- [ ] **Card padding** - Increase internal spacing

### Unlock Page Layout Issues
- [ ] **Envelope centering** - ThreeEnvelope not properly centered vertically
- [ ] **Viewport fit** - Content extends below fold, requires scroll to see footer
- [ ] **Container sizing** - Use min-h-screen with proper flex constraints

### Dashboard Card Consistency
- [ ] **DELIVERED cards** - Add action buttons (View + Revoke) for consistent layout
- [ ] **Card height** - Equal height cards regardless of status
- [ ] **Share button** - Add hover background feedback (hover:bg-red-50)

### QR Modal Fixes
- [ ] **Download button** - Implement actual download functionality
- [ ] **Hover states** - Better visual feedback on all buttons

---

## 📋 Phase 2: Advanced Features & Backend (Next Sprint)

### Auto-Save Draft to Database
- [ ] Add [updateCapsule](cci:1://file:///home/fayedbleh13/code-projects/eternal-echoes/apps/server/src/schema/resolvers/capsule.resolver.ts:90:4-99:5) and `updateLetter` GraphQL mutations
- [ ] Create `useDraftAutosave` hook with 3-second debounce
- [ ] URL query param `?draftId=xxx` for resuming drafts
- [ ] "Saving... / Saved" indicator in compose UI

### Delivery Scheduling (Bull + Redis)
- [ ] Install `bull` and `ioredis` packages
- [ ] Create `delivery.queue.ts` with Bull configuration
- [ ] Job processor for delayed email sending
- [ ] Modify [sendCapsule](cci:1://file:///home/fayedbleh13/code-projects/eternal-echoes/apps/server/src/schema/resolvers/capsule.resolver.ts:53:4-89:5) to queue delayed jobs
- [ ] Add Redis config to [.env.example](cci:7://file:///home/fayedbleh13/code-projects/eternal-echoes/.env.example:0:0-0:0)

### Error Boundaries & Polish
- [ ] Add error boundaries for crash handling
- [ ] Loading states throughout
- [ ] Toast notifications for user actions

---

## 📋 Phase 3: PWA & Mobile Support (Future)

### Progressive Web App
- [ ] Install `vite-plugin-pwa`
- [ ] Create `manifest.json` with app metadata
- [ ] Service worker for offline support
- [ ] App icons (multiple sizes)
- [ ] "Add to Home Screen" prompt

### Mobile Responsiveness
- [ ] Touch-friendly tap targets (min 44px)
- [ ] Mobile-optimized navigation (bottom sheet menu)
- [ ] Responsive typography scaling
- [ ] Touch gestures for letter opening
- [ ] Reduced motion support

### Offline Support
- [ ] Cache static assets
- [ ] Offline fallback page
- [ ] Background sync for draft auto-save
- [ ] Queue capsules for sending when online

---

## 🐛 Known Issues (Updated)

| Issue | Priority | File |
|-------|----------|------|
| Compose page layout | 🔴 High | [compose.tsx](cci:7://file:///home/fayedbleh13/code-projects/eternal-echoes/apps/web/src/routes/compose.tsx:0:0-0:0) |
| Unlock page centering | 🔴 High | [unlock.$shareToken.tsx](cci:7://file:///home/fayedbleh13/code-projects/eternal-echoes/apps/web/src/routes/unlock.$shareToken.tsx:0:0-0:0) |
| Dashboard DELIVERED cards missing buttons | 🔴 High | [dashboard.tsx](cci:7://file:///home/fayedbleh13/code-projects/eternal-echoes/apps/web/src/routes/dashboard.tsx:0:0-0:0) |
| QR Download non-functional | 🔴 High | [QRModal.tsx](cci:7://file:///home/fayedbleh13/code-projects/eternal-echoes/apps/web/src/components/QRModal.tsx:0:0-0:0) |
| Share button poor hover | 🟡 Medium | [dashboard.tsx](cci:7://file:///home/fayedbleh13/code-projects/eternal-echoes/apps/web/src/routes/dashboard.tsx:0:0-0:0) |

---

## 📅 Timeline

- **Now**: Phase 1 UI fixes
- **Next Week**: Phase 2 Draft + Scheduling
- **Future**: Phase 3 PWA + Mobile