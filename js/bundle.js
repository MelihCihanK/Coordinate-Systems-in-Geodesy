/**
 * GEO203E: Coordinate Systems in Geodesy - 3D Simulator
 * Reference: E. J. Krakiwsky & D. E. Wells (UNB Lecture Notes No. 16, 1971)
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. RENK VE MATERYAL PALETİ
  // ==========================================================================
  const PALETTE = {
    bgLight: 0xFAF7F2,
    latteMilk: 0xF5EFEB,
    latteCream: 0xEADCC9,
    latteMedium: 0xC4A482,
    latteDark: 0x8C6239,
    espressoDark: 0x4A3525,
    espressoDeep: 0x2A1C14,

    axisBlack: 0x1A252C,
    axisX: 0xC0392B,        // Kırmızı vurgulu X
    axisY: 0x27AE60,        // Yeşil vurgulu Y
    axisZ: 0x2980B9,        // Mavi vurgulu Z
    plumbLine: 0x8E44AD,    // Mor (Çekül Çizgisi)
    normalVector: 0xD35400, // Turuncu (Elipsoit Normali)
    targetOrange: 0xE67E22, // Amber/Turuncu hedef

    // Katman Renkleri
    innerCore: 0xFFEB3B,    // Parlak Sarı (İç Çekirdek)
    outerCore: 0xFF9800,    // Magma Turuncusu (Dış Çekirdek)
    mantle: 0xD84315,       // Koyu Kızıl/Terracotta (Manto)
    crust: 0x4E342E         // Taş grisi/kahve (Yer Kabuğu)
  };

  // ==========================================================================
  // 2. DÜNYA KATMANLARI KESİT TEKSTÜRÜ ÜRETECİ (Pasta Dilimi Görünümü)
  // ==========================================================================
  function generateEarthLayersTexture(isEquator = false) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    const R = 1024;
    const rInner = R * 0.22;     // 0 - 225px: İç Çekirdek (Inner Core)
    const rOuter = R * 0.55;     // 225 - 563px: Dış Çekirdek (Outer Core)
    const rLowMantle = R * 0.82; // 563 - 840px: Alt Manto (Lower Mantle)
    const rUpMantle = R * 0.95;  // 840 - 972px: Üst Manto (Upper Mantle)
    const rCrust = R;            // 972 - 1024px: Yer Kabuğu (Crust)

    // Taban arka plan
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(0, 0, 1024, 1024);

    function fillSector(r1, r2, fillStyle) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, r2, 0, Math.PI / 2);
      ctx.lineTo(0, r1);
      ctx.arc(0, 0, r1, Math.PI / 2, 0, true);
      ctx.closePath();
      ctx.fillStyle = fillStyle;
      ctx.fill();
      ctx.restore();
    }

    // 1. Yer Kabuğu (Crust) - Derin kaya ve bazalt dokusu
    const crustGrad = ctx.createRadialGradient(0, 0, rUpMantle, 0, 0, rCrust);
    crustGrad.addColorStop(0, '#5D4037');
    crustGrad.addColorStop(0.6, '#3E2723');
    crustGrad.addColorStop(1, '#21120E');
    fillSector(rUpMantle, rCrust, crustGrad);

    // 2. Üst Manto (Upper Mantle / Astenosfer) - Peridotit magma
    const upMantleGrad = ctx.createRadialGradient(0, 0, rLowMantle, 0, 0, rUpMantle);
    upMantleGrad.addColorStop(0, '#BF360C');
    upMantleGrad.addColorStop(0.5, '#D84315');
    upMantleGrad.addColorStop(1, '#8D4E2A');
    fillSector(rLowMantle, rUpMantle, upMantleGrad);

    // 3. Alt Manto (Lower Mantle) - Yüksek basınç silikat lavı
    const lowMantleGrad = ctx.createRadialGradient(0, 0, rOuter, 0, 0, rLowMantle);
    lowMantleGrad.addColorStop(0, '#E65100');
    lowMantleGrad.addColorStop(0.5, '#F4511E');
    lowMantleGrad.addColorStop(1, '#BF360C');
    fillSector(rOuter, rLowMantle, lowMantleGrad);

    // 4. Dış Çekirdek (Outer Core) - Erimiş sıvı demir-nikel
    const outerCoreGrad = ctx.createRadialGradient(0, 0, rInner, 0, 0, rOuter);
    outerCoreGrad.addColorStop(0, '#FFF59D');
    outerCoreGrad.addColorStop(0.25, '#FFCA28');
    outerCoreGrad.addColorStop(0.65, '#FB8C00');
    outerCoreGrad.addColorStop(1, '#E65100');
    fillSector(rInner, rOuter, outerCoreGrad);

    // 5. İç Çekirdek (Inner Core) - Katı kristal akkor çekirdek
    const innerCoreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, rInner);
    innerCoreGrad.addColorStop(0, '#FFFFFF');
    innerCoreGrad.addColorStop(0.35, '#FFFDE7');
    innerCoreGrad.addColorStop(0.7, '#FFEE58');
    innerCoreGrad.addColorStop(1, '#FDD835');
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, rInner, 0, Math.PI / 2);
    ctx.closePath();
    ctx.fillStyle = innerCoreGrad;
    ctx.fill();
    ctx.restore();

    // Katman Sınır Çizgileri (Luminous Discontinuity Rings)
    // Lehmann Sınırı (İç/Dış Çekirdek)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 3.0;
    ctx.beginPath();
    ctx.arc(0, 0, rInner, 0, Math.PI / 2);
    ctx.stroke();

    // Gutenberg Sınırı (Çekirdek-Manto)
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.9)';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, 0, rOuter, 0, Math.PI / 2);
    ctx.stroke();

    // Geçiş Zonu (Alt/Üst Manto)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, 0, rLowMantle, 0, Math.PI / 2);
    ctx.stroke();

    // Moho Sınırı (Manto-Kabuk)
    ctx.strokeStyle = 'rgba(255, 235, 150, 0.75)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, rUpMantle, 0, Math.PI / 2);
    ctx.stroke();

    // Dış Kabuk Kenarı
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3.0;
    ctx.beginPath();
    ctx.arc(0, 0, rCrust, 0, Math.PI / 2);
    ctx.stroke();

    // İnce radyal jeodezik kılavuz çizgileri (15° aralıklarla)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1.2;
    for (let deg = 15; deg < 90; deg += 15) {
      const rad = THREE.MathUtils.degToRad(deg);
      ctx.beginPath();
      ctx.moveTo(rInner * Math.cos(rad), rInner * Math.sin(rad));
      ctx.lineTo(rCrust * Math.cos(rad), rCrust * Math.sin(rad));
      ctx.stroke();
    }

    return canvas;
  }

  // 3 Boyutlu Kesit Düzlemleri (Ekvator XY, Greenwich XZ, 90° Doğu YZ)
  function createCutSliceGeometry(planeAxis, R, segments = 48, rings = 12) {
    const positions = [];
    const uvs = [];
    const indices = [];

    for (let rIdx = 0; rIdx <= rings; rIdx++) {
      const frac = rIdx / rings;
      const curR = R * frac;

      for (let sIdx = 0; sIdx <= segments; sIdx++) {
        const theta = (sIdx / segments) * (Math.PI / 2);
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);

        let x = 0, y = 0, z = 0;
        if (planeAxis === 'XY') {
          // Ekvator Düzlemi (Z = 0, X>=0, Y>=0)
          x = curR * cosT;
          y = curR * sinT;
          z = 0;
        } else if (planeAxis === 'XZ') {
          // Greenwich Meridyen Düzlemi (Y = 0, X>=0, Z>=0)
          x = curR * cosT;
          y = 0;
          z = curR * sinT;
        } else if (planeAxis === 'YZ') {
          // 90° Doğu Meridyen Düzlemi (X = 0, Y>=0, Z>=0)
          x = 0;
          y = curR * cosT;
          z = curR * sinT;
        }

        positions.push(x, y, z);
        // UV eşleştirmesi: (0,0) merkezden dışa doğru (cosT, sinT)
        uvs.push(frac * cosT, frac * sinT);
      }
    }

    const stride = segments + 1;
    for (let rIdx = 0; rIdx < rings; rIdx++) {
      for (let sIdx = 0; sIdx < segments; sIdx++) {
        const a = rIdx * stride + sIdx;
        const b = a + 1;
        const c = (rIdx + 1) * stride + sIdx;
        const d = c + 1;

        indices.push(a, d, b);
        indices.push(a, c, d);
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setIndex(indices);
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geom.computeVertexNormals();
    return geom;
  }

  // ==========================================================================
  // 3. GERÇEKÇİ DÜNYA TEKSTÜRÜ (NASA Blue Marble + Çevrimdışı Yedek)
  // ==========================================================================
  function generateFallbackRealisticEarthCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Aydınlık ve Canlı Mavi Okyanus (Karanlık olmayan zengin mavi tonlar)
    const oceanGrad = ctx.createRadialGradient(w / 2, h / 2, 100, w / 2, h / 2, w * 0.6);
    oceanGrad.addColorStop(0, '#2980B9');
    oceanGrad.addColorStop(0.4, '#1F618D');
    oceanGrad.addColorStop(1, '#154360');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, w, h);

    function toX(lon) { return ((lon + 180) / 360) * w; }
    function toY(lat) { return ((90 - lat) / 180) * h; }

    // İnce Beyaz Gratikül (Enlem/Boylam Izgarası) - ECEF görünümünü zenginleştirir
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1.0;
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      ctx.moveTo(0, toY(lat));
      ctx.lineTo(w, toY(lat));
      ctx.stroke();
    }
    for (let lon = -180; lon <= 180; lon += 30) {
      ctx.beginPath();
      ctx.moveTo(toX(lon), 0);
      ctx.lineTo(toX(lon), h);
      ctx.stroke();
    }
    // Ekvator ve Greenwich vurgusu
    ctx.strokeStyle = 'rgba(255, 235, 59, 0.45)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(0, toY(0));
    ctx.lineTo(w, toY(0));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(toX(0), 0);
    ctx.lineTo(toX(0), h);
    ctx.stroke();

    function drawPoly(pts, color) {
      if (!pts || pts.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(toX(pts[0][0]), toY(pts[0][1]));
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(toX(pts[i][0]), toY(pts[i][1]));
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#285943';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Doğal Yeşillik ve Çöl Toprakları
    // Afrika
    drawPoly([
      [-17, 30], [-10, 35], [10, 37], [25, 32], [32, 30], [43, 12], [51, 12],
      [41, 0], [40, -10], [35, -25], [20, -35], [18, -34], [12, -18], [9, 4],
      [-5, 5], [-15, 12], [-17, 21]
    ], '#386641');
    // Sahra Çölü
    drawPoly([[-12, 28], [25, 28], [32, 22], [30, 16], [-5, 15]], '#D4A373');

    // Avrasya & Avrupa
    drawPoly([
      [-9, 36], [-9, 43], [-1, 46], [2, 51], [8, 54], [10, 58], [25, 71],
      [32, 70], [40, 65], [50, 60], [45, 45], [30, 45], [26, 40], [22, 38],
      [15, 40], [10, 38], [-4, 36]
    ], '#4A7C59');
    drawPoly([
      [35, 40], [45, 40], [55, 25], [60, 22], [70, 20], [77, 8], [82, 16],
      [90, 22], [100, 20], [104, 10], [108, 14], [115, 22], [120, 32],
      [125, 40], [130, 42], [140, 50], [150, 60], [170, 65], [180, 66],
      [180, 75], [100, 77], [80, 73], [60, 70], [50, 60], [45, 45]
    ], '#4F772D');

    // Amerika Kıtaları
    drawPoly([
      [-168, 65], [-160, 55], [-140, 60], [-130, 50], [-124, 38], [-117, 32],
      [-105, 20], [-97, 18], [-85, 22], [-81, 25], [-75, 35], [-70, 42],
      [-60, 47], [-65, 60], [-80, 62], [-95, 60], [-95, 70], [-120, 72]
    ], '#386641');
    drawPoly([
      [-80, 8], [-75, 11], [-60, 8], [-50, 0], [-35, -5], [-38, -15],
      [-45, -23], [-55, -35], [-65, -53], [-73, -50], [-75, -40], [-72, -20],
      [-80, -5], [-81, 4]
    ], '#2D6A4F');

    // Avustralya
    drawPoly([
      [114, -22], [125, -15], [136, -12], [142, -11], [153, -28], [150, -37],
      [138, -35], [130, -32], [116, -35], [113, -26]
    ], '#BC6C25');

    // Buzullar (Grönland & Antarktika)
    drawPoly([[-55, 60], [-40, 60], [-20, 75], [-30, 83], [-55, 80]], '#E9ECEF');
    drawPoly([[-180, -75], [180, -75], [180, -90], [-180, -90]], '#F8F9FA');

    // İnce Jeodezik Izgara (Meridyen & Paraleller)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1.2;
    for (let lat = -75; lat <= 75; lat += 15) {
      ctx.beginPath();
      ctx.moveTo(0, toY(lat));
      ctx.lineTo(w, toY(lat));
      ctx.stroke();
    }
    for (let lon = -180; lon < 180; lon += 15) {
      ctx.beginPath();
      ctx.moveTo(toX(lon), 0);
      ctx.lineTo(toX(lon), h);
      ctx.stroke();
    }

    // Ekvator (Sarımsı net hat)
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, toY(0));
    ctx.lineTo(w, toY(0));
    ctx.stroke();

    return canvas;
  }

  // ==========================================================================
  // 4. 3D METİN VE ETİKET ÜRETECİ
  // ==========================================================================
  function createTextSprite(text, options = {}) {
    const {
      fontSize = 24,
      fontFace = "'Plus Jakarta Sans', Arial, sans-serif",
      textColor = '#1A252C',
      backgroundColor = 'rgba(255, 255, 255, 0.95)',
      borderColor = '#C4A482',
      borderWidth = 2.0,
      borderRadius = 8,
      padding = { x: 14, y: 8 },
      scale = 0.50,
      align = 'center',
      fontWeight = 'bold'
    } = options;

    const dpr = 4;
    const lines = String(text).split('\n');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const scaledFont = `${fontWeight} ${fontSize * dpr}px ${fontFace}`;
    ctx.font = scaledFont;

    let maxTextWidth = 0;
    lines.forEach(l => {
      const w = ctx.measureText(l).width;
      if (w > maxTextWidth) maxTextWidth = w;
    });

    const lineHeight = (fontSize * dpr) * 1.30;
    const totalTextHeight = lines.length * lineHeight;
    const padX = padding.x * dpr;
    const padY = padding.y * dpr;
    const bWidth = borderWidth * dpr;
    const r = borderRadius * dpr;

    canvas.width = Math.ceil(maxTextWidth + padX * 2 + bWidth * 2);
    canvas.height = Math.ceil(totalTextHeight + padY * 2 + bWidth * 2);

    ctx.font = scaledFont;
    ctx.textBaseline = 'middle';

    if (backgroundColor && backgroundColor !== 'transparent') {
      ctx.fillStyle = backgroundColor;
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = bWidth;

      const x = bWidth / 2;
      const y = bWidth / 2;
      const w = canvas.width - bWidth;
      const h = canvas.height - bWidth;

      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();
      if (borderWidth > 0 && borderColor) ctx.stroke();
    }

    ctx.fillStyle = textColor;
    lines.forEach((l, i) => {
      let xPos = padX + bWidth;
      if (align === 'center') {
        const lw = ctx.measureText(l).width;
        xPos = (canvas.width - lw) / 2;
      }
      const yPos = padY + bWidth + (i + 0.5) * lineHeight;
      ctx.fillText(l, xPos, yPos);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(spriteMat);
    const aspect = canvas.width / canvas.height;
    sprite.scale.set(scale * aspect, scale, 1.0);
    sprite.renderOrder = 999;
    return sprite;
  }

  function createBlackAxisArrow(dir, origin, length, labelText, options = {}) {
    const group = new THREE.Group();
    const color = options.color || PALETTE.axisBlack;
    const headLength = length * 0.12;
    const headWidth = headLength * 0.42;

    const arrow = new THREE.ArrowHelper(dir.clone().normalize(), origin, length, color, headLength, headWidth);
    group.add(arrow);

    if (labelText) {
      const spritePos = origin.clone().add(dir.clone().normalize().multiplyScalar(length + 0.42));
      let badgeColor = options.badgeColor;
      if (!badgeColor) {
        if (labelText === 'X') badgeColor = '#C0392B';
        else if (labelText === 'Y') badgeColor = '#27AE60';
        else if (labelText === 'Z') badgeColor = '#2980B9';
        else badgeColor = '#1A252C';
      }
      const sprite = createTextSprite(labelText, {
        textColor: '#FFFFFF',
        backgroundColor: badgeColor,
        borderColor: '#FFFFFF',
        borderWidth: 2.2,
        fontSize: options.fontSize || 22,
        scale: options.scale || 0.52
      });
      sprite.position.copy(spritePos);
      group.add(sprite);
    }
    return group;
  }

  function createRightAngleMark(origin, dir1, dir2, size = 0.35) {
    const v1 = dir1.clone().normalize().multiplyScalar(size);
    const v2 = dir2.clone().normalize().multiplyScalar(size);
    const corner = v1.clone().add(v2);

    const pts = [
      origin.clone().add(v1),
      origin.clone().add(corner),
      origin.clone().add(v2)
    ];

    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color: 0x1A252C, linewidth: 2.5, depthTest: false });
    const line = new THREE.Line(geom, mat);
    line.renderOrder = 500;
    return line;
  }

  // 3D Uydu Modeli (ECEF)
  function createSatelliteMesh() {
    const group = new THREE.Group();

    // Uydu ana gövdesi
    const bodyGeom = new THREE.BoxGeometry(0.35, 0.35, 0.45);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xd4a038,
      emissive: 0x6b4c15,
      emissiveIntensity: 0.4,
      metalness: 0.3,
      roughness: 0.4
    });
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    group.add(body);

    const foilMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0x78350f,
      emissiveIntensity: 0.45,
      metalness: 0.35,
      roughness: 0.35,
      side: THREE.DoubleSide
    });
    const f1 = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.42), foilMat);
    f1.position.x = 0.178; f1.rotation.y = Math.PI / 2;
    group.add(f1);

    const f2 = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.42), foilMat);
    f2.position.x = -0.178; f2.rotation.y = -Math.PI / 2;
    group.add(f2);

    // Güneş paneli kanatları
    const panelGeom = new THREE.BoxGeometry(0.04, 0.8, 0.42);
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.35,
      metalness: 0.2,
      roughness: 0.5
    });
    const wingL = new THREE.Mesh(panelGeom, panelMat);
    wingL.position.set(0, 0.62, 0);
    group.add(wingL);

    const wingR = new THREE.Mesh(panelGeom, panelMat);
    wingR.position.set(0, -0.62, 0);
    group.add(wingR);

    const dishGeom = new THREE.SphereGeometry(0.22, 16, 8, 0, Math.PI * 2, 0, Math.PI / 3);
    const dishMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      emissive: 0x9E9E9E,
      emissiveIntensity: 0.2,
      metalness: 0.3,
      roughness: 0.4,
      side: THREE.DoubleSide
    });
    const dish = new THREE.Mesh(dishGeom, dishMat);
    dish.rotation.x = -Math.PI / 2;
    dish.position.set(0, 0, -0.28);
    group.add(dish);

    group.scale.set(0.9, 0.9, 0.9);
    return group;
  }

  // ==========================================================================
  // 5. TERRESTRIAL GEOCENTRIC CARTESIAN C.S. (DÜNYA KATMANLARI İLE)
  // ==========================================================================
  class GeocentricSystem {
    constructor(scene) {
      this.scene = scene;
      this.group = new THREE.Group();
      this.scene.add(this.group);

      this.earthRadius = 3.0;

      // Katman Tekstürleri
      this.eqLayersTexture = new THREE.CanvasTexture(generateEarthLayersTexture(true));
      this.eqLayersTexture.flipY = false;
      this.meridianLayersTexture = new THREE.CanvasTexture(generateEarthLayersTexture(false));
      this.meridianLayersTexture.flipY = false;

      // Dünya Ana Tekstürü (Önce zengin fallback, sonra NASA Blue Marble)
      this.earthTexture = new THREE.CanvasTexture(generateFallbackRealisticEarthCanvas());
      this.earthTexture.wrapS = THREE.RepeatWrapping;

      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');
      loader.load(
        'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_atmos_2048.jpg',
        (tex) => {
          tex.wrapS = THREE.RepeatWrapping;
          this.earthTexture = tex;
          this.update();
        },
        undefined,
        (err) => console.log('NASA texture fallback aktif.')
      );

      this.params = {
        satelliteLatDeg: 42,
        satelliteLonDeg: 48,
        satelliteHeight: 2.2,
        showOctantCut: true,
        showLayers: true,
        showSatellite: true,
        showEquatorLabel: true,
        showNorthPoleLabel: true
      };

      this.dynamicObjects = [];
      this.update();
    }

    setParams(p) {
      Object.assign(this.params, p);
      return this.update();
    }

    clearDynamic() {
      this.dynamicObjects.forEach(obj => {
        this.group.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
      });
      this.dynamicObjects = [];
    }

    update() {
      this.clearDynamic();

      const R = this.earthRadius;
      const latRad = THREE.MathUtils.degToRad(this.params.satelliteLatDeg);
      const lonRad = THREE.MathUtils.degToRad(this.params.satelliteLonDeg);
      const satR = R + this.params.satelliteHeight;

      // 1. DÜNYA KÜRESİ VE KATMAN KESİTİ
      if (this.params.showOctantCut) {
        // A) Güney Yarıküre (Tam Küre Yarısı: -180° ile +180° arası, lat: -90° ile 0°)
        const southGeom = this.createSphereSectorGeom(R, -Math.PI / 2, 0, -Math.PI, Math.PI);
        const southMesh = new THREE.Mesh(southGeom, new THREE.MeshStandardMaterial({
          map: this.earthTexture,
          roughness: 0.55,
          metalness: 0.1
        }));
        this.group.add(southMesh);
        this.dynamicObjects.push(southMesh);

        // B1) Kuzey Yarıküre - Batı Bölümü (180°W ile 0° Greenwich arası)
        const northWestGeom = this.createSphereSectorGeom(R, 0, Math.PI / 2, -Math.PI, 0);
        const northWestMesh = new THREE.Mesh(northWestGeom, new THREE.MeshStandardMaterial({
          map: this.earthTexture,
          roughness: 0.55,
          metalness: 0.1
        }));
        this.group.add(northWestMesh);
        this.dynamicObjects.push(northWestMesh);

        // B2) Kuzey Yarıküre - Doğu Bölümü (90°E ile 180°E arası)
        const northEastGeom = this.createSphereSectorGeom(R, 0, Math.PI / 2, Math.PI / 2, Math.PI);
        const northEastMesh = new THREE.Mesh(northEastGeom, new THREE.MeshStandardMaterial({
          map: this.earthTexture,
          roughness: 0.55,
          metalness: 0.1
        }));
        this.group.add(northEastMesh);
        this.dynamicObjects.push(northEastMesh);

        // C) KLASİK DÜNYA KATMANLARI VE İÇ ÇEKİRDEK
        if (this.params.showLayers) {
          const sliceMat = new THREE.MeshStandardMaterial({
            map: this.eqLayersTexture,
            roughness: 0.45,
            metalness: 0.12,
            side: THREE.DoubleSide
          });

          // 1. Ekvator Düzlemi Katman Kesiti (Z = 0)
          const eqSliceGeom = createCutSliceGeometry('XY', R);
          const eqSliceMesh = new THREE.Mesh(eqSliceGeom, sliceMat);
          this.group.add(eqSliceMesh);
          this.dynamicObjects.push(eqSliceMesh);

          // 2. Greenwich Meridyen Katman Kesiti (Y = 0)
          const gwSliceGeom = createCutSliceGeometry('XZ', R);
          const gwSliceMesh = new THREE.Mesh(gwSliceGeom, sliceMat);
          this.group.add(gwSliceMesh);
          this.dynamicObjects.push(gwSliceMesh);

          // 3. 90° Doğu Meridyen Katman Kesiti (X = 0)
          const e90SliceGeom = createCutSliceGeometry('YZ', R);
          const e90SliceMesh = new THREE.Mesh(e90SliceGeom, sliceMat);
          this.group.add(e90SliceMesh);
          this.dynamicObjects.push(e90SliceMesh);

          // 3D Volumetrik İç Çekirdek Küresi ve Akkor Işık
          const innerCoreR = R * 0.22;
          const coreGeom = new THREE.SphereGeometry(innerCoreR, 32, 24);
          const coreMat = new THREE.MeshStandardMaterial({
            color: PALETTE.innerCore,
            emissive: 0xF57F17,
            emissiveIntensity: 0.75,
            roughness: 0.2,
            metalness: 0.3
          });
          const coreMesh = new THREE.Mesh(coreGeom, coreMat);
          this.group.add(coreMesh);
          this.dynamicObjects.push(coreMesh);

          // İç çekirdekten magmaya yayılan sıcak ışık
          const coreLight = new THREE.PointLight(0xFFA000, 1.6, 5.0);
          coreLight.position.set(0, 0, 0);
          this.group.add(coreLight);
          this.dynamicObjects.push(coreLight);
        }

        // Ekvator ve Meridyen Dik Açı İşaretleri (∟)
        const markX = createRightAngleMark(new THREE.Vector3(R * 0.95, 0, 0), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 1, 0), 0.35);
        this.group.add(markX);
        this.dynamicObjects.push(markX);

        const markY = createRightAngleMark(new THREE.Vector3(0, R * 0.95, 0), new THREE.Vector3(0, -1, 0), new THREE.Vector3(1, 0, 0), 0.35);
        this.group.add(markY);
        this.dynamicObjects.push(markY);

        const markZ = createRightAngleMark(new THREE.Vector3(0, 0, R * 0.95), new THREE.Vector3(0, 0, -1), new THREE.Vector3(1, 0, 0), 0.35);
        this.group.add(markZ);
        this.dynamicObjects.push(markZ);

      } else {
        // Tam Küre Görünümü
        const fullGeom = new THREE.SphereGeometry(R, 64, 48);
        fullGeom.rotateX(Math.PI / 2);
        const fullMesh = new THREE.Mesh(fullGeom, new THREE.MeshStandardMaterial({
          map: this.earthTexture,
          roughness: 0.55,
          metalness: 0.1
        }));
        this.group.add(fullMesh);
        this.dynamicObjects.push(fullMesh);
      }

      // Atmosferik Işıma / Gökyüzü Halesi (Tam kürede dış halo olarak görünür)
      if (!this.params.showOctantCut) {
        const atmosGeom = new THREE.SphereGeometry(R * 1.025, 48, 36);
        const atmosMat = new THREE.MeshStandardMaterial({
          color: 0x81D4FA,
          transparent: true,
          opacity: 0.16,
          roughness: 0.2,
          metalness: 0.1,
          side: THREE.BackSide,
          depthWrite: false
        });
        const atmosMesh = new THREE.Mesh(atmosGeom, atmosMat);
        this.group.add(atmosMesh);
        this.dynamicObjects.push(atmosMesh);
      }

      // Ekvator ve Greenwich Referans Çemberleri (Z=0 ve Y=0 ince altın ve gök mavisi hatlar)
      if (this.params.showEquatorLabel) {
        const eqPts = [];
        const gwPts = [];
        for (let i = 0; i <= 64; i++) {
          const rad = (i / 64) * Math.PI * 2;
          eqPts.push(new THREE.Vector3((R + 0.005) * Math.cos(rad), (R + 0.005) * Math.sin(rad), 0));
          gwPts.push(new THREE.Vector3((R + 0.005) * Math.cos(rad), 0, (R + 0.005) * Math.sin(rad)));
        }
        const eqLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(eqPts), new THREE.LineBasicMaterial({ color: 0xF39C12, linewidth: 2.2 }));
        this.group.add(eqLine);
        this.dynamicObjects.push(eqLine);

        const gwLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(gwPts), new THREE.LineBasicMaterial({ color: 0x2980B9, linewidth: 1.8, transparent: true, opacity: 0.7 }));
        this.group.add(gwLine);
        this.dynamicObjects.push(gwLine);
      }

      // 2. KALIN SİYAH KOORDİNAT EKSENLERİ (X, Y, Z)
      const axisLen = R * 1.55;

      const axX = createBlackAxisArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), axisLen, "X", { scale: 0.44 });
      this.group.add(axX);
      this.dynamicObjects.push(axX);

      const axY = createBlackAxisArrow(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), axisLen, "Y", { scale: 0.44 });
      this.group.add(axY);
      this.dynamicObjects.push(axY);

      const axZ = createBlackAxisArrow(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), axisLen, "Z", { scale: 0.46 });
      this.group.add(axZ);
      this.dynamicObjects.push(axZ);

      // "North Pole" Oku ve Etiketi
      if (this.params.showNorthPoleLabel) {
        const polePos = new THREE.Vector3(0, 0, R);
        const poleLabelPos = new THREE.Vector3(0.5, 0.4, R + 0.6);

        const poleLineGeom = new THREE.BufferGeometry().setFromPoints([poleLabelPos, polePos]);
        const poleLine = new THREE.Line(poleLineGeom, new THREE.LineBasicMaterial({ color: 0x1A252C, linewidth: 2.5 }));
        this.group.add(poleLine);
        this.dynamicObjects.push(poleLine);

        const poleSprite = createTextSprite("North Pole", {
          textColor: '#FFFFFF',
          backgroundColor: '#1A252C',
          borderColor: '#FFFFFF',
          fontSize: 22,
          scale: 0.38
        });
        poleSprite.position.set(poleLabelPos.x + 0.4, poleLabelPos.y + 0.3, poleLabelPos.z + 0.1);
        this.group.add(poleSprite);
        this.dynamicObjects.push(poleSprite);
      }

      // 3. UYDU (SATELLITE) VE (X, Y, Z) VEKTÖRÜ
      const cosLat = Math.cos(latRad);
      const sinLat = Math.sin(latRad);
      const cosLon = Math.cos(lonRad);
      const sinLon = Math.sin(lonRad);

      const subpointPos = new THREE.Vector3(R * cosLat * cosLon, R * cosLat * sinLon, R * sinLat);
      const satPos = new THREE.Vector3(satR * cosLat * cosLon, satR * cosLat * sinLon, satR * sinLat);

      if (this.params.showSatellite) {
        // Kesikli İzdüşüm Çizgisi
        const dotPts = [new THREE.Vector3(0, 0, 0), subpointPos];
        const dotGeom = new THREE.BufferGeometry().setFromPoints(dotPts);
        const dotMat = new THREE.LineDashedMaterial({ color: 0x1A252C, dashSize: 0.18, gapSize: 0.1, linewidth: 2.5 });
        const dotLine = new THREE.LineSegments(dotGeom, dotMat);
        dotLine.computeLineDistances();
        this.group.add(dotLine);
        this.dynamicObjects.push(dotLine);

        // Alt-Nokta Halkası (Subpoint)
        const ringGeom = new THREE.RingGeometry(0.08, 0.13, 24);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x1A252C, side: THREE.DoubleSide });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.position.copy(subpointPos.clone().multiplyScalar(1.002));
        ringMesh.lookAt(subpointPos.clone().multiplyScalar(2));
        this.group.add(ringMesh);
        this.dynamicObjects.push(ringMesh);

        // Uydudan Alt-Noktaya Düz Siyah Çizgi
        const solidLineGeom = new THREE.BufferGeometry().setFromPoints([subpointPos, satPos]);
        const solidLine = new THREE.Line(solidLineGeom, new THREE.LineBasicMaterial({ color: 0x1A252C, linewidth: 3 }));
        this.group.add(solidLine);
        this.dynamicObjects.push(solidLine);

        // Yükseklik (h) etiketi
        const hMid = subpointPos.clone().lerp(satPos, 0.5).add(new THREE.Vector3(-0.25, 0.25, 0.15));
        const hSprite = createTextSprite(`h = ${this.params.satelliteHeight.toFixed(2)}`, {
          textColor: '#1A252C',
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          borderColor: '#78909C',
          borderWidth: 1.5,
          borderRadius: 7,
          padding: { x: 8, y: 4 },
          fontSize: 14,
          scale: 0.34,
          fontWeight: 'bold'
        });
        hSprite.position.copy(hMid);
        this.group.add(hSprite);
        this.dynamicObjects.push(hSprite);

        // Boylam (λ) açısı ve meridyen taban çizgisi
        const uMeridian = new THREE.Vector3(cosLon, sinLon, 0);

        const basePts = [
          new THREE.Vector3(0, 0, 0.015),
          new THREE.Vector3(R * cosLon, R * sinLon, 0.015)
        ];
        const baseGeom = new THREE.BufferGeometry().setFromPoints(basePts);
        const baseMat = new THREE.LineDashedMaterial({
          color: 0xE67E22,
          dashSize: 0.16,
          gapSize: 0.1,
          linewidth: 2.2,
          depthTest: false
        });
        const baseLine = new THREE.Line(baseGeom, baseMat);
        baseLine.computeLineDistances();
        this.group.add(baseLine);
        this.dynamicObjects.push(baseLine);

        const lonWedge = createAzimuthWedge(
          new THREE.Vector3(1, 0, 0),
          new THREE.Vector3(0, 1, 0),
          this.params.satelliteLonDeg,
          1.65,
          null,
          0xE67E22
        );
        lonWedge.position.z = 0.015;
        lonWedge.traverse(child => {
          if (child.material) child.material.depthTest = false;
        });
        this.group.add(lonWedge);
        this.dynamicObjects.push(lonWedge);

        // Boylam (λ) rozeti
        const midLon = lonRad * 0.52;
        const lonSprite = createTextSprite(`λ = ${this.params.satelliteLonDeg.toFixed(0)}°`, {
          textColor: '#D35400',
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          borderColor: '#F39C12',
          borderWidth: 1.5,
          borderRadius: 7,
          padding: { x: 8, y: 4 },
          fontSize: 14,
          scale: 0.34,
          fontWeight: 'bold'
        });
        lonSprite.position.set(
          1.65 * 1.18 * Math.cos(midLon),
          1.65 * 1.18 * Math.sin(midLon),
          0.03
        );
        this.group.add(lonSprite);
        this.dynamicObjects.push(lonSprite);

        // Enlem (φ) açısı ve yüzey meridyen yayı
        const latWedge = createElevationWedge(
          uMeridian,
          new THREE.Vector3(0, 0, 1),
          this.params.satelliteLatDeg,
          2.05,
          null,
          0x2980B9
        );
        latWedge.traverse(child => {
          if (child.material) child.material.depthTest = false;
        });
        this.group.add(latWedge);
        this.dynamicObjects.push(latWedge);

        // Enlem (φ) rozeti
        const midLat = latRad * 0.52;
        const latBadgePos = uMeridian.clone().multiplyScalar(Math.cos(midLat))
          .add(new THREE.Vector3(0, 0, 1).multiplyScalar(Math.sin(midLat)))
          .multiplyScalar(2.05 * 1.18);

        const latSprite = createTextSprite(`φ = ${this.params.satelliteLatDeg.toFixed(0)}°`, {
          textColor: '#1565C0',
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          borderColor: '#42A5F5',
          borderWidth: 1.5,
          borderRadius: 7,
          padding: { x: 8, y: 4 },
          fontSize: 14,
          scale: 0.34,
          fontWeight: 'bold'
        });
        latSprite.position.copy(latBadgePos);
        this.group.add(latSprite);
        this.dynamicObjects.push(latSprite);

        // Yüzey meridyen yayı (Ekvatordan alt-noktaya)
        const arcPts = [];
        const arcSegments = 24;
        for (let i = 0; i <= arcSegments; i++) {
          const frac = i / arcSegments;
          const curLat = frac * latRad;
          const rArc = R + 0.008;
          arcPts.push(new THREE.Vector3(
            rArc * Math.cos(curLat) * cosLon,
            rArc * Math.cos(curLat) * sinLon,
            rArc * Math.sin(curLat)
          ));
        }
        const arcGeom = new THREE.BufferGeometry().setFromPoints(arcPts);
        const arcMat = new THREE.LineDashedMaterial({
          color: 0x2980B9,
          dashSize: 0.14,
          gapSize: 0.09,
          linewidth: 2,
          depthTest: false
        });
        const arcLine = new THREE.Line(arcGeom, arcMat);
        arcLine.computeLineDistances();
        this.group.add(arcLine);
        this.dynamicObjects.push(arcLine);

        // 3D Uydu Modeli
        const satMesh = createSatelliteMesh();
        satMesh.position.copy(satPos);
        satMesh.lookAt(subpointPos);
        this.group.add(satMesh);
        this.dynamicObjects.push(satMesh);

        // "(X, Y, Z)" Etiketi
        const satLabel = createTextSprite("(X, Y, Z)", {
          textColor: '#1A252C',
          backgroundColor: '#FFFFFF',
          borderColor: '#1A252C',
          borderWidth: 2,
          fontSize: 26,
          scale: 0.42
        });
        satLabel.position.copy(satPos.clone().add(new THREE.Vector3(0.3, 0.3, 0.4)));
        this.group.add(satLabel);
        this.dynamicObjects.push(satLabel);
      }

      return {
        X: satPos.x,
        Y: satPos.y,
        Z: satPos.z,
        latDeg: this.params.satelliteLatDeg,
        lonDeg: this.params.satelliteLonDeg,
        h: this.params.satelliteHeight
      };
    }

    createSphereSectorGeom(R, latMin, latMax, lonMin, lonMax) {
      const latSegments = 32;
      const lonSegments = 48;
      const positions = [];
      const uvs = [];
      const indices = [];

      for (let j = 0; j <= latSegments; j++) {
        const v = j / latSegments;
        const lat = latMin + v * (latMax - latMin);
        const cosLat = Math.cos(lat);
        const sinLat = Math.sin(lat);

        for (let i = 0; i <= lonSegments; i++) {
          const u = i / lonSegments;
          const lon = lonMin + u * (lonMax - lonMin);
          const cosLon = Math.cos(lon);
          const sinLon = Math.sin(lon);

          positions.push(R * cosLat * cosLon, R * cosLat * sinLon, R * sinLat);
          uvs.push((lon + Math.PI) / (2 * Math.PI), (lat + Math.PI / 2) / Math.PI);
        }
      }

      for (let j = 0; j < latSegments; j++) {
        for (let i = 0; i < lonSegments; i++) {
          const a = j * (lonSegments + 1) + i;
          const b = a + 1;
          const c = (j + 1) * (lonSegments + 1) + i;
          const d = c + 1;
          indices.push(a, b, d);
          indices.push(a, d, c);
        }
      }

      const geom = new THREE.BufferGeometry();
      geom.setIndex(indices);
      geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geom.computeVertexNormals();
      return geom;
    }
  }

  // ==========================================================================
  // 5b. TOPOSANTRİK YARDIMCI GÖRSEL ÜRETEÇLERİ (L.A.S. & L.G.S.)
  // ==========================================================================

  // 1. Jeolojik Kayaç Katmanları Tekstürü (L.A.S. Yer Altı Kesiti İçin)
  function generateGeologicalStrataCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const w = 1024, h = 512;

    // A) Üst Toprak / Humus Katmanı (y: 0 - 65)
    const topsoilGrad = ctx.createLinearGradient(0, 0, 0, 65);
    topsoilGrad.addColorStop(0, '#26170E');
    topsoilGrad.addColorStop(0.5, '#3E2723');
    topsoilGrad.addColorStop(1, '#4E342E');
    ctx.fillStyle = topsoilGrad;
    ctx.fillRect(0, 0, w, 65);

    // İnce organik kök ve mineral çizgileri
    ctx.strokeStyle = 'rgba(141, 110, 99, 0.45)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 45; i++) {
      const rx = (i / 45) * w + (Math.sin(i * 1.5) * 8);
      ctx.beginPath();
      ctx.moveTo(rx, 0);
      ctx.lineTo(rx + Math.sin(i * 2.3) * 15, 55);
      ctx.stroke();
    }

    // B) Ayrışmış Kumtaşı / Tortul Katman (y: 65 - 190)
    const sandGrad = ctx.createLinearGradient(0, 65, 0, 190);
    sandGrad.addColorStop(0, '#8D6E63');
    sandGrad.addColorStop(0.5, '#A1887F');
    sandGrad.addColorStop(1, '#795548');
    ctx.fillStyle = sandGrad;
    ctx.fillRect(0, 65, w, 125);

    // İnce sedimanter tabaka çizgileri (Wavy Strata)
    ctx.lineWidth = 2.0;
    for (let y = 75; y < 185; y += 14) {
      ctx.strokeStyle = y % 28 === 0 ? 'rgba(78, 52, 46, 0.65)' : 'rgba(215, 204, 200, 0.45)';
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= w; x += 32) {
        const dy = Math.sin((x + y * 5) * 0.02) * 4.5 + Math.cos(x * 0.04) * 2.0;
        ctx.lineTo(x, y + dy);
      }
      ctx.stroke();
    }

    // C) Kireçtaşı ve Sıkışmış Kil Katmanı (y: 190 - 325)
    const limeGrad = ctx.createLinearGradient(0, 190, 0, 325);
    limeGrad.addColorStop(0, '#5D4037');
    limeGrad.addColorStop(0.5, '#6D4C41');
    limeGrad.addColorStop(1, '#4E342E');
    ctx.fillStyle = limeGrad;
    ctx.fillRect(0, 190, w, 135);

    for (let y = 205; y < 320; y += 18) {
      ctx.strokeStyle = 'rgba(188, 170, 164, 0.35)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= w; x += 40) {
        const dy = Math.sin((x + y * 3) * 0.015) * 5.0;
        ctx.lineTo(x, y + dy);
      }
      ctx.stroke();
    }

    // D) Derin Kristalin Temel Kayaç / Magmatik Bazalt (y: 325 - 512)
    const deepGrad = ctx.createLinearGradient(0, 325, 0, 512);
    deepGrad.addColorStop(0, '#2E383F');
    deepGrad.addColorStop(0.6, '#21272B');
    deepGrad.addColorStop(1, '#1A1F23');
    ctx.fillStyle = deepGrad;
    ctx.fillRect(0, 325, w, 187);

    // Magmatik mineral benekleri
    for (let i = 0; i < 400; i++) {
      const px = Math.random() * w;
      const py = 330 + Math.random() * 175;
      const r = Math.random() * 2.2 + 0.8;
      ctx.fillStyle = Math.random() > 0.4 ? 'rgba(144, 164, 174, 0.35)' : 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }

    return canvas;
  }

  // 2. Doğal Topoğrafya & Çim/Kaya Yüzey Tekstürü (L.A.S. Üst Yüzeyi İçin)
  function generateTerrainTextureCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    const w = 1024, h = 1024;

    // Temel zeytin yeşili ve dağ çayırı tonları
    const baseGrad = ctx.createRadialGradient(w/2, h/2, 50, w/2, h/2, w/2);
    baseGrad.addColorStop(0, '#6B8E23');
    baseGrad.addColorStop(0.4, '#556B2F');
    baseGrad.addColorStop(0.8, '#4E5D2A');
    baseGrad.addColorStop(1, '#3E4B22');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, w, h);

    // Organik toprak ve kaya dokusu benekleri
    for (let i = 0; i < 2500; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const dist = Math.hypot(x - w/2, y - h/2);
      if (dist > w/2) continue;

      const r = Math.random() * 2.8 + 1.0;
      const val = Math.random();
      if (val < 0.45) {
        ctx.fillStyle = 'rgba(110, 83, 52, 0.40)'; // Toprak kahvesi
      } else if (val < 0.75) {
        ctx.fillStyle = 'rgba(70, 97, 41, 0.50)';  // Yosun yeşili
      } else {
        ctx.fillStyle = 'rgba(140, 130, 106, 0.35)'; // Kayaç gri
      }
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    return canvas;
  }

  // 3. Gerçekçi Mavi Bilye / Dünya Referans Elipsoidi Tekstürü (L.G.S. İçin)
  function generateEllipsoidGlobeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    const w = 2048, h = 1024;

    // A) Okyanus Tabanı Gradyanı (Zengin Mavi)
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, h);
    oceanGrad.addColorStop(0, '#1565C0');
    oceanGrad.addColorStop(0.5, '#1E88E5');
    oceanGrad.addColorStop(1, '#0D47A1');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, w, h);

    // B) Gerçekçi Kıta Silüetleri (Yeşil ve Altın Toprak)
    ctx.fillStyle = '#2E7D32';

    // Avrasya ve Afrika
    ctx.beginPath();
    ctx.ellipse(w * 0.58, h * 0.35, 360, 180, 0.15, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(w * 0.52, h * 0.60, 180, 220, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // Kuzey ve Güney Amerika
    ctx.beginPath();
    ctx.ellipse(w * 0.24, h * 0.32, 240, 160, -0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(w * 0.28, h * 0.68, 140, 200, 0.25, 0, Math.PI * 2);
    ctx.fill();

    // Avustralya
    ctx.beginPath();
    ctx.ellipse(w * 0.82, h * 0.70, 120, 90, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Kıta içleri topoğrafik ton varyasyonu
    ctx.fillStyle = 'rgba(104, 159, 56, 0.45)';
    ctx.beginPath();
    ctx.ellipse(w * 0.56, h * 0.33, 280, 120, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(w * 0.25, h * 0.34, 180, 110, -0.15, 0, Math.PI * 2);
    ctx.fill();

    // C) Beyaz Koordinat Meridyen ve Paralel Ağları (Graticule Grid)
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';

    // Paraleller (Her 15 derecede bir)
    for (let lat = -75; lat <= 75; lat += 15) {
      const y = ((90 - lat) / 180) * h;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Meridyenler (Her 15 derecede bir)
    for (let lon = -180; lon < 180; lon += 15) {
      const x = ((lon + 180) / 360) * w;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Ekvator ve Başlangıç Meridyeni (Daha belirgin)
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.stroke();

    return canvas;
  }

  // Kalın ve Pürüzsüz 3D Katı Ok (Smooth Thick 3D Solid Arrow)
  function createSmoothThickArrow(origin, dir, length, colorHex, shaftRadius = 0.038, headRadius = 0.12, headLength = 0.35) {
    const group = new THREE.Group();
    const uDir = dir.clone().normalize();
    const sLen = Math.max(0.1, length - headLength);

    const shaftGeom = new THREE.CylinderGeometry(shaftRadius, shaftRadius, sLen, 16);
    const mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.35,
      metalness: 0.25
    });
    const shaft = new THREE.Mesh(shaftGeom, mat);
    shaft.position.set(0, sLen / 2, 0);

    const headGeom = new THREE.ConeGeometry(headRadius, headLength, 16);
    const head = new THREE.Mesh(headGeom, mat);
    head.position.set(0, sLen + headLength / 2, 0);

    const arrowSub = new THREE.Group();
    arrowSub.add(shaft);
    arrowSub.add(head);

    arrowSub.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), uDir);
    arrowSub.position.copy(origin);
    group.add(arrowSub);

    return group;
  }

  // Kalın ve Belirgin Kesikli 3D Ok (Thick Dashed 3D Arrow)
  function createDashedThickArrow(origin, dir, length, colorHex, shaftRadius = 0.032, headRadius = 0.11, headLength = 0.32) {
    const group = new THREE.Group();
    const uDir = dir.clone().normalize();
    const sLen = Math.max(0.1, length - headLength);

    const mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.35,
      metalness: 0.25
    });

    const segLen = 0.16;
    const gapLen = 0.12;
    const step = segLen + gapLen;
    const segCount = Math.floor(sLen / step);
    const segGeom = new THREE.CylinderGeometry(shaftRadius, shaftRadius, segLen, 12);

    for (let i = 0; i < segCount; i++) {
      const dist = i * step + segLen / 2;
      if (dist + segLen / 2 > sLen) break;
      const segMesh = new THREE.Mesh(segGeom, mat);
      segMesh.position.set(0, dist, 0);
      const sub = new THREE.Group();
      sub.add(segMesh);
      sub.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), uDir);
      sub.position.copy(origin);
      group.add(sub);
    }

    const headGeom = new THREE.ConeGeometry(headRadius, headLength, 16);
    const head = new THREE.Mesh(headGeom, mat);
    head.position.set(0, sLen + headLength / 2, 0);

    const headSub = new THREE.Group();
    headSub.add(head);
    headSub.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), uDir);
    headSub.position.copy(origin);
    group.add(headSub);

    return group;
  }

  // 4. L.A.S. İÇİN 3D DOĞAL ENGEBELİ YERYÜZÜ & JEOİT DİLİMİ
  // (Organik tepeler, merkezde P zirvesi, z=0 seviyesinde kesen şeffaf disk)
  function createRuggedTerrainSlice(uX_LA, uY_LA, radius = 3.9, strataTexture, terrainTexture, showTerrain = true, showPlane = true) {
    const group = new THREE.Group();
    const sectors = 72;

    if (showTerrain) {
      // A) Üst 3D Engebeli Arazi Ağı (Procedural Rugged Terrain Mesh)
      const rings = 40;
      const positions = [];
      const uvs = [];
      const indices = [];

      for (let rIdx = 0; rIdx <= rings; rIdx++) {
        const frac = rIdx / rings;
        const curR = radius * frac;

        for (let sIdx = 0; sIdx <= sectors; sIdx++) {
          const theta = (sIdx / sectors) * Math.PI * 2;
          const cosT = Math.cos(theta);
          const sinT = Math.sin(theta);

          const x = curR * cosT;
          const y = curR * sinT;

          // Yükseklik Fonksiyonu: Merkezde z = 0 zirvesi
          let z = 0;
          if (rIdx === 0) {
            z = 0.0;
          } else {
            const falloff = -0.32 * Math.pow(frac, 1.4);
            const undulation = (Math.sin(x * 1.5 + 0.3) * Math.cos(y * 1.6 - 0.2) * 0.24 +
                                Math.sin(x * 2.7 - y * 1.5) * 0.12 +
                                Math.cos(y * 2.9 + x * 0.8) * 0.08) * Math.sin(frac * Math.PI);
            z = falloff + undulation;
          }

          const pt = uX_LA.clone().multiplyScalar(x).add(uY_LA.clone().multiplyScalar(y)).add(new THREE.Vector3(0, 0, z));
          positions.push(pt.x, pt.y, pt.z);
          uvs.push(0.5 + 0.5 * cosT * frac, 0.5 + 0.5 * sinT * frac);
        }
      }

      const stride = sectors + 1;
      for (let rIdx = 0; rIdx < rings; rIdx++) {
        for (let sIdx = 0; sIdx < sectors; sIdx++) {
          const a = rIdx * stride + sIdx;
          const b = a + 1;
          const c = (rIdx + 1) * stride + sIdx;
          const d = c + 1;
          indices.push(a, b, d);
          indices.push(a, d, c);
        }
      }

      const terrainGeom = new THREE.BufferGeometry();
      terrainGeom.setIndex(indices);
      terrainGeom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      terrainGeom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      terrainGeom.computeVertexNormals();

      const terrainMat = new THREE.MeshStandardMaterial({
        map: terrainTexture,
        roughness: 0.85,
        metalness: 0.08,
        flatShading: false
      });
      const terrainMesh = new THREE.Mesh(terrainGeom, terrainMat);
      group.add(terrainMesh);

      // B) Yeraltı Jeolojik Kayaç Kesiti (Cylindrical Strata Side Wall)
      const depth = 1.65;
      const sidePositions = [];
      const sideUvs = [];
      const sideIndices = [];

      for (let sIdx = 0; sIdx <= sectors; sIdx++) {
        const theta = (sIdx / sectors) * Math.PI * 2;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        const x = radius * cosT;
        const y = radius * sinT;

        const rimZ = -0.32 + (Math.sin(x * 1.5 + 0.3) * Math.cos(y * 1.6 - 0.2) * 0.24) * 0.15;

        const topPt = uX_LA.clone().multiplyScalar(x).add(uY_LA.clone().multiplyScalar(y)).add(new THREE.Vector3(0, 0, rimZ));
        const botPt = uX_LA.clone().multiplyScalar(x).add(uY_LA.clone().multiplyScalar(y)).add(new THREE.Vector3(0, 0, -depth));

        sidePositions.push(topPt.x, topPt.y, topPt.z);
        sideUvs.push(sIdx / sectors, 0);

        sidePositions.push(botPt.x, botPt.y, botPt.z);
        sideUvs.push(sIdx / sectors, 1);
      }

      for (let sIdx = 0; sIdx < sectors; sIdx++) {
        const top1 = sIdx * 2;
        const bot1 = top1 + 1;
        const top2 = (sIdx + 1) * 2;
        const bot2 = top2 + 1;
        sideIndices.push(top1, top2, bot2);
        sideIndices.push(top1, bot2, bot1);
      }

      const sideGeom = new THREE.BufferGeometry();
      sideGeom.setIndex(sideIndices);
      sideGeom.setAttribute('position', new THREE.Float32BufferAttribute(sidePositions, 3));
      sideGeom.setAttribute('uv', new THREE.Float32BufferAttribute(sideUvs, 2));
      sideGeom.computeVertexNormals();

      const sideMat = new THREE.MeshStandardMaterial({
        map: strataTexture,
        roughness: 0.90,
        metalness: 0.05,
        side: THREE.DoubleSide
      });
      const sideMesh = new THREE.Mesh(sideGeom, sideMat);
      group.add(sideMesh);

      // C) Alt Taban Kapağı (Granite Bedrock Cap at z = -depth)
      const capGeom = new THREE.CircleGeometry(radius, sectors);
      const capMat = new THREE.MeshStandardMaterial({ color: 0x1A2024, roughness: 0.95 });
      const capMesh = new THREE.Mesh(capGeom, capMat);
      capMesh.position.set(0, 0, -depth);
      group.add(capMesh);
    }

    // D) z = 0 Seviyesinde Şeffaf Yatay Düzlem (Local Horizon Disc)
    if (showPlane) {
      const discRadius = radius * 1.05;
      const discGeom = new THREE.CircleGeometry(discRadius, sectors);
      const discMat = new THREE.MeshBasicMaterial({
        color: 0x8DA494,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const discMesh = new THREE.Mesh(discGeom, discMat);
      discMesh.position.set(0, 0, 0);
      group.add(discMesh);

      // Şeffaf diskin dairesel dış sınırı
      const rimPoints = [];
      for (let i = 0; i <= sectors; i++) {
        const a = (i / sectors) * Math.PI * 2;
        rimPoints.push(new THREE.Vector3(Math.cos(a) * discRadius, Math.sin(a) * discRadius, 0.005));
      }
      const rimLineGeom = new THREE.BufferGeometry().setFromPoints(rimPoints);
      const rimLine = new THREE.Line(rimLineGeom, new THREE.LineBasicMaterial({ color: 0x37474F, linewidth: 2 }));
      group.add(rimLine);
    }

    return group;
  }

  // 5. L.G.S. İÇİN 3D REFERANS ELİPSOİDİ KÜRESİ VE TANJANT DÜZLEMİ
  function createReferenceEllipsoidAndTangentPlane(uX_LG, uY_LG, globeTexture, showEllipsoid = true, showPlane = true) {
    const group = new THREE.Group();

    // A) Büyük Referans Elipsoidi Kubbesi (Large Earth Sphere Dome)
    if (showEllipsoid) {
      const globeRadius = 5.40;
      const sphereGeom = new THREE.SphereGeometry(globeRadius, 64, 48);
      sphereGeom.scale(1.0, 1.0, 0.985);

      const sphereMat = new THREE.MeshStandardMaterial({
        map: globeTexture,
        roughness: 0.65,
        metalness: 0.12
      });
      const globeMesh = new THREE.Mesh(sphereGeom, sphereMat);
      globeMesh.position.set(0, 0, -globeRadius * 0.985);
      globeMesh.rotation.z = Math.PI * 0.72;
      group.add(globeMesh);
    }

    // B) Genişletilmiş Tanjant Düzlemi (9.2 x 9.2: İzdüşümün her zaman içinde kalması için)
    if (showPlane) {
      const planeSize = 9.2;
      const planeGeom = new THREE.PlaneGeometry(planeSize, planeSize);
      const planeMat = new THREE.MeshStandardMaterial({
        color: 0xF7F3E9,
        transparent: true,
        opacity: 0.36,
        side: THREE.DoubleSide,
        roughness: 0.5,
        depthWrite: false
      });
      const planeMesh = new THREE.Mesh(planeGeom, planeMat);
      planeMesh.position.set(0, 0, 0.002);
      group.add(planeMesh);

      // Tanjant düzleminin koyu kahverengi dış sınır çizgisi
      const half = planeSize / 2;
      const borderPoints = [
        new THREE.Vector3(-half, -half, 0.005),
        new THREE.Vector3(half, -half, 0.005),
        new THREE.Vector3(half, half, 0.005),
        new THREE.Vector3(-half, half, 0.005),
        new THREE.Vector3(-half, -half, 0.005)
      ];
      const borderGeom = new THREE.BufferGeometry().setFromPoints(borderPoints);
      const borderLine = new THREE.Line(borderGeom, new THREE.LineBasicMaterial({ color: 0x5D4037, linewidth: 2.2 }));
      group.add(borderLine);
    }

    // C) Station Point P Rozeti (Kompakt, Net ve Sol-Öne Ofsetli)
    const pSprite = createTextSprite("Station Point P", {
      textColor: '#FFFFFF',
      backgroundColor: '#26170E',
      borderColor: '#D7CCC8',
      borderWidth: 1.5,
      borderRadius: 7,
      padding: { x: 9, y: 5 },
      fontSize: 14,
      scale: 0.35,
      fontWeight: 'bold'
    });
    pSprite.position.set(-0.65, -0.65, 0.12);
    group.add(pSprite);

    // Kılavuz işaret çizgisi (P noktasından rozete)
    const pLineGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0.01),
      new THREE.Vector3(-0.42, -0.42, 0.08)
    ]);
    const pLine = new THREE.Line(pLineGeom, new THREE.LineBasicMaterial({ color: 0x5D4037, transparent: true, opacity: 0.6 }));
    group.add(pLine);

    // Zemin Nirengi / İstasyon Noktası P(0,0,0) Anıt Pulu
    const monumentGeom = new THREE.CylinderGeometry(0.045, 0.045, 0.01, 16);
    const monumentMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.8, roughness: 0.3 });
    const monument = new THREE.Mesh(monumentGeom, monumentMat);
    monument.position.set(0, 0, 0.005);
    monument.rotation.x = Math.PI / 2;
    group.add(monument);

    return group;
  }

  // 6. TEODOLİT MODELİ (L.A.S.)
  function createProminentTheodolite(targetDir, uZ) {
    const group = new THREE.Group();

    const zHead = 0.58;       // Teodolit başlığı z = +0.58 yüksekliğinde açık havada
    const legRadius = 0.44;   // Üçayak bacaklarının zemine (z=0) oturduğu yarıçap

    // Ahşap / Sarı Jeodezik Üçayak Bacakları
    const legMat = new THREE.MeshStandardMaterial({ color: 0xC88A4B, roughness: 0.45, metalness: 0.25 });
    const metalTrimMat = new THREE.MeshStandardMaterial({ color: 0x37474F, metalness: 0.85, roughness: 0.25 });

    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 + Math.PI / 6;
      const footX = Math.cos(angle) * legRadius;
      const footY = Math.sin(angle) * legRadius;
      const topX = Math.cos(angle) * 0.07;
      const topY = Math.sin(angle) * 0.07;

      const topPt = new THREE.Vector3(topX, topY, zHead - 0.03);
      const footPt = new THREE.Vector3(footX, footY, 0.0);
      const midPt = topPt.clone().add(footPt).multiplyScalar(0.5);
      const legVec = footPt.clone().sub(topPt);
      const legLen = legVec.length();

      const legMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.024, legLen, 12), legMat);
      legMesh.position.copy(midPt);
      legMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), legVec.clone().normalize());
      group.add(legMesh);

      // Üçayak zemin pabuçları
      const shoeMesh = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.05, 8), metalTrimMat);
      shoeMesh.position.set(footX, footY, 0.02);
      shoeMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, -1));
      group.add(shoeMesh);

      // Üst bağlantı menteşesi
      const hingeMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.03, 8), metalTrimMat);
      hingeMesh.position.copy(topPt);
      hingeMesh.rotation.x = Math.PI / 2;
      group.add(hingeMesh);
    }

    // Zemin Nirengi / İstasyon Noktası P(0,0,0) Anıtı
    const monumentGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.012, 16);
    const monumentMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.8, roughness: 0.3 });
    const monument = new THREE.Mesh(monumentGeom, monumentMat);
    monument.position.set(0, 0, 0.006);
    monument.rotation.x = Math.PI / 2;
    group.add(monument);

    const centerPin = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), new THREE.MeshBasicMaterial({ color: 0x1A252C }));
    centerPin.position.set(0, 0, 0.012);
    group.add(centerPin);

    // Pirinç Tesviye Başlığı (Tribrach Base)
    const tribrachGeom = new THREE.CylinderGeometry(0.09, 0.08, 0.04, 16);
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, roughness: 0.25, metalness: 0.85 });
    const tribrach = new THREE.Mesh(tribrachGeom, brassMat);
    tribrach.position.set(0, 0, zHead);
    tribrach.rotation.x = Math.PI / 2;
    group.add(tribrach);

    // Yatay Açı Tablası (Horizontal Graduated Circle)
    const circleGeom = new THREE.CylinderGeometry(0.095, 0.095, 0.018, 24);
    const circle = new THREE.Mesh(circleGeom, brassMat);
    circle.position.set(0, 0, zHead + 0.03);
    circle.rotation.x = Math.PI / 2;
    group.add(circle);

    // Teodolit Gövdesi (Turkuaz Jeodezik Alidade Gövde)
    const bodyGeom = new THREE.CylinderGeometry(0.06, 0.07, 0.13, 16);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x00838F, roughness: 0.35, metalness: 0.45 });
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.set(0, 0, zHead + 0.10);
    body.rotation.x = Math.PI / 2;
    group.add(body);

    // Teodolit Dürbünü (Telescope Barrel - Hedefe Yönlendirilmiş)
    const scopeGeom = new THREE.CylinderGeometry(0.024, 0.028, 0.32, 16);
    const scopeMat = new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.3, metalness: 0.75 });
    const scope = new THREE.Mesh(scopeGeom, scopeMat);
    scope.position.set(0, 0, zHead + 0.16);

    if (targetDir && targetDir.lengthSq() > 0.001) {
      const aim = targetDir.clone().normalize();
      scope.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), aim);
    } else {
      scope.rotation.x = Math.PI / 4;
    }
    group.add(scope);

    // Station Point P etiketi
    const pBadge = createTextSprite("Station Point P", {
      textColor: '#FFFFFF',
      backgroundColor: '#3E2723',
      borderColor: '#BCAAA4',
      borderWidth: 1.5,
      borderRadius: 7,
      padding: { x: 9, y: 5 },
      fontSize: 14,
      scale: 0.35,
      fontWeight: 'bold'
    });
    pBadge.position.set(-0.65, -0.65, 0.12);
    group.add(pBadge);

    // P noktasından rozete uzanan şık ince kılavuz çizgi
    const pointerGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0.01),
      new THREE.Vector3(-0.42, -0.42, 0.08)
    ]);
    const pointerLine = new THREE.Line(pointerGeom, new THREE.LineBasicMaterial({ color: 0x5D4037, transparent: true, opacity: 0.6 }));
    group.add(pointerLine);

    return group;
  }

  // 7. ŞAKÜL (PLUMB BOB) MODELİ
  // Teodolit başlığından (z = +0.55) üçayak bacaklarının arasındaki AÇIK HAVADA aşağı sarkar
  // ve sivri iğne ucu tam olarak zemin nirengi noktası P(0,0,0)'a yönelir.
  function createHangingPlumbBob(attachPoint = new THREE.Vector3(0, 0, 0.55), tipZ = 0.02) {
    const group = new THREE.Group();

    const bobTopZ = 0.22; // Şakül ağırlığının üst seviyesi
    const bobConeTopZ = 0.13; // Koniye geçiş seviyesi

    // 1) Kesikli Asılı Çekül İpi (Dashed Cord) - Teodolit altından şakülün tepesine
    const lineMat = new THREE.LineDashedMaterial({
      color: 0x1A1A1A,
      dashSize: 0.04,
      gapSize: 0.025,
      linewidth: 2.5,
      depthTest: false
    });
    const cordGeom = new THREE.BufferGeometry().setFromPoints([
      attachPoint,
      new THREE.Vector3(0, 0, bobTopZ + 0.04)
    ]);
    const cord = new THREE.Line(cordGeom, lineMat);
    cord.computeLineDistances();
    cord.renderOrder = 200;
    group.add(cord);

    // 2) Şakül gövde materyali
    const bobMat = new THREE.MeshStandardMaterial({
      color: 0xFFD54F,
      emissive: 0xB8860B,
      emissiveIntensity: 0.40,
      metalness: 0.85,
      roughness: 0.20,
      depthTest: false
    });

    // Askı Halkası (Eyelet Ring)
    const ringGeom = new THREE.TorusGeometry(0.020, 0.005, 8, 16);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xFFD54F, emissive: 0xB8860B, emissiveIntensity: 0.35, depthTest: false });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.position.set(0, 0, bobTopZ + 0.035);
    ring.rotation.y = Math.PI / 4;
    ring.renderOrder = 201;
    group.add(ring);

    // Üst Kapak (Upper Cap)
    const capGeom = new THREE.CylinderGeometry(0.035, 0.052, 0.04, 16);
    const cap = new THREE.Mesh(capGeom, bobMat);
    cap.position.set(0, 0, bobTopZ);
    cap.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1));
    cap.renderOrder = 201;
    group.add(cap);

    // Silindirik Ana Gövde (Cylindrical Bob Body)
    const bodyH = bobTopZ - bobConeTopZ;
    const bodyGeom = new THREE.CylinderGeometry(0.052, 0.052, bodyH, 16);
    const body = new THREE.Mesh(bodyGeom, bobMat);
    body.position.set(0, 0, (bobTopZ + bobConeTopZ) / 2);
    body.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1));
    body.renderOrder = 201;
    group.add(body);

    // Alt koni ucu
    const coneH = bobConeTopZ - tipZ;
    const coneGeom = new THREE.ConeGeometry(0.052, coneH, 16);
    const cone = new THREE.Mesh(coneGeom, bobMat);
    cone.position.set(0, 0, tipZ + coneH / 2);
    cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, -1));
    cone.renderOrder = 201;
    group.add(cone);

    return group;
  }

  // 8. AÇI DİLİMLERİ (AZİMUT, YÜKSEKLİK VE ÇEKÜL SAPMASI)
  // Yatay Azimut Dilimi (A / α): Kuzeyden saat yönünde Doğuya
  function createAzimuthWedge(uNorth, uEast, azDeg, radius, letter, colorHex) {
    const group = new THREE.Group();
    const azRad = THREE.MathUtils.degToRad(azDeg);
    if (Math.abs(azRad) < 0.01) return group;

    const segments = Math.max(16, Math.floor(Math.abs(azRad) * 24));
    const arcPoints = [];
    const positions = [0, 0, 0];
    const indices = [];

    for (let i = 0; i <= segments; i++) {
      const frac = i / segments;
      const angle = frac * azRad;
      const pt = uNorth.clone().multiplyScalar(Math.cos(angle))
        .add(uEast.clone().multiplyScalar(Math.sin(angle)))
        .multiplyScalar(radius);
      arcPoints.push(pt);
      positions.push(pt.x, pt.y, pt.z);
      if (i > 0) {
        indices.push(0, i, i + 1);
        indices.push(0, i + 1, i);
      }
    }

    const wedgeGeom = new THREE.BufferGeometry();
    wedgeGeom.setIndex(indices);
    wedgeGeom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    wedgeGeom.computeVertexNormals();

    const wedgeMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    group.add(new THREE.Mesh(wedgeGeom, wedgeMat));

    // Dış Çevre Yay Çizgisi
    const borderGeom = new THREE.BufferGeometry().setFromPoints(arcPoints);
    group.add(new THREE.Line(borderGeom, new THREE.LineBasicMaterial({ color: colorHex, linewidth: 2.5 })));

    // Harf Rozeti (A / α)
    if (letter) {
      const midAngle = azRad * 0.52;
      const midPt = uNorth.clone().multiplyScalar(Math.cos(midAngle))
        .add(uEast.clone().multiplyScalar(Math.sin(midAngle)))
        .multiplyScalar(radius * 1.14);
      midPt.z = 0.02;

      const letterSprite = createTextSprite(letter, {
        textColor: '#D35400',
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        borderColor: '#F39C12',
        borderWidth: 1.5,
        borderRadius: 7,
        padding: { x: 8, y: 4 },
        fontSize: 14,
        scale: 0.35,
        fontWeight: 'bold'
      });
      letterSprite.position.copy(midPt);
      group.add(letterSprite);
    }

    return group;
  }

  // Düşey Yükseklik Açısı Dilimi (v / a): Ufuktan Uyduya Doğru
  function createElevationWedge(uHoriz, uZenith, vertDeg, radius, letter, colorHex) {
    const group = new THREE.Group();
    const vRad = THREE.MathUtils.degToRad(vertDeg);
    if (Math.abs(vRad) < 0.01) return group;

    const segments = Math.max(16, Math.floor(Math.abs(vRad) * 24));
    const arcPoints = [];
    const positions = [0, 0, 0];
    const indices = [];

    for (let i = 0; i <= segments; i++) {
      const frac = i / segments;
      const angle = frac * vRad;
      const pt = uHoriz.clone().multiplyScalar(Math.cos(angle))
        .add(uZenith.clone().multiplyScalar(Math.sin(angle)))
        .multiplyScalar(radius);
      arcPoints.push(pt);
      positions.push(pt.x, pt.y, pt.z);
      if (i > 0) {
        indices.push(0, i, i + 1);
        indices.push(0, i + 1, i);
      }
    }

    const wedgeGeom = new THREE.BufferGeometry();
    wedgeGeom.setIndex(indices);
    wedgeGeom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    wedgeGeom.computeVertexNormals();

    const wedgeMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.36,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    group.add(new THREE.Mesh(wedgeGeom, wedgeMat));

    // Dış Yay Çizgisi
    const borderGeom = new THREE.BufferGeometry().setFromPoints(arcPoints);
    group.add(new THREE.Line(borderGeom, new THREE.LineBasicMaterial({ color: colorHex, linewidth: 2.5 })));

    // Harf Rozeti (v / a)
    if (letter) {
      const isSteep = Math.abs(vertDeg) > 65;
      const midAngle = isSteep ? vRad * 0.40 : vRad * 0.52;
      const rBadge = isSteep ? radius * 0.75 : radius * 1.15;
      const midPt = uHoriz.clone().multiplyScalar(Math.cos(midAngle))
        .add(uZenith.clone().multiplyScalar(Math.sin(midAngle)))
        .multiplyScalar(rBadge);

      const letterSprite = createTextSprite(letter, {
        textColor: '#1565C0',
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        borderColor: '#42A5F5',
        borderWidth: 1.5,
        borderRadius: 7,
        padding: { x: 8, y: 4 },
        fontSize: 14,
        scale: 0.35,
        fontWeight: 'bold'
      });
      letterSprite.position.copy(midPt);
      group.add(letterSprite);
    }

    return group;
  }

  // Çekül Sapması Yayı ve Dilimi (θ)
  function createDeflectionWedge(uZ1, uZ2, radius, colorHex) {
    const group = new THREE.Group();
    const u1 = uZ1.clone().normalize();
    const u2 = uZ2.clone().normalize();
    const totalAngle = Math.acos(Math.min(Math.max(u1.dot(u2), -1), 1));
    if (totalAngle < 0.005) return group;

    const segments = Math.max(14, Math.floor(totalAngle * 30));
    const arcPoints = [];
    const positions = [0, 0, 0];
    const indices = [];

    for (let i = 0; i <= segments; i++) {
      const frac = i / segments;
      const pt = u1.clone().lerp(u2, frac).normalize().multiplyScalar(radius);
      arcPoints.push(pt);
      positions.push(pt.x, pt.y, pt.z);
      if (i > 0) {
        indices.push(0, i, i + 1);
        indices.push(0, i + 1, i);
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setIndex(indices);
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.computeVertexNormals();

    const mat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.38,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    group.add(new THREE.Mesh(geom, mat));

    const borderGeom = new THREE.BufferGeometry().setFromPoints(arcPoints);
    group.add(new THREE.Line(borderGeom, new THREE.LineBasicMaterial({ color: colorHex, linewidth: 2.5 })));

    return group;
  }

  // 9. DETAYLI UYDU MODELİ
  function createDetailedSatellite() {
    const group = new THREE.Group();

    // Uydu ana gövdesi
    const bodyGeom = new THREE.BoxGeometry(0.34, 0.34, 0.46);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xd4a038,
      emissive: 0x6b4c15,
      emissiveIntensity: 0.40,
      metalness: 0.30,
      roughness: 0.40
    });
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    group.add(body);

    // Altın folyo detay bandı
    const foilGeom = new THREE.BoxGeometry(0.35, 0.35, 0.14);
    const foilMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0x78350f,
      emissiveIntensity: 0.45,
      metalness: 0.35,
      roughness: 0.35
    });
    const foil = new THREE.Mesh(foilGeom, foilMat);
    group.add(foil);

    // Güneş paneli kanatları
    const panelGeom = new THREE.BoxGeometry(0.76, 0.30, 0.024);
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.35,
      metalness: 0.20,
      roughness: 0.50
    });

    const leftPanel = new THREE.Mesh(panelGeom, panelMat);
    leftPanel.position.set(-0.58, 0, 0);
    group.add(leftPanel);

    const rightPanel = new THREE.Mesh(panelGeom, panelMat);
    rightPanel.position.set(0.58, 0, 0);
    group.add(rightPanel);

    // İnce açık mavi solar grid çizgileri
    const gridMat = new THREE.LineBasicMaterial({ color: 0x93c5fd, linewidth: 1.5, transparent: true, opacity: 0.85 });
    [-0.58, 0.58].forEach(panelX => {
      [-0.24, 0, 0.24].forEach(dx => {
        const lineGeom = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(panelX + dx, -0.14, 0.015),
          new THREE.Vector3(panelX + dx, 0.14, 0.015)
        ]);
        group.add(new THREE.Line(lineGeom, gridMat));
      });
      [-0.07, 0.07].forEach(dy => {
        const lineGeom = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(panelX - 0.36, dy, 0.015),
          new THREE.Vector3(panelX + 0.36, dy, 0.015)
        ]);
        group.add(new THREE.Line(lineGeom, gridMat));
      });
    });

    // İletişim Anteni (Çanak / Çubuk)
    const antennaGeom = new THREE.CylinderGeometry(0.010, 0.010, 0.24, 8);
    const antennaMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      emissive: 0xB0BEC5,
      emissiveIntensity: 0.30,
      metalness: 0.30,
      roughness: 0.40
    });
    const antenna = new THREE.Mesh(antennaGeom, antennaMat);
    antenna.position.set(0, 0, -0.32);
    group.add(antenna);

    return group;
  }


  // ==========================================================================
  // 6. LOCAL ASTRONOMIC SYSTEM (L.A.S.) (SOL-ELLİ / LEFT-HANDED via P2)
  // ==========================================================================
  class LocalAstronomicSystem {
    constructor(scene) {
      this.scene = scene;
      this.group = new THREE.Group();
      this.scene.add(this.group);

      this.params = {
        azimuthDeg: 65,           // A: Astronomik Azimut (Kuzeyden saat yönünde)
        verticalAngleDeg: 35,     // v: Düşey açı (Ufuktan yukarı)
        range: 4.6,               // r: Uydu Mesafesi
        xiDeg: 6.0,               // ξ: Meridyen bileşeni (K–G Sapması)
        etaDeg: 5.0,              // η: Birinci düşey bileşeni (D–B Sapması)
        showTerrain: true,        // Doğal Yeryüzü & Jeoit Dilimi & Teodolit
        showPlane: true,          // Ufuk düzlemi diski
        showDeflectionOverlay: true, // Elipsoit Normali (z_LG) ve θ sapma yayı
        showArcs: true            // A ve v açı yayları ve dilimleri
      };

      // Tekstürler
      this.strataTexture = new THREE.CanvasTexture(generateGeologicalStrataCanvas());
      this.strataTexture.wrapS = THREE.RepeatWrapping;
      this.strataTexture.wrapT = THREE.ClampToEdgeWrapping;
      this.strataTexture.repeat.set(2, 1);

      this.terrainTexture = new THREE.CanvasTexture(generateTerrainTextureCanvas());

      this.dynamicObjects = [];
      this.update();
    }

    setParams(p) {
      Object.assign(this.params, p);
      return this.update();
    }

    clearDynamic() {
      this.dynamicObjects.forEach(obj => {
        this.group.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
      });
      this.dynamicObjects = [];
    }

    update() {
      this.clearDynamic();

      const A_rad = THREE.MathUtils.degToRad(this.params.azimuthDeg);
      const v_rad = THREE.MathUtils.degToRad(this.params.verticalAngleDeg);
      const r = this.params.range;

      const xi_rad = THREE.MathUtils.degToRad(this.params.xiDeg);
      const eta_rad = THREE.MathUtils.degToRad(this.params.etaDeg);

      const axisLen = 3.5;

      // ----------------------------------------------------------------------
      // 1. EKSEN TANIMLARI (LN16 Sol-elli Sistem / Left-Handed via P2)
      // ----------------------------------------------------------------------
      // Birincil Kutup: z_LA = [0, 0, 1] (Yerçekimi Doğrultusunun Zıttı / Zenit)
      const uZ_LA = new THREE.Vector3(0, 0, 1);

      // Birincil Eksen: x_LA = [1, 0, 0] (Astronomik Kuzey)
      const uX_LA = new THREE.Vector3(1, 0, 0);

      // İkincil Eksen: y_LA = [0, -1, 0] (Astronomik Doğu - LN16 P2 Yansıtması ile Sol-elli)
      const uY_LA = new THREE.Vector3(0, -1, 0);

      // Gerçek Çekül Sapması Açısı θ:
      const theta_rad_real = Math.hypot(xi_rad, eta_rad);
      const theta_deg_real = THREE.MathUtils.radToDeg(theta_rad_real);

      // Görsel V-Ayrımı ve Dinamik (ξ, η) Sapma Doğrultusu:
      const uBaseXi = new THREE.Vector3(-0.85, 0.52, 0).normalize();
      const uBaseEta = new THREE.Vector3(-0.52, -0.85, 0).normalize();
      let uTiltDir = new THREE.Vector3(-0.85, 0.52, 0).normalize();
      if (theta_rad_real >= 0.001) {
        uTiltDir = new THREE.Vector3().addScaledVector(uBaseXi, xi_rad).addScaledVector(uBaseEta, eta_rad).normalize();
      }

      const visTheta = theta_rad_real < 0.001 ? 0 : Math.min(0.38, theta_rad_real * 2.5);
      const sinT = Math.sin(visTheta);
      const cosT = Math.cos(visTheta);

      const uRight = new THREE.Vector3(0.987, -0.158, 0).normalize();

      // Referans Elipsoit Normali z_LG
      const uZ_LG = theta_rad_real < 0.001
        ? uZ_LA.clone()
        : new THREE.Vector3().addScaledVector(uTiltDir, sinT).addScaledVector(uZ_LA, cosT).normalize();

      // Sol-elli L.A.S. Kartezyen Hedef Koordinatları (LN16 Eq. 2-57):
      const cosV = Math.cos(v_rad);
      const sinV = Math.sin(v_rad);
      const cosA = Math.cos(A_rad);
      const sinA = Math.sin(A_rad);

      const x = r * cosV * cosA;
      const y = r * cosV * sinA;
      const z = r * sinV;

      const origin = new THREE.Vector3(0, 0, 0);

      // 3D Hedef Pozisyonu (P2 Yansıtması ile: [x, -y, z]):
      const targetPos = uX_LA.clone().multiplyScalar(x)
        .add(uY_LA.clone().multiplyScalar(y))
        .add(uZ_LA.clone().multiplyScalar(z));

      // Ufuk Düzlemine İzdüşüm (z = 0):
      const projPos = uX_LA.clone().multiplyScalar(x)
        .add(uY_LA.clone().multiplyScalar(y));

      // Yatay İzdüşüm Birim Doğrultusu:
      const uH = projPos.clone().normalize();

      // ----------------------------------------------------------------------
      // 2. ENGEBELİ YERYÜZÜ & JEOİT DİLİMİ, TEODOLİT VE ASILI ŞAKÜL
      // ----------------------------------------------------------------------
      if (this.params.showTerrain || this.params.showPlane) {
        const terrainSlice = createRuggedTerrainSlice(
          uX_LA,
          uY_LA,
          4.2,
          this.strataTexture,
          this.terrainTexture,
          this.params.showTerrain,
          this.params.showPlane
        );
        this.group.add(terrainSlice);
        this.dynamicObjects.push(terrainSlice);
      }

      // Teodolit (Dürbünü uyduya yönlendirilmiş)
      const theodolite = createProminentTheodolite(targetPos, uZ_LA);
      this.group.add(theodolite);
      this.dynamicObjects.push(theodolite);

      // 3D Metalik Şakül (Plumb Bob): Nokta P(0,0,0)'da Teodolitin tam altından -Z yönünde açık havada sarkar
      const plumbBob = createHangingPlumbBob(new THREE.Vector3(0, 0, 0.55), 0.02);
      this.group.add(plumbBob);
      this.dynamicObjects.push(plumbBob);

      // ----------------------------------------------------------------------
      // 3. EKSEN OKLARI VE KOMPAKT STANDART ETİKETLERİ
      // ----------------------------------------------------------------------
      // A) Birincil Düşey Eksen: z_LA (Mor/İndigo - Zenit / Çekül Doğrultusu)
      const zArrow = createSmoothThickArrow(origin, uZ_LA, 3.4, 0x8E24AA, 0.046, 0.16, 0.38);
      this.group.add(zArrow);
      this.dynamicObjects.push(zArrow);

      const zSprite = createTextSprite("z_LA (Zenith / Plumb Line)", {
        textColor: '#FFFFFF',
        backgroundColor: '#6A1B9A',
        borderColor: '#E1BEE7',
        borderWidth: 1.5,
        borderRadius: 7,
        fontSize: 14,
        scale: 0.35,
        fontWeight: 'bold',
        padding: { x: 9, y: 5 }
      });
      zSprite.position.copy(uZ_LA.clone().multiplyScalar(3.4).addScaledVector(uRight, 0.70)).add(new THREE.Vector3(0, 0, 0.18));
      this.group.add(zSprite);
      this.dynamicObjects.push(zSprite);

      // B) Yatay Birincil Eksen: x_LA (Kırmızı - Astronomik Kuzey)
      const xArrow = createSmoothThickArrow(origin, uX_LA, axisLen, 0xE53935, 0.040, 0.15, 0.34);
      this.group.add(xArrow);
      this.dynamicObjects.push(xArrow);

      const xSprite = createTextSprite("x_LA (Astronomical North)", {
        textColor: '#FFFFFF',
        backgroundColor: '#C62828',
        borderColor: '#FFCDD2',
        borderWidth: 1.5,
        borderRadius: 7,
        fontSize: 14,
        scale: 0.35,
        fontWeight: 'bold',
        padding: { x: 9, y: 5 }
      });
      xSprite.position.copy(uX_LA.clone().multiplyScalar(axisLen + 0.55));
      this.group.add(xSprite);
      this.dynamicObjects.push(xSprite);

      // C) Yatay İkincil Eksen: y_LA (Yeşil - Astronomik Doğu [P2 Sol-elli])
      const yArrow = createSmoothThickArrow(origin, uY_LA, axisLen, 0x43A047, 0.040, 0.15, 0.34);
      this.group.add(yArrow);
      this.dynamicObjects.push(yArrow);

      const ySprite = createTextSprite("y_LA (Astronomical East)", {
        textColor: '#FFFFFF',
        backgroundColor: '#2E7D32',
        borderColor: '#C8E6C9',
        borderWidth: 1.5,
        borderRadius: 7,
        fontSize: 14,
        scale: 0.35,
        fontWeight: 'bold',
        padding: { x: 9, y: 5 }
      });
      ySprite.position.copy(uY_LA.clone().multiplyScalar(axisLen + 0.55));
      this.group.add(ySprite);
      this.dynamicObjects.push(ySprite);

      // ----------------------------------------------------------------------
      // 4. ÇEKÜL SAPMASI (θ) VE REFERANS NORMALİ (z_LG)
      // ----------------------------------------------------------------------
      if (this.params.showDeflectionOverlay) {
        // Referans Elipsoit Normali z_LG (Turuncu Kesikli Ok)
        const lgArrow = createDashedThickArrow(origin, uZ_LG, 3.05, 0xEF6C00, 0.038, 0.14, 0.32);
        this.group.add(lgArrow);
        this.dynamicObjects.push(lgArrow);

        const lgSprite = createTextSprite("z_LG (Reference Ellipsoid Normal)", {
          textColor: '#FFFFFF',
          backgroundColor: '#E65100',
          borderColor: '#FFE0B2',
          borderWidth: 1.5,
          borderRadius: 7,
          fontSize: 14,
          scale: 0.35,
          fontWeight: 'bold',
          padding: { x: 9, y: 5 }
        });
        if (theta_rad_real < 0.001) {
          lgSprite.position.copy(zSprite.position).setZ(3.95);
        } else {
          lgSprite.position.copy(uZ_LG.clone().multiplyScalar(3.05).addScaledVector(uTiltDir, 0.72)).add(new THREE.Vector3(0, 0, 0.18));
        }
        this.group.add(lgSprite);
        this.dynamicObjects.push(lgSprite);

        if (theta_rad_real >= 0.001) {
          // θ Sapma Yayı (createDeflectionWedge ile z_LA ve z_LG arası)
          const thetaWedge = createDeflectionWedge(uZ_LA, uZ_LG, 2.2, 0x8E24AA);
          this.group.add(thetaWedge);
          this.dynamicObjects.push(thetaWedge);

          const midZ = uZ_LA.clone().add(uZ_LG).normalize().multiplyScalar(2.60);
          const thetaSprite = createTextSprite(`θ = ${theta_deg_real.toFixed(2)}° (Deflection)`, {
            textColor: '#4A148C',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#BA68C8',
            borderWidth: 1.5,
            borderRadius: 7,
            fontSize: 13,
            scale: 0.32,
            fontWeight: 'bold',
            padding: { x: 8, y: 4 },
            textAlign: 'center'
          });
          thetaSprite.position.copy(midZ);
          this.group.add(thetaSprite);
          this.dynamicObjects.push(thetaSprite);
        }
      }

      // ----------------------------------------------------------------------
      // 5. UYDU HEDEFİ VE SADELEŞTİRİLMİŞ AÇI DİLİMLERİ (A & v)
      // ----------------------------------------------------------------------
      // 3D Uydu Modeli
      const sat = createDetailedSatellite();
      sat.position.copy(targetPos);
      sat.lookAt(origin);
      this.group.add(sat);
      this.dynamicObjects.push(sat);

      // İnce Kesikli Görüş Çizgisi (P'den Uyduya - v_rad tepe kenarıyla tam çakışık)
      const sightMat = new THREE.LineDashedMaterial({ color: 0x37474F, dashSize: 0.14, gapSize: 0.08, linewidth: 1.5 });
      const sightGeom = new THREE.BufferGeometry().setFromPoints([origin, targetPos]);
      const sightLine = new THREE.Line(sightGeom, sightMat);
      sightLine.computeLineDistances();
      this.group.add(sightLine);
      this.dynamicObjects.push(sightLine);

      // İnce Kesikli Düşey İzdüşüm Çizgisi (Uydudan Ufuk Düzlemine)
      const dropGeom = new THREE.BufferGeometry().setFromPoints([targetPos, projPos]);
      const dropLine = new THREE.Line(dropGeom, sightMat);
      dropLine.computeLineDistances();
      this.group.add(dropLine);
      this.dynamicObjects.push(dropLine);

      // İnce Kesikli Yatay Doğrultu (P'den İzdüşüme)
      const projGeom = new THREE.BufferGeometry().setFromPoints([origin, projPos]);
      const projLine = new THREE.Line(projGeom, sightMat);
      projLine.computeLineDistances();
      this.group.add(projLine);
      this.dynamicObjects.push(projLine);

      // Açı Dilimleri (A: Azimut [Turuncu], v: Yükseklik Açısı [Mavi])
      if (this.params.showArcs) {
        // Yatay Azimut Dilimi (Kuzeyden Saat Yönünde Doğuya)
        const azWedge = createAzimuthWedge(uX_LA, uY_LA, this.params.azimuthDeg, 2.0, "A", 0xE67E22);
        this.group.add(azWedge);
        this.dynamicObjects.push(azWedge);

        // Düşey Yükseklik Açısı Dilimi (Ufuktan Uyduya Doğru - Üst kenarı uydu görüş çizgisiyle çakışık)
        const elevWedge = createElevationWedge(uH, uZ_LA, this.params.verticalAngleDeg, 2.4, "v", 0x1E88E5);
        this.group.add(elevWedge);
        this.dynamicObjects.push(elevWedge);
      }

      return {
        x, y, z,
        r,
        azimuth: this.params.azimuthDeg,
        altitude: this.params.verticalAngleDeg,
        theta: theta_deg_real,
        xi: this.params.xiDeg,
        eta: this.params.etaDeg
      };
    }
  }


  // ==========================================================================
  // 7. LOCAL GEODETIC SYSTEM (L.G.S.) (SOL-ELLİ / LEFT-HANDED via P2)
  // ==========================================================================
  class LocalGeodeticSystem {
    constructor(scene) {
      this.scene = scene;
      this.group = new THREE.Group();
      this.scene.add(this.group);

      this.params = {
        azimuthDeg: 65,           // α: Jeodezik Azimut (Kuzeyden saat yönünde)
        verticalAngleDeg: 35,     // a: Jeodezik Düşey Açı / Yükseklik açısı
        range: 4.6,               // r: Uydu Mesafesi
        xiDeg: 6.0,               // ξ: Meridyen bileşeni
        etaDeg: 5.0,              // η: Birinci düşey bileşeni
        showEllipsoid: true,      // 3D Referans Elipsoidi Kubbesi ve Tanjant Düzlemi
        showPlane: true,          // Tanjant Düzlemi
        showDeflectionOverlay: true, // Çekül Doğrultusu (z_LA) ve θ sapma yayı
        showArcs: true            // α ve a açı yayları ve dilimleri
      };

      this.globeTexture = new THREE.CanvasTexture(generateEllipsoidGlobeTexture());

      this.dynamicObjects = [];
      this.update();
    }

    setParams(p) {
      Object.assign(this.params, p);
      return this.update();
    }

    clearDynamic() {
      this.dynamicObjects.forEach(obj => {
        this.group.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
      });
      this.dynamicObjects = [];
    }

    update() {
      this.clearDynamic();

      const alpha_rad = THREE.MathUtils.degToRad(this.params.azimuthDeg);
      const a_rad = THREE.MathUtils.degToRad(this.params.verticalAngleDeg);
      const r = this.params.range;

      const xi_rad = THREE.MathUtils.degToRad(this.params.xiDeg);
      const eta_rad = THREE.MathUtils.degToRad(this.params.etaDeg);

      const axisLen = 3.5;

      // ----------------------------------------------------------------------
      // 1. EKSEN TANIMLARI (LN16 Sol-elli Sistem / Left-Handed via P2)
      // ----------------------------------------------------------------------
      // Birincil Kutup: z_LG = [0, 0, 1] (Referans Elipsoidi Normali n - Tanjant düzlemine tam dik)
      const uZ_LG = new THREE.Vector3(0, 0, 1);

      // Birincil Eksen: x_LG = [1, 0, 0] (Jeodezik Kuzey - Tanjant düzleminde)
      const uX_LG = new THREE.Vector3(1, 0, 0);

      // İkincil Eksen: y_LG = [0, -1, 0] (Jeodezik Doğu - LN16 P2 Yansıtması ile Sol-elli)
      const uY_LG = new THREE.Vector3(0, -1, 0);

      // Gerçek Çekül Sapması Açısı θ:
      const theta_rad_real = Math.hypot(xi_rad, eta_rad);
      const theta_deg_real = THREE.MathUtils.radToDeg(theta_rad_real);

      // Görsel V-Ayrımı ve Dinamik (ξ, η) Sapma Doğrultusu:
      const uBaseXi = new THREE.Vector3(-0.85, 0.52, 0).normalize();
      const uBaseEta = new THREE.Vector3(-0.52, -0.85, 0).normalize();
      let uTiltDir = new THREE.Vector3(-0.85, 0.52, 0).normalize();
      if (theta_rad_real >= 0.001) {
        uTiltDir = new THREE.Vector3().addScaledVector(uBaseXi, xi_rad).addScaledVector(uBaseEta, eta_rad).normalize();
      }

      const visTheta = theta_rad_real < 0.001 ? 0 : Math.min(0.38, theta_rad_real * 2.5);
      const sinT = Math.sin(visTheta);
      const cosT = Math.cos(visTheta);

      const uRight = new THREE.Vector3(0.987, -0.158, 0).normalize();

      // Referans Çekül Doğrultusu z_LA
      const uZ_LA = theta_rad_real < 0.001
        ? uZ_LG.clone()
        : new THREE.Vector3().addScaledVector(uTiltDir, sinT).addScaledVector(uZ_LG, cosT).normalize();

      // Sol-elli L.G.S. Kartezyen Hedef Koordinatları (LN16 Eq. 2-53):
      const cosA = Math.cos(a_rad);
      const sinA = Math.sin(a_rad);
      const cosAlpha = Math.cos(alpha_rad);
      const sinAlpha = Math.sin(alpha_rad);

      const x = r * cosA * cosAlpha;
      const y = r * cosA * sinAlpha;
      const z = r * sinA;

      const origin = new THREE.Vector3(0, 0, 0);

      // 3D Hedef Pozisyonu (P2 Yansıtması ile: [x, -y, z]):
      const targetPos = uX_LG.clone().multiplyScalar(x)
        .add(uY_LG.clone().multiplyScalar(y))
        .add(uZ_LG.clone().multiplyScalar(z));

      // Tanjant Düzlemine İzdüşüm (z = 0):
      const projPos = uX_LG.clone().multiplyScalar(x)
        .add(uY_LG.clone().multiplyScalar(y));

      // Yatay İzdüşüm Birim Doğrultusu:
      const uH = projPos.clone().normalize();

      // ----------------------------------------------------------------------
      // 2. 3D REFERANS ELİPSOİDİ KUBBESİ VE TANJANT DÜZLEMİ
      // ----------------------------------------------------------------------
      const ellipsoidDome = createReferenceEllipsoidAndTangentPlane(
        uX_LG,
        uY_LG,
        this.globeTexture,
        this.params.showEllipsoid,
        this.params.showPlane
      );
      this.group.add(ellipsoidDome);
      this.dynamicObjects.push(ellipsoidDome);

      // ----------------------------------------------------------------------
      // 3. EKSEN OKLARI VE KOMPAKT STANDART ETİKETLERİ
      // ----------------------------------------------------------------------
      // A) Birincil Normal Eksen: z_LG (Turuncu - Elipsoit Normali n)
      const zArrow = createSmoothThickArrow(origin, uZ_LG, 3.4, 0xEF6C00, 0.046, 0.16, 0.38);
      this.group.add(zArrow);
      this.dynamicObjects.push(zArrow);

      const zSprite = createTextSprite("z_LG (Normal n)", {
        textColor: '#FFFFFF',
        backgroundColor: '#E65100',
        borderColor: '#FFE0B2',
        borderWidth: 1.5,
        borderRadius: 7,
        fontSize: 14,
        scale: 0.35,
        fontWeight: 'bold',
        padding: { x: 9, y: 5 }
      });
      zSprite.position.copy(uZ_LG.clone().multiplyScalar(3.4).addScaledVector(uRight, 0.70)).add(new THREE.Vector3(0, 0, 0.18));
      this.group.add(zSprite);
      this.dynamicObjects.push(zSprite);

      // B) Tanjant Birincil Eksen: x_LG (Kırmızı - Jeodezik Kuzey)
      const xArrow = createSmoothThickArrow(origin, uX_LG, axisLen, 0xE53935, 0.040, 0.15, 0.34);
      this.group.add(xArrow);
      this.dynamicObjects.push(xArrow);

      const xSprite = createTextSprite("x_LG (Geodetic North)", {
        textColor: '#FFFFFF',
        backgroundColor: '#C62828',
        borderColor: '#FFCDD2',
        borderWidth: 1.5,
        borderRadius: 7,
        fontSize: 14,
        scale: 0.35,
        fontWeight: 'bold',
        padding: { x: 9, y: 5 }
      });
      xSprite.position.copy(uX_LG.clone().multiplyScalar(axisLen + 0.55));
      this.group.add(xSprite);
      this.dynamicObjects.push(xSprite);

      // C) Tanjant İkincil Eksen: y_LG (Yeşil - Jeodezik Doğu [P2 Sol-elli])
      const yArrow = createSmoothThickArrow(origin, uY_LG, axisLen, 0x43A047, 0.040, 0.15, 0.34);
      this.group.add(yArrow);
      this.dynamicObjects.push(yArrow);

      const ySprite = createTextSprite("y_LG (Geodetic East)", {
        textColor: '#FFFFFF',
        backgroundColor: '#2E7D32',
        borderColor: '#C8E6C9',
        borderWidth: 1.5,
        borderRadius: 7,
        fontSize: 14,
        scale: 0.35,
        fontWeight: 'bold',
        padding: { x: 9, y: 5 }
      });
      ySprite.position.copy(uY_LG.clone().multiplyScalar(axisLen + 0.55));
      this.group.add(ySprite);
      this.dynamicObjects.push(ySprite);

      // ----------------------------------------------------------------------
      // 4. ÇEKÜL DOĞRULTUSU REFERANSI VE θ SAPMA YAYI
      // ----------------------------------------------------------------------
      if (this.params.showDeflectionOverlay) {
        // Referans Çekül Doğrultusu z_LA (Mor Kesikli Ok)
        const laArrow = createDashedThickArrow(origin, uZ_LA, 3.05, 0x8E24AA, 0.038, 0.14, 0.32);
        this.group.add(laArrow);
        this.dynamicObjects.push(laArrow);

        const laSprite = createTextSprite("z_LA (Reference Plumb Line)", {
          textColor: '#FFFFFF',
          backgroundColor: '#6A1B9A',
          borderColor: '#E1BEE7',
          borderWidth: 1.5,
          borderRadius: 7,
          fontSize: 14,
          scale: 0.35,
          fontWeight: 'bold',
          padding: { x: 9, y: 5 }
        });
        if (theta_rad_real < 0.001) {
          laSprite.position.copy(zSprite.position).setZ(3.95);
        } else {
          laSprite.position.copy(uZ_LA.clone().multiplyScalar(3.05).addScaledVector(uTiltDir, 0.72)).add(new THREE.Vector3(0, 0, 0.18));
        }
        this.group.add(laSprite);
        this.dynamicObjects.push(laSprite);

        if (theta_rad_real >= 0.001) {
          // θ Sapma Yayı (createDeflectionWedge ile z_LG ve z_LA arası)
          const thetaWedge = createDeflectionWedge(uZ_LG, uZ_LA, 2.2, 0xEF6C00);
          this.group.add(thetaWedge);
          this.dynamicObjects.push(thetaWedge);

          const midZ = uZ_LG.clone().add(uZ_LA).normalize().multiplyScalar(2.60);
          const thetaSprite = createTextSprite(`θ = ${theta_deg_real.toFixed(2)}° (Deflection)`, {
            textColor: '#E65100',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#FFB74D',
            borderWidth: 1.5,
            borderRadius: 7,
            fontSize: 13,
            scale: 0.32,
            fontWeight: 'bold',
            padding: { x: 8, y: 4 },
            textAlign: 'center'
          });
          thetaSprite.position.copy(midZ);
          this.group.add(thetaSprite);
          this.dynamicObjects.push(thetaSprite);
        }
      }

      // ----------------------------------------------------------------------
      // 5. UYDU HEDEFİ VE SADELEŞTİRİLMİŞ AÇI DİLİMLERİ (α & a)
      // ----------------------------------------------------------------------
      // 3D Uydu Modeli
      const sat = createDetailedSatellite();
      sat.position.copy(targetPos);
      sat.lookAt(origin);
      this.group.add(sat);
      this.dynamicObjects.push(sat);

      // İnce Kesikli Görüş Çizgisi (P'den Uyduya - a_rad tepe kenarıyla tam çakışık)
      const sightMat = new THREE.LineDashedMaterial({ color: 0x37474F, dashSize: 0.14, gapSize: 0.08, linewidth: 1.5 });
      const sightGeom = new THREE.BufferGeometry().setFromPoints([origin, targetPos]);
      const sightLine = new THREE.Line(sightGeom, sightMat);
      sightLine.computeLineDistances();
      this.group.add(sightLine);
      this.dynamicObjects.push(sightLine);

      // İnce Kesikli Düşey İzdüşüm Çizgisi (Uydudan Tanjant Düzlemine)
      const dropGeom = new THREE.BufferGeometry().setFromPoints([targetPos, projPos]);
      const dropLine = new THREE.Line(dropGeom, sightMat);
      dropLine.computeLineDistances();
      this.group.add(dropLine);
      this.dynamicObjects.push(dropLine);

      // İnce Kesikli Yatay Doğrultu (P'den İzdüşüme)
      const projGeom = new THREE.BufferGeometry().setFromPoints([origin, projPos]);
      const projLine = new THREE.Line(projGeom, sightMat);
      projLine.computeLineDistances();
      this.group.add(projLine);
      this.dynamicObjects.push(projLine);

      // Açı Dilimleri (α: Jeodezik Azimut [Turuncu], a: Yükseklik Açısı [Mavi])
      if (this.params.showArcs) {
        // Yatay Azimut Dilimi (Kuzeyden Saat Yönünde Doğuya)
        const azWedge = createAzimuthWedge(uX_LG, uY_LG, this.params.azimuthDeg, 2.0, "α", 0xE67E22);
        this.group.add(azWedge);
        this.dynamicObjects.push(azWedge);

        // Düşey Yükseklik Açısı Dilimi (Tanjant Düzleminden Uyduya Doğru - Üst kenarı uydu görüş çizgisiyle çakışık)
        const elevWedge = createElevationWedge(uH, uZ_LG, this.params.verticalAngleDeg, 2.4, "a", 0x1E88E5);
        this.group.add(elevWedge);
        this.dynamicObjects.push(elevWedge);
      }

      return {
        x, y, z,
        r,
        azimuth: this.params.azimuthDeg,
        altitude: this.params.verticalAngleDeg,
        theta: theta_deg_real,
        xi: this.params.xiDeg,
        eta: this.params.etaDeg
      };
    }
  }


  // ==========================================================================
  // 8. SCENE MANAGER & VIEWPORT KOORDİNASYONU
  // ==========================================================================
  class SceneManager {
    constructor() {
      this.currentMode = 'geocentric'; // Default: Terrestrial Geocentric Cartesian

      // Tekli Canvas Elemanları (Geocentric / Tekil L.A.S. / Tekil L.G.S.)
      this.singleContainer = document.getElementById('single-canvas-container');
      this.threeCanvasSingle = document.getElementById('three-canvas-single');

      // Çift Viewport Elemanları (Yan Yana Karşılaştırma)
      this.splitContainer = document.getElementById('split-canvas-container');
      this.canvasLas = document.getElementById('canvas-las');
      this.canvasLgs = document.getElementById('canvas-lgs');

      this.initSingleScene();
      this.initSplitScenes();
      this.setupCameraSync();
      this.setupResizeHandler();
    }

    initSingleScene() {
      this.singleScene = new THREE.Scene();
      this.singleScene.background = new THREE.Color(0xF9F5EB); // Latte Arka Plan

      const width = this.threeCanvasSingle.clientWidth || window.innerWidth * 0.72;
      const height = this.threeCanvasSingle.clientHeight || window.innerHeight - 90;

      this.singleCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      this.singleCamera.up.set(0, 0, 1); // Z-UP: Kuzey Kutbu / North Pole ve Z Ekseni TAM YUKARI
      this.singleCamera.position.set(12.0, 5.4, 5.2);

      this.singleRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.singleRenderer.setSize(width, height);
      this.singleRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.threeCanvasSingle.appendChild(this.singleRenderer.domElement);

      this.singleControls = new THREE.OrbitControls(this.singleCamera, this.singleRenderer.domElement);
      this.singleControls.enableDamping = true;
      this.singleControls.dampingFactor = 0.08;
      this.singleControls.target.set(0, 0, 0.2);

      // Işıklandırma
      const ambLight = new THREE.AmbientLight(0xFFFFFF, 0.95);
      this.singleScene.add(ambLight);

      const dirLight1 = new THREE.DirectionalLight(0xFFFFFF, 0.85);
      dirLight1.position.set(12, 12, 16);
      this.singleScene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0xFFF3E0, 0.5);
      dirLight2.position.set(-6, -14, 12);
      this.singleScene.add(dirLight2);

      // Sistem Örnekleri
      this.geocentricSys = new GeocentricSystem(this.singleScene);
      this.singleLasSys = new LocalAstronomicSystem(this.singleScene);
      this.singleLgsSys = new LocalGeodeticSystem(this.singleScene);

      // Başlangıçta tekli sahne modellerini gizle
      this.geocentricSys.group.visible = false;
      this.singleLasSys.group.visible = false;
      this.singleLgsSys.group.visible = false;
    }

    initSplitScenes() {
      // 1. SOL: L.A.S. Sahnesi
      this.sceneLas = new THREE.Scene();
      this.sceneLas.background = new THREE.Color(0xF9F5EB);

      const wLas = this.canvasLas.clientWidth || (window.innerWidth * 0.72) / 2;
      const hLas = this.canvasLas.clientHeight || window.innerHeight - 90;

      this.cameraLas = new THREE.PerspectiveCamera(45, wLas / hLas, 0.1, 1000);
      this.cameraLas.up.set(0, 0, 1); // Z-UP Jeodezik Düşey Eksen
      this.cameraLas.position.set(-2.0, -12.5, 6.5);

      this.rendererLas = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.rendererLas.setSize(wLas, hLas);
      this.rendererLas.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.canvasLas.appendChild(this.rendererLas.domElement);

      this.controlsLas = new THREE.OrbitControls(this.cameraLas, this.rendererLas.domElement);
      this.controlsLas.enableDamping = true;
      this.controlsLas.dampingFactor = 0.08;
      this.controlsLas.target.set(0, 0, 0.85);

      const ambLas = new THREE.AmbientLight(0xFFFFFF, 0.95);
      this.sceneLas.add(ambLas);
      const dirLas = new THREE.DirectionalLight(0xFFFFFF, 0.85);
      dirLas.position.set(12, 15, 18);
      this.sceneLas.add(dirLas);
      const dirLas2 = new THREE.DirectionalLight(0xFFF3E0, 0.6);
      dirLas2.position.set(-4, -14, 12);
      this.sceneLas.add(dirLas2);

      this.lasSys = new LocalAstronomicSystem(this.sceneLas);

      // 2. SAĞ: L.G.S. Sahnesi
      this.sceneLgs = new THREE.Scene();
      this.sceneLgs.background = new THREE.Color(0xF9F5EB);

      const wLgs = this.canvasLgs.clientWidth || (window.innerWidth * 0.72) / 2;
      const hLgs = this.canvasLgs.clientHeight || window.innerHeight - 90;

      this.cameraLgs = new THREE.PerspectiveCamera(45, wLgs / hLgs, 0.1, 1000);
      this.cameraLgs.up.set(0, 0, 1); // Z-UP Jeodezik Düşey Eksen
      this.cameraLgs.position.copy(this.cameraLas.position);

      this.rendererLgs = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.rendererLgs.setSize(wLgs, hLgs);
      this.rendererLgs.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.canvasLgs.appendChild(this.rendererLgs.domElement);

      this.controlsLgs = new THREE.OrbitControls(this.cameraLgs, this.rendererLgs.domElement);
      this.controlsLgs.enableDamping = true;
      this.controlsLgs.dampingFactor = 0.08;
      this.controlsLgs.target.set(0, 0, 0.85);

      const ambLgs = new THREE.AmbientLight(0xFFFFFF, 0.95);
      this.sceneLgs.add(ambLgs);
      const dirLgs = new THREE.DirectionalLight(0xFFFFFF, 0.85);
      dirLgs.position.set(12, 15, 18);
      this.sceneLgs.add(dirLgs);
      const dirLgs2 = new THREE.DirectionalLight(0xFFF3E0, 0.6);
      dirLgs2.position.set(-4, -14, 12);
      this.sceneLgs.add(dirLgs2);

      this.lgsSys = new LocalGeodeticSystem(this.sceneLgs);
    }

    // Kamera Senkronizasyonu: Bir viewport döndürüldüğünde diğeri anında senkronize olur
    setupCameraSync() {
      let isSyncing = false;

      this.controlsLas.addEventListener('change', () => {
        if (isSyncing || this.currentMode !== 'comparison') return;
        isSyncing = true;
        this.cameraLgs.position.copy(this.cameraLas.position);
        this.cameraLgs.quaternion.copy(this.cameraLas.quaternion);
        this.controlsLgs.target.copy(this.controlsLas.target);
        this.controlsLgs.update();
        isSyncing = false;
      });

      this.controlsLgs.addEventListener('change', () => {
        if (isSyncing || this.currentMode !== 'comparison') return;
        isSyncing = true;
        this.cameraLas.position.copy(this.cameraLgs.position);
        this.cameraLas.quaternion.copy(this.cameraLgs.quaternion);
        this.controlsLas.target.copy(this.controlsLgs.target);
        this.controlsLas.update();
        isSyncing = false;
      });
    }

    setupResizeHandler() {
      window.addEventListener('resize', () => {
        this.handleResize();
      });
    }

    handleResize() {
      if (this.currentMode === 'comparison') {
        const wLas = this.canvasLas.clientWidth;
        const hLas = this.canvasLas.clientHeight;
        if (wLas && hLas) {
          this.cameraLas.aspect = wLas / hLas;
          this.cameraLas.updateProjectionMatrix();
          this.rendererLas.setSize(wLas, hLas);
        }

        const wLgs = this.canvasLgs.clientWidth;
        const hLgs = this.canvasLgs.clientHeight;
        if (wLgs && hLgs) {
          this.cameraLgs.aspect = wLgs / hLgs;
          this.cameraLgs.updateProjectionMatrix();
          this.rendererLgs.setSize(wLgs, hLgs);
        }
      } else {
        const w = this.threeCanvasSingle.clientWidth;
        const h = this.threeCanvasSingle.clientHeight;
        if (w && h) {
          this.singleCamera.aspect = w / h;
          this.singleCamera.updateProjectionMatrix();
          this.singleRenderer.setSize(w, h);
        }
      }
    }

    setMode(mode) {
      this.currentMode = mode;

      if (mode === 'comparison') {
        this.singleContainer.style.display = 'none';
        this.splitContainer.style.display = 'grid';

        this.geocentricSys.group.visible = false;
        this.singleLasSys.group.visible = false;
        this.singleLgsSys.group.visible = false;

        this.lasSys.group.visible = true;
        this.lgsSys.group.visible = true;

        setTimeout(() => this.handleResize(), 50);
      } else {
        this.splitContainer.style.display = 'none';
        this.singleContainer.style.display = 'block';

        this.geocentricSys.group.visible = (mode === 'geocentric');
        this.singleLasSys.group.visible = (mode === 'local-astronomic');
        this.singleLgsSys.group.visible = (mode === 'local-geodetic');

        this.singleCamera.up.set(0, 0, 1);
        if (mode === 'geocentric') {
          this.singleCamera.position.set(12.0, 5.4, 5.2);
          this.singleControls.target.set(0, 0, 0.2);
        } else {
          this.singleCamera.position.set(-2.0, -12.5, 6.5);
          this.singleControls.target.set(0, 0, 0.85);
        }
        this.singleControls.update();

        setTimeout(() => this.handleResize(), 50);
      }
    }

    setCameraPreset(preset, camera, controls) {
      const cam = camera || (this.currentMode === 'comparison' ? this.cameraLas : this.singleCamera);
      const ctrl = controls || (this.currentMode === 'comparison' ? this.controlsLas : this.singleControls);

      cam.up.set(0, 0, 1);

      if (this.currentMode === 'geocentric') {
        switch (preset) {
          case 'perspective-wiki':
            cam.position.set(12.0, 5.4, 5.2);
            ctrl.target.set(0, 0, 0.2);
            break;
          case 'top':
            cam.position.set(-0.01, -0.5, 14.0);
            ctrl.target.set(0, 0, 0);
            break;
          case 'meridian':
            cam.position.set(13.5, 0, 0.5);
            ctrl.target.set(0, 0, 0);
            break;
          case 'front':
            cam.position.set(0, 13.5, 0.5);
            ctrl.target.set(0, 0, 0);
            break;
        }
      } else {
        switch (preset) {
          case 'perspective-wiki':
            cam.position.set(-2.0, -12.5, 6.5);
            ctrl.target.set(0, 0, 0.85);
            break;
          case 'top':
            cam.position.set(-0.01, -0.5, 14.0);
            ctrl.target.set(0, 0, 0.5);
            break;
          case 'meridian':
            cam.position.set(-13.0, 0, 2.5);
            ctrl.target.set(0, 0, 0.85);
            break;
          case 'front':
            cam.position.set(0, -13.0, 2.5);
            ctrl.target.set(0, 0, 0.85);
            break;
        }
      }
      ctrl.update();

      if (this.currentMode === 'comparison') {
        this.cameraLgs.position.copy(this.cameraLas.position);
        this.cameraLgs.quaternion.copy(this.cameraLas.quaternion);
        this.controlsLgs.target.copy(this.controlsLas.target);
        this.controlsLgs.update();
      }
    }

    render() {
      requestAnimationFrame(() => this.render());

      if (this.currentMode === 'comparison') {
        this.controlsLas.update();
        this.controlsLgs.update();
        this.rendererLas.render(this.sceneLas, this.cameraLas);
        this.rendererLgs.render(this.sceneLgs, this.cameraLgs);
      } else {
        this.singleControls.update();
        this.singleRenderer.render(this.singleScene, this.singleCamera);
      }
    }
  }


  // ==========================================================================
  // 9. APP KONTROL VE ETKİLEŞİM YÖNETİCİSİ
  // ==========================================================================
  class App {
    constructor() {
      this.sceneManager = new SceneManager();
      this.currentMode = 'geocentric';

      // Ortak Toposantrik Parametreler
      this.sharedParams = {
        azimuthDeg: 65,
        verticalAngleDeg: 35,
        range: 4.6,
        xiDeg: 6.0,
        etaDeg: 5.0,
        showTerrain: true,
        showPlane: true,
        showDeflectionOverlay: true,
        showArcs: true
      };

      this.setupHeaderNavigation();
      this.setupCameraButtons();
      this.setupAboutModal();
      this.initMode(this.currentMode);
      this.sceneManager.render();
      this.printConsoleGreeting();
    }

    setupHeaderNavigation() {
      const buttons = document.querySelectorAll('.header-system-controls .sys-btn');
      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const mode = btn.dataset.mode;
          this.initMode(mode);
        });
      });
    }

    setupCameraButtons() {
      document.querySelectorAll('.cam-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const preset = e.target.dataset.preset;
          this.sceneManager.setCameraPreset(preset);
        });
      });
    }

    // Hakkında ve akademik künye modalı etkileşimleri
    setupAboutModal() {
      const modal = document.getElementById('about-modal');
      const btnOpen = document.getElementById('btn-about');
      const btnClose = document.getElementById('btn-close-about');
      const btnCloseFooter = document.getElementById('btn-close-about-footer');

      if (!modal || !btnOpen) return;

      const openModal = () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      };

      const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      };

      btnOpen.addEventListener('click', openModal);
      if (btnClose) btnClose.addEventListener('click', closeModal);
      if (btnCloseFooter) btnCloseFooter.addEventListener('click', closeModal);

      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          closeModal();
        }
      });
    }

    // Konsol karşılama ve akademik künye mesajı
    printConsoleGreeting() {
      console.log(
        '%c🌍 GEO203E: Coordinate Systems in Geodesy %c\n' +
        'Lecture Notes No. 16 (E.J. Krakiwsky & D.E. Wells)\n' +
        'Kaynak         : https://gge.ext.unb.ca/Pubs/LN16.pdf\n\n' +
        'Ders Sorumlusu : Prof. Dr. Bihter Erol\n' +
        'Geliştiren     : Melih Cihan Keleşoğlu\n' +
        'Bölüm          : Geomatik Mühendisliği & Makina Mühendisliği (ÇAP)\n' +
        'Kurum          : İstanbul Teknik Üniversitesi (İTÜ)\n' +
        'GitHub         : https://github.com/MelihCihanK/Coordinate-Systems-in-Geodesy\n' +
        'LinkedIn       : https://www.linkedin.com/in/melihcihankelesoglu/\n' +
        'Altyapı        : Three.js r128, WebGL, Vanilla JS\n',
        'color: #D35400; font-size: 13px; font-weight: bold;',
        'color: #4A3324; font-size: 11px;'
      );
    }

    initMode(mode) {
      this.currentMode = mode;
      this.sceneManager.setMode(mode);
      this.renderSidebar(mode);
      this.updateHud();
    }

    renderSidebar(mode) {
      const container = document.getElementById('controls-sidebar-content');
      if (!container) return;

      if (mode === 'comparison') {
        this.renderComparisonSidebar(container);
      } else if (mode === 'geocentric') {
        this.renderGeocentricSidebar(container);
      } else if (mode === 'local-astronomic') {
        this.renderSingleLasSidebar(container);
      } else if (mode === 'local-geodetic') {
        this.renderSingleLgsSidebar(container);
      }
    }

    // YAN YANA KARŞILAŞTIRMA MODU İÇİN SAĞ YAN PANEL
    renderComparisonSidebar(container) {
      const thetaVal = Math.hypot(this.sharedParams.xiDeg, this.sharedParams.etaDeg).toFixed(2);

      container.innerHTML = `
        <!-- KART 1: HEDEF / UYDU KONUMU -->
        <div class="control-card">
          <div class="card-header">
            <span class="card-title">📡 Ortak Hedef / Uydu Konumu</span>
            <span class="sys-badge-pill">Sol-elli (P₂)</span>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <label class="slider-label" for="slider-comp-az">Azimut (A / α) [Kuzeyden Saat Yönü]</label>
              <span class="slider-val" id="val-comp-az">${this.sharedParams.azimuthDeg.toFixed(1)}°</span>
            </div>
            <input type="range" class="custom-slider" id="slider-comp-az" min="0" max="360" step="1" value="${this.sharedParams.azimuthDeg}">
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <label class="slider-label" for="slider-comp-vert">Yükseklik Açısı (v / a)</label>
              <span class="slider-val" id="val-comp-vert">${this.sharedParams.verticalAngleDeg.toFixed(1)}°</span>
            </div>
            <input type="range" class="custom-slider" id="slider-comp-vert" min="5" max="85" step="1" value="${this.sharedParams.verticalAngleDeg}">
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <label class="slider-label" for="slider-comp-range">Hedef Mesafesi (r)</label>
              <span class="slider-val" id="val-comp-range">${this.sharedParams.range.toFixed(2)}</span>
            </div>
            <input type="range" class="custom-slider" id="slider-comp-range" min="3.0" max="7.0" step="0.1" value="${this.sharedParams.range}">
          </div>
        </div>

        <!-- KART 2: ÇEKÜL SAPMASI (DEFLECTION) -->
        <div class="control-card">
          <div class="card-header">
            <span class="card-title">⚖️ Çekül Sapması (Deflection θ)</span>
            <span class="deflection-badge" id="badge-comp-theta">θ = ${thetaVal}°</span>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <label class="slider-label" for="slider-comp-xi">Meridyen Bileşeni (ξ) [K–G Sapması]</label>
              <span class="slider-val" id="val-comp-xi">${this.sharedParams.xiDeg.toFixed(1)}°</span>
            </div>
            <input type="range" class="custom-slider" id="slider-comp-xi" min="-12" max="12" step="0.5" value="${this.sharedParams.xiDeg}">
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <label class="slider-label" for="slider-comp-eta">Birinci Düşey Bileşeni (η) [D–B Sapması]</label>
              <span class="slider-val" id="val-comp-eta">${this.sharedParams.etaDeg.toFixed(1)}°</span>
            </div>
            <input type="range" class="custom-slider" id="slider-comp-eta" min="-12" max="12" step="0.5" value="${this.sharedParams.etaDeg}">
          </div>

          <div class="deflection-preset-row">
            <button class="def-btn" id="btn-comp-def-preset">Örnek Sapma (7.8°)</button>
            <button class="def-btn" id="btn-comp-def-zero">Sıfır Sapma (0.0°)</button>
          </div>
        </div>

        <!-- KART 3: İLLÜSTRASYON KATMANLARI -->
        <div class="control-card">
          <div class="card-header">
            <span class="card-title">İllüstrasyon Katmanları</span>
          </div>

          <div class="toggle-row">
            <label class="checkbox-label">
              <input type="checkbox" id="chk-comp-terrain" ${this.sharedParams.showTerrain ? 'checked' : ''}>
              <span>Yeryüzü &amp; Elipsoit Altlığı</span>
            </label>
          </div>
          <div class="toggle-row">
            <label class="checkbox-label">
              <input type="checkbox" id="chk-comp-plane" ${this.sharedParams.showPlane ? 'checked' : ''}>
              <span>Tanjant &amp; Ufuk Düzlemi</span>
            </label>
          </div>
          <div class="toggle-row">
            <label class="checkbox-label">
              <input type="checkbox" id="chk-comp-def" ${this.sharedParams.showDeflectionOverlay ? 'checked' : ''}>
              <span>Çekül Sapması Referansı &amp; θ Yayı</span>
            </label>
          </div>
          <div class="toggle-row">
            <label class="checkbox-label">
              <input type="checkbox" id="chk-comp-arcs" ${this.sharedParams.showArcs ? 'checked' : ''}>
              <span>Açı Yayları &amp; Dilimleri (A/α, v/a)</span>
            </label>
          </div>
        </div>
      `;

      // Event Listeners for Comparison Mode
      const bind = (id, event, fn) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener(event, fn);
      };

      bind('slider-comp-az', 'input', (e) => {
        this.sharedParams.azimuthDeg = parseFloat(e.target.value);
        document.getElementById('val-comp-az').textContent = `${this.sharedParams.azimuthDeg.toFixed(1)}°`;
        this.updateTopocentricScenes();
      });

      bind('slider-comp-vert', 'input', (e) => {
        this.sharedParams.verticalAngleDeg = parseFloat(e.target.value);
        document.getElementById('val-comp-vert').textContent = `${this.sharedParams.verticalAngleDeg.toFixed(1)}°`;
        this.updateTopocentricScenes();
      });

      bind('slider-comp-range', 'input', (e) => {
        this.sharedParams.range = parseFloat(e.target.value);
        document.getElementById('val-comp-range').textContent = this.sharedParams.range.toFixed(2);
        this.updateTopocentricScenes();
      });

      bind('slider-comp-xi', 'input', (e) => {
        this.sharedParams.xiDeg = parseFloat(e.target.value);
        document.getElementById('val-comp-xi').textContent = `${this.sharedParams.xiDeg.toFixed(1)}°`;
        this.updateTopocentricScenes();
      });

      bind('slider-comp-eta', 'input', (e) => {
        this.sharedParams.etaDeg = parseFloat(e.target.value);
        document.getElementById('val-comp-eta').textContent = `${this.sharedParams.etaDeg.toFixed(1)}°`;
        this.updateTopocentricScenes();
      });

      bind('btn-comp-def-preset', 'click', () => {
        this.sharedParams.xiDeg = 6.0;
        this.sharedParams.etaDeg = 5.0;
        const sXi = document.getElementById('slider-comp-xi');
        const sEta = document.getElementById('slider-comp-eta');
        if (sXi) sXi.value = 6.0;
        if (sEta) sEta.value = 5.0;
        const vXi = document.getElementById('val-comp-xi');
        const vEta = document.getElementById('val-comp-eta');
        if (vXi) vXi.textContent = '6.0°';
        if (vEta) vEta.textContent = '5.0°';
        this.updateTopocentricScenes();
      });

      bind('btn-comp-def-zero', 'click', () => {
        this.sharedParams.xiDeg = 0.0;
        this.sharedParams.etaDeg = 0.0;
        const sXi = document.getElementById('slider-comp-xi');
        const sEta = document.getElementById('slider-comp-eta');
        if (sXi) sXi.value = 0.0;
        if (sEta) sEta.value = 0.0;
        const vXi = document.getElementById('val-comp-xi');
        const vEta = document.getElementById('val-comp-eta');
        if (vXi) vXi.textContent = '0.0°';
        if (vEta) vEta.textContent = '0.0°';
        this.updateTopocentricScenes();
      });

      bind('chk-comp-terrain', 'change', (e) => {
        this.sharedParams.showTerrain = e.target.checked;
        this.updateTopocentricScenes();
      });

      bind('chk-comp-plane', 'change', (e) => {
        this.sharedParams.showPlane = e.target.checked;
        this.updateTopocentricScenes();
      });

      bind('chk-comp-def', 'change', (e) => {
        this.sharedParams.showDeflectionOverlay = e.target.checked;
        this.updateTopocentricScenes();
      });

      bind('chk-comp-arcs', 'change', (e) => {
        this.sharedParams.showArcs = e.target.checked;
        this.updateTopocentricScenes();
      });
    }

    // TERRESTRIAL GEOCENTRIC (ECEF) MODU İÇİN SAĞ YAN PANEL
    renderGeocentricSidebar(container) {
      const geoParams = this.sceneManager.geocentricSys.params;

      container.innerHTML = `
        <div class="control-card">
          <div class="card-header">
            <span class="card-title">🌍 Hedef / Uydu Konumu</span>
            <span class="sys-badge-pill" style="background:#EBF5FB; color:#2980B9;">Sağ-elli</span>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <label class="slider-label" for="slider-geo-phi">Jeodezik Enlem (φ)</label>
              <span class="slider-val" id="val-geo-phi">${geoParams.satelliteLatDeg.toFixed(1)}°</span>
            </div>
            <input type="range" class="custom-slider" id="slider-geo-phi" min="-85" max="85" step="1" value="${geoParams.satelliteLatDeg}">
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <label class="slider-label" for="slider-geo-lam">Jeodezik Boylam (λ)</label>
              <span class="slider-val" id="val-geo-lam">${geoParams.satelliteLonDeg.toFixed(1)}°</span>
            </div>
            <input type="range" class="custom-slider" id="slider-geo-lam" min="-180" max="180" step="1" value="${geoParams.satelliteLonDeg}">
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <label class="slider-label" for="slider-geo-h">Hedef Yüksekliği (h)</label>
              <span class="slider-val" id="val-geo-h">${geoParams.satelliteHeight.toFixed(2)}</span>
            </div>
            <input type="range" class="custom-slider" id="slider-geo-h" min="0.5" max="4.5" step="0.1" value="${geoParams.satelliteHeight}">
          </div>
        </div>

        <!-- İLLÜSTRASYON KATMANLARI KARTI (ECEF) -->
        <div class="control-card">
          <div class="card-header">
            <span class="card-title">İllüstrasyon Katmanları</span>
          </div>

          <div class="toggle-row">
            <label class="checkbox-label">
              <input type="checkbox" id="chk-geo-octant" ${geoParams.showOctantCut ? 'checked' : ''}>
              <span>Küre Kesiti / Sekizdelik Dilim</span>
            </label>
          </div>
          <div class="toggle-row">
            <label class="checkbox-label">
              <input type="checkbox" id="chk-geo-layers" ${geoParams.showLayers ? 'checked' : ''}>
              <span>Dünya İç Katmanları (Çekirdek, Manto)</span>
            </label>
          </div>
          <div class="toggle-row">
            <label class="checkbox-label">
              <input type="checkbox" id="chk-geo-sat" ${geoParams.showSatellite ? 'checked' : ''}>
              <span>3D Uydu &amp; İzdüşüm Çizgileri</span>
            </label>
          </div>
          <div class="toggle-row">
            <label class="checkbox-label">
              <input type="checkbox" id="chk-geo-eq" ${geoParams.showEquatorLabel ? 'checked' : ''}>
              <span>Ekvator Çemberi &amp; Etiketi</span>
            </label>
          </div>
          <div class="toggle-row">
            <label class="checkbox-label">
              <input type="checkbox" id="chk-geo-pole" ${geoParams.showNorthPoleLabel ? 'checked' : ''}>
              <span>Kuzey Kutbu &amp; Z Ekseni</span>
            </label>
          </div>
        </div>
      `;

      const pPhi = document.getElementById('slider-geo-phi');
      const pLam = document.getElementById('slider-geo-lam');
      const pH = document.getElementById('slider-geo-h');

      const updateGeo = () => {
        const phi = parseFloat(pPhi.value);
        const lam = parseFloat(pLam.value);
        const h = parseFloat(pH.value);
        document.getElementById('val-geo-phi').textContent = `${phi.toFixed(1)}°`;
        document.getElementById('val-geo-lam').textContent = `${lam.toFixed(1)}°`;
        document.getElementById('val-geo-h').textContent = h.toFixed(2);

        this.sceneManager.geocentricSys.setParams({
          satelliteLatDeg: phi,
          satelliteLonDeg: lam,
          satelliteHeight: h
        });
        this.updateHud();
      };

      if (pPhi) pPhi.addEventListener('input', updateGeo);
      if (pLam) pLam.addEventListener('input', updateGeo);
      if (pH) pH.addEventListener('input', updateGeo);

      const bindChk = (id, paramKey) => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('change', (e) => {
            this.sceneManager.geocentricSys.setParams({ [paramKey]: e.target.checked });
            this.updateHud();
          });
        }
      };

      bindChk('chk-geo-octant', 'showOctantCut');
      bindChk('chk-geo-layers', 'showLayers');
      bindChk('chk-geo-sat', 'showSatellite');
      bindChk('chk-geo-eq', 'showEquatorLabel');
      bindChk('chk-geo-pole', 'showNorthPoleLabel');
    }

    // TEKİL LOCAL ASTRONOMIC SYSTEM (L.A.S.) SAĞ YAN PANEL
    renderSingleLasSidebar(container) {
      const p = this.sceneManager.singleLasSys.params;
      const thetaVal = Math.hypot(p.xiDeg, p.etaDeg).toFixed(2);

      container.innerHTML = `
        <div class="control-card">
          <div class="card-header">
            <span class="card-title">🔭 Astronomik Gözlem Noktası P</span>
            <span class="sys-badge-pill" style="background:#F4ECF7; color:#8E24AA;">Sol-elli (P₂)</span>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <label class="slider-label" for="slider-las-az">Astronomik Azimut (A) [Kuzeyden Saat Yönü]</label>
              <span class="slider-val" id="val-las-az">${p.azimuthDeg.toFixed(1)}°</span>
            </div>
            <input type="range" class="custom-slider" id="slider-las-az" min="0" max="360" step="1" value="${p.azimuthDeg}">
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <label class="slider-label" for="slider-las-vert">Yükseklik Açısı (v) [Ufuktan Yukarı]</label>
              <span class="slider-val" id="val-las-vert">${p.verticalAngleDeg.toFixed(1)}°</span>
            </div>
            <input type="range" class="custom-slider" id="slider-las-vert" min="5" max="85" step="1" value="${p.verticalAngleDeg}">
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <label class="slider-label" for="slider-las-range">Uydu Mesafesi (r)</label>
              <span class="slider-val" id="val-las-range">${p.range.toFixed(2)}</span>
            </div>
            <input type="range" class="custom-slider" id="slider-las-range" min="3.0" max="7.0" step="0.1" value="${p.range}">
          </div>
        </div>

        <div class="control-card">
          <div class="card-header">
            <span class="card-title">⚖️ Çekül Sapması (θ)</span>
            <span class="deflection-badge" id="badge-las-theta">θ = ${thetaVal}°</span>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <label class="slider-label" for="slider-las-xi">Meridyen Bileşeni (ξ) [K–G Sapması]</label>
              <span class="slider-val" id="val-las-xi">${p.xiDeg.toFixed(1)}°</span>
            </div>
            <input type="range" class="custom-slider" id="slider-las-xi" min="-12" max="12" step="0.5" value="${p.xiDeg}">
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <label class="slider-label" for="slider-las-eta">Birinci Düşey Bileşeni (η) [D–B Sapması]</label>
              <span class="slider-val" id="val-las-eta">${p.etaDeg.toFixed(1)}°</span>
            </div>
            <input type="range" class="custom-slider" id="slider-las-eta" min="-12" max="12" step="0.5" value="${p.etaDeg}">
          </div>

          <div class="deflection-preset-row">
            <button class="def-btn" id="btn-las-def-preset">Örnek Sapma (7.8°)</button>
            <button class="def-btn" id="btn-las-def-zero">Sıfır Sapma (0.0°)</button>
          </div>
        </div>

        <div class="control-card">
          <div class="card-header">
            <span class="card-title">İllüstrasyon Katmanları</span>
          </div>
          <div class="toggle-row">
            <label class="checkbox-label">
              <input type="checkbox" id="chk-las-terrain" ${p.showTerrain ? 'checked' : ''}>
              <span>Doğal Yeryüzü &amp; Teodolit &amp; Şakül</span>
            </label>
          </div>
          <div class="toggle-row">
            <label class="checkbox-label">
              <input type="checkbox" id="chk-las-plane" ${p.showPlane ? 'checked' : ''}>
              <span>Ufuk Düzlemi Diski</span>
            </label>
          </div>
          <div class="toggle-row">
            <label class="checkbox-label">
              <input type="checkbox" id="chk-las-def" ${p.showDeflectionOverlay ? 'checked' : ''}>
              <span>Referans Elipsoit Normali (z_LG) &amp; θ Yayı</span>
            </label>
          </div>
          <div class="toggle-row">
            <label class="checkbox-label">
              <input type="checkbox" id="chk-las-arcs" ${p.showArcs ? 'checked' : ''}>
              <span>Açı Dilimleri (A &amp; v)</span>
            </label>
          </div>
        </div>
      `;

      const updateLas = () => {
        const az = parseFloat(document.getElementById('slider-las-az').value);
        const vert = parseFloat(document.getElementById('slider-las-vert').value);
        const r = parseFloat(document.getElementById('slider-las-range').value);
        const xi = parseFloat(document.getElementById('slider-las-xi').value);
        const eta = parseFloat(document.getElementById('slider-las-eta').value);

        document.getElementById('val-las-az').textContent = `${az.toFixed(1)}°`;
        document.getElementById('val-las-vert').textContent = `${vert.toFixed(1)}°`;
        document.getElementById('val-las-range').textContent = r.toFixed(2);
        document.getElementById('val-las-xi').textContent = `${xi.toFixed(1)}°`;
        document.getElementById('val-las-eta').textContent = `${eta.toFixed(1)}°`;

        const theta = Math.hypot(xi, eta).toFixed(2);
        const badge = document.getElementById('badge-las-theta');
        if (badge) badge.textContent = `θ = ${theta}°`;

        this.sceneManager.singleLasSys.setParams({
          azimuthDeg: az,
          verticalAngleDeg: vert,
          range: r,
          xiDeg: xi,
          etaDeg: eta
        });
        this.updateHud();
      };

      ['slider-las-az', 'slider-las-vert', 'slider-las-range', 'slider-las-xi', 'slider-las-eta'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateLas);
      });

      const btnPreset = document.getElementById('btn-las-def-preset');
      if (btnPreset) {
        btnPreset.addEventListener('click', () => {
          document.getElementById('slider-las-xi').value = 6.0;
          document.getElementById('slider-las-eta').value = 5.0;
          updateLas();
        });
      }

      const btnZero = document.getElementById('btn-las-def-zero');
      if (btnZero) {
        btnZero.addEventListener('click', () => {
          document.getElementById('slider-las-xi').value = 0.0;
          document.getElementById('slider-las-eta').value = 0.0;
          updateLas();
        });
      }

      const bindChkLas = (id, paramKey) => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('change', (e) => {
            this.sceneManager.singleLasSys.setParams({ [paramKey]: e.target.checked });
            this.updateHud();
          });
        }
      };

      bindChkLas('chk-las-terrain', 'showTerrain');
      bindChkLas('chk-las-plane', 'showPlane');
      bindChkLas('chk-las-def', 'showDeflectionOverlay');
      bindChkLas('chk-las-arcs', 'showArcs');
    }

    // TEKİL LOCAL GEODETIC SYSTEM (L.G.S.) SAĞ YAN PANEL
    renderSingleLgsSidebar(container) {
      const p = this.sceneManager.singleLgsSys.params;
      const thetaVal = Math.hypot(p.xiDeg, p.etaDeg).toFixed(2);

      container.innerHTML = `
        <div class="control-card">
          <div class="card-header">
            <span class="card-title">📐 Jeodezik İstasyon Noktası P</span>
            <span class="sys-badge-pill" style="background:#FBEEE6; color:#D35400;">Sol-elli (P₂)</span>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <label class="slider-label" for="slider-lgs-az">Jeodezik Azimut (α) [Kuzeyden Saat Yönü]</label>
              <span class="slider-val" id="val-lgs-az">${p.azimuthDeg.toFixed(1)}°</span>
            </div>
            <input type="range" class="custom-slider" id="slider-lgs-az" min="0" max="360" step="1" value="${p.azimuthDeg}">
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <label class="slider-label" for="slider-lgs-vert">Düşey Yükseklik Açısı (a) [Tanjant Düzleminden]</label>
              <span class="slider-val" id="val-lgs-vert">${p.verticalAngleDeg.toFixed(1)}°</span>
            </div>
            <input type="range" class="custom-slider" id="slider-lgs-vert" min="5" max="85" step="1" value="${p.verticalAngleDeg}">
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <label class="slider-label" for="slider-lgs-range">Uydu Mesafesi (r)</label>
              <span class="slider-val" id="val-lgs-range">${p.range.toFixed(2)}</span>
            </div>
            <input type="range" class="custom-slider" id="slider-lgs-range" min="3.0" max="7.0" step="0.1" value="${p.range}">
          </div>
        </div>

        <div class="control-card">
          <div class="card-header">
            <span class="card-title">⚖️ Çekül Sapması (θ)</span>
            <span class="deflection-badge" id="badge-lgs-theta">θ = ${thetaVal}°</span>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <label class="slider-label" for="slider-lgs-xi">Meridyen Bileşeni (ξ) [K–G Sapması]</label>
              <span class="slider-val" id="val-lgs-xi">${p.xiDeg.toFixed(1)}°</span>
            </div>
            <input type="range" class="custom-slider" id="slider-lgs-xi" min="-12" max="12" step="0.5" value="${p.xiDeg}">
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <label class="slider-label" for="slider-lgs-eta">Birinci Düşey Bileşeni (η) [D–B Sapması]</label>
              <span class="slider-val" id="val-lgs-eta">${p.etaDeg.toFixed(1)}°</span>
            </div>
            <input type="range" class="custom-slider" id="slider-lgs-eta" min="-12" max="12" step="0.5" value="${p.etaDeg}">
          </div>

          <div class="deflection-preset-row">
            <button class="def-btn" id="btn-lgs-def-preset">Örnek Sapma (7.8°)</button>
            <button class="def-btn" id="btn-lgs-def-zero">Sıfır Sapma (0.0°)</button>
          </div>
        </div>

        <div class="control-card">
          <div class="card-header">
            <span class="card-title">İllüstrasyon Katmanları</span>
          </div>
          <div class="toggle-row">
            <label class="checkbox-label">
              <input type="checkbox" id="chk-lgs-ellipsoid" ${p.showEllipsoid ? 'checked' : ''}>
              <span>3D Referans Elipsoidi Kubbesi</span>
            </label>
          </div>
          <div class="toggle-row">
            <label class="checkbox-label">
              <input type="checkbox" id="chk-lgs-plane" ${p.showPlane ? 'checked' : ''}>
              <span>Tanjant Düzlemi (z = 0)</span>
            </label>
          </div>
          <div class="toggle-row">
            <label class="checkbox-label">
              <input type="checkbox" id="chk-lgs-def" ${p.showDeflectionOverlay ? 'checked' : ''}>
              <span>Referans Çekül Doğrultusu (z_LA) &amp; θ Yayı</span>
            </label>
          </div>
          <div class="toggle-row">
            <label class="checkbox-label">
              <input type="checkbox" id="chk-lgs-arcs" ${p.showArcs ? 'checked' : ''}>
              <span>Açı Dilimleri (α &amp; a)</span>
            </label>
          </div>
        </div>
      `;

      const updateLgs = () => {
        const az = parseFloat(document.getElementById('slider-lgs-az').value);
        const vert = parseFloat(document.getElementById('slider-lgs-vert').value);
        const r = parseFloat(document.getElementById('slider-lgs-range').value);
        const xi = parseFloat(document.getElementById('slider-lgs-xi').value);
        const eta = parseFloat(document.getElementById('slider-lgs-eta').value);

        document.getElementById('val-lgs-az').textContent = `${az.toFixed(1)}°`;
        document.getElementById('val-lgs-vert').textContent = `${vert.toFixed(1)}°`;
        document.getElementById('val-lgs-range').textContent = r.toFixed(2);
        document.getElementById('val-lgs-xi').textContent = `${xi.toFixed(1)}°`;
        document.getElementById('val-lgs-eta').textContent = `${eta.toFixed(1)}°`;

        const theta = Math.hypot(xi, eta).toFixed(2);
        const badge = document.getElementById('badge-lgs-theta');
        if (badge) badge.textContent = `θ = ${theta}°`;

        this.sceneManager.singleLgsSys.setParams({
          azimuthDeg: az,
          verticalAngleDeg: vert,
          range: r,
          xiDeg: xi,
          etaDeg: eta
        });
        this.updateHud();
      };

      ['slider-lgs-az', 'slider-lgs-vert', 'slider-lgs-range', 'slider-lgs-xi', 'slider-lgs-eta'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateLgs);
      });

      const btnPreset = document.getElementById('btn-lgs-def-preset');
      if (btnPreset) {
        btnPreset.addEventListener('click', () => {
          document.getElementById('slider-lgs-xi').value = 6.0;
          document.getElementById('slider-lgs-eta').value = 5.0;
          updateLgs();
        });
      }

      const btnZero = document.getElementById('btn-lgs-def-zero');
      if (btnZero) {
        btnZero.addEventListener('click', () => {
          document.getElementById('slider-lgs-xi').value = 0.0;
          document.getElementById('slider-lgs-eta').value = 0.0;
          updateLgs();
        });
      }

      const bindChkLgs = (id, paramKey) => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('change', (e) => {
            this.sceneManager.singleLgsSys.setParams({ [paramKey]: e.target.checked });
            this.updateHud();
          });
        }
      };

      bindChkLgs('chk-lgs-ellipsoid', 'showEllipsoid');
      bindChkLgs('chk-lgs-plane', 'showPlane');
      bindChkLgs('chk-lgs-def', 'showDeflectionOverlay');
      bindChkLgs('chk-lgs-arcs', 'showArcs');
    }

    updateTopocentricScenes() {
      const p = {
        azimuthDeg: this.sharedParams.azimuthDeg,
        verticalAngleDeg: this.sharedParams.verticalAngleDeg,
        range: this.sharedParams.range,
        xiDeg: this.sharedParams.xiDeg,
        etaDeg: this.sharedParams.etaDeg,
        showTerrain: this.sharedParams.showTerrain,
        showEllipsoid: this.sharedParams.showTerrain,
        showPlane: this.sharedParams.showPlane,
        showDeflectionOverlay: this.sharedParams.showDeflectionOverlay,
        showArcs: this.sharedParams.showArcs
      };

      // L.G.S. için çekül sapmasıyla dönüştürülmüş açılar ve mesafe
      const azRad = THREE.MathUtils.degToRad(p.azimuthDeg);
      const vRad = THREE.MathUtils.degToRad(p.verticalAngleDeg);
      const r = p.range;
      const x = r * Math.cos(vRad) * Math.cos(azRad);
      const y = r * Math.cos(vRad) * Math.sin(azRad);
      const z = r * Math.sin(vRad);

      const xiRad = THREE.MathUtils.degToRad(p.xiDeg);
      const etaRad = THREE.MathUtils.degToRad(p.etaDeg);
      const x_lg = x - z * xiRad;
      const y_lg = y - z * etaRad;
      const z_lg = z + x * xiRad + y * etaRad;
      const r_lg = Math.hypot(x_lg, y_lg, z_lg) || 1;
      const a_deg = THREE.MathUtils.radToDeg(Math.asin(Math.min(1, Math.max(-1, z_lg / r_lg))));
      const alpha_deg = (THREE.MathUtils.radToDeg(Math.atan2(y_lg, x_lg)) + 360) % 360;

      const pLgs = Object.assign({}, p, {
        azimuthDeg: alpha_deg,
        verticalAngleDeg: a_deg,
        range: r_lg
      });

      this.sceneManager.lasSys.setParams(p);
      this.sceneManager.lgsSys.setParams(pLgs);

      this.sceneManager.singleLasSys.setParams(p);
      this.sceneManager.singleLgsSys.setParams(p);

      const thetaVal = Math.hypot(p.xiDeg, p.etaDeg).toFixed(2);
      const thetaBadge = document.getElementById('badge-comp-theta');
      if (thetaBadge) thetaBadge.textContent = `θ = ${thetaVal}°`;

      this.updateHud();
    }

    updateHud() {
      // 1. TEKLİ GÖRÜNÜM HUD (Sol Üst Köşe)
      const hudTitle = document.getElementById('hud-title');
      const hudBadge = document.getElementById('hud-badge');
      const stats = document.getElementById('hud-stats');

      if (this.currentMode === 'geocentric') {
        if (hudTitle) hudTitle.textContent = 'Terrestrial Geocentric Cartesian C.S.';
        if (hudBadge) {
          hudBadge.textContent = 'A.T. / ECEF';
          hudBadge.className = 'info-hud-badge badge-geo';
        }
        if (stats) {
          const res = this.sceneManager.geocentricSys.params;
          const R = this.sceneManager.geocentricSys.earthRadius;
          const latRad = THREE.MathUtils.degToRad(res.satelliteLatDeg);
          const lonRad = THREE.MathUtils.degToRad(res.satelliteLonDeg);
          const satR = R + res.satelliteHeight;
          const X = satR * Math.cos(latRad) * Math.cos(lonRad);
          const Y = satR * Math.cos(latRad) * Math.sin(lonRad);
          const Z = satR * Math.sin(latRad);

          stats.innerHTML = `
            <div class="stat-row"><span class="stat-label">X (Greenwich / Ekvator):</span><span class="stat-value">${X.toFixed(2)}</span></div>
            <div class="stat-row"><span class="stat-label">Y (90°D / Ekvator):</span><span class="stat-value">${Y.toFixed(2)}</span></div>
            <div class="stat-row"><span class="stat-label">Z (Dönme Ekseni / Kutup):</span><span class="stat-value">${Z.toFixed(2)}</span></div>
            <div class="stat-row"><span class="stat-label">Jeodezik Enlem (φ):</span><span class="stat-value">${res.satelliteLatDeg.toFixed(1)}°</span></div>
            <div class="stat-row"><span class="stat-label">Jeodezik Boylam (λ):</span><span class="stat-value">${res.satelliteLonDeg.toFixed(1)}°</span></div>
            <div class="stat-row"><span class="stat-label">Hedef Yüksekliği (h):</span><span class="stat-value">${res.satelliteHeight.toFixed(2)}</span></div>
            <div class="stat-row"><span class="stat-label">Sistem Yönü:</span><span class="stat-value" style="color:#2E7D32; font-weight:700;">Sağ-elli (Right-handed)</span></div>
          `;
        }
      } else if (this.currentMode === 'local-astronomic') {
        if (hudTitle) hudTitle.textContent = 'Local Astronomic System (L.A.S.)';
        if (hudBadge) {
          hudBadge.textContent = 'L.A. / Sol-elli (P₂)';
          hudBadge.className = 'info-hud-badge badge-la';
        }
        if (stats) {
          const p = this.sceneManager.singleLasSys.params;
          const A_rad = THREE.MathUtils.degToRad(p.azimuthDeg);
          const v_rad = THREE.MathUtils.degToRad(p.verticalAngleDeg);
          const r = p.range;
          const x = r * Math.cos(v_rad) * Math.cos(A_rad);
          const y = r * Math.cos(v_rad) * Math.sin(A_rad);
          const z = r * Math.sin(v_rad);
          const theta = Math.hypot(p.xiDeg, p.etaDeg);

          stats.innerHTML = `
            <div class="stat-row"><span class="stat-label">x_LA (Astronomik Kuzey):</span><span class="stat-value">${x.toFixed(2)}</span></div>
            <div class="stat-row"><span class="stat-label">y_LA (Astronomik Doğu):</span><span class="stat-value">${y.toFixed(2)}</span></div>
            <div class="stat-row"><span class="stat-label">z_LA (Zenit / Çekül):</span><span class="stat-value">${z.toFixed(2)}</span></div>
            <div class="stat-row"><span class="stat-label">Astronomik Azimut (A):</span><span class="stat-value">${p.azimuthDeg.toFixed(1)}°</span></div>
            <div class="stat-row"><span class="stat-label">Yükseklik Açısı (v):</span><span class="stat-value">${p.verticalAngleDeg.toFixed(1)}°</span></div>
            <div class="stat-row"><span class="stat-label">Hedef Mesafesi (r):</span><span class="stat-value">${r.toFixed(2)}</span></div>
            <div class="stat-row"><span class="stat-label">Çekül Sapması (θ):</span><span class="stat-value" style="color:#8E24AA; font-weight:700;">${theta.toFixed(2)}°</span></div>
            <div class="stat-row"><span class="stat-label">Sistem Yönü:</span><span class="stat-value" style="color:#8E24AA; font-weight:700;">Sol-elli (Left-handed P₂)</span></div>
          `;
        }
      } else if (this.currentMode === 'local-geodetic') {
        if (hudTitle) hudTitle.textContent = 'Local Geodetic System (L.G.S.)';
        if (hudBadge) {
          hudBadge.textContent = 'L.G. / Sol-elli (P₂)';
          hudBadge.className = 'info-hud-badge badge-lg';
        }
        if (stats) {
          const p = this.sceneManager.singleLgsSys.params;
          const alpha_rad = THREE.MathUtils.degToRad(p.azimuthDeg);
          const a_rad = THREE.MathUtils.degToRad(p.verticalAngleDeg);
          const r = p.range;
          const x = r * Math.cos(a_rad) * Math.cos(alpha_rad);
          const y = r * Math.cos(a_rad) * Math.sin(alpha_rad);
          const z = r * Math.sin(a_rad);
          const theta = Math.hypot(p.xiDeg, p.etaDeg);

          stats.innerHTML = `
            <div class="stat-row"><span class="stat-label">x_LG (Jeodezik Kuzey):</span><span class="stat-value">${x.toFixed(2)}</span></div>
            <div class="stat-row"><span class="stat-label">y_LG (Jeodezik Doğu):</span><span class="stat-value">${y.toFixed(2)}</span></div>
            <div class="stat-row"><span class="stat-label">z_LG (Normal n):</span><span class="stat-value">${z.toFixed(2)}</span></div>
            <div class="stat-row"><span class="stat-label">Jeodezik Azimut (α):</span><span class="stat-value">${p.azimuthDeg.toFixed(1)}°</span></div>
            <div class="stat-row"><span class="stat-label">Yükseklik Açısı (a):</span><span class="stat-value">${p.verticalAngleDeg.toFixed(1)}°</span></div>
            <div class="stat-row"><span class="stat-label">Hedef Mesafesi (r):</span><span class="stat-value">${r.toFixed(2)}</span></div>
            <div class="stat-row"><span class="stat-label">Çekül Sapması (θ):</span><span class="stat-value" style="color:#D35400; font-weight:700;">${theta.toFixed(2)}°</span></div>
            <div class="stat-row"><span class="stat-label">Sistem Yönü:</span><span class="stat-value" style="color:#D35400; font-weight:700;">Sol-elli (Left-handed P₂)</span></div>
          `;
        }
      }

      // 2. YAN YANA KARŞILAŞTIRMA MODU TELEMETRİ ROZETLERİ (L.A.S. & L.G.S.)
      const telLas = document.getElementById('telemetry-las');
      const telLgs = document.getElementById('telemetry-lgs');
      if (telLas || telLgs) {
        const p = this.sharedParams;
        const azRad = THREE.MathUtils.degToRad(p.azimuthDeg);
        const vRad = THREE.MathUtils.degToRad(p.verticalAngleDeg);
        const r = p.range;
        const x = r * Math.cos(vRad) * Math.cos(azRad);
        const y = r * Math.cos(vRad) * Math.sin(azRad);
        const z = r * Math.sin(vRad);
        const theta = Math.hypot(p.xiDeg, p.etaDeg);

        if (telLas) {
          telLas.innerHTML = `
            <div class="tel-header">
              <span>L.A.S. Telemetri</span>
              <span class="sys-badge-pill" style="background:#F4ECF7; color:#8E24AA; font-size:0.65rem; padding:0.1rem 0.45rem;">P₂ Sol-elli</span>
            </div>
            <div class="tel-row"><span class="tel-lbl">x_LA (Kuzey):</span><span class="tel-val">${x.toFixed(2)}</span></div>
            <div class="tel-row"><span class="tel-lbl">y_LA (Doğu):</span><span class="tel-val">${y.toFixed(2)}</span></div>
            <div class="tel-row"><span class="tel-lbl">z_LA (Zenit):</span><span class="tel-val">${z.toFixed(2)}</span></div>
            <div class="tel-row"><span class="tel-lbl">Azimut (A):</span><span class="tel-val">${p.azimuthDeg.toFixed(1)}°</span></div>
            <div class="tel-row"><span class="tel-lbl">Yükseklik (v):</span><span class="tel-val">${p.verticalAngleDeg.toFixed(1)}°</span></div>
            <div class="tel-row"><span class="tel-lbl">Sapma (θ):</span><span class="tel-val" style="color:#8E24AA; font-weight:700;">${theta.toFixed(2)}°</span></div>
          `;
        }

        if (telLgs) {
          const xiRad = THREE.MathUtils.degToRad(p.xiDeg);
          const etaRad = THREE.MathUtils.degToRad(p.etaDeg);
          const x_lg = x - z * xiRad;
          const y_lg = y - z * etaRad;
          const z_lg = z + x * xiRad + y * etaRad;
          const r_lg = Math.hypot(x_lg, y_lg, z_lg) || 1;
          const a_deg = THREE.MathUtils.radToDeg(Math.asin(Math.min(1, Math.max(-1, z_lg / r_lg))));
          const alpha_deg = (THREE.MathUtils.radToDeg(Math.atan2(y_lg, x_lg)) + 360) % 360;

          telLgs.innerHTML = `
            <div class="tel-header">
              <span>L.G.S. Telemetri</span>
              <span class="sys-badge-pill" style="background:#FBEEE6; color:#D35400; font-size:0.65rem; padding:0.1rem 0.45rem;">P₂ Sol-elli</span>
            </div>
            <div class="tel-row"><span class="tel-lbl">x_LG (Kuzey):</span><span class="tel-val">${x_lg.toFixed(2)}</span></div>
            <div class="tel-row"><span class="tel-lbl">y_LG (Doğu):</span><span class="tel-val">${y_lg.toFixed(2)}</span></div>
            <div class="tel-row"><span class="tel-lbl">z_LG (Normal):</span><span class="tel-val">${z_lg.toFixed(2)}</span></div>
            <div class="tel-row"><span class="tel-lbl">Azimut (α):</span><span class="tel-val">${alpha_deg.toFixed(1)}°</span></div>
            <div class="tel-row"><span class="tel-lbl">Yükseklik (a):</span><span class="tel-val">${a_deg.toFixed(1)}°</span></div>
            <div class="tel-row"><span class="tel-lbl">Sapma (θ):</span><span class="tel-val" style="color:#D35400; font-weight:700;">${theta.toFixed(2)}°</span></div>
          `;
        }
      }
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    window.geoApp = new App();
  });

})();

