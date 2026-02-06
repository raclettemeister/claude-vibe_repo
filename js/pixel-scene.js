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
        // Subtle life hint in lit windows (no detailed silhouettes)
        if (leftWin1Lit && timeOfDay === 3) {
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.fillRect(18, 85, 10, 15);
        }

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
        // Subtle life hint (no detailed silhouettes)
        if (rightWin2Lit && timeOfDay === 3) {
            // Hint of TV flicker
            const flicker = Math.sin(frameTime / 200) > 0 ? 0.08 : 0.12;
            ctx.fillStyle = `rgba(100,150,255,${flicker})`;
            ctx.fillRect(295, 78, 12, 8);
        }

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

        drawSeasonalCritters(ctx, month, frameTime, gameState.monthsPlayed || 1);
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
        
        // At night: just subtle warm glow indicating life, no detailed silhouettes
        // Only show vague movement hint when stressed (very subtle)
        if (timeOfDay === 3 && gameState.stress > 70) {
            // Very subtle movement shadow in one window
            ctx.fillStyle = 'rgba(0,0,0,0.15)';
            const shift = Math.sin(frameTime / 1000) * 3;
            ctx.fillRect(92 + shift, 75, 8, 20);
        }

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

        // === OPEN DOOR (LEFT SIDE) - Can see inside with depth ===
        const shopWindowLit = timeOfDay === 3 || timeOfDay === 2;
        const isLit = shopWindowLit || timeOfDay === 1; // Lit during day too
        
        // Door frame (white)
        ctx.fillStyle = '#F5F5F5';
        ctx.fillRect(72, 132, 50, 48);
        ctx.fillStyle = '#E0E0E0';
        ctx.fillRect(72, 132, 50, 2);
        ctx.fillRect(72, 132, 3, 48);
        ctx.fillRect(119, 132, 3, 48);
        
        // === INTERIOR WITH DEPTH ===
        // Dark ceiling (like real shop - black with track lighting)
        ctx.fillStyle = '#1A1A1A';
        ctx.fillRect(75, 134, 44, 8);
        
        // Track lights/spotlights on ceiling
        if (isLit) {
            ctx.fillStyle = '#FFE4B5';
            ctx.fillRect(80, 136, 2, 2);
            ctx.fillRect(92, 136, 2, 2);
            ctx.fillRect(104, 136, 2, 2);
            // Light glow
            ctx.fillStyle = 'rgba(255,230,180,0.3)';
            ctx.fillRect(78, 138, 6, 3);
            ctx.fillRect(90, 138, 6, 3);
            ctx.fillRect(102, 138, 6, 3);
        }
        
        // Back wall (warm beige/taupe like real shop)
        ctx.fillStyle = isLit ? '#C8B8A8' : '#A89888';
        ctx.fillRect(75, 142, 44, 18);
        
        const monthsPlayed = gameState.monthsPlayed || 1;
        
        // Refrigerator/fridge at back wall (appears after month 3)
        if (monthsPlayed > 3) {
            drawInteriorFridge(ctx, 78, 143, isLit);
        }
        
        // Wine bottle racks next to fridge (if hasWineSelection)
        if (gameState.hasWineSelection && monthsPlayed > 3) {
            drawWineRack(ctx, 103, 143, isLit);
        }
        
        // Floor with perspective (gray tiles)
        const floorGrad = ctx.createLinearGradient(75, 160, 75, 180);
        floorGrad.addColorStop(0, '#6B6B6B'); // Darker at back
        floorGrad.addColorStop(1, '#8B8B8B'); // Lighter at front
        ctx.fillStyle = floorGrad;
        ctx.fillRect(75, 160, 44, 18);
        
        // Floor tile lines (perspective)
        ctx.fillStyle = '#5B5B5B';
        ctx.fillRect(75, 165, 44, 1);
        ctx.fillRect(75, 172, 44, 1);
        
        // Inside customer queue (on floor, in front of fridge/wine, behind stalls)
        // 1 at 35+, 2 at 50+, 3 at 70+, 4 at 90+
        const isRainingDoor = (gameState.month === 9 || gameState.month === 2);
        if (gameState.reputation >= 35 && !isRainingDoor) {
            let queueCount = 1;
            if (gameState.reputation >= 90) queueCount = 4;
            else if (gameState.reputation >= 70) queueCount = 3;
            else if (gameState.reputation >= 50) queueCount = 2;
            drawInsideCustomerQueue(ctx, queueCount, frameTime);
        }
        
        // Left side: Wooden shelves with products (appears month 2+)
        if (monthsPlayed >= 2) {
            ctx.fillStyle = '#A88B5A'; // Wood color
            ctx.fillRect(76, 148, 8, 28);
            // Shelf divisions
            ctx.fillStyle = '#8B6B3A';
            ctx.fillRect(76, 154, 8, 1);
            ctx.fillRect(76, 162, 8, 1);
            ctx.fillRect(76, 170, 8, 1);
            // Products on left shelves (jars, bottles)
            ctx.fillStyle = '#8B4513'; // Brown jars
            ctx.fillRect(77, 149, 3, 4);
            ctx.fillRect(81, 150, 2, 3);
            ctx.fillStyle = '#2E5530'; // Green bottles
            ctx.fillRect(77, 156, 2, 5);
            ctx.fillRect(80, 155, 2, 6);
            ctx.fillStyle = '#FFD700'; // Yellow products
            ctx.fillRect(77, 164, 4, 4);
            ctx.fillRect(82, 163, 2, 5);
        }
        
        // Right side: Fresh produce in green crates (appears month 6+)
        if (monthsPlayed >= 6) {
            ctx.fillStyle = '#A88B5A'; // Wooden stand
            ctx.fillRect(108, 152, 10, 24);
            // Green plastic crates
            ctx.fillStyle = '#2E8B2E';
            ctx.fillRect(109, 153, 8, 5);
            ctx.fillRect(109, 160, 8, 5);
            ctx.fillRect(109, 167, 8, 5);
            // Produce in crates (colorful fruits/vegetables)
            ctx.fillStyle = '#FF6347'; // Tomatoes/red
            ctx.fillRect(110, 154, 3, 3);
            ctx.fillStyle = '#FFA500'; // Oranges
            ctx.fillRect(113, 154, 3, 3);
            ctx.fillStyle = '#9ACD32'; // Green/lettuce
            ctx.fillRect(110, 161, 6, 3);
            ctx.fillStyle = '#FFD700'; // Yellow/lemons
            ctx.fillRect(110, 168, 3, 3);
            ctx.fillStyle = '#8B4513'; // Brown/potatoes
            ctx.fillRect(114, 168, 3, 3);
        }
        
        // Green shopping baskets stacked near entrance (like photo)
        ctx.fillStyle = '#228B22';
        ctx.fillRect(77, 173, 6, 4);
        ctx.fillStyle = '#1E7B1E';
        ctx.fillRect(78, 174, 4, 2);
        
        // Entrance mat
        ctx.fillStyle = '#2C2C2C';
        ctx.fillRect(85, 176, 24, 2);
        ctx.fillStyle = '#3C3C3C';
        ctx.fillRect(87, 177, 20, 1);

        // === SHOP WINDOW (RIGHT SIDE) ===
        // Dark gray facade around window
        ctx.fillStyle = '#3A3A3A';
        ctx.fillRect(122, 132, 128, 48);
        
        // Window frame (white)
        ctx.fillStyle = '#F5F5F5';
        ctx.fillRect(125, 135, 122, 42);
        
        const isNight = timeOfDay === 3;
        
        if (isNight) {
            // NIGHT: Dark window - shop is closed, can't see inside
            ctx.fillStyle = '#1A1A1A';
            ctx.fillRect(128, 138, 116, 36);
            // Subtle reflection of street lights
            ctx.fillStyle = 'rgba(255,200,100,0.05)';
            ctx.fillRect(130, 140, 30, 20);
            ctx.fillRect(200, 145, 25, 15);
        } else {
            // DAY/EVENING: Can see interior through window
            // Dark back wall with warm undertone
            ctx.fillStyle = isLit ? '#4A4035' : '#3A3025';
            ctx.fillRect(128, 138, 116, 36);
            
            // Warm spotlights on back wall (ambient lighting)
            if (isLit) {
                ctx.fillStyle = 'rgba(255,220,180,0.15)';
                ctx.fillRect(135, 138, 30, 10);
                ctx.fillRect(175, 138, 30, 10);
                ctx.fillRect(215, 138, 25, 10);
            }
            
            // Shelves on back wall with products
            ctx.fillStyle = '#6B5030'; // Dark wood shelves
            ctx.fillRect(130, 142, 110, 2);
            ctx.fillRect(130, 148, 110, 2);
            // Products on shelves (jars, bottles - darker)
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(132, 138, 4, 4);
            ctx.fillRect(140, 139, 3, 3);
            ctx.fillStyle = '#2E4A2E';
            ctx.fillRect(148, 138, 3, 4);
            ctx.fillRect(155, 139, 4, 3);
            ctx.fillStyle = '#722F37';
            ctx.fillRect(165, 138, 3, 4);
            ctx.fillRect(172, 139, 3, 3);
            ctx.fillStyle = '#8B6914';
            ctx.fillRect(180, 138, 4, 4);
            ctx.fillRect(188, 139, 3, 3);
            ctx.fillStyle = '#4A4A4A';
            ctx.fillRect(196, 138, 3, 4);
            ctx.fillRect(203, 139, 4, 3);
            
            // === HENRY behind cheese counter (drawn first so counter is in front) ===
            if (gameState.hasHenry) {
                drawInteriorHenry(ctx, 180, 152, isLit, frameTime);
            }
            
            // === CHEESE COUNTER visible through window (only after first cheese - Tomme Larzac event) ===
            if (gameState.cheeseTypes >= 1) {
                drawCheeseCounter(ctx, 130, 158, gameState.cheeseTypes || 0, gameState.hasHenry, isLit, frameTime);
            }
        }
        
        // Window frame bottom edge (drawn after counter so counter appears inside)
        ctx.fillStyle = '#F5F5F5';
        ctx.fillRect(125, 174, 122, 3);
        // Side frames too
        ctx.fillRect(125, 135, 3, 42);
        ctx.fillRect(244, 135, 3, 42);
        
        // Shop name on window - elegant flowing script like real shop
        if (gameState.shopRenamed) {
            ctx.textAlign = 'center';
            const displayName = gameState.shopName ? 
                gameState.shopName.replace(/^Chez\s+/i, '').replace(/\s+Corner$/i, '') : 
                'Julien';
            
            // Shadow for depth
            ctx.fillStyle = isNight ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.35)';
            ctx.font = 'italic 19px "Segoe Script", "Lucida Handwriting", "Apple Chancery", cursive';
            ctx.fillText(displayName, 193, 157);
            
            // Main name - elegant script (slightly transparent)
            ctx.fillStyle = 'rgba(255,255,255,0.75)';
            ctx.font = 'italic 19px "Segoe Script", "Lucida Handwriting", "Apple Chancery", cursive';
            ctx.fillText(displayName, 192, 156);
            
            // Tagline below: "chez moi... chez vous... chez mes potes!"
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.font = 'italic 5px "Segoe Script", "Lucida Handwriting", Georgia, serif';
            ctx.fillText('chez moi... chez vous... chez mes potes!', 192, 164);
        }
        
        // Glass reflection (subtle)
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

        // Flowers in spring and summer only (not autumn or winter)
        if (isSpring || isSummer) {
            drawFlowerBox(ctx, 252, 175, isWinter, isAutumn);
        }

        // === CHARACTERS ===
        const isRaining = month === 9 || month === 2;
        
        // JULIEN - Main character, stands outside near left building
        drawJulien(ctx, 45, 150, gameState, frameTime);
        
        // Umbrella for Julien when raining (positioned over his head)
        if (isRaining) {
            drawUmbrella(ctx, 35, 128);
        }
        
        // Poncho next to Julien (on his left side, slightly apart)
        if (gameState.hasDog) drawPoncho16(ctx, 12, 168, gameState, frameTime);
        
        // Lucas - disappears on rainy days
        if (gameState.hasLucas && !isRaining) {
            drawCharacter16(ctx, 145, 150, 'lucas', false, gameState, frameTime);
        }
        
        // Outside customers on sidewalk (elderly, chatting group with kid)
        if (!isRaining && gameState.reputation >= 35) {
            drawOutsideCustomers(ctx, gameState.reputation, frameTime);
        }
        
        // Henry is drawn inside the shop (visible through door)

        // Wine display is now the rack next to fridge (drawn through open door)
        // Raclette is indicated by Swiss flag, no steam effect needed

        const isChristmas = month === 12 || month === 11;
        if (isChristmas) {
            drawChristmasDecorations(ctx);
            if (gameState.family > 50 && Math.floor(frameTime / 5000) % 3 === 0) {
                drawLuciaPainting(ctx);
            }
        }

        if (month === 7) {
            // Belgian flag in Julien's left hand
            drawBelgianFlagInHand(ctx, 38, 160, frameTime);
            // Balloons and bunting flags only in July (month 7)
            drawPartyDecorations(ctx, frameTime);
        }

        // Anniversary decorations (separate from July party decorations)
        const isAnniversaryMonth = gameState.monthsPlayed === 12 || gameState.monthsPlayed === 24 || gameState.monthsPlayed === 36;
        // Note: Anniversary decorations removed - use July decorations instead

        if (gameState.ownsBuilding && gameState.monthsSinceBuilding !== undefined && gameState.monthsSinceBuilding < 2) {
            drawSoldBanner(ctx);
        }

        // Weather by month:
        // December (12): Snow falling + snow on ground
        // January (1): Snow on ground only (no falling snow)
        // February (2): Rain (end of winter)
        // September (9): Heavy rain (first autumn month)
        if (month === 12) {
            drawSnow(ctx, W, H, gameState.monthsPlayed || 1, frameTime, true); // with falling snow
        } else if (month === 1) {
            drawSnow(ctx, W, H, gameState.monthsPlayed || 1, frameTime, false); // ground snow only
        } else if (month === 2) {
            drawRain(ctx, W, H); // February rain
        } else if (month === 9) {
            drawHeavyRain(ctx, W, H, frameTime); // September heavy rain
        }
        if (isAutumn && month !== 9) drawLeaves(ctx, W, H); // No leaves during heavy rain
        if (isSpring) drawPetals(ctx, W, H);

        if (gameState.floodActive) {
            drawRain(ctx, W, H);
            drawFloodWater(ctx, W, H);
        }

        // Stress overlay removed - Julien's expression is enough visual feedback
        
        // Street lights removed - were interfering with characters

        // Building ownership indicator removed (was yellow star flag)
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

    // === INTERIOR FRIDGE (refrigerator with produce visible through door) ===
    function drawInteriorFridge(ctx, x, y, lit) {
        // Fridge body (stainless steel look)
        ctx.fillStyle = '#D0D0D0';
        ctx.fillRect(x, y, 24, 16);
        
        // Fridge frame/border
        ctx.fillStyle = '#A0A0A0';
        ctx.fillRect(x, y, 24, 1);
        ctx.fillRect(x, y, 1, 16);
        ctx.fillRect(x + 23, y, 1, 16);
        
        // Glass door (see-through to products)
        ctx.fillStyle = lit ? 'rgba(200, 230, 255, 0.6)' : 'rgba(180, 210, 235, 0.5)';
        ctx.fillRect(x + 2, y + 2, 20, 12);
        
        // Shelves inside fridge
        ctx.fillStyle = '#E8E8E8';
        ctx.fillRect(x + 2, y + 5, 20, 1);
        ctx.fillRect(x + 2, y + 9, 20, 1);
        
        // Products on fridge shelves
        // Top shelf: dairy/cheese
        ctx.fillStyle = '#FFE4B5'; // Cheese yellow
        ctx.fillRect(x + 3, y + 2, 4, 2);
        ctx.fillStyle = '#FFFAF0'; // White cheese
        ctx.fillRect(x + 8, y + 2, 3, 2);
        ctx.fillStyle = '#FFA500'; // Orange cheese
        ctx.fillRect(x + 12, y + 2, 4, 2);
        ctx.fillStyle = '#F5F5DC'; // Cream
        ctx.fillRect(x + 17, y + 2, 4, 2);
        
        // Middle shelf: drinks/bottles
        ctx.fillStyle = '#FFFFFF'; // Milk
        ctx.fillRect(x + 3, y + 6, 2, 3);
        ctx.fillStyle = '#90EE90'; // Green juice
        ctx.fillRect(x + 6, y + 6, 2, 3);
        ctx.fillStyle = '#FFA07A'; // Orange juice
        ctx.fillRect(x + 9, y + 6, 2, 3);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 12, y + 6, 2, 3);
        ctx.fillStyle = '#87CEEB'; // Water
        ctx.fillRect(x + 15, y + 6, 2, 3);
        ctx.fillRect(x + 18, y + 6, 2, 3);
        
        // Bottom shelf: vegetables
        ctx.fillStyle = '#228B22'; // Green veggies
        ctx.fillRect(x + 3, y + 10, 6, 3);
        ctx.fillStyle = '#FF6347'; // Red/tomatoes
        ctx.fillRect(x + 10, y + 10, 4, 3);
        ctx.fillStyle = '#FFA500'; // Orange/carrots
        ctx.fillRect(x + 15, y + 10, 5, 3);
        
        // Fridge light glow if lit
        if (lit) {
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.fillRect(x + 2, y + 2, 20, 12);
        }
        
        // Handle
        ctx.fillStyle = '#808080';
        ctx.fillRect(x + 21, y + 6, 2, 4);
    }

    // === INSIDE CUSTOMER QUEUE ===
    function drawInsideCustomerQueue(ctx, count, frameTime) {
        // Queue of customers inside the shop, facing right (toward counter)
        // Positioned vertically in a line, behind stalls, in front of fridge/wine
        const customers = [
            { hair: '#3A2820', shirt: '#4169E1', skin: '#FFDAB9', isLady: true },  // Lady 1
            { hair: '#5C4033', shirt: '#228B22', skin: '#FFDBAC', isLady: false }, // Man 1
            { hair: '#1C1C1C', shirt: '#DC143C', skin: '#D2B48C', isLady: true },  // Lady 2
            { hair: '#8B4513', shirt: '#6B5B95', skin: '#FFE4C4', isLady: false }  // Man 2
        ];
        
        // Vertical queue positions (from back to front, y increases as they're closer)
        const positions = [
            { x: 90, y: 156 },
            { x: 92, y: 160 },
            { x: 88, y: 164 },
            { x: 94, y: 168 }
        ];
        
        for (let i = 0; i < count && i < 4; i++) {
            const c = customers[i];
            const p = positions[i];
            
            // Draw customer facing right (side profile)
            // Legs
            ctx.fillStyle = c.isLady ? '#2F2F4F' : '#1A1A3A';
            if (c.isLady) {
                // Skirt
                ctx.fillRect(p.x, p.y + 5, 4, 4);
                // Legs below skirt
                ctx.fillStyle = c.skin;
                ctx.fillRect(p.x, p.y + 9, 2, 4);
                ctx.fillRect(p.x + 2, p.y + 9, 2, 4);
            } else {
                // Pants
                ctx.fillRect(p.x, p.y + 5, 2, 6);
                ctx.fillRect(p.x + 2, p.y + 5, 2, 6);
            }
            
            // Feet
            ctx.fillStyle = '#2C2C2C';
            ctx.fillRect(p.x - 1, p.y + 11, 3, 2);
            ctx.fillRect(p.x + 2, p.y + 11, 3, 2);
            
            // Body (torso)
            ctx.fillStyle = c.shirt;
            ctx.fillRect(p.x, p.y, 4, 5);
            
            // Head (side profile)
            ctx.fillStyle = c.skin;
            ctx.fillRect(p.x + 1, p.y - 4, 3, 4);
            
            // Hair
            ctx.fillStyle = c.hair;
            if (c.isLady) {
                // Longer hair for ladies
                ctx.fillRect(p.x, p.y - 5, 4, 2);
                ctx.fillRect(p.x, p.y - 4, 1, 4);
            } else {
                // Short hair for men
                ctx.fillRect(p.x + 1, p.y - 5, 3, 2);
            }
            
            // Eye (facing right)
            ctx.fillStyle = '#000000';
            ctx.fillRect(p.x + 3, p.y - 3, 1, 1);
        }
    }

    // === OUTSIDE CUSTOMERS ===
    function drawOutsideCustomers(ctx, reputation, frameTime) {
        // Customers outside the shop on the sidewalk
        // 35+: Elderly, 50+: +Adult1, 70+: +Adult2 (chatting), 90+: +Kid
        
        const time = frameTime || Date.now();
        
        // === ELDERLY PERSON (appears at 35+) ===
        if (reputation >= 35) {
            const ex = 200, ey = 162;
            
            // Legs (dark pants)
            ctx.fillStyle = '#3D3D3D';
            ctx.fillRect(ex + 2, ey + 10, 3, 8);
            ctx.fillRect(ex + 6, ey + 10, 3, 8);
            
            // Shoes
            ctx.fillStyle = '#1A1A1A';
            ctx.fillRect(ex + 1, ey + 18, 4, 2);
            ctx.fillRect(ex + 6, ey + 18, 4, 2);
            
            // Body - beige cardigan
            ctx.fillStyle = '#C4A574';
            ctx.fillRect(ex + 1, ey + 2, 9, 8);
            
            // Cardigan details
            ctx.fillStyle = '#A8956A';
            ctx.fillRect(ex + 5, ey + 3, 1, 6);
            
            // Head
            ctx.fillStyle = '#FFDAB9';
            ctx.fillRect(ex + 2, ey - 5, 7, 7);
            
            // White/gray hair (curly style)
            ctx.fillStyle = '#E8E8E8';
            ctx.fillRect(ex + 1, ey - 6, 9, 3);
            ctx.fillRect(ex + 1, ey - 4, 2, 3);
            ctx.fillRect(ex + 8, ey - 4, 2, 3);
            
            // Glasses
            ctx.fillStyle = '#4A4A4A';
            ctx.fillRect(ex + 3, ey - 3, 2, 2);
            ctx.fillRect(ex + 6, ey - 3, 2, 2);
            ctx.fillRect(ex + 5, ey - 2, 1, 1);
            
            // Eyes behind glasses
            ctx.fillStyle = '#000000';
            ctx.fillRect(ex + 3, ey - 2, 1, 1);
            ctx.fillRect(ex + 7, ey - 2, 1, 1);
            
            // Smile
            ctx.fillStyle = '#CD8B8B';
            ctx.fillRect(ex + 4, ey, 3, 1);
            
            // Walking cane
            ctx.fillStyle = '#5D4037';
            ctx.fillRect(ex + 12, ey + 2, 2, 18);
            ctx.fillRect(ex + 11, ey + 1, 4, 2);
            
            // Shopping bag
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(ex - 4, ey + 6, 5, 7);
            ctx.fillStyle = '#A0522D';
            ctx.fillRect(ex - 3, ey + 7, 3, 5);
            // Baguette poking out
            ctx.fillStyle = '#DEB887';
            ctx.fillRect(ex - 2, ey + 3, 2, 4);
        }
        
        // === ADULT 1 - Woman (appears at 50+) ===
        if (reputation >= 50) {
            const ax = 230, ay = 160;
            const headBob = Math.sin(time / 800) * 0.5;
            
            // Legs
            ctx.fillStyle = '#1E3A5F';
            ctx.fillRect(ax + 2, ay + 11, 3, 7);
            ctx.fillRect(ax + 6, ay + 11, 3, 7);
            
            // Shoes
            ctx.fillStyle = '#8B0000';
            ctx.fillRect(ax + 1, ay + 18, 4, 2);
            ctx.fillRect(ax + 6, ay + 18, 4, 2);
            
            // Body - red coat
            ctx.fillStyle = '#B22222';
            ctx.fillRect(ax + 1, ay + 2, 9, 9);
            
            // Coat collar
            ctx.fillStyle = '#8B1A1A';
            ctx.fillRect(ax + 2, ay + 2, 2, 2);
            ctx.fillRect(ax + 7, ay + 2, 2, 2);
            
            // Head
            ctx.fillStyle = '#FFE4C4';
            ctx.fillRect(ax + 2, ay - 5 + headBob, 7, 7);
            
            // Brown hair (styled)
            ctx.fillStyle = '#4A3728';
            ctx.fillRect(ax + 1, ay - 6 + headBob, 9, 3);
            ctx.fillRect(ax + 1, ay - 4 + headBob, 2, 5);
            ctx.fillRect(ax + 8, ay - 4 + headBob, 2, 5);
            
            // Eyes
            ctx.fillStyle = '#000000';
            ctx.fillRect(ax + 3, ay - 3 + headBob, 1, 1);
            ctx.fillRect(ax + 7, ay - 3 + headBob, 1, 1);
            
            // Lipstick smile
            ctx.fillStyle = '#DC143C';
            ctx.fillRect(ax + 4, ay - 1 + headBob, 3, 1);
            
            // Purse
            ctx.fillStyle = '#2F2F2F';
            ctx.fillRect(ax - 3, ay + 8, 4, 5);
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(ax - 2, ay + 8, 2, 1);
        }
        
        // === ADULT 2 - Man (appears at 70+, chatting with Adult 1) ===
        if (reputation >= 70) {
            const mx = 248, my = 158;
            const headBob = Math.sin(time / 800 + 1.5) * 0.5;
            
            // Legs
            ctx.fillStyle = '#2F2F2F';
            ctx.fillRect(mx + 2, my + 12, 3, 8);
            ctx.fillRect(mx + 6, my + 12, 3, 8);
            
            // Shoes
            ctx.fillStyle = '#1A1A1A';
            ctx.fillRect(mx + 1, my + 20, 4, 2);
            ctx.fillRect(mx + 6, my + 20, 4, 2);
            
            // Body - blue jacket
            ctx.fillStyle = '#2C5282';
            ctx.fillRect(mx + 1, my + 2, 9, 10);
            
            // Jacket zipper
            ctx.fillStyle = '#1A365D';
            ctx.fillRect(mx + 5, my + 3, 1, 8);
            
            // Head
            ctx.fillStyle = '#DEB887';
            ctx.fillRect(mx + 2, my - 5 + headBob, 7, 7);
            
            // Short dark hair
            ctx.fillStyle = '#2D2D2D';
            ctx.fillRect(mx + 2, my - 6 + headBob, 7, 2);
            
            // Beard stubble
            ctx.fillStyle = '#4A4A4A';
            ctx.fillRect(mx + 3, my - 1 + headBob, 5, 2);
            
            // Eyes
            ctx.fillStyle = '#000000';
            ctx.fillRect(mx + 3, my - 3 + headBob, 1, 1);
            ctx.fillRect(mx + 7, my - 3 + headBob, 1, 1);
            
            // Grocery bag in hand
            ctx.fillStyle = '#F5F5DC';
            ctx.fillRect(mx + 11, my + 8, 6, 8);
            ctx.fillStyle = '#E8E8D0';
            ctx.fillRect(mx + 12, my + 9, 4, 6);
            // Cheese wheel visible
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(mx + 13, my + 6, 3, 3);
        }
        
        // === KID (appears at 90+) ===
        if (reputation >= 90) {
            const kx = 240, ky = 168;
            const bounce = Math.abs(Math.sin(time / 400)) * 1;
            
            // Small legs
            ctx.fillStyle = '#4169E1';
            ctx.fillRect(kx + 1, ky + 6 - bounce, 2, 5);
            ctx.fillRect(kx + 4, ky + 6 - bounce, 2, 5);
            
            // Little shoes
            ctx.fillStyle = '#FF6347';
            ctx.fillRect(kx, ky + 11 - bounce, 3, 2);
            ctx.fillRect(kx + 4, ky + 11 - bounce, 3, 2);
            
            // Body - yellow shirt
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(kx, ky + 1 - bounce, 7, 5);
            
            // Head (smaller)
            ctx.fillStyle = '#FFDAB9';
            ctx.fillRect(kx + 1, ky - 4 - bounce, 5, 5);
            
            // Messy hair
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(kx, ky - 5 - bounce, 6, 2);
            ctx.fillRect(kx + 2, ky - 6 - bounce, 2, 1);
            
            // Big curious eyes
            ctx.fillStyle = '#000000';
            ctx.fillRect(kx + 2, ky - 2 - bounce, 1, 1);
            ctx.fillRect(kx + 4, ky - 2 - bounce, 1, 1);
            
            // Little smile
            ctx.fillStyle = '#FFB6C1';
            ctx.fillRect(kx + 2, ky - bounce, 2, 1);
        }
    }

    // === WINE RACK (bottle storage visible through door) ===
    function drawWineRack(ctx, x, y, lit) {
        // Wooden rack frame
        ctx.fillStyle = '#5A3D2B';
        ctx.fillRect(x, y, 14, 16);
        
        // Darker wood back
        ctx.fillStyle = '#4A2D1B';
        ctx.fillRect(x + 1, y + 1, 12, 14);
        
        // Horizontal shelf dividers
        ctx.fillStyle = '#6B4D3B';
        ctx.fillRect(x, y + 4, 14, 1);
        ctx.fillRect(x, y + 8, 14, 1);
        ctx.fillRect(x, y + 12, 14, 1);
        
        // Wine bottles (horizontal, showing corks/caps)
        // Row 1 (top)
        ctx.fillStyle = '#2B0B0B'; // Dark red wine
        ctx.fillRect(x + 2, y + 1, 4, 2);
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(x + 7, y + 1, 4, 2);
        
        // Row 2
        ctx.fillStyle = '#4A0E0E';
        ctx.fillRect(x + 2, y + 5, 4, 2);
        ctx.fillStyle = '#2B0B0B';
        ctx.fillRect(x + 7, y + 5, 4, 2);
        
        // Row 3
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(x + 2, y + 9, 4, 2);
        ctx.fillStyle = '#F5F5DC'; // White wine
        ctx.fillRect(x + 7, y + 9, 4, 2);
        
        // Row 4 (bottom)
        ctx.fillStyle = '#F0E68C'; // Champagne/white
        ctx.fillRect(x + 2, y + 13, 4, 2);
        ctx.fillStyle = '#4A0E0E';
        ctx.fillRect(x + 7, y + 13, 4, 2);
        
        // Bottle cap/cork highlights
        ctx.fillStyle = lit ? '#C0A080' : '#907060';
        ctx.fillRect(x + 1, y + 1, 1, 2);
        ctx.fillRect(x + 1, y + 5, 1, 2);
        ctx.fillRect(x + 1, y + 9, 1, 2);
        ctx.fillRect(x + 1, y + 13, 1, 2);
        
        // Subtle light reflection if lit
        if (lit) {
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            ctx.fillRect(x + 3, y + 1, 1, 14);
        }
    }

    // === HENRY behind counter (upper body only - waist up) ===
    function drawInteriorHenry(ctx, x, y, lit, frameTime) {
        // No legs - they're hidden behind the counter
        
        // Body (blue work shirt) - from waist up
        ctx.fillStyle = lit ? '#3A5A9A' : '#2A4A7A';
        ctx.fillRect(x, y, 11, 8);
        
        // Apron (white)
        ctx.fillStyle = lit ? '#F0F0F0' : '#D0D0D0';
        ctx.fillRect(x + 2, y + 2, 7, 6);
        
        // Arms
        ctx.fillStyle = lit ? '#3A5A9A' : '#2A4A7A';
        ctx.fillRect(x - 2, y + 1, 3, 6);
        ctx.fillRect(x + 10, y + 1, 3, 6);
        
        // Hands (resting on counter level)
        ctx.fillStyle = lit ? '#E8C8A8' : '#C8A888';
        ctx.fillRect(x - 2, y + 6, 3, 2);
        ctx.fillRect(x + 10, y + 6, 3, 2);
        
        // Head
        ctx.fillStyle = lit ? '#E8C8A8' : '#C8A888';
        ctx.fillRect(x + 2, y - 8, 7, 8);
        
        // Short dark hair
        ctx.fillStyle = '#3A2A1A';
        ctx.fillRect(x + 2, y - 9, 7, 2);
        ctx.fillRect(x + 3, y - 7, 5, 1);
        
        // Eyes with subtle up/down movement
        const lookY = Math.floor(frameTime / 3000) % 3;
        const eyeYOffset = lookY === 1 ? 1 : (lookY === 2 ? -1 : 0);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 3, y - 5, 2, 2);
        ctx.fillRect(x + 6, y - 5, 2, 2);
        ctx.fillStyle = '#2C2C2C';
        ctx.fillRect(x + 3, y - 5 + eyeYOffset, 1, 1);
        ctx.fillRect(x + 7, y - 5 + eyeYOffset, 1, 1);
        
        // Smile
        ctx.fillStyle = '#C08080';
        ctx.fillRect(x + 4, y - 2, 3, 1);
    }

    // === CHEESE COUNTER (visible through shop window) ===
    function drawCheeseCounter(ctx, x, y, cheeseCount, hasHenry, lit, frameTime) {
        // Scale: 0 = empty counter, 100 = full like photo
        const fullness = Math.min(100, cheeseCount) / 100;
        
        // === WOODEN PALLET COUNTER BASE ===
        ctx.fillStyle = '#A08060';
        ctx.fillRect(x, y + 6, 110, 18);
        // Pallet slats (horizontal wood planks)
        ctx.fillStyle = '#B89070';
        ctx.fillRect(x, y + 6, 110, 3);
        ctx.fillRect(x, y + 11, 110, 3);
        ctx.fillRect(x, y + 16, 110, 3);
        ctx.fillRect(x, y + 21, 110, 3);
        // Gaps between slats
        ctx.fillStyle = '#705030';
        ctx.fillRect(x, y + 9, 110, 1);
        ctx.fillRect(x, y + 14, 110, 1);
        ctx.fillRect(x, y + 19, 110, 1);
        
        // === GLASS DISPLAY CASE ===
        // Chrome/metal frame top edge
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(x, y - 1, 110, 2);
        // Glass front
        ctx.fillStyle = '#B8C8D0';
        ctx.fillRect(x, y + 1, 110, 1);
        ctx.fillRect(x, y + 5, 110, 2);
        // Left/right frame
        ctx.fillStyle = '#A0A0A0';
        ctx.fillRect(x, y - 1, 2, 8);
        ctx.fillRect(x + 108, y - 1, 2, 8);
        
        // Inside case - white refrigerated surface
        ctx.fillStyle = lit ? '#FEFEFE' : '#F0F0F0';
        ctx.fillRect(x + 2, y + 1, 106, 5);
        
        // === CHEESES INSIDE GLASS CASE (wedges with price tags) ===
        const caseCheeses = [
            // Various wedges - different colors like photo
            { cx: 3, w: 6, h: 4, color: '#E8D060' },   // Yellow
            { cx: 10, w: 5, h: 4, color: '#F0E8D0' },  // Pale brie
            { cx: 16, w: 7, h: 4, color: '#D4A030' },  // Golden
            { cx: 24, w: 5, h: 4, color: '#6090B0' },  // Blue cheese
            { cx: 30, w: 6, h: 4, color: '#F4C870' },  // Light yellow
            { cx: 37, w: 5, h: 4, color: '#E0D0B0' },  // Cream
            { cx: 43, w: 7, h: 4, color: '#C89030' },  // Aged golden
            { cx: 51, w: 5, h: 4, color: '#F8F0E0' },  // White fresh
            { cx: 57, w: 6, h: 4, color: '#D08020' },  // Orange
            { cx: 64, w: 5, h: 4, color: '#B08040' },  // Brown aged
            { cx: 70, w: 7, h: 4, color: '#F0D870' },  // Bright yellow
            { cx: 78, w: 5, h: 4, color: '#E8C060' },  // Gold
            { cx: 84, w: 6, h: 4, color: '#C0A050' },  // Aged
            { cx: 91, w: 5, h: 4, color: '#F0E0C0' },  // Pale
            { cx: 97, w: 7, h: 4, color: '#D09030' },  // Orange-gold
        ];
        
        const caseCount = Math.floor(caseCheeses.length * fullness);
        for (let i = 0; i < caseCount; i++) {
            const c = caseCheeses[i];
            // Cheese wedge
            ctx.fillStyle = c.color;
            ctx.fillRect(x + c.cx, y + 1, c.w, c.h);
            // Rind (darker edge)
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.fillRect(x + c.cx, y + 4, c.w, 1);
            // Highlight
            ctx.fillStyle = 'rgba(255,255,255,0.25)';
            ctx.fillRect(x + c.cx + 1, y + 1, c.w - 2, 1);
            // Price tag (white, standing up)
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + c.cx + 2, y - 1, 2, 3);
        }
        
        // Glass reflection
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fillRect(x + 8, y + 2, 25, 1);
        ctx.fillRect(x + 50, y + 3, 20, 1);
        
        // Henry is now drawn in the door interior section (next to fridge)
        
        // === BIG CHEESE WHEELS ON TOP (like photo) ===
        // Wheel 1: Large golden/yellow (left)
        if (fullness > 0.2) {
            ctx.fillStyle = '#C8A030'; // Rind
            ctx.fillRect(x + 5, y - 11, 16, 10);
            ctx.fillStyle = '#B89020';
            ctx.fillRect(x + 5, y - 11, 16, 2);
            // Cut face showing interior
            ctx.fillStyle = '#E8C850';
            ctx.fillRect(x + 7, y - 9, 12, 6);
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.fillRect(x + 8, y - 8, 10, 2);
        }
        
        // Wheel 2: Orange mimolette (center-left)
        if (fullness > 0.4) {
            ctx.fillStyle = '#D06020'; // Orange rind
            ctx.fillRect(x + 26, y - 13, 18, 12);
            ctx.fillStyle = '#C05010';
            ctx.fillRect(x + 26, y - 13, 18, 2);
            // Bright orange interior
            ctx.fillStyle = '#F08030';
            ctx.fillRect(x + 28, y - 11, 14, 7);
            ctx.fillStyle = 'rgba(255,255,255,0.15)';
            ctx.fillRect(x + 29, y - 10, 12, 2);
        }
        
        // Wheel 3 removed - was blocking Henry
        
        // Wheel 4: Darker aged (right)
        if (fullness > 0.8) {
            ctx.fillStyle = '#906030';
            ctx.fillRect(x + 70, y - 10, 13, 9);
            ctx.fillStyle = '#805020';
            ctx.fillRect(x + 70, y - 10, 13, 2);
            ctx.fillStyle = '#B08050';
            ctx.fillRect(x + 72, y - 8, 9, 5);
        }
        
        // Small wedge on top (far right) at 90%+
        if (fullness > 0.9) {
            ctx.fillStyle = '#E0C060';
            ctx.fillRect(x + 88, y - 7, 10, 6);
            ctx.fillStyle = '#D0B050';
            ctx.fillRect(x + 88, y - 7, 10, 1);
        }
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
        
        // Henry is now drawn in the door interior section (next to fridge)
        
        // === GLASS REFLECTION ===
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(x + 2, y + 1, 20, 4);
        ctx.fillRect(x + 5, y + 13, 15, 3);
    }

    // === SEASONAL CRITTERS with story progression ===
    // Critters can appear in multiple locations and tell a love story over time
    function drawSeasonalCritters(ctx, month, frameTime, monthsPlayed) {
        const isWinter = month === 12 || month === 1 || month === 2;
        const isSpring = month >= 3 && month <= 5;
        const isSummer = month >= 6 && month <= 8;
        const isAutumn = month >= 9 && month <= 11;
        const time = frameTime;
        
        // Deterministic "random" position based on month (changes each month)
        const positionSeed = (monthsPlayed * 7) % 5;
        
        // Bird/Pigeon story progression
        const birdStage = monthsPlayed < 6 ? 0 : (monthsPlayed < 12 ? 1 : 2);
        // 0 = alone, 1 = found mate (2 birds), 2 = has nest
        
        // === PIGEON (Autumn) - On building roof edge (only Oct/Nov, not Sept) ===
        if (isAutumn && month >= 10) {
            // Pigeons sit on roof - feet at y=53 (roof edge), body in sky
            const roofY = 48;
            
            if (birdStage === 0) {
                // Stage 0: 1 pigeon
                drawPigeon(ctx, 150, roofY, time, false, false);
            } else if (birdStage === 1) {
                // Stage 1: 2 pigeons
                drawPigeon(ctx, 140, roofY, time, false, false);
                drawPigeon(ctx, 170, roofY, time, true, true);
            } else {
                // Stage 2: 6 pigeons spread across roof, facing different ways
                drawPigeon(ctx, 90, roofY, time, false, false);   // facing right
                drawPigeon(ctx, 115, roofY, time, true, true);    // facing left
                drawPigeon(ctx, 145, roofY, time, false, false);  // facing right
                drawPigeon(ctx, 175, roofY, time, true, false);   // facing right
                drawPigeon(ctx, 200, roofY, time, false, true);   // facing left
                drawPigeon(ctx, 225, roofY, time, true, true);    // facing left
            }
        }
        
        // === SQUIRREL (Winter) - On building roof, mom + babies (Dec/Jan only, not Feb) ===
        if (isWinter && month !== 2) {
            const roofY = 48;
            
            // Stage 0: 1 adult squirrel (mom)
            drawSquirrel(ctx, 115, roofY, time, false, false);
            
            // Stage 1: mom + 1 baby
            if (birdStage >= 1) {
                drawSquirrel(ctx, 130, roofY, time, false, true); // baby
            }
            
            // Stage 2: mom + 2 babies
            if (birdStage >= 2) {
                drawSquirrel(ctx, 100, roofY, time, false, true); // second baby
            }
        }
        
        // === SMALL BIRD (Spring) - On rooftops ===
        if (isSpring) {
            // y=56 so feet are right on roof edge (roof is at y=61)
            // Primary bird on main shop roof
            drawSmallBird(ctx, 175, 56, time, false, false);
            
            // Second bird if paired - facing the first bird
            if (birdStage >= 1) {
                // Bird faces left toward first bird, positioned next to it
                drawSmallBird(ctx, 192, 56, time, true, true);
                
                // Kissing animation every 10 seconds when they have a nest
                if (birdStage >= 2 && (time % 10000) < 500) {
                    // Little heart above them
                    ctx.fillStyle = '#FF6B6B';
                    ctx.fillRect(183, 50, 2, 2);
                    ctx.fillRect(186, 50, 2, 2);
                    ctx.fillRect(184, 52, 3, 2);
                    ctx.fillRect(185, 54, 1, 1);
                }
            }
            // Nest right on roof edge if stage 2 (with eggs in spring!)
            if (birdStage >= 2) {
                drawBirdNest(ctx, 207, 58, time, true);
            }
        }
        
        // === BUTTERFLIES - Spring and summer only ===
        if (isSpring || isSummer) {
            const butterflySpots = [
                { x: 260, y: 166, offset: 0 },     // Near flower pot
                { x: 275, y: 162, offset: 200 },   // Right side
                { x: 245, y: 168, offset: 400 },   // Near flowers
                { x: 280, y: 164, offset: 600 },   // Far right
                { x: 255, y: 160, offset: 800 },   // Middle right
            ];
            
            // Progressive butterfly count based on months played
            let butterflyCount = 1;
            if (monthsPlayed >= 12) {
                butterflyCount = 5; // Full multicolor flock
            } else if (monthsPlayed >= 6) {
                butterflyCount = 2; // A pair
            }
            
            for (let i = 0; i < butterflyCount; i++) {
                const spot = butterflySpots[i];
                drawTinyButterfly(ctx, spot.x, spot.y, time + spot.offset, i);
            }
        }
    }
    
    // Individual critter drawing functions
    function drawPigeon(ctx, x, y, time, isMate, faceLeft = false) {
        // Animation with 3 second pause: animate for 2s, pause for 3s (5s cycle)
        const cycle = (time + (isMate ? 1500 : 0)) % 5000;
        const isAnimating = cycle < 2000;
        const bobble = isAnimating ? Math.sin(cycle / 400) * 1 : 0;
        const peck = isAnimating && Math.floor(cycle / 300) % 3 === 0 ? 1 : 0;
        
        if (faceLeft) {
            // Facing left (mirrored)
            // Body
            ctx.fillStyle = isMate ? '#686868' : '#707070';
            ctx.fillRect(x, y + bobble, 8, 5);
            ctx.fillStyle = '#606060';
            ctx.fillRect(x + 1, y + 1 + bobble, 6, 3);
            
            // Tail (on right)
            ctx.fillStyle = '#555555';
            ctx.fillRect(x + 7, y + 2 + bobble, 4, 2);
            
            // Head (on left)
            ctx.fillStyle = isMate ? '#688868' : '#50806B';
            ctx.fillRect(x - 2, y - 2 + peck + bobble, 4, 4);
            
            // Eye
            ctx.fillStyle = '#FF6600';
            ctx.fillRect(x - 1, y - 1 + peck + bobble, 1, 1);
            
            // Beak (pointing left)
            ctx.fillStyle = '#AA9977';
            ctx.fillRect(x - 4, y + peck + bobble, 2, 1);
            
            // Legs
            ctx.fillStyle = '#AA6666';
            ctx.fillRect(x + 2, y + 5, 1, 2);
            ctx.fillRect(x + 5, y + 5, 1, 2);
        } else {
            // Facing right (original)
            // Body
            ctx.fillStyle = isMate ? '#686868' : '#707070';
            ctx.fillRect(x, y + bobble, 8, 5);
            ctx.fillStyle = '#606060';
            ctx.fillRect(x + 1, y + 1 + bobble, 6, 3);
            
            // Tail
            ctx.fillStyle = '#555555';
            ctx.fillRect(x - 3, y + 2 + bobble, 4, 2);
            
            // Head
            ctx.fillStyle = isMate ? '#688868' : '#50806B';
            ctx.fillRect(x + 6, y - 2 + peck + bobble, 4, 4);
            
            // Eye
            ctx.fillStyle = '#FF6600';
            ctx.fillRect(x + 8, y - 1 + peck + bobble, 1, 1);
            
            // Beak
            ctx.fillStyle = '#AA9977';
            ctx.fillRect(x + 9, y + peck + bobble, 2, 1);
            
            // Legs
            ctx.fillStyle = '#AA6666';
            ctx.fillRect(x + 2, y + 5, 1, 2);
            ctx.fillRect(x + 5, y + 5, 1, 2);
        }
    }
    
    function drawSmallBird(ctx, x, y, time, isMate, faceLeft = false) {
        const hop = Math.floor(time / 500) % 2;
        const bobble = Math.sin(time / 300 + (isMate ? 150 : 0)) * 0.5;
        
        if (faceLeft) {
            // Facing left (mirrored)
            // Body
            ctx.fillStyle = isMate ? '#7BA37B' : '#8FBC8F';
            ctx.fillRect(x, y + hop + bobble, 6, 4);
            
            // Wing
            ctx.fillStyle = '#6B8E6B';
            ctx.fillRect(x + 1, y + 1 + hop + bobble, 4, 2);
            
            // Head (on left side)
            ctx.fillStyle = isMate ? '#7BA37B' : '#8FBC8F';
            ctx.fillRect(x - 2, y - 2 + hop + bobble, 4, 4);
            
            // Eye
            ctx.fillStyle = '#2C2C2C';
            ctx.fillRect(x - 1, y - 1 + hop + bobble, 1, 1);
            
            // Beak (pointing left)
            ctx.fillStyle = '#FFA500';
            ctx.fillRect(x - 4, y + hop + bobble, 2, 1);
            
            // Legs
            ctx.fillStyle = '#8B7355';
            ctx.fillRect(x + 1, y + 4 + hop, 1, 2);
            ctx.fillRect(x + 3, y + 4 + hop, 1, 2);
        } else {
            // Facing right (original)
            // Body
            ctx.fillStyle = isMate ? '#7BA37B' : '#8FBC8F';
            ctx.fillRect(x, y + hop + bobble, 6, 4);
            
            // Wing
            ctx.fillStyle = '#6B8E6B';
            ctx.fillRect(x + 1, y + 1 + hop + bobble, 4, 2);
            
            // Head
            ctx.fillStyle = isMate ? '#7BA37B' : '#8FBC8F';
            ctx.fillRect(x + 4, y - 2 + hop + bobble, 4, 4);
            
            // Eye
            ctx.fillStyle = '#2C2C2C';
            ctx.fillRect(x + 6, y - 1 + hop + bobble, 1, 1);
            
            // Beak
            ctx.fillStyle = '#FFA500';
            ctx.fillRect(x + 7, y + hop + bobble, 2, 1);
            
            // Legs
            ctx.fillStyle = '#8B7355';
            ctx.fillRect(x + 2, y + 4 + hop, 1, 2);
            ctx.fillRect(x + 4, y + 4 + hop, 1, 2);
        }
    }
    
    function drawSquirrel(ctx, x, y, time, isMate, isBaby = false) {
        // Babies have minimal animation
        const bobble = isBaby ? 0 : Math.sin(time / 400 + (isMate ? 200 : 0)) * 0.5;
        const tailWag = isBaby ? 0 : Math.sin(time / 200) * 0.2;
        
        if (isBaby) {
            // === BABY SQUIRREL (smaller, less detail) ===
            // Tiny fluffy tail
            ctx.fillStyle = '#A07040';
            ctx.fillRect(x - 1, y + 2, 3, 5);
            
            // Tiny body
            ctx.fillStyle = '#9B6A3B';
            ctx.fillRect(x + 2, y + 3, 4, 3);
            
            // Tiny belly
            ctx.fillStyle = '#E8DCBB';
            ctx.fillRect(x + 2, y + 4, 3, 2);
            
            // Tiny head
            ctx.fillStyle = '#9B6A3B';
            ctx.fillRect(x + 5, y + 2, 3, 3);
            
            // Tiny ears
            ctx.fillRect(x + 5, y + 1, 1, 2);
            ctx.fillRect(x + 7, y + 1, 1, 2);
            
            // Tiny eye
            ctx.fillStyle = '#2C2C2C';
            ctx.fillRect(x + 6, y + 3, 1, 1);
        } else {
            // === ADULT SQUIRREL ===
            // Fluffy tail
            ctx.fillStyle = '#8B5A2B';
            ctx.save();
            ctx.translate(x, y + 3);
            ctx.rotate(tailWag);
            ctx.fillRect(-4, -6, 5, 10);
            ctx.fillStyle = '#A0693C';
            ctx.fillRect(-3, -4, 3, 7);
            ctx.restore();
            
            // Body
            ctx.fillStyle = '#8B5A2B';
            ctx.fillRect(x + 2, y + 1 + bobble, 7, 5);
            
            // Belly
            ctx.fillStyle = '#DECCAA';
            ctx.fillRect(x + 3, y + 2 + bobble, 4, 3);
            
            // Head
            ctx.fillStyle = '#8B5A2B';
            ctx.fillRect(x + 7, y - 1 + bobble, 5, 5);
            
            // Ears
            ctx.fillRect(x + 7, y - 3 + bobble, 2, 3);
            ctx.fillRect(x + 10, y - 3 + bobble, 2, 3);
            
            // Eye
            ctx.fillStyle = '#2C2C2C';
            ctx.fillRect(x + 10, y + 1 + bobble, 1, 1);
            
            // Acorn (sometimes)
            if (Math.floor(time / 2000) % 3 === 0) {
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(x + 12, y + 3 + bobble, 3, 3);
                ctx.fillStyle = '#228B22';
                ctx.fillRect(x + 12, y + 2 + bobble, 3, 1);
            }
        }
    }
    
    function drawTinyButterfly(ctx, x, y, time, index) {
        // Tiny cute butterflies with different colors
        const colors = [
            { main: '#FFB6C1', accent: '#FF69B4' }, // Pink
            { main: '#87CEEB', accent: '#4169E1' }, // Blue
            { main: '#DDA0DD', accent: '#9370DB' }, // Purple
            { main: '#FFFACD', accent: '#FFD700' }, // Yellow
            { main: '#98FB98', accent: '#32CD32' }, // Green
        ];
        const color = colors[index % colors.length];
        
        const wingFlap = Math.sin(time / 70 + index) * 0.5;
        const flutter = Math.sin(time / 300 + index * 50) * 1.5;
        const drift = Math.sin(time / 2000 + index * 100) * 3;
        
        ctx.save();
        ctx.translate(x + drift, y + flutter);
        
        // Tiny body (2px)
        ctx.fillStyle = '#333';
        ctx.fillRect(0, -1, 1, 3);
        
        // Left wing (tiny, 2x3)
        ctx.fillStyle = color.main;
        const leftWing = Math.max(1, 2 + wingFlap);
        ctx.fillRect(-leftWing, -2, 2, 3);
        ctx.fillStyle = color.accent;
        ctx.fillRect(-leftWing + 1, -1, 1, 1);
        
        // Right wing
        ctx.fillStyle = color.main;
        const rightWing = Math.max(1, 2 - wingFlap);
        ctx.fillRect(1, -2, 2, 3);
        ctx.fillStyle = color.accent;
        ctx.fillRect(1, -1, 1, 1);
        
        // Antennae (tiny)
        ctx.fillStyle = '#333';
        ctx.fillRect(-1, -3, 1, 1);
        ctx.fillRect(1, -3, 1, 1);
        
        ctx.restore();
    }
    
    function drawButterfly(ctx, x, y, time) {
        const wingFlap = Math.sin(time / 80) * 0.4;
        const flutter = Math.sin(time / 400) * 2;
        
        ctx.save();
        ctx.translate(x, y + flutter);
        
        // Upper wings
        ctx.fillStyle = '#FF69B4';
        ctx.save();
        ctx.rotate(-0.2 + wingFlap);
        ctx.fillRect(-5, -4, 5, 5);
        ctx.fillStyle = '#FFB6C1';
        ctx.fillRect(-4, -3, 3, 3);
        ctx.restore();
        
        ctx.fillStyle = '#FF69B4';
        ctx.save();
        ctx.rotate(0.2 - wingFlap);
        ctx.fillRect(0, -4, 5, 5);
        ctx.fillStyle = '#FFB6C1';
        ctx.fillRect(1, -3, 3, 3);
        ctx.restore();
        
        // Lower wings (smaller)
        ctx.fillStyle = '#DDA0DD';
        ctx.save();
        ctx.rotate(-0.15 + wingFlap * 0.7);
        ctx.fillRect(-4, 0, 4, 4);
        ctx.restore();
        ctx.save();
        ctx.rotate(0.15 - wingFlap * 0.7);
        ctx.fillRect(0, 0, 4, 4);
        ctx.restore();
        
        // Body
        ctx.fillStyle = '#2C2C2C';
        ctx.fillRect(-1, -3, 2, 7);
        
        // Antennae
        ctx.fillRect(-2, -5, 1, 2);
        ctx.fillRect(1, -5, 1, 2);
        
        ctx.restore();
    }
    
    function drawBirdNest(ctx, x, y, time, hasEggs = false) {
        // Nest made of twigs
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(x, y, 12, 4);
        ctx.fillStyle = '#6B5335';
        ctx.fillRect(x + 1, y + 1, 10, 2);
        // Twigs sticking out
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(x - 2, y + 1, 3, 1);
        ctx.fillRect(x + 11, y + 1, 3, 1);
        
        // Eggs if spring/mature
        if (hasEggs) {
            ctx.fillStyle = '#F5F5DC';
            ctx.fillRect(x + 3, y - 1, 2, 2);
            ctx.fillRect(x + 6, y - 1, 2, 2);
            ctx.fillRect(x + 4, y - 2, 3, 2);
        }
    }

    function drawUmbrella(ctx, x, y) {
        // Umbrella centered over Julien's head
        // Canopy above head
        ctx.fillStyle = '#1A237E';
        ctx.beginPath();
        ctx.moveTo(x + 2, y + 5);
        ctx.lineTo(x + 12, y - 5);
        ctx.lineTo(x + 22, y + 5);
        ctx.closePath();
        ctx.fill();
        
        // Canopy highlight
        ctx.fillStyle = '#283593';
        ctx.beginPath();
        ctx.moveTo(x + 5, y + 3);
        ctx.lineTo(x + 12, y - 3);
        ctx.lineTo(x + 19, y + 3);
        ctx.closePath();
        ctx.fill();
        
        // Canopy edge
        ctx.fillStyle = '#0D1B5E';
        ctx.fillRect(x + 2, y + 4, 20, 2);
        
        // Handle going down
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(x + 11, y + 4, 2, 20);
        
        // Curved handle bottom
        ctx.fillRect(x + 9, y + 22, 2, 2);
        ctx.fillRect(x + 7, y + 23, 2, 2);
    }

    function drawFlowerBox(ctx, x, y, isWinter, isAutumn) {
        // Small terracotta pot
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(x, y, 40, 5);
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x, y, 40, 1);
        ctx.fillRect(x + 1, y + 4, 38, 1);
        
        if (!isWinter) {
            // Fewer, smaller, more detailed flowers (only up to leg height)
            const flowerColors = isAutumn ? ['#CD5C5C', '#D2691E', '#DAA520'] : ['#DB7093', '#C71585', '#FF6B6B'];
            
            // Only 4 small flowers
            for (let i = 0; i < 4; i++) {
                const fx = x + 5 + i * 9;
                
                // Thin stem (only 5px tall - leg height)
                ctx.fillStyle = '#2E8B2E';
                ctx.fillRect(fx, y - 5, 1, 5);
                
                // Small leaf
                if (i % 2 === 0) {
                    ctx.fillStyle = '#228B22';
                    ctx.fillRect(fx + 1, y - 3, 2, 1);
                }
                
                // Tiny detailed flower (2px petals)
                ctx.fillStyle = flowerColors[i % 3];
                ctx.fillRect(fx - 1, y - 7, 3, 2);
                ctx.fillRect(fx, y - 8, 1, 1);
                ctx.fillRect(fx, y - 6, 1, 1);
                
                // Flower center
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(fx, y - 7, 1, 1);
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
        
        // Lucas is mostly static - only subtle shoulder movement
        const isLucas = type === 'lucas';
        const shoulderBob = isLucas ? Math.sin(time / 800) * 0.5 : 0;
        const idleAnim = isLucas ? 0 : Math.sin(time / 1000) * 0.3;
        const gestureFrame = isLucas ? -1 : Math.floor(time / 2500) % 3; // No gesture for Lucas
        
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
        
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(x + 7, y + 27, 6, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Legs
        ctx.fillStyle = '#2F4F4F';
        ctx.fillRect(x + 2, y + 16, 4, 10);
        ctx.fillRect(x + 8, y + 16, 4, 10);
        
        // Body/shirt
        ctx.fillStyle = c.shirt;
        ctx.fillRect(x, y, 14, 17);
        
        // White apron for Lucas
        if (isLucas) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 2, y + 3, 10, 12);
            ctx.fillStyle = '#F0F0F0';
            ctx.fillRect(x + 2, y + 3, 10, 2);
        }
        
        // Arms (subtle shoulder bob for Lucas)
        ctx.fillStyle = c.shirt;
        ctx.fillRect(x - 2, y + 2 + shoulderBob, 3, 10);
        ctx.fillRect(x + 13, y + 2 - shoulderBob, 3, 10);
        
        // Hands
        ctx.fillStyle = c.skin;
        ctx.fillRect(x - 2, y + 12, 3, 4);
        ctx.fillRect(x + 13, y + 12, 3, 4);
        
        // Head
        ctx.fillStyle = c.skin;
        ctx.fillRect(x + 2, y - 12, 10, 12);
        
        // Hair
        ctx.fillStyle = c.hair;
        ctx.fillRect(x + 2, y - 14, 10, 5);
        ctx.fillRect(x + 1, y - 12, 2, 4);
        ctx.fillRect(x + 11, y - 12, 2, 4);
        
        // === CHRISTMAS HAT (December only) ===
        const month = gameState.month || 1;
        if (month === 12) {
            // Red hat
            ctx.fillStyle = '#DC143C';
            ctx.fillRect(x + 1, y - 17, 10, 4);
            ctx.fillRect(x + 3, y - 20, 6, 3);
            ctx.fillRect(x + 5, y - 22, 3, 2);
            // White trim
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x, y - 14, 12, 2);
            // White pom-pom
            ctx.fillRect(x + 6, y - 23, 2, 2);
        }
        
        // Eyes
        ctx.fillStyle = '#2C2C2C';
        ctx.fillRect(x + 4, y - 8, 2, 2);
        ctx.fillRect(x + 8, y - 8, 2, 2);
        
        // Mouth
        ctx.fillStyle = '#E08080';
        ctx.fillRect(x + 5, y - 4, 4, 1);
        
        // Lucas has a beard!
        if (isLucas) {
            ctx.fillStyle = '#3A2818';
            // Beard sides
            ctx.fillRect(x + 2, y - 4, 2, 4);
            ctx.fillRect(x + 10, y - 4, 2, 4);
            // Chin beard
            ctx.fillRect(x + 3, y - 2, 8, 3);
            ctx.fillRect(x + 4, y + 1, 6, 2);
            // Mustache
            ctx.fillRect(x + 4, y - 5, 6, 2);
        }
        
        // Work animation (not for Lucas - he's static)
        if (!isLucas && gestureFrame === 0) {
            ctx.fillStyle = '#F4A460';
            ctx.fillRect(x + 15, y + 5 + idleAnim, 4, 3);
        }
    }

    // === JULIEN - Main character, stands outside near the door ===
    function drawJulien(ctx, x, y, gameState, frameTime = Date.now()) {
        const stress = gameState.stress || 0;
        const recovering = gameState.recovering || false;
        
        // Stress states
        const isHappy = stress < 40;
        const isNeutral = stress >= 40 && stress < 70;
        const isPanicking = stress >= 70 && stress < 80;
        const isBurnout = stress >= 80;
        
        // Only panic shake animation (no breathing/floating)
        const panicShake = isPanicking ? Math.sin(frameTime / 50) * 1.5 : 0;
        const gestureFrame = Math.floor(frameTime / 2000) % 4;
        
        // Blinking - blink for ~150ms every 3-4 seconds
        const blinkCycle = frameTime % 3500;
        const isBlinking = blinkCycle > 3350;
        
        // Looking around - shift eyes occasionally (every 5-8 seconds for ~1 second)
        const lookCycle = frameTime % 6000;
        const lookDirection = lookCycle > 5000 ? (lookCycle > 5500 ? 0 : 1) : (lookCycle < 1000 ? -1 : 0);
        
        // Offsets - only horizontal shake when panicking
        const ox = panicShake;
        
        // Skin color (pale when burnout/recovering)
        const skin = (isBurnout || recovering) ? '#E0D8D0' : '#FFDAB9';
        const skinDark = (isBurnout || recovering) ? '#C8C0B8' : '#DEB887';
        
        // === SHADOW ===
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(x + 10, y + 32, 8, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // === LEGS (dark jeans) ===
        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(x + 5 + ox, y + 18, 4, 14);
        ctx.fillRect(x + 11 + ox, y + 18, 4, 14);
        // Jean highlights
        ctx.fillStyle = '#3D5A6F';
        ctx.fillRect(x + 6 + ox, y + 19, 1, 12);
        ctx.fillRect(x + 12 + ox, y + 19, 1, 12);
        
        // === SHOES (dark) ===
        ctx.fillStyle = '#1A1A1A';
        ctx.fillRect(x + 4 + ox, y + 31, 6, 2);
        ctx.fillRect(x + 10 + ox, y + 31, 6, 2);
        
        // === NECK (connects head to body cleanly) ===
        ctx.fillStyle = skin;
        ctx.fillRect(x + 7 + ox, y - 2, 6, 4);
        
        // === TORSO (white T-shirt - shorter) ===
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 3 + ox, y + 2, 14, 16);
        // T-shirt shadow/fold
        ctx.fillStyle = '#E8E8E8';
        ctx.fillRect(x + 4 + ox, y + 8, 2, 8);
        ctx.fillRect(x + 14 + ox, y + 8, 2, 8);
        
        // === BLACK APRON over shirt ===
        ctx.fillStyle = '#1A1A1A';
        ctx.fillRect(x + 4 + ox, y + 6, 12, 12);
        // Apron straps
        ctx.fillStyle = '#2A2A2A';
        ctx.fillRect(x + 6 + ox, y + 2, 2, 5);
        ctx.fillRect(x + 12 + ox, y + 2, 2, 5);
        // Apron highlight
        ctx.fillStyle = '#2A2A2A';
        ctx.fillRect(x + 5 + ox, y + 7, 1, 10);
        // Apron pocket
        ctx.fillStyle = '#252525';
        ctx.fillRect(x + 7 + ox, y + 11, 6, 4);
        ctx.fillStyle = '#1A1A1A';
        ctx.fillRect(x + 7 + ox, y + 11, 6, 1);
        
        // === ARMS (depends on gesture state) ===
        const isWaving = isHappy && gestureFrame === 1;
        const isPanicGesture = isPanicking && gestureFrame < 2;
        
        // Left arm (always normal)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + ox, y + 2, 4, 7);
        ctx.fillStyle = '#E8E8E8';
        ctx.fillRect(x + ox, y + 6, 1, 3);
        ctx.fillStyle = skin;
        if (isPanicGesture) {
            // Hand on head
            ctx.fillRect(x + 2 + ox, y - 10, 3, 3);
        } else if (isBurnout) {
            ctx.fillRect(x - 1 + ox, y + 12, 4, 5);
        } else {
            ctx.fillRect(x + ox, y + 9, 4, 5);
        }
        
        // Right arm (changes when waving)
        if (isWaving) {
            // Waving arm - raised position
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 16 + ox, y + 2, 4, 4);
            ctx.fillRect(x + 18 + ox, y - 2, 3, 5);
            ctx.fillStyle = skin;
            ctx.fillRect(x + 18 + ox, y - 6, 4, 5);
        } else {
            // Normal right arm
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 16 + ox, y + 2, 4, 7);
            ctx.fillStyle = '#E8E8E8';
            ctx.fillRect(x + 19 + ox, y + 6, 1, 3);
            ctx.fillStyle = skin;
            if (isPanicGesture) {
                ctx.fillRect(x + 15 + ox, y - 10, 3, 3);
            } else if (isBurnout) {
                ctx.fillRect(x + 17 + ox, y + 12, 4, 5);
            } else {
                ctx.fillRect(x + 16 + ox, y + 9, 4, 5);
            }
        }
        
        // === HEAD (slightly shorter) ===
        ctx.fillStyle = skin;
        ctx.fillRect(x + 6 + ox, y - 10, 8, 9);
        
        // === CURLY DARK BROWN HAIR ===
        ctx.fillStyle = '#3A2A1A';
        // Top hair - curly volume
        ctx.fillRect(x + 6 + ox, y - 12, 8, 3);
        // Side hair (short, frames face)
        ctx.fillRect(x + 5 + ox, y - 11, 2, 2);
        ctx.fillRect(x + 13 + ox, y - 11, 2, 2);
        // Hair texture highlights
        ctx.fillStyle = '#4A3A2A';
        ctx.fillRect(x + 8 + ox, y - 11, 2, 1);
        ctx.fillRect(x + 10 + ox, y - 10, 2, 1);
        
        // === CHRISTMAS HAT (December only) ===
        const month = gameState.month || 1;
        if (month === 12) {
            // Red hat
            ctx.fillStyle = '#DC143C';
            ctx.fillRect(x + 5 + ox, y - 14, 10, 4);
            ctx.fillRect(x + 7 + ox, y - 17, 6, 3);
            ctx.fillRect(x + 9 + ox, y - 19, 3, 2);
            // White trim
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 4 + ox, y - 11, 12, 2);
            // White pom-pom
            ctx.fillRect(x + 10 + ox, y - 20, 2, 2);
        }
        
        // === EYES ===
        // Subtle eye movement - slow side to side
        const subtleLook = Math.floor(frameTime / 4000) % 3; // 0, 1, or 2
        const eyeOffset = subtleLook === 0 ? 0 : (subtleLook === 1 ? 1 : 0);
        
        if (isBlinking && !isPanicking && !isBurnout) {
            // Blinking - eyes closed
            ctx.fillStyle = '#3A2A1A';
            ctx.fillRect(x + 7 + ox, y - 6, 2, 1);
            ctx.fillRect(x + 11 + ox, y - 6, 2, 1);
        } else if (isBurnout) {
            // Exhausted half-closed eyes
            ctx.fillStyle = '#2C2C2C';
            ctx.fillRect(x + 7 + ox, y - 6, 2, 1);
            ctx.fillRect(x + 11 + ox, y - 6, 2, 1);
        } else if (isPanicking) {
            // Wide panicked eyes
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 7 + ox, y - 7, 2, 3);
            ctx.fillRect(x + 11 + ox, y - 7, 2, 3);
            // Darting pupils
            const eyeShift = Math.sin(frameTime / 100) > 0 ? 0 : 1;
            ctx.fillStyle = '#2C2C2C';
            ctx.fillRect(x + 7 + eyeShift + ox, y - 6, 1, 2);
            ctx.fillRect(x + 11 + eyeShift + ox, y - 6, 1, 2);
        } else {
            // Normal eyes with subtle movement
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 7 + ox, y - 7, 2, 2);
            ctx.fillRect(x + 11 + ox, y - 7, 2, 2);
            // Pupils - with subtle side movement
            ctx.fillStyle = '#2C2C2C';
            ctx.fillRect(x + 7 + eyeOffset + ox, y - 6, 1, 1);
            ctx.fillRect(x + 11 + eyeOffset + ox, y - 6, 1, 1);
        }
        
        // === EYEBROWS ===
        ctx.fillStyle = '#3A2A1A';
        if (isPanicking) {
            // Raised worried
            ctx.fillRect(x + 7 + ox, y - 9, 2, 1);
            ctx.fillRect(x + 11 + ox, y - 9, 2, 1);
        } else if (isBurnout) {
            // Droopy tired
            ctx.fillRect(x + 7 + ox, y - 8, 2, 1);
            ctx.fillRect(x + 11 + ox, y - 8, 2, 1);
        } else {
            // Normal
            ctx.fillRect(x + 7 + ox, y - 8, 2, 1);
            ctx.fillRect(x + 11 + ox, y - 8, 2, 1);
        }
        
        // === MOUTH ===
        if (isHappy) {
            // Bigger smile!
            ctx.fillStyle = '#D08080';
            ctx.fillRect(x + 8 + ox, y - 3, 4, 1);
            ctx.fillRect(x + 9 + ox, y - 2, 2, 1);
        } else if (isPanicking) {
            // Open mouth panic
            ctx.fillStyle = '#6B3030';
            ctx.fillRect(x + 9 + ox, y - 5, 2, 2);
        } else if (isBurnout) {
            // Flat exhausted line
            ctx.fillStyle = '#8A6A5A';
            ctx.fillRect(x + 8 + ox, y - 4, 4, 1);
        } else {
            // Neutral - simple line
            ctx.fillStyle = '#C08080';
            ctx.fillRect(x + 9 + ox, y - 4, 2, 1);
        }
        
        // === SWEAT DROPS (panicking) ===
        if (isPanicking) {
            ctx.fillStyle = '#87CEEB';
            const sweatAnim = (frameTime / 80) % 12;
            ctx.fillRect(x + 4 + ox, y - 8 + sweatAnim, 1, 2);
            ctx.fillRect(x + 15 + ox, y - 6 + sweatAnim, 1, 2);
        }
        
        // === STRESS LINES ===
        if (stress > 50 && stress < 80) {
            ctx.fillStyle = 'rgba(0,0,0,0.12)';
            ctx.fillRect(x + 6 + ox, y - 10, 1, 2);
            ctx.fillRect(x + 13 + ox, y - 10, 1, 2);
        }
        
        // === BURNOUT CLOUD/SPIRAL ===
        if (isBurnout) {
            ctx.fillStyle = 'rgba(100,100,100,0.25)';
            const spiralAnim = Math.sin(frameTime / 300) * 2;
            ctx.fillRect(x + 4 + spiralAnim + ox, y - 20, 2, 2);
            ctx.fillRect(x + 9 - spiralAnim + ox, y - 22, 3, 3);
            ctx.fillRect(x + 14 + spiralAnim + ox, y - 20, 2, 2);
        }
    }

    // === PONCHO - Australian Shepherd (Red Merle) ===
    // Puppy version until ponchoAnniversary event, then adult
    // === PONCHO - Australian Shepherd (Red Merle) ===
    // Current "puppy" size becomes ADULT, new smaller puppy
    function drawPoncho16(ctx, x, y, gameState = {}, frameTime = Date.now()) {
        const time = frameTime;
        const wagFrame = Math.floor(time / 100) % 4;
        const breathe = Math.sin(time / 600) * 0.2;
        const reputation = gameState.reputation || 0;
        const isAdult = gameState.ponchoAnniversary || false;
        
        // Puppy sits closer to Julien, adult sits further away
        if (!isAdult) {
            x = x + 15; // Move puppy closer to Julien
        }
        
        // Australian Shepherd colors (red merle)
        const copper = '#B5651D';
        const copperDark = '#8B4513';
        const copperLight = '#CD853F';
        const white = '#FEFEFE';
        const cream = '#F5F5DC';
        const merle = '#A0522D';
        const nose = '#3D2B1F';
        const eyeBlue = '#6B9BBD';   // Blue eye
        const eyeBrown = '#8B4513';  // Brown eye
        
        const isSleeping = gameState.timeOfDay === 3 && reputation < 50;
        const isHappy = reputation > 60;
        
        if (isAdult) {
            // === ADULT PONCHO - Smaller sitting Australian Shepherd ===
            
            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.12)';
            ctx.beginPath();
            ctx.ellipse(x + 8, y + 12, 6, 2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            if (isSleeping) {
                // Sleeping curled
                ctx.fillStyle = copper;
                ctx.fillRect(x + 2, y + 6, 12, 6);
                ctx.fillStyle = white;
                ctx.fillRect(x + 6, y + 7, 4, 4);
                ctx.fillStyle = copper;
                ctx.fillRect(x + 11, y + 4, 6, 5);
                ctx.fillStyle = white;
                ctx.fillRect(x + 13, y + 5, 3, 3);
                return;
            }
            
            // Tail (wagging gently)
            const tailWag = Math.sin(time / 150) * 0.3;
            ctx.save();
            ctx.translate(x + 2, y + 6);
            ctx.rotate(tailWag - 0.2);
            ctx.fillStyle = copper;
            ctx.fillRect(-4, -1, 5, 3);
            ctx.fillStyle = white;
            ctx.fillRect(-3, 0, 2, 2);
            ctx.restore();
            
            // Back haunches (sitting)
            ctx.fillStyle = copper;
            ctx.fillRect(x + 2, y + 6, 8, 5);
            ctx.fillStyle = white;
            ctx.fillRect(x + 2, y + 10, 3, 2);
            ctx.fillRect(x + 7, y + 10, 3, 2);
            
            // Body (upright sitting)
            ctx.fillStyle = copper;
            ctx.fillRect(x + 5, y - 2 + breathe, 8, 10);
            ctx.fillStyle = white;
            ctx.fillRect(x + 7, y + breathe, 6, 8);
            ctx.fillStyle = merle;
            ctx.fillRect(x + 5, y + 2 + breathe, 2, 2);
            
            // Front legs
            ctx.fillStyle = copper;
            ctx.fillRect(x + 7, y + 7 + breathe, 2, 5);
            ctx.fillRect(x + 11, y + 7 + breathe, 2, 5);
            ctx.fillStyle = white;
            ctx.fillRect(x + 7, y + 10 + breathe, 2, 2);
            ctx.fillRect(x + 11, y + 10 + breathe, 2, 2);
            
            // Neck ruff
            ctx.fillStyle = white;
            ctx.fillRect(x + 6, y - 4 + breathe, 6, 3);
            
            // Head movement (quick tilt, but infrequent - every ~8 seconds for ~1 second)
            const headCycle = Math.floor(time / 8000) % 2;
            const headTilt = headCycle === 0 && (time % 8000) < 800 ? Math.sin((time % 800) / 100) * 1.5 : 0;
            
            // Head
            ctx.fillStyle = copper;
            ctx.fillRect(x + 5 + headTilt, y - 10 + breathe, 8, 7);
            ctx.fillStyle = white;
            ctx.fillRect(x + 7 + headTilt, y - 9 + breathe, 4, 5);
            
            // Ears
            ctx.fillStyle = copper;
            ctx.fillRect(x + 4 + headTilt, y - 11 + breathe, 3, 3);
            ctx.fillRect(x + 11 + headTilt, y - 11 + breathe, 3, 3);
            
            // Eyes - HETEROCHROMIA
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 6 + headTilt, y - 7 + breathe, 2, 2);
            ctx.fillRect(x + 10 + headTilt, y - 7 + breathe, 2, 2);
            ctx.fillStyle = eyeBlue;
            ctx.fillRect(x + 6 + headTilt, y - 6 + breathe, 1, 1);
            ctx.fillStyle = eyeBrown;
            ctx.fillRect(x + 11 + headTilt, y - 6 + breathe, 1, 1);
            
            // Nose
            ctx.fillStyle = nose;
            ctx.fillRect(x + 8 + headTilt, y - 5 + breathe, 2, 1);
            
            // Tongue (once every ~10 seconds for ~0.5 second)
            if ((time % 10000) < 500) {
                ctx.fillStyle = '#FF7070';
                ctx.fillRect(x + 8 + headTilt, y - 4 + breathe, 2, 2);
            }
            
        } else {
            // === PUPPY PONCHO (tiny!) ===
            
            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.beginPath();
            ctx.ellipse(x + 6, y + 10, 4, 1, 0, 0, Math.PI * 2);
            ctx.fill();
            
            if (isSleeping) {
                // Tiny ball
                ctx.fillStyle = copper;
                ctx.fillRect(x + 3, y + 5, 8, 4);
                ctx.fillStyle = white;
                ctx.fillRect(x + 5, y + 6, 3, 2);
                ctx.fillStyle = copper;
                ctx.fillRect(x + 9, y + 3, 4, 4);
                ctx.fillStyle = white;
                ctx.fillRect(x + 10, y + 4, 2, 2);
                return;
            }
            
            // Tiny tail (fast wag!)
            const puppyWag = Math.sin(time / 70) * 0.7;
            ctx.save();
            ctx.translate(x + 2, y + 4);
            ctx.rotate(puppyWag);
            ctx.fillStyle = copper;
            ctx.fillRect(-3, -1, 4, 2);
            ctx.fillStyle = white;
            ctx.fillRect(-2, 0, 2, 1);
            ctx.restore();
            
            // Back legs
            ctx.fillStyle = copper;
            ctx.fillRect(x + 3, y + 6 + breathe, 2, 4);
            ctx.fillRect(x + 6, y + 6 + breathe, 2, 4);
            ctx.fillStyle = white;
            ctx.fillRect(x + 3, y + 9 + breathe, 2, 1);
            ctx.fillRect(x + 6, y + 9 + breathe, 2, 1);
            
            // Body
            ctx.fillStyle = copper;
            ctx.fillRect(x + 2, y + 2 + breathe, 10, 5);
            ctx.fillStyle = white;
            ctx.fillRect(x + 8, y + 3 + breathe, 4, 3);
            ctx.fillStyle = merle;
            ctx.fillRect(x + 3, y + 3 + breathe, 2, 2);
            
            // Front legs
            ctx.fillStyle = copper;
            ctx.fillRect(x + 8, y + 6 + breathe, 2, 4);
            ctx.fillRect(x + 11, y + 6 + breathe, 2, 4);
            ctx.fillStyle = white;
            ctx.fillRect(x + 8, y + 9 + breathe, 2, 1);
            ctx.fillRect(x + 11, y + 9 + breathe, 2, 1);
            
            // Neck (fluffy)
            ctx.fillStyle = white;
            ctx.fillRect(x + 10, y + 1 + breathe, 3, 2);
            
            // Head (cute puppy proportions - rounder)
            ctx.fillStyle = copper;
            ctx.fillRect(x + 10, y - 4 + breathe, 6, 6);
            // White blaze on face
            ctx.fillStyle = white;
            ctx.fillRect(x + 12, y - 3 + breathe, 2, 4);
            
            // Floppy ears (on sides) - quick flop every ~6 seconds for ~0.5 second
            const earFlop = (time % 6000) < 500 ? 1 : 0;
            ctx.fillStyle = copper;
            ctx.fillRect(x + 9, y - 3 + breathe + earFlop, 2, 3);
            ctx.fillRect(x + 15, y - 3 + breathe + earFlop, 2, 3);
            
            // Big cute eyes - HETEROCHROMIA (higher on face)
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 11, y - 3 + breathe, 2, 2);
            ctx.fillRect(x + 14, y - 3 + breathe, 2, 2);
            // Left eye BLUE
            ctx.fillStyle = eyeBlue;
            ctx.fillRect(x + 11, y - 2 + breathe, 1, 1);
            // Right eye BROWN
            ctx.fillStyle = eyeBrown;
            ctx.fillRect(x + 15, y - 2 + breathe, 1, 1);
            
            // Tiny nose (at front/bottom of face)
            ctx.fillStyle = nose;
            ctx.fillRect(x + 15, y - 1 + breathe, 2, 1);
            
            // Little tongue (once every ~10 seconds for ~0.5 second)
            if ((time % 10000) < 500) {
                ctx.fillStyle = '#FF8080';
                ctx.fillRect(x + 15, y + breathe, 2, 2);
            }
        }
    }

    function drawSnow(ctx, W, H, monthsPlayed, frameTime, showFalling = true) {
        // Determine which winter "year" we're in for rotating features
        const winterYear = Math.floor(monthsPlayed / 12) % 4;
        // 0 = basic snow, 1 = icicles, 2 = snowman, 3 = Christmas tree
        
        // Falling snowflakes (only in December)
        if (showFalling) {
            ctx.fillStyle = '#FFFFFF';
            for (let i = 0; i < 60; i++) {
                const x = (frameTime / 30 + i * 41) % W;
                const y = (frameTime / 25 + i * 29) % (H - 10);
                const size = 1 + (i % 3);
                ctx.globalAlpha = 0.7 + (i % 3) * 0.1;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
        
        // Snow on ground (layered for depth)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 174, W, 6);
        // Snow drift texture
        ctx.fillStyle = '#F5F5F5';
        for (let sx = 0; sx < W; sx += 12) {
            ctx.fillRect(sx, 172, 8, 3);
        }
        ctx.fillStyle = '#E8E8E8';
        for (let sx = 6; sx < W; sx += 15) {
            ctx.fillRect(sx, 173, 5, 2);
        }
        
        // Snow on grey awning (thick layer on top)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(70, 115, 180, 4);
        // Snow edge detail
        ctx.fillStyle = '#F0F0F0';
        ctx.fillRect(70, 118, 180, 1);
        // Small snow lumps on awning
        ctx.fillStyle = '#FFFFFF';
        for (let sx = 75; sx < 245; sx += 25) {
            ctx.fillRect(sx, 113, 12, 3);
        }
        
        // Snow on building roof ledge (removed - was covering critters)
        
        // Snow on upper window sills
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(85, 102, 38, 3);
        ctx.fillRect(138, 102, 45, 3);
        ctx.fillRect(198, 102, 38, 3);
        
        // Snow on left building
        ctx.fillRect(10, 103, 25, 2);
        ctx.fillRect(40, 103, 25, 2);
        ctx.fillRect(0, 48, 70, 3);
        
        // Snow on right building
        ctx.fillRect(265, 68, 20, 2);
        ctx.fillRect(292, 68, 20, 2);
        ctx.fillRect(255, 48, 65, 3);
        
        // === ROTATING YEARLY FEATURES ===
        
        // Year 1: Icicles hanging from awning
        if (winterYear === 1 || winterYear === 3) {
            drawIcicles(ctx, 75, 128);
        }
        
        // Year 2: Snowman near entrance
        if (winterYear === 2) {
            drawSnowman(ctx, 265, 158);
        }
        
        // Year 3: Small Christmas tree at entrance
        if (winterYear === 3) {
            drawMiniChristmasTree(ctx, 125, 165);
        }
        
        // Every year after first: snow pile
        if (monthsPlayed > 12) {
            drawSnowPile(ctx, 55, 172);
        }
    }
    
    function drawIcicles(ctx, x, y) {
        // Icicles hanging from awning
        ctx.fillStyle = '#E0F0FF';
        const iciclePositions = [0, 15, 35, 55, 80, 100, 120, 145, 160];
        for (let i = 0; i < iciclePositions.length; i++) {
            const ix = x + iciclePositions[i];
            const height = 4 + (i % 3) * 3;
            // Icicle shape (tapers down)
            ctx.fillRect(ix, y, 2, height);
            ctx.fillRect(ix, y + height, 1, 2);
            // Shine
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(ix, y, 1, height - 1);
            ctx.fillStyle = '#E0F0FF';
        }
    }
    
    function drawSnowman(ctx, x, y) {
        // Bottom ball
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(x, y + 8, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Middle ball
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Head
        ctx.beginPath();
        ctx.arc(x, y - 8, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Shadow details
        ctx.fillStyle = '#E8E8E8';
        ctx.beginPath();
        ctx.arc(x + 2, y + 10, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(x, y + 8, 7, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = '#2C2C2C';
        ctx.fillRect(x - 2, y - 9, 1, 1);
        ctx.fillRect(x + 1, y - 9, 1, 1);
        
        // Carrot nose
        ctx.fillStyle = '#FF6600';
        ctx.fillRect(x, y - 8, 3, 1);
        
        // Buttons
        ctx.fillStyle = '#2C2C2C';
        ctx.fillRect(x, y - 2, 1, 1);
        ctx.fillRect(x, y + 1, 1, 1);
        ctx.fillRect(x, y + 4, 1, 1);
        
        // Stick arms
        ctx.fillStyle = '#5C4033';
        ctx.fillRect(x - 8, y - 1, 6, 1);
        ctx.fillRect(x + 4, y - 1, 6, 1);
        
        // Scarf
        ctx.fillStyle = '#DC143C';
        ctx.fillRect(x - 3, y - 5, 6, 2);
        ctx.fillRect(x + 2, y - 5, 2, 5);
    }
    
    function drawMiniChristmasTree(ctx, x, y) {
        // Pot
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x - 3, y + 8, 6, 4);
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(x - 2, y + 9, 4, 2);
        
        // Tree trunk
        ctx.fillStyle = '#5C4033';
        ctx.fillRect(x - 1, y + 5, 2, 4);
        
        // Tree layers (triangle shape)
        ctx.fillStyle = '#228B22';
        // Bottom layer
        ctx.fillRect(x - 6, y + 3, 12, 3);
        // Middle layer
        ctx.fillRect(x - 5, y, 10, 3);
        // Top layer
        ctx.fillRect(x - 4, y - 3, 8, 3);
        // Peak
        ctx.fillRect(x - 2, y - 5, 4, 2);
        ctx.fillRect(x - 1, y - 6, 2, 1);
        
        // Star on top
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(x - 1, y - 8, 2, 2);
        ctx.fillRect(x, y - 9, 1, 1);
        
        // Ornaments
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(x - 4, y + 1, 2, 2);
        ctx.fillRect(x + 2, y + 4, 2, 2);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(x + 1, y - 1, 2, 2);
        ctx.fillRect(x - 3, y + 4, 2, 2);
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(x - 2, y - 3, 2, 2);
    }
    
    function drawSnowPile(ctx, x, y) {
        // Small snow pile
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(x - 8, y + 5);
        ctx.lineTo(x, y - 2);
        ctx.lineTo(x + 8, y + 5);
        ctx.fill();
        
        // Shadow
        ctx.fillStyle = '#E8E8E8';
        ctx.beginPath();
        ctx.moveTo(x - 6, y + 5);
        ctx.lineTo(x + 2, y);
        ctx.lineTo(x + 6, y + 5);
        ctx.fill();
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

    function drawHeavyRain(ctx, W, H, frameTime) {
        // Dark overcast sky overlay
        ctx.fillStyle = 'rgba(50, 60, 70, 0.3)';
        ctx.fillRect(0, 0, W, H);
        
        // Heavy rain - lots of raindrops
        ctx.strokeStyle = 'rgba(150, 180, 210, 0.7)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 120; i++) {
            const x = (frameTime / 10 + i * 27) % W;
            const y = (frameTime / 5 + i * 19) % H;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - 3, y + 12);
            ctx.stroke();
        }
        
        // Splashes on ground
        ctx.fillStyle = 'rgba(150, 180, 210, 0.5)';
        for (let i = 0; i < 15; i++) {
            const splashX = (frameTime / 8 + i * 47) % W;
            const splashFrame = (frameTime + i * 100) % 500;
            if (splashFrame < 200) {
                const size = 2 + (splashFrame / 100);
                ctx.beginPath();
                ctx.arc(splashX, 175, size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Puddles on sidewalk
        ctx.fillStyle = 'rgba(100, 140, 180, 0.4)';
        ctx.fillRect(20, 176, 40, 3);
        ctx.fillRect(100, 177, 30, 2);
        ctx.fillRect(200, 176, 50, 3);
        ctx.fillRect(280, 177, 25, 2);
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
        const time = Date.now();
        
        // === GARLAND across full shop width ===
        // Green garland rope
        ctx.strokeStyle = '#1B5E20';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(70, 128);
        for (let x = 70; x <= 250; x += 5) {
            const sag = Math.sin((x - 70) / 30) * 2 + 1;
            ctx.lineTo(x, 128 + sag);
        }
        ctx.stroke();
        
        // Hanging ornaments from garland (red and green alternating)
        for (let i = 0; i < 20; i++) {
            const ox = 75 + i * 9;
            const sag = Math.sin((ox - 70) / 30) * 2 + 1;
            const oy = 128 + sag;
            
            // String
            ctx.strokeStyle = '#8B8B8B';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(ox, oy);
            ctx.lineTo(ox, oy + 4 + (i % 3));
            ctx.stroke();
            
            // Ornament ball
            const isRed = i % 2 === 0;
            ctx.fillStyle = isRed ? '#DC143C' : '#228B22';
            ctx.fillRect(ox - 1, oy + 4 + (i % 3), 3, 3);
            // Shine
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.fillRect(ox - 1, oy + 4 + (i % 3), 1, 1);
        }
        
        // === SMALL STRING LIGHTS (subtle) ===
        const lightColors = ['#FF6B6B', '#6BCB77', '#FFD93D', '#6B9BFF'];
        const blink = Math.floor(time / 400) % 2;
        for (let i = 0; i < 25; i++) {
            const lx = 72 + i * 7;
            const ly = 130 + Math.sin(i * 0.5) * 1;
            
            // Tiny light (just 1-2 pixels)
            const colorIndex = (i + (blink && i % 3 === 0 ? 1 : 0)) % lightColors.length;
            ctx.fillStyle = lightColors[colorIndex];
            ctx.fillRect(lx, ly, 2, 2);
            
            // Very subtle glow
            ctx.fillStyle = lightColors[colorIndex] + '30';
            ctx.fillRect(lx - 1, ly - 1, 4, 4);
        }
        
        // === SUBTLE INTERIOR CHRISTMAS GLOW ===
        // Warm red/green glow inside shop window
        ctx.fillStyle = 'rgba(220, 20, 60, 0.05)';
        ctx.fillRect(130, 140, 50, 30);
        ctx.fillStyle = 'rgba(34, 139, 34, 0.05)';
        ctx.fillRect(180, 140, 50, 30);
        
        // Small interior lights hint
        ctx.fillStyle = 'rgba(255, 215, 0, 0.15)';
        ctx.fillRect(145, 138, 2, 2);
        ctx.fillRect(175, 138, 2, 2);
        ctx.fillRect(205, 138, 2, 2);
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

    function drawBelgianFlagInHand(ctx, x, y, frameTime = Date.now()) {
        // Small flag on a stick held in Julien's left hand
        // Stick
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x, y, 1, 12);
        // Flag (smaller, waving gently)
        const wave = Math.sin(frameTime / 600) * 0.5;
        ctx.fillStyle = '#2D2926'; // Black
        ctx.fillRect(x + 1, y - 6 + wave, 3, 8);
        ctx.fillStyle = '#FDDA24'; // Yellow
        ctx.fillRect(x + 4, y - 6 + wave, 3, 8);
        ctx.fillStyle = '#EF3340'; // Red
        ctx.fillRect(x + 7, y - 6 + wave, 3, 8);
    }

    function drawPartyDecorations(ctx, frameTime = Date.now()) {
        // Bunting flags (triangular flags on string) - lowered to just above awning
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'];
        for (let i = 0; i < 12; i++) {
            const bx = 75 + i * 15;
            const by = 118 + Math.sin(i * 0.5) * 2;
            ctx.fillStyle = colors[i % colors.length];
            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.lineTo(bx + 6, by);
            ctx.lineTo(bx + 3, by + 8);
            ctx.fill();
        }
        // String connecting flags
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(72, 118);
        for (let i = 0; i < 12; i++) ctx.lineTo(78 + i * 15, 118 + Math.sin(i * 0.5) * 2);
        ctx.stroke();
        
        // Balloons - lowered and slightly smaller
        const balloonColors = ['#FF6B6B', '#4ECDC4', '#FFE66D'];
        for (let i = 0; i < 3; i++) {
            const bx = 190 + i * 16;
            const by = 108 + Math.sin(frameTime / 500 + i) * 2;
            ctx.fillStyle = balloonColors[i];
            ctx.beginPath();
            ctx.ellipse(bx, by, 5, 7, 0, 0, Math.PI * 2);
            ctx.fill();
            // Balloon shine
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.fillRect(bx - 2, by - 4, 2, 2);
            // Balloon string
            ctx.strokeStyle = '#999';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(bx, by + 7);
            ctx.lineTo(bx + Math.sin(i) * 2, by + 18);
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
