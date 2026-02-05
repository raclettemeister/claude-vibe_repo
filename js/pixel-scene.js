/**
 * 16-BIT PIXEL ART SCENE RENDERER (SNES Style)
 * Extracted from index.html for safe iteration.
 * Uses gameState passed as parameter - no global dependency.
 *
 * Usage: PixelScene.drawPixelScene(gameState)
 */
(function() {
    'use strict';

    const CANVAS_IDS = ['pixel-canvas', 'shop-art'];

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
        const month = gameState.month;
        const isWinter = month === 12 || month === 1 || month === 2;
        const isSummer = month >= 6 && month <= 8;
        const isAutumn = month >= 9 && month <= 11;
        const isSpring = month >= 3 && month <= 5;

        // === SKY WITH GRADIENT ===
        const skyGrad = ctx.createLinearGradient(0, 0, 0, 100);
        if (isWinter) {
            skyGrad.addColorStop(0, '#9DB8C7');
            skyGrad.addColorStop(1, '#D4E5ED');
        } else if (isAutumn) {
            skyGrad.addColorStop(0, '#87ACBF');
            skyGrad.addColorStop(1, '#C9DDE8');
        } else if (isSummer) {
            skyGrad.addColorStop(0, '#4A90B8');
            skyGrad.addColorStop(1, '#87CEEB');
        } else {
            skyGrad.addColorStop(0, '#5BA3C6');
            skyGrad.addColorStop(1, '#A8D8EA');
        }
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, W, 110);

        // Distant buildings/horizon
        ctx.fillStyle = '#8899AA';
        ctx.fillRect(0, 85, W, 25);
        ctx.fillStyle = '#7788AA';
        for (let x = 0; x < W; x += 40) {
            const h = 10 + Math.sin(x * 0.1) * 8;
            ctx.fillRect(x, 95 - h, 35, h + 5);
        }

        // Sun/Moon with glow
        if (!isWinter) {
            const sunGrad = ctx.createRadialGradient(280, 30, 0, 280, 30, 25);
            sunGrad.addColorStop(0, '#FFFFCC');
            sunGrad.addColorStop(0.5, '#FFD700');
            sunGrad.addColorStop(1, 'rgba(255,215,0,0)');
            ctx.fillStyle = sunGrad;
            ctx.beginPath();
            ctx.arc(280, 30, 25, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#FFF8DC';
            ctx.beginPath();
            ctx.arc(280, 30, 12, 0, Math.PI * 2);
            ctx.fill();
        } else {
            drawCloud(ctx, 30, 20, 1);
            drawCloud(ctx, 120, 35, 0.8);
            drawCloud(ctx, 220, 15, 1.2);
            drawCloud(ctx, 280, 40, 0.7);
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
        drawWindow16(ctx, 12, 75, 22, 30, true);
        drawWindow16(ctx, 42, 75, 22, 30, true);
        drawWindow16(ctx, 12, 115, 22, 25, false);
        drawWindow16(ctx, 42, 115, 22, 25, false);

        // === RIGHT NEIGHBORING BUILDING ===
        ctx.fillStyle = '#B8956E';
        ctx.fillRect(255, 55, 65, 125);
        ctx.fillStyle = '#C8A57E';
        ctx.fillRect(315, 55, 5, 125);
        ctx.fillStyle = '#6B4423';
        ctx.fillRect(255, 50, 65, 8);
        drawWindow16(ctx, 265, 70, 20, 28, true);
        drawWindow16(ctx, 292, 70, 20, 28, false);
        drawWindow16(ctx, 265, 110, 20, 25, true);
        drawWindow16(ctx, 292, 110, 20, 25, true);

        // === MAIN SHOP BUILDING ===
        drawBrickWall(ctx, 65, 50, 190, 130);
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(65, 48, 190, 6);
        ctx.fillStyle = '#6B5344';
        ctx.fillRect(65, 48, 190, 2);
        ctx.fillStyle = '#9B8365';
        ctx.fillRect(65, 52, 190, 2);

        drawSeasonalCritter(ctx, 180, 42, month);
        drawWindow16(ctx, 85, 62, 38, 42, true, true);
        drawWindow16(ctx, 138, 62, 45, 42, true, true);
        drawWindow16(ctx, 198, 62, 38, 42, true, true);

        // === AWNING ===
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(72, 108, 176, 4);
        const awningGrad = ctx.createLinearGradient(0, 108, 0, 128);
        awningGrad.addColorStop(0, '#2C5530');
        awningGrad.addColorStop(0.5, '#3D7042');
        awningGrad.addColorStop(1, '#1E3D22');
        ctx.fillStyle = awningGrad;
        ctx.fillRect(72, 108, 176, 18);
        ctx.fillStyle = '#1E3D22';
        for (let x = 78; x < 244; x += 18) ctx.fillRect(x, 108, 7, 18);
        ctx.fillStyle = '#3D7042';
        for (let x = 72; x < 248; x += 12) {
            ctx.beginPath();
            ctx.moveTo(x, 126);
            ctx.lineTo(x + 6, 134);
            ctx.lineTo(x + 12, 126);
            ctx.fill();
        }
        ctx.fillStyle = '#4D8052';
        for (let x = 72; x < 248; x += 12) ctx.fillRect(x + 4, 126, 4, 2);

        // === SHOP WINDOW ===
        ctx.fillStyle = '#3D3028';
        ctx.fillRect(76, 128, 105, 50);
        const windowGrad = ctx.createLinearGradient(79, 131, 178, 175);
        windowGrad.addColorStop(0, '#E8F0E8');
        windowGrad.addColorStop(0.3, '#D8E8D8');
        windowGrad.addColorStop(1, '#C8D8C8');
        ctx.fillStyle = windowGrad;
        ctx.fillRect(79, 131, 99, 44);
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(80, 132, 30, 8);
        if (gameState.cheeseTypes >= 5) {
            drawCheeseDisplay(ctx, 82, 145, gameState.cheeseTypes);
        }

        // === SHOP DOOR ===
        ctx.fillStyle = '#2A2015';
        ctx.fillRect(188, 128, 54, 52);
        const doorGrad = ctx.createLinearGradient(191, 131, 239, 131);
        doorGrad.addColorStop(0, '#2C5530');
        doorGrad.addColorStop(0.5, '#3D7042');
        doorGrad.addColorStop(1, '#2C5530');
        ctx.fillStyle = doorGrad;
        ctx.fillRect(191, 131, 48, 46);
        ctx.fillStyle = '#1E3D22';
        ctx.fillRect(194, 134, 19, 18);
        ctx.fillRect(217, 134, 19, 18);
        ctx.fillStyle = '#FFE4B5';
        ctx.fillRect(196, 136, 15, 14);
        ctx.fillRect(219, 136, 15, 14);
        ctx.fillStyle = '#3D3028';
        ctx.fillRect(202, 136, 2, 14);
        ctx.fillRect(226, 136, 2, 14);
        ctx.fillStyle = '#DAA520';
        ctx.fillRect(230, 158, 5, 10);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(231, 159, 3, 8);

        // === SHOP SIGN ===
        if (gameState.shopRenamed || gameState.monthsPlayed > 5) {
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.fillRect(98, 112, 125, 14);
            const signGrad = ctx.createLinearGradient(0, 110, 0, 124);
            signGrad.addColorStop(0, '#FFF8E7');
            signGrad.addColorStop(1, '#E8DCC8');
            ctx.fillStyle = signGrad;
            ctx.fillRect(95, 110, 125, 14);
            ctx.strokeStyle = '#8B7355';
            ctx.lineWidth = 1;
            ctx.strokeRect(95, 110, 125, 14);
            ctx.fillStyle = '#2C5530';
            ctx.font = 'bold 10px Georgia, serif';
            ctx.textAlign = 'center';
            ctx.fillText('CHEZ JULIEN', 158, 121);
            if (gameState.signInstalled) {
                ctx.fillStyle = '#DAA520';
                ctx.fillRect(93, 108, 129, 2);
                ctx.fillRect(93, 124, 129, 2);
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(94, 109, 127, 1);
            }
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
        if (!gameState.hasLucas || !gameState.hasHenry) {
            drawJulienInShop(ctx, gameState.hasLucas ? 115 : 195, 147);
        }
        if (gameState.hasLucas) drawCharacter16(ctx, 200, 150, 'lucas');
        if (gameState.hasHenry) drawCharacter16(ctx, 110, 148, 'henry', true);
        if (gameState.hasDog) drawPoncho16(ctx, 255, 155);

        const customerCount = Math.min(3, Math.floor(gameState.reputation / 30));
        if (customerCount > 0) drawCharacter16(ctx, 35, 148, 'customer0');
        if (customerCount > 1) drawCharacter16(ctx, 55, 152, 'customer1');
        if (customerCount > 2) drawCharacter16(ctx, 20, 150, 'customer2');

        if (gameState.reputation > 70) {
            const queueCount = Math.min(4, Math.floor((gameState.reputation - 70) / 8));
            drawCustomerQueue(ctx, queueCount);
        }

        if (gameState.hasWineSelection) drawWineDisplay(ctx, 130, 158);
        if (gameState.hasRaclette || gameState.racletteTypes > 0) drawRacletteSteam(ctx);

        const isChristmas = month === 12 || month === 11;
        if (isChristmas) {
            drawChristmasDecorations(ctx);
            if (gameState.family > 50 && Math.floor(Date.now() / 5000) % 3 === 0) {
                drawLuciaPainting(ctx);
            }
        }

        if (month === 7) drawBelgianFlag(ctx, 250, 125);

        const isAnniversaryMonth = gameState.monthsPlayed === 12 || gameState.monthsPlayed === 24 || gameState.monthsPlayed === 36;
        if (isAnniversaryMonth) drawPartyDecorations(ctx);

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

        if (gameState.stress > 55) drawNightMode(ctx, W, H, gameState.stress);

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

    function drawBrickWall(ctx, x, y, w, h) {
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(x, y, w, h);
        for (let row = 0; row < h; row += 8) {
            const offset = (Math.floor(row / 8) % 2) * 12;
            for (let col = 0; col < w; col += 24) {
                const shade = Math.random() * 20 - 10;
                ctx.fillStyle = `rgb(${160 + shade}, ${82 + shade * 0.5}, ${45 + shade * 0.3})`;
                ctx.fillRect(x + col + offset, y + row, 22, 6);
                ctx.fillStyle = '#8B7355';
                ctx.fillRect(x + col + offset, y + row + 6, 24, 2);
                ctx.fillRect(x + col + offset + 22, y + row, 2, 8);
            }
        }
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(x, y, 3, h);
    }

    function drawWindow16(ctx, x, y, w, h, lit, hasShutters) {
        ctx.fillStyle = '#4A3728';
        ctx.fillRect(x, y, w, h);
        const glassColor = lit ? '#FFE4B5' : '#A8C8D8';
        ctx.fillStyle = glassColor;
        ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
        ctx.fillStyle = '#4A3728';
        ctx.fillRect(x + w/2 - 1, y + 2, 2, h - 4);
        ctx.fillRect(x + 2, y + h/2 - 1, w - 4, 2);
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(x + 3, y + 3, 6, 4);
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

    function drawCheeseDisplay(ctx, x, y, cheeseCount) {
        ctx.fillStyle = '#4A3A2A';
        ctx.fillRect(x - 2, y - 5, 99, 40);
        ctx.fillStyle = '#6B4423';
        ctx.fillRect(x - 1, y + 8, 97, 3);
        ctx.fillStyle = '#5A3320';
        ctx.fillRect(x - 1, y + 8, 97, 1);
        ctx.fillStyle = '#6B4423';
        ctx.fillRect(x - 1, y + 26, 97, 3);
        ctx.fillStyle = '#5A3320';
        ctx.fillRect(x - 1, y + 26, 97, 1);
        const topCheeses = [
            { x: 3, y: -2, w: 12, h: 8, color: '#DEB887' },
            { x: 18, y: 0, w: 14, h: 7, color: '#F4A460' },
            { x: 35, y: -1, w: 10, h: 8, color: '#FFD700' },
            { x: 48, y: 1, w: 13, h: 6, color: '#F5DEB3' },
            { x: 64, y: -2, w: 11, h: 9, color: '#FFA07A' },
            { x: 78, y: 0, w: 14, h: 7, color: '#FFDAB9' }
        ];
        const bottomCheeses = [
            { x: 5, y: 12, w: 18, h: 12, color: '#F4A460', shadow: '#D4844A' },
            { x: 28, y: 10, w: 22, h: 14, color: '#FFD700', shadow: '#DAA520' },
            { x: 55, y: 14, w: 15, h: 10, color: '#DEB887', shadow: '#C8A060' },
            { x: 75, y: 11, w: 18, h: 13, color: '#F5DEB3', shadow: '#D5BE93' }
        ];
        const topCount = Math.min(topCheeses.length, Math.floor(cheeseCount / 10));
        for (let i = 0; i < topCount; i++) {
            const c = topCheeses[i];
            ctx.fillStyle = c.color;
            ctx.fillRect(x + c.x, y + c.y, c.w, c.h);
            ctx.fillStyle = 'rgba(255,255,255,0.25)';
            ctx.fillRect(x + c.x + 1, y + c.y + 1, c.w - 3, 2);
        }
        const botCount = Math.min(bottomCheeses.length, Math.floor(cheeseCount / 15) + 1);
        for (let i = 0; i < botCount; i++) {
            const c = bottomCheeses[i];
            ctx.fillStyle = c.shadow || '#888';
            ctx.fillRect(x + c.x + 2, y + c.y + 2, c.w, c.h);
            ctx.fillStyle = c.color;
            ctx.fillRect(x + c.x, y + c.y, c.w, c.h);
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.fillRect(x + c.x + 2, y + c.y + 1, c.w - 6, 3);
        }
        if (cheeseCount > 20) {
            ctx.fillStyle = '#FFFFF0';
            ctx.fillRect(x + 8, y + 22, 5, 3);
            ctx.fillRect(x + 33, y + 21, 5, 3);
            ctx.fillRect(x + 60, y + 22, 5, 3);
        }
    }

    function drawSeasonalCritter(ctx, x, y, month) {
        const isWinter = month === 12 || month === 1 || month === 2;
        const isSpring = month >= 3 && month <= 5;
        const isSummer = month >= 6 && month <= 8;
        const isAutumn = month >= 9 && month <= 11;
        const time = Date.now();
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

    function drawCharacter16(ctx, x, y, type, behindWindow = false) {
        const colors = {
            lucas: { hair: '#4A3728', shirt: '#2C5530', skin: '#FFDAB9' },
            henry: { hair: '#DAA520', shirt: '#4169E1', skin: '#FFE4C4' },
            customer0: { hair: '#8B4513', shirt: '#DC143C', skin: '#FFDAB9' },
            customer1: { hair: '#2C2C2C', shirt: '#4682B4', skin: '#DEB887' },
            customer2: { hair: '#CD853F', shirt: '#9370DB', skin: '#FFDAB9' }
        };
        const c = colors[type] || colors.customer0;
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
        ctx.ellipse(x + 7, y + 27, 6, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#2F4F4F';
        ctx.fillRect(x + 2, y + 16, 4, 10);
        ctx.fillRect(x + 8, y + 16, 4, 10);
        ctx.fillStyle = c.shirt;
        ctx.fillRect(x, y, 14, 17);
        if (type === 'lucas' || type === 'henry') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 2, y + 3, 10, 12);
            ctx.fillStyle = '#F0F0F0';
            ctx.fillRect(x + 2, y + 3, 10, 2);
        }
        ctx.fillStyle = c.shirt;
        ctx.fillRect(x - 2, y + 2, 3, 10);
        ctx.fillRect(x + 13, y + 2, 3, 10);
        ctx.fillStyle = c.skin;
        ctx.fillRect(x - 2, y + 12, 3, 4);
        ctx.fillRect(x + 13, y + 12, 3, 4);
        ctx.fillStyle = c.skin;
        ctx.fillRect(x + 2, y - 12, 10, 12);
        ctx.fillStyle = c.hair;
        ctx.fillRect(x + 2, y - 14, 10, 5);
        ctx.fillRect(x + 1, y - 12, 2, 4);
        ctx.fillRect(x + 11, y - 12, 2, 4);
        ctx.fillStyle = '#2C2C2C';
        ctx.fillRect(x + 4, y - 8, 2, 2);
        ctx.fillRect(x + 8, y - 8, 2, 2);
        ctx.fillStyle = '#E08080';
        ctx.fillRect(x + 5, y - 4, 4, 1);
    }

    function drawJulienInShop(ctx, x, y) {
        const breathe = Math.sin(Date.now() / 600) * 0.5;
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
        if (Math.floor(Date.now() / 3000) % 3 === 0) {
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

    function drawPoncho16(ctx, x, y) {
        const frame = Math.floor(Date.now() / 400) % 2;
        const wagFrame = Math.floor(Date.now() / 120) % 4;
        const breathe = Math.sin(Date.now() / 500) * 0.5;
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(x + 12, y + 22, 10, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        const tailAngle = (wagFrame - 1.5) * 0.3;
        ctx.save();
        ctx.translate(x, y + 6);
        ctx.rotate(tailAngle);
        ctx.fillRect(-8, -2, 10, 5);
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-8, -2, 3, 5);
        ctx.restore();
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x, y, 22, 14 + breathe);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 3, y + 6, 10, 8 + breathe);
        ctx.fillRect(x + 16, y + 2, 6, 10);
        ctx.fillStyle = '#2C2C2C';
        ctx.fillRect(x + 14, y + 1, 4, 6);
        ctx.fillRect(x + 2, y + 1, 5, 4);
        ctx.fillStyle = '#8B4513';
        const legOffset = frame * 2;
        ctx.fillRect(x + 3, y + 14, 4, 7 - legOffset);
        ctx.fillRect(x + 9, y + 14, 4, 7 + legOffset);
        ctx.fillRect(x + 15, y + 14, 4, 7 - legOffset);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 3, y + 19 - legOffset, 4, 2);
        ctx.fillRect(x + 9, y + 19 + legOffset, 4, 2);
        ctx.fillRect(x + 15, y + 19 - legOffset, 4, 2);
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 18, y - 4, 12, 12);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 22, y - 3, 5, 10);
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 17, y - 7, 5, 5);
        ctx.fillRect(x + 26, y - 7, 5, 5);
        ctx.fillStyle = '#2C2C2C';
        ctx.fillRect(x + 17, y - 7, 5, 2);
        ctx.fillRect(x + 26, y - 7, 5, 2);
        ctx.fillRect(x + 28, y + 2, 3, 3);
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(x + 25, y - 1, 3, 3);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 26, y, 1, 1);
        if (wagFrame === 2) {
            ctx.fillStyle = '#FF6B6B';
            ctx.fillRect(x + 28, y + 5, 2, 4);
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
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        for (let i = 0; i < 5; i++) {
            const time = Date.now() / 500 + i * 0.7;
            const x = 95 + Math.sin(time * 2) * 3;
            const y = 140 - (time % 3) * 8;
            const size = 2 + (time % 3);
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

    function drawBelgianFlag(ctx, x, y) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x, y, 2, 25);
        const wave = Math.sin(Date.now() / 200) * 2;
        ctx.fillStyle = '#2D2926';
        ctx.fillRect(x + 2, y + wave, 6, 15);
        ctx.fillStyle = '#FDDA24';
        ctx.fillRect(x + 8, y + wave, 6, 15);
        ctx.fillStyle = '#EF3340';
        ctx.fillRect(x + 14, y + wave, 6, 15);
    }

    function drawPartyDecorations(ctx) {
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
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(72, 100);
        for (let i = 0; i < 12; i++) ctx.lineTo(78 + i * 15, 100 + Math.sin(i * 0.5) * 3);
        ctx.stroke();
        const balloonColors = ['#FF6B6B', '#4ECDC4', '#FFE66D'];
        for (let i = 0; i < 3; i++) {
            const bx = 185 + i * 18;
            const by = 90 + Math.sin(Date.now() / 400 + i) * 3;
            ctx.fillStyle = balloonColors[i];
            ctx.beginPath();
            ctx.ellipse(bx, by, 7, 9, 0, 0, Math.PI * 2);
            ctx.fill();
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
