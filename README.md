# Lucia Voice Agent Dashboard

Panel web (**Next.js**, **React**, **TypeScript**) para el ecosistema Lucia: autenticación, dashboard de usuario y administración, gestión de contactos, citas, historial de llamadas, conversaciones, estadísticas e integración con agentes de voz (configuración vía JSON y contexto de agente).

## Stack

- **Next.js** (App Router), **React**, **TypeScript**
- **Tailwind CSS** y componentes tipo **shadcn/ui** / Radix
- Cliente HTTP hacia la API REST Lucia (`NEXT_PUBLIC_API_URL`)
- WebSocket para notificaciones en tiempo real (`NEXT_PUBLIC_WS_URL`)

lucia_voice_agent_dash
+--- .vscode
|   \--- settings.json
+--- docs
|   +--- Api
|   |   \--- ESTANDAR-API-TOAST.md
|   +--- Chatterbox
|   |   \--- README.md
|   \--- WebSocket
|       \--- WEBSOCKET_README.md
+--- scripts
|   \--- copy-standalone-assets.cjs
+--- src
|   +--- app
|   |   +--- api
|   |   |   +--- agents
|   |   |   |   +--- [id]
|   |   |   |   |   \--- route.ts
|   |   |   |   \--- route.ts
|   |   |   +--- auth
|   |   |   |   +--- callback
|   |   |   |   |   \--- google
|   |   |   |   |       \--- route.ts
|   |   |   |   +--- email
|   |   |   |   |   \--- verify
|   |   |   |   |       \--- route.ts
|   |   |   |   \--- google
|   |   |   |       \--- route.ts
|   |   |   +--- calendar
|   |   |   |   +--- [id]
|   |   |   |   |   \--- route.ts
|   |   |   |   \--- route.ts
|   |   |   +--- calls
|   |   |   |   \--- route.ts
|   |   |   +--- contact
|   |   |   |   \--- route.ts.disabled
|   |   |   \--- retell
|   |   |       \--- create-web-call
|   |   |           \--- route.ts
|   |   +--- auth
|   |   |   +--- confirm
|   |   |   |   \--- page.tsx
|   |   |   +--- login
|   |   |   |   \--- page.tsx
|   |   |   \--- register
|   |   |       +--- success
|   |   |       |   \--- page.tsx
|   |   |       \--- page.tsx
|   |   +--- clinics
|   |   |   \--- page.tsx
|   |   +--- contact
|   |   |   \--- page.tsx
|   |   +--- dashboard
|   |   |   +--- admin
|   |   |   |   +--- home
|   |   |   |   |   \--- page.tsx
|   |   |   |   +--- tenants
|   |   |   |   |   \--- page.tsx
|   |   |   |   +--- users
|   |   |   |   |   +--- [id]
|   |   |   |   |   |   \--- page.tsx
|   |   |   |   |   \--- page.tsx
|   |   |   |   \--- layout.tsx
|   |   |   +--- user
|   |   |   |   +--- appointments
|   |   |   |   |   \--- page.tsx
|   |   |   |   +--- call-history
|   |   |   |   |   +--- [id]
|   |   |   |   |   |   \--- page.tsx
|   |   |   |   |   \--- page.tsx
|   |   |   |   +--- contacts
|   |   |   |   |   +--- [id]
|   |   |   |   |   |   \--- page.tsx
|   |   |   |   |   \--- page.tsx
|   |   |   |   +--- conversations
|   |   |   |   |   \--- page.tsx
|   |   |   |   +--- home
|   |   |   |   |   \--- page.tsx
|   |   |   |   \--- layout.tsx
|   |   |   +--- welcome
|   |   |   |   +--- layout.tsx
|   |   |   |   \--- page.tsx
|   |   |   +--- layout.tsx
|   |   |   \--- page.tsx
|   |   +--- dashboard-info
|   |   |   \--- page.tsx
|   |   +--- ecommerce
|   |   |   \--- page.tsx
|   |   +--- hotels
|   |   |   \--- page.tsx
|   |   +--- landing
|   |   |   +--- About.tsx
|   |   |   +--- CacheProvider.tsx
|   |   |   +--- Comparison.tsx
|   |   |   +--- Features.tsx
|   |   |   +--- mode-toggle.tsx
|   |   |   +--- Request.tsx
|   |   |   \--- Uses.tsx
|   |   +--- real-estate
|   |   |   \--- page.tsx
|   |   +--- reset-password
|   |   |   \--- page.tsx
|   |   +--- sales
|   |   |   \--- page.tsx
|   |   +--- terminos-y-condiciones
|   |   |   \--- page.tsx
|   |   +--- globals.css
|   |   +--- layout.tsx
|   |   \--- page.tsx
|   +--- components
|   |   +--- clinics
|   |   |   +--- caracteristics
|   |   |   |   \--- CaracteristicsSection.tsx
|   |   |   +--- faq
|   |   |   |   +--- FaqCard.tsx
|   |   |   |   \--- FaqSection.tsx
|   |   |   +--- hero
|   |   |   |   \--- HeroSection.tsx
|   |   |   +--- highlitghts
|   |   |   |   \--- HighlitghtsSection.tsx
|   |   |   +--- testimonials
|   |   |   |   \--- TestimonialsSection.tsx
|   |   |   \--- SectionLayout.tsx
|   |   +--- dashboard-info
|   |   |   +--- function
|   |   |   |   \--- Functions.tsx
|   |   |   +--- hero
|   |   |   |   \--- HeroSection.tsx
|   |   |   \--- learning
|   |   |       \--- Learning.tsx
|   |   +--- dev
|   |   |   \--- RateLimitTester.tsx
|   |   +--- ecommerce
|   |   |   +--- caracteristics
|   |   |   |   \--- CaracteristicsSection.tsx
|   |   |   +--- faq
|   |   |   |   +--- FaqCard.tsx
|   |   |   |   \--- FaqSection.tsx
|   |   |   +--- hero
|   |   |   |   \--- HeroSection.tsx
|   |   |   +--- highlitghts
|   |   |   |   \--- HighlitghtsSection.tsx
|   |   |   +--- testimonials
|   |   |   |   \--- TestimonialsSection.tsx
|   |   |   \--- SectionLayout.tsx
|   |   +--- header
|   |   |   +--- DesktopNav.tsx
|   |   |   +--- Header.tsx
|   |   |   +--- industries-popup.tsx
|   |   |   \--- MobileNav.tsx
|   |   +--- hotels
|   |   |   +--- caracteristics
|   |   |   |   \--- CaracteristicsSection.tsx
|   |   |   +--- faq
|   |   |   |   +--- FaqCard.tsx
|   |   |   |   \--- FaqSection.tsx
|   |   |   +--- hero
|   |   |   |   \--- HeroSection.tsx
|   |   |   +--- highlitghts
|   |   |   |   \--- HighlitghtsSection.tsx
|   |   |   +--- testimonials
|   |   |   |   \--- TestimonialsSection.tsx
|   |   |   \--- SectionLayout.tsx
|   |   +--- landing
|   |   |   +--- benefits
|   |   |   |   \--- BenefitsSection.tsx
|   |   |   +--- cases
|   |   |   |   +--- CasesSection.tsx
|   |   |   |   \--- CaseTab.tsx
|   |   |   +--- contact
|   |   |   |   +--- ContactForm.tsx
|   |   |   |   \--- ContactSection.tsx
|   |   |   +--- faq
|   |   |   |   +--- FaqCard.tsx
|   |   |   |   \--- FaqSection.tsx
|   |   |   +--- footer
|   |   |   |   \--- Footer.tsx
|   |   |   +--- hero
|   |   |   |   \--- HeroSection.tsx
|   |   |   +--- metrics
|   |   |   |   +--- MetricCard.tsx
|   |   |   |   \--- MetricsSection.tsx
|   |   |   +--- panel
|   |   |   |   \--- PanelSection.tsx
|   |   |   +--- prefooter
|   |   |   |   \--- PrefooterSection.tsx
|   |   |   +--- process
|   |   |   |   +--- ProcessSection.tsx
|   |   |   |   \--- ProcessStep.tsx
|   |   |   \--- index.ts
|   |   +--- layout
|   |   |   \--- app-sidebar
|   |   |       \--- app-sidebar.tsx
|   |   +--- modals
|   |   |   \--- CallLimitModal.tsx
|   |   +--- providers
|   |   |   \--- conditional-agent-provider.tsx
|   |   +--- real-estate
|   |   |   +--- caracteristics
|   |   |   |   \--- CaracteristicsSection.tsx
|   |   |   +--- faq
|   |   |   |   \--- FaqSection.tsx
|   |   |   +--- features
|   |   |   |   \--- FeaturesSection.tsx
|   |   |   +--- hero
|   |   |   |   \--- HeroSection.tsx
|   |   |   +--- highlitghts
|   |   |   |   \--- HighlitghtsSection.tsx
|   |   |   +--- plus
|   |   |   |   \--- PlusSection.tsx
|   |   |   +--- testimonials
|   |   |   |   \--- TestimonialsSection.tsx
|   |   |   \--- SectionLayout.tsx
|   |   +--- sales
|   |   |   +--- caracteristics
|   |   |   |   \--- CaracteristicsSection.tsx
|   |   |   +--- faq
|   |   |   |   +--- FaqCard.tsx
|   |   |   |   \--- FaqSection.tsx
|   |   |   +--- hero
|   |   |   |   \--- HeroSection.tsx
|   |   |   +--- highlitghts
|   |   |   |   \--- HighlitghtsSection.tsx
|   |   |   +--- plus
|   |   |   |   \--- PlusSection.tsx
|   |   |   +--- testimonials
|   |   |   |   \--- TestimonialsSection.tsx
|   |   |   \--- SectionLayout.tsx
|   |   +--- shared
|   |   |   +--- BenefitCard.tsx
|   |   |   +--- HeroSection.tsx
|   |   |   \--- SectionWithGrid.tsx
|   |   +--- ui
|   |   |   +--- common
|   |   |   |   +--- InputWithicon
|   |   |   |   |   \--- InputWithIcon.tsx
|   |   |   |   \--- PhoneInput
|   |   |   |       +--- const
|   |   |   |       |   \--- countries.ts
|   |   |   |       +--- Countries.ts
|   |   |   |       \--- PhoneInput.tsx
|   |   |   +--- accordion.tsx
|   |   |   +--- alert-dialog.tsx
|   |   |   +--- avatar.tsx
|   |   |   +--- badge.tsx
|   |   |   +--- breadcrumb.tsx
|   |   |   +--- button.tsx
|   |   |   +--- calendar.tsx
|   |   |   +--- card.tsx
|   |   |   +--- chart.tsx
|   |   |   +--- checkbox.tsx
|   |   |   +--- command.tsx
|   |   |   +--- custom-toaster.tsx
|   |   |   +--- dialog.tsx
|   |   |   +--- drawer.tsx
|   |   |   +--- dropdown-menu.tsx
|   |   |   +--- form.tsx
|   |   |   +--- input.tsx
|   |   |   +--- label.tsx
|   |   |   +--- popover.tsx
|   |   |   +--- progress.tsx
|   |   |   +--- rate-limit-modal.tsx
|   |   |   +--- scroll-area.tsx
|   |   |   +--- select.tsx
|   |   |   +--- separator.tsx
|   |   |   +--- sheet.tsx
|   |   |   +--- sidebar.tsx
|   |   |   +--- skeleton.tsx
|   |   |   +--- slider.tsx
|   |   |   +--- sonner.tsx
|   |   |   +--- table.tsx
|   |   |   +--- tabs.tsx
|   |   |   +--- textarea.tsx
|   |   |   +--- toast.tsx
|   |   |   +--- toggle.tsx
|   |   |   +--- toggle-group.tsx
|   |   |   \--- tooltip.tsx
|   |   +--- app-sidebar.tsx
|   |   +--- AudioPlayer.tsx
|   |   +--- audio-player.tsx
|   |   +--- Breadcrumbs.tsx
|   |   +--- calls-appointments-chart.tsx
|   |   +--- CharacteristicCard.tsx
|   |   +--- CharacteristicCentralDiagram.tsx
|   |   +--- CharacteristicDiagram.tsx
|   |   +--- CharacteristicTab.tsx
|   |   +--- chart-area-interactive.tsx
|   |   +--- ChatInterface.tsx
|   |   +--- confirm-delete-dialog.tsx
|   |   +--- confirm-logout-dialog.tsx
|   |   +--- conversation-details.tsx
|   |   +--- conversation-list.tsx
|   |   +--- create-appointment-modal.tsx
|   |   +--- create-contact-modal.tsx
|   |   +--- create-user-modal.tsx
|   |   +--- data-table.tsx
|   |   +--- data-table-row-actions.tsx
|   |   +--- data-table-skeleton.tsx
|   |   +--- data-table-view-options.tsx
|   |   +--- dynamic-html.tsx
|   |   +--- edit-appointment-modal.tsx
|   |   +--- edit-contact-modal.tsx
|   |   +--- edit-user-panel.tsx
|   |   +--- FaqAccordion.tsx
|   |   +--- FaqCard.tsx
|   |   +--- FeatureCard.tsx
|   |   +--- HighlightCard.tsx
|   |   +--- import-contacts-modal.tsx
|   |   +--- nav-documents.tsx
|   |   +--- nav-main.tsx
|   |   +--- nav-secondary.tsx
|   |   +--- nav-user.tsx
|   |   +--- page-header.tsx
|   |   +--- section-cards.tsx
|   |   +--- SectionFooter.tsx
|   |   +--- SectionHeader.tsx
|   |   +--- sidebar-cache-provider.tsx
|   |   +--- site-header.tsx
|   |   +--- tenant-admin-modals.tsx
|   |   +--- TestimonialCard.tsx
|   |   +--- voice-agent-dashboard.tsx
|   |   \--- web-vitals-logger.tsx
|   +--- config
|   |   +--- dashboard-navigation-registry.tsx
|   |   \--- env.ts
|   +--- contexts
|   |   +--- agent-context.tsx
|   |   \--- page-layout.tsx
|   +--- hooks
|   |   +--- useAuth.ts
|   |   +--- useCallRateLimit.ts
|   |   +--- use-mobile.ts
|   |   +--- use-rate-limit.ts
|   |   +--- useRetell.ts
|   |   +--- use-stable-chart-width.ts
|   |   +--- useStats.ts
|   |   +--- useUltravox.ts
|   |   \--- useWebSocket.ts
|   +--- icons
|   |   +--- GoogleIcon.tsx
|   |   +--- index.ts
|   |   \--- XIcon.tsx
|   +--- lib
|   |   +--- agents.ts
|   |   +--- api.ts
|   |   +--- api-problem.ts
|   |   +--- auth-input-styles.ts
|   |   +--- email-service.ts
|   |   +--- format.ts
|   |   +--- phone-input-value.ts
|   |   +--- rate-limiter.ts
|   |   +--- retell-agents.ts
|   |   +--- statusUtils.ts
|   |   +--- utils.ts
|   |   \--- verify-agents.ts
|   +--- prompts
|   |   +--- agents
|   |   |   +--- clinica.json
|   |   |   +--- ecommerce.json
|   |   |   +--- hoteles.json
|   |   |   +--- inmobiliaria.json
|   |   |   \--- ventas.json
|   |   +--- templates
|   |   |   +--- clinica.md
|   |   |   +--- ecommerce.md
|   |   |   +--- hoteles.md
|   |   |   +--- inmobiliaria.md
|   |   |   \--- ventas.md
|   |   \--- README.md
|   +--- providers
|   |   +--- auth-provider.tsx
|   |   \--- query-provider.tsx
|   +--- schema
|   |   +--- login.ts
|   |   \--- register.ts
|   +--- services
|   |   +--- data
|   |   |   +--- conversations.json
|   |   |   \--- messages.json
|   |   +--- seller
|   |   |   \--- RequestService.ts
|   |   +--- user
|   |   |   +--- CallService.ts
|   |   |   \--- RequestService.ts
|   |   +--- AppointmentService.ts
|   |   +--- CallService.ts
|   |   +--- ContactService.ts
|   |   +--- conversations.ts
|   |   +--- messages.ts
|   |   +--- RequestService.ts
|   |   +--- StatsService.ts
|   |   +--- TenantAdminService.ts
|   |   +--- UserService.ts
|   |   \--- WebSocketService.ts
|   \--- types
|       +--- calls.ts
|       +--- dashboard.ts
|       +--- dashboard-navigation.ts
|       +--- react-big-calendar.d.ts
|       \--- ultravox.d.ts
+--- .gitignore
+--- components.json
+--- dockerfile
+--- eslint.config.mjs
+--- next.config.js
+--- next-env.d.ts
+--- package.json
+--- package-lock.json
+--- postcss.config.mjs
+--- README.md
+--- tsconfig.json
\--- ULTRAVOX_INTEGRATION_README.md
```