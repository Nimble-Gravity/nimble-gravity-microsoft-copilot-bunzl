// Procedural canvas textures for the vault scene. No image assets — everything
// is drawn at startup. THREE comes from the classic CDN script in index.html.
const THREE = globalThis.THREE;

export function canvasTex(w, h, draw, repeat) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat[0], repeat[1]);
  }
  t.anisotropy = 4;
  return t;
}

/* Polished concrete floor with panel seams */
export function floorTex() {
  return canvasTex(1024, 1024, (g, w, h) => {
    g.fillStyle = '#141d2e';
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 14000; i++) {
      const v = Math.random();
      g.fillStyle = v > 0.5
        ? `rgba(255,255,255,${Math.random() * 0.022})`
        : `rgba(0,0,0,${Math.random() * 0.05})`;
      g.fillRect(Math.random() * w, Math.random() * h, 1.6, 1.6);
    }
    // large soft stains
    for (let i = 0; i < 7; i++) {
      const x = Math.random() * w, y = Math.random() * h, r = 90 + Math.random() * 160;
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, 'rgba(8,12,22,0.16)');
      gr.addColorStop(1, 'rgba(8,12,22,0)');
      g.fillStyle = gr;
      g.beginPath();
      g.arc(x, y, r, 0, 7);
      g.fill();
    }
    // seams
    g.strokeStyle = 'rgba(0,0,0,0.5)';
    g.lineWidth = 3;
    for (let i = 1; i < 4; i++) {
      g.beginPath(); g.moveTo(i * w / 4, 0); g.lineTo(i * w / 4, h); g.stroke();
      g.beginPath(); g.moveTo(0, i * h / 4); g.lineTo(w, i * h / 4); g.stroke();
    }
    g.strokeStyle = 'rgba(255,255,255,0.045)';
    g.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      g.beginPath(); g.moveTo(i * w / 4 + 2, 0); g.lineTo(i * w / 4 + 2, h); g.stroke();
      g.beginPath(); g.moveTo(0, i * h / 4 + 2); g.lineTo(w, i * h / 4 + 2); g.stroke();
    }
  }, [7, 7]);
}

/* Brushed steel */
export function steelTex() {
  return canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#2A3648';
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) {
      const y = Math.random() * h;
      g.strokeStyle = `rgba(${Math.random() > 0.5 ? 255 : 0},${Math.random() > 0.5 ? 255 : 255},255,${Math.random() * 0.05})`;
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(w, y + (Math.random() - 0.5) * 3);
      g.stroke();
    }
  }, [1, 2]);
}

/* Dark wall panels */
export function wallTex() {
  return canvasTex(1024, 512, (g, w, h) => {
    g.fillStyle = '#0e1524';
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 5000; i++) {
      g.fillStyle = `rgba(255,255,255,${Math.random() * 0.012})`;
      g.fillRect(Math.random() * w, Math.random() * h, 2, 2);
    }
    g.strokeStyle = 'rgba(0,0,0,0.6)';
    g.lineWidth = 4;
    for (let i = 1; i < 8; i++) { g.beginPath(); g.moveTo(i * w / 8, 0); g.lineTo(i * w / 8, h); g.stroke(); }
    g.strokeStyle = 'rgba(90,110,140,0.08)';
    g.lineWidth = 1;
    for (let i = 1; i < 8; i++) { g.beginPath(); g.moveTo(i * w / 8 + 3, 0); g.lineTo(i * w / 8 + 3, h); g.stroke(); }
  }, [3, 1]);
}

/* Keypad face — led is 'red' (locked) or 'green' (open) */
export function keypadTex(led) {
  return canvasTex(256, 384, (g, w, h) => {
    g.fillStyle = '#151d2c';
    g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(120,140,170,0.25)';
    g.lineWidth = 4;
    g.strokeRect(6, 6, w - 12, h - 12);
    // screen
    g.fillStyle = '#0a0f1a';
    g.fillRect(28, 26, w - 56, 58);
    g.fillStyle = led === 'green' ? '#58C7B4' : '#E0A93E';
    g.font = '600 26px monospace';
    g.textAlign = 'center';
    g.fillText(led === 'green' ? 'OPEN' : 'LOCKED', w / 2, 64);
    // keys
    for (let r = 0; r < 4; r++) for (let c2 = 0; c2 < 3; c2++) {
      const x = 34 + c2 * 66, y = 110 + r * 62;
      g.fillStyle = '#1e2940';
      g.fillRect(x, y, 52, 46);
      g.fillStyle = 'rgba(255,255,255,0.06)';
      g.fillRect(x, y, 52, 6);
      g.fillStyle = '#8A97A8';
      g.font = '500 20px monospace';
      g.fillText(['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'][r * 3 + c2], x + 26, y + 31);
    }
    // led dot
    g.fillStyle = led === 'green' ? '#58C7B4' : '#E06A5A';
    g.beginPath();
    g.arc(w - 30, 40, 7, 0, 7);
    g.fill();
  });
}

/* Room number sign */
export function signTex(n) {
  return canvasTex(512, 170, (g, w, h) => {
    g.fillStyle = '#0d1422';
    g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(224,169,62,0.55)';
    g.lineWidth = 5;
    g.strokeRect(8, 8, w - 16, h - 16);
    g.fillStyle = '#E0A93E';
    g.font = '700 84px "Saira Semi Condensed", sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('ROOM 0' + n, w / 2, h / 2 + 4);
  });
}

/* Procedural environment cubemap (fake reflections) */
export function envMap() {
  const faces = [];
  for (let i = 0; i < 6; i++) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 64);
    gr.addColorStop(0, '#1a2438');
    gr.addColorStop(0.55, '#0d1422');
    gr.addColorStop(1, '#070b14');
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    if (i === 2) { // top face: ceiling light blobs
      for (let j = 0; j < 5; j++) {
        g.fillStyle = 'rgba(200,215,235,0.5)';
        g.fillRect(6 + j * 12, 20 + (j % 2) * 14, 8, 4);
      }
    }
    faces.push(c);
  }
  const tex = new THREE.CubeTexture(faces);
  tex.needsUpdate = true;
  return tex;
}
