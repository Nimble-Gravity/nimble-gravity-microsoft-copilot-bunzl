// The 3D vault. Visuals and animation timing come from the original prototype;
// this module wraps them behind a small API so game logic never touches THREE:
//   glideTo(i, instant)  — move camera to room i (i === roomCount → exit vault)
//   setActive(i)         — mark room i as the one being attempted
//   startUnlock(i)       — play the unlock animation for room i
//   openInstant(i)       — jump room i to its unlocked end-state (refresh restore)
//   setDone(v)           — spin the exit vault door
//   celebrate()          — confetti + exit glow
// Throws if WebGL is unavailable — callers fall back to a no-3D mode.
import { floorTex, steelTex, wallTex, keypadTex, signTex, envMap } from './textures.js';

const THREE = globalThis.THREE;

export function createScene({ container, roomCount, reduceMotion }) {
  const env = envMap();

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070b14);
  scene.fog = new THREE.Fog(0x070b14, 34, 85);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);

  /* Lighting: cool ambient + warm accents */
  scene.add(new THREE.AmbientLight(0x2a3854, 0.65));
  const key = new THREE.DirectionalLight(0xaebfdd, 0.35);
  key.position.set(-16, 24, 12);
  scene.add(key);

  /* Active-room spotlight (moves as teams progress) */
  const spot = new THREE.SpotLight(0xfff2dd, 1.35, 40, Math.PI / 5.5, 0.45, 1.2);
  spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024);
  scene.add(spot);
  scene.add(spot.target);

  /* Architecture */
  const ROOM_W = 8, ROOM_D = 7, ROOM_H = 4.6, GAP = 3.5, CEIL_H = 8.2;
  const startX = -((roomCount - 1) / 2) * (ROOM_W + GAP);
  const endX = startX + (roomCount - 1) * (ROOM_W + GAP);

  const floorMat = new THREE.MeshStandardMaterial({
    map: floorTex(), color: 0xffffff, roughness: 0.28, metalness: 0.55,
    envMap: env, envMapIntensity: 0.7,
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(170, 170), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  /* Back wall */
  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(170, CEIL_H),
    new THREE.MeshStandardMaterial({ map: wallTex(), roughness: 0.85, metalness: 0.15 })
  );
  wall.position.set(0, CEIL_H / 2, -ROOM_D / 2 - 4.5);
  scene.add(wall);

  /* Ceiling with recessed light panels */
  const ceil = new THREE.Mesh(
    new THREE.PlaneGeometry(170, 60),
    new THREE.MeshStandardMaterial({ color: 0x0a101c, roughness: 0.95, metalness: 0.05 })
  );
  ceil.rotation.x = Math.PI / 2;
  ceil.position.y = CEIL_H;
  scene.add(ceil);
  for (let i = -8; i <= 10; i++) {
    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 1.1),
      new THREE.MeshBasicMaterial({ color: 0xcfdbee })
    );
    panel.rotation.x = Math.PI / 2;
    panel.position.set(i * 4.2, CEIL_H - 0.03, 4.5);
    scene.add(panel);
  }

  /* Corridor guide lights */
  for (let i = 0; i < 30; i++) {
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.03, 1.4),
      new THREE.MeshBasicMaterial({ color: 0x46587a })
    );
    strip.position.set(-23 + i * 1.7, 0.03, 6.2);
    scene.add(strip);
  }

  const steelMat = new THREE.MeshStandardMaterial({
    map: steelTex(), color: 0xffffff, roughness: 0.32, metalness: 0.9,
    envMap: env, envMapIntensity: 0.9,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xaac6d8, transparent: true, opacity: 0.09, roughness: 0.05, metalness: 0.1,
    envMap: env, envMapIntensity: 0.5, side: THREE.DoubleSide,
  });

  function makeLock() {
    const g = new THREE.Group();
    const mk = (geo, op) => new THREE.Mesh(
      geo, new THREE.MeshBasicMaterial({ color: 0xE0A93E, transparent: true, opacity: op })
    );
    const ring = mk(new THREE.TorusGeometry(0.85, 0.04, 12, 64), 0.95);
    const ring2 = mk(new THREE.TorusGeometry(0.62, 0.026, 12, 64), 0.5);
    ring2.rotation.x = Math.PI / 3;
    const body = mk(new THREE.BoxGeometry(0.48, 0.4, 0.14), 0.95);
    const shackle = mk(new THREE.TorusGeometry(0.18, 0.045, 10, 32, Math.PI), 0.95);
    shackle.position.y = 0.21;
    g.add(ring, ring2, body, shackle);
    return g;
  }

  const rooms3d = [];
  function makeRoom(i) {
    const g = new THREE.Group();
    const x = startX + i * (ROOM_W + GAP);
    g.position.set(x, 0, 0);

    const pillarGeo = new THREE.BoxGeometry(0.3, ROOM_H, 0.3);
    [[-ROOM_W / 2, -ROOM_D / 2], [ROOM_W / 2, -ROOM_D / 2], [-ROOM_W / 2, ROOM_D / 2], [ROOM_W / 2, ROOM_D / 2]]
      .forEach(([px, pz]) => {
        const p = new THREE.Mesh(pillarGeo, steelMat);
        p.position.set(px, ROOM_H / 2, pz);
        p.castShadow = true;
        g.add(p);
      });
    const beamX = new THREE.BoxGeometry(ROOM_W + 0.3, 0.3, 0.3);
    const beamZ = new THREE.BoxGeometry(0.3, 0.3, ROOM_D + 0.3);
    [[0, -ROOM_D / 2], [0, ROOM_D / 2]].forEach(([px, pz]) => {
      const b = new THREE.Mesh(beamX, steelMat);
      b.position.set(px, ROOM_H, pz);
      g.add(b);
    });
    [[-ROOM_W / 2, 0], [ROOM_W / 2, 0]].forEach(([px, pz]) => {
      const b = new THREE.Mesh(beamZ, steelMat);
      b.position.set(px, ROOM_H, pz);
      g.add(b);
    });
    // base skirting
    const skirt = new THREE.Mesh(new THREE.BoxGeometry(ROOM_W + 0.3, 0.16, 0.34), steelMat);
    skirt.position.set(0, 0.08, ROOM_D / 2);
    g.add(skirt);

    // glass walls
    const back = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_H), glassMat);
    back.position.set(0, ROOM_H / 2, -ROOM_D / 2);
    g.add(back);
    const sideGeo = new THREE.PlaneGeometry(ROOM_D, ROOM_H);
    const sL = new THREE.Mesh(sideGeo, glassMat);
    sL.rotation.y = Math.PI / 2;
    sL.position.set(-ROOM_W / 2, ROOM_H / 2, 0);
    g.add(sL);
    const sR = new THREE.Mesh(sideGeo, glassMat);
    sR.rotation.y = Math.PI / 2;
    sR.position.set(ROOM_W / 2, ROOM_H / 2, 0);
    g.add(sR);

    // sliding doors with steel handles
    const doorMat = new THREE.MeshPhysicalMaterial({
      color: 0xbcd6e6, transparent: true, opacity: 0.16,
      roughness: 0.06, metalness: 0.15, envMap: env, envMapIntensity: 0.6, side: THREE.DoubleSide,
    });
    const dGeo = new THREE.PlaneGeometry(ROOM_W / 2, ROOM_H);
    const doorL = new THREE.Mesh(dGeo, doorMat.clone());
    doorL.position.set(-ROOM_W / 4, ROOM_H / 2, ROOM_D / 2);
    const doorR = new THREE.Mesh(dGeo, doorMat.clone());
    doorR.position.set(ROOM_W / 4, ROOM_H / 2, ROOM_D / 2);
    const hGeo = new THREE.BoxGeometry(0.09, 1.4, 0.09);
    const hL = new THREE.Mesh(hGeo, steelMat);
    hL.position.set(ROOM_W / 4 - 0.35, 0, 0.06);
    doorL.add(hL);
    const hR = new THREE.Mesh(hGeo, steelMat);
    hR.position.set(-ROOM_W / 4 + 0.35, 0, 0.06);
    doorR.add(hR);
    g.add(doorL, doorR);

    // door status strip (red -> green)
    const stripMat = new THREE.MeshBasicMaterial({ color: 0xE06A5A });
    const strip = new THREE.Mesh(new THREE.BoxGeometry(ROOM_W - 0.6, 0.09, 0.09), stripMat);
    strip.position.set(0, ROOM_H - 0.28, ROOM_D / 2 + 0.06);
    g.add(strip);

    // signage above door
    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 0.86),
      new THREE.MeshBasicMaterial({ map: signTex(i + 1), transparent: false })
    );
    sign.position.set(0, ROOM_H + 0.75, ROOM_D / 2 + 0.02);
    g.add(sign);

    // keypad pedestal in front of the door
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.15, 0.22), steelMat);
    post.position.set(ROOM_W / 2 - 1.1, 0.575, ROOM_D / 2 + 1.5);
    post.castShadow = true;
    g.add(post);
    const padMatLocked = new THREE.MeshBasicMaterial({ map: keypadTex('red') });
    const padMatOpen = new THREE.MeshBasicMaterial({ map: keypadTex('green') });
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.8, 0.09), padMatLocked);
    pad.position.set(ROOM_W / 2 - 1.1, 1.42, ROOM_D / 2 + 1.5);
    pad.rotation.x = -0.28;
    g.add(pad);

    // pedestal + artifact
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.72, 1.1, 28), steelMat);
    ped.position.set(0, 0.55, 0);
    ped.castShadow = true;
    g.add(ped);
    const artifact = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.42),
      new THREE.MeshStandardMaterial({
        color: 0x58C7B4, emissive: 0x11463d, roughness: 0.15,
        metalness: 0.7, envMap: env, envMapIntensity: 1.1,
      })
    );
    artifact.position.set(0, 1.66, 0);
    g.add(artifact);

    const glow = new THREE.PointLight(0x58C7B4, 0, 13);
    glow.position.set(0, ROOM_H - 1, 0);
    g.add(glow);

    const lock = makeLock();
    lock.position.set(0, ROOM_H + 1.35, 0);
    g.add(lock);

    scene.add(g);
    return {
      group: g, doorL, doorR, lock, glow, artifact, strip, pad, padMatOpen, x,
      unlockT: -1, doorT: 0, state: i === 0 ? 'active' : 'locked',
    };
  }
  for (let i = 0; i < roomCount; i++) rooms3d.push(makeRoom(i));

  /* Exit vault door */
  const exitDoor = new THREE.Group();
  {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.38, 18, 80), steelMat);
    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(2.35, 2.35, 0.55, 56),
      new THREE.MeshStandardMaterial({
        color: 0x26344c, roughness: 0.3, metalness: 0.9, envMap: env, envMapIntensity: 0.9,
      })
    );
    hub.rotation.x = Math.PI / 2;
    for (let a = 0; a < 3; a++) {
      const sp = new THREE.Mesh(new THREE.BoxGeometry(0.22, 4.3, 0.22), steelMat);
      sp.rotation.z = a * Math.PI / 3;
      sp.position.z = 0.32;
      exitDoor.add(sp);
    }
    // bolts around the ring
    for (let a = 0; a < 12; a++) {
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.2, 10), steelMat);
      bolt.rotation.x = Math.PI / 2;
      bolt.position.set(Math.cos(a / 12 * Math.PI * 2) * 2.6, Math.sin(a / 12 * Math.PI * 2) * 2.6, 0.36);
      exitDoor.add(bolt);
    }
    exitDoor.add(ring, hub);
    exitDoor.position.set(endX + ROOM_W / 2 + 7, 3.1, 0);
    exitDoor.rotation.y = -Math.PI / 2;
    scene.add(exitDoor);
  }
  const exitGlow = new THREE.PointLight(0xE0A93E, 0.4, 18);
  exitGlow.position.set(endX + ROOM_W / 2 + 5.5, 3.4, 2);
  scene.add(exitGlow);

  /* Dust motes */
  let motes = null;
  {
    const n = 170, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = startX - 6 + Math.random() * (endX - startX + 22);
      pos[i * 3 + 1] = 0.4 + Math.random() * 6.5;
      pos[i * 3 + 2] = -3 + Math.random() * 11;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    motes = new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0x8fa4c4, size: 0.045, transparent: true, opacity: 0.5, depthWrite: false,
    }));
    scene.add(motes);
  }

  /* Confetti */
  let confetti = null;
  function launchConfetti() {
    const n = 350, pos = new Float32Array(n * 3), vel = [];
    const cx = exitDoor.position.x - 2;
    for (let i = 0; i < n; i++) {
      pos[i * 3] = cx;
      pos[i * 3 + 1] = 3;
      pos[i * 3 + 2] = 0;
      vel.push([(Math.random() - 0.5) * 0.22, Math.random() * 0.3 + 0.08, (Math.random() - 0.5) * 0.22]);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    confetti = {
      pts: new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.18, color: 0xE0A93E })),
      vel, life: 0,
    };
    scene.add(confetti.pts);
  }

  /* Camera */
  let done = false;
  function camTargetFor(i) {
    if (i >= roomCount) {
      return {
        pos: new THREE.Vector3(exitDoor.position.x - 14, 6.4, 14),
        look: new THREE.Vector3(exitDoor.position.x, 3, 0),
      };
    }
    const x = rooms3d[i].x;
    return { pos: new THREE.Vector3(x - 4.2, 6.6, 15.8), look: new THREE.Vector3(x, 1.9, 0) };
  }
  let camFrom = camTargetFor(0), camTo = camTargetFor(0), camT = 1;
  camera.position.copy(camTo.pos);
  const lookCur = camTo.look.clone();

  function glideTo(i, instant = false) {
    camFrom = { pos: camera.position.clone(), look: lookCur.clone() };
    camTo = camTargetFor(i);
    camT = (reduceMotion || instant) ? 1 : 0;
    if (camT === 1) {
      camera.position.copy(camTo.pos);
      lookCur.copy(camTo.look);
    }
    // move the spotlight
    const t = i >= roomCount ? exitDoor.position : new THREE.Vector3(rooms3d[i].x, 0, 0);
    spot.position.set(t.x, CEIL_H - 0.4, 4.4);
    spot.target.position.set(t.x, 0, 1.4);
  }
  spot.position.set(rooms3d[0].x, CEIL_H - 0.4, 4.4);
  spot.target.position.set(rooms3d[0].x, 0, 1.4);
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function resize() {
    const r = container.getBoundingClientRect();
    renderer.setSize(r.width, r.height);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize);
  resize();

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    if (camT < 1) camT = Math.min(1, camT + dt / 1.8);
    const e = easeInOut(camT);
    camera.position.lerpVectors(camFrom.pos, camTo.pos, e);
    lookCur.lerpVectors(camFrom.look, camTo.look, e);
    if (!reduceMotion) {
      camera.position.y += Math.sin(t * 0.5) * 0.05;
      camera.position.x += Math.sin(t * 0.31) * 0.045;
    }
    camera.lookAt(lookCur);

    rooms3d.forEach((r, i) => {
      if (r.state !== 'open' || r.unlockT >= 0) {
        r.lock.rotation.y += dt * (r.state === 'active' ? 1.1 : 0.35);
        if (!reduceMotion) {
          r.lock.position.y = ROOM_H + 1.35 + Math.sin(t * 1.4 + i) * 0.11;
          // hologram flicker
          const f = 0.86 + Math.sin(t * 23 + i * 7) * 0.06 + Math.sin(t * 61 + i * 3) * 0.04;
          r.lock.children.forEach((m) => {
            if (r.unlockT < 0) m.material.opacity = m === r.lock.children[1] ? 0.5 * f : 0.95 * f;
          });
        }
      }
      r.artifact.rotation.y += dt * 0.6;
      if (!reduceMotion) r.artifact.position.y = 1.66 + Math.sin(t * 1.1 + i * 2) * 0.05;

      if (r.unlockT >= 0) {
        r.unlockT += dt;
        const u = r.unlockT;
        r.lock.children.forEach((m) => {
          m.material.color.set(0x58C7B4);
          m.material.opacity = Math.max(0, 1 - u / 0.9);
        });
        r.lock.scale.setScalar(1 + u * 1.6);
        if (u > 0.35 && r.doorT < 1) {
          r.doorT = Math.min(1, r.doorT + dt / 1.1);
          const d = easeInOut(r.doorT);
          r.doorL.position.x = -ROOM_W / 4 - d * (ROOM_W / 2);
          r.doorR.position.x = ROOM_W / 4 + d * (ROOM_W / 2);
          r.doorL.material.opacity = 0.16 * (1 - d * 0.5);
          r.doorR.material.opacity = 0.16 * (1 - d * 0.5);
        }
        r.glow.intensity = Math.min(1.7, u * 2);
        if (u > 0.2 && r.strip.material.color.getHex() !== 0x58C7B4) {
          r.strip.material.color.set(0x58C7B4);
          r.pad.material = r.padMatOpen;
        }
        if (u > 1.2) {
          r.lock.visible = false;
          r.unlockT = -1;
          r.state = 'open';
        }
      }
    });

    if (done && !reduceMotion) exitDoor.rotation.z += dt * 0.5;

    if (motes && !reduceMotion) {
      const p = motes.geometry.attributes.position.array;
      for (let i = 0; i < p.length; i += 3) {
        p[i] += Math.sin(t * 0.3 + i) * 0.0008;
        p[i + 1] += 0.0016;
        if (p[i + 1] > 7) p[i + 1] = 0.4;
      }
      motes.geometry.attributes.position.needsUpdate = true;
    }

    if (confetti) {
      confetti.life += dt;
      const p = confetti.pts.geometry.attributes.position.array;
      confetti.vel.forEach((v, i) => {
        v[1] -= dt * 0.35;
        p[i * 3] += v[0];
        p[i * 3 + 1] += v[1];
        p[i * 3 + 2] += v[2];
        if (p[i * 3 + 1] < 0.05) {
          p[i * 3 + 1] = 0.05;
          v[1] = 0;
          v[0] *= 0.9;
          v[2] *= 0.9;
        }
      });
      confetti.pts.geometry.attributes.position.needsUpdate = true;
      confetti.pts.material.opacity = Math.max(0, 1 - confetti.life / 6);
      confetti.pts.material.transparent = true;
    }

    renderer.render(scene, camera);
  }
  animate();

  return {
    glideTo,
    setActive(i) {
      if (rooms3d[i] && rooms3d[i].state === 'locked') rooms3d[i].state = 'active';
    },
    startUnlock(i) {
      if (rooms3d[i]) rooms3d[i].unlockT = 0;
    },
    // Jump straight to the unlocked end-state — matches where startUnlock's
    // animation lands, used when restoring a refreshed session.
    openInstant(i) {
      const r = rooms3d[i];
      if (!r) return;
      r.state = 'open';
      r.unlockT = -1;
      r.doorT = 1;
      r.lock.visible = false;
      r.doorL.position.x = -ROOM_W / 4 - ROOM_W / 2;
      r.doorR.position.x = ROOM_W / 4 + ROOM_W / 2;
      r.doorL.material.opacity = 0.08;
      r.doorR.material.opacity = 0.08;
      r.glow.intensity = 1.7;
      r.strip.material.color.set(0x58C7B4);
      r.pad.material = r.padMatOpen;
    },
    setDone(v) {
      done = !!v;
    },
    celebrate() {
      launchConfetti();
      exitGlow.intensity = 1.4;
    },
  };
}
