// Events database - loaded by index.html
const events = [
            // === CASH CRISIS (triggered when bank hits 0 AND no more supplier grace) ===
            {
                id: 'cash_crisis',

                type: 'crisis',
                monthRange: [1, 42],
                special: 'cash_crisis', // Special flag to identify this event
                choices: [
                    {
effects: {},
action: 'take_loan'
                    },
                    {
effects: { reputation: -5 },
action: 'sell_equipment'
                    },
                    {
effects: { family: -15 },
action: 'family_help'
                    }
                ]
            },

            // === MONTH 1: FIRST EVENT - Sunday Decision ===
            {
                id: 'sunday_opening',

                type: 'decision',
                monthRange: [1, 1],
                priority: 100,  // Highest priority - must be first
                unique: true,
                choices: [
                    {
effects: { stress: 10, energy: -5 },
flags: { openSunday: true }
                    },
                    {
effects: { stress: -5, family: 5, energy: 5 },
flags: { openSunday: false }
                    }
                ]
            },

            // === MONTH 1: SECOND EVENT - Inventory Discovery ===
            {
                id: 'stock_reality',

                type: 'crisis',
                monthRange: [1, 2],
                priority: 95,  // Second priority - after Sunday decision
                choices: [
                    {
effects: { stress: 15, energy: -15 },
flags: { liquidatedStock: true, fleaMarketDone: true },
conditionalEffects: () => ({ reputation: 5, autonomy: 5 })
                    },
                    {
effects: { bank: 1500, stress: 5, energy: -5 },
flags: { shadyGuyContacted: true, liquidatedStock: true }
                    },
                    {
effects: { stress: 25, bank: -1000 },
conditionalEffects: () => ({ reputation: -10, monthlyPenalty: 500 })
                    }
                ]
            },

            // === SHOP IDENTITY ===
            {
                id: 'shop_name',

                type: 'decision',
                monthRange: [3, 12],
                condition: () => !gameState.shopRenamed,
                unique: true,
                choices: [
                    {
effects: { stress: -5 },
flags: { shopRenamed: true, shopName: 'Chez Julien' },
conditionalEffects: () => ({ reputation: 5 })
                    },
                    {
effects: { bank: -200 },
flags: { shopRenamed: true, shopName: 'Alix Corner' },
conditionalEffects: () => ({ reputation: 5 })
                    },
                    {
effects: {},
flags: { shopRenamed: true }
                    }
                ]
            },

            // === INSURANCE DECISION (Mandatory Early Event) ===
            {
                id: 'insurance_decision',

                type: 'decision',
                monthRange: [2, 4],
                condition: () => !gameState.insuranceDecisionMade,
                unique: true,
                priority: 90,
                choices: [
                    {
effects: { bank: -1800, stress: -5 },
flags: { insuranceDecisionMade: true, hasComprehensiveInsurance: true, monthlyInsurance: 150 }
                    },
                    {
effects: { stress: 5 },
flags: { insuranceDecisionMade: true, hasComprehensiveInsurance: false }
                    }
                ]
            },

            // === FLOOD EVENT (50% chance in summer if insurance decision was made) ===
            {
                id: 'summer_flood',

                description: () => {
                    gameState.floodActive = true; // Show rain/flood in pixel art
                    const insured = gameState.hasComprehensiveInsurance;
                    return `August. Freak summer storm. You arrive at the shop to find water pouring in through the basement. The cheese fridge is fine—it's elevated—but the basement storage is devastated. Boxes of slow-moving bulk products, seasonal decorations, old equipment. All ruined.\n\n${insured ? 'You immediately call your insurance company.' : 'You stare at the damage. No flood insurance.'}`;
                },
                type: 'crisis',
                monthRange: [13, 37], // Can happen in any summer after first year
                condition: () => {
                    // Only trigger in summer months (June-August: months 12, 13, 24, 25, 36, 37 relative to July start)
                    const monthOfYear = gameState.month; // 1-12
                    const isSummer = monthOfYear >= 6 && monthOfYear <= 8;
                    // 50% chance, only once, only if insurance decision was made
                    return isSummer &&
                           gameState.insuranceDecisionMade &&
                           !gameState.floodHappened &&
                           Math.random() < 0.5;
                },
                unique: true,
                priority: 95,
                dynamicChoices: true,
                choices: [], // Will be populated by getChoices
                getChoices: function() {
                    if (gameState.hasComprehensiveInsurance) {
                        return [
                            {
effects: { stress: 15, energy: -20 },
flags: { floodHappened: true, floodActive: false },
conditionalEffects: () => ({ bank: 6500, reputation: 3 }) // Insurance payout (halved v2.3)
                            }
                        ];
                    } else {
                        return [
                            {
effects: { stress: 40, energy: -35, family: -15 },
flags: { floodHappened: true, floodActive: false },
conditionalEffects: () => ({ bank: -18000, reputation: -5 })
                            },
                            {
effects: { stress: 35, energy: -30, family: -25 },
flags: { floodHappened: true, floodActive: false },
conditionalEffects: () => ({ bank: -13000, reputation: -3 })
                            }
                        ];
                    }
                }
            },

            // === EARLY DECISIONS ===
            {
                id: 'first_cheese',

                type: 'pivot',
                monthRange: [2, 4],
                condition: () => gameState.cheeseTypes === 0,
                unique: true,
                priority: 95,
                choices: [
                    {
effects: { bank: -300, energy: -10 },
flags: { cheeseTypes: 1 },
conditionalEffects: () => ({ reputation: 3, conceptPivotProgress: 10 })
                    },
                    {
effects: { bank: -5000, stress: 10, energy: -10 },
flags: { cheeseTypes: 15, hasProCounter: true },
conditionalEffects: () => ({ reputation: 10, conceptPivotProgress: 40, monthlyPayment: 800 })
                    },
                    {
effects: { stress: 10 },

                    }
                ]
            },

            // === PRODUCT MIX DECISIONS (Compounding Revenue) ===
            {
                id: 'charcuterie_question',

                type: 'decision',
                monthRange: [6, 38],
                condition: () => gameState.cheeseTypes >= 5 && !gameState.hasCharcuterie,
                unique: true,
                priority: 65,
                choices: [
                    {
effects: { bank: -1500, stress: 10 },
flags: { hasCharcuterie: true },
conditionalEffects: () => ({ reputation: 3, autonomy: -5 })
                    },
                    {
effects: { bank: -3000, stress: 15 },
flags: { hasCharcuterie: true },
conditionalEffects: () => ({ reputation: 5 })
                    },
                    {
effects: { stress: -5 },
conditionalEffects: () => ({ autonomy: 10, cheeseExpertise: 5 })
                    }
                ]
            },
            {
                id: 'wine_dilemma',

                type: 'decision',
                monthRange: [10, 38],
                condition: () => gameState.cheeseTypes >= 20 && !gameState.hasWineSelection,
                unique: true,
                priority: 65,
                choices: [
                    {
effects: { bank: -2000, stress: 5 },
flags: { hasWineSelection: true },
conditionalEffects: () => ({ reputation: 5 })
                    },
                    {
effects: { bank: -8000, stress: 20, energy: -15 },
flags: { hasWineSelection: true, hasWineEvents: true },
conditionalEffects: () => ({ reputation: 6, autonomy: -10 })
                    },
                    {
effects: { stress: -5 },
conditionalEffects: () => ({ autonomy: 8, reputation: 3 })
                    }
                ]
            },
            {
                id: 'corporate_opportunity',

                type: 'opportunity',
                monthRange: [12, 35],
                condition: () => gameState.cheeseTypes >= 25 && gameState.reputation >= 55 && !gameState.hasCorporateClient,
                unique: true,
                choices: [
                    {
effects: { stress: 15, energy: -10 },
flags: { hasCorporateClient: true },
conditionalEffects: () => ({ autonomy: -10, reputation: 5 })
                    },
                    {
effects: { stress: 10 },
conditionalEffects: () => ({ reputation: 3, bank: 1000 })
                    },
                    {
effects: { stress: -10 },
conditionalEffects: () => ({ autonomy: 10 })
                    }
                ]
            },

            {
                id: 'cheap_fridge',

                type: 'decision',
                monthRange: [4, 10],
                unique: true,
                condition: () => gameState.cheeseTypes >= 1 && gameState.cheeseTypes < 15 && !gameState.hasProCounter,
                choices: [
                    {
effects: { bank: -800, stress: 5 },
conditionalEffects: () => ({ cheeseTypes: gameState.cheeseTypes + 9, conceptPivotProgress: 20 })
                    },
                    {
effects: { bank: -2000, stress: 20 },
flags: { monthlyPayment: 800, hasProCounter: true },
conditionalEffects: () => ({ cheeseTypes: gameState.cheeseTypes + 20, conceptPivotProgress: 35, reputation: 6 })
                    }
                ]
            },

            // === FINE FOOD PIVOT CHOICE ===
            {
                id: 'fine_food_choice',

                type: 'pivot',
                monthRange: [8, 20],
                condition: () => gameState.cheeseTypes >= 15 && gameState.concept === 'Hybrid' && !gameState.fineFoodChoiceMade,
                unique: true,
                choices: [
                    {
effects: { stress: 10, reputation: 6 },
flags: { fineFoodChoiceMade: true },
action: 'set_fine_food'
                    },
                    {
effects: { stress: 5 },
flags: { fineFoodChoiceMade: true }
                    }
                ]
            },

            // === THE PIVOT JOURNEY ===
            {
                id: 'gradual_pivot',

                type: 'pivot',
                monthRange: [6, 15],
                condition: () => gameState.cheeseTypes >= 5 && gameState.bulkPercentage > 50,
                choices: [
                    {
effects: { stress: 10, energy: -5 },
conditionalEffects: () => ({
                            bulkPercentage: Math.max(0, gameState.bulkPercentage - 15),
                            conceptPivotProgress: Math.min(100, gameState.conceptPivotProgress + 15),
                            cheeseTypes: gameState.cheeseTypes + 20,
                            reputation: 5
                        })
                    },
                    {
effects: { bank: -2000, stress: 25, energy: -15 },
conditionalEffects: () => ({
                            bulkPercentage: Math.max(0, gameState.bulkPercentage - 40),
                            conceptPivotProgress: Math.min(100, gameState.conceptPivotProgress + 30),
                            cheeseTypes: gameState.cheeseTypes + 50,
                            reputation: gameState.reputation > 60 ? 10 : -5
                        })
                    }
                ]
            },
            // === CHRISTMAS EVENTS (MANDATORY - One per year) ===
            {
                id: 'first_christmas',

                type: 'milestone',
                monthRange: [6, 6], // December 2022 - MANDATORY first Christmas
                mandatory: true,
                unique: true,
                choices: [
                    {
effects: { stress: 5, bank: 1500 },
flags: { firstChristmasDone: true }
                    },
                    {
effects: { stress: 20, energy: -15, bank: 3000 },
flags: { firstChristmasDone: true }
                    },
                    {
effects: { stress: -5, reputation: 5 },
flags: { firstChristmasDone: true },
conditionalEffects: () => ({ bank: 2000 })
                    }
                ]
            },
            // === REVENUE BOOSTING EVENTS ===
            {
                id: 'christmas_market',

                type: 'opportunity',
                monthRange: [18, 18], // December 2023 - MANDATORY second Christmas
                mandatory: true,
                unique: true,
                choices: [
                    {
effects: { energy: -20, stress: 15 },
flags: { didChristmasMarket: true },
conditionalEffects: () => ({ bank: 3000, reputation: 5 })
                    },
                    {
effects: { stress: -5 },

                    }
                ]
            },
            {
                id: 'corporate_client',

                type: 'opportunity',
                monthRange: [8, 35],
                condition: () => gameState.cheeseTypes >= 30 && gameState.reputation >= 55,
                choices: [
                    {
effects: { stress: 10, energy: -10 },
flags: { hasCorporateClient: true },
conditionalEffects: () => ({ reputation: 3 })
                    },
                    {
effects: { stress: -5 },

                    }
                ]
            },
            {
                id: 'wine_pairing',

                type: 'opportunity',
                monthRange: [10, 38],
                condition: () => gameState.cheeseTypes >= 40 && !gameState.hasWineEvents,
                choices: [
                    {
effects: { energy: -10, stress: 5 },
flags: { hasWineEvents: true },
conditionalEffects: () => ({ bank: 2000, reputation: 5 })
                    },
                    {
effects: {},

                    }
                ]
            },
            {
                id: 'raclette_season',

                description: () => gameState.raclettePathStarted
                    ? 'Winter is here. Your raclette reputation precedes you. Customers call in advance. "Are you the shop with 15 different raclettes?" The question is how hard to push.'
                    : 'Winter is here and everyone wants raclette. You could stock up big on raclette cheese and rent machines. High investment but the margins are incredible.',
                type: 'opportunity',
                monthRange: [17, 42], // Nov–Feb recurring every winter (after "The Raclette Question" in Oct)
                recurring: true,
                cooldown: 12,
                priority: 85,
                condition: () => (gameState.month >= 11 || gameState.month <= 2) && gameState.cheeseTypes >= 25,
                choices: [
                    {

                        hint: () => gameState.raclettePathStarted ? 'Your reputation makes this easier' : 'Big investment, big returns',
effects: { bank: -3000, stress: 10 },
                        outcome: () => gameState.raclettePathStarted
                            ? 'Your raclette expertise paid off. Customers came from across Brussels. 300kg sold, all machines rented every weekend. Word spread further.'
                            : 'You bought 200kg of raclette cheese and 5 machines to rent. Sold out by January. The profit was beautiful.',
conditionalEffects: () => gameState.raclettePathStarted
                            ? { bank: 18000, reputation: 5, racletteTypes: gameState.racletteTypes + 2 }
                            : { bank: 12000, reputation: 3 }
                    },
                    {
effects: {},

                    }
                ]
            },

            // === RACLETTE MASTERY PATH ===
            {
                id: 'first_raclette_season',

                type: 'decision',
                monthRange: [16, 16], // October only (monthIndex 16 = Oct 2023; narrative: "October... Raclette season is coming")
                condition: () => gameState.month === 10 && gameState.cheeseTypes >= 10,
                unique: true,
                priority: 90,
                choices: [
                    {
effects: { bank: -2000, stress: 10 },
flags: { raclettePathStarted: true },
conditionalEffects: () => ({ racletteTypes: 8, cheeseTypes: gameState.cheeseTypes + 8, reputation: 3 })
                    },
                    {
effects: { bank: -500 },
conditionalEffects: () => ({ racletteTypes: 3, cheeseTypes: gameState.cheeseTypes + 3 })
                    },
                    {
effects: {},

                    }
                ]
            },
            {
                id: 'swiss_invitation',

                type: 'opportunity',
                monthRange: [16, 32],
                condition: () => gameState.raclettePathStarted && gameState.racletteTypes >= 5,
                unique: true,
                priority: 85,
                choices: [
                    {
effects: { bank: -4000, energy: -20, family: 10 },
flags: { swissVisitDone: true },
conditionalEffects: () => ({
                            racletteTypes: gameState.racletteTypes + 10,
                            cheeseTypes: gameState.cheeseTypes + 10,
                            reputation: 8,
                            producerRelationships: gameState.producerRelationships + 20,
                            producerVisits: gameState.producerVisits + 1,  // Counts toward Producer Friend!
                            supplierDiscount: gameState.supplierDiscount + 5
                        })
                    },
                    {
effects: { stress: 5 },

                    }
                ]
            },
            {
                id: 'raclette_kingdom',

                type: 'decision',
                monthRange: [24, 40],
                condition: () => gameState.swissVisitDone && gameState.racletteTypes >= 15,
                unique: true,
                priority: 88,
                choices: [
                    {
effects: { bank: -3000, stress: 15 },
flags: { racletteKingdom: true },
conditionalEffects: () => ({
                            racletteTypes: gameState.racletteTypes + 5,
                            cheeseTypes: gameState.cheeseTypes + 5,
                            reputation: 10,
                            autonomy: 5
                        })
                    },
                    {
effects: {},

                    }
                ]
            },

            // === LATE GAME CROWNING EVENTS ===
            {
                id: 'parmigiano_invitation',

                type: 'milestone',
                monthRange: [38, 42], // TRUE ENDGAME - only in final months
                condition: () => gameState.reputation >= 90, // Need strong reputation to get invited
                unique: true,
                priority: 95,
                choices: [
                    {
effects: { bank: -6000, stress: -25, energy: 20, family: 15 },
flags: { parmigianoVisitDone: true },
conditionalEffects: () => ({
                            cheeseTypes: 100, // The trip completes your cheese collection!
                            producerRelationships: (gameState.producerRelationships || 0) + 30,
                            producerVisits: (gameState.producerVisits || 0) + 1
                        })
                    },
                    {
effects: { stress: 10 },

                    }
                ]
            },
            {
                id: 'birthday_party',

                type: 'personal',
                monthRange: [28, 42],
                condition: () => gameState.monthsPlayed >= 28,
                unique: true,
                priority: 70,
                choices: [
                    {
effects: { bank: -4500, stress: 30, energy: -25 },
flags: { hadBigBirthdayParty: true },
conditionalEffects: () => ({ family: 35, reputation: 8 })
                    },
                    {
effects: { bank: -1200, stress: -5 },
conditionalEffects: () => ({ family: 15, energy: 10 })
                    }
                ]
            },

            // === MORE LATE GAME RECURRING EVENTS ===
            {
                id: 'regular_appreciation',

                type: 'personal',
                monthRange: [30, 42],
                condition: () => gameState.reputation >= 70,
                unique: true,
                priority: 60,
                choices: [
                    {
effects: { stress: -15 },
conditionalEffects: () => ({ family: 10, reputation: 5 })
                    },
                    {
effects: { stress: -10 },
conditionalEffects: () => ({ family: 15 })
                    }
                ]
            },
            {
                id: 'competitor_closes',

                type: 'opportunity',
                monthRange: [25, 42],
                condition: () => gameState.reputation >= 60,
                unique: true,
                priority: 55,
                choices: [
                    {
effects: { stress: 10, energy: -5 },
conditionalEffects: () => ({ cheeseTypes: gameState.cheeseTypes + 4, supplierDiscount: gameState.supplierDiscount + 2 })
                    },
                    {
effects: {},
conditionalEffects: () => ({ reputation: 5 })
                    }
                ]
            },
            {
                id: 'apprentice_request',

                type: 'opportunity',
                monthRange: [28, 42],
                condition: () => gameState.cheeseTypes >= 50 && gameState.reputation >= 65,
                unique: true,
                priority: 60,
                choices: [
                    {
effects: { stress: 15, energy: -10 },
conditionalEffects: () => ({ autonomy: 8, reputation: 6 })
                    },
                    {
effects: { stress: -5 },

                    }
                ]
            },
            {
                id: 'food_blogger_visit',

                type: 'opportunity',
                monthRange: [20, 42],
                condition: () => gameState.cheeseTypes >= 40,
                recurring: true,
                cooldown: 12,
                choices: [
                    {
effects: { stress: 10, energy: -5 },
conditionalEffects: () => ({ reputation: 8 })
                    },
                    {
effects: {},
conditionalEffects: () => ({ reputation: 3 })
                    }
                ]
            },
            {
                id: 'reflection_moment',

                type: 'personal',
                monthRange: [35, 42],
                condition: () => gameState.bank >= 50000,
                unique: true,
                priority: 50,
                choices: [
                    {
effects: { stress: -20, energy: 10 },
conditionalEffects: () => ({ family: 5 })
                    },
                    {
effects: { stress: 5 },
conditionalEffects: () => ({ autonomy: 5 })
                    }
                ]
            },

            {
                id: 'newspaper_feature',

                type: 'opportunity',
                monthRange: [12, 36],
                condition: () => gameState.cheeseTypes >= 50 && gameState.reputation >= 60,
                unique: true,
                choices: [
                    {
effects: { stress: 10, energy: -5 },
conditionalEffects: () => ({ reputation: 8, bank: 3000 })
                    },
                    {
effects: {},

                    }
                ]
            },
            {
                id: 'expand_hours',

                type: 'decision',
                monthRange: [6, 38],
                condition: () => !gameState.extendedHours && (gameState.hasLucas || gameState.hasHenry),
                choices: [
                    {
effects: { stress: 10, energy: -10 },
flags: { extendedHours: true },
conditionalEffects: () => ({ bank: 2500, reputation: 5 })
                    },
                    {
effects: { family: 5 },

                    }
                ]
            },

            {
                id: 'talk_to_customers',

                type: 'opportunity',
                monthRange: [4, 20],
                unique: true,
                choices: [
                    {
effects: { energy: -10, stress: 5 },
conditionalEffects: () => ({ reputation: 3, cheeseTypes: gameState.cheeseTypes + 5 })
                    },
                    {
effects: { stress: 10 },

                    }
                ]
            },

            // === SEASONAL STRESS EVENTS ===
            {
                id: 'christmas_rush',

                type: 'crisis',
                monthRange: [30, 30], // December 2024 - MANDATORY third Christmas
                mandatory: true,
                unique: true,
                choices: [
                    {
effects: { stress: 25, energy: -25, bank: 5000 },

                    },
                    {
effects: { stress: 10, energy: -10, bank: 2000 },

                    }
                ]
            },
            {
                id: 'summer_slowdown',

                type: 'crisis',
                monthRange: [13, 42], // August (recurring every year)
                condition: () => gameState.month === 8 && gameState.cheeseTypes >= 10,
                recurring: true,
                cooldown: 12,
                priority: 85,
                choices: [
                    {
effects: { stress: 15, bank: -1500 },

                    },
                    {
effects: { stress: 20, bank: -500 },

                    },
                    {
effects: { stress: -15, energy: 20, family: 15, bank: -4500 },

                    }
                ]
            },
            {
                id: 'heat_wave',

                type: 'crisis',
                monthRange: [12, 42], // July-August (recurring every year)
                condition: () => gameState.month === 7 || gameState.month === 8,
                recurring: true,
                cooldown: 12,
                priority: 80,
                choices: [
                    {
effects: { bank: -400, stress: 20, energy: -15 },

                    },
                    {
effects: { stress: 10, energy: -10 },
conditionalEffects: () => ({ reputation: 2 })
                    },
                    {
effects: { bank: -800, stress: -5 },

                    }
                ]
            },
            {
                id: 'snow_day',

                type: 'decision',
                monthRange: [5, 42], // Dec-Feb (recurring every winter)
                condition: () => gameState.month === 12 || gameState.month === 1 || gameState.month === 2,
                unique: true,
                priority: 85,
                choices: [
                    {
effects: { stress: 15, energy: -20 },
conditionalEffects: () => ({ reputation: 5, family: -5 })
                    },
                    {
effects: { stress: -10, family: 10, bank: -1800 },

                    }
                ]
            },
            {
                id: 'back_to_school',

                type: 'decision',
                monthRange: [14, 42], // September (recurring every year)
                condition: () => gameState.month === 9,
                recurring: true,
                cooldown: 12,
                priority: 85,
                choices: [
                    {
effects: { stress: 15, energy: -15, bank: 3000 },
flags: { septemberRushExperienced: true }
                    },
                    {
effects: { stress: 5, bank: 1500 },

                    }
                ]
            },

            // === SUPPLIER & BUSINESS CRISES ===
            {
                id: 'supplier_price_hike',

                type: 'crisis',
                monthRange: [8, 36],
                condition: () => gameState.cheeseTypes >= 10,
                unique: true,
                choices: [
                    {
effects: { stress: 10 },
conditionalEffects: () => ({ reputation: -8 })
                    },
                    {
effects: { stress: 5, bank: -1200 },
conditionalEffects: () => ({ reputation: 4 })
                    },
                    {
effects: { stress: 15 },

                        condition: () => gameState.producerRelationships >= 5,
conditionalEffects: () => ({ autonomy: 5 })
                    }
                ]
            },
            {
                id: 'delivery_disaster',

                type: 'crisis',
                monthRange: [3, 40],
                unique: true,
                choices: [
                    {
effects: { stress: 20, energy: -15, bank: -200 },

                    },
                    {
effects: { stress: 15, energy: -5 },
conditionalEffects: () => ({ reputation: -2, bank: -500 })
                    }
                ]
            },
            {
                id: 'health_inspection',

                type: 'crisis',
                monthRange: [5, 40],
                unique: true,
                choices: [
                    {
effects: { stress: 5 },
conditionalEffects: () => ({ reputation: 5 })
                    },
                    {
effects: { stress: 15, energy: -10 },
conditionalEffects: () => ({ reputation: -3 })
                    }
                ]
            },
            {
                id: 'competitor_opens',

                type: 'crisis',
                monthRange: [12, 30],
                condition: () => gameState.cheeseTypes >= 15, // Only if you've become a cheese shop
                unique: true,
                choices: [
                    {
effects: { stress: 15, energy: -10 },
conditionalEffects: () => ({ reputation: 4, cheeseTypes: gameState.cheeseTypes + 10 })
                    },
                    {
effects: { stress: 10 },
conditionalEffects: () => ({ autonomy: 5 })
                    },
                    {
effects: { stress: 20 },
conditionalEffects: () => ({ bank: -300 })
                    }
                ]
            },
            {
                id: 'fridge_breakdown',

                type: 'crisis',
                monthRange: [8, 38],
                condition: () => gameState.cheeseTypes >= 10,
                unique: true,
                choices: [
                    {
effects: { stress: 25, bank: -1200 },

                    },
                    {
effects: { stress: 20, energy: -20 },
conditionalEffects: () => ({ bank: -600 })
                    }
                ]
            },

            // === INVESTMENT EVENTS (Sacrifice now, compound later) ===
            {
                id: 'producer_visit_lalero',

                type: 'opportunity',
                monthRange: [8, 30],
                condition: () => gameState.cheeseTypes >= 10 && gameState.autonomy >= 30,
                unique: true,
                choices: [
                    {
effects: { bank: -2000, stress: 15, energy: -10 },
flags: { producerVisits: (gameState.producerVisits || 0) + 1 },
conditionalEffects: () => ({ cheeseExpertise: 15, reputation: 4, supplierDiscount: 3, producerRelationships: 10, cheeseTypes: gameState.cheeseTypes + 8 })
                    },
                    {
effects: { stress: 5 },

                        condition: () => gameState.hasHenry,
conditionalEffects: () => ({ autonomy: 10, cheeseExpertise: 8 })
                    },
                    {
effects: { stress: 5 },

                    }
                ]
            },
            {
                id: 'cheese_course',

                type: 'opportunity',
                monthRange: [10, 28],
                condition: () => gameState.cheeseTypes >= 15 && gameState.cheeseExpertise < 30 && gameState.autonomy >= 35,
                unique: true,
                choices: [
                    {
effects: { bank: -1500, stress: 10 },
conditionalEffects: () => ({ cheeseExpertise: 25, reputation: 5, autonomy: 5, cheeseTypes: gameState.cheeseTypes + 6 })
                    },
                    {
effects: { stress: -5 },
conditionalEffects: () => ({ cheeseExpertise: 5 })
                    }
                ]
            },
            {
                id: 'bulk_supplier_deal',

                type: 'opportunity',
                monthRange: [12, 36],
                condition: () => gameState.cheeseTypes >= 20 && gameState.bank >= 6000,
                unique: true,
                choices: [
                    {
effects: { bank: -4000, stress: 5 },
conditionalEffects: () => ({ supplierDiscount: (gameState.supplierDiscount || 0) + 2 })
                    },
                    {
effects: { stress: 10 },
conditionalEffects: () => ({ supplierDiscount: (gameState.supplierDiscount || 0) + 1, autonomy: -5 })
                    },
                    {
effects: {},

                    }
                ]
            },
            {
                id: 'staff_training',

                type: 'decision',
                monthRange: [8, 35],
                condition: () => gameState.hasLucas && gameState.autonomy < 50,
                unique: true,
                choices: [
                    {
effects: { energy: -20, stress: 10 },
conditionalEffects: () => ({ autonomy: 20, reputation: 5 })
                    },
                    {
effects: { stress: 5 },
conditionalEffects: () => ({ autonomy: 5 })
                    }
                ]
            },

            // === PERSONAL LIFE EVENTS ===
            {
                id: 'sleep_problems',

                type: 'personal',
                monthRange: [6, 40],
                condition: () => gameState.stress > 50,
                unique: true,
                choices: [
                    {
effects: { stress: 15, energy: -20 },

                    },
                    {
effects: { stress: -5, bank: -100 },

                    },
                    {
effects: { stress: -10, energy: 5 },

                        condition: () => gameState.hasDog
                    }
                ]
            },
            {
                id: 'relationship_tension',

                type: 'personal',
                monthRange: [8, 35],
                condition: () => gameState.family < 60 && gameState.stress > 40,
                unique: true,
                choices: [
                    {
effects: { stress: 10, family: 15, bank: -1500 },

                    },
                    {
effects: { stress: -5, family: -10 },

                    },
                    {
effects: { family: 25, bank: -2500 },

                        condition: () => gameState.hasLucas
                    }
                ]
            },
            {
                id: 'friend_needs_help',

                type: 'personal',
                monthRange: [10, 38],
                choices: [
                    {
effects: { stress: 10, energy: -10, family: 10 },

                    },
                    {
effects: { stress: 5 },

                    }
                ]
            },

            // === CUSTOMER CHALLENGES ===
            {
                id: 'bad_review',

                type: 'crisis',
                monthRange: [5, 40],
                unique: true,
                choices: [
                    {
effects: { stress: -5 },
conditionalEffects: () => ({ reputation: 5 })
                    },
                    {
effects: { stress: 10 },

                    },
                    {
effects: { stress: 5, energy: -5 },
conditionalEffects: () => ({ reputation: 4 })
                    }
                ]
            },
            {
                id: 'difficult_customer',

                type: 'crisis',
                monthRange: [3, 40],
                unique: true,
                choices: [
                    {
effects: { stress: 10, bank: -25 },

                    },
                    {
effects: { stress: 15, energy: -5 },
conditionalEffects: () => ({ reputation: -3 })
                    },
                    {
effects: { stress: 5 },
conditionalEffects: () => ({ reputation: 2 })
                    }
                ]
            },
            {
                id: 'regular_moves_away',

                type: 'personal',
                monthRange: [15, 40],
                unique: true,
                choices: [
                    {
effects: { bank: -80, family: 10 },

                    },
                    {
effects: { stress: 5 },

                    }
                ]
            },
            {
                id: 'theft_incident',

                type: 'crisis',
                monthRange: [8, 40],
                unique: true,
                choices: [
                    {
effects: { stress: 20 },
conditionalEffects: () => ({ reputation: -5 })
                    },
                    {
effects: { stress: 10, bank: -200 },

                    },
                    {
effects: { stress: 15 },

                    }
                ]
            },

            // === YOUR VISION - PROACTIVE STORY EVENTS ===
            // These are about YOU shaping the shop's identity, not reacting to problems

            {
                id: 'signature_cheese',

                type: 'milestone',
                monthRange: [18, 35],
                condition: () => gameState.cheeseTypes >= 40 && gameState.producerRelationships >= 10,
                unique: true,
                priority: 80,
                choices: [
                    {
effects: { bank: -2000, stress: 10 },
flags: { hasSignatureCheese: true },
conditionalEffects: () => ({ reputation: 12, cheeseTypes: gameState.cheeseTypes + 1 })
                    },
                    {
effects: { stress: -5 },
conditionalEffects: () => ({ autonomy: 5 })
                    }
                ]
            },
            {
                id: 'shop_philosophy',

                type: 'decision',
                monthRange: [12, 25],
                condition: () => gameState.cheeseTypes >= 20,
                unique: true,
                priority: 75,
                choices: [
                    {
effects: { stress: -5 },
flags: { shopPhilosophy: 'accessible' },
conditionalEffects: () => ({ reputation: 8, family: 5 })
                    },
                    {
effects: { energy: -5 },
flags: { shopPhilosophy: 'education' },
conditionalEffects: () => ({ reputation: 10, cheeseExpertise: 10 })
                    },
                    {
effects: {},
flags: { shopPhilosophy: 'connection' },
conditionalEffects: () => ({ family: 10, reputation: 6 })
                    }
                ]
            },
            {
                id: 'mentor_opportunity',

                type: 'opportunity',
                monthRange: [10, 28],
                condition: () => gameState.cheeseTypes >= 15 && !gameState.hasMentor,
                unique: true,
                priority: 85,
                choices: [
                    {
effects: { energy: -5 },
flags: { hasMentor: true },
conditionalEffects: () => ({ cheeseExpertise: 20, autonomy: 10, reputation: 5 })
                    },
                    {
effects: {},
conditionalEffects: () => ({ autonomy: 8 })
                    }
                ]
            },
            {
                id: 'neighborhood_collab',

                type: 'opportunity',
                monthRange: [14, 30],
                condition: () => gameState.reputation >= 50,
                unique: true,
                priority: 70,
                choices: [
                    {
effects: { stress: 5 },
flags: { inNeighborhoodCollective: true },
conditionalEffects: () => ({ reputation: 8, bank: 2000 })
                    },
                    {
effects: {},
conditionalEffects: () => ({ autonomy: 10 })
                    }
                ]
            },
            {
                id: 'cookbook_idea',

                type: 'decision',
                monthRange: [20, 38],
                condition: () => gameState.cheeseTypes >= 50 && gameState.reputation >= 60,
                unique: true,
                priority: 65,
                choices: [
                    {
effects: { bank: -1500, stress: 15, energy: -10 },
flags: { hasCookbook: true },
conditionalEffects: () => ({ reputation: 10, family: 5, bank: 3000 })
                    },
                    {
effects: {},

                    }
                ]
            },
            {
                id: 'seasonal_ritual',

                type: 'decision',
                monthRange: [8, 20],
                unique: true,
                priority: 70,
                choices: [
                    {
effects: { bank: -500, stress: 10 },
flags: { hasBeaufortSeason: true },
conditionalEffects: () => ({ reputation: 6 })
                    },
                    {
effects: { bank: -800, stress: 10 },
flags: { hasFromageVendanges: true },
conditionalEffects: () => ({ reputation: 6 })
                    },
                    {
effects: { energy: -10 },
flags: { hasCheeseSchool: true },
conditionalEffects: () => ({ reputation: 8, cheeseExpertise: 5 })
                    }
                ]
            },
            {
                id: 'lucas_growth',

                type: 'decision',
                monthRange: [28, 40],  // After Lucas joins around month 27
                condition: () => gameState.hasLucas && gameState.lucasMonthsWorked >= 2,
                unique: true,
                priority: 75,
                choices: [
                    {
effects: { stress: -5 },
flags: { lucasSocialMedia: true },
conditionalEffects: () => ({ reputation: 10, autonomy: 8 })
                    },
                    {
effects: {},
conditionalEffects: () => ({ autonomy: 3 })
                    }
                ]
            },
            {
                id: 'your_counter_story',

                type: 'decision',
                monthRange: [15, 35],
                condition: () => gameState.producerVisits >= 1,
                unique: true,
                priority: 68,
                choices: [
                    {
effects: { energy: -10, bank: -200 },
flags: { hasStoryCards: true },
conditionalEffects: () => ({ reputation: 6, cheeseExpertise: 5 })
                    },
                    {
effects: {},

                    }
                ]
            },
            {
                id: 'expansion_dream',

                type: 'milestone',
                monthRange: [28, 40],
                condition: () => gameState.bank >= 80000 && gameState.reputation >= 80 && gameState.hasHenry && !gameState.ownsBuilding,
                unique: true,
                priority: 90,
                choices: [
                    {
effects: { bank: -40000, stress: 30, energy: -20 },
flags: { hasSecondShop: true },
conditionalEffects: () => ({ reputation: 15, autonomy: -15, family: -10 })
                    },
                    {
effects: { stress: -10 },
flags: { declinedExpansion: true },
conditionalEffects: () => ({ family: 15, autonomy: 10 })
                    }
                ]
            },
            {
                id: 'documentary_approach',

                type: 'opportunity',
                monthRange: [24, 40],
                condition: () => gameState.cheeseTypes >= 60 && gameState.reputation >= 75,
                unique: true,
                priority: 75,
                choices: [
                    {
effects: { stress: 15, energy: -10 },
flags: { hasDocumentary: true },
conditionalEffects: () => ({ reputation: 12, family: 10 })
                    },
                    {
effects: {},
conditionalEffects: () => ({ autonomy: 5 })
                    }
                ]
            },
            {
                id: 'charity_choice',

                type: 'decision',
                monthRange: [10, 35],
                condition: () => gameState.cheeseTypes >= 30,
                unique: true,
                priority: 60,
                choices: [
                    {
effects: { bank: -100 },
flags: { foodBankPartner: true },
conditionalEffects: () => ({ reputation: 6, family: 5 })
                    },
                    {
effects: { energy: -10 },
flags: { schoolProgram: true },
conditionalEffects: () => ({ reputation: 8 })
                    },
                    {
effects: { energy: -15, bank: -100, stress: 10 },
flags: { foodBankPartner: true, schoolProgram: true },
conditionalEffects: () => ({ reputation: 12, family: 8 })
                    }
                ]
            },
            {
                id: 'naming_ceremony',

                type: 'decision',
                monthRange: [6, 15],
                condition: () => gameState.shopRenamed,
                unique: true,
                priority: 65,
                choices: [
                    {
effects: { bank: -800 },
flags: { hasNewSign: true, signInstalled: true },
conditionalEffects: () => ({ reputation: 5 })
                    },
                    {
effects: {},
conditionalEffects: () => ({ autonomy: 3 })
                    }
                ]
            },
            {
                id: 'special_order',

                type: 'opportunity',
                monthRange: [15, 38],
                condition: () => gameState.cheeseExpertise >= 15 || gameState.producerRelationships >= 15,
                unique: true,
                priority: 72,
                choices: [
                    {
effects: { energy: -15, stress: 10 },
conditionalEffects: () => ({ reputation: 8, producerRelationships: 5, bank: 500 })
                    },
                    {
effects: {},
conditionalEffects: () => ({ autonomy: 3 })
                    }
                ]
            },

            // === BURNOUT ARC ===
            {
                id: 'sunday_burnout',

                type: 'crisis',
                monthRange: [10, 18],
                condition: () => gameState.openSunday && (gameState.energy < 40 || gameState.stress > 70),
                choices: [
                    {
effects: { energy: 50, stress: -40, family: 20, bank: -5000 },
flags: { burnoutCrashed: true, openSunday: false },
conditionalEffects: () => ({ salesPenalty: 8000 })
                    },
                    {
effects: { energy: -20, stress: 20, family: -25 },
conditionalEffects: () => ({ reputation: -10, healthPenalty: true })
                    }
                ]
            },
            {
                id: 'stop_sunday',

                type: 'decision',
                monthRange: [12, 25],
                condition: () => gameState.openSunday && gameState.burnoutCrashed,
                choices: [
                    {
effects: { stress: -20, energy: 15, family: 20, bank: -1200 },
flags: { openSunday: false }
                    },
                    {
effects: { stress: 5, bank: -800 },
conditionalEffects: () => ({ autonomy: 10 })
                    }
                ]
            },

            // === HIRING: LUCAS ===
            {
                id: 'meet_lucas',

                type: 'hiring',
                monthRange: [27, 28],  // Reality: Sept 2024 = Month 27 - MANDATORY
                mandatory: true,  // Lucas is essential to the story
                unique: true,
                condition: () => !gameState.hasLucas && !gameState.hasHenry,
                choices: [
                    {
effects: { bank: -1200, stress: -10, energy: 15 },
flags: { hasLucas: true },
conditionalEffects: () => ({ reputation: 5, autonomy: 15 })
                    },
                    {
effects: { stress: 10, energy: -10 },
conditionalEffects: () => ({ employeeSearching: true })
                    },
                    {
effects: { stress: 15, energy: -10, family: -10 },

                    }
                ]
            },
            {
                id: 'lucas_brings_henry',

                type: 'hiring',
                monthRange: [39, 42],  // Nov 2025 = month 41 (real timeline), window from Sep–Dec 2025
                priority: 85,  // High priority - important hire event
                condition: () => gameState.hasLucas && gameState.lucasMonthsWorked >= 12 && !gameState.hasHenry,  // 12+ months with Lucas (he joins ~month 27, so met from month 39)
                choices: [
                    {
effects: { bank: -1500, stress: -20, energy: 25 },
flags: { hasHenry: true },
conditionalEffects: () => ({ autonomy: 25, family: 15 })
                    },
                    {
effects: { stress: 10 },

                    }
                ]
            },
            // Alternative hiring path if you missed Lucas - LATE GAME BACKUP ONLY
            {
                id: 'direct_hire_help',

                type: 'hiring',
                monthRange: [26, 40],
                priority: 70,
                unique: true,
                condition: () => !gameState.hasLucas && !gameState.hasHenry && !gameState.directHireEventSeen && gameState.stress > 50 && gameState.monthsPlayed >= 24,
                choices: [
                    {
effects: { bank: -1600, stress: -15, energy: 20 },
flags: { hasHenry: true, directHireEventSeen: true },
conditionalEffects: () => ({ autonomy: 20, family: 10 })
                    },
                    {
effects: { bank: -900, stress: -8, energy: 10 },
flags: { hasLucas: true, directHireEventSeen: true },
conditionalEffects: () => ({ autonomy: 10 })
                    },
                    {
effects: { stress: 15, energy: -15, family: -10 },
flags: { directHireEventSeen: true }
                    }
                ]
            },
            {
                id: 'student_trap',

                type: 'decision',
                monthRange: [5, 30],
                unique: true,
                choices: [
                    {
effects: { bank: -400, stress: 5 },
flags: { studentHired: true },
conditionalEffects: () => ({ decemberPenalty: true })
                    },
                    {
effects: { stress: 10 },

                    }
                ]
            },

            // === PEAK ENERGY REWARD EVENT ===
            {
                id: 'peak_performance',

                type: 'opportunity',
                monthRange: [13, 42],
                // Triggers when energy is within 10% of your max cap (accounting for burnout damage)
                // So if max is 100, need 90+. If max is 80 (1 burnout), need 72+
                condition: () => gameState.energy >= (gameState.maxEnergyCap * 0.9) && Math.random() < 0.5,
                recurring: true,
                cooldown: 8,  // Can only trigger every 8 months
                priority: 80,
                choices: [
                    {
effects: { energy: -15, stress: -10 },
conditionalEffects: () => ({ reputation: 5, autonomy: 5 })
                    },
                    {
effects: { energy: -20, bank: -300 },
conditionalEffects: () => ({ reputation: 8, cheeseTypes: gameState.cheeseTypes + 3, producerRelationships: gameState.producerRelationships + 10 })
                    },
                    {
effects: { energy: -10, bank: -2200 },
conditionalEffects: () => ({ family: 20, stress: -15 })
                    },
                    {
effects: { stress: -5 },
conditionalEffects: () => ({ reputation: 2 })
                    }
                ]
            },

            // === THE DOG === (MANDATORY - Poncho is essential to the story!)
            {
                id: 'adopt_dog',

                type: 'personal',
                monthRange: [14, 16],  // Reality: Sept 2023 = Month 15 - TIGHT WINDOW to ensure it fires
                mandatory: true,  // GUARANTEED to appear - Poncho is THE story moment!
                unique: true,
                condition: () => !gameState.hasDog,
                choices: [
                    {
effects: { bank: -1800, energy: -25, stress: 15 },
flags: { hasDog: true, dogBreed: 'aussie' },
conditionalEffects: () => ({ family: 30, reputation: 3, stress: -20 })
                    },
                    {
effects: { family: -10, stress: 5 },

                    }
                ]
            },
            {
                id: 'dog_in_shop',

                type: 'opportunity',
                monthRange: [16, 35],  // A few months after Poncho adoption
                condition: () => gameState.hasDog && gameState.dogMonth > 3,
                choices: [
                    {
effects: { stress: -15, family: 10, energy: -10, bank: -800 },
conditionalEffects: () => ({ reputation: 5 })
                    },
                    {
effects: { family: 5, energy: 5 },

                    }
                ]
            },
            // Poncho cheese emergency - the cone of shame
            {
                id: 'poncho_cheese_emergency',

                type: 'crisis',
                monthRange: [18, 36],
                priority: 90,
                unique: true,
                condition: () => gameState.hasDog && !gameState.ponchoSurgery && gameState.cheeseTypes >= 20,
                choices: [
                    {
effects: { bank: -2500, stress: 30, energy: -20 },
flags: { ponchoSurgery: true },
conditionalEffects: () => ({ family: 15 })
                    },
                    {
effects: { stress: 40, energy: -30 },
flags: { ponchoSurgery: true },
conditionalEffects: () => ({ bank: -4000, family: -10 })
                    }
                ]
            },
            // Poncho's 1 year anniversary
            {
                id: 'poncho_anniversary',

                type: 'milestone',
                monthRange: [26, 28], // Around September 2024 - ~1 year after adoption (wider window to avoid collision with meet_lucas)
                condition: () => gameState.hasDog,
                mandatory: true,
                unique: true,
                choices: [
                    {
effects: { stress: -10, family: 10 },
flags: { ponchoAnniversary: true }
                    }
                ]
            },

            // === THE BUILDING ===
            {
                id: 'building_offer',

                type: 'milestone',
                monthRange: [17, 18], // November 2023
                mandatory: true, // THIS EVENT MUST HAPPEN
                unique: true,
                choices: [
                    {
effects: { stress: 20, energy: -10 },
flags: { buildingOfferReceived: true }
                    },
                    {
effects: { stress: 20 },
flags: { buildingOfferReceived: true },
conditionalEffects: () => ({ buildingDeadlineExtended: 2 })
                    },
                    {
effects: { stress: 15, family: 5 },
conditionalEffects: () => ({ futureRentIncrease: true })
                    }
                ]
            },
            {
                id: 'building_countdown',

                description: () => `Building fund: €${gameState.bank.toLocaleString()}. Target: €80,000. Deadline: July 2024. Every decision now has one question: does this help or hurt the building fund?`,
                type: 'milestone',
                monthRange: [19, 24],
                condition: () => gameState.buildingOfferReceived && !gameState.ownsBuilding,
                recurring: true,
                cooldown: 2,
                choices: [
                    {
effects: { stress: 15, reputation: -3 },
conditionalEffects: () => ({ savingsBoost: 2000 })
                    },
                    {
effects: { stress: 10 },
conditionalEffects: () => ({ savingsBoost: 1000 })
                    }
                ]
            },
            {
                id: 'building_deadline',

                description: () => `The deadline is here. You need €80,000 for the down payment. You have €${Math.floor(gameState.bank).toLocaleString()}.`,
                type: 'milestone',
                monthRange: [25, 25],
                condition: () => gameState.buildingOfferReceived && !gameState.ownsBuilding && !gameState.buildingDelayPaid,
                mandatory: true, // THIS EVENT MUST HAPPEN
                unique: true,
                dynamicChoices: true, // Choices depend on current bank
                getChoices: function() {
                    const canAfford = gameState.bank >= gameState.buildingCost;
                    const choices = [];

                    if (canAfford) {
                        choices.push({

                            hint: `Pay €${gameState.buildingCost.toLocaleString()} - this is it`,
effects: { bank: -gameState.buildingCost, stress: -20, energy: 20 },
flags: { ownsBuilding: true },
conditionalEffects: () => ({ reputation: 5, family: 10 })
                        });
                    }

                    // Option to delay by 1 month - penalty paid AFTER purchase; family chips in €3,000
                    if (!canAfford) {
                        choices.push({

                            hint: `Get one more month - €5,000 penalty due at purchase; your family chips in €3,000 to help`,
effects: { stress: 20, bank: 3000 },
flags: { buildingDelayPaid: true, buildingPenaltyOwed: true }
                        });
                    }

                    // No loan option - it's €80k cash or nothing
                    choices.push({
                        text: canAfford ? 'Let it go anyway' : 'Watch it slip away',
                        hint: canAfford ? 'Maybe freedom isn\'t owning property' : `You needed €80,000. You have €${Math.floor(gameState.bank).toLocaleString()}.`,
effects: { stress: canAfford ? 5 : 25, family: canAfford ? 0 : -10 },
                        outcome: canAfford
                            ? 'You chose not to buy. The building sold to someone else. You\'ll keep renting—but also keep your savings and flexibility.'
                            : 'You couldn\'t make the numbers work. The building sold to someone else. You\'ll keep renting. Keep vulnerable.',
conditionalEffects: () => ({ futureRentIncrease: true })
                    });

                    return choices;
                }
            },
            {
                id: 'building_deadline_extended',

                description: () => `The extended deadline is here. You need €80,000 for the down payment, plus the €5,000 delay penalty (total €85,000 at closing). You have €${Math.floor(gameState.bank).toLocaleString()}.`,
                type: 'milestone',
                monthRange: [26, 26],
                condition: () => gameState.buildingDelayPaid && !gameState.ownsBuilding,
                mandatory: true,
                unique: true,
                dynamicChoices: true,
                getChoices: function() {
                    // Base cost is €80k, penalty is €5k
                    const baseCost = gameState.buildingCost; // 80000
                    const penalty = 5000;
                    const totalWithPenalty = baseCost + penalty; // 85000

                    // Can buy if you have at least €80k (the base cost)
                    const canAfford = gameState.bank >= baseCost;
                    // Pay the full €85k if you have it, otherwise pay what you have (minimum €80k)
                    const actualPayment = Math.min(gameState.bank, totalWithPenalty);
                    const choices = [];

                    if (canAfford) {
                        const isStruggling = gameState.bank < totalWithPenalty;
                        choices.push({

                            hint: isStruggling
                                ? `Scrape together €${Math.floor(actualPayment).toLocaleString()} - every last euro you have`
                                : `Pay €${totalWithPenalty.toLocaleString()} (€80k + €5k penalty) - this is it`,
effects: { bank: -actualPayment, stress: isStruggling ? -10 : -20, energy: 20 },
                            outcome: isStruggling
                                ? 'You signed. It took every euro you had—the penalty ate into your savings completely. But you made it. The building is yours. You\'ll rebuild from zero, but it\'s YOUR zero now.'
                                : 'You signed. The €5,000 penalty stung—coming right out of your fresh savings from that extra month. But you made it. The building is yours. Worth every euro.',
flags: { ownsBuilding: true, buildingPenaltyOwed: false },
conditionalEffects: () => ({ reputation: 5, family: 10 })
                        });
                    }

                    // No more extensions
                    choices.push({
                        text: canAfford ? 'Let it go anyway' : 'Watch it slip away',
                        hint: canAfford ? 'Maybe freedom isn\'t owning property' : `You needed at least €80,000. You have €${Math.floor(gameState.bank).toLocaleString()}.`,
effects: { stress: canAfford ? 5 : 30, family: canAfford ? 0 : -15 },
                        outcome: canAfford
                            ? 'You chose not to buy. The building sold to someone else. You\'ll keep renting—but also keep your savings.'
                            : 'Even with the extra month, you couldn\'t make the €80,000 minimum. The building sold to someone else. You\'ll keep renting.',
conditionalEffects: () => ({ futureRentIncrease: true })
                    });

                    return choices;
                }
            },

            // === THE SIGN TEMPTATION ===
            {
                id: 'fancy_sign',

                type: 'decision',
                monthRange: [8, 30],
                condition: () => !gameState.signInstalled,
                choices: [
                    {
effects: { bank: -2000, stress: 15 },
flags: { signInstalled: true },
conditionalEffects: () => ({ reputation: 5, salesBoost: 1500 })
                    },
                    {
effects: { stress: -5 },
conditionalEffects: () => ({ autonomy: 5 })
                    }
                ]
            },

            // === PRODUCER VISITS ===
            {
                id: 'producer_opportunity',

                type: 'opportunity',
                monthRange: [10, 40],
                condition: () => gameState.autonomy >= 20 || gameState.hasLucas,
                unique: true,
                choices: [
                    {
effects: { energy: -10, family: 5 },
conditionalEffects: () => ({
                            reputation: 4,
                            producerVisits: gameState.producerVisits + 1,
                            salesBoost: 800
                        })
                    },
                    {
effects: { stress: 5 },

                        condition: () => gameState.autonomy < 20 && !gameState.hasLucas
                    },
                    {
effects: { bank: -100 },
conditionalEffects: () => ({ reputation: 5, autonomy: 5 }),
                        condition: () => gameState.hasLucas
                    }
                ]
            },

            // === DELEGATION ===
            {
                id: 'delegation_moment',

                type: 'personal',
                monthRange: [28, 40],
                condition: () => gameState.hasLucas && gameState.autonomy < 50,
                choices: [
                    {
effects: { stress: -15, energy: 20, family: 15, bank: -2000 },
conditionalEffects: () => ({ autonomy: 25 })
                    },
                    {
effects: { stress: 10, energy: -10, family: -10 },

                    }
                ]
            },
            {
                id: 'take_holiday',

                type: 'personal',
                monthRange: [20, 40],
                condition: () => gameState.autonomy >= 30,
                unique: true,
                choices: [
                    {
effects: { energy: 40, stress: -30, family: 25, bank: -6000 },
conditionalEffects: () => ({ holidaysTaken: gameState.holidaysTaken + 1, autonomy: 10 })
                    },
                    {
effects: { energy: 15, stress: -10, family: 10, bank: -2500 },

                    },
                    {
effects: { stress: 10, family: -15 },

                    }
                ]
            },

            // === RECURRING ===
            {
                id: 'december_rush',

                type: 'opportunity',
                monthRange: [6, 42],
                condition: () => gameState.month === 12,
                choices: [
                    {
effects: { energy: -35, stress: 20 },
conditionalEffects: () => ({
                            salesBoost: 15000 + gameState.cheeseTypes * 50 + gameState.reputation * 50,
                            decemberBonus: true
                        })
                    },
                    {
effects: { energy: -10, stress: 5 },
conditionalEffects: () => ({
                            salesBoost: 8000 + gameState.cheeseTypes * 30 + gameState.reputation * 30
                        })
                    }
                ]
            },
            {
                id: 'family_dinner',

                type: 'personal',
                monthRange: [1, 42],
                unique: true,
                choices: [
                    {
effects: { family: 15, energy: 10 },
conditionalEffects: () => (gameState.openSunday ? { salesPenalty: 1000 } : {})
                    },
                    {
effects: { family: -15, stress: 10, autonomy: 5 },

                    }
                ]
            },

            // === LIFE VS SHOP EVENTS ===
            {
                id: 'the_invitation',

                type: 'personal',
                monthRange: [8, 18],
                condition: () => gameState.family >= 40,
                unique: true,
                priority: 80,
                choices: [
                    {
effects: { bank: -2000, stress: 15 },
conditionalEffects: () => ({ family: 10 })
                    },
                    {

                        condition: () => gameState.hasLucas || gameState.hasHenry,
effects: { stress: 10, bank: -800 },
conditionalEffects: () => ({ family: 3 })
                    },
                    {
effects: { family: -20, stress: 5 },
flags: { skippedWedding: true }
                    }
                ]
            },
            {
                id: 'hospital_call',

                type: 'crisis',
                monthRange: [17, 18],  // December of year 2
                unique: true,
                priority: 150,
                choices: [
                    {
effects: { bank: -4000, stress: 20, reputation: -10 },
conditionalEffects: () => ({ family: 20 })
                    },
                    {
effects: { stress: 35, energy: -30, family: 5 },

                    },
                    {
effects: { family: -25, stress: 15 },

                    }
                ]
            },
            {
                id: 'old_friend',

                type: 'personal',
                monthRange: [6, 30],
                unique: true,
                choices: [
                    {
effects: { energy: -25, family: 10, stress: -10 },

                    },
                    {
effects: { family: 5, reputation: 3 },

                    },
                    {
effects: { family: -10 },

                    }
                ]
            },
            {
                id: 'birthday_forgot',

                type: 'crisis',
                monthRange: [12, 36],
                condition: () => gameState.stress >= 50,
                unique: true,
                priority: 90,
                choices: [
                    {
effects: { family: -10, stress: 10 },

                    },
                    {
effects: { family: -15, bank: -100 },

                    }
                ]
            },
            {
                id: 'christmas_day',

                type: 'personal',
                monthRange: [42, 42], // December 2025 - MANDATORY fourth Christmas (finale)
                mandatory: true,
                unique: true,
                choices: [
                    {
effects: { family: 15, stress: 10 },

                    },
                    {
effects: { stress: -5, family: -10, energy: -10 },

                    },
                    {
effects: { family: -30, stress: -15, autonomy: 5 },
flags: { workedChristmas: true }
                    }
                ]
            },

            // === HIDDEN ENDING EVENT: SECOND SHOP ===
            {
                id: 'second_shop_offer',

                type: 'opportunity',
                monthRange: [36, 42],
                condition: () => gameState.bank >= 80000 && !gameState.ownsBuilding,
                unique: true,
                priority: 200, // Very high priority - must happen if conditions are met
                choices: [
                    {
effects: { bank: -60000, stress: 10 },
flags: { hasSecondShop: true }
                    },
                    {
effects: { stress: -10 },
flags: { declinedExpansion: true }
                    }
                ]
            },

// === STRATEGIC CHOICE EVENTS (One-time decisions about how to run your business) ===
            {
                id: 'systems_project',

                type: 'strategy',
                monthRange: [8, 25],
                unique: true,
                priority: 70,
                choices: [
                    {
effects: { stress: 5, energy: -10, bank: -200 },
conditionalEffects: () => ({ autonomy: 8 })
                    },
                    {
effects: { bank: -300, stress: -8 },
conditionalEffects: () => ({ energy: 5 })
                    },
                    {
effects: { stress: 5 },

                    }
                ]
            },
            {
                id: 'visibility_push',

                type: 'strategy',
                monthRange: [6, 20],
                unique: true,
                priority: 70,
                choices: [
                    {
effects: { stress: 10, energy: -15, bank: -150 },
conditionalEffects: () => ({ reputation: 6 })
                    },
                    {
effects: { stress: -5, energy: -10, bank: -100 },
conditionalEffects: () => ({ reputation: 3, cheeseExpertise: 3 })
                    },
                    {
effects: { stress: -5 },

                    }
                ]
            },
            {
                id: 'personal_recharge',

                type: 'strategy',
                monthRange: [10, 28],
                unique: true,
                priority: 70,
                choices: [
                    {
effects: { bank: -150, energy: -5 },
conditionalEffects: () => ({ stress: -8, producerRelationships: 5, supplierDiscount: 1 })
                    },
                    {
effects: { bank: -200, stress: -10 },
conditionalEffects: () => ({ family: 12, energy: 10 })
                    },
                    {
effects: { stress: 8, autonomy: 3 },

                    }
                ]
            },

// === MORE STRATEGIC CHOICE EVENTS ===
            {
                id: 'pricing_strategy',

                type: 'strategy',
                monthRange: [12, 30],
                unique: true,
                priority: 70,
                condition: () => gameState.cheeseTypes >= 15,
                choices: [
                    {
effects: { stress: 5 },
conditionalEffects: () => ({ bank: 800, reputation: 5 })
                    },
                    {
effects: { stress: 3 },
conditionalEffects: () => ({ reputation: 8, family: 3 })
                    },
                    {
effects: { stress: 8, energy: -5 },
conditionalEffects: () => ({ bank: 400, reputation: 4, autonomy: 3 })
                    }
                ]
            },
            {
                id: 'supplier_relationship',

                type: 'strategy',
                monthRange: [14, 32],
                unique: true,
                priority: 65,
                condition: () => gameState.cheeseTypes >= 20,
                choices: [
                    {
effects: { stress: -5 },
conditionalEffects: () => ({ bank: 600, autonomy: 5 })
                    },
                    {
effects: { stress: 8, energy: -8 },
conditionalEffects: () => ({ reputation: 8, cheeseTypes: 5 })
                    },
                    {
effects: {},

                    }
                ]
            },
            {
                id: 'weekly_rhythm',

                type: 'strategy',
                monthRange: [10, 26],
                unique: true,
                priority: 65,
                choices: [
                    {
effects: { stress: 10, energy: -10, bank: -200 },
conditionalEffects: () => ({ reputation: 6, autonomy: 5 })
                    },
                    {
effects: { stress: -8 },
conditionalEffects: () => ({ autonomy: 8, energy: 5 })
                    },
                    {
effects: { stress: 3 },

                    }
                ]
            },
            {
                id: 'learning_investment',

                type: 'strategy',
                monthRange: [18, 36],
                unique: true,
                priority: 60,
                condition: () => gameState.cheeseTypes >= 25,
                choices: [
                    {
effects: { bank: -800, stress: 15, energy: -20 },
conditionalEffects: () => ({ reputation: 10, cheeseTypes: 8, autonomy: 5 })
                    },
                    {
effects: { bank: -600, stress: -5, energy: -10 },
conditionalEffects: () => ({ reputation: 6, cheeseTypes: 5, family: -5 })
                    },
                    {
effects: { stress: 3 },
conditionalEffects: () => ({ cheeseTypes: 2 })
                    }
                ]
            },
            {
                id: 'shop_atmosphere',

                type: 'strategy',
                monthRange: [8, 24],
                unique: true,
                priority: 60,
                choices: [
                    {
effects: { bank: -400, stress: 5, energy: -8 },
conditionalEffects: () => ({ reputation: 5, bank: 200 })
                    },
                    {
effects: { bank: -300, stress: 8, energy: -10 },
conditionalEffects: () => ({ reputation: 6, cheeseTypes: 3 })
                    },
                    {
effects: {},

                    }
                ]
            },

// === MONEY-MAKING OPPORTUNITY EVENTS ===
            {
                id: 'catering_opportunity',

                type: 'opportunity',
                monthRange: [8, 36],
                recurring: true,
                cooldown: 8,
                condition: () => gameState.cheeseTypes >= 15,
                choices: [
                    {
effects: { stress: 8, energy: -10 },
conditionalEffects: () => ({ bank: 2400, reputation: 4 }) // 3 months advance
                    },
                    {
effects: { stress: 3 },
conditionalEffects: () => ({ bank: 1200, reputation: 2 })
                    },
                    {
effects: {},

                    }
                ]
            },
            {
                id: 'private_tasting',

                type: 'opportunity',
                monthRange: [6, 42],
                recurring: true,
                cooldown: 5,
                condition: () => gameState.cheeseTypes >= 20,
                choices: [
                    {
effects: { stress: 12, energy: -15 },
conditionalEffects: () => ({ bank: 600, reputation: 8 })
                    },
                    {
effects: { stress: 5, energy: -8 },
conditionalEffects: () => ({ bank: 300, reputation: 4 })
                    },
                    {
effects: { stress: -3 },

                    }
                ]
            },
            {
                id: 'bulk_order',

                description: () => `A restaurant in ${['Ixelles', 'Etterbeek', 'Uccle'][Math.floor(Math.random() * 3)]} wants to feature your cheeses on their menu. Regular weekly orders, but tight margins.`,
                type: 'opportunity',
                monthRange: [10, 38],
                recurring: true,
                cooldown: 7,
                condition: () => gameState.cheeseTypes >= 25 && gameState.reputation >= 50,
                choices: [
                    {
effects: { stress: 8, energy: -5 },
conditionalEffects: () => ({ bank: 1800, reputation: 6, cheeseTypes: 2 })
                    },
                    {
effects: { stress: 3 },
conditionalEffects: () => ({ bank: 600, reputation: 3 })
                    },
                    {
effects: {},

                    }
                ]
            },
            {
                id: 'market_stall',

                type: 'opportunity',
                monthRange: [6, 30],
                unique: true,
                condition: () => gameState.cheeseTypes >= 15,
                choices: [
                    {
effects: { stress: 15, energy: -12 },
conditionalEffects: () => ({ bank: 1500, reputation: 10, autonomy: -5 })
                    },
                    {
effects: { stress: 8, energy: -8 },
conditionalEffects: () => ({ bank: 800, reputation: 5 })
                    },
                    {
effects: {},

                    }
                ]
            },
            {
                id: 'good_month',

                description: () => `Something clicked this month. Maybe the weather. Maybe word of mouth. Whatever it was, the register kept ringing. You ended up €${1000 + Math.floor(Math.random() * 1500)} ahead of projections.`,
                type: 'milestone',
                monthRange: [8, 40],
                recurring: true,
                cooldown: 6,
                condition: () => gameState.reputation >= 45 && gameState.stress < 70,
                choices: [
                    {
effects: {},
conditionalEffects: () => ({ bank: 1500 + Math.floor(Math.random() * 1000) })
                    },
                    {
effects: { bank: -500 },
conditionalEffects: () => ({ bank: 1000, reputation: 4, autonomy: 3 })
                    },
                    {
effects: { stress: -10 },
conditionalEffects: () => ({ bank: 800, family: 8 })
                    }
                ]
            },

            {
                id: 'quiet_month',

                type: 'routine',
                monthRange: [1, 42],
                recurring: true,  // Can repeat as fallback when no other events available
                choices: [
                    {
effects: { energy: 15, stress: -10 },

                    },
                    {
effects: { energy: -5, stress: 5 },
conditionalEffects: () => ({ reputation: 3, autonomy: 5 })
                    }
                ]
            }
        ];

