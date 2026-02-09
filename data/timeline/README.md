# Timeline 42 mois — Template de planification

Ce dossier sert à **planifier quels événements ont lieu à quels mois** dans le jeu, au lieu du tirage aléatoire actuel. Tu peux t’appuyer sur ton **A3 « 42 months story »** pour remplir le template.

**Pour Opus 4.6 (ou autre IA) :** lire **OPUS-INSTRUCTIONS.md** puis **PLANNING-GUIDE-FOR-AI.md** et **EVENTS-REFERENCE.md** pour remplir le CSV avec toutes les infos nécessaires. Ensuite revue du CSV en ping-pong avec un humain.

## Fichiers

| Fichier | Usage |
|---------|--------|
| **42-months-template.csv** | Template à remplir : une ligne par mois (1–42), colonne `event_id` = l’événement de ce mois. Ouvrable en Excel, Google Sheets, ou éditeur de texte. |
| **OPUS-INSTRUCTIONS.md** | Instructions courtes pour l'IA : tâche, étapes, fichiers à lire. |
| **PLANNING-GUIDE-FOR-AI.md** | Contexte complet : calendrier, obligatoires, chaînes de dépendance, brouillon suggéré, règles. |
| **EVENTS-REFERENCE.md** | Liste de tous les `event_id` avec titre EN et monthRange actuel. Utilise ces IDs dans la colonne `event_id` du CSV. |
| **timeline.json** | (optionnel) Même planification au format JSON pour une future intégration dans le jeu. |
| **COMPLETE-EVENT-REGISTRY.md** | **Référence unique** : tous les événements (code + système + photos). 106 events du pool, burnout/cash_crisis/ game over, clés photo. À utiliser pour être sûr de ne rien oublier. |
| **complete-event-registry.json** | Même chose en JSON (liste d’ids, mandatory, system, photo keys). |

## Comment utiliser

1. **Ouvre** `42-months-template.csv` (Excel, LibreOffice, Google Sheets).
2. **Référence** ton A3 « 42 months story » et la liste dans `EVENTS-REFERENCE.md`.
3. **Renseigne** la colonne **event_id** pour chaque mois : mets l’ID exact (ex: `first_christmas`, `meet_lucas`). Laisse vide ou mets `quiet_month` pour un mois sans événement fort.
4. **Notes** : utilise la colonne `notes` pour tes commentaires (ex: « Noël 1 », « Lucas arrive »).
5. **Sauvegarde** le CSV (UTF-8 si possible).

## Règles à respecter

- **Un événement unique** (ex: `first_christmas`, `building_deadline`) ne doit apparaître qu’**une seule fois** dans le timeline (au mois qui correspond à ton histoire).
- Les **obligatoires** du jeu actuel : mois 6 = premier Noël, 18 = Noël 2, 25 = deadline immeuble, 26 = dernière chance immeuble, 27 = Lucas, 30 = Noël 3, 42 = fin. Tu peux les garder ou les remplacer par un autre événement du même thème si ton A3 dit autre chose.
- **Récurrents** (ex: `family_dinner`, `raclette_season`) : tu peux les placer plusieurs fois aux mois où tu veux qu’ils apparaissent.

## Suite (intégration jeu)

Quand le timeline est stabilisé :

- On pourra ajouter un **fichier JSON** du type `{ "1": "sunday_opening", "2": "stock_reality", ... }` (un par mois).
- Le jeu pourra être modifié pour **lire ce timeline** et, en mode « histoire planifiée », choisir l’événement du mois selon le fichier au lieu du random.

---

**Calendrier rapide :** Mois 1 = Juillet 2022, Mois 42 = Décembre 2025. Voir `notebooklm-events/05-EVENT-SELECTION-ENGINE.md` pour le détail mois index ↔ calendrier.
