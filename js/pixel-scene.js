/**
 * PIXEL ART SCENE RENDERER - Stardew Valley Quality
 * Extracted from index.html for safe iteration.
 * Uses gameState passed as parameter - no global dependency.
 *
 * Usage: PixelScene.drawPixelScene(gameState)
 * 
 * Architecture:
 * - Sprite-based system for reusable elements
 * - Layered rendering (background → foreground)
 * - Consistent color palette
 * - Advanced drawing helpers (shading, dithering, outlines)
 */
(function() {
    'use strict';

    const CANVAS_IDS = ['pixel-canvas', 'shop-art'];

    // ============================================================================
    // PHASE 1: FOUNDATION & ARCHITECTURE
    // ============================================================================

    /**
     * COLOR PALETTE SYSTEM
     * Centralized color definitions for consistent styling
     */
    const PALETTE = {
        // Sky colors by time of day
        sky: {
            morning: ['#FFB347', '#FFD700', '#FFE4B5', '#FFF8DC'],
            afternoon: {
                spring: ['#5BA3C6', '#87CEEB', '#A8D8EA', '#D4E5ED'],
                summer: ['#4A90B8', '#6BB3D6', '#87CEEB', '#B0E0E6'],
                autumn: ['#87ACBF', '#A8C8D8', '#C9DDE8', '#E0E8F0'],
                winter: ['#9DB8C7', '#B8D4E3', '#D4E5ED', '#E8F0F5']
            },
            evening: ['#FF6B6B', '#FF8C69', '#FFA07A', '#4A4A6A'],
            night: ['#1A1A2E', '#16213E', '#0F3460', '#0A1929']
        },
        // Building materials
        buildings: {
            brick: ['#8B7355', '#6B5344', '#9B8365', '#A89375', '#7B6344'],
            stone: ['#9E9E9E', '#757575', '#BDBDBD', '#616161'],
            wood: ['#8B6F47', '#6B4F2F', '#A87F5F', '#4A3728'],
            roof: {
                tile: ['#8B4513', '#A0522D', '#CD853F', '#D2691E'],
                slate: ['#2F4F4F', '#3D5A5A', '#4A6A6A', '#1E3D3D']
            }
        },
        // Character colors
        characters: {
            skin: ['#FFDAB9', '#F4A460', '#DEB887', '#D2B48C', '#BC8F8F'],
            hair: {
                brown: ['#4A3728', '#5A4738', '#6B5344', '#3D2F20'],
                black: ['#2C2C2C', '#1A1A1A', '#3D3D3D', '#0F0F0F'],
                blonde: ['#DAA520', '#FFD700', '#F0E68C', '#FFE4B5']
            },
            clothing: {
                green: ['#2C5530', '#3D7042', '#4D8052', '#1E3D22'],
                blue: ['#4169E1', '#5B7FD6', '#6B8FEB', '#2C4FA1'],
                red: ['#DC143C', '#E63950', '#F05064', '#B8122C']
            }
        },
        // Window & glass
        windows: {
            glass: {
                lit: ['#FFE4B5', '#FFF8E0', '#FFE8B0', '#FFD890'],
                unlit: ['#A8C8D8', '#B8D8E8', '#C8E8F8', '#D8F0FF'],
                reflection: ['rgba(255,255,255,0.3)', 'rgba(255,255,200,0.4)']
            },
            frame: ['#4A3728', '#6B5344', '#3D3028', '#2A2015']
        },
        // Environment
        environment: {
            ground: ['#A8A8A8', '#989898', '#B8B8B8', '#C8C8C8'],
            shadow: ['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.15)'],
            highlight: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']
        }
    };

    /**
     * SPRITE SYSTEM
     * Structure for defining reusable sprites with animation support
     */
    const SpriteSystem = {
        /**
         * Create a sprite definition
         * @param {Object} config - Sprite configuration
         * @returns {Object} Sprite definition
         */
        createSprite(config) {
            return {
                width: config.width || 16,
                height: config.height || 16,
                frames: config.frames || [{ data: config.data || [], duration: 200 }],
                palette: config.palette || [],
                hasShadow: config.hasShadow !== false,
                hasOutline: config.hasOutline !== false,
                layer: config.layer || 'foreground' // background, midground, foreground
            };
        },

        /**
         * Draw a sprite at position
         * @param {CanvasRenderingContext2D} ctx - Canvas context
         * @param {Object} sprite - Sprite definition
         * @param {number} x - X position
         * @param {number} y - Y position
         * @param {number} frameIndex - Which animation frame to draw
         */
        drawSprite(ctx, sprite, x, y, frameIndex = 0) {
            const frame = sprite.frames[frameIndex % sprite.frames.length];
            // TODO: Implement pixel data rendering when sprite data format is defined
            // For now, this is a placeholder structure
        }
    };

    /**
     * LAYERED RENDERING SYSTEM
     * Manages rendering order and layer organization
     */
    const LayerSystem = {
        layers: {
            background: [],
            midground: [],
            foreground: [],
            effects: []
        },

        /**
         * Add a draw call to a layer
         * @param {string} layer - Layer name
         * @param {Function} drawFn - Drawing function
         * @param {number} zIndex - Z-order within layer
         */
        addToLayer(layer, drawFn, zIndex = 0) {
            if (!this.layers[layer]) this.layers[layer] = [];
            this.layers[layer].push({ drawFn, zIndex });
            this.layers[layer].sort((a, b) => a.zIndex - b.zIndex);
        },

        /**
         * Render all layers in order
         * @param {CanvasRenderingContext2D} ctx - Canvas context
         */
        renderLayers(ctx) {
            ['background', 'midground', 'foreground', 'effects'].forEach(layerName => {
                this.layers[layerName].forEach(item => {
                    item.drawFn(ctx);
                });
            });
        },

        /**
         * Clear all layers
         */
        clear() {
            Object.keys(this.layers).forEach(key => {
                this.layers[key] = [];
            });
        }
    };

    /**
     * ADVANCED DRAWING HELPERS
     * Functions for creating Stardew Valley-quality effects
     */
    const DrawingHelpers = {
        /**
         * Draw a rectangle with proper shading (Stardew style)
         * @param {CanvasRenderingContext2D} ctx - Canvas context
         * @param {number} x - X position
         * @param {number} y - Y position
         * @param {number} w - Width
         * @param {number} h - Height
         * @param {Array} colors - Color palette [base, dark, light, highlight]
         * @param {string} lightDirection - 'top-left', 'top-right', 'bottom-left', 'bottom-right'
         */
        drawShadedRect(ctx, x, y, w, h, colors, lightDirection = 'top-left') {
            const [base, dark, light, highlight] = colors;
            
            // Base fill
            ctx.fillStyle = base;
            ctx.fillRect(x, y, w, h);
            
            // Shading based on light direction
            if (lightDirection === 'top-left') {
                // Dark bottom-right
                ctx.fillStyle = dark;
                ctx.fillRect(x + w - 2, y, 2, h);
                ctx.fillRect(x, y + h - 2, w, 2);
                
                // Light top-left
                ctx.fillStyle = light;
                ctx.fillRect(x, y, w - 2, 1);
                ctx.fillRect(x, y, 1, h - 2);
                
                // Highlight corner
                if (highlight) {
                    ctx.fillStyle = highlight;
                    ctx.fillRect(x, y, 2, 2);
                }
            }
            // Add other light directions as needed
        },

        /**
         * Draw dithering pattern for texture
         * @param {CanvasRenderingContext2D} ctx - Canvas context
         * @param {number} x - X position
         * @param {number} y - Y position
         * @param {number} w - Width
         * @param {number} h - Height
         * @param {string} color1 - First color
         * @param {string} color2 - Second color
         * @param {number} patternSize - Size of dither pattern (default 2)
         */
        drawDither(ctx, x, y, w, h, color1, color2, patternSize = 2) {
            ctx.fillStyle = color1;
            ctx.fillRect(x, y, w, h);
            
            ctx.fillStyle = color2;
            for (let py = y; py < y + h; py += patternSize) {
                for (let px = x; px < x + w; px += patternSize) {
                    const offset = ((py - y) / patternSize + (px - x) / patternSize) % 2;
                    if (offset === 0) {
                        ctx.fillRect(px, py, patternSize, patternSize);
                    }
                }
            }
        },

        /**
         * Draw an outlined shape (for sprites)
         * @param {CanvasRenderingContext2D} ctx - Canvas context
         * @param {Function} drawFn - Function that draws the shape
         * @param {string} outlineColor - Outline color (default black)
         * @param {number} outlineWidth - Outline width in pixels
         */
        drawWithOutline(ctx, drawFn, outlineColor = '#000000', outlineWidth = 1) {
            // Draw outline by drawing shape slightly larger and offset
            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            
            // Draw outline layers
            for (let i = outlineWidth; i > 0; i--) {
                ctx.strokeStyle = outlineColor;
                ctx.lineWidth = i * 2;
                ctx.globalAlpha = 0.3 / i;
                drawFn(ctx, i);
            }
            
            // Draw main shape
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = 'source-over';
            drawFn(ctx, 0);
            
            ctx.restore();
        },

        /**
         * Draw a shadow beneath a shape
         * @param {CanvasRenderingContext2D} ctx - Canvas context
         * @param {number} x - X position
         * @param {number} y - Y position
         * @param {number} w - Width
         * @param {number} h - Height
         * @param {number} offsetX - Shadow offset X
         * @param {number} offsetY - Shadow offset Y
         * @param {number} blur - Shadow blur amount
         */
        drawShadow(ctx, x, y, w, h, offsetX = 2, offsetY = 2, blur = 3) {
            ctx.save();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.ellipse(x + w/2 + offsetX, y + h + offsetY, w/2, h/4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        },

        /**
         * Draw a gradient with multiple color stops (smooth transitions)
         * @param {CanvasRenderingContext2D} ctx - Canvas context
         * @param {number} x - X position
         * @param {number} y - Y position
         * @param {number} w - Width
         * @param {number} h - Height
         * @param {Array} colors - Array of color stops [{offset: 0-1, color: '#hex'}]
         * @param {string} direction - 'vertical' or 'horizontal'
         */
        drawMultiGradient(ctx, x, y, w, h, colors, direction = 'vertical') {
            const grad = direction === 'vertical' 
                ? ctx.createLinearGradient(x, y, x, y + h)
                : ctx.createLinearGradient(x, y, x + w, y);
            
            colors.forEach(stop => {
                grad.addColorStop(stop.offset, stop.color);
            });
            
            ctx.fillStyle = grad;
            ctx.fillRect(x, y, w, h);
        }
    };

    // Export helpers for use in rendering functions
    window.PixelSceneHelpers = {
        PALETTE,
        SpriteSystem,
        LayerSystem,
        DrawingHelpers
    };

    function drawPixelScene(gameState) {
        if (!gameState) return;
        CANVAS_IDS.forEach(canvasId => {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;
            const W = canvas.width;
            const H = canvas.height;
            renderShopToCanvas(ctx, W, H, gameState);
        });
    }

    function renderShopToCanvas(ctx, W, H, gameState) {
        // CRITICAL: Clear canvas first to prevent flicker
        ctx.clearRect(0, 0, W, H);
        
        // Cache time for this frame to ensure consistency across all animations
        const frameTime = Date.now();
        
        // Scale factor for resolution (320x180 base, can scale up)
        const scaleX = W / 320;
        const scaleY = H / 180;
        const baseScale = Math.min(scaleX, scaleY);
        
        // Get month from gameState, default to 1 (January) if not set
        // This ensures decorations only show in July (month 7) when explicitly set
        const month = (gameState.month !== undefined && gameState.month !== null) ? gameState.month : 1;
        const timeOfDay = gameState.timeOfDay !== undefined ? gameState.timeOfDay : 1; // 0=morning, 1=afternoon, 2=evening, 3=night
        const isWinter = month === 12 || month === 1 || month === 2;
        const isSummer = month >= 6 && month <= 8;
        const isAutumn = month >= 9 && month <= 11;
        const isSpring = month >= 3 && month <= 5;

        // === SKY WITH DAY/NIGHT CYCLE ===
        const skyGrad = ctx.createLinearGradient(0, 0, 0, 100);
        let skyTop, skyBottom, sunMoonX, sunMoonY;
        
        if (timeOfDay === 3) { // NIGHT
            skyTop = '#1A1A2E';
            skyBottom = '#16213E';
            sunMoonX = 50;
            sunMoonY = 25;
        } else if (timeOfDay === 2) { // EVENING
            skyTop = '#FF6B6B';
            skyBottom = '#4A4A6A';
            sunMoonX = 100;
            sunMoonY = 20;
        } else if (timeOfDay === 0) { // MORNING
            skyTop = '#FFB347';
            skyBottom = '#FFD700';
            sunMoonX = 60;
            sunMoonY = 25;
        } else { // AFTERNOON (default)
            if (isWinter) {
                skyTop = '#9DB8C7';
                skyBottom = '#D4E5ED';
            } else if (isAutumn) {
                skyTop = '#87ACBF';
                skyBottom = '#C9DDE8';
            } else if (isSummer) {
                skyTop = '#4A90B8';
                skyBottom = '#87CEEB';
            } else {
                skyTop = '#5BA3C6';
                skyBottom = '#A8D8EA';
            }
            sunMoonX = 280;
            sunMoonY = 30;
        }
        
        skyGrad.addColorStop(0, skyTop);
        skyGrad.addColorStop(1, skyBottom);
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, W, 110);

        // Distant buildings/horizon (darker at night)
        const horizonColor = timeOfDay === 3 ? '#1A1A1A' : '#8899AA';
        ctx.fillStyle = horizonColor;
        ctx.fillRect(0, 85, W, 25);
        ctx.fillStyle = timeOfDay === 3 ? '#0F0F0F' : '#7788AA';
        for (let x = 0; x < W; x += 40) {
            const h = 10 + Math.sin(x * 0.1) * 8;
            ctx.fillRect(x, 95 - h, 35, h + 5);
        }

        // Sun/Moon/Stars based on time
        if (timeOfDay === 3) { // NIGHT - Moon and stars
            // Stars
            ctx.fillStyle = '#FFFFFF';
            const starSeed = Math.floor(frameTime / 2000);
            for (let i = 0; i < 20; i++) {
                const sx = (starSeed * 7 + i * 17) % W;
                const sy = (starSeed * 11 + i * 23) % 80;
                const twinkle = Math.sin(frameTime / 500 + i) * 0.3 + 0.7;
                ctx.globalAlpha = twinkle;
                ctx.fillRect(sx, sy, 1, 1);
                if (i % 3 === 0) ctx.fillRect(sx + 1, sy, 1, 1);
            }
            ctx.globalAlpha = 1;
            // Moon
            const moonGrad = ctx.createRadialGradient(sunMoonX, sunMoonY, 0, sunMoonX, sunMoonY, 20);
            moonGrad.addColorStop(0, '#F0F0F0');
            moonGrad.addColorStop(0.7, '#E0E0E0');
            moonGrad.addColorStop(1, 'rgba(224,224,224,0)');
            ctx.fillStyle = moonGrad;
            ctx.beginPath();
            ctx.arc(sunMoonX, sunMoonY, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#E0E0E0';
            ctx.beginPath();
            ctx.arc(sunMoonX, sunMoonY, 10, 0, Math.PI * 2);
            ctx.fill();
            // Moon craters
            ctx.fillStyle = '#C0C0C0';
            ctx.beginPath();
            ctx.arc(sunMoonX - 3, sunMoonY - 2, 2, 0, Math.PI * 2);
            ctx.arc(sunMoonX + 4, sunMoonY + 3, 1.5, 0, Math.PI * 2);
            ctx.fill();
        } else if (timeOfDay === 2) { // EVENING - Sunset
            const sunsetGrad = ctx.createRadialGradient(sunMoonX, sunMoonY, 0, sunMoonX, sunMoonY, 40);
            sunsetGrad.addColorStop(0, '#FF8C42');
            sunsetGrad.addColorStop(0.5, '#FF6B6B');
            sunsetGrad.addColorStop(1, 'rgba(255,107,107,0)');
            ctx.fillStyle = sunsetGrad;
            ctx.beginPath();
            ctx.arc(sunMoonX, sunMoonY, 40, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#FF8C42';
            ctx.beginPath();
            ctx.arc(sunMoonX, sunMoonY, 15, 0, Math.PI * 2);
            ctx.fill();
        } else if (timeOfDay === 0) { // MORNING - Rising sun
            const morningGrad = ctx.createRadialGradient(sunMoonX, sunMoonY, 0, sunMoonX, sunMoonY, 30);
            morningGrad.addColorStop(0, '#FFD700');
            morningGrad.addColorStop(0.6, '#FF8C42');
            morningGrad.addColorStop(1, 'rgba(255,140,66,0)');
            ctx.fillStyle = morningGrad;
            ctx.beginPath();
            ctx.arc(sunMoonX, sunMoonY, 30, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(sunMoonX, sunMoonY, 14, 0, Math.PI * 2);
            ctx.fill();
        } else { // AFTERNOON - Normal sun
            if (!isWinter) {
                const sunGrad = ctx.createRadialGradient(sunMoonX, sunMoonY, 0, sunMoonX, sunMoonY, 25);
                sunGrad.addColorStop(0, '#FFFFCC');
                sunGrad.addColorStop(0.5, '#FFD700');
                sunGrad.addColorStop(1, 'rgba(255,215,0,0)');
                ctx.fillStyle = sunGrad;
                ctx.beginPath();
                ctx.arc(sunMoonX, sunMoonY, 25, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#FFF8DC';
                ctx.beginPath();
                ctx.arc(sunMoonX, sunMoonY, 12, 0, Math.PI * 2);
                ctx.fill();
            } else {
                drawCloud(ctx, 30, 20, 1);
                drawCloud(ctx, 120, 35, 0.8);
                drawCloud(ctx, 220, 15, 1.2);
                drawCloud(ctx, 280, 40, 0.7);
            }
        }

        // === LEFT NEIGHBORING BUILDING ===
        ctx.fillStyle = '#9A7B5B';
        ctx.fillRect(0, 60, 70, 120);
        ctx.fillStyle = '#8A6B4B';
        ctx.fillRect(0, 60, 5, 120);
        ctx.fillStyle = '#5C4033';
        ctx.fillRect(0, 55, 70, 8);
        ctx.fillStyle = '#4A3025';
        ctx.fillRect(0, 55, 70, 3);
        // Windows with time-based lighting and silhouettes
        const leftWin1Lit = timeOfDay === 3 || timeOfDay === 2; // Evening/night
        // Use deterministic check instead of Math.random() to prevent flicker
        const leftWin2Lit = timeOfDay === 3 || (timeOfDay === 0 && (frameTime % 10000 < 5000)); // Night or morning sometimes (deterministic)
        drawWindow16(ctx, 12, 75, 22, 30, leftWin1Lit);
        drawWindow16(ctx, 42, 75, 22, 30, leftWin2Lit);
        drawWindow16(ctx, 12, 115, 22, 25, false);
        drawWindow16(ctx, 42, 115, 22, 25, false);
        // Silhouettes in lit windows
        if (leftWin1Lit) drawWindowSilhouette(ctx, 12, 75, 22, 30, 'person', frameTime);
        if (leftWin2Lit) drawWindowSilhouette(ctx, 42, 75, 22, 30, 'cooking', frameTime);

        // === RIGHT NEIGHBORING BUILDING ===
        ctx.fillStyle = '#B8956E';
        ctx.fillRect(255, 55, 65, 125);
        ctx.fillStyle = '#C8A57E';
        ctx.fillRect(315, 55, 5, 125);
        ctx.fillStyle = '#6B4423';
        ctx.fillRect(255, 50, 65, 8);
        const rightWin1Lit = timeOfDay === 3 || timeOfDay === 2;
        const rightWin2Lit = timeOfDay === 3;
        drawWindow16(ctx, 265, 70, 20, 28, rightWin1Lit);
        drawWindow16(ctx, 292, 70, 20, 28, rightWin2Lit);
        drawWindow16(ctx, 265, 110, 20, 25, true);
        drawWindow16(ctx, 292, 110, 20, 25, true);
        if (rightWin1Lit) drawWindowSilhouette(ctx, 265, 70, 20, 28, 'reading', frameTime);
        if (rightWin2Lit) drawWindowSilhouette(ctx, 292, 70, 20, 28, 'tv', frameTime);

        // === MAIN SHOP BUILDING ===
        // Upper floors: Light tan/beige brickwork (residential)
        drawBrickWall(ctx, 65, 50, 190, 80, true); // true = light brick color
        
        // Ground floor: Dark gray/charcoal facade panel (shop front)
        // This creates the strong contrast seen in real photos
        ctx.fillStyle = '#2C2C2C'; // Dark charcoal base
        ctx.fillRect(65, 130, 190, 50);
        // White border around dark panel (top and sides)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(65, 130, 190, 2); // Top border
        ctx.fillRect(65, 130, 2, 50); // Left border
        ctx.fillRect(253, 130, 2, 50); // Right border
        
        // Roof/eaves: White overhang
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(65, 48, 190, 6);
        ctx.fillStyle = '#F0F0F0';
        ctx.fillRect(65, 48, 190, 2);
        ctx.fillStyle = '#E8E8E8';
        ctx.fillRect(65, 52, 190, 2);

        drawSeasonalCritter(ctx, 180, 42, month, frameTime);
        // Window sills: Light stone/concrete beneath windows (matching real building)
        ctx.fillStyle = '#E0E0E0'; // Light stone color
        ctx.fillRect(85, 104, 38, 2); // Sill below window 1
        ctx.fillRect(138, 104, 45, 2); // Sill below window 2
        ctx.fillRect(198, 104, 38, 2); // Sill below window 3
        
        // Upper floor windows (Julien's apartment) - lit based on time/stress
        const aptWin1Lit = timeOfDay === 3 || (timeOfDay === 2 && gameState.stress > 50);
        const aptWin2Lit = timeOfDay === 3 || (timeOfDay === 2);
        const aptWin3Lit = timeOfDay === 3;
        drawWindow16(ctx, 85, 62, 38, 42, aptWin1Lit, true);
        drawWindow16(ctx, 138, 62, 45, 42, aptWin2Lit, true);
        drawWindow16(ctx, 198, 62, 38, 42, aptWin3Lit, true);
        // Silhouettes in apartment windows
        if (aptWin1Lit && gameState.stress > 60) drawWindowSilhouette(ctx, 85, 62, 38, 42, 'pacing', frameTime);
        if (aptWin2Lit && timeOfDay === 3) drawWindowSilhouette(ctx, 138, 62, 45, 42, 'reading', frameTime);
        if (aptWin3Lit) drawWindowSilhouette(ctx, 198, 62, 38, 42, 'sitting', frameTime);

        // === WOODEN SIGN BOARD (Top) ===
        // Only appears after the "sign installed" event (investment upgrade)
        if (gameState.signInstalled) {
            // "FROMAGERIE - VIANDES & CHARCUTERIES FERMIÈRES - BIO - ÉPICERIE ET VINS"
            ctx.fillStyle = '#8B6914'; // Golden wood color
            ctx.fillRect(68, 106, 184, 12);
            // Wood grain detail
            ctx.fillStyle = '#9B7924';
            ctx.fillRect(68, 108, 184, 2);
            ctx.fillRect(68, 112, 184, 1);
            ctx.fillStyle = '#7B5904';
            ctx.fillRect(68, 106, 184, 1);
            // Text on wooden sign (simplified)
            ctx.fillStyle = '#2C2C2C';
            ctx.font = '5px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('FROMAGERIE · BIO · ÉPICERIE ET VINS', 160, 114);
        }

        // === GRAY RETRACTABLE AWNING ===
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(70, 118, 180, 3);
        const awningGrad = ctx.createLinearGradient(0, 118, 0, 132);
        awningGrad.addColorStop(0, '#A0A0A0');
        awningGrad.addColorStop(0.3, '#B8B8B8');
        awningGrad.addColorStop(0.7, '#A8A8A8');
        awningGrad.addColorStop(1, '#909090');
        ctx.fillStyle = awningGrad;
        ctx.fillRect(70, 118, 180, 14);
        // Awning folds/texture
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        for (let x = 75; x < 245; x += 20) {
            ctx.fillRect(x, 119, 8, 12);
        }
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        for (let x = 83; x < 245; x += 20) {
            ctx.fillRect(x, 119, 12, 12);
        }

        // === OPEN DOOR (LEFT SIDE) - Can see inside ===
        const shopWindowLit = timeOfDay === 3 || timeOfDay === 2;
        
        // Door frame (white)
        ctx.fillStyle = '#F5F5F5';
        ctx.fillRect(72, 132, 50, 48);
        ctx.fillStyle = '#E0E0E0';
        ctx.fillRect(72, 132, 50, 2);
        ctx.fillRect(72, 132, 3, 48);
        ctx.fillRect(119, 132, 3, 48);
        
        // Interior visible through open door
        const interiorGrad = ctx.createLinearGradient(75, 134, 75, 178);
        if (shopWindowLit) {
            interiorGrad.addColorStop(0, '#4A4A4A'); // Dark ceiling
            interiorGrad.addColorStop(0.15, '#F5F0E6'); // Light wall
            interiorGrad.addColorStop(1, '#8B7355'); // Floor
        } else {
            interiorGrad.addColorStop(0, '#3A3A3A');
            interiorGrad.addColorStop(0.15, '#E5E0D6');
            interiorGrad.addColorStop(1, '#7B6345');
        }
        ctx.fillStyle = interiorGrad;
        ctx.fillRect(75, 134, 44, 44);
        
        // Colorful wall mural (visible through door)
        drawInteriorMural(ctx, 78, 138, frameTime);
        
        // Wooden shelves with products inside door
        drawInteriorShelves(ctx, 76, 150, shopWindowLit);
        
        // Entrance mat
        ctx.fillStyle = '#2C2C2C';
        ctx.fillRect(78, 176, 36, 4);
        ctx.fillStyle = '#3C3C3C';
        ctx.fillRect(80, 177, 32, 2);

        // === SHOP WINDOW (RIGHT SIDE) ===
        // Dark gray facade around window
        ctx.fillStyle = '#3A3A3A';
        ctx.fillRect(122, 132, 128, 48);
        
        // Window frame (white)
        ctx.fillStyle = '#F5F5F5';
        ctx.fillRect(125, 135, 122, 42);
        
        // Window glass - interior view
        const windowGrad = ctx.createLinearGradient(128, 138, 244, 174);
        if (shopWindowLit) {
            windowGrad.addColorStop(0, '#FFF8E0');
            windowGrad.addColorStop(0.5, '#F5EED8');
            windowGrad.addColorStop(1, '#E8E0C8');
        } else {
            windowGrad.addColorStop(0, '#E8F0E8');
            windowGrad.addColorStop(0.5, '#D8E8D8');
            windowGrad.addColorStop(1, '#C8D8C8');
        }
        ctx.fillStyle = windowGrad;
        ctx.fillRect(128, 138, 116, 36);
        
        // Shop name on window - only appears after "shop renamed" event
        if (gameState.shopRenamed) {
            // Name in cursive (uses the chosen shop name)
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.font = 'italic 14px Georgia, serif';
            ctx.textAlign = 'center';
            // Extract first name from shop name (e.g., "Chez Julien" -> "Julien")
            const displayName = gameState.shopName ? 
                gameState.shopName.replace(/^Chez\s+/i, '').replace(/\s+Corner$/i, '') : 
                'Julien';
            ctx.fillText(displayName, 186, 154);
            // Tagline
            ctx.font = 'italic 5px Georgia, serif';
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.fillText('chez moi... chez vous... chez mes potes!', 186, 162);
        }
        
        // Cheese display visible through window
        if (gameState.cheeseTypes >= 5) {
            drawCheeseDisplay(ctx, 130, 145, gameState.cheeseTypes, gameState.hasHenry, frameTime);
        } else if (gameState.hasHenry) {
            drawCheeseDisplay(ctx, 130, 145, 0, gameState.hasHenry, frameTime);
        }
        
        // Glass reflection
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(130, 140, 25, 6);
        ctx.fillRect(200, 142, 20, 4);

        // === OUTDOOR FRUIT/PRODUCE DISPLAY ===
        // Tied to product range - shows when cheeseTypes > 20 (expanded product range)
        if (gameState.cheeseTypes > 20 || gameState.hasWineSelection) {
            drawOutdoorDisplay(ctx, 190, 165, gameState.cheeseTypes, frameTime);
        }
        
        // === SWISS FLAG BANNER ===
        // Tied to raclette event
        if (gameState.hasRaclette || gameState.racletteTypes > 0) {
            drawSwissFlagBanner(ctx, 68, 135, frameTime);
        }

        // === SIDEWALK & STREET ===
        ctx.fillStyle = '#A8A8A8';
        ctx.fillRect(0, 175, W, 5);
        ctx.fillStyle = '#989898';
        for (let x = 0; x < W; x += 20) ctx.fillRect(x, 175, 1, 5);
        ctx.fillStyle = '#B8B8B8';
        ctx.fillRect(0, 175, W, 1);

        if (gameState.monthsPlayed > 10) {
            drawFlowerBox(ctx, 79, 175, isWinter, isAutumn);
        }

        // === CHARACTERS ===
        // Julien appears if not fully staffed
        if (!gameState.hasLucas || !gameState.hasHenry) {
            drawJulienInShop(ctx, gameState.hasLucas ? 115 : 195, 147, gameState, frameTime);
        }
        // Lucas at the door area
        if (gameState.hasLucas) drawCharacter16(ctx, 200, 150, 'lucas', false, gameState, frameTime);
        // Henry is now drawn inside the cheese display (see drawCheeseDisplay)
        // No separate Henry draw needed - he's part of the shop interior
        if (gameState.hasDog) drawPoncho16(ctx, 255, 155, gameState, frameTime);

        const customerCount = Math.min(3, Math.floor(gameState.reputation / 30));
        if (customerCount > 0) drawCharacter16(ctx, 35, 148, 'customer0', false, gameState, frameTime);
        if (customerCount > 1) drawCharacter16(ctx, 55, 152, 'customer1', false, gameState, frameTime);
        if (customerCount > 2) drawCharacter16(ctx, 20, 150, 'customer2', false, gameState, frameTime);

        if (gameState.reputation > 70) {
            const queueCount = Math.min(4, Math.floor((gameState.reputation - 70) / 8));
            drawCustomerQueue(ctx, queueCount);
        }

        if (gameState.hasWineSelection) drawWineDisplay(ctx, 130, 158);
        if (gameState.hasRaclette || gameState.racletteTypes > 0) drawRacletteSteam(ctx);

        const isChristmas = month === 12 || month === 11;
        if (isChristmas) {
            drawChristmasDecorations(ctx);
            if (gameState.family > 50 && Math.floor(frameTime / 5000) % 3 === 0) {
                drawLuciaPainting(ctx);
            }
        }

        if (month === 7) {
            drawBelgianFlag(ctx, 250, 125, frameTime);
            // Balloons and bunting flags only in July (month 7)
            drawPartyDecorations(ctx, frameTime);
        }

        // Anniversary decorations (separate from July party decorations)
        const isAnniversaryMonth = gameState.monthsPlayed === 12 || gameState.monthsPlayed === 24 || gameState.monthsPlayed === 36;
        // Note: Anniversary decorations removed - use July decorations instead

        if (gameState.ownsBuilding && gameState.monthsSinceBuilding !== undefined && gameState.monthsSinceBuilding < 2) {
            drawSoldBanner(ctx);
        }

        if (isWinter) drawSnow(ctx, W, H);
        if (isAutumn) drawLeaves(ctx, W, H);
        if (isSpring) drawPetals(ctx, W, H);

        if (gameState.floodActive) {
            drawRain(ctx, W, H);
            drawFloodWater(ctx, W, H);
        }

        // Night mode overlay (only if not already night time)
        if (gameState.stress > 55 && timeOfDay !== 3) {
            drawNightMode(ctx, W, H, gameState.stress);
        }
        
        // Street lights at night
        if (timeOfDay === 3) {
            drawStreetLights(ctx, W, H);
        }

        if (gameState.ownsBuilding) {
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(248, 53, 16, 12);
            ctx.fillStyle = '#FFF8DC';
            ctx.font = 'bold 10px serif';
            ctx.fillText('★', 252, 63);
        }
    }

    function drawCloud(ctx, x, y, scale) {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(x, y, 12 * scale, 0, Math.PI * 2);
        ctx.arc(x + 15 * scale, y - 5 * scale, 10 * scale, 0, Math.PI * 2);
        ctx.arc(x + 28 * scale, y, 14 * scale, 0, Math.PI * 2);
        ctx.arc(x + 15 * scale, y + 5 * scale, 8 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(150,180,200,0.3)';
        ctx.beginPath();
        ctx.arc(x, y + 3, 10 * scale, 0, Math.PI * 2);
        ctx.arc(x + 28 * scale, y + 3, 12 * scale, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Deterministic hash function for consistent brick shading
     * Returns a pseudo-random value between 0 and 1 based on input
     */
    function hash(x, y) {
        let h = x * 374761393 + y * 668265263;
        h = (h ^ (h >> 15)) * 2246822507;
        h = (h ^ (h >> 13)) * 3266489917;
        return (h ^ (h >> 16)) / 2147483648.0;
    }

    function drawBrickWall(ctx, x, y, w, h, lightBrick = false) {
        // Base brick color (mortar color)
        // Use light tan/beige for residential floors, darker for other buildings
        if (lightBrick) {
            ctx.fillStyle = '#D4C4A8'; // Light tan mortar
        } else {
            ctx.fillStyle = '#8B7355'; // Original darker mortar
        }
        ctx.fillRect(x, y, w, h);
        
        // Draw brick pattern with deterministic shading (no Math.random!)
        const brickHeight = 8;
        const brickWidth = 24;
        const mortarThickness = 2;
        const brickFaceHeight = brickHeight - mortarThickness;
        const brickFaceWidth = brickWidth - mortarThickness;
        
        for (let row = 0; row < h; row += brickHeight) {
            const rowIndex = Math.floor(row / brickHeight);
            // Staggered brick pattern (offset every other row)
            const offset = (rowIndex % 2) * (brickWidth / 2);
            
            for (let col = 0; col < w; col += brickWidth) {
                const colIndex = Math.floor(col / brickWidth);
                const brickX = x + col + offset;
                const brickY = y + row;
                
                // Calculate actual brick dimensions (clamp to wall bounds)
                const actualBrickX = Math.max(x, brickX);
                const actualBrickY = Math.max(y, brickY);
                const actualBrickW = Math.min(brickFaceWidth, x + w - actualBrickX);
                const actualBrickH = Math.min(brickFaceHeight, y + h - actualBrickY);
                
                // Skip if brick is completely outside bounds
                if (actualBrickW <= 0 || actualBrickH <= 0 || brickX >= x + w) continue;
                
                // Use deterministic hash instead of Math.random() for consistent shading
                const shade = (hash(rowIndex, colIndex) * 15 - 7.5); // -7.5 to +7.5 (subtle variation)
                let r, g, b;
                if (lightBrick) {
                    // Light tan/beige brick colors (matching real building)
                    r = Math.max(0, Math.min(255, 212 + shade)); // Base: #D4C4A8
                    g = Math.max(0, Math.min(255, 196 + shade * 0.8));
                    b = Math.max(0, Math.min(255, 168 + shade * 0.6));
                } else {
                    // Original darker brick colors
                    r = Math.max(0, Math.min(255, 160 + shade));
                    g = Math.max(0, Math.min(255, 82 + shade * 0.5));
                    b = Math.max(0, Math.min(255, 45 + shade * 0.3));
                }
                
                // Draw brick face (only if within bounds)
                if (actualBrickW > 0 && actualBrickH > 0) {
                    ctx.fillStyle = `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
                    ctx.fillRect(actualBrickX, actualBrickY, actualBrickW, actualBrickH);
                }
                
                // Draw vertical mortar line on right side (only if not last brick in row and within bounds)
                if (col + brickWidth < w && brickX + brickWidth - mortarThickness < x + w) {
                    const mortarX = brickX + brickFaceWidth;
                    const mortarW = Math.min(mortarThickness, x + w - mortarX);
                    const mortarH = Math.min(brickHeight, y + h - brickY);
                    if (mortarX >= x && mortarW > 0 && mortarH > 0) {
                        ctx.fillStyle = lightBrick ? '#D4C4A8' : '#8B7355';
                        ctx.fillRect(mortarX, brickY, mortarW, mortarH);
                    }
                }
            }
            
            // Draw horizontal mortar line below row (only if not last row)
            if (row + brickHeight < h) {
                const mortarY = y + row + brickFaceHeight;
                const mortarH = Math.min(mortarThickness, y + h - mortarY);
                if (mortarH > 0) {
                    ctx.fillStyle = lightBrick ? '#D4C4A8' : '#8B7355';
                    ctx.fillRect(x, mortarY, w, mortarH);
                }
            }
        }
        
        // Left edge shadow for depth
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(x, y, 2, h);
    }

    function drawWindow16(ctx, x, y, w, h, lit, hasShutters) {
        // Window frame: White (matching real building)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x, y, w, h);
        const glassColor = lit ? '#FFE4B5' : (hasShutters ? '#A8C8D8' : '#B8D8E8');
        ctx.fillStyle = glassColor;
        ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
        // Window cross pattern: Darker frame color for contrast
        ctx.fillStyle = '#E0E0E0'; // Light gray for cross pattern (subtle)
        ctx.fillRect(x + w/2 - 1, y + 2, 2, h - 4);
        ctx.fillRect(x + 2, y + h/2 - 1, w - 4, 2);
        if (lit) {
            ctx.fillStyle = 'rgba(255,255,200,0.3)';
            ctx.fillRect(x + 3, y + 3, 6, 4);
            // Glow effect
            ctx.fillStyle = 'rgba(255,230,150,0.15)';
            ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
        } else {
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            ctx.fillRect(x + 3, y + 3, 6, 4);
        }
        if (hasShutters) {
            ctx.fillStyle = '#2C5530';
            ctx.fillRect(x - 4, y, 4, h);
            ctx.fillRect(x + w, y, 4, h);
            ctx.fillStyle = '#1E3D22';
            ctx.fillRect(x - 4, y, 1, h);
            ctx.fillRect(x + w + 3, y, 1, h);
        }
        ctx.fillStyle = '#6B5344';
        ctx.fillRect(x - 2, y + h, w + 4, 3);
    }

    function drawWindowSilhouette(ctx, x, y, w, h, type, frameTime = Date.now()) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        const centerX = x + w / 2;
        const centerY = y + h / 2;
        const time = frameTime;
        
        if (type === 'person') {
            // Standing person silhouette
            const bob = Math.sin(time / 800) * 0.5;
            ctx.fillRect(centerX - 3, centerY - 8 + bob, 6, 12);
            ctx.fillRect(centerX - 4, centerY - 10 + bob, 8, 4); // Head
            ctx.fillRect(centerX - 2, centerY + 4 + bob, 2, 4); // Legs
            ctx.fillRect(centerX + 2, centerY + 4 + bob, 2, 4);
        } else if (type === 'cooking') {
            // Cooking silhouette
            ctx.fillRect(centerX - 4, centerY - 6, 8, 10);
            ctx.fillRect(centerX - 5, centerY - 8, 10, 4);
            // Arm movement
            const armOffset = Math.sin(time / 400) * 1;
            ctx.fillRect(centerX - 6, centerY - 2 + armOffset, 3, 6);
        } else if (type === 'reading') {
            // Reading silhouette
            ctx.fillRect(centerX - 3, centerY - 8, 6, 10);
            ctx.fillRect(centerX - 4, centerY - 9, 8, 3);
            // Book
            ctx.fillStyle = 'rgba(100,80,60,0.8)';
            ctx.fillRect(centerX + 2, centerY - 4, 4, 5);
        } else if (type === 'tv') {
            // TV watching silhouette
            ctx.fillRect(centerX - 3, centerY - 6, 6, 8);
            ctx.fillRect(centerX - 4, centerY - 7, 8, 3);
            // TV screen glow
            ctx.fillStyle = 'rgba(100,150,255,0.3)';
            ctx.fillRect(centerX + 3, centerY - 4, 6, 4);
        } else if (type === 'pacing') {
            // Pacing silhouette (stress)
            const pace = (time / 300) % (w - 8);
            ctx.fillRect(x + 4 + pace, centerY - 6, 6, 10);
            ctx.fillRect(x + 5 + pace, centerY - 8, 4, 3);
        } else if (type === 'sitting') {
            // Sitting silhouette
            ctx.fillRect(centerX - 3, centerY - 4, 6, 8);
            ctx.fillRect(centerX - 4, centerY - 5, 8, 3);
            ctx.fillRect(centerX - 2, centerY + 4, 4, 2);
        }
    }

    function drawShopWindowActivity(ctx, x, y, w, h, reputation, frameTime = Date.now()) {
        // Customers visible through shop window
        const customerCount = Math.min(2, Math.floor(reputation / 40));
        for (let i = 0; i < customerCount; i++) {
            const cx = x + 15 + i * 25;
            const cy = y + h - 15;
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(cx - 2, cy - 8, 4, 10);
            ctx.fillRect(cx - 3, cy - 10, 6, 3);
        }
        // Movement indicator
        const move = Math.sin(frameTime / 500) * 0.5;
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(x + 10, y + 10 + move, 8, 2);
    }

    function drawStreetLights(ctx, W, H) {
        // Street lamps with warm glow
        const lampPositions = [30, 150, 290];
        for (let x of lampPositions) {
            // Pole
            ctx.fillStyle = '#4A4A4A';
            ctx.fillRect(x, 170, 2, 10);
            // Lamp head
            ctx.fillStyle = '#6B6B6B';
            ctx.fillRect(x - 3, 170, 8, 4);
            // Glow
            const glowGrad = ctx.createRadialGradient(x + 1, 172, 0, x + 1, 172, 15);
            glowGrad.addColorStop(0, 'rgba(255,230,150,0.6)');
            glowGrad.addColorStop(0.5, 'rgba(255,200,100,0.3)');
            glowGrad.addColorStop(1, 'rgba(255,200,100,0)');
            ctx.fillStyle = glowGrad;
            ctx.beginPath();
            ctx.arc(x + 1, 172, 15, 0, Math.PI * 2);
            ctx.fill();
            // Light bulb
            ctx.fillStyle = '#FFE4B5';
            ctx.fillRect(x - 1, 171, 4, 2);
        }
    }

    // === INTERIOR MURAL (colorful wall art visible through open door) ===
    function drawInteriorMural(ctx, x, y, frameTime) {
        // Colorful geometric mural like in real shop
        const colors = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C'];
        
        // Abstract colorful shapes
        for (let i = 0; i < 6; i++) {
            ctx.fillStyle = colors[i % colors.length];
            const px = x + (i % 3) * 12;
            const py = y + Math.floor(i / 3) * 8;
            ctx.fillRect(px, py, 10, 6);
        }
        
        // Outline/frame
        ctx.strokeStyle = '#4A3728';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 1, y - 1, 38, 18);
    }

    // === INTERIOR SHELVES (products visible through door) ===
    function drawInteriorShelves(ctx, x, y, lit) {
        // Wooden shelves
        ctx.fillStyle = '#8B6914';
        ctx.fillRect(x, y, 40, 3);
        ctx.fillRect(x, y + 12, 40, 3);
        
        // Products on shelves
        const shelfProducts = [
            { color: '#FFD700', w: 5, h: 6 }, // Cheese wheel
            { color: '#8B4513', w: 4, h: 7 }, // Bottle
            { color: '#E8C080', w: 6, h: 5 }, // Cheese
            { color: '#722F37', w: 4, h: 8 }, // Wine bottle
            { color: '#FFF5E6', w: 5, h: 4 }, // Cheese
            { color: '#5D4E37', w: 4, h: 6 }, // Jar
        ];
        
        // Top shelf products
        let px = x + 2;
        for (let i = 0; i < 3; i++) {
            const p = shelfProducts[i];
            ctx.fillStyle = p.color;
            ctx.fillRect(px, y - p.h, p.w, p.h);
            px += p.w + 2;
        }
        
        // Bottom shelf products
        px = x + 2;
        for (let i = 3; i < 6; i++) {
            const p = shelfProducts[i];
            ctx.fillStyle = p.color;
            ctx.fillRect(px, y + 12 - p.h, p.w, p.h);
            px += p.w + 2;
        }
        
        // Warm lighting glow if lit
        if (lit) {
            ctx.fillStyle = 'rgba(255,240,200,0.15)';
            ctx.fillRect(x - 2, y - 10, 44, 28);
        }
    }

    // === OUTDOOR PRODUCE DISPLAY (fruit & vegetables in crates) ===
    function drawOutdoorDisplay(ctx, x, y, productRange, frameTime) {
        // Green wooden crate/stand
        ctx.fillStyle = '#2E5530';
        ctx.fillRect(x, y, 52, 14);
        ctx.fillStyle = '#3D7042';
        ctx.fillRect(x + 2, y + 1, 48, 2);
        ctx.fillRect(x + 2, y + 11, 48, 2);
        // Crate slats
        ctx.fillStyle = '#1E3D22';
        ctx.fillRect(x, y + 5, 52, 2);
        ctx.fillRect(x, y + 9, 52, 2);
        
        // Legs
        ctx.fillStyle = '#2E5530';
        ctx.fillRect(x + 2, y + 14, 4, 6);
        ctx.fillRect(x + 46, y + 14, 4, 6);
        
        // Produce in crate (apples, oranges, lemons, etc.)
        const produce = [
            { color: '#E53935', x: 4, y: 3 },   // Red apple
            { color: '#E53935', x: 10, y: 2 },  // Red apple
            { color: '#7CB342', x: 7, y: 5 },   // Green apple
            { color: '#FF9800', x: 16, y: 3 },  // Orange
            { color: '#FF9800', x: 22, y: 2 },  // Orange
            { color: '#FFEB3B', x: 19, y: 5 },  // Lemon
            { color: '#F9A825', x: 28, y: 3 },  // Orange
            { color: '#FFD54F', x: 34, y: 2 },  // Lemon
            { color: '#8BC34A', x: 31, y: 5 },  // Green
            { color: '#E53935', x: 40, y: 3 },  // Red
            { color: '#FF9800', x: 45, y: 4 },  // Orange
        ];
        
        for (const p of produce) {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(x + p.x, y + p.y, 3, 0, Math.PI * 2);
            ctx.fill();
            // Highlight
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.beginPath();
            ctx.arc(x + p.x - 1, y + p.y - 1, 1, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Additional basket/crate at floor level
        ctx.fillStyle = '#8B6914';
        ctx.fillRect(x + 8, y + 18, 20, 10);
        ctx.fillStyle = '#9B7924';
        ctx.fillRect(x + 10, y + 19, 16, 2);
        ctx.fillRect(x + 10, y + 24, 16, 2);
        
        // More produce in basket
        ctx.fillStyle = '#7CB342'; // Green peppers
        ctx.fillRect(x + 12, y + 16, 5, 4);
        ctx.fillStyle = '#FFEB3B'; // Yellow
        ctx.fillRect(x + 18, y + 15, 4, 5);
        ctx.fillStyle = '#E53935'; // Red
        ctx.fillRect(x + 23, y + 16, 4, 4);
    }

    // === SWISS FLAG BANNER (for raclette event) ===
    function drawSwissFlagBanner(ctx, x, y, frameTime) {
        // Vertical banner hanging from building
        const wave = Math.sin(frameTime / 800) * 1;
        const flagX = x + 3 + wave;
        
        // Banner pole (dark metal)
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(x, y - 5, 2, 35);
        ctx.fillStyle = '#5A5A5A';
        ctx.fillRect(x, y - 5, 1, 35); // Highlight
        
        // Flag shadow (drawn FIRST, underneath)
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(flagX + 2, y + 2, 18, 28);
        
        // Swiss flag (red background)
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(flagX, y, 18, 28);
        
        // Subtle shading on flag for depth
        ctx.fillStyle = '#DD0000';
        ctx.fillRect(flagX + 15, y, 3, 28); // Right edge darker
        
        // White cross
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(flagX + 7, y + 4, 4, 20);  // Vertical bar
        ctx.fillRect(flagX + 3, y + 10, 12, 4); // Horizontal bar
    }

    function drawCheeseDisplay(ctx, x, y, cheeseCount, hasHenry = false, frameTime = Date.now()) {
        // === BACK WALL with warm color ===
        ctx.fillStyle = '#F5F0E6'; // Light cream wall
        ctx.fillRect(x - 2, y - 20, 99, 55);
        
        // === FRAMED PHOTOS on wall (like real shop) ===
        const photos = [
            { x: 5, y: -18, w: 10, h: 8 },
            { x: 18, y: -17, w: 8, h: 7 },
            { x: 30, y: -18, w: 11, h: 8 },
            { x: 45, y: -16, w: 7, h: 6 },
            { x: 55, y: -18, w: 9, h: 8 },
            { x: 68, y: -17, w: 10, h: 7 },
            { x: 82, y: -18, w: 8, h: 8 }
        ];
        photos.forEach((p, i) => {
            // Frame
            ctx.fillStyle = '#4A3728';
            ctx.fillRect(x + p.x - 1, y + p.y - 1, p.w + 2, p.h + 2);
            // Photo content (varied colors for different scenes)
            const photoColors = ['#87CEEB', '#90EE90', '#DEB887', '#FFB6C1', '#F0E68C', '#B0C4DE', '#98FB98'];
            ctx.fillStyle = photoColors[i % photoColors.length];
            ctx.fillRect(x + p.x, y + p.y, p.w, p.h);
        });

        // === WOODEN COUNTER/DISPLAY CASE ===
        // Glass display case front
        ctx.fillStyle = '#4A3A2A';
        ctx.fillRect(x - 2, y - 2, 99, 38);
        
        // Glass panel (refrigerated case)
        ctx.fillStyle = 'rgba(200, 220, 255, 0.3)';
        ctx.fillRect(x, y, 95, 34);
        
        // Shelf dividers
        ctx.fillStyle = '#6B4423';
        ctx.fillRect(x - 1, y + 10, 97, 2);
        ctx.fillRect(x - 1, y + 22, 97, 2);
        
        // === CHEESES - Top shelf (small wheels) ===
        const topCheeses = [
            { x: 3, y: 1, w: 10, h: 7, color: '#DEB887' },
            { x: 15, y: 2, w: 11, h: 6, color: '#F4A460' },
            { x: 28, y: 1, w: 9, h: 7, color: '#FFD700' },
            { x: 39, y: 2, w: 10, h: 6, color: '#F5DEB3' },
            { x: 51, y: 1, w: 8, h: 7, color: '#FFA07A' },
            { x: 61, y: 2, w: 11, h: 6, color: '#FFDAB9' },
            { x: 74, y: 1, w: 9, h: 7, color: '#FFE4B5' },
            { x: 85, y: 2, w: 8, h: 6, color: '#F4A460' }
        ];
        
        // === CHEESES - Middle shelf (medium wedges) ===
        const middleCheeses = [
            { x: 4, y: 12, w: 14, h: 8, color: '#F4A460', shadow: '#D4844A' },
            { x: 20, y: 13, w: 16, h: 7, color: '#FFD700', shadow: '#DAA520' },
            { x: 38, y: 12, w: 12, h: 8, color: '#DEB887', shadow: '#C8A060' },
            { x: 52, y: 13, w: 15, h: 7, color: '#F5DEB3', shadow: '#D5BE93' },
            { x: 69, y: 12, w: 13, h: 8, color: '#FFDAB9', shadow: '#E0B090' },
            { x: 84, y: 13, w: 10, h: 7, color: '#FFE4B5', shadow: '#DFC495' }
        ];
        
        // === CHEESES - Bottom shelf (large wheels) ===
        const bottomCheeses = [
            { x: 5, y: 24, w: 18, h: 10, color: '#F4A460', shadow: '#D4844A' },
            { x: 26, y: 25, w: 20, h: 9, color: '#FFD700', shadow: '#DAA520' },
            { x: 50, y: 24, w: 16, h: 10, color: '#DEB887', shadow: '#C8A060' },
            { x: 70, y: 25, w: 22, h: 9, color: '#F5DEB3', shadow: '#D5BE93' }
        ];
        
        // Draw cheeses based on count
        const topCount = Math.min(topCheeses.length, Math.floor(cheeseCount / 8) + 1);
        for (let i = 0; i < topCount; i++) {
            const c = topCheeses[i];
            ctx.fillStyle = c.color;
            ctx.fillRect(x + c.x, y + c.y, c.w, c.h);
            // Highlight
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.fillRect(x + c.x + 1, y + c.y + 1, c.w - 2, 2);
        }
        
        const midCount = Math.min(middleCheeses.length, Math.floor(cheeseCount / 12) + 1);
        for (let i = 0; i < midCount; i++) {
            const c = middleCheeses[i];
            ctx.fillStyle = c.shadow;
            ctx.fillRect(x + c.x + 1, y + c.y + 1, c.w, c.h);
            ctx.fillStyle = c.color;
            ctx.fillRect(x + c.x, y + c.y, c.w, c.h);
            ctx.fillStyle = 'rgba(255,255,255,0.25)';
            ctx.fillRect(x + c.x + 1, y + c.y + 1, c.w - 2, 2);
        }
        
        const botCount = Math.min(bottomCheeses.length, Math.floor(cheeseCount / 15) + 1);
        for (let i = 0; i < botCount; i++) {
            const c = bottomCheeses[i];
            ctx.fillStyle = c.shadow;
            ctx.fillRect(x + c.x + 2, y + c.y + 2, c.w, c.h);
            ctx.fillStyle = c.color;
            ctx.fillRect(x + c.x, y + c.y, c.w, c.h);
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.fillRect(x + c.x + 2, y + c.y + 1, c.w - 4, 3);
        }
        
        // === PRICE LABELS (black tags with white text like real shop) ===
        if (cheeseCount > 15) {
            const labels = [
                { x: 8, y: 7 }, { x: 35, y: 7 }, { x: 62, y: 7 },
                { x: 15, y: 19 }, { x: 45, y: 19 }, { x: 75, y: 19 },
                { x: 20, y: 31 }, { x: 55, y: 31 }
            ];
            labels.slice(0, Math.floor(cheeseCount / 10)).forEach(l => {
                ctx.fillStyle = '#1A1A1A';
                ctx.fillRect(x + l.x, y + l.y, 6, 3);
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(x + l.x + 1, y + l.y + 1, 4, 1);
            });
        }
        
        // === HENRY behind counter (if present) ===
        if (hasHenry) {
            const breathe = Math.sin(frameTime / 600) * 0.3;
            // Henry's position - standing behind counter
            const hx = x + 70;
            const hy = y - 8 + breathe;
            
            // Body (behind counter, partially visible)
            ctx.fillStyle = '#4169E1'; // Blue shirt
            ctx.fillRect(hx, hy + 2, 12, 10);
            
            // White apron front
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(hx + 2, hy + 4, 8, 7);
            
            // Head
            ctx.fillStyle = '#FFE4C4'; // Skin
            ctx.fillRect(hx + 2, hy - 8, 8, 10);
            
            // Blonde/golden hair
            ctx.fillStyle = '#DAA520';
            ctx.fillRect(hx + 2, hy - 10, 8, 4);
            ctx.fillRect(hx + 1, hy - 8, 2, 3);
            ctx.fillRect(hx + 9, hy - 8, 2, 3);
            
            // Eyes
            ctx.fillStyle = '#2C2C2C';
            ctx.fillRect(hx + 3, hy - 5, 2, 2);
            ctx.fillRect(hx + 7, hy - 5, 2, 2);
            
            // Smile
            ctx.fillStyle = '#E08080';
            ctx.fillRect(hx + 4, hy - 2, 4, 1);
            
            // Arms (one holding cheese)
            ctx.fillStyle = '#4169E1';
            ctx.fillRect(hx - 2, hy + 3, 3, 6);
            ctx.fillRect(hx + 11, hy + 3, 3, 6);
            
            // Hands
            ctx.fillStyle = '#FFE4C4';
            ctx.fillRect(hx - 2, hy + 8, 3, 3);
            ctx.fillRect(hx + 11, hy + 8, 3, 3);
            
            // Cheese in hand (work animation)
            if (Math.floor(frameTime / 2000) % 3 === 0) {
                ctx.fillStyle = '#F4A460';
                ctx.fillRect(hx + 13, hy + 6, 5, 4);
            }
        }
        
        // === GLASS REFLECTION ===
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(x + 2, y + 1, 20, 4);
        ctx.fillRect(x + 5, y + 13, 15, 3);
    }

    function drawSeasonalCritter(ctx, x, y, month, frameTime = Date.now()) {
        const isWinter = month === 12 || month === 1 || month === 2;
        const isSpring = month >= 3 && month <= 5;
        const isSummer = month >= 6 && month <= 8;
        const isAutumn = month >= 9 && month <= 11;
        const time = frameTime;
        const bobble = Math.sin(time / 400) * 1;

        if (isAutumn) {
            const peck = Math.floor(time / 300) % 3 === 0 ? 2 : 0;
            ctx.fillStyle = '#707070';
            ctx.fillRect(x, y + bobble, 12, 8);
            ctx.fillStyle = '#606060';
            ctx.fillRect(x + 2, y + 1 + bobble, 8, 4);
            ctx.fillStyle = '#555555';
            ctx.fillRect(x - 4, y + 3 + bobble, 5, 3);
            ctx.fillStyle = '#707070';
            ctx.fillRect(x + 10, y - 4 + peck + bobble, 6, 6);
            ctx.fillStyle = '#50806B';
            ctx.fillRect(x + 10, y + peck + bobble, 4, 3);
            ctx.fillStyle = '#FF6600';
            ctx.fillRect(x + 13, y - 3 + peck + bobble, 2, 2);
            ctx.fillStyle = '#AA9977';
            ctx.fillRect(x + 15, y - 1 + peck + bobble, 3, 2);
            ctx.fillStyle = '#AA6666';
            ctx.fillRect(x + 3, y + 8, 1, 3);
            ctx.fillRect(x + 7, y + 8, 1, 3);
        } else if (isWinter) {
            const tailWag = Math.sin(time / 200) * 0.3;
            ctx.fillStyle = '#8B5A2B';
            ctx.save();
            ctx.translate(x - 2, y + 4);
            ctx.rotate(tailWag);
            ctx.fillRect(-6, -8, 8, 14);
            ctx.fillStyle = '#A0693C';
            ctx.fillRect(-5, -6, 4, 10);
            ctx.restore();
            ctx.fillStyle = '#8B5A2B';
            ctx.fillRect(x + 2, y + 2 + bobble, 10, 8);
            ctx.fillStyle = '#DECCAA';
            ctx.fillRect(x + 4, y + 4 + bobble, 6, 5);
            ctx.fillStyle = '#8B5A2B';
            ctx.fillRect(x + 10, y - 2 + bobble, 8, 8);
            ctx.fillRect(x + 10, y - 5 + bobble, 3, 4);
            ctx.fillRect(x + 15, y - 5 + bobble, 3, 4);
            ctx.fillStyle = '#2C2C2C';
            ctx.fillRect(x + 15, y + bobble, 2, 2);
            ctx.fillRect(x + 17, y + 3 + bobble, 2, 2);
            if (Math.floor(time / 2000) % 2 === 0) {
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(x + 17, y + 5 + bobble, 4, 5);
                ctx.fillStyle = '#228B22';
                ctx.fillRect(x + 18, y + 3 + bobble, 2, 3);
            }
        } else if (isSpring) {
            const hop = Math.floor(time / 500) % 2 * 2;
            ctx.fillStyle = '#8FBC8F';
            ctx.fillRect(x + 2, y + 2 + hop, 8, 6);
            ctx.fillStyle = '#FFFACD';
            ctx.fillRect(x + 4, y + 4 + hop, 5, 3);
            ctx.fillStyle = '#6B8E6B';
            ctx.fillRect(x + 3, y + 2 + hop, 6, 4);
            ctx.fillStyle = '#5C7C5C';
            ctx.fillRect(x - 2, y + 4 + hop, 5, 3);
            ctx.fillStyle = '#8FBC8F';
            ctx.fillRect(x + 8, y - 2 + hop, 6, 6);
            ctx.fillStyle = '#2C2C2C';
            ctx.fillRect(x + 11, y + hop, 2, 2);
            ctx.fillStyle = '#FFA500';
            ctx.fillRect(x + 13, y + 1 + hop, 3, 2);
            ctx.fillStyle = '#8B7355';
            ctx.fillRect(x + 4, y + 8 + hop, 1, 3);
            ctx.fillRect(x + 7, y + 8 + hop, 1, 3);
        } else if (isSummer) {
            const wingFlap = Math.sin(time / 80) * 0.5;
            const flutter = Math.sin(time / 300) * 3;
            ctx.save();
            ctx.translate(x + 6, y + flutter);
            ctx.fillStyle = '#FF69B4';
            ctx.save();
            ctx.rotate(-0.3 + wingFlap);
            ctx.fillRect(-8, -6, 8, 8);
            ctx.fillStyle = '#FFB6C1';
            ctx.fillRect(-6, -4, 4, 4);
            ctx.restore();
            ctx.save();
            ctx.rotate(0.3 - wingFlap);
            ctx.fillRect(0, -6, 8, 8);
            ctx.fillStyle = '#FFB6C1';
            ctx.fillRect(2, -4, 4, 4);
            ctx.restore();
            ctx.fillStyle = '#DDA0DD';
            ctx.save();
            ctx.rotate(-0.2 + wingFlap * 0.8);
            ctx.fillRect(-7, 0, 6, 6);
            ctx.restore();
            ctx.save();
            ctx.rotate(0.2 - wingFlap * 0.8);
            ctx.fillRect(1, 0, 6, 6);
            ctx.restore();
            ctx.fillStyle = '#2C2C2C';
            ctx.fillRect(-1, -4, 2, 10);
            ctx.fillRect(-3, -7, 1, 3);
            ctx.fillRect(2, -7, 1, 3);
            ctx.restore();
        }
    }

    function drawFlowerBox(ctx, x, y, isWinter, isAutumn) {
        ctx.fillStyle = '#5C4033';
        ctx.fillRect(x, y, 90, 8);
        ctx.fillStyle = '#4A3020';
        ctx.fillRect(x, y, 90, 2);
        if (!isWinter) {
            const flowerColors = isAutumn ? ['#FF6347', '#FF8C00', '#FFD700'] : ['#FF69B4', '#FF1493', '#FF6347'];
            for (let i = 0; i < 8; i++) {
                ctx.fillStyle = '#228B22';
                ctx.fillRect(x + 5 + i * 11, y - 8, 2, 8);
                ctx.fillStyle = flowerColors[i % 3];
                ctx.beginPath();
                ctx.arc(x + 6 + i * 11, y - 10, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    function drawCharacter16(ctx, x, y, type, behindWindow = false, gameState = {}, frameTime = Date.now()) {
        const colors = {
            lucas: { hair: '#4A3728', shirt: '#2C5530', skin: '#FFDAB9' },
            henry: { hair: '#DAA520', shirt: '#4169E1', skin: '#FFE4C4' },
            customer0: { hair: '#8B4513', shirt: '#DC143C', skin: '#FFDAB9' },
            customer1: { hair: '#2C2C2C', shirt: '#4682B4', skin: '#DEB887' },
            customer2: { hair: '#CD853F', shirt: '#9370DB', skin: '#FFDAB9' }
        };
        const c = colors[type] || colors.customer0;
        const time = frameTime;
        const idleAnim = Math.sin(time / 1000) * 0.3;
        const gestureFrame = Math.floor(time / 2500) % 3;
        
        if (behindWindow) {
            ctx.fillStyle = c.shirt;
            ctx.fillRect(x, y, 12, 10);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 2, y + 1, 8, 7);
            ctx.fillStyle = c.skin;
            ctx.fillRect(x + 2, y - 8, 8, 9);
            ctx.fillStyle = c.hair;
            ctx.fillRect(x + 2, y - 10, 8, 4);
            return;
        }
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(x + 7, y + 27 + idleAnim, 6, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#2F4F4F';
        ctx.fillRect(x + 2, y + 16 + idleAnim, 4, 10);
        ctx.fillRect(x + 8, y + 16 + idleAnim, 4, 10);
        ctx.fillStyle = c.shirt;
        ctx.fillRect(x, y + idleAnim, 14, 17);
        if (type === 'lucas' || type === 'henry') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 2, y + 3 + idleAnim, 10, 12);
            ctx.fillStyle = '#F0F0F0';
            ctx.fillRect(x + 2, y + 3 + idleAnim, 10, 2);
        }
        ctx.fillStyle = c.shirt;
        // Arms with gesture animation
        const armOffset = gestureFrame === 1 ? 1 : (gestureFrame === 2 ? -1 : 0);
        ctx.fillRect(x - 2, y + 2 + idleAnim + armOffset, 3, 10);
        ctx.fillRect(x + 13, y + 2 + idleAnim - armOffset, 3, 10);
        ctx.fillStyle = c.skin;
        ctx.fillRect(x - 2, y + 12 + idleAnim, 3, 4);
        ctx.fillRect(x + 13, y + 12 + idleAnim, 3, 4);
        ctx.fillStyle = c.skin;
        ctx.fillRect(x + 2, y - 12 + idleAnim, 10, 12);
        ctx.fillStyle = c.hair;
        ctx.fillRect(x + 2, y - 14 + idleAnim, 10, 5);
        ctx.fillRect(x + 1, y - 12 + idleAnim, 2, 4);
        ctx.fillRect(x + 11, y - 12 + idleAnim, 2, 4);
        ctx.fillStyle = '#2C2C2C';
        ctx.fillRect(x + 4, y - 8 + idleAnim, 2, 2);
        ctx.fillRect(x + 8, y - 8 + idleAnim, 2, 2);
        ctx.fillStyle = '#E08080';
        ctx.fillRect(x + 5, y - 4 + idleAnim, 4, 1);
        
        // Work animation for Lucas/Henry
        if ((type === 'lucas' || type === 'henry') && gestureFrame === 0) {
            // Holding cheese/working
            ctx.fillStyle = '#F4A460';
            ctx.fillRect(x + 15, y + 5 + idleAnim, 4, 3);
        }
    }

    function drawJulienInShop(ctx, x, y, gameState, frameTime = Date.now()) {
        const breathe = Math.sin(frameTime / 600) * 0.5;
        const stressLevel = gameState.stress || 0;
        const isStressed = stressLevel > 60;
        const gestureFrame = Math.floor(frameTime / 2000) % 4;
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(x + 8, y + 30, 8, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(x + 2, y + 18, 5, 11);
        ctx.fillRect(x + 9, y + 18, 5, 11);
        ctx.fillStyle = '#1A1A1A';
        ctx.fillRect(x + 1, y + 27, 7, 4);
        ctx.fillRect(x + 8, y + 27, 7, 4);
        ctx.fillStyle = '#3498DB';
        ctx.fillRect(x, y, 16, 20);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 2, y + 4, 12, 14);
        ctx.fillStyle = '#F0F0F0';
        ctx.fillRect(x + 4, y + 10, 8, 5);
        ctx.strokeStyle = '#DDDDDD';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x + 4, y + 10, 8, 5);
        ctx.fillStyle = '#3498DB';
        ctx.fillRect(x - 3, y + 3, 4, 12);
        ctx.fillRect(x + 15, y + 3, 4, 12);
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(x - 3, y + 14, 4, 4);
        ctx.fillRect(x + 15, y + 14, 4, 4);
        // Gesture animations based on stress
        if (isStressed && gestureFrame === 0) {
            // Rubbing head gesture
            ctx.fillStyle = '#DEB887';
            ctx.fillRect(x + 18, y + 12, 4, 6);
        } else if (gestureFrame === 1 && !isStressed) {
            // Waving/pointing
            ctx.fillStyle = '#DEB887';
            ctx.fillRect(x + 19, y + 10, 3, 8);
            ctx.fillRect(x + 22, y + 12, 4, 2);
        } else if (Math.floor(frameTime / 3000) % 3 === 0) {
            // Cheese gesture (original)
            ctx.fillStyle = '#F4A460';
            ctx.beginPath();
            ctx.ellipse(x + 19, y + 15, 5, 3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#D4844A';
            ctx.beginPath();
            ctx.arc(x + 19, y + 15, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(x + 2, y - 14, 12, 14);
        ctx.fillStyle = '#4A3728';
        ctx.fillRect(x + 1, y - 16, 14, 6);
        ctx.fillRect(x + 1, y - 14, 3, 5);
        ctx.fillRect(x + 12, y - 14, 3, 5);
        ctx.fillStyle = '#5A4738';
        ctx.fillRect(x + 5, y - 15, 4, 2);
        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(x + 4, y - 10, 2, 2);
        ctx.fillRect(x + 10, y - 10, 2, 2);
        ctx.fillStyle = '#3A2718';
        ctx.fillRect(x + 3, y - 12, 4, 1);
        ctx.fillRect(x + 9, y - 12, 4, 1);
        ctx.fillStyle = '#C0826E';
        ctx.fillRect(x + 5, y - 6, 6, 2);
        ctx.fillStyle = '#CBA877';
        ctx.fillRect(x + 7, y - 8, 2, 2);
    }

    function drawPoncho16(ctx, x, y, gameState = {}, frameTime = Date.now()) {
        const time = frameTime;
        const frame = Math.floor(time / 400) % 2;
        const wagFrame = Math.floor(time / 120) % 4;
        const breathe = Math.sin(time / 500) * 0.5;
        const stressLevel = gameState.stress || 0;
        const reputation = gameState.reputation || 0;
        
        // Poncho states: sleeping (night/low rep), playing (high rep), normal
        const isSleeping = (gameState.timeOfDay === 3 || gameState.timeOfDay === 0) && reputation < 50;
        const isPlaying = reputation > 70 && Math.floor(time / 3000) % 3 === 0;
        if (isSleeping) {
            // Sleeping Poncho (lying down)
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x, y + 8, 20, 10);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 3, y + 10, 8, 6);
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x + 18, y + 6, 10, 8);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 20, y + 7, 6, 6);
            ctx.fillStyle = '#2C2C2C';
            ctx.fillRect(x + 22, y + 8, 2, 1); // Closed eyes
            ctx.fillRect(x + 25, y + 8, 2, 1);
            // Zzz
            ctx.fillStyle = '#888888';
            ctx.font = '8px sans-serif';
            ctx.fillText('z', x + 28, y + 10);
            ctx.fillText('z', x + 30, y + 8);
            ctx.fillText('z', x + 32, y + 6);
        } else if (isPlaying) {
            // Playing Poncho (jumping/bouncing)
            const jump = Math.sin(time / 300) * 3;
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.beginPath();
            ctx.ellipse(x + 12, y + 22 + jump, 10, 3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#FFFFFF';
            const tailAngle = Math.sin(time / 200) * 0.8;
            ctx.save();
            ctx.translate(x, y + 6 + jump);
            ctx.rotate(tailAngle);
            ctx.fillRect(-8, -2, 10, 5);
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(-8, -2, 3, 5);
            ctx.restore();
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x, y + jump, 22, 14);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 3, y + 6 + jump, 10, 8);
            ctx.fillRect(x + 16, y + 2 + jump, 6, 10);
            ctx.fillStyle = '#2C2C2C';
            ctx.fillRect(x + 14, y + 1 + jump, 4, 6);
            ctx.fillRect(x + 2, y + 1 + jump, 5, 4);
            // Legs in jumping position
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x + 3, y + 14 + jump, 4, 5);
            ctx.fillRect(x + 9, y + 14 + jump, 4, 5);
            ctx.fillRect(x + 15, y + 14 + jump, 4, 5);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 3, y + 17 + jump, 4, 2);
            ctx.fillRect(x + 9, y + 17 + jump, 4, 2);
            ctx.fillRect(x + 15, y + 17 + jump, 4, 2);
            // Head
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x + 18, y - 4 + jump, 12, 12);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 22, y - 3 + jump, 5, 10);
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x + 17, y - 7 + jump, 5, 5);
            ctx.fillRect(x + 26, y - 7 + jump, 5, 5);
            ctx.fillStyle = '#2C2C2C';
            ctx.fillRect(x + 17, y - 7 + jump, 5, 2);
            ctx.fillRect(x + 26, y - 7 + jump, 5, 2);
            ctx.fillRect(x + 28, y + 2 + jump, 3, 3);
            ctx.fillStyle = '#4169E1';
            ctx.fillRect(x + 25, y - 1 + jump, 3, 3);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 26, y + jump, 1, 1);
            // Tongue out (happy)
            ctx.fillStyle = '#FF6B6B';
            ctx.fillRect(x + 28, y + 5 + jump, 2, 4);
        } else {
            // Normal Poncho (enhanced animations)
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.beginPath();
            ctx.ellipse(x + 12, y + 22 + breathe, 10, 3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#FFFFFF';
            const tailAngle = (wagFrame - 1.5) * 0.4; // More wag
            ctx.save();
            ctx.translate(x, y + 6);
            ctx.rotate(tailAngle);
            ctx.fillRect(-8, -2, 10, 5);
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(-8, -2, 3, 5);
            ctx.restore();
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x, y + breathe, 22, 14);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 3, y + 6 + breathe, 10, 8);
            ctx.fillRect(x + 16, y + 2 + breathe, 6, 10);
            ctx.fillStyle = '#2C2C2C';
            ctx.fillRect(x + 14, y + 1 + breathe, 4, 6);
            ctx.fillRect(x + 2, y + 1 + breathe, 5, 4);
            ctx.fillStyle = '#8B4513';
            const legOffset = frame * 2;
            ctx.fillRect(x + 3, y + 14 + breathe, 4, 7 - legOffset);
            ctx.fillRect(x + 9, y + 14 + breathe, 4, 7 + legOffset);
            ctx.fillRect(x + 15, y + 14 + breathe, 4, 7 - legOffset);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 3, y + 19 - legOffset + breathe, 4, 2);
            ctx.fillRect(x + 9, y + 19 + legOffset + breathe, 4, 2);
            ctx.fillRect(x + 15, y + 19 - legOffset + breathe, 4, 2);
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x + 18, y - 4 + breathe, 12, 12);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 22, y - 3 + breathe, 5, 10);
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x + 17, y - 7 + breathe, 5, 5);
            ctx.fillRect(x + 26, y - 7 + breathe, 5, 5);
            ctx.fillStyle = '#2C2C2C';
            ctx.fillRect(x + 17, y - 7 + breathe, 5, 2);
            ctx.fillRect(x + 26, y - 7 + breathe, 5, 2);
            ctx.fillRect(x + 28, y + 2 + breathe, 3, 3);
            ctx.fillStyle = '#4169E1';
            ctx.fillRect(x + 25, y - 1 + breathe, 3, 3);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 26, y + breathe, 1, 1);
            // Tail wag affects tongue
            if (wagFrame === 2 || wagFrame === 3) {
                ctx.fillStyle = '#FF6B6B';
                ctx.fillRect(x + 28, y + 5 + breathe, 2, 4);
            }
        }
    }

    function drawSnow(ctx, W, H) {
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 50; i++) {
            const x = (Date.now() / 30 + i * 41) % W;
            const y = (Date.now() / 20 + i * 29) % (H - 5);
            const size = 1 + (i % 3);
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 173, W, 7);
        ctx.fillStyle = '#E8E8E8';
        for (let x = 0; x < W; x += 8) ctx.fillRect(x, 172, 6, 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(72, 105, 176, 4);
        ctx.fillRect(79, 175, 92, 2);
        ctx.fillRect(191, 128, 45, 2);
    }

    function drawRain(ctx, W, H) {
        ctx.strokeStyle = 'rgba(100, 150, 200, 0.6)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 60; i++) {
            const x = (Date.now() / 15 + i * 31) % W;
            const y = (Date.now() / 8 + i * 23) % H;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - 2, y + 8);
            ctx.stroke();
        }
        ctx.fillStyle = 'rgba(100, 150, 200, 0.4)';
        for (let px = 10; px < W; px += 45) {
            ctx.beginPath();
            ctx.ellipse(px + Math.sin(px) * 10, 177, 15 + (px % 10), 3, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawFloodWater(ctx, W, H) {
        const waveOffset = Math.sin(Date.now() / 300) * 2;
        ctx.fillStyle = 'rgba(70, 130, 180, 0.7)';
        ctx.fillRect(0, 165 + waveOffset, W, 15);
        ctx.fillStyle = 'rgba(135, 206, 250, 0.5)';
        for (let x = 0; x < W; x += 20) {
            const wave = Math.sin((Date.now() / 200) + x * 0.1) * 2;
            ctx.fillRect(x, 163 + wave, 12, 3);
        }
        ctx.fillStyle = '#8B4513';
        const debrisX = (Date.now() / 50) % (W + 40) - 20;
        ctx.fillRect(debrisX, 162 + waveOffset, 8, 4);
        ctx.fillRect(debrisX + 100, 164 + waveOffset, 6, 3);
    }

    function drawLeaves(ctx, W, H) {
        const leafColors = ['#FF6347', '#FF8C00', '#FFD700', '#8B4513'];
        for (let i = 0; i < 12; i++) {
            const x = (Date.now() / 60 + i * 53) % (W + 20) - 10;
            const y = (Date.now() / 35 + i * 37) % (H - 10);
            const rot = (Date.now() / 200 + i) % (Math.PI * 2);
            ctx.fillStyle = leafColors[i % leafColors.length];
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rot);
            ctx.beginPath();
            ctx.moveTo(0, -4);
            ctx.lineTo(3, 0);
            ctx.lineTo(0, 4);
            ctx.lineTo(-3, 0);
            ctx.fill();
            ctx.restore();
        }
    }

    function drawPetals(ctx, W, H) {
        ctx.fillStyle = '#FFB6C1';
        for (let i = 0; i < 8; i++) {
            const x = (Date.now() / 80 + i * 67) % W;
            const y = (Date.now() / 45 + i * 43) % (H - 20);
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawChristmasDecorations(ctx) {
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(215, 145, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1B5E20';
        ctx.beginPath();
        ctx.arc(215, 145, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#DC143C';
        ctx.fillRect(212, 154, 6, 4);
        ctx.beginPath();
        ctx.moveTo(210, 155);
        ctx.lineTo(215, 158);
        ctx.lineTo(220, 155);
        ctx.fill();
        ctx.fillStyle = '#DC143C';
        ctx.beginPath();
        ctx.arc(210, 140, 2, 0, Math.PI * 2);
        ctx.arc(220, 143, 2, 0, Math.PI * 2);
        ctx.arc(212, 150, 2, 0, Math.PI * 2);
        ctx.fill();
        const lightColors = ['#FF0000', '#00FF00', '#FFD700', '#0000FF', '#FF69B4'];
        const blink = Math.floor(Date.now() / 300) % 2;
        for (let i = 0; i < 15; i++) {
            const lx = 78 + i * 12;
            const ly = 126 + Math.sin(i * 0.8) * 2;
            ctx.strokeStyle = '#2C2C2C';
            ctx.lineWidth = 1;
            if (i < 14) {
                ctx.beginPath();
                ctx.moveTo(lx, ly);
                ctx.lineTo(lx + 12, 126 + Math.sin((i + 1) * 0.8) * 2);
                ctx.stroke();
            }
            const colorIndex = (i + (blink && i % 2 === 0 ? 1 : 0)) % lightColors.length;
            ctx.fillStyle = lightColors[colorIndex];
            ctx.beginPath();
            ctx.arc(lx, ly + 3, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = lightColors[colorIndex] + '40';
            ctx.beginPath();
            ctx.arc(lx, ly + 3, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let corner of [{x: 82, y: 134}, {x: 170, y: 134}, {x: 82, y: 168}, {x: 170, y: 168}]) {
            ctx.beginPath();
            ctx.arc(corner.x, corner.y, 6, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawNightMode(ctx, W, H, stressLevel) {
        const darkness = Math.min(0.4, (stressLevel - 50) / 100);
        ctx.fillStyle = `rgba(20, 20, 40, ${darkness})`;
        ctx.fillRect(0, 0, W, H);
        if (darkness > 0.2) {
            ctx.fillStyle = 'rgba(255, 230, 150, 0.6)';
            ctx.fillRect(79, 131, 99, 44);
            ctx.fillRect(196, 136, 15, 14);
            ctx.fillRect(219, 136, 15, 14);
        }
    }

    function drawRacletteSteam(ctx) {
        // Steam rising from inside the shop window (raclette corner)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let i = 0; i < 4; i++) {
            const time = Date.now() / 600 + i * 0.8;
            const x = 220 + Math.sin(time * 1.5) * 2; // Moved to right side of window
            const y = 155 - (time % 2.5) * 6; // Inside window area
            const size = 1.5 + (time % 2);
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawWineDisplay(ctx, x, y) {
        const bottles = [
            { dx: 0, color: '#722F37' },
            { dx: 8, color: '#8B0000' },
            { dx: 16, color: '#F5F5DC' },
            { dx: 24, color: '#722F37' }
        ];
        for (let b of bottles) {
            ctx.fillStyle = b.color;
            ctx.fillRect(x + b.dx, y, 6, 15);
            ctx.fillRect(x + b.dx + 1, y - 5, 4, 6);
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x + b.dx + 1, y - 7, 4, 3);
        }
    }

    function drawCustomerQueue(ctx, count) {
        const queuePositions = [{ x: 245, y: 148 }, { x: 265, y: 152 }, { x: 285, y: 148 }, { x: 300, y: 150 }];
        const colors = [
            { hair: '#2C2C2C', shirt: '#4682B4', skin: '#FFDAB9' },
            { hair: '#DAA520', shirt: '#DC143C', skin: '#FFE4C4' },
            { hair: '#8B4513', shirt: '#9370DB', skin: '#DEB887' },
            { hair: '#CD853F', shirt: '#20B2AA', skin: '#FFDAB9' }
        ];
        for (let i = 0; i < Math.min(count, 4); i++) {
            const pos = queuePositions[i];
            const c = colors[i];
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.beginPath();
            ctx.ellipse(pos.x + 5, pos.y + 27, 5, 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#2F4F4F';
            ctx.fillRect(pos.x + 2, pos.y + 16, 3, 10);
            ctx.fillRect(pos.x + 6, pos.y + 16, 3, 10);
            ctx.fillStyle = c.shirt;
            ctx.fillRect(pos.x, pos.y, 11, 16);
            ctx.fillStyle = c.skin;
            ctx.fillRect(pos.x + 2, pos.y - 10, 7, 10);
            ctx.fillStyle = c.hair;
            ctx.fillRect(pos.x + 2, pos.y - 12, 7, 4);
        }
    }

    function drawBelgianFlag(ctx, x, y, frameTime = Date.now()) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x, y, 2, 25);
        // Slower, smoother wave animation (similar to butterfly timing)
        const wave = Math.sin(frameTime / 600) * 1.5; // Slower: /600 instead of /200, smaller amplitude
        ctx.fillStyle = '#2D2926';
        ctx.fillRect(x + 2, y + wave, 6, 15);
        ctx.fillStyle = '#FDDA24';
        ctx.fillRect(x + 8, y + wave, 6, 15);
        ctx.fillStyle = '#EF3340';
        ctx.fillRect(x + 14, y + wave, 6, 15);
    }

    function drawPartyDecorations(ctx, frameTime = Date.now()) {
        // Bunting flags (triangular flags on string)
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'];
        for (let i = 0; i < 12; i++) {
            const bx = 75 + i * 15;
            const by = 100 + Math.sin(i * 0.5) * 3;
            ctx.fillStyle = colors[i % colors.length];
            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.lineTo(bx + 7, by);
            ctx.lineTo(bx + 3.5, by + 10);
            ctx.fill();
        }
        // String connecting flags
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(72, 100);
        for (let i = 0; i < 12; i++) ctx.lineTo(78 + i * 15, 100 + Math.sin(i * 0.5) * 3);
        ctx.stroke();
        
        // Balloons (only in July)
        const balloonColors = ['#FF6B6B', '#4ECDC4', '#FFE66D'];
        for (let i = 0; i < 3; i++) {
            const bx = 185 + i * 18;
            const by = 90 + Math.sin(frameTime / 400 + i) * 3; // Use frameTime instead of Date.now()
            ctx.fillStyle = balloonColors[i];
            ctx.beginPath();
            ctx.ellipse(bx, by, 7, 9, 0, 0, Math.PI * 2);
            ctx.fill();
            // Balloon string
            ctx.strokeStyle = '#999';
            ctx.beginPath();
            ctx.moveTo(bx, by + 9);
            ctx.lineTo(bx + Math.sin(i) * 3, 110);
            ctx.stroke();
        }
    }

    function drawLuciaPainting(ctx) {
        const x = 165, y = 140;
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x - 5, y - 20, 3, 50);
        ctx.fillRect(x + 10, y - 20, 3, 50);
        for (let r = 0; r < 5; r++) ctx.fillRect(x - 5, y - 15 + r * 10, 18, 2);
        ctx.fillStyle = '#2F4F4F';
        ctx.fillRect(x, y - 5, 8, 15);
        ctx.fillStyle = '#FF69B4';
        ctx.fillRect(x, y - 5, 8, 10);
        ctx.fillStyle = '#FFDAB9';
        ctx.fillRect(x + 1, y - 13, 6, 8);
        ctx.fillStyle = '#4A3728';
        ctx.fillRect(x, y - 15, 8, 5);
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 8, y - 8, 10, 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 16, y - 9, 4, 4);
    }

    function drawSoldBanner(ctx) {
        ctx.fillStyle = '#DC143C';
        ctx.save();
        ctx.translate(160, 85);
        ctx.rotate(-0.15);
        ctx.fillRect(-40, -8, 80, 16);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('VENDU!', 0, 4);
        ctx.restore();
    }

    window.PixelScene = {
        drawPixelScene: drawPixelScene,
        renderShopToCanvas: renderShopToCanvas
    };
})();
