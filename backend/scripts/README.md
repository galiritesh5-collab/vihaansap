# Firestore CMS operations

All commands require the service-account variables in `backend/.env`. Run them from `backend`.

- `npm run firestore:backup -- backups/before-change.json` exports the current CMS and operational collections.
- `npm run firestore:restore -- backups/before-change.json` merges a backup back into Firestore without deleting documents.
- `npm run firestore:seed -- backups/cms.json` seeds only empty collections, preserving live data.
- `npm run firestore:migrate-static` recovers the original committed courses, reviews, FAQs, blogs, branding, and website settings only into empty Firestore locations.

Always make and retain a backup before a restore or seed. The scripts intentionally fail when Firebase Admin credentials are absent.
