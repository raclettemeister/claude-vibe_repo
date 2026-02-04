/**
 * Event Schema Validator for Chez Julien
 * Validates data/events.js structure to catch breakage before playtesting.
 * Run on load (dev mode) or via window.validateEvents().
 */

(function() {
    'use strict';

    const MANDATORY_EVENT_IDS = [
        'sunday_opening', 'first_christmas', 'adopt_dog', 'building_offer',
        'christmas_market', 'building_deadline', 'building_deadline_extended',
        'meet_lucas', 'christmas_rush', 'christmas_day',
    ];

    const SUPPORTED_EFFECT_KEYS = [
        'bank', 'salesBoost', 'savingsBoost', 'salesPenalty', 'energy', 'stress',
        'family', 'autonomy', 'reputation', 'cheeseTypes', 'racletteTypes',
        'bulkPercentage', 'conceptPivotProgress', 'producerVisits', 'holidaysTaken',
    ];

    const SPECIAL_ACTIONS = ['take_loan', 'sell_equipment', 'family_help', 'set_fine_food'];

    function validateEvents(eventsArray, locale) {
        const errors = [];
        const warnings = [];

        if (!eventsArray || !Array.isArray(eventsArray)) {
            errors.push('events is not an array');
            return { valid: false, errors, warnings };
        }

        if (eventsArray.length === 0) {
            errors.push('events array is empty');
            return { valid: false, errors, warnings };
        }

        const eventIds = new Set();

        eventsArray.forEach((event, index) => {
            const prefix = `Event #${index} (${event.id || 'NO_ID'})`;

            // Required: id
            if (!event.id || typeof event.id !== 'string') {
                errors.push(`${prefix}: missing or invalid 'id'`);
            } else {
                if (eventIds.has(event.id)) {
                    errors.push(`${prefix}: duplicate id '${event.id}'`);
                }
                eventIds.add(event.id);
            }

            // Required: choices
            if (!event.choices || !Array.isArray(event.choices)) {
                errors.push(`${prefix}: missing or invalid 'choices' (must be non-empty array)`);
            } else if (event.choices.length === 0) {
                errors.push(`${prefix}: 'choices' array is empty`);
            } else {
                event.choices.forEach((choice, cIdx) => {
                    const choicePrefix = `${prefix}, choice #${cIdx}`;
                    if (!choice.text && choice.text !== '') {
                        errors.push(`${choicePrefix}: missing 'text'`);
                    }
                    const hasEffect = choice.effects && typeof choice.effects === 'object' && Object.keys(choice.effects).length > 0;
                    const hasFlags = choice.flags && typeof choice.flags === 'object' && Object.keys(choice.flags).length > 0;
                    const hasAction = choice.action && SPECIAL_ACTIONS.includes(choice.action);
                    const hasConditionalEffects = typeof choice.conditionalEffects === 'function';
                    if (!hasEffect && !hasFlags && !hasAction && !hasConditionalEffects) {
                        warnings.push(`${choicePrefix}: choice has no effects, flags, or action (may be intentionally passive)`);
                    }
                    if (choice.effects) {
                        Object.keys(choice.effects).forEach(k => {
                            if (!SUPPORTED_EFFECT_KEYS.includes(k)) {
                                warnings.push(`${choicePrefix}: effect key '${k}' is not in applyEffects() — will be ignored`);
                            }
                        });
                    }
                    if (choice.action && !SPECIAL_ACTIONS.includes(choice.action)) {
                        warnings.push(`${choicePrefix}: action '${choice.action}' is not in makeChoice switch — no special handling`);
                    }
                });
            }

            // Dynamic events: if dynamicChoices, need getChoices
            if (event.dynamicChoices && typeof event.getChoices !== 'function') {
                errors.push(`${prefix}: dynamicChoices is true but getChoices is not a function`);
            }

            // Locale check (optional warning)
            if (locale && locale.events && event.id && !locale.events[event.id]) {
                warnings.push(`${prefix}: no locale entry for events.${event.id} (will use events.js fallback)`);
            }
        });

        // Mandatory events must exist
        MANDATORY_EVENT_IDS.forEach(id => {
            if (!eventIds.has(id)) {
                errors.push(`Mandatory event '${id}' is missing (required by balance_test_suite.py)`);
            }
        });

        // quiet_month fallback
        if (!eventIds.has('quiet_month')) {
            warnings.push("Event 'quiet_month' is missing — selectNextEvent uses it as fallback when pool is empty");
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings,
        };
    }

    function runValidation() {
        const eventsArray = (typeof events !== 'undefined' ? events : null) || window.events || [];
        const locale = window.currentLocale || null;
        const result = validateEvents(eventsArray, locale);
        if (result.valid && result.warnings.length === 0) {
            console.log('✅ Event validation passed');
        } else if (result.valid) {
            console.warn('⚠️ Event validation passed with warnings:', result.warnings);
        } else {
            console.error('❌ Event validation FAILED:', result.errors);
            if (result.warnings.length > 0) {
                console.warn('Warnings:', result.warnings);
            }
        }
        return result;
    }

    // Expose on window for console use and optional load-time check
    window.validateEvents = runValidation;
    window.eventValidator = { validateEvents, MANDATORY_EVENT_IDS, SUPPORTED_EFFECT_KEYS, SPECIAL_ACTIONS };
})();
