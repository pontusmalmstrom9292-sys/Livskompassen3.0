# Cursor YOLO — förbättringsvågor 2026-07-21

| Våg-id | Område | Filer | Smoke | PASS/FAIL |
|--------|--------|-------|-------|-----------|
| build-fix-home-hub-boundary | HomePage HubErrorBoundary logTag | HomePage.tsx | build, locked-ux | PASS |
| ui-polish-v2-vardagen | Vardagen MåBra + Planering tokens/a11y | mabra.css, planering.css, compasses.css, vardagen.css, planering-routines.css | build, locked-ux, design-modules, mabra | PASS |
| ui-polish-v3-hjartat | Hjärtat Dagbok + Speglar + Inkast | hjartat.css, reflektion-panel.css, dagbok-tyst-lage.css, InkastDirectPanel.tsx | build, locked-ux, design-modules, speglar | PASS |
| ui-polish-v4-familjen | Familjen + Barnporten + ChildMoment | familjen.css, barnporten.css, ChildMomentTabs.tsx | build, locked-ux, design-modules, children | PASS |
| ui-polish-v5-valv | Valv hub WORM-stamp + Mönster | valv.css, VaultWormEvidenceStamp.tsx, VaultMonsterPanel.tsx | build, locked-ux, design-modules, valv | PASS |
| ui-polish-v6-widgets-chrome | Widgets + dock + header chrome | WidgetShell.css, floating-dock.css, coreLayoutChrome.css, executive-chrome.css | build, locked-ux, design-modules, widgets, basta-dock-lock | PASS |
| widget-home-slot-polish | UserWidget hem-slot | UserWidgetHomeSlot, HomeWidgetRenderer, normalizeUserWidget | build, custom-modules, widgets | PASS |
| executive-home-polish | Executive hem-kort | exec-home-chrome.css, executive-chrome.css, ExecutivePlanering/Focus/DaySteps | build, locked-ux, executive-home-visual | PASS |
| planering-pin-panel-polish | Planering pin-panel a11y | PlaneringModulePinPanel, PinnedPlaneringModuleSlot, planering.css | build, planering-superhub, locked-ux | PASS |
| mabra-collapsible-a11y | MåBra collapsible + VIT hub | CalmCollapsible, mabra-collapsible.css, mabra-vit-hub, MabraExplorePanel | build, mabra, locked-ux | PASS |
| drogfrihet-content-polish | DF content types + SOS focus | dfBankTypes, dfQuestionBank, dfQuoteBank, RecoveryUrgeSosModule | build, drogfrihet, drogfrihet-content | PASS |
| economy-delegates-polish | Ekonomi delegates EmptyState/error/a11y | 5 delegates + EconomyModulePreviews | build, economy-vendor, locked-ux, predeploy:build | PASS |
| hub-chrome-tile-unify | Hub chrome tile + EmptyState/Skeleton + 3 hubs | hub-chrome-tile.css, shells, EmptyState, HubPanelSkeleton, Ekonomi/Mabra/Arbetsliv SM | build, design-modules, orkester, predeploy:build | PASS |
| lazy-routes-zones | Zone chunks Familjen+Valv + HubPanelSkeleton | vite.config, ValvetRoutePage, FamiljenPage | build, locked-ux, predeploy:build | PASS |
| error-boundary-sweep | EmptyState Inkast/Arkiv/Planering (logTag redan OK) | ArchiveList/Calendar, PlaneringEmailRules, ReviewQueuePipeline | build, locked-ux, orkester, predeploy:build | PASS |
| premium-polish-quickwins | premium CSS + HomeGreeting rose + Chameleon a11y | premium-polish.css, HomeGreeting, ChameleonLive | build, design-modules, obsidian-depth, predeploy:build | PASS |
| projekt-blocks-polish | Projekt Ny/Detail a11y + blocks API auth | ProjektNy/Detail/MaterialPack, projectBlocksApi, utils/*, smoke_projects soft | build, projekt-regler, projects, predeploy:build | PASS |

| improve-waves-session-log | Sessionlogg + full predeploy gate | improve-waves.md, yolo-state | smoke:predeploy:build | PASS |

| arbetsliv-hub-polish | Lönekontor EmptyState + SuperModule focus | ArbetslivProfilDelegate, ArbetslivInputSuperModule, premium-polish.css | build, arbetsliv, arbetsliv-superhub, locked-ux, predeploy:build | PASS |

| archive-hub-polish | Arkiv hub skeleton + token a11y | ArchiveHub (+ List/Calendar EmptyState tidigare) | build, locked-ux, design-modules, predeploy:build | PASS |

| oracle-dashboard-polish | Oracle tokens + EmptyState + reduced-motion | OracleDashboard, DayForensics, CapacityChart | build, orkester, predeploy:build | PASS |

| morning-compass-polish | Step-indikatorer, Enter/ArrowDown, calm-scroll, 44px | MorningCompass.tsx | build, compass, locked-ux, predeploy:build | PASS |

| inkast-capture-polish | Touch 44px, error alerts, caption UX | InkastDirect, CaptureSuper, InboxReview, MediaAttach | build, inkast-fas2, media-attach, predeploy:build | PASS |

| onboarding-barnporten-polish | a11y, 44px, EmptyState/skeleton | BarnportenWidget, ForalderTryggCard/Dashboard | build, children, hitl1, locked-ux, predeploy:build | PASS |

| zen-resurser-overlay-polish | Focus, Esc, glass tokens, EmptyState | ZenModeOverlay, ResurserOverlay | build, locked-ux, design-modules, predeploy:build | PASS |

| grans-biff-polish | Grey Rock hints, 44px, tokens/Pansar | BiffPublicPanel, GlobalPansarView | build, grans, predeploy:build | PASS |

| widget-board-polish | Capacity hints, style preview, CRUD archive | WidgetModuler*, capacity, presets, firestore helpers | build, widgets, custom-modules, predeploy:build | PASS |

| superdagbok-polish | Wizard 44px, tyst CSS, glow=blue smoke, archive path | ConfirmStep, TystDelegate, Archive, SuperModule, smoke | build, superdagbok-superhub, speglar, predeploy:build | PASS |

| dossier-evidence-polish | WORM-stamp synlighet, 44px, felhints | Stamp, SpeglarEvidence, Compare, Dossier, VaultLogList | build, dossier, vault-worm, predeploy:build | PASS |

> Deploy-förslag (ej kört): hosting efter merge. PMIR senare: `isValidProjectCreate` / `isValidProjectBlockCreate` + video i firestore/storage.rules — se WARN i smoke:projects.
