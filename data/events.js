// Events database - loaded by index.html
const events = [
            // === CASH CRISIS (triggered when bank hits 0 AND no more supplier grace) ===
            {
                id: 'cash_crisis',
                title: 'No More Grace',
                type: 'crisis',
                monthRange: [1, 42],
                special: 'cash_crisis', // Special flag to identify this event
                choices: [
                    {
                        text: 'Take a bank loan',
                        hint: '6% monthly interest - keeps you afloat',
                        effects: {},
                        outcome: 'The bank approved your loan. The interest rate hurts—6% per month. But the suppliers get paid.',
                        action: 'take_loan'
                    },
                    {
                        text: 'Sell equipment at a loss',
                        hint: 'Lose some capacity but avoid debt',
                        effects: { reputation: -5 },
                        outcome: 'You sold the backup fridge, some shelving. Got less than it was worth, but you avoided the debt spiral.',
                        action: 'sell_equipment'
                    },
                    {
                        text: 'Ask family for help',
                        hint: 'They\'ll help, but it costs something else',
                        effects: { family: -15 },
                        outcome: 'Your family came through. They didn\'t ask for interest. But you saw the worry in their eyes. This weighs on the relationship.',
                        action: 'family_help'
                    }
                ]
            },

            // === MONTH 1: FIRST EVENT - Sunday Decision ===
            {
                id: 'sunday_opening',
                title: 'The Sunday Question',
                description: 'Day one. The previous owner was closed Sundays. But you see other shops open. That\'s a great opportunity. More revenue, more visibility. But also: no days off. Only Mondays... This is your first big decision.',
                type: 'decision',
                monthRange: [1, 1],
                priority: 100,  // Highest priority - must be first
                unique: true,
                choices: [
                    {
                        text: 'Open on Sundays',
                        hint: 'Could be up to 20% more revenue - substantial extra',
                        effects: { stress: 10, energy: -5 },
                        outcome: 'Sundays are busy. Not the busiest, but good. You now work 6 days a week. Only Mondays off.',
                        flags: { openSunday: true }
                    },
                    {
                        text: 'Stay closed on Sundays',
                        hint: 'I\'m not working Sundays!',
                        effects: { stress: -5, family: 5, energy: 5 },
                        outcome: 'You kept Sundays sacred. Your body thanks you. Your family sees you at least one day.',
                        flags: { openSunday: false }
                    }
                ]
            },

            // === MONTH 1: SECOND EVENT - Inventory Discovery ===
            {
                id: 'stock_reality',
                title: 'The Inventory',
                description: 'Two weeks in, you finally finish counting everything. The €38,000 in stock on paper... doesn\'t match reality. Bulk quinoa from 2019. Organic lentils that smell strange. Cacao en poudre nobody wants. The épicerie sèche is dying—sales down 23% industry-wide. Realistically, maybe €10,000 is sellable. The rest is just... there.',
                type: 'crisis',
                monthRange: [1, 2],
                priority: 95,  // Second priority - after Sunday decision
                choices: [
                    {
                        text: 'Progressive liquidation - flea markets, deep discounts',
                        hint: 'It\'s going to be a lot of work...',
                        effects: { stress: 15, energy: -15 },
                        outcome: 'You spent weekends at flea markets. Bulk bins at -70%. The organic rice finally moved. Customers noticed you care. Space cleared for products people actually want—like cheese.',
                        flags: { liquidatedStock: true, fleaMarketDone: true },
                        conditionalEffects: () => ({ reputation: 5, autonomy: 5 })
                    },
                    {
                        text: 'Find a "guy" to take the bulk stuff',
                        hint: 'Someone who buys dead stock, no questions asked',
                        effects: { bank: 1500, stress: 5, energy: -5 },
                        outcome: 'A contact of a contact showed up with a van. Handed you €1,500 for stuff worth €10,000 wholesale. You didn\'t ask questions. Problem solved, but no lessons learned.',
                        flags: { shadyGuyContacted: true, liquidatedStock: true }
                    },
                    {
                        text: 'Keep trying to sell it normally',
                        hint: 'Maybe customers will come around eventually?',
                        effects: { stress: 25, bank: -1000 },
                        outcome: 'You kept the bulk bins. They gathered dust. Products expired. The smell drove customers away. Every month, you threw away more stock and more money.',
                        conditionalEffects: () => ({ reputation: -10, monthlyPenalty: 500 })
                    }
                ]
            },

            // === SHOP IDENTITY ===
            {
                id: 'shop_name',
                title: 'What\'s In a Name?',
                description: 'The shop came with a generic name. But customers have started calling it different things. Some regulars say "Chez Julien" after you. Your friend Alix suggests "Alix Corner" would sound trendier. Maybe it\'s time to make it yours.',
                type: 'decision',
                monthRange: [3, 12],
                condition: () => !gameState.shopRenamed,
                unique: true,
                choices: [
                    {
                        text: '"Chez Julien" - embrace what customers already call it',
                        hint: 'Personal touch, customers feel connected',
                        effects: { stress: -5 },
                        outcome: 'You painted "Chez Julien" on the window. Regulars smiled—"Finally! That\'s what we\'ve been calling it anyway." It felt right.',
                        flags: { shopRenamed: true, shopName: 'Chez Julien' },
                        conditionalEffects: () => ({ reputation: 5 })
                    },
                    {
                        text: '"Alix Corner" - modern and trendy',
                        hint: 'Fresh branding, might attract new crowd',
                        effects: { bank: -200 },
                        outcome: 'The new sign looks professional. Some regulars are confused. "Who\'s Alix?" New customers seem to like it though.',
                        flags: { shopRenamed: true, shopName: 'Alix Corner' },
                        conditionalEffects: () => ({ reputation: 5 })
                    },
                    {
                        text: 'Keep the current name',
                        hint: 'No need to change what works',
                        effects: {},
                        outcome: 'You kept things as they were. Names matter less than what you do anyway.',
                        flags: { shopRenamed: true }
                    }
                ]
            },

            // === INSURANCE DECISION (Mandatory Early Event) ===
            {
                id: 'insurance_decision',
                title: 'The Insurance Question',
                description: 'Your accountant sends you the annual insurance renewal. "Shop insurance covers fire, theft... but comprehensive coverage including flood and water damage is €1,800/year extra. Most shop owners skip it—it\'s expensive and floods are rare in this area." She shrugs. "Your call."',
                type: 'decision',
                monthRange: [2, 4],
                condition: () => !gameState.insuranceDecisionMade,
                unique: true,
                priority: 90,
                choices: [
                    {
                        text: 'Get comprehensive coverage (€1,800/year)',
                        hint: 'Expensive but covers everything',
                        effects: { bank: -1800, stress: -5 },
                        outcome: 'You signed up for full coverage. €150/month, automatically deducted. Peace of mind has a price.',
                        flags: { insuranceDecisionMade: true, hasComprehensiveInsurance: true, monthlyInsurance: 150 }
                    },
                    {
                        text: 'Basic coverage only',
                        hint: 'Save money, hope for the best',
                        effects: { stress: 5 },
                        outcome: 'You went with the basic plan. What are the chances of a flood anyway? The €1,800 stays in your account.',
                        flags: { insuranceDecisionMade: true, hasComprehensiveInsurance: false }
                    }
                ]
            },

            // === FLOOD EVENT (50% chance in summer if insurance decision was made) ===
            {
                id: 'summer_flood',
                title: 'The Flood',
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
                                text: 'File the insurance claim',
                                hint: 'This is why you paid for coverage',
                                effects: { stress: 15, energy: -20 },
                                outcome: 'The insurance adjuster came within 48 hours. They covered most of it: €4,000 for damaged goods, €1,500 for cleanup, plus €1,000 for "business interruption." The deductible stung, but better than paying €18,000 out of pocket.',
                                flags: { floodHappened: true, floodActive: false },
                                conditionalEffects: () => ({ bank: 6500, reputation: 3 }) // Insurance payout (halved v2.3)
                            }
                        ];
                    } else {
                        return [
                            {
                                text: 'Clean up and absorb the loss',
                                hint: 'This will devastate your savings',
                                effects: { stress: 40, energy: -35, family: -15 },
                                outcome: 'A week of cleanup. €18,000 in damaged inventory and equipment. The basement fridge died. Stock ruined. No insurance payout. You watch months of savings drain away. This is the price of gambling on cheap insurance.',
                                flags: { floodHappened: true, floodActive: false },
                                conditionalEffects: () => ({ bank: -18000, reputation: -5 })
                            },
                            {
                                text: 'Ask family for emergency help',
                                hint: 'They can only cover part of this disaster',
                                effects: { stress: 35, energy: -30, family: -25 },
                                outcome: 'Your parents helped with cleanup. Your brother scraped together €5,000. But the damage is €18,000. You still lost €13,000. Family saved you from bankruptcy, but the resentment lingers. You owe them everything now.',
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
                title: 'A Customer\'s Suggestion',
                description: 'A regular customer, Madame Dubois, sighs looking at your bulk bins. "What this neighborhood really needs is good cheese. There\'s nowhere to buy proper fromage around here." She\'s not the first to mention it. You remember the sales analysis: cheese has x2 margins, strong demand, low competition locally.',
                type: 'pivot',
                monthRange: [2, 4],
                condition: () => gameState.cheeseTypes === 0,
                unique: true,
                priority: 95,
                choices: [
                    {
                        text: 'Start with ONE cheese - Tomme Larzac',
                        hint: 'Small investment, test the market',
                        effects: { bank: -300, energy: -10 },
                        outcome: 'You called Lalero, ordered one wheel of Tomme Larzac. Creamy, nutty, crowd-pleaser. It sold out in 3 days. Customers asked: "When will you have more?"',
                        flags: { cheeseTypes: 1 },
                        conditionalEffects: () => ({ reputation: 3, conceptPivotProgress: 10 })
                    },
                    {
                        text: 'Go big - state of the art counter',
                        hint: '€50,000 financed - serious commitment',
                        effects: { bank: -5000, stress: 10, energy: -10 },
                        outcome: 'You bought a €50,000 professional cheese counter. Stunning. The monthly payments are brutal, but this is a statement: you\'re serious about cheese.',
                        flags: { cheeseTypes: 15, hasProCounter: true },
                        conditionalEffects: () => ({ reputation: 10, conceptPivotProgress: 40, monthlyPayment: 800 })
                    },
                    {
                        text: 'Stick to the bulk concept',
                        hint: 'This is what you bought into',
                        effects: { stress: 10 },
                        outcome: 'You doubled down on organic bulk. The neighborhood wanted cheese. They went elsewhere for it.'
                    }
                ]
            },

            // === PRODUCT MIX DECISIONS (Compounding Revenue) ===
            {
                id: 'charcuterie_question',
                title: 'The Charcuterie Question',
                description: 'A customer lingers at the cheese counter. "Do you have any charcuterie? A nice saucisson to go with this Comté?" You don\'t. But Coprosain has excellent Belgian products, and From\'Un carries Italian imports...',
                type: 'decision',
                monthRange: [6, 38],
                condition: () => gameState.cheeseTypes >= 5 && !gameState.hasCharcuterie,
                unique: true,
                priority: 65,
                choices: [
                    {
                        text: 'Add Belgian charcuterie (Coprosain)',
                        hint: 'Local products, good story, modest investment',
                        effects: { bank: -1500, stress: 10 },
                        outcome: 'You called Coprosain. Fuetec, Saucisson d\'Ardèche, Coppa... The Belgian angle resonates with customers. "Local AND delicious."',
                        flags: { hasCharcuterie: true },
                        conditionalEffects: () => ({ reputation: 3, autonomy: -5 })
                    },
                    {
                        text: 'Add Italian imports (premium)',
                        hint: 'Higher margins, premium positioning',
                        effects: { bank: -3000, stress: 15 },
                        outcome: 'Prosciutto di Parma, Bresaola, \'Nduja... The Italian selection draws a new crowd. Higher prices, higher margins.',
                        flags: { hasCharcuterie: true },
                        conditionalEffects: () => ({ reputation: 5 })
                    },
                    {
                        text: 'Stay focused on cheese',
                        hint: 'Simpler operations, deeper expertise',
                        effects: { stress: -5 },
                        outcome: '"We\'re a cheese shop," you explain. The customer nods, respects the focus. Simplicity has its own value.',
                        conditionalEffects: () => ({ autonomy: 10, cheeseExpertise: 5 })
                    }
                ]
            },
            {
                id: 'wine_dilemma',
                title: 'The Wine Dilemma',
                description: '"What wine goes with this cheese?" You get asked this daily. The wine shop on Rue au Bois is good, but... what if you had a small selection here? Cheese and wine together sell better than apart.',
                type: 'decision',
                monthRange: [10, 38],
                condition: () => gameState.cheeseTypes >= 20 && !gameState.hasWineSelection,
                unique: true,
                priority: 65,
                choices: [
                    {
                        text: 'Curated selection (15 bottles)',
                        hint: 'Low risk, complements cheese sales',
                        effects: { bank: -2000, stress: 5 },
                        outcome: 'A small but perfect selection. Côtes du Rhône, Bourgogne, a few surprises. Cheese sales actually increase - pairings work.',
                        flags: { hasWineSelection: true },
                        conditionalEffects: () => ({ reputation: 5 })
                    },
                    {
                        text: 'Serious wine section',
                        hint: 'Big investment, new customer segment, more complexity',
                        effects: { bank: -8000, stress: 20, energy: -15 },
                        outcome: 'You did a wine course, built relationships with importers. The wine section rivals specialty shops. New customers discover you through wine.',
                        flags: { hasWineSelection: true, hasWineEvents: true },
                        conditionalEffects: () => ({ reputation: 6, autonomy: -10 })
                    },
                    {
                        text: 'Partner with the wine shop',
                        hint: 'No investment, mutual referrals',
                        effects: { stress: -5 },
                        outcome: 'You struck a deal with Marie at the wine shop. You recommend each other. No inventory risk, but you share the customer.',
                        conditionalEffects: () => ({ autonomy: 8, reputation: 3 })
                    }
                ]
            },
            {
                id: 'corporate_opportunity',
                title: 'The Corporate Inquiry',
                description: 'An email from a law firm downtown: "We\'re looking for a caterer for our weekly partner meetings. Cheese platters, quality important, reliability essential. Can you deliver every Thursday?"',
                type: 'opportunity',
                monthRange: [12, 35],
                condition: () => gameState.cheeseTypes >= 25 && gameState.reputation >= 55 && !gameState.hasCorporateClient,
                unique: true,
                choices: [
                    {
                        text: 'Accept - reliable recurring revenue',
                        hint: '€500/week guaranteed, but you\'re committed',
                        effects: { stress: 15, energy: -10 },
                        outcome: 'Every Thursday, 6am, you prep their platters. It\'s work. But €2,000/month, guaranteed, forever. That\'s stability.',
                        flags: { hasCorporateClient: true },
                        conditionalEffects: () => ({ autonomy: -10, reputation: 5 })
                    },
                    {
                        text: 'Negotiate better terms',
                        hint: 'Higher price, less frequent, or they find someone else',
                        effects: { stress: 10 },
                        outcome: 'You pushed back. They agreed to bi-weekly at higher margins. Less reliable, but less draining.',
                        conditionalEffects: () => ({ reputation: 3, bank: 1000 })
                    },
                    {
                        text: 'Decline politely',
                        hint: 'Protect your time and autonomy',
                        effects: { stress: -10 },
                        outcome: '"We\'re focused on our retail customers," you explain. They understand. You remain master of your schedule.',
                        conditionalEffects: () => ({ autonomy: 10 })
                    }
                ]
            },

            {
                id: 'cheap_fridge',
                title: 'The Barely-Working Fridge',
                description: 'You found a used cheese display counter for €800. It\'s ugly. The compressor sounds like a dying cat. But it works. A proper state-of-the-art counter would be €50,000.',
                type: 'decision',
                monthRange: [4, 10],
                unique: true,
                condition: () => gameState.cheeseTypes >= 1 && gameState.cheeseTypes < 15 && !gameState.hasProCounter,
                choices: [
                    {
                        text: 'Buy the cheap ugly one (€800)',
                        hint: 'Save cash for the building fund',
                        effects: { bank: -800, stress: 5 },
                        outcome: 'The fridge hums loudly. Customers joke about it. But cheese stays cold and you have €49,200 more for other things. Smart.',
                        conditionalEffects: () => ({ cheeseTypes: gameState.cheeseTypes + 9, conceptPivotProgress: 20 })
                    },
                    {
                        text: 'Finance a proper counter (€50,000)',
                        hint: '€800/month for 5 years - beautiful but costly',
                        effects: { bank: -2000, stress: 20 },
                        outcome: 'The new counter is magnificent. Temperature-controlled zones, LED lighting, the works. €800/month for 5 years. Worth it? Time will tell.',
                        flags: { monthlyPayment: 800, hasProCounter: true },
                        conditionalEffects: () => ({ cheeseTypes: gameState.cheeseTypes + 20, conceptPivotProgress: 35, reputation: 6 })
                    }
                ]
            },

            // === FINE FOOD PIVOT CHOICE ===
            {
                id: 'fine_food_choice',
                title: 'A New Direction',
                description: 'Looking at the shop, you realize it\'s becoming something different. The bulk bins are emptier, the cheese counter is busier. A customer says, "This feels more like a fine food shop now."\n\nMaybe it\'s time to embrace that identity fully?',
                type: 'pivot',
                monthRange: [8, 20],
                condition: () => gameState.cheeseTypes >= 15 && gameState.concept === 'Hybrid' && !gameState.fineFoodChoiceMade,
                unique: true,
                choices: [
                    {
                        text: 'Embrace fine food - this is who we are now',
                        hint: 'Commit to quality over quantity',
                        effects: { stress: 10, reputation: 6 },
                        outcome: 'You\'ve made the decision. This is a fine food shop now. The identity feels clear, authentic. Customers sense it too.',
                        flags: { fineFoodChoiceMade: true },
                        action: 'set_fine_food'
                    },
                    {
                        text: 'Stay hybrid - keep options open',
                        hint: 'Don\'t close any doors yet',
                        effects: { stress: 5 },
                        outcome: 'You decide to keep the mix for now. Maybe clarity will come later.',
                        flags: { fineFoodChoiceMade: true }
                    }
                ]
            },

            // === THE PIVOT JOURNEY ===
            {
                id: 'gradual_pivot',
                title: 'The Gradual Transformation',
                description: 'You\'ve been slowly replacing bulk bins with cheese, charcuterie, local products. The transformation is visible. Old customers grumble. New ones appear. "Is this still an organic shop?" someone asks.',
                type: 'pivot',
                monthRange: [6, 15],
                condition: () => gameState.cheeseTypes >= 5 && gameState.bulkPercentage > 50,
                choices: [
                    {
                        text: 'Continue the slow pivot',
                        hint: 'One product category at a time, keep cash flow stable',
                        effects: { stress: 10, energy: -5 },
                        outcome: 'Another bulk section becomes a cheese display. The transformation continues, gradual and sustainable.',
                        conditionalEffects: () => ({
                            bulkPercentage: Math.max(0, gameState.bulkPercentage - 15),
                            conceptPivotProgress: Math.min(100, gameState.conceptPivotProgress + 15),
                            cheeseTypes: gameState.cheeseTypes + 20,
                            reputation: 5
                        })
                    },
                    {
                        text: 'Accelerate - transform faster',
                        hint: 'Risky but captures momentum',
                        effects: { bank: -2000, stress: 25, energy: -15 },
                        outcome: 'Major renovation weekend. The shop looks different. Some regulars are shocked. New customers are delighted.',
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
                title: 'Your First Christmas Season',
                description: 'December arrives. Your first December as a shop owner. Other fromageries seem to know exactly what to do—gift baskets, special displays, extended hours. You... don\'t. The cheese is there. The customers trickle in. But you feel like you\'re improvising while everyone else has a plan.',
                type: 'milestone',
                monthRange: [6, 6], // December 2022 - MANDATORY first Christmas
                mandatory: true,
                unique: true,
                choices: [
                    {
                        text: 'Keep it simple - focus on quality',
                        hint: 'You\'re still learning. That\'s okay.',
                        effects: { stress: 5, bank: 1500 },
                        outcome: 'You didn\'t try to be fancy. Good cheese, honest service. Some regulars brought friends. "My fromagère," they said, introducing you. It felt... real.',
                        flags: { firstChristmasDone: true }
                    },
                    {
                        text: 'Push hard - fake it till you make it',
                        hint: 'Pretend you know what you\'re doing',
                        effects: { stress: 20, energy: -15, bank: 3000 },
                        outcome: 'You stayed late making gift baskets. Copied what the big shops did. Some sold, some didn\'t. You made money, but you felt like an imposter the whole time.',
                        flags: { firstChristmasDone: true }
                    },
                    {
                        text: 'Ask other shop owners for advice',
                        hint: 'Swallow your pride',
                        effects: { stress: -5, reputation: 5 },
                        outcome: 'Marie from the bakery next door showed you how she handles December. "Next year," she said, "you\'ll know." She was right. You learned more from that conversation than from any business course.',
                        flags: { firstChristmasDone: true },
                        conditionalEffects: () => ({ bank: 2000 })
                    }
                ]
            },
            // === REVENUE BOOSTING EVENTS ===
            {
                id: 'christmas_market',
                title: 'Christmas Market Opportunity',
                description: 'The commune is organizing a Christmas market at Place Dumont. They\'re offering you a stand. It\'s three weekends of early mornings in the cold—but you could sell Raclette portions, vin chaud pairings, and Gaufrinettes Tante Arlette.',
                type: 'opportunity',
                monthRange: [18, 18], // December 2023 - MANDATORY second Christmas
                mandatory: true,
                unique: true,
                choices: [
                    {
                        text: 'Take the stand',
                        hint: 'Raclette + vin chaud = €€€',
                        effects: { energy: -20, stress: 15 },
                        outcome: 'Three weekends, 6am starts, fingers frozen. But you sold 50kg of Raclette, 30 bottles of Montepulciano. New customers discovered you. "Where is your shop?"',
                        flags: { didChristmasMarket: true },
                        conditionalEffects: () => ({ bank: 3000, reputation: 5 })
                    },
                    {
                        text: 'Focus on the shop',
                        hint: 'December is already chaos',
                        effects: { stress: -5 },
                        outcome: 'You stayed warm in your shop. The Saturday orders piled up anyway. Probably the right call for your sanity.'
                    }
                ]
            },
            {
                id: 'corporate_client',
                title: 'A Corporate Inquiry',
                description: 'An architecture firm down the street wants monthly plateaux for their Friday apéros. "Three cheeses, some charcuterie, maybe those Cookies from Gâteau sur la Cerise?" They want to order every month. Regular orders, good margins—but you\'ll need to prep 8 plateaux every Thursday evening.',
                type: 'opportunity',
                monthRange: [8, 35],
                condition: () => gameState.cheeseTypes >= 30 && gameState.reputation >= 55,
                choices: [
                    {
                        text: 'Take the contract',
                        hint: '+€1,500/month recurring (Comté, Manchego DOP, Coppa, Saucisson...)',
                        effects: { stress: 10, energy: -10 },
                        outcome: 'Every Thursday you prep 8 plateaux: Comté 8 mois, Manchego DOP, Coppa di Parma, Saucisson d\'Ardèche. Predictable income. Your accountant is finally happy.',
                        flags: { hasCorporateClient: true },
                        conditionalEffects: () => ({ reputation: 3 })
                    },
                    {
                        text: 'Stay focused on retail',
                        hint: 'Thursday evenings are already packed',
                        effects: { stress: -5 },
                        outcome: 'You politely declined. Thursday is already Interbio delivery day. One more task would break you.'
                    }
                ]
            },
            {
                id: 'wine_pairing',
                title: 'Wine & Cheese Evenings',
                description: 'A local sommelier proposes hosting wine and cheese tasting evenings in your shop. Thursday nights, once a month. "We pair the Montepulciano-Merlot with aged Comté, the Tenuta Ulisse with Manchego..." Split the profits.',
                type: 'opportunity',
                monthRange: [10, 38],
                condition: () => gameState.cheeseTypes >= 40 && !gameState.hasWineEvents,
                choices: [
                    {
                        text: 'Start the wine evenings',
                        hint: 'Extra revenue + reputation boost',
                        effects: { energy: -10, stress: 5 },
                        outcome: 'The first evening was packed. Word spread. People who never bought cheese are now regulars.',
                        flags: { hasWineEvents: true },
                        conditionalEffects: () => ({ bank: 2000, reputation: 5 })
                    },
                    {
                        text: 'Too much to organize',
                        hint: 'Keep things simple',
                        effects: {},
                        outcome: 'You passed. Maybe another time when things are calmer.'
                    }
                ]
            },
            {
                id: 'raclette_season',
                title: 'Raclette Season!',
                description: () => gameState.raclettePathStarted
                    ? 'Winter is here. Your raclette reputation precedes you. Customers call in advance. "Are you the shop with 15 different raclettes?" The question is how hard to push.'
                    : 'Winter is here and everyone wants raclette. You could stock up big on raclette cheese and rent machines. High investment but the margins are incredible.',
                type: 'opportunity',
                monthRange: [17, 20], // Nov Year 2–Feb (after "The Raclette Question" in Oct; winter = Nov–Jan)
                recurring: true,
                cooldown: 12,
                priority: 85,
                condition: () => (gameState.month >= 11 || gameState.month <= 1) && gameState.cheeseTypes >= 25,
                choices: [
                    {
                        text: 'Go all-in on raclette',
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
                        text: 'Normal winter stock',
                        hint: 'Play it safe',
                        effects: {},
                        outcome: 'You kept normal stock levels. Sold what you had, no stress.'
                    }
                ]
            },

            // === RACLETTE MASTERY PATH ===
            {
                id: 'first_raclette_season',
                title: 'The Raclette Question',
                description: 'October. Your second autumn in the shop. The temperature drops. Customers start asking: "Do you have raclette?" You have a few basic wheels, but you could do more. Much more. Raclette season is coming—the question is whether you want to ride it.',
                type: 'decision',
                monthRange: [16, 16], // October only (monthIndex 16 = Oct 2023; narrative: "October... Raclette season is coming")
                condition: () => gameState.month === 10 && gameState.cheeseTypes >= 10,
                unique: true,
                priority: 90,
                choices: [
                    {
                        text: 'Go all-in for raclette season',
                        hint: 'This could be big...',
                        effects: { bank: -2000, stress: 10 },
                        outcome: 'You ordered 8 different raclettes: classic, fumée, poivre, herbes de Provence... The display looks impressive. Customers are intrigued. "You have HOW many raclettes?"',
                        flags: { raclettePathStarted: true },
                        conditionalEffects: () => ({ racletteTypes: 8, cheeseTypes: gameState.cheeseTypes + 8, reputation: 3 })
                    },
                    {
                        text: 'Stock a few classics',
                        hint: 'Test the waters first',
                        effects: { bank: -500 },
                        outcome: 'You got three solid raclettes: a Swiss, a French, and a smoked. Enough to satisfy demand without the risk.',
                        conditionalEffects: () => ({ racletteTypes: 3, cheeseTypes: gameState.cheeseTypes + 3 })
                    },
                    {
                        text: 'Focus on other cheeses',
                        hint: 'Raclette is everywhere, why compete?',
                        effects: {},
                        outcome: 'You passed on the raclette craze. Let the supermarkets fight over it.'
                    }
                ]
            },
            {
                id: 'swiss_invitation',
                title: 'The Swiss Invitation',
                description: 'An email from Valais, Switzerland. A raclette producer you\'ve been ordering from. "Julien, why don\'t you come visit? See the cows, the alpine pastures, understand why our raclette is different. One week. We\'ll show you everything."\n\nIt would cost €4,000 and the shop would close for a week. But the connections, the knowledge, the story...',
                type: 'opportunity',
                monthRange: [16, 32],
                condition: () => gameState.raclettePathStarted && gameState.racletteTypes >= 5,
                unique: true,
                priority: 85,
                choices: [
                    {
                        text: 'Go to Switzerland',
                        hint: 'A week in the Alps with cheese makers...',
                        effects: { bank: -4000, energy: -20, family: 10 },
                        outcome: 'The Alps were breathtaking. You met farmers whose families have made raclette for generations. Tasted varieties you\'d never heard of: truffle-infused, lavender & muscat, smoked over beechwood, even one with chili. They gave you exclusive supplier access. You came back transformed.',
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
                        text: 'Can\'t afford it right now',
                        hint: '€4,000 and a week closed is too much',
                        effects: { stress: 5 },
                        outcome: 'You wrote back with regrets. "Maybe next year." The invitation didn\'t come again.'
                    }
                ]
            },
            {
                id: 'raclette_kingdom',
                title: 'The Raclette Kingdom',
                description: 'You\'ve built something special. Customers come from across Brussels for your raclette selection. But you could go further: dedicate a whole corner to raclette, rent machines year-round, become THE destination. Twenty varieties. A raclette bar. The full experience.\n\nIt\'s a big commitment. But so was everything else that got you here.',
                type: 'decision',
                monthRange: [24, 40],
                condition: () => gameState.swissVisitDone && gameState.racletteTypes >= 15,
                unique: true,
                priority: 88,
                choices: [
                    {
                        text: 'Build the Raclette Kingdom',
                        hint: 'Go all the way',
                        effects: { bank: -3000, stress: 15 },
                        outcome: 'You renovated the corner. Twenty raclette varieties displayed like jewels. Five machines available for rent. A sign: "La Maison de la Raclette." Food bloggers started posting. You became a destination.',
                        flags: { racletteKingdom: true },
                        conditionalEffects: () => ({
                            racletteTypes: gameState.racletteTypes + 5,
                            cheeseTypes: gameState.cheeseTypes + 5,
                            reputation: 10,
                            autonomy: 5
                        })
                    },
                    {
                        text: 'Stay balanced',
                        hint: 'Raclette is great, but so are other cheeses',
                        effects: {},
                        outcome: 'You kept your excellent raclette selection without going all-in. A balanced shop, not a raclette shrine. That\'s okay too.'
                    }
                ]
            },

            // === LATE GAME CROWNING EVENTS ===
            {
                id: 'parmigiano_invitation',
                title: 'The King of Cheeses Calls',
                description: 'An email arrives from Emilia-Romagna, Italy. A consortium of Parmigiano Reggiano producers has heard of your shop. "We invite you to our mountains. Three days, all inclusive—stay at the farmstead, see the cows, watch the wheels being made, taste 24-month, 36-month, 72-month aged. The full experience."\n\n€6,000 for everything. It\'s the trip of a lifetime for a fromager. The crowning achievement of building relationships with producers.',
                type: 'milestone',
                monthRange: [38, 42], // TRUE ENDGAME - only in final months
                condition: () => gameState.reputation >= 90, // Need strong reputation to get invited
                unique: true,
                priority: 95,
                choices: [
                    {
                        text: 'Go to Emilia-Romagna',
                        hint: 'This is the dream. The absolute peak.',
                        effects: { bank: -6000, stress: -25, energy: 20, family: 15 },
                        outcome: 'The Apennine mountains. Dawn milking. Copper cauldrons bigger than cars. You watched masters at work—the same movements their grandfathers made. The 72-month Parmigiano brought tears to your eyes. You came back changed. Not just a shopkeeper anymore. A true fromager.',
                        flags: { parmigianoVisitDone: true },
                        conditionalEffects: () => ({
                            cheeseTypes: 100, // The trip completes your cheese collection!
                            producerRelationships: (gameState.producerRelationships || 0) + 30,
                            producerVisits: (gameState.producerVisits || 0) + 1
                        })
                    },
                    {
                        text: 'I can\'t justify €6,000',
                        hint: 'It\'s a lot of money...',
                        effects: { stress: 10 },
                        outcome: 'You wrote back declining. "Business constraints." They understood. You wondered, for years after, what those mountains looked like at dawn.'
                    }
                ]
            },
            {
                id: 'birthday_party',
                title: 'Your Birthday Approaches',
                description: 'Your birthday is coming up. Your partner has been hinting. "We should do something at the shop. Invite everyone—customers, suppliers, friends. Celebrate what you\'ve built." It would be chaos. Wonderful chaos. Or you could keep it small—dinner with close ones, no stress.',
                type: 'personal',
                monthRange: [28, 42],
                condition: () => gameState.monthsPlayed >= 28,
                unique: true,
                priority: 70,
                choices: [
                    {
                        text: 'Throw the big party at the shop',
                        hint: 'A proper party costs real money',
                        effects: { bank: -4500, stress: 30, energy: -25 },
                        outcome: 'The shop was packed. Regulars, producers, old friends, new friends. Someone brought a cake shaped like a wheel of Comté. Your supplier from Auvergne drove up with a special cheese just for you. Open bar, catering, decorations - €4,500 later, it was exhausting. It was perfect.',
                        flags: { hadBigBirthdayParty: true },
                        conditionalEffects: () => ({ family: 35, reputation: 8 })
                    },
                    {
                        text: 'Keep it small—dinner with loved ones',
                        hint: 'Nice restaurant, good wine',
                        effects: { bank: -1200, stress: -5 },
                        outcome: 'A quiet dinner at a nice restaurant. Good wine. Stories told. No one needed to see the shop. The people who mattered already knew.',
                        conditionalEffects: () => ({ family: 15, energy: 10 })
                    }
                ]
            },

            // === MORE LATE GAME RECURRING EVENTS ===
            {
                id: 'regular_appreciation',
                title: 'The Regulars\' Gift',
                description: 'A group of your most loyal customers shows up with a wrapped package. "Three years you\'ve been feeding us. We wanted to say thank you." Inside: a beautiful wooden cheese board, hand-carved, with "Chez Julien" engraved on the back.',
                type: 'personal',
                monthRange: [30, 42],
                condition: () => gameState.reputation >= 70,
                unique: true,
                priority: 60,
                choices: [
                    {
                        text: 'Display it proudly in the shop',
                        hint: 'Let everyone see what community means',
                        effects: { stress: -15 },
                        outcome: 'You hung it behind the counter. Customers notice. "What\'s that?" "A gift from regulars." It became part of the story.',
                        conditionalEffects: () => ({ family: 10, reputation: 5 })
                    },
                    {
                        text: 'Keep it at home, use it for family dinners',
                        hint: 'Some things are personal',
                        effects: { stress: -10 },
                        outcome: 'It sits on your dining table now. Every cheese night, you think of them.',
                        conditionalEffects: () => ({ family: 15 })
                    }
                ]
            },
            {
                id: 'competitor_closes',
                title: 'The Competition Closes',
                description: 'You hear the news: the cheese shop on Avenue Louise is closing. They couldn\'t make it work—too high rent, not enough differentiation. Their customers need somewhere to go. Some will find you.',
                type: 'opportunity',
                monthRange: [25, 42],
                condition: () => gameState.reputation >= 60,
                unique: true,
                priority: 55,
                choices: [
                    {
                        text: 'Reach out to their suppliers',
                        hint: 'Opportunity knocks',
                        effects: { stress: 10, energy: -5 },
                        outcome: 'You made some calls. Picked up two excellent suppliers they were working with. Their loss, your gain.',
                        conditionalEffects: () => ({ cheeseTypes: gameState.cheeseTypes + 4, supplierDiscount: gameState.supplierDiscount + 2 })
                    },
                    {
                        text: 'Just let the customers find you naturally',
                        hint: 'No need to be aggressive',
                        effects: {},
                        outcome: 'Over the next months, familiar faces started appearing. "We used to go to..." "I know. Welcome."',
                        conditionalEffects: () => ({ reputation: 5 })
                    }
                ]
            },
            {
                id: 'apprentice_request',
                title: 'The Apprentice',
                description: 'A culinary school student emails you. They want to do a stage—an apprenticeship—at your shop. "I want to learn from someone who really knows cheese." It would be work to teach them. But it\'s also... flattering.',
                type: 'opportunity',
                monthRange: [28, 42],
                condition: () => gameState.cheeseTypes >= 50 && gameState.reputation >= 65,
                unique: true,
                priority: 60,
                choices: [
                    {
                        text: 'Take them on for a month',
                        hint: 'Extra hands, teaching moment',
                        effects: { stress: 15, energy: -10 },
                        outcome: 'They were eager, clumsy, full of questions. By the end, they could run the counter alone. They wrote about you in their thesis.',
                        conditionalEffects: () => ({ autonomy: 8, reputation: 6 })
                    },
                    {
                        text: 'Decline politely',
                        hint: 'No time to teach',
                        effects: { stress: -5 },
                        outcome: 'You wrote back with regrets. "Maybe next year when things are calmer." Things never got calmer.'
                    }
                ]
            },
            {
                id: 'food_blogger_visit',
                title: 'The Food Blogger',
                description: 'Someone\'s been taking a lot of photos in the shop. You recognize her from Instagram—she has 50,000 followers and writes about Brussels food scene. She asks if she can interview you.',
                type: 'opportunity',
                monthRange: [20, 42],
                condition: () => gameState.cheeseTypes >= 40,
                recurring: true,
                cooldown: 12,
                choices: [
                    {
                        text: 'Give her the full tour and interview',
                        hint: 'Free publicity to 50k followers',
                        effects: { stress: 10, energy: -5 },
                        outcome: 'She posted a 10-photo carousel with glowing captions. Your Instagram followers tripled. New faces appeared for weeks.',
                        conditionalEffects: () => ({ reputation: 8 })
                    },
                    {
                        text: 'Politely decline the spotlight',
                        hint: 'You don\'t need the attention',
                        effects: {},
                        outcome: 'She was disappointed but understood. Took a few photos anyway. Tagged you in a story. Small wave of new customers.',
                        conditionalEffects: () => ({ reputation: 3 })
                    }
                ]
            },
            {
                id: 'reflection_moment',
                title: 'A Moment to Reflect',
                description: 'It\'s a quiet Tuesday afternoon. The shop is empty for once. You look around—at the cheese counter you built, the photos on the wall, the rhythm you\'ve created. How far you\'ve come from that first terrifying month.',
                type: 'personal',
                monthRange: [35, 42],
                condition: () => gameState.bank >= 50000,
                unique: true,
                priority: 50,
                choices: [
                    {
                        text: 'Take stock and feel proud',
                        hint: 'You earned this moment',
                        effects: { stress: -20, energy: 10 },
                        outcome: 'You sat on your stool, ate a piece of Comté, and smiled. Not everything was perfect. But you built something real.',
                        conditionalEffects: () => ({ family: 5 })
                    },
                    {
                        text: 'Start planning the next chapter',
                        hint: 'What\'s next?',
                        effects: { stress: 5 },
                        outcome: 'You pulled out a notebook. Expansion? Teaching? Writing a book? The future was wide open.',
                        conditionalEffects: () => ({ autonomy: 5 })
                    }
                ]
            },

            {
                id: 'newspaper_feature',
                title: 'Local Newspaper Calls',
                description: 'A journalist from the local paper wants to write a feature about your shop. "The neighborhood cheese revolution" they\'re calling it. Free publicity.',
                type: 'opportunity',
                monthRange: [12, 36],
                condition: () => gameState.cheeseTypes >= 50 && gameState.reputation >= 60,
                unique: true,
                choices: [
                    {
                        text: 'Welcome the journalist',
                        hint: 'Free publicity!',
                        effects: { stress: 10, energy: -5 },
                        outcome: 'The article came out. Your phone didn\'t stop ringing. New customers came from three communes over.',
                        conditionalEffects: () => ({ reputation: 8, bank: 3000 })
                    },
                    {
                        text: 'Prefer to stay under the radar',
                        hint: 'Don\'t want the attention',
                        effects: {},
                        outcome: 'You politely declined. Privacy has its value.'
                    }
                ]
            },
            {
                id: 'expand_hours',
                title: 'Extended Hours?',
                description: 'Customers keep asking if you could stay open later. "I get off work at 6, you close at 6!" Opening until 7:30pm could capture the after-work crowd.',
                type: 'decision',
                monthRange: [6, 30],
                condition: () => !gameState.extendedHours && (gameState.hasLucas || gameState.hasHenry),
                choices: [
                    {
                        text: 'Extend to 7:30pm',
                        hint: 'More revenue, more hours',
                        effects: { stress: 10, energy: -10 },
                        outcome: 'The after-work crowd found you. Sales went up, especially on weekdays.',
                        flags: { extendedHours: true },
                        conditionalEffects: () => ({ bank: 2500, reputation: 5 })
                    },
                    {
                        text: 'Keep current hours',
                        hint: 'Protect your evenings',
                        effects: { family: 5 },
                        outcome: 'You kept your evenings. Some things are worth more than money.'
                    }
                ]
            },

            {
                id: 'talk_to_customers',
                title: 'The Listening Tour',
                description: 'You\'ve noticed something: the more you chat with customers, the more you understand what they want. Madame Hermans mentioned a specific Italian cheese. Mr. Peeters asked about wine pairings. They\'re telling you what to sell.',
                type: 'opportunity',
                monthRange: [4, 20],
                unique: true,
                choices: [
                    {
                        text: 'Invest time in conversations',
                        hint: 'Slower service but builds loyalty',
                        effects: { energy: -10, stress: 5 },
                        outcome: 'You spent extra time with each customer. Learned names, preferences, stories. They started bringing friends.',
                        conditionalEffects: () => ({ reputation: 3, cheeseTypes: gameState.cheeseTypes + 5 })
                    },
                    {
                        text: 'Keep service efficient',
                        hint: 'More customers through the door',
                        effects: { stress: 10 },
                        outcome: 'Quick and professional. But you missed something—the connection that makes a neighborhood shop special.'
                    }
                ]
            },

            // === SEASONAL STRESS EVENTS ===
            {
                id: 'christmas_rush',
                title: 'The Christmas Chaos',
                description: 'December hits like a truck. Raclette, Comté, Beaufort d\'été—everyone wants cheese platters. Coppa di Parma, Saucisson d\'Ardèche noisette, Prosciutto Riserva for the charcuterie boards. The Montepulciano-Merlot flies off the shelf. Interbio\'s Thursday delivery isn\'t enough—you place emergency orders. The queue stretches out the door. You haven\'t eaten lunch in three days.',
                type: 'crisis',
                monthRange: [30, 30], // December 2024 - MANDATORY third Christmas
                mandatory: true,
                unique: true,
                choices: [
                    {
                        text: 'Push through - this is your moment',
                        hint: 'Maximum revenue but maximum stress',
                        effects: { stress: 25, energy: -25, bank: 5000 },
                        outcome: 'You survived December. Barely. Sold 40 wheels of Raclette, 200 bottles of wine, countless plateaux. Revenue was incredible. Your body... less so.'
                    },
                    {
                        text: 'Set boundaries - close on time, limit orders',
                        hint: 'Less revenue but sustainable',
                        effects: { stress: 10, energy: -10, bank: 2000 },
                        outcome: 'You stopped taking platter orders after December 20th. Some customers grumbled. But you made it through human, not hospitalized.'
                    }
                ]
            },
            {
                id: 'summer_slowdown',
                title: 'Summer Drought',
                description: 'August. Brussels empties. Your regulars are at the coast. The Melon Charentais bio sells well, but cheese sales drop 40%. The Tomme aux Fleurs Moosbrugger is aging faster than it\'s selling. Pasta Mobil is on vacation—no fresh ravioli deliveries. Even Terra\'s webshop feels empty.',
                type: 'crisis',
                monthRange: [13, 14], // August
                condition: () => gameState.month === 8 && gameState.cheeseTypes >= 10,
                recurring: true,
                cooldown: 12,
                priority: 85,
                choices: [
                    {
                        text: 'Discount the cheese to move stock',
                        hint: 'Cut losses, keep cash flowing',
                        effects: { stress: 15, bank: -1500 },
                        outcome: 'The Tomme went at -30%. The Brie de Meaux barely made it. Better sold cheap than thrown away.'
                    },
                    {
                        text: 'Hold prices, weather the storm',
                        hint: 'Maintain margins, risk waste',
                        effects: { stress: 20, bank: -500 },
                        outcome: 'Some Chèvre Frais went past its prime. The St Marcellin didn\'t make it. The waste hurt, but you held your value.'
                    },
                    {
                        text: 'Take a week off - embrace it',
                        hint: 'A real vacation costs real money',
                        effects: { stress: -15, energy: 20, family: 15, bank: -4500 },
                        outcome: 'You closed for a week. First real break in months. The Belgian coast was healing. Let the cheese age in peace. But that week cost you - lost sales, spoiled stock, the vacation itself.'
                    }
                ]
            },
            {
                id: 'heat_wave',
                title: 'The Heat Wave',
                description: 'July. 38°C outside. The cheese display fridge is struggling. The AC can barely keep up. Customers don\'t want to cook—they want salads, cold cuts, fresh things. Heavy cheeses sit untouched.',
                type: 'crisis',
                monthRange: [12, 13], // July-August
                condition: () => gameState.month === 7 || gameState.month === 8,
                recurring: true,
                cooldown: 12,
                priority: 80,
                choices: [
                    {
                        text: 'Emergency ice and coolers',
                        hint: 'Protect the cheese at all costs',
                        effects: { bank: -400, stress: 20, energy: -15 },
                        outcome: 'You bought bags of ice, rented extra coolers. The cheese survived. You were drenched in sweat by closing time.'
                    },
                    {
                        text: 'Push summer products hard',
                        hint: 'Adapt to what people actually want',
                        effects: { stress: 10, energy: -10 },
                        outcome: 'Mozzarella di Bufala, fresh chèvre, light salads. You adapted. Some aged cheese suffered, but you moved what mattered.',
                        conditionalEffects: () => ({ reputation: 2 })
                    },
                    {
                        text: 'Close early during the worst days',
                        hint: 'Not worth risking the stock',
                        effects: { bank: -800, stress: -5 },
                        outcome: 'You closed at 15h for three days. Lost sales, but the fridge recovered. Sometimes retreat is smart.'
                    }
                ]
            },
            {
                id: 'snow_day',
                title: 'Brussels Under Snow',
                description: 'You wake up to 20cm of snow. Brussels is paralyzed. The tram isn\'t running. Cars are stuck. Your delivery from Lalero? "Impossible today." But some brave souls might still walk to shops...',
                type: 'decision',
                monthRange: [5, 7], // Dec-Feb (game months)
                condition: () => gameState.month === 12 || gameState.month === 1 || gameState.month === 2,
                unique: true,
                priority: 85,
                choices: [
                    {
                        text: 'Open anyway - be the hero',
                        hint: 'The few who make it will remember',
                        effects: { stress: 15, energy: -20 },
                        outcome: 'You trudged through the snow. Only 12 customers all day. But they were SO grateful. "You\'re the only shop open!" Hot chocolate for everyone.',
                        conditionalEffects: () => ({ reputation: 5, family: -5 })
                    },
                    {
                        text: 'Stay closed - it\'s not worth it',
                        hint: 'A day off costs more than you think',
                        effects: { stress: -10, family: 10, bank: -1800 },
                        outcome: 'You stayed home. Built a snowman. Watched the city sleep. The cheese aged unpurchased. Fixed costs don\'t stop for snow.'
                    }
                ]
            },
            {
                id: 'back_to_school',
                title: 'September Rush',
                description: 'School\'s back. Everyone\'s returning from holidays. Suddenly they need everything: Filet de Poulet Coprosain for quick dinners, Bolognaise Fraîche for the kids, cheese for the raclette they\'re already craving. Your September stats show €35,000 turnover, 1,649 clients. The rhythm is brutal after summer\'s calm.',
                type: 'decision',
                monthRange: [14, 15], // September
                condition: () => gameState.month === 9,
                recurring: true,
                cooldown: 12,
                priority: 85,
                choices: [
                    {
                        text: 'Embrace the chaos',
                        hint: 'Ride the wave',
                        effects: { stress: 15, energy: -15, bank: 3000 },
                        outcome: 'September was intense but profitable. Your rhythm is back.',
                        flags: { septemberRushExperienced: true }
                    },
                    {
                        text: 'Ease back in gradually',
                        hint: 'Protect your energy',
                        effects: { stress: 5, bank: 1500 },
                        outcome: 'You didn\'t catch every sale, but you didn\'t burn out either.'
                    }
                ]
            },

            // === SUPPLIER & BUSINESS CRISES ===
            {
                id: 'supplier_price_hike',
                title: 'The Lalero Letter',
                description: 'Email from Lalero, your main cheese supplier: "Cher Julien, suite aux conditions du marché, nos prix augmentent de 15% le mois prochain." The Tomme Larzac, the Comté 8 mois, the Boerentrots Tentation—all going up. Your margins on cheese (your best category at 20% of sales) just got squeezed.',
                type: 'crisis',
                monthRange: [8, 36],
                condition: () => gameState.cheeseTypes >= 10,
                unique: true,
                choices: [
                    {
                        text: 'Raise your prices to match',
                        hint: 'Protect margins, but customers might leave',
                        effects: { stress: 10 },
                        outcome: 'You spent an evening updating labels. The Tomme went from €29 to €33/kg. Some regulars noticed. "C\'est la vie," said one. Another just walked out.',
                        conditionalEffects: () => ({ reputation: -8 })
                    },
                    {
                        text: 'Absorb the cost temporarily',
                        hint: 'Keep customers happy, build loyalty long-term',
                        effects: { stress: 5, bank: -1200 },
                        outcome: 'You ate the difference. Margins hurt now. But Madame Dubois noticed you didn\'t raise prices. "You\'re not like the others," she said. She\'ll remember.',
                        conditionalEffects: () => ({ reputation: 4 })
                    },
                    {
                        text: 'Negotiate - threaten to switch suppliers',
                        hint: 'Risky, but could pay off if you have leverage',
                        effects: { stress: 15 },
                        outcome: 'You called Lalero and pushed back. They blinked. "For you, Julien, 8% instead of 15%." Relationships matter.',
                        condition: () => gameState.producerRelationships >= 5,
                        conditionalEffects: () => ({ autonomy: 5 })
                    }
                ]
            },
            {
                id: 'delivery_disaster',
                title: 'The Interbio No-Show',
                description: 'Thursday morning. Your Interbio delivery hasn\'t arrived. You check email—their truck broke down. No fresh fruits, no vegetables, no salads. The organic produce corner will be empty tomorrow.',
                type: 'crisis',
                monthRange: [3, 40],
                unique: true,
                choices: [
                    {
                        text: 'Rush to the Marché Dumont',
                        hint: 'Buy retail, sell retail - margins will hurt',
                        effects: { stress: 20, energy: -15, bank: -200 },
                        outcome: 'You spent the morning at the market. Paid retail prices for what you\'ll sell at barely more. But the shelves weren\'t empty.'
                    },
                    {
                        text: 'Make do with what you have',
                        hint: 'Focus on cheese and charcuterie today',
                        effects: { stress: 15, energy: -5 },
                        outcome: 'The produce section looked sad. "Pas de légumes?" Some customers left with only half their list. The cheese carried the day.',
                        conditionalEffects: () => ({ reputation: -2, bank: -500 })
                    }
                ]
            },
            {
                id: 'health_inspection',
                title: 'AFSCA Visit',
                description: 'Two inspectors from AFSCA walk in unannounced. Clipboards. Thermometers. Questions. Your heart rate doubles. Everything is fine... right?',
                type: 'crisis',
                monthRange: [5, 40],
                unique: true,
                choices: [
                    {
                        text: 'Stay calm, show them everything',
                        hint: 'You have nothing to hide',
                        effects: { stress: 5 },
                        outcome: 'Two hours of scrutiny. A few minor notes. But you passed. The relief was physical. You actually feel better now that it\'s done.',
                        conditionalEffects: () => ({ reputation: 5 })
                    },
                    {
                        text: 'Panic internally but act professional',
                        hint: 'Fake it till you make it',
                        effects: { stress: 15, energy: -10 },
                        outcome: 'You smiled while dying inside. They noticed one fridge was 1°C too warm. Warning issued. Not the end of the world.',
                        conditionalEffects: () => ({ reputation: -3 })
                    }
                ]
            },
            {
                id: 'competitor_opens',
                title: 'New Competition',
                description: 'A new "artisan fromagerie" opens three streets away. Slick branding. Instagram presence. Younger owner. You see some of your regulars walking past with their bags.',
                type: 'crisis',
                monthRange: [12, 30],
                condition: () => gameState.cheeseTypes >= 15, // Only if you've become a cheese shop
                unique: true,
                choices: [
                    {
                        text: 'Double down on what makes you different',
                        hint: 'Your story, your selection, your service',
                        effects: { stress: 15, energy: -10 },
                        outcome: 'You focused on relationships. The regulars who matter stayed. Some even came back after trying them.',
                        conditionalEffects: () => ({ reputation: 4, cheeseTypes: gameState.cheeseTypes + 10 })
                    },
                    {
                        text: 'Visit them, learn from them',
                        hint: 'Know your competition',
                        effects: { stress: 10 },
                        outcome: 'You walked in pretending to be a customer. Nice place. But you noticed things they were missing. Ideas formed.',
                        conditionalEffects: () => ({ autonomy: 5 })
                    },
                    {
                        text: 'Ignore them and focus on your work',
                        hint: 'Don\'t let it consume you',
                        effects: { stress: 20 },
                        outcome: 'You tried not to think about it. But every slow day, you wondered if they were busy.',
                        conditionalEffects: () => ({ bank: -300 })
                    }
                ]
            },
            {
                id: 'fridge_breakdown',
                title: 'The Fridge Dies',
                description: 'The main display fridge starts making a horrible noise. Then stops. The temperature is rising. You have €3,000 worth of cheese in there.',
                type: 'crisis',
                monthRange: [8, 38],
                condition: () => gameState.cheeseTypes >= 10,
                unique: true,
                choices: [
                    {
                        text: 'Emergency repair - pay whatever it takes',
                        hint: 'Fast but expensive',
                        effects: { stress: 25, bank: -1200 },
                        outcome: 'The technician came within hours. €1,200 for a Sunday callout. The cheese was saved. Barely.'
                    },
                    {
                        text: 'Move everything to the backup fridge',
                        hint: 'Temporary solution',
                        effects: { stress: 20, energy: -20 },
                        outcome: 'You spent hours shuffling cheese. The backup fridge is smaller. Some things had to be sold at a loss.',
                        conditionalEffects: () => ({ bank: -600 })
                    }
                ]
            },

            // === INVESTMENT EVENTS (Sacrifice now, compound later) ===
            {
                id: 'producer_visit_lalero',
                title: 'The Lalero Invitation',
                description: 'Email from Lalero: "Cher Julien, we\'re inviting our best clients to visit our caves in Aveyron. Two days, all expenses paid except travel. You\'d see how Tomme Larzac is made, meet the affineurs..."',
                type: 'opportunity',
                monthRange: [8, 30],
                condition: () => gameState.cheeseTypes >= 10 && gameState.autonomy >= 30,
                unique: true,
                choices: [
                    {
                        text: 'Go - close the shop for 2 days',
                        hint: 'Lost sales now, but relationships and knowledge forever',
                        effects: { bank: -2000, stress: 15, energy: -10 },
                        outcome: 'The caves were magical. You understand the cheese differently now. Lalero treats you as family. Future orders will be prioritized, prices negotiated. You came back with ideas for 8 new cheeses to stock.',
                        flags: { producerVisits: (gameState.producerVisits || 0) + 1 },
                        conditionalEffects: () => ({ cheeseExpertise: 15, reputation: 4, supplierDiscount: 3, producerRelationships: 10, cheeseTypes: gameState.cheeseTypes + 8 })
                    },
                    {
                        text: 'Send Henry (if available)',
                        hint: 'He learns, shop stays open',
                        effects: { stress: 5 },
                        outcome: 'Henry came back transformed. "Julien, I understand now. The cheese has a story." His passion grew. Worth it.',
                        condition: () => gameState.hasHenry,
                        conditionalEffects: () => ({ autonomy: 10, cheeseExpertise: 8 })
                    },
                    {
                        text: 'Decline - can\'t leave the shop',
                        hint: 'Play it safe',
                        effects: { stress: 5 },
                        outcome: '"Maybe next year," you write. The opportunity passes. There\'s always next year... right?'
                    }
                ]
            },
            {
                id: 'cheese_course',
                title: 'The Cheese Certification',
                description: 'A prestigious 3-day cheese certification course in Lyon. €1,200 plus travel. The certificate means nothing to customers, but the knowledge... affineurs, terroir, pairings, aging techniques.',
                type: 'opportunity',
                monthRange: [10, 28],
                condition: () => gameState.cheeseTypes >= 15 && gameState.cheeseExpertise < 30 && gameState.autonomy >= 35,
                unique: true,
                choices: [
                    {
                        text: 'Take the course',
                        hint: '€1,500 + lost sales, but expertise is forever',
                        effects: { bank: -1500, stress: 10 },
                        outcome: 'Three days of intensive learning. You came back different. The way you talk about cheese changed. Customers notice. They trust you more. You discovered 6 regional cheeses you\'d never heard of—and now you stock them.',
                        conditionalEffects: () => ({ cheeseExpertise: 25, reputation: 5, autonomy: 5, cheeseTypes: gameState.cheeseTypes + 6 })
                    },
                    {
                        text: 'Learn from YouTube instead',
                        hint: 'Free, but slower and less credible',
                        effects: { stress: -5 },
                        outcome: 'You watched videos at night. Learned some things. Not the same as being there, but something.',
                        conditionalEffects: () => ({ cheeseExpertise: 5 })
                    }
                ]
            },
            {
                id: 'bulk_supplier_deal',
                title: 'The Lalero Bulk Offer',
                description: 'Lalero offers 20% off if you commit to 3 months of orders upfront. That\'s €4,000 now, but you\'d save €200/month for a year. The cash would be tied up, but the margins...',
                type: 'opportunity',
                monthRange: [12, 36],
                condition: () => gameState.cheeseTypes >= 20 && gameState.bank >= 6000,
                unique: true,
                choices: [
                    {
                        text: 'Take the deal - €4,000 upfront',
                        hint: 'Cash now for savings later',
                        effects: { bank: -4000, stress: 5 },
                        outcome: 'You signed the commitment. Cash flow is tighter, but your margins just improved. Smart if you can survive the cash squeeze.',
                        conditionalEffects: () => ({ supplierDiscount: (gameState.supplierDiscount || 0) + 2 })
                    },
                    {
                        text: 'Negotiate payment terms',
                        hint: 'Same discount, pay monthly, but they\'ll want something',
                        effects: { stress: 10 },
                        outcome: 'Lalero agreed to monthly payments, but you committed to featuring their products prominently. A fair trade.',
                        conditionalEffects: () => ({ supplierDiscount: (gameState.supplierDiscount || 0) + 1, autonomy: -5 })
                    },
                    {
                        text: 'Keep flexibility',
                        hint: 'No commitments, but no savings',
                        effects: {},
                        outcome: 'You kept your cash liquid. The discount would have been nice, but freedom has value too.'
                    }
                ]
            },
            {
                id: 'staff_training',
                title: 'Training Lucas',
                description: 'Lucas is eager but clumsy with customers. You could spend a week really training him - role plays, product knowledge, the art of the sale. It would take your time, but imagine if he could actually sell...',
                type: 'decision',
                monthRange: [8, 35],
                condition: () => gameState.hasLucas && gameState.autonomy < 50,
                unique: true,
                choices: [
                    {
                        text: 'Invest a week in training',
                        hint: 'Your time now, his competence forever',
                        effects: { energy: -20, stress: 10 },
                        outcome: 'A week of intense coaching. Lucas transformed. He recommends pairings now. Customers trust him. You can actually step away.',
                        conditionalEffects: () => ({ autonomy: 20, reputation: 5 })
                    },
                    {
                        text: 'Let him learn on the job',
                        hint: 'Slower, but you stay productive',
                        effects: { stress: 5 },
                        outcome: 'Lucas improves, slowly. Some customers specifically wait for you. But he\'s getting there.',
                        conditionalEffects: () => ({ autonomy: 5 })
                    }
                ]
            },

            // === PERSONAL LIFE EVENTS ===
            {
                id: 'sleep_problems',
                title: 'The 3am Wake-ups',
                description: 'For the past two weeks, you\'ve been waking up at 3am. Mind racing. Did you order enough Comté? Is the rent paid? What if the cheese counter fails? Sleep won\'t come back.',
                type: 'personal',
                monthRange: [6, 40],
                condition: () => gameState.stress > 50,
                unique: true,
                choices: [
                    {
                        text: 'Push through - it\'ll pass',
                        hint: 'Coffee is your friend',
                        effects: { stress: 15, energy: -20 },
                        outcome: 'The insomnia continued. You functioned, barely. Made more mistakes than usual.'
                    },
                    {
                        text: 'See a doctor',
                        hint: 'Get professional help',
                        effects: { stress: -5, bank: -100 },
                        outcome: 'The doctor listened. Suggested some changes. Gave you something to help. Slowly, sleep returned.'
                    },
                    {
                        text: 'Start evening walks with Poncho',
                        hint: 'Natural wind-down',
                        effects: { stress: -10, energy: 5 },
                        outcome: 'The walks became ritual. Brussels at dusk. Poncho happy. Mind quieter. Sleep came easier.',
                        condition: () => gameState.hasDog
                    }
                ]
            },
            {
                id: 'relationship_tension',
                title: 'The Talk',
                description: '"We need to talk about the shop." Your partner sits you down. They\'re worried. You\'re always working. Always stressed. Always tired. "I feel like I\'m losing you to cheese."',
                type: 'personal',
                monthRange: [8, 35],
                condition: () => gameState.family < 60 && gameState.stress > 40,
                unique: true,
                choices: [
                    {
                        text: 'Promise to find better balance',
                        hint: 'Keeping promises costs sales',
                        effects: { stress: 10, family: 15, bank: -1500 },
                        outcome: 'You made promises. Specific ones. Date nights mean leaving early. Sunday mornings off mean lost sales. You kept them. It hurt the bottom line, but it helped. A little.'
                    },
                    {
                        text: '"This is temporary - I need support right now"',
                        hint: 'Ask for understanding',
                        effects: { stress: -5, family: -10 },
                        outcome: 'They heard you. But you saw disappointment. The shop is winning. That\'s not nothing.'
                    },
                    {
                        text: 'Hire more help so you can be present',
                        hint: 'Extra staffing is expensive',
                        effects: { family: 25, bank: -2500 },
                        outcome: 'You found someone for Saturday afternoons. Date nights returned. The extra €2,500/month in wages hurts, but the relationship is worth it.',
                        condition: () => gameState.hasLucas
                    }
                ]
            },
            {
                id: 'friend_needs_help',
                title: 'An Old Friend',
                description: 'Your best friend from before the shop days calls. They\'re going through a rough time. Divorce. They need someone to talk to. But talking takes time. Time you don\'t have.',
                type: 'personal',
                monthRange: [10, 38],
                choices: [
                    {
                        text: 'Make time - friendship matters',
                        hint: 'Long dinners, late nights',
                        effects: { stress: 10, energy: -10, family: 10 },
                        outcome: 'You listened. For hours. It felt good to be there for someone else. To remember you\'re more than the shop.'
                    },
                    {
                        text: '"I\'m really busy, but call anytime"',
                        hint: 'Offer what you can',
                        effects: { stress: 5 },
                        outcome: 'They called less. You felt guilty. But the shop demanded everything.'
                    }
                ]
            },

            // === CUSTOMER CHALLENGES ===
            {
                id: 'bad_review',
                title: 'One Star',
                description: 'You open Google Maps. Someone left a 1-star review. "Overpriced cheese, rude owner." You remember them. They wanted a discount on everything. You politely declined. Now this.',
                type: 'crisis',
                monthRange: [5, 40],
                unique: true,
                choices: [
                    {
                        text: 'Respond professionally',
                        hint: 'Kill them with kindness',
                        effects: { stress: -5 },
                        outcome: 'You wrote a calm, professional response. Other customers noticed. Some left supportive reviews. Taking action felt good.',
                        conditionalEffects: () => ({ reputation: 5 })
                    },
                    {
                        text: 'Ignore it',
                        hint: 'Don\'t feed the trolls',
                        effects: { stress: 10 },
                        outcome: 'It sat there. Unanswered. Every time someone mentioned reviews, you thought of it.'
                    },
                    {
                        text: 'Ask loyal customers for reviews',
                        hint: 'Drown it in positivity',
                        effects: { stress: 5, energy: -5 },
                        outcome: 'Awkward asks at the counter. But it worked. Twenty new 5-star reviews. The one-star was buried.',
                        conditionalEffects: () => ({ reputation: 4 })
                    }
                ]
            },
            {
                id: 'difficult_customer',
                title: 'The Complainer',
                description: 'A customer brings back cheese, claiming it was "off." It wasn\'t - it\'s a washed-rind cheese, it\'s SUPPOSED to smell strong. But they\'re making a scene. Other customers are watching.',
                type: 'crisis',
                monthRange: [3, 40],
                unique: true,
                choices: [
                    {
                        text: 'Refund and apologize',
                        hint: 'Customer is always right...',
                        effects: { stress: 10, bank: -25 },
                        outcome: 'You bit your tongue. Gave the refund. They left satisfied. You seethed.'
                    },
                    {
                        text: 'Explain the cheese patiently',
                        hint: 'Educate them',
                        effects: { stress: 15, energy: -5 },
                        outcome: 'You explained washed-rind cheeses. The origins. The process. They didn\'t care. Left angry.',
                        conditionalEffects: () => ({ reputation: -3 })
                    },
                    {
                        text: 'Exchange it for something milder',
                        hint: 'Meet in the middle',
                        effects: { stress: 5 },
                        outcome: 'You offered a gouda instead. They accepted. Crisis averted. Relationship saved.',
                        conditionalEffects: () => ({ reputation: 2 })
                    }
                ]
            },
            {
                id: 'regular_moves_away',
                title: 'Goodbye, Madame Dubois',
                description: 'Madame Dubois - your very first regular, the one who suggested cheese - comes in looking sad. She\'s moving. Closer to her grandchildren. "I\'ll miss this place."',
                type: 'personal',
                monthRange: [15, 40],
                unique: true,
                choices: [
                    {
                        text: 'Give her a farewell cheese basket',
                        hint: 'On the house',
                        effects: { bank: -80, family: 10 },
                        outcome: 'She cried. You almost did too. Some customers become family. She promised to visit when in town.'
                    },
                    {
                        text: 'Thank her for everything',
                        hint: 'Words are enough',
                        effects: { stress: 5 },
                        outcome: 'You told her what she meant to the shop. To you. She left with tears and promises to recommend you to everyone.'
                    }
                ]
            },
            {
                id: 'theft_incident',
                title: 'Sticky Fingers',
                description: 'You notice the expensive truffle cheese is missing from the display. Then you see it on the security camera: a customer slipping it into their bag while you helped someone else.',
                type: 'crisis',
                monthRange: [8, 40],
                unique: true,
                choices: [
                    {
                        text: 'Confront them next time they come',
                        hint: 'They will come back - they always do',
                        effects: { stress: 20 },
                        outcome: 'They returned two weeks later. You asked them to leave. They denied everything. Made a scene. Never came back.',
                        conditionalEffects: () => ({ reputation: -5 })
                    },
                    {
                        text: 'Let it go, improve security',
                        hint: 'Not worth the confrontation',
                        effects: { stress: 10, bank: -200 },
                        outcome: 'You moved expensive items closer to the counter. Bought a small mirror. The €85 loss stung, but peace was preserved.'
                    },
                    {
                        text: 'Post about it (anonymously) in local groups',
                        hint: 'Warn other shop owners',
                        effects: { stress: 15 },
                        outcome: 'Other shopkeepers responded - they knew exactly who you meant. The neighborhood network was activated.'
                    }
                ]
            },

            // === YOUR VISION - PROACTIVE STORY EVENTS ===
            // These are about YOU shaping the shop's identity, not reacting to problems

            {
                id: 'signature_cheese',
                title: 'Creating Your Signature',
                description: 'You\'ve been thinking... what if you created something unique? A cheese aged specifically for your shop, with your name on it. Lalero says they could work with an affineur to create "Tomme Chez Julien" - aged in their caves, exclusive to you.',
                type: 'milestone',
                monthRange: [18, 35],
                condition: () => gameState.cheeseTypes >= 40 && gameState.producerRelationships >= 10,
                unique: true,
                priority: 80,
                choices: [
                    {
                        text: 'Yes - create my signature cheese',
                        hint: '€2,000 investment, 6 months to develop',
                        effects: { bank: -2000, stress: 10 },
                        outcome: 'Six months later, the first wheel arrived. "Tomme Chez Julien" - your name on a cheese. Customers went crazy. Food magazines called. This is legacy.',
                        flags: { hasSignatureCheese: true },
                        conditionalEffects: () => ({ reputation: 12, cheeseTypes: gameState.cheeseTypes + 1 })
                    },
                    {
                        text: 'Not yet - focus on curation over creation',
                        hint: 'Being a great selector is enough',
                        effects: { stress: -5 },
                        outcome: 'You decided your skill is finding great cheeses, not making them. That\'s a valid path too.',
                        conditionalEffects: () => ({ autonomy: 5 })
                    }
                ]
            },
            {
                id: 'shop_philosophy',
                title: 'What Do You Stand For?',
                description: 'A journalist asks you: "What\'s your philosophy?" You realize you\'ve never articulated it. But you have one. What matters most to you about this shop?',
                type: 'decision',
                monthRange: [12, 25],
                condition: () => gameState.cheeseTypes >= 20,
                unique: true,
                priority: 75,
                choices: [
                    {
                        text: '"Accessibility - great cheese for everyone, not just the elite"',
                        hint: 'Democratic pricing, welcoming atmosphere',
                        effects: { stress: -5 },
                        outcome: 'You wrote it on a small card by the register. "Good cheese is for everyone." Customers from all backgrounds felt welcome. Your prices stayed reasonable.',
                        flags: { shopPhilosophy: 'accessible' },
                        conditionalEffects: () => ({ reputation: 8, family: 5 })
                    },
                    {
                        text: '"Education - I want people to discover, not just buy"',
                        hint: 'Tastings, stories, knowledge sharing',
                        effects: { energy: -5 },
                        outcome: 'You started offering free tastings every Saturday. Explaining terroir, aging, pairings. Customers became connoisseurs. They trusted you completely.',
                        flags: { shopPhilosophy: 'education' },
                        conditionalEffects: () => ({ reputation: 10, cheeseExpertise: 10 })
                    },
                    {
                        text: '"Connection - I\'m building relationships, not transactions"',
                        hint: 'Remember names, support local, be part of the community',
                        effects: {},
                        outcome: 'You memorized every regular\'s name and preferences. Supported neighborhood events. Became the heart of the community, not just a shop.',
                        flags: { shopPhilosophy: 'connection' },
                        conditionalEffects: () => ({ family: 10, reputation: 6 })
                    }
                ]
            },
            {
                id: 'mentor_opportunity',
                title: 'The Old Fromager',
                description: 'Pierre, a retired fromager who ran a famous shop in Ixelles for 40 years, stops by. He\'s impressed. "You remind me of myself at your age. I could teach you things... if you want to learn." He offers to mentor you, one afternoon a week.',
                type: 'opportunity',
                monthRange: [10, 28],
                condition: () => gameState.cheeseTypes >= 15 && !gameState.hasMentor,
                unique: true,
                priority: 85,
                choices: [
                    {
                        text: 'Accept his mentorship gratefully',
                        hint: '40 years of wisdom, one afternoon at a time',
                        effects: { energy: -5 },
                        outcome: 'Every Tuesday, Pierre came. He taught you about affinage, about reading customers, about surviving the hard years. His stories were worth more than any course.',
                        flags: { hasMentor: true },
                        conditionalEffects: () => ({ cheeseExpertise: 20, autonomy: 10, reputation: 5 })
                    },
                    {
                        text: 'Politely decline - forge your own path',
                        hint: 'Learn from your own mistakes',
                        effects: {},
                        outcome: 'Pierre nodded, understanding. "Independent spirit. Good. You\'ll figure it out." He still stops by sometimes, just to chat.',
                        conditionalEffects: () => ({ autonomy: 8 })
                    }
                ]
            },
            {
                id: 'neighborhood_collab',
                title: 'The Neighborhood Collective',
                description: 'The bakery, the wine shop, and the butcher want to form a collective. Shared marketing, cross-promotions, maybe even a "neighborhood food tour" for tourists. You\'d be the cheese stop.',
                type: 'opportunity',
                monthRange: [14, 30],
                condition: () => gameState.reputation >= 50,
                unique: true,
                priority: 70,
                choices: [
                    {
                        text: 'Join the collective',
                        hint: 'Strength in numbers, shared customers',
                        effects: { stress: 5 },
                        outcome: 'The "Woluwe Food Trail" launched. Tourists appeared with maps. Locals loved supporting "their" shops together. Rising tide lifts all boats.',
                        flags: { inNeighborhoodCollective: true },
                        conditionalEffects: () => ({ reputation: 8, bank: 2000 })
                    },
                    {
                        text: 'Stay independent',
                        hint: 'You like doing things your way',
                        effects: {},
                        outcome: 'You stayed solo. The collective succeeded without you, but you kept your freedom. Sometimes you wonder what could have been.',
                        conditionalEffects: () => ({ autonomy: 10 })
                    }
                ]
            },
            {
                id: 'cookbook_idea',
                title: 'The Recipe Collection',
                description: 'You\'ve been collecting cheese recipes from customers for two years now. Madame Dubois\'s fondue. Mr. Peeters\'s tartiflette. That amazing fig and goat cheese tart. What if you compiled them into a little book?',
                type: 'decision',
                monthRange: [20, 38],
                condition: () => gameState.cheeseTypes >= 50 && gameState.reputation >= 60,
                unique: true,
                priority: 65,
                choices: [
                    {
                        text: 'Create "Recipes from Chez Julien"',
                        hint: '€1,500 to print 500 copies',
                        effects: { bank: -1500, stress: 15, energy: -10 },
                        outcome: 'The little cookbook sold out in a month. People bought cheese just to try the recipes. Some customers cried seeing their recipe in print. "You remembered."',
                        flags: { hasCookbook: true },
                        conditionalEffects: () => ({ reputation: 10, family: 5, bank: 3000 })
                    },
                    {
                        text: 'Keep the recipes as a personal collection',
                        hint: 'Not everything needs to be a product',
                        effects: {},
                        outcome: 'The recipe cards stay in your drawer. Sometimes you share them one by one. That feels more personal anyway.'
                    }
                ]
            },
            {
                id: 'seasonal_ritual',
                title: 'Creating a Tradition',
                description: 'You want to create something special - a yearly tradition that customers look forward to. Something that makes your shop unique in the neighborhood calendar.',
                type: 'decision',
                monthRange: [8, 20],
                unique: true,
                priority: 70,
                choices: [
                    {
                        text: '"Beaufort Season" - a spring celebration of alpine cheese',
                        hint: 'April event with mountain cheeses, raclette, fondue tastings',
                        effects: { bank: -500, stress: 10 },
                        outcome: 'The first Beaufort Season was magical. Alpine decorations, cow bells, cheese from specific chalets. Customers marked it in their calendars. A tradition was born.',
                        flags: { hasBeaufortSeason: true },
                        conditionalEffects: () => ({ reputation: 6 })
                    },
                    {
                        text: '"Fromage et Vendanges" - autumn cheese and wine pairing',
                        hint: 'September harvest celebration',
                        effects: { bank: -800, stress: 10 },
                        outcome: 'Wine, cheese, harvest decorations. The sommelier from down the street partnered with you. It became THE autumn event in Woluwe.',
                        flags: { hasFromageVendanges: true },
                        conditionalEffects: () => ({ reputation: 6 })
                    },
                    {
                        text: '"Cheese School" - monthly workshops for enthusiasts',
                        hint: 'Ongoing education program',
                        effects: { energy: -10 },
                        outcome: 'The first Saturday of every month: Cheese School. 8 people, 5 cheeses, 2 hours of tasting and learning. They became your most loyal customers.',
                        flags: { hasCheeseSchool: true },
                        conditionalEffects: () => ({ reputation: 8, cheeseExpertise: 5 })
                    }
                ]
            },
            {
                id: 'lucas_growth',
                title: 'Lucas Has an Idea',
                description: 'Lucas approaches you nervously. "I\'ve been thinking... what if we did TikToks? Show the cheeses, explain them, make it fun. I could do it." He shows you some videos he made at home. They\'re actually good.',
                type: 'decision',
                monthRange: [28, 40],  // After Lucas joins around month 27
                condition: () => gameState.hasLucas && gameState.lucasMonthsWorked >= 2,
                unique: true,
                priority: 75,
                choices: [
                    {
                        text: 'Let Lucas run the social media',
                        hint: 'Trust his generation\'s instincts',
                        effects: { stress: -5 },
                        outcome: 'Lucas\'s first TikTok hit 50k views. "POV: Your cheese guy explains why this Comté is worth €35/kg." Suddenly young people were discovering real cheese.',
                        flags: { lucasSocialMedia: true },
                        conditionalEffects: () => ({ reputation: 10, autonomy: 8 })
                    },
                    {
                        text: 'Not yet - focus on the fundamentals',
                        hint: 'Social media can wait',
                        effects: {},
                        outcome: 'Lucas was disappointed but understood. "Maybe when things slow down." You focused on what you know.',
                        conditionalEffects: () => ({ autonomy: 3 })
                    }
                ]
            },
            {
                id: 'your_counter_story',
                title: 'The Stories Behind the Counter',
                description: 'You realize every cheese in your counter has a story. The Tomme from the farm you visited. The Parmigiano from that magical trip. What if you made the stories visible? Little cards, photos, maps?',
                type: 'decision',
                monthRange: [15, 35],
                condition: () => gameState.producerVisits >= 1,
                unique: true,
                priority: 68,
                choices: [
                    {
                        text: 'Create "Story Cards" for each cheese',
                        hint: 'Photos, maps, producer names',
                        effects: { energy: -10, bank: -200 },
                        outcome: 'Every cheese now has a story visible. "This Raclette comes from Bernard in Valais. I met his cows." Customers spend longer browsing. They connect.',
                        flags: { hasStoryCards: true },
                        conditionalEffects: () => ({ reputation: 6, cheeseExpertise: 5 })
                    },
                    {
                        text: 'Keep the stories verbal',
                        hint: 'Tell them when customers ask',
                        effects: {},
                        outcome: 'You tell the stories when asked. It\'s more personal that way, even if fewer people hear them.'
                    }
                ]
            },
            {
                id: 'expansion_dream',
                title: 'The Second Location',
                description: 'A space opened up in Uccle. Nice neighborhood, no cheese shop. Your accountant says you could afford the deposit. Your partner looks worried. Lucas is excited. Is this the dream... or overreach?',
                type: 'milestone',
                monthRange: [28, 40],
                condition: () => gameState.bank >= 80000 && gameState.reputation >= 80 && gameState.hasHenry && !gameState.ownsBuilding,
                unique: true,
                priority: 90,
                choices: [
                    {
                        text: 'Open the second shop',
                        hint: 'Empire building time',
                        effects: { bank: -40000, stress: 30, energy: -20 },
                        outcome: 'The Uccle shop opened. Henry runs it. You split your time. It\'s chaos, but it\'s growth. You\'re building something bigger than yourself.',
                        flags: { hasSecondShop: true },
                        conditionalEffects: () => ({ reputation: 15, autonomy: -15, family: -10 })
                    },
                    {
                        text: 'Stay focused on one perfect shop',
                        hint: 'Quality over quantity',
                        effects: { stress: -10 },
                        outcome: 'You let the Uccle space go. "One shop, done perfectly." Your partner hugged you. Sometimes the bravest thing is saying no.',
                        flags: { declinedExpansion: true },
                        conditionalEffects: () => ({ family: 15, autonomy: 10 })
                    }
                ]
            },
            {
                id: 'documentary_approach',
                title: 'The Documentary',
                description: 'A filmmaker wants to make a short documentary about your shop. "The pivot from bulk to cheese - it\'s a story about following your instincts." She wants to follow you for a month.',
                type: 'opportunity',
                monthRange: [24, 40],
                condition: () => gameState.cheeseTypes >= 60 && gameState.reputation >= 75,
                unique: true,
                priority: 75,
                choices: [
                    {
                        text: 'Let her film the documentary',
                        hint: 'Your story, told properly',
                        effects: { stress: 15, energy: -10 },
                        outcome: 'A month of cameras. Awkward at first, then you forgot they were there. The documentary premiered at a local film festival. Standing ovation. Your mom cried.',
                        flags: { hasDocumentary: true },
                        conditionalEffects: () => ({ reputation: 12, family: 10 })
                    },
                    {
                        text: 'Decline - keep your privacy',
                        hint: 'Some things are just for you',
                        effects: {},
                        outcome: 'You politely declined. The story stays yours, untold to strangers. That\'s okay too.',
                        conditionalEffects: () => ({ autonomy: 5 })
                    }
                ]
            },
            {
                id: 'charity_choice',
                title: 'Giving Back',
                description: 'The local food bank asks if you\'d donate cheese that\'s near its sell-by date. Also, a school wants you to do a free cheese education session. You can\'t do everything, but you want to do something.',
                type: 'decision',
                monthRange: [10, 35],
                condition: () => gameState.cheeseTypes >= 30,
                unique: true,
                priority: 60,
                choices: [
                    {
                        text: 'Partner with the food bank',
                        hint: 'Donate near-date cheese weekly',
                        effects: { bank: -100 },
                        outcome: 'Every week, cheese that would\'ve been waste went to families in need. It felt right. The food bank put your logo on their newsletter.',
                        flags: { foodBankPartner: true },
                        conditionalEffects: () => ({ reputation: 6, family: 5 })
                    },
                    {
                        text: 'Do the school sessions',
                        hint: 'Educate the next generation',
                        effects: { energy: -10 },
                        outcome: 'You went to three schools. Brought cheese samples. The kids were fascinated. Some dragged their parents to your shop later. "The cheese man!"',
                        flags: { schoolProgram: true },
                        conditionalEffects: () => ({ reputation: 8 })
                    },
                    {
                        text: 'Do both - find the time',
                        hint: 'It\'s worth it',
                        effects: { energy: -15, bank: -100, stress: 10 },
                        outcome: 'You stretched yourself, but it was worth it. The community saw who you really are. Some things matter more than profit.',
                        flags: { foodBankPartner: true, schoolProgram: true },
                        conditionalEffects: () => ({ reputation: 12, family: 8 })
                    }
                ]
            },
            {
                id: 'naming_ceremony',
                title: 'The Naming Ceremony',
                description: 'It\'s official: customers have started calling your shop by a nickname. Some say "Julien\'s", some say "The Cheese Corner", some stick with "Chez Julien". Time to make it official?',
                type: 'decision',
                monthRange: [6, 15],
                condition: () => gameState.shopRenamed,
                unique: true,
                priority: 65,
                choices: [
                    {
                        text: 'Embrace "Chez Julien" with a new sign',
                        hint: 'Make it permanent and visible',
                        effects: { bank: -800 },
                        outcome: 'The new sign went up. Hand-painted, beautiful. "Chez Julien - Fromagerie". Customers took photos. You felt... official.',
                        flags: { hasNewSign: true, signInstalled: true },
                        conditionalEffects: () => ({ reputation: 5 })
                    },
                    {
                        text: 'Keep it understated',
                        hint: 'The quality speaks for itself',
                        effects: {},
                        outcome: 'No fancy sign. Just good cheese. Word of mouth was enough.',
                        conditionalEffects: () => ({ autonomy: 3 })
                    }
                ]
            },
            {
                id: 'special_order',
                title: 'The Impossible Request',
                description: 'A customer asks: "Can you get Époisses aged by Berthaut himself? The one from before he retired?" It\'s nearly impossible. But you know someone who might know someone...',
                type: 'opportunity',
                monthRange: [15, 38],
                condition: () => gameState.cheeseExpertise >= 15 || gameState.producerRelationships >= 15,
                unique: true,
                priority: 72,
                choices: [
                    {
                        text: 'Take on the challenge',
                        hint: 'Make the impossible happen',
                        effects: { energy: -15, stress: 10 },
                        outcome: 'Three weeks of calls, favors, connections. You found it. The customer wept when he saw it. "You actually did it." Your reputation for getting the impossible spread.',
                        conditionalEffects: () => ({ reputation: 8, producerRelationships: 5, bank: 500 })
                    },
                    {
                        text: 'Explain why it\'s not possible',
                        hint: 'Be honest about limitations',
                        effects: {},
                        outcome: 'You explained the reality. They understood. Sometimes the answer is no, and that\'s okay.',
                        conditionalEffects: () => ({ autonomy: 3 })
                    }
                ]
            },

            // === BURNOUT ARC ===
            {
                id: 'sunday_burnout',
                title: 'The Crash',
                description: 'It\'s been a year. You\'ve worked every single day. Sunday was supposed to be "just a few extra hours." Your body has different plans. You wake up and literally cannot get out of bed. Not metaphorically. Physically cannot.',
                type: 'crisis',
                monthRange: [10, 18],
                condition: () => gameState.openSunday && (gameState.energy < 40 || gameState.stress > 70),
                choices: [
                    {
                        text: 'Close for a week, recover',
                        hint: 'Lost sales and spoilage hurt',
                        effects: { energy: 50, stress: -40, family: 20, bank: -5000 },
                        outcome: 'You closed the shop. "FERMÉ POUR RAISONS PERSONNELLES." A week in bed. Your body slowly forgave you. The cheese didn\'t - €5,000 in spoilage and lost sales.',
                        flags: { burnoutCrashed: true, openSunday: false },
                        conditionalEffects: () => ({ salesPenalty: 8000 })
                    },
                    {
                        text: 'Push through somehow',
                        hint: 'The shop must stay open',
                        effects: { energy: -20, stress: 20, family: -25 },
                        outcome: 'You dragged yourself to the shop. Made mistakes. Snapped at customers. Your partner watched in horror.',
                        conditionalEffects: () => ({ reputation: -10, healthPenalty: true })
                    }
                ]
            },
            {
                id: 'stop_sunday',
                title: 'The Sunday Decision',
                description: 'After the crash, you\'re rethinking everything. Sunday was only your 4th best day anyway. The extra revenue wasn\'t worth the toll. Maybe it\'s time to reclaim your rest.',
                type: 'decision',
                monthRange: [12, 25],
                condition: () => gameState.openSunday && gameState.burnoutCrashed,
                choices: [
                    {
                        text: 'Close Sundays permanently',
                        hint: 'You\'ll lose ~€1000/month in sales',
                        effects: { stress: -20, energy: 15, family: 20, bank: -1200 },
                        outcome: 'The sign now says "Fermé le Dimanche." Regular Sunday customers found other shops. Your body celebrated; your bank account mourned.',
                        flags: { openSunday: false }
                    },
                    {
                        text: 'Keep Sundays, hire help',
                        hint: 'If you can afford it',
                        effects: { stress: 5, bank: -800 },
                        outcome: 'You found someone to cover Sundays. It\'s not the same, but at least you\'re not there.',
                        conditionalEffects: () => ({ autonomy: 10 })
                    }
                ]
            },

            // === HIRING: LUCAS ===
            {
                id: 'meet_lucas',
                title: 'The Neighbor Kid',
                description: 'Lucas works at a shop next door. Young, chaotic energy, passionate about food. He keeps stopping by, asking about the cheese. "I\'d love to work with products like this," he says. He has other gigs on the side, but seems genuinely interested.',
                type: 'hiring',
                monthRange: [27, 28],  // Reality: Sept 2024 = Month 27 - MANDATORY
                mandatory: true,  // Lucas is essential to the story
                unique: true,
                condition: () => !gameState.hasLucas && !gameState.hasHenry,
                choices: [
                    {
                        text: 'Hire Lucas part-time',
                        hint: 'Chaotic but passionate, €1,200/month',
                        effects: { bank: -1200, stress: -10, energy: 15 },
                        outcome: 'Lucas started. He\'s late sometimes. He talks too much. But customers LOVE him. And he actually cares about cheese.',
                        flags: { hasLucas: true },
                        conditionalEffects: () => ({ reputation: 5, autonomy: 15 })
                    },
                    {
                        text: 'Look for someone more reliable',
                        hint: 'Better qualifications, higher cost',
                        effects: { stress: 10, energy: -10 },
                        outcome: 'You posted job listings. The candidates were... fine. Professional. None of them had Lucas\'s spark.',
                        conditionalEffects: () => ({ employeeSearching: true })
                    },
                    {
                        text: 'Not yet, keep doing it yourself',
                        hint: 'Save money, sacrifice yourself',
                        effects: { stress: 15, energy: -10, family: -10 },
                        outcome: 'You kept working alone. Every hour in the shop was an hour away from everything else.'
                    }
                ]
            },
            {
                id: 'lucas_brings_henry',
                title: 'Lucas Has a Friend',
                description: 'Lucas has been great. Unreliable sometimes, but customers adore him. One day he mentions his best friend Henry: "He\'s looking for work. Most reliable person I know. Complete opposite of me, actually."',
                type: 'hiring',
                monthRange: [40, 42],  // Wider range to ensure it triggers
                priority: 85,  // High priority - important hire event
                condition: () => gameState.hasLucas && gameState.lucasMonthsWorked >= 12 && !gameState.hasHenry,  // 12+ months with Lucas
                choices: [
                    {
                        text: 'Hire Henry',
                        hint: 'Workhorse type, €1,500/month, daily reliability',
                        effects: { bank: -1500, stress: -20, energy: 25 },
                        outcome: 'Henry started. He showed up every single day. On time. No drama. Lucas joked that Henry was making him look bad. Your life changed.',
                        flags: { hasHenry: true },
                        conditionalEffects: () => ({ autonomy: 25, family: 15 })
                    },
                    {
                        text: 'One employee is enough',
                        hint: 'Keep costs low',
                        effects: { stress: 10 },
                        outcome: 'You passed on Henry. The December rush was coming. You\'d manage somehow.'
                    }
                ]
            },
            // Alternative hiring path if you missed Lucas - LATE GAME BACKUP ONLY
            {
                id: 'direct_hire_help',
                title: 'Time to Get Help',
                description: 'You\'ve been running yourself ragged for over two years now. The shop needs another pair of hands. A former colleague from another shop reached out - she\'s looking for stable work.',
                type: 'hiring',
                monthRange: [26, 40],
                priority: 70,
                unique: true,
                condition: () => !gameState.hasLucas && !gameState.hasHenry && !gameState.directHireEventSeen && gameState.stress > 50 && gameState.monthsPlayed >= 24,
                choices: [
                    {
                        text: 'Hire Sophie full-time',
                        hint: 'Experienced, reliable, €1,600/month',
                        effects: { bank: -1600, stress: -15, energy: 20 },
                        outcome: 'Sophie started Monday. She knew the rhythm of a shop. No training needed. For the first time in months, you took a lunch break.',
                        flags: { hasHenry: true, directHireEventSeen: true },
                        conditionalEffects: () => ({ autonomy: 20, family: 10 })
                    },
                    {
                        text: 'Hire part-time help',
                        hint: 'Cheaper but less coverage, €900/month',
                        effects: { bank: -900, stress: -8, energy: 10 },
                        outcome: 'Part-time help for the busy hours. Not a complete solution, but breathing room.',
                        flags: { hasLucas: true, directHireEventSeen: true },
                        conditionalEffects: () => ({ autonomy: 10 })
                    },
                    {
                        text: 'Keep doing it alone',
                        hint: 'The money stays in the business',
                        effects: { stress: 15, energy: -15, family: -10 },
                        outcome: 'You pushed through. Your body kept score.',
                        flags: { directHireEventSeen: true }
                    }
                ]
            },
            {
                id: 'student_trap',
                title: 'Student Workers',
                description: 'A business advisor suggests hiring students. "Cheap labor! Flexible! Perfect for retail!" It sounds appealing—until you remember that students have exams in December. Your busiest month.',
                type: 'decision',
                monthRange: [5, 30],
                unique: true,
                choices: [
                    {
                        text: 'Hire students anyway',
                        hint: 'Cheap (€12/hour) but they vanish in December',
                        effects: { bank: -400, stress: 5 },
                        outcome: 'The student was great in October. In December? "Sorry, I have exams." You were alone for Christmas rush.',
                        flags: { studentHired: true },
                        conditionalEffects: () => ({ decemberPenalty: true })
                    },
                    {
                        text: 'Pass - find adults who can commit',
                        hint: 'More expensive but reliable',
                        effects: { stress: 10 },
                        outcome: 'You held out for real employees. More expensive, but they\'d actually show up when you needed them.'
                    }
                ]
            },

            // === PEAK ENERGY REWARD EVENT ===
            {
                id: 'peak_performance',
                title: 'In The Zone',
                description: 'You wake up feeling... incredible. Rested. Clear-headed. Ready. It\'s been months since you felt this good. The shop hums along, customers smile, everything just clicks. You have energy to spare—time to do something with it.',
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
                        text: 'Deep clean and reorganize the shop',
                        hint: 'Use this energy for the shop',
                        effects: { energy: -15, stress: -10 },
                        outcome: 'You spent the day reorganizing everything. The walk-in fridge is spotless. Products are perfectly displayed. Customers notice—"Did you renovate?" The satisfaction is immense.',
                        conditionalEffects: () => ({ reputation: 5, autonomy: 5 })
                    },
                    {
                        text: 'Visit a supplier you\'ve been meaning to see',
                        hint: 'Build relationships while you have the energy',
                        effects: { energy: -20, bank: -300 },
                        outcome: 'You drove out to meet a producer face-to-face. Tasted cheeses you\'d never find in catalogs. Came back with exclusive products and a real connection.',
                        conditionalEffects: () => ({ reputation: 8, cheeseTypes: gameState.cheeseTypes + 3, producerRelationships: gameState.producerRelationships + 10 })
                    },
                    {
                        text: 'Take a spontaneous day off with your partner',
                        hint: 'Closing early costs a full day of sales',
                        effects: { energy: -10, bank: -2200 },
                        outcome: 'You closed early and surprised your partner. A long lunch, a walk by the canal, actual conversation. "I missed this," they said. So did you. The lost sales stung, but some things matter more.',
                        conditionalEffects: () => ({ family: 20, stress: -15 })
                    },
                    {
                        text: 'Just enjoy the feeling',
                        hint: 'Sometimes the reward is the energy itself',
                        effects: { stress: -5 },
                        outcome: 'You didn\'t do anything special—just worked with a lightness you\'d forgotten was possible. Customers felt it. You felt it. A good day.',
                        conditionalEffects: () => ({ reputation: 2 })
                    }
                ]
            },

            // === THE DOG === (MANDATORY - Poncho is essential to the story!)
            {
                id: 'adopt_dog',
                title: 'The Dog Question',
                description: 'Your partner has been hinting for months. A friend\'s Australian Shepherd just had puppies—gorgeous, smart, absolutely full of energy. "It would be good for us," they say. "You need something that isn\'t the shop." An Aussie is a lot of dog. Walks, training, stimulation. But those eyes...',
                type: 'personal',
                monthRange: [14, 16],  // Reality: Sept 2023 = Month 15 - TIGHT WINDOW to ensure it fires
                mandatory: true,  // GUARANTEED to appear - Poncho is THE story moment!
                unique: true,
                condition: () => !gameState.hasDog,
                choices: [
                    {
                        text: 'Adopt the Australian Shepherd puppy',
                        hint: 'Vet bills, food, gear, time away from shop',
                        effects: { bank: -1800, energy: -25, stress: 15 },
                        outcome: 'You named him Poncho. He\'s a whirlwind of fur and love. Vet visits, premium food, endless toys. And the walks take time you could be at the shop. But those eyes when he looks at you. Worth every euro.',
                        flags: { hasDog: true, dogBreed: 'aussie' },
                        conditionalEffects: () => ({ family: 30, reputation: 3, stress: -20 })
                    },
                    {
                        text: 'Not now, too much already',
                        hint: 'Reasonable but sad',
                        effects: { family: -10, stress: 5 },
                        outcome: 'You said no. "Maybe next year." Your partner\'s face fell. The shop consumed another piece of your life.'
                    }
                ]
            },
            {
                id: 'dog_in_shop',
                title: 'Poncho Comes to Work',
                description: 'Poncho has become a shop mascot. He greets customers with boundless enthusiasm. Children come specifically to pet him. He needs walks between customers—you can\'t sit still with an Aussie. But the joy he brings is undeniable.',
                type: 'opportunity',
                monthRange: [16, 35],  // A few months after Poncho adoption
                condition: () => gameState.hasDog && gameState.dogMonth > 3,
                choices: [
                    {
                        text: 'Lean into it - Poncho is part of the brand',
                        hint: 'Dog walks mean less time at the counter',
                        effects: { stress: -15, family: 10, energy: -10, bank: -800 },
                        outcome: 'Poncho got his own Instagram. Customers who don\'t even buy anything stop by to see him. The walks between customers mean missed sales, but are actually... nice.',
                        conditionalEffects: () => ({ reputation: 5 })
                    },
                    {
                        text: 'Keep him at home more',
                        hint: 'Less chaos in the shop',
                        effects: { family: 5, energy: 5 },
                        outcome: 'Poncho stayed home more. Customers asked where he was. Quieter, but something was missing.'
                    }
                ]
            },
            // Poncho cheese emergency - the cone of shame
            {
                id: 'poncho_cheese_emergency',
                title: 'Poncho\'s Cheese Incident',
                description: 'You turn your back for ONE minute. Poncho found the cheese samples meant for tomorrow\'s tasting—half a wheel of aged Comté, some Roquefort, a chunk of Gruyère. He ate it ALL. Now he\'s making concerning noises and won\'t stop drinking water. The vet says he needs surgery to remove a blockage.',
                type: 'crisis',
                monthRange: [18, 36],
                priority: 90,
                unique: true,
                condition: () => gameState.hasDog && !gameState.ponchoSurgery && gameState.cheeseTypes >= 20,
                choices: [
                    {
                        text: 'Rush him to the emergency vet',
                        hint: '€2,500 surgery - no hesitation',
                        effects: { bank: -2500, stress: 30, energy: -20 },
                        outcome: 'The surgery went well. Poncho came home with the cone of shame, looking absolutely miserable but alive. Lucia nursed him back to health with infinite patience. You learned to lock the cheese samples away.',
                        flags: { ponchoSurgery: true },
                        conditionalEffects: () => ({ family: 15 })
                    },
                    {
                        text: 'Wait and see if he passes it naturally',
                        hint: 'Risky but cheaper... maybe',
                        effects: { stress: 40, energy: -30 },
                        outcome: 'You waited too long. The emergency surgery cost €4,000 instead. Poncho survived but it was close. The guilt lingers.',
                        flags: { ponchoSurgery: true },
                        conditionalEffects: () => ({ bank: -4000, family: -10 })
                    }
                ]
            },
            // Poncho's 1 year anniversary
            {
                id: 'poncho_anniversary',
                title: 'Poncho\'s First Year',
                description: 'One year ago, those eyes looked up at you from the shelter. Now Poncho owns the shop—his chair by the door, his spot under the cheese counter, his adoring fans who come just to see him. He\'s not a puppy anymore. He\'s family.',
                type: 'milestone',
                monthRange: [27, 27], // September 2024 - 1 year after adoption
                condition: () => gameState.hasDog,
                mandatory: true,
                unique: true,
                choices: [
                    {
                        text: 'Give him extra treats',
                        hint: '🦴 Good boy',
                        effects: { stress: -10, family: 10 },
                        outcome: 'You gave him a whole slice of Beaufort. He deserved it. Lucia took photos of him sleeping in his favorite chair—all grown up now.',
                        flags: { ponchoAnniversary: true }
                    }
                ]
            },

            // === THE BUILDING ===
            {
                id: 'building_offer',
                title: 'Madame Malfait Calls',
                description: 'Your landlord, Madame Malfait, calls with news: "I\'m selling the building. €380,000. You have first right of refusal. I need an answer by January, and the sale closes in July." €380,000. You\'d need about €80,000 cash for the down payment and fees. You have... not that.',
                type: 'milestone',
                monthRange: [17, 18], // November 2023
                mandatory: true, // THIS EVENT MUST HAPPEN
                unique: true,
                choices: [
                    {
                        text: '"I\'ll find a way. I want it."',
                        hint: 'Start saving aggressively - you have 8 months',
                        effects: { stress: 20, energy: -10 },
                        outcome: 'You said yes. €80,000 by July. Every euro counts now. No fancy equipment. No expensive signs. Every profit goes to the building fund.',
                        flags: { buildingOfferReceived: true }
                    },
                    {
                        text: 'Ask for more time',
                        hint: 'Maybe delay the decision',
                        effects: { stress: 20 },
                        outcome: '"I can give you until January to decide," she said. "But the price is firm." The clock is ticking.',
                        flags: { buildingOfferReceived: true },
                        conditionalEffects: () => ({ buildingDeadlineExtended: 2 })
                    },
                    {
                        text: '"I can\'t afford it. Thank you anyway."',
                        hint: 'Realistic but painful',
                        effects: { stress: 15, family: 5 },
                        outcome: 'You let it go. The building sold to an investor. Your new landlord is... different. Rent increases are coming.',
                        conditionalEffects: () => ({ futureRentIncrease: true })
                    }
                ]
            },
            {
                id: 'building_countdown',
                title: 'The Savings Push',
                description: () => `Building fund: €${gameState.bank.toLocaleString()}. Target: €80,000. Deadline: July 2024. Every decision now has one question: does this help or hurt the building fund?`,
                type: 'milestone',
                monthRange: [19, 24],
                condition: () => gameState.buildingOfferReceived && !gameState.ownsBuilding,
                recurring: true,
                cooldown: 2,
                choices: [
                    {
                        text: 'Maximum savings mode',
                        hint: 'No investments, no improvements, hoard cash',
                        effects: { stress: 15, reputation: -3 },
                        outcome: 'You cut everything non-essential. The shop looks tired. But the bank account grows.',
                        conditionalEffects: () => ({ savingsBoost: 2000 })
                    },
                    {
                        text: 'Balance savings with operations',
                        hint: 'Steady progress without sacrificing the business',
                        effects: { stress: 10 },
                        outcome: 'You found the middle path. Essential investments only. Every other euro to savings.',
                        conditionalEffects: () => ({ savingsBoost: 1000 })
                    }
                ]
            },
            {
                id: 'building_deadline',
                title: 'July 2024: The Moment',
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
                            text: 'Sign the papers',
                            hint: `Pay €${gameState.buildingCost.toLocaleString()} - this is it`,
                            effects: { bank: -gameState.buildingCost, stress: -20, energy: 20 },
                            outcome: 'You signed. Your hand trembled. The building—YOUR building—is no longer someone else\'s. No landlord can ever push you out.',
                            flags: { ownsBuilding: true },
                            conditionalEffects: () => ({ reputation: 5, family: 10 })
                        });
                    }

                    // Option to delay by 1 month - penalty paid AFTER purchase succeeds
                    if (!canAfford) {
                        choices.push({
                            text: 'Ask for one more month',
                            hint: `Get one more month - €5,000 penalty will be due after purchase`,
                            effects: { stress: 20 },
                            outcome: 'You begged Madame Malfait. She agreed—but there\'s a €5,000 penalty for the delay, due when the sale closes. One more month. Make it count.',
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
                title: 'August 2024: Last Chance',
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
                            text: 'Sign the papers',
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
                title: 'The Shop Sign',
                description: 'Everyone says you need a proper sign. "People don\'t even notice the shop!" A designer quotes €2,000 for something beautiful. It would attract new customers. But €2,000 could also be building fund money, or cheese stock.',
                type: 'decision',
                monthRange: [8, 30],
                condition: () => !gameState.signInstalled,
                choices: [
                    {
                        text: 'Install the fancy sign',
                        hint: '€2,000 but attracts new customers',
                        effects: { bank: -2000, stress: 15 },
                        outcome: 'The sign went up. Beautiful. Eye-catching. New customers walked in. "I never noticed this shop before!"',
                        flags: { signInstalled: true },
                        conditionalEffects: () => ({ reputation: 5, salesBoost: 1500 })
                    },
                    {
                        text: 'Keep the old sign',
                        hint: 'Save money, word of mouth works',
                        effects: { stress: -5 },
                        outcome: 'You kept the simple sign. Regulars found you anyway. Growth was slower but organic.',
                        conditionalEffects: () => ({ autonomy: 5 })
                    }
                ]
            },

            // === PRODUCER VISITS ===
            {
                id: 'producer_opportunity',
                title: 'Visit the Producers',
                description: 'A cheese supplier invites you to visit their farm in Wallonia. "See where it comes from. Meet the cows." It means closing the shop for a day. But customers love stories about provenance.',
                type: 'opportunity',
                monthRange: [10, 40],
                condition: () => gameState.autonomy >= 20 || gameState.hasLucas,
                unique: true,
                choices: [
                    {
                        text: 'Go visit the producer',
                        hint: 'Close shop for a day, but gain knowledge and stories',
                        effects: { energy: -10, family: 5 },
                        outcome: 'You drove to Wallonia. Met the cheesemaker. Heard the story. Customers love hearing about "your producer in Wallonia."',
                        conditionalEffects: () => ({
                            reputation: 4,
                            producerVisits: gameState.producerVisits + 1,
                            salesBoost: 800
                        })
                    },
                    {
                        text: 'Can\'t leave the shop',
                        hint: 'Too risky to close',
                        effects: { stress: 5 },
                        outcome: 'You said no. The supplier understood. You\'ll sell their cheese anyway, just without the story.',
                        condition: () => gameState.autonomy < 20 && !gameState.hasLucas
                    },
                    {
                        text: 'Send Lucas to visit',
                        hint: 'He goes, you stay open',
                        effects: { bank: -100 },
                        outcome: 'Lucas came back excited, full of stories. Not quite the same as going yourself, but the shop stayed open.',
                        conditionalEffects: () => ({ reputation: 5, autonomy: 5 }),
                        condition: () => gameState.hasLucas
                    }
                ]
            },

            // === DELEGATION ===
            {
                id: 'delegation_moment',
                title: 'Learning to Let Go',
                description: 'You\'ve been doing everything yourself. Opening, closing, ordering, pricing, cleaning. Lucas and Henry are capable, but you can\'t stop micromanaging. "You don\'t trust us," Lucas jokes. He\'s not entirely joking.',
                type: 'personal',
                monthRange: [28, 40],
                condition: () => gameState.hasLucas && gameState.autonomy < 50,
                choices: [
                    {
                        text: 'Start delegating seriously',
                        hint: 'Training takes time, mistakes cost money',
                        effects: { stress: -15, energy: 20, family: 15, bank: -2000 },
                        outcome: 'You trained Lucas on ordering. Gave Henry keys. Their early mistakes cost you €2,000 in misorders and waste. But they\'re learning.',
                        conditionalEffects: () => ({ autonomy: 25 })
                    },
                    {
                        text: 'Keep control',
                        hint: 'Only you can do it right',
                        effects: { stress: 10, energy: -10, family: -10 },
                        outcome: 'You stayed in control. Every decision went through you. Lucas and Henry stayed, but stopped offering ideas.'
                    }
                ]
            },
            {
                id: 'take_holiday',
                title: 'A Week Off?',
                description: 'You haven\'t taken a real holiday since you started. Your partner is begging. "Just one week. The shop won\'t collapse." It might. Or it might be fine.',
                type: 'personal',
                monthRange: [20, 40],
                condition: () => gameState.autonomy >= 30,
                unique: true,
                choices: [
                    {
                        text: 'Take the holiday',
                        hint: 'A week off costs €6,000 in lost sales and spoilage',
                        effects: { energy: 40, stress: -30, family: 25, bank: -6000 },
                        outcome: 'You went to the coast. Checked your phone obsessively at first. By day 3, you relaxed. The shop survived. Your savings... less so.',
                        conditionalEffects: () => ({ holidaysTaken: gameState.holidaysTaken + 1, autonomy: 10 })
                    },
                    {
                        text: 'Just a long weekend',
                        hint: 'Still costs money',
                        effects: { energy: 15, stress: -10, family: 10, bank: -2500 },
                        outcome: 'Three days away. Not enough, but something. Your partner was grateful for the crumbs. You lost €2,500 in sales.'
                    },
                    {
                        text: 'Not this time',
                        hint: 'The shop needs you',
                        effects: { stress: 10, family: -15 },
                        outcome: 'You stayed. Your partner went without you. The shop was fine. The relationship... less so.'
                    }
                ]
            },

            // === RECURRING ===
            {
                id: 'december_rush',
                title: 'The December Rush',
                description: 'December. The month that makes or breaks the year. Cheese platters, gift baskets, holiday orders. The shop is packed from morning to night. Everything you built leads to this.',
                type: 'opportunity',
                monthRange: [6, 42],
                condition: () => gameState.month === 12,
                choices: [
                    {
                        text: 'Go all out',
                        hint: 'Maximum stock, extended hours, capture everything',
                        effects: { energy: -35, stress: 20 },
                        outcome: 'You worked until midnight. Sold more than any other month. Collapsed on January 1st.',
                        conditionalEffects: () => ({
                            salesBoost: 15000 + gameState.cheeseTypes * 50 + gameState.reputation * 50,
                            decemberBonus: true
                        })
                    },
                    {
                        text: 'Sustainable push',
                        hint: 'Good December without destroying yourself',
                        effects: { energy: -10, stress: 5 },
                        outcome: 'A strong December. Not record-breaking, but you entered January intact.',
                        conditionalEffects: () => ({
                            salesBoost: 8000 + gameState.cheeseTypes * 30 + gameState.reputation * 30
                        })
                    }
                ]
            },
            {
                id: 'family_dinner',
                title: 'Sunday Dinner',
                description: 'Your family is gathering this Sunday. You haven\'t been to a family dinner in months. The shop needs you. They need you too.',
                type: 'personal',
                monthRange: [1, 42],
                unique: true,
                choices: [
                    {
                        text: 'Go to dinner',
                        hint: 'Close early, be present',
                        effects: { family: 15, energy: 10 },
                        outcome: 'The roast was delicious. Your niece has grown. For a few hours, you weren\'t a shopkeeper—just family.',
                        conditionalEffects: () => (gameState.openSunday ? { salesPenalty: 1000 } : {})
                    },
                    {
                        text: 'Work comes first',
                        hint: 'The shop needs you',
                        effects: { family: -15, stress: 10, autonomy: 5 },
                        outcome: 'Another empty chair at the table. Your mother asked about you. Your partner made excuses. But the shop ran smoothly.'
                    }
                ]
            },

            // === LIFE VS SHOP EVENTS ===
            {
                id: 'the_invitation',
                title: 'The Invitation',
                description: 'Your friend Marc is getting married. Saturday, of course. You\'re invited - actually, you\'re expected. You\'ve known him since university. The ceremony is at 14h, reception until late. Saturday is your best day. €2,000+ in sales, and customers who don\'t find you open will try somewhere else.',
                type: 'personal',
                monthRange: [8, 18],
                condition: () => gameState.family >= 40,
                unique: true,
                priority: 80,
                choices: [
                    {
                        text: 'Close the shop and go',
                        hint: 'Marc would do the same for me',
                        effects: { bank: -2000, stress: 15 },
                        outcome: 'You danced at Marc\'s wedding. The shop was dark. Some customers found other shops that day. Some of them never came back. But Marc hugged you and said "I\'m glad you came." That mattered.',
                        conditionalEffects: () => ({ family: 10 })
                    },
                    {
                        text: 'Have staff cover',
                        hint: 'They can handle one Saturday... right?',
                        condition: () => gameState.hasLucas || gameState.hasHenry,
                        effects: { stress: 10, bank: -800 },
                        outcome: 'You got the call at 16h. Problem with a delivery. Angry customer. You left the reception early, still in your suit, and spent the evening fixing things. You made it back for the last dance. Barely.',
                        conditionalEffects: () => ({ family: 3 })
                    },
                    {
                        text: 'Skip the wedding',
                        hint: 'The shop needs me',
                        effects: { family: -20, stress: 5 },
                        outcome: 'You sent a gift and a card. Marc said he understood. You worked a normal Saturday. The cheese sold well. You tried not to think about it.',
                        flags: { skippedWedding: true }
                    }
                ]
            },
            {
                id: 'hospital_call',
                title: 'The Hospital Call',
                description: 'Your mother calls. Your father had a fall - he\'s in the hospital in Liège. Not life-threatening, but he\'s scared and asking for you. It\'s December 18th. Your busiest week. The shop is packed with people buying Christmas cheese.',
                type: 'crisis',
                monthRange: [17, 18],  // December of year 2
                unique: true,
                priority: 150,
                choices: [
                    {
                        text: 'Close and go immediately',
                        hint: 'He\'s my father',
                        effects: { bank: -4000, stress: 20, reputation: -10 },
                        outcome: 'You drove to Liège that night. The shop stayed closed three days. Customers went elsewhere. Your father held your hand and said "You came." December was a disaster financially. But you were there.',
                        conditionalEffects: () => ({ family: 20 })
                    },
                    {
                        text: 'Go after closing each day',
                        hint: 'I can do both',
                        effects: { stress: 35, energy: -30, family: 5 },
                        outcome: 'You worked 6h-18h, then drove two hours to Liège, sat with him until midnight, drove back, slept four hours, repeated. For a week. Your body remembers this.'
                    },
                    {
                        text: 'Stay, call every day',
                        hint: 'The shop can\'t survive without me right now',
                        effects: { family: -25, stress: 15 },
                        outcome: 'You called twice a day. Sent flowers. Your mother\'s voice was polite but distant. Your father recovered. They said they understand.'
                    }
                ]
            },
            {
                id: 'old_friend',
                title: 'The Old Friend',
                description: 'Thomas is passing through Brussels. You haven\'t seen him in three years - he moved to Berlin, life happened. He\'s free tonight only. "Drinks? Dinner? Like old times?" It\'s Friday. Cheese delivery tomorrow at 6h. You know yourself - if you go out tonight, tomorrow will hurt.',
                type: 'personal',
                monthRange: [6, 30],
                unique: true,
                choices: [
                    {
                        text: 'Go out with Thomas',
                        hint: 'I miss him',
                        effects: { energy: -25, family: 10, stress: -10 },
                        outcome: 'You stayed out until 2h. Talked about everything. Laughed until your stomach hurt. The alarm at 5h30 was brutal. You moved through Saturday like a zombie. Worth it? You think so.'
                    },
                    {
                        text: 'Invite him to the shop instead',
                        hint: 'He can see what I\'ve built',
                        effects: { family: 5, reputation: 3 },
                        outcome: 'Thomas came by at 18h. You gave him the tour, the story, the best cheese. He was impressed. "You really built something." It wasn\'t the same as a real night out, but it was something.'
                    },
                    {
                        text: 'Decline',
                        hint: 'I can\'t, I have work tomorrow',
                        effects: { family: -10 },
                        outcome: 'You texted "Next time for sure." There wasn\'t a next time. Thomas didn\'t come back through Brussels. You wonder sometimes what you would have talked about.'
                    }
                ]
            },
            {
                id: 'birthday_forgot',
                title: 'The Birthday You Forgot',
                description: 'It\'s 22h. You\'re finally home, exhausted. Your phone buzzes - a photo in the family group chat. Cake, candles, your mother smiling. The caption: "Missed you today!"\n\nYour mother\'s birthday. You forgot completely. Not even a call.',
                type: 'crisis',
                monthRange: [12, 36],
                condition: () => gameState.stress >= 50,
                unique: true,
                priority: 90,
                choices: [
                    {
                        text: 'Go see her right now',
                        hint: '...',
                        effects: { family: -10, stress: 10 },
                        outcome: 'She opened the door surprised. "I knew you were busy." Her voice was gentle, which made it worse. You apologized. She said it was fine. It wasn\'t fine.'
                    },
                    {
                        text: 'Send flowers tomorrow with a long apology',
                        hint: '...',
                        effects: { family: -15, bank: -100 },
                        outcome: 'The flowers arrived the next day. Beautiful. Expensive. Your mother called to thank you. The conversation was short. Polite. You could hear the distance.'
                    }
                ]
            },
            {
                id: 'christmas_day',
                title: 'Christmas Day',
                description: 'December 25th. The shop is closed today and tomorrow - finally. Your family expects you at 13h for Christmas lunch. But the shop is chaos. Stock everywhere, orders half-prepared, the 27th reopening looms. You could "just pop in for a few hours" this morning to get ahead...',
                type: 'personal',
                monthRange: [42, 42], // December 2025 - MANDATORY fourth Christmas (finale)
                mandatory: true,
                unique: true,
                choices: [
                    {
                        text: 'Go straight to family',
                        hint: 'It\'s Christmas',
                        effects: { family: 15, stress: 10 },
                        outcome: 'You left the chaos behind. Ate too much. Laughed with cousins. Fell asleep on the couch. The mess waited for you on the 26th. You dealt with it. Somehow you always do.'
                    },
                    {
                        text: '"Just a few hours" at the shop first',
                        hint: 'I\'ll be quick',
                        effects: { stress: -5, family: -10, energy: -10 },
                        outcome: 'A few hours became six. You arrived at 19h, dessert already finished. "You\'re here!" your mother said, not quite hiding her disappointment. The shop was ready for the 27th. The price was on your family\'s faces.'
                    },
                    {
                        text: 'Work through Christmas',
                        hint: 'They\'ll understand',
                        effects: { family: -30, stress: -15, autonomy: 5 },
                        outcome: 'You spent Christmas alone in the shop, Radio Nostalgie playing carols. Got everything perfect for the 27th. Called your mother at 20h. "Maybe next year," she said.',
                        flags: { workedChristmas: true }
                    }
                ]
            },

            // === HIDDEN ENDING EVENT: SECOND SHOP ===
            {
                id: 'second_shop_offer',
                title: 'The Call from Rue au Bois',
                description: 'Your phone rings. It\'s Marie, a fellow fromagère. "Julien, I\'m retiring. My shop on Rue au Bois... I thought of you first. €60,000 for everything - the clientele, the suppliers, the name. Interested?"\n\nA second location. Double the revenue. Double the complexity. You never bought the building here... but you could build an empire instead.',
                type: 'opportunity',
                monthRange: [36, 42],
                condition: () => gameState.bank >= 80000 && !gameState.ownsBuilding,
                unique: true,
                priority: 200, // Very high priority - must happen if conditions are met
                choices: [
                    {
                        text: 'Let\'s do it - expand the empire',
                        hint: '€60,000 investment, become a multi-shop brand',
                        effects: { bank: -60000, stress: 10 },
                        outcome: 'You signed the papers. Chez Julien is now two shops. Your accountant looked at you like you were crazy. Maybe you are. But maybe... this is just the beginning.',
                        flags: { hasSecondShop: true }
                    },
                    {
                        text: 'I\'m happy with one shop',
                        hint: 'You have the money. You choose peace.',
                        effects: { stress: -10 },
                        outcome: '"I\'m flattered, Marie. But I\'ve built something here. One shop, done well. That\'s enough for me." She smiled. "I understand. You\'ve found your contentment."',
                        flags: { declinedExpansion: true }
                    }
                ]
            },

// === STRATEGIC CHOICE EVENTS (One-time decisions about how to run your business) ===
            {
                id: 'systems_project',
                title: 'Time to Systematize',
                description: 'You\'ve been thinking about efficiency. There are tools and systems that could help: email automation for suppliers, inventory software, even a cleaning service. Each takes time to set up, but could pay off.',
                type: 'strategy',
                monthRange: [8, 25],
                unique: true,
                priority: 70,
                choices: [
                    {
                        text: 'Set up email automations',
                        hint: 'Less time on admin, more on cheese',
                        effects: { stress: 5, energy: -10, bank: -200 },
                        outcome: 'A weekend setting up templates and auto-responses. Now supplier orders go out automatically. Invoices reminders too. You freed up hours each week.',
                        conditionalEffects: () => ({ autonomy: 8 })
                    },
                    {
                        text: 'Hire a weekly cleaning service',
                        hint: 'One less thing to worry about',
                        effects: { bank: -300, stress: -8 },
                        outcome: 'Maria comes every Tuesday at 6am. The shop sparkles when you arrive. That weight off your shoulders? Priceless.',
                        conditionalEffects: () => ({ energy: 5 })
                    },
                    {
                        text: 'Keep doing things yourself',
                        hint: 'Save the money',
                        effects: { stress: 5 },
                        outcome: 'You filed the idea away. Maybe later, when there\'s more margin.'
                    }
                ]
            },
            {
                id: 'visibility_push',
                title: 'Building Visibility',
                description: 'The shop is good, but does the neighborhood know? You could invest time in getting the word out. Social media, local partnerships, maybe just walking around with samples.',
                type: 'strategy',
                monthRange: [6, 20],
                unique: true,
                priority: 70,
                choices: [
                    {
                        text: 'Instagram campaign',
                        hint: 'Photos of beautiful cheese wheels...',
                        effects: { stress: 10, energy: -15, bank: -150 },
                        outcome: 'A week of photographing cheese in golden hour light. Posting daily. Hashtags. It felt silly at first. Then people started showing up. "I saw you on Instagram!"',
                        conditionalEffects: () => ({ reputation: 6 })
                    },
                    {
                        text: 'Visit other shops for inspiration',
                        hint: 'See what works elsewhere',
                        effects: { stress: -5, energy: -10, bank: -100 },
                        outcome: 'You spent a Saturday visiting cheese shops in Ghent and Antwerp. Took notes. Stole ideas. Came back inspired. One display change already drew compliments.',
                        conditionalEffects: () => ({ reputation: 3, cheeseExpertise: 3 })
                    },
                    {
                        text: 'Focus on existing customers',
                        hint: 'Word of mouth is enough',
                        effects: { stress: -5 },
                        outcome: 'You stayed in your lane. The regulars are loyal. That counts for something.'
                    }
                ]
            },
            {
                id: 'personal_recharge',
                title: 'Taking Care of Yourself',
                description: 'The shop demands everything. But this month, you\'re thinking about yourself for once. A proper dinner. Seeing friends. Actually sleeping.',
                type: 'strategy',
                monthRange: [10, 28],
                unique: true,
                priority: 70,
                choices: [
                    {
                        text: 'Business dinner with a supplier',
                        hint: 'Good food, good company, tax-deductible',
                        effects: { bank: -150, energy: -5 },
                        outcome: 'Dinner at Comme Chez Soi with your contact from Lalero. Three hours of wine, cheese talk, and laughter. Business relationships are personal relationships.',
                        conditionalEffects: () => ({ stress: -8, producerRelationships: 5, supplierDiscount: 1 })
                    },
                    {
                        text: 'Family weekend',
                        hint: 'Been a while since you were really present',
                        effects: { bank: -200, stress: -10 },
                        outcome: 'You took the weekend. Actually took it. Cooked together. Talked about things other than cheese. Your partner looked at you differently. Remembered.',
                        conditionalEffects: () => ({ family: 12, energy: 10 })
                    },
                    {
                        text: 'Keep pushing through',
                        hint: 'No time for breaks',
                        effects: { stress: 8, autonomy: 3 },
                        outcome: 'Another month of grinding. The shop improves. You... less so. But momentum is momentum.'
                    }
                ]
            },

// === MORE STRATEGIC CHOICE EVENTS ===
            {
                id: 'pricing_strategy',
                title: 'The Pricing Question',
                description: 'You\'ve been thinking about your margins. Some shops charge premium prices and own it. Others compete on value. Where do you want to position yourself?',
                type: 'strategy',
                monthRange: [12, 30],
                unique: true,
                priority: 70,
                condition: () => gameState.cheeseTypes >= 15,
                choices: [
                    {
                        text: 'Go premium - quality justifies price',
                        hint: 'Higher margins, maybe fewer customers',
                        effects: { stress: 5 },
                        outcome: 'You raised prices 10-15%. Some regulars grumbled. But new customers came who expected to pay for quality. Your margin improved noticeably.',
                        conditionalEffects: () => ({ bank: 800, reputation: 5 })
                    },
                    {
                        text: 'Stay accessible - volume matters',
                        hint: 'Keep prices friendly, build loyalty',
                        effects: { stress: 3 },
                        outcome: 'You kept prices reasonable. The neighborhood appreciated it. Word spread that you were the fair cheese shop.',
                        conditionalEffects: () => ({ reputation: 8, family: 3 })
                    },
                    {
                        text: 'Mixed strategy - everyday and special occasion',
                        hint: 'Something for everyone',
                        effects: { stress: 8, energy: -5 },
                        outcome: 'You created two tiers. Everyday cheeses stayed accessible. The special stuff got premium pricing. More work managing it, but it felt right.',
                        conditionalEffects: () => ({ bank: 400, reputation: 4, autonomy: 3 })
                    }
                ]
            },
            {
                id: 'supplier_relationship',
                title: 'Supplier Strategy',
                description: 'You\'re ordering regularly now. Do you consolidate with fewer suppliers for better terms, or keep diversifying for unique products?',
                type: 'strategy',
                monthRange: [14, 32],
                unique: true,
                priority: 65,
                condition: () => gameState.cheeseTypes >= 20,
                choices: [
                    {
                        text: 'Consolidate - negotiate better terms',
                        hint: 'Fewer relationships, better prices',
                        effects: { stress: -5 },
                        outcome: 'You focused on three main suppliers. They gave you better payment terms and priority on rare products. Simpler is sometimes better.',
                        conditionalEffects: () => ({ bank: 600, autonomy: 5 })
                    },
                    {
                        text: 'Diversify - unique products win',
                        hint: 'More relationships, more special finds',
                        effects: { stress: 8, energy: -8 },
                        outcome: 'You added two new small producers. One had an incredible aged goat cheese nobody else carried. Customers noticed the difference.',
                        conditionalEffects: () => ({ reputation: 8, cheeseTypes: 5 })
                    },
                    {
                        text: 'Keep current balance',
                        hint: 'If it\'s working, don\'t fix it',
                        effects: {},
                        outcome: 'You maintained what was working. Sometimes the right move is no move.'
                    }
                ]
            },
            {
                id: 'weekly_rhythm',
                title: 'Finding Your Rhythm',
                description: 'The shop has a pattern now. But you\'re wondering if you could optimize the week better. Different focus for different days?',
                type: 'strategy',
                monthRange: [10, 26],
                unique: true,
                priority: 65,
                choices: [
                    {
                        text: 'Theme days - Tasting Tuesday, etc.',
                        hint: 'Give people reasons to come specific days',
                        effects: { stress: 10, energy: -10, bank: -200 },
                        outcome: 'Tasting Tuesday. Fresh delivery Thursday. It took a few months, but regulars started planning around your schedule.',
                        conditionalEffects: () => ({ reputation: 6, autonomy: 5 })
                    },
                    {
                        text: 'Quiet mornings for admin',
                        hint: 'Protect your thinking time',
                        effects: { stress: -8 },
                        outcome: 'Tuesday and Wednesday mornings became sacred. Ordering, accounting, planning. The afternoons felt calmer knowing the admin was done.',
                        conditionalEffects: () => ({ autonomy: 8, energy: 5 })
                    },
                    {
                        text: 'Stay flexible',
                        hint: 'Every day is different anyway',
                        effects: { stress: 3 },
                        outcome: 'You kept things fluid. Maybe that spontaneity was part of the charm.'
                    }
                ]
            },
            {
                id: 'learning_investment',
                title: 'Investing in Knowledge',
                description: 'There\'s a cheese certification course. Three weekends, €800. Or you could visit producers in France. Or just keep learning by doing.',
                type: 'strategy',
                monthRange: [18, 36],
                unique: true,
                priority: 60,
                condition: () => gameState.cheeseTypes >= 25,
                choices: [
                    {
                        text: 'Take the certification course',
                        hint: 'Formal knowledge, credibility',
                        effects: { bank: -800, stress: 15, energy: -20 },
                        outcome: 'Three intense weekends. Affineur certification. You learned things about aging you\'d never have figured out alone. The certificate hangs in the shop.',
                        conditionalEffects: () => ({ reputation: 10, cheeseTypes: 8, autonomy: 5 })
                    },
                    {
                        text: 'Visit producers in France',
                        hint: 'See where it all comes from',
                        effects: { bank: -600, stress: -5, energy: -10 },
                        outcome: 'A week in Auvergne and Savoie. You saw cellars. Tasted things that never leave the region. Came back with stories and three new suppliers.',
                        conditionalEffects: () => ({ reputation: 6, cheeseTypes: 5, family: -5 })
                    },
                    {
                        text: 'Learn by doing',
                        hint: 'Save the money and time',
                        effects: { stress: 3 },
                        outcome: 'Every wheel taught you something. No certificate needed for that.',
                        conditionalEffects: () => ({ cheeseTypes: 2 })
                    }
                ]
            },
            {
                id: 'shop_atmosphere',
                title: 'The Shop Experience',
                description: 'The shop works, but could it feel better? Music, lighting, the smell when people walk in - these things matter more than you thought.',
                type: 'strategy',
                monthRange: [8, 24],
                unique: true,
                priority: 60,
                choices: [
                    {
                        text: 'Invest in ambiance',
                        hint: 'Better lighting, subtle music, fresh flowers',
                        effects: { bank: -400, stress: 5, energy: -8 },
                        outcome: 'New warm lights. A carefully curated playlist. Fresh flowers on the counter. People started lingering longer. Buying more.',
                        conditionalEffects: () => ({ reputation: 5, bank: 200 })
                    },
                    {
                        text: 'Focus on the product display',
                        hint: 'Let the cheese be the star',
                        effects: { bank: -300, stress: 8, energy: -10 },
                        outcome: 'You reorganized everything. Cheeses grouped by region, then by milk type. Labels with stories. Customers said it felt like a museum they could eat.',
                        conditionalEffects: () => ({ reputation: 6, cheeseTypes: 3 })
                    },
                    {
                        text: 'Keep it authentic',
                        hint: 'Charming as-is',
                        effects: {},
                        outcome: 'The shop had character. Maybe that was enough.'
                    }
                ]
            },

// === MONEY-MAKING OPPORTUNITY EVENTS ===
            {
                id: 'catering_opportunity',
                title: 'Catering Request',
                description: 'A local business wants cheese platters for their monthly client meetings. It\'s recurring revenue but requires early morning prep every second Friday.',
                type: 'opportunity',
                monthRange: [8, 36],
                recurring: true,
                cooldown: 8,
                condition: () => gameState.cheeseTypes >= 15,
                choices: [
                    {
                        text: 'Take the contract',
                        hint: 'Guaranteed income, but time commitment',
                        effects: { stress: 8, energy: -10 },
                        outcome: 'Every two weeks, you\'re up at 5am building platters. But €800 lands in your account monthly. Reliable money feels different.',
                        conditionalEffects: () => ({ bank: 2400, reputation: 4 }) // 3 months advance
                    },
                    {
                        text: 'Negotiate for pickup only',
                        hint: 'Less work, less money',
                        effects: { stress: 3 },
                        outcome: 'They agree to pick up. Simpler. Less margin, but you keep your mornings.',
                        conditionalEffects: () => ({ bank: 1200, reputation: 2 })
                    },
                    {
                        text: 'Decline politely',
                        hint: 'Focus on the shop',
                        effects: {},
                        outcome: 'Not everything is worth chasing. Your schedule is already tight.'
                    }
                ]
            },
            {
                id: 'private_tasting',
                title: 'Private Tasting Request',
                description: 'Someone wants to book the shop for a private cheese tasting - their partner\'s 40th birthday. Eight people, Saturday evening after close.',
                type: 'opportunity',
                monthRange: [6, 42],
                recurring: true,
                cooldown: 5,
                condition: () => gameState.cheeseTypes >= 20,
                choices: [
                    {
                        text: 'Host an elaborate tasting',
                        hint: 'Premium experience, premium price',
                        effects: { stress: 12, energy: -15 },
                        outcome: 'You pulled out your best cheeses, paired with local beers, told the stories. They were captivated. €600 plus they\'ll tell everyone.',
                        conditionalEffects: () => ({ bank: 600, reputation: 8 })
                    },
                    {
                        text: 'Simple tasting, reasonable price',
                        hint: 'Good experience without burning yourself out',
                        effects: { stress: 5, energy: -8 },
                        outcome: 'An intimate evening. Good cheese, good conversation. €300 and a lovely thank-you note the next week.',
                        conditionalEffects: () => ({ bank: 300, reputation: 4 })
                    },
                    {
                        text: 'Suggest they visit during open hours',
                        hint: 'Your evenings are sacred',
                        effects: { stress: -3 },
                        outcome: 'They understood. Some things aren\'t worth disrupting your rhythm for.'
                    }
                ]
            },
            {
                id: 'bulk_order',
                title: 'Restaurant Bulk Order',
                description: () => `A restaurant in ${['Ixelles', 'Etterbeek', 'Uccle'][Math.floor(Math.random() * 3)]} wants to feature your cheeses on their menu. Regular weekly orders, but tight margins.`,
                type: 'opportunity',
                monthRange: [10, 38],
                recurring: true,
                cooldown: 7,
                condition: () => gameState.cheeseTypes >= 25 && gameState.reputation >= 50,
                choices: [
                    {
                        text: 'Full partnership',
                        hint: 'Significant volume, they feature you by name',
                        effects: { stress: 8, energy: -5 },
                        outcome: '"Cheeses from Chez Julien" appears on their menu. The volume helps cash flow. Some of their customers become yours.',
                        conditionalEffects: () => ({ bank: 1800, reputation: 6, cheeseTypes: 2 })
                    },
                    {
                        text: 'Occasional supply only',
                        hint: 'Keep it flexible',
                        effects: { stress: 3 },
                        outcome: 'When they need something special, they call. No commitment, but good relationship.',
                        conditionalEffects: () => ({ bank: 600, reputation: 3 })
                    },
                    {
                        text: 'Decline - retail focus',
                        hint: 'Restaurants mean lower margins',
                        effects: {},
                        outcome: 'You\'re a shop, not a wholesaler. You stay focused.'
                    }
                ]
            },
            {
                id: 'market_stall',
                title: 'Weekend Market Opportunity',
                description: 'A spot opened up at the Dumont market. Every Wednesday afternoon. It\'s good exposure but means another half-day of work.',
                type: 'opportunity',
                monthRange: [6, 30],
                unique: true,
                condition: () => gameState.cheeseTypes >= 15,
                choices: [
                    {
                        text: 'Take the spot',
                        hint: 'New customers, new revenue stream',
                        effects: { stress: 15, energy: -12 },
                        outcome: 'Wednesdays are exhausting now. But the market crowd loves you. Some follow you back to the shop. Revenue up noticeably.',
                        conditionalEffects: () => ({ bank: 1500, reputation: 10, autonomy: -5 })
                    },
                    {
                        text: 'Take it temporarily',
                        hint: 'Try for three months',
                        effects: { stress: 8, energy: -8 },
                        outcome: 'Three months of market life. Learned a lot about what sells. Made some money. Then happily gave up the spot.',
                        conditionalEffects: () => ({ bank: 800, reputation: 5 })
                    },
                    {
                        text: 'Pass on it',
                        hint: 'The shop is enough',
                        effects: {},
                        outcome: 'You let someone else have it. One thing at a time.'
                    }
                ]
            },
            {
                id: 'good_month',
                title: 'An Unexpectedly Good Month',
                description: () => `Something clicked this month. Maybe the weather. Maybe word of mouth. Whatever it was, the register kept ringing. You ended up €${1000 + Math.floor(Math.random() * 1500)} ahead of projections.`,
                type: 'milestone',
                monthRange: [8, 40],
                recurring: true,
                cooldown: 6,
                condition: () => gameState.reputation >= 45 && gameState.stress < 70,
                choices: [
                    {
                        text: 'Save it all',
                        hint: 'Build that cushion',
                        effects: {},
                        outcome: 'Straight into savings. You\'re learning that good months fund the bad ones.',
                        conditionalEffects: () => ({ bank: 1500 + Math.floor(Math.random() * 1000) })
                    },
                    {
                        text: 'Invest in the shop',
                        hint: 'Better equipment, better displays',
                        effects: { bank: -500 },
                        outcome: 'New cheese knives. A better display fridge light. Small things that make the place feel more professional.',
                        conditionalEffects: () => ({ bank: 1000, reputation: 4, autonomy: 3 })
                    },
                    {
                        text: 'Celebrate with family',
                        hint: 'Share the success',
                        effects: { stress: -10 },
                        outcome: 'A nice dinner out. Told the story of the crazy busy Saturday. Your family saw you happy about work for once.',
                        conditionalEffects: () => ({ bank: 800, family: 8 })
                    }
                ]
            },

            {
                id: 'quiet_month',
                title: 'A Quiet Month',
                description: 'Nothing dramatic. The rhythm continues. Customers come, cheese sells, the sun rises and sets. Sometimes that\'s enough.',
                type: 'routine',
                monthRange: [1, 42],
                recurring: true,  // Can repeat as fallback when no other events available
                choices: [
                    {
                        text: 'Rest and recover',
                        hint: 'Use the calm wisely',
                        effects: { energy: 15, stress: -10 },
                        outcome: 'A peaceful month. You left on time a few days. Remembered what relaxation felt like.'
                    },
                    {
                        text: 'Plan and improve',
                        hint: 'Work on the business, not in it',
                        effects: { energy: -5, stress: 5 },
                        outcome: 'You reorganized. Made lists. Thought about the future.',
                        conditionalEffects: () => ({ reputation: 3, autonomy: 5 })
                    }
                ]
            }
        ];

