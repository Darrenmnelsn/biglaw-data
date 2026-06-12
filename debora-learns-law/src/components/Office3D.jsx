import { Canvas, useFrame } from "@react-three/fiber";
import { memo, useMemo, useRef } from "react";
import * as THREE from "three";

/* =========================================================================
   A low-poly 3D law office, rendered with react-three-fiber.
   All meshes are built from primitives — no external models — so the bundle
   stays small. Real lighting, real shadows, real depth.
   ========================================================================= */

const ROOM_W = 16;
const ROOM_D = 10;
const ROOM_H = 5;
const BENCH_SLOTS = [-4.5, -3, -1.5, 0, 1.5];
const DESK_CONSULT = { x: 3.5, z: 1 };
const DOOR = { x: -7.6, z: 0 };
const EXIT_HAPPY = { x: 12, z: 4 };
const EXIT_ANGRY = { x: -12, z: 0 };

/* --- materials shared & memoized once --- */
function useMats() {
  return useMemo(
    () => ({
      wall: new THREE.MeshStandardMaterial({ color: "#6a4422", roughness: 0.9 }),
      wallTrim: new THREE.MeshStandardMaterial({ color: "#2a1810", roughness: 0.8 }),
      floor: new THREE.MeshStandardMaterial({ color: "#3a2010", roughness: 0.85 }),
      ceiling: new THREE.MeshStandardMaterial({ color: "#2a2018", roughness: 1 }),
      desk: new THREE.MeshStandardMaterial({ color: "#3a1c08", roughness: 0.6, metalness: 0.1 }),
      deskTop: new THREE.MeshStandardMaterial({ color: "#5a3018", roughness: 0.5, metalness: 0.1 }),
      gold: new THREE.MeshStandardMaterial({ color: "#dab84a", roughness: 0.4, metalness: 0.7 }),
      glass: new THREE.MeshStandardMaterial({
        color: "#9ec3ff",
        roughness: 0.1,
        metalness: 0.2,
        transparent: true,
        opacity: 0.55,
      }),
      paper: new THREE.MeshStandardMaterial({ color: "#fbf5e1", roughness: 0.95 }),
      black: new THREE.MeshStandardMaterial({ color: "#0a0a0a", roughness: 0.7 }),
      shelfWood: new THREE.MeshStandardMaterial({ color: "#3a2418", roughness: 0.9 }),
      benchSeat: new THREE.MeshStandardMaterial({ color: "#5a3018", roughness: 0.7 }),
      benchBack: new THREE.MeshStandardMaterial({ color: "#6a3a22", roughness: 0.7 }),
      lampShade: new THREE.MeshStandardMaterial({
        color: "#0e3a1c",
        emissive: "#7a6a20",
        emissiveIntensity: 0.2,
        roughness: 0.6,
      }),
      monitor: new THREE.MeshStandardMaterial({
        color: "#0c1e3a",
        emissive: "#2a5a7a",
        emissiveIntensity: 0.6,
        roughness: 0.2,
      }),
      mug: new THREE.MeshStandardMaterial({ color: "#fbf5e1", roughness: 0.6 }),
      mugInside: new THREE.MeshStandardMaterial({ color: "#3a1808", roughness: 0.5 }),
      diploma: new THREE.MeshStandardMaterial({ color: "#f4ead2", roughness: 0.95 }),
      frame: new THREE.MeshStandardMaterial({ color: "#8a6a3a", roughness: 0.5, metalness: 0.4 }),
      art: new THREE.MeshStandardMaterial({ color: "#0e2244", roughness: 0.5 }),
    }),
    []
  );
}

/* ========================================================================
   ROOM SHELL — walls, floor, ceiling, window cutout
   ======================================================================== */
const Room = memo(function Room() {
  const m = useMats();
  return (
    <group>
      {/* floor (parquet effect via subdivided dark stripes) */}
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <primitive object={m.floor} attach="material" />
      </mesh>
      {/* parquet stripes (lighter) */}
      {Array.from({ length: 16 }, (_, i) => (
        <mesh
          key={i}
          receiveShadow
          rotation-x={-Math.PI / 2}
          position={[-ROOM_W / 2 + 0.5 + i * 1, 0.001, 0]}
        >
          <planeGeometry args={[0.04, ROOM_D]} />
          <meshStandardMaterial color="#1f1108" roughness={0.95} />
        </mesh>
      ))}
      {/* back wall — split around the window opening */}
      <BackWallWithWindow />
      {/* side walls */}
      <mesh receiveShadow position={[-ROOM_W / 2, ROOM_H / 2, 0]} rotation-y={Math.PI / 2}>
        <planeGeometry args={[ROOM_D, ROOM_H]} />
        <primitive object={m.wall} attach="material" />
      </mesh>
      <mesh receiveShadow position={[ROOM_W / 2, ROOM_H / 2, 0]} rotation-y={-Math.PI / 2}>
        <planeGeometry args={[ROOM_D, ROOM_H]} />
        <primitive object={m.wall} attach="material" />
      </mesh>
      {/* ceiling */}
      <mesh position={[0, ROOM_H, 0]} rotation-x={Math.PI / 2}>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <primitive object={m.ceiling} attach="material" />
      </mesh>
      {/* baseboard along the back wall */}
      <mesh castShadow position={[0, 0.15, -ROOM_D / 2 + 0.05]}>
        <boxGeometry args={[ROOM_W, 0.3, 0.1]} />
        <primitive object={m.wallTrim} attach="material" />
      </mesh>
      {/* crown moulding */}
      <mesh position={[0, ROOM_H - 0.1, -ROOM_D / 2 + 0.05]}>
        <boxGeometry args={[ROOM_W, 0.2, 0.1]} />
        <primitive object={m.wallTrim} attach="material" />
      </mesh>
      <Door />
      <Diploma />
      <Painting />
      <Plaque />
      <Bookshelf />
    </group>
  );
});

const BackWallWithWindow = memo(function BackWallWithWindow() {
  const m = useMats();
  // split the back wall into 4 strips around a window opening
  const wallY = -ROOM_D / 2;
  return (
    <group position={[0, 0, wallY]}>
      {/* lower */}
      <mesh receiveShadow position={[0, 0.7, 0]}>
        <planeGeometry args={[ROOM_W, 1.4]} />
        <primitive object={m.wall} attach="material" />
      </mesh>
      {/* upper */}
      <mesh receiveShadow position={[0, ROOM_H - 0.4, 0]}>
        <planeGeometry args={[ROOM_W, 0.8]} />
        <primitive object={m.wall} attach="material" />
      </mesh>
      {/* left of window */}
      <mesh receiveShadow position={[-5, ROOM_H / 2, 0]}>
        <planeGeometry args={[6, ROOM_H - 2.2]} />
        <primitive object={m.wall} attach="material" />
      </mesh>
      {/* right of window */}
      <mesh receiveShadow position={[5, ROOM_H / 2, 0]}>
        <planeGeometry args={[6, ROOM_H - 2.2]} />
        <primitive object={m.wall} attach="material" />
      </mesh>
      {/* window glass */}
      <mesh position={[-2, ROOM_H / 2, 0.01]}>
        <planeGeometry args={[4, 2.8]} />
        <meshStandardMaterial color="#fbe7b3" emissive="#fbe7b3" emissiveIntensity={0.4} />
      </mesh>
      {/* mullions */}
      <mesh position={[-2, ROOM_H / 2, 0.02]}>
        <boxGeometry args={[0.08, 2.8, 0.04]} />
        <primitive object={m.wallTrim} attach="material" />
      </mesh>
      <mesh position={[-2, ROOM_H / 2, 0.02]}>
        <boxGeometry args={[4, 0.08, 0.04]} />
        <primitive object={m.wallTrim} attach="material" />
      </mesh>
      {/* window frame */}
      <mesh position={[-2, ROOM_H / 2, 0.05]}>
        <boxGeometry args={[4.2, 3, 0.06]} />
        <meshStandardMaterial color="#1a0e08" roughness={0.8} />
      </mesh>
    </group>
  );
});

const Door = memo(function Door() {
  const m = useMats();
  return (
    <group position={[-ROOM_W / 2 + 0.05, 1.4, 3]}>
      {/* door */}
      <mesh castShadow rotation-y={Math.PI / 2}>
        <boxGeometry args={[1.6, 2.8, 0.1]} />
        <meshStandardMaterial color="#2a1808" roughness={0.7} />
      </mesh>
      {/* glass panes */}
      <mesh rotation-y={Math.PI / 2} position={[0.07, 0.4, 0]}>
        <planeGeometry args={[1.3, 1.2]} />
        <primitive object={m.glass} attach="material" />
      </mesh>
      {/* knob */}
      <mesh position={[0.1, 0, 0.5]}>
        <sphereGeometry args={[0.05]} />
        <primitive object={m.gold} attach="material" />
      </mesh>
    </group>
  );
});

const Diploma = memo(function Diploma() {
  const m = useMats();
  return (
    <group position={[-1.5, 3.6, -ROOM_D / 2 + 0.04]}>
      <mesh castShadow>
        <boxGeometry args={[0.9, 0.7, 0.05]} />
        <primitive object={m.frame} attach="material" />
      </mesh>
      <mesh position={[0, 0, 0.027]}>
        <planeGeometry args={[0.78, 0.58]} />
        <primitive object={m.diploma} attach="material" />
      </mesh>
    </group>
  );
});

const Painting = memo(function Painting() {
  const m = useMats();
  return (
    <group position={[1.5, 3.4, -ROOM_D / 2 + 0.04]}>
      <mesh castShadow>
        <boxGeometry args={[1.4, 0.9, 0.06]} />
        <primitive object={m.frame} attach="material" />
      </mesh>
      <mesh position={[0, 0, 0.034]}>
        <planeGeometry args={[1.25, 0.76]} />
        <primitive object={m.art} attach="material" />
      </mesh>
      {/* sun in painting */}
      <mesh position={[0.4, 0.18, 0.04]}>
        <circleGeometry args={[0.08, 16]} />
        <meshBasicMaterial color="#fbe7b3" />
      </mesh>
    </group>
  );
});

const Plaque = memo(function Plaque() {
  const m = useMats();
  return (
    <group position={[-4, 3.6, -ROOM_D / 2 + 0.04]}>
      <mesh castShadow>
        <boxGeometry args={[2.2, 0.6, 0.06]} />
        <primitive object={m.wallTrim} attach="material" />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[2.08, 0.48, 0.02]} />
        <primitive object={m.gold} attach="material" />
      </mesh>
    </group>
  );
});

const Bookshelf = memo(function Bookshelf() {
  const m = useMats();
  const bookColors = [
    "#7a2a2a",
    "#4a6e2a",
    "#2a4a7a",
    "#7a5a2a",
    "#5a2a5a",
    "#2a5a5a",
    "#6e2a4a",
    "#3a3a3a",
  ];
  const books = useMemo(() => {
    const out = [];
    for (let shelf = 0; shelf < 3; shelf++) {
      for (let i = 0; i < 12; i++) {
        out.push({
          x: -0.95 + i * 0.16,
          y: 0.6 + shelf * 0.7,
          h: 0.5 + ((i * 7) % 12) / 60,
          w: 0.12 + ((i * 3) % 4) / 80,
          color: bookColors[(shelf * 7 + i * 3) % bookColors.length],
        });
      }
    }
    return out;
  }, []);
  return (
    <group position={[5.5, 0, -ROOM_D / 2 + 0.4]}>
      {/* cabinet */}
      <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
        <boxGeometry args={[2.2, 3, 0.5]} />
        <primitive object={m.shelfWood} attach="material" />
      </mesh>
      {/* hollowed front (dark panel) */}
      <mesh position={[0, 1.5, 0.26]}>
        <planeGeometry args={[2, 2.8]} />
        <meshStandardMaterial color="#1a0e08" roughness={0.95} />
      </mesh>
      {/* shelves */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 0.4 + i * 0.7, 0.27]}>
          <boxGeometry args={[2, 0.06, 0.5]} />
          <primitive object={m.shelfWood} attach="material" />
        </mesh>
      ))}
      {books.map((b, i) => (
        <mesh castShadow key={i} position={[b.x, b.y + b.h / 2, 0.3]}>
          <boxGeometry args={[b.w, b.h, 0.18]} />
          <meshStandardMaterial color={b.color} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
});

/* ========================================================================
   DESK + LAMP + COMPUTER + COFFEE + PAPERS + NAMEPLATE
   ======================================================================== */
const Desk = memo(function Desk() {
  const m = useMats();
  return (
    <group position={[4.5, 0, 1]}>
      {/* top */}
      <mesh castShadow receiveShadow position={[0, 1.05, 0]}>
        <boxGeometry args={[3.6, 0.1, 1.6]} />
        <primitive object={m.deskTop} attach="material" />
      </mesh>
      {/* front panel */}
      <mesh castShadow position={[0, 0.55, 0.8]}>
        <boxGeometry args={[3.6, 1, 0.06]} />
        <primitive object={m.desk} attach="material" />
      </mesh>
      {/* drawers */}
      <mesh castShadow position={[-1.4, 0.55, 0.85]}>
        <boxGeometry args={[0.6, 0.5, 0.04]} />
        <primitive object={m.deskTop} attach="material" />
      </mesh>
      <mesh position={[-1.4, 0.55, 0.88]}>
        <boxGeometry args={[0.08, 0.04, 0.04]} />
        <primitive object={m.gold} attach="material" />
      </mesh>
      {/* legs */}
      {[
        [-1.7, 0.5, -0.7],
        [1.7, 0.5, -0.7],
        [-1.7, 0.5, 0.7],
        [1.7, 0.5, 0.7],
      ].map((p, i) => (
        <mesh castShadow key={i} position={p}>
          <boxGeometry args={[0.12, 1, 0.12]} />
          <primitive object={m.desk} attach="material" />
        </mesh>
      ))}
      {/* nameplate */}
      <mesh position={[1, 1.13, 0.5]}>
        <boxGeometry args={[0.55, 0.04, 0.18]} />
        <primitive object={m.gold} attach="material" />
      </mesh>
      <Lamp />
      <Monitor />
      <Coffee />
      <Papers />
    </group>
  );
});

const Lamp = memo(function Lamp() {
  const m = useMats();
  return (
    <group position={[-1.4, 1.1, -0.3]}>
      {/* base */}
      <mesh castShadow>
        <cylinderGeometry args={[0.18, 0.2, 0.06, 16]} />
        <primitive object={m.gold} attach="material" />
      </mesh>
      {/* arm */}
      <mesh castShadow position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.5, 8]} />
        <primitive object={m.wallTrim} attach="material" />
      </mesh>
      {/* shade */}
      <mesh castShadow position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.22, 0.32, 0.28, 16, 1, true]} />
        <primitive object={m.lampShade} attach="material" />
      </mesh>
      {/* lit bulb */}
      <pointLight
        position={[0, 0.4, 0]}
        intensity={1.4}
        distance={4.5}
        decay={2}
        color="#fff3b8"
        castShadow={false}
      />
      {/* glowing puck under shade */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.1, 12, 8]} />
        <meshBasicMaterial color="#fff4cc" />
      </mesh>
    </group>
  );
});

const Monitor = memo(function Monitor() {
  const m = useMats();
  return (
    <group position={[0.4, 1.1, -0.3]}>
      {/* stand */}
      <mesh castShadow position={[0, 0.06, 0]}>
        <boxGeometry args={[0.3, 0.04, 0.18]} />
        <primitive object={m.black} attach="material" />
      </mesh>
      <mesh castShadow position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
        <primitive object={m.black} attach="material" />
      </mesh>
      {/* screen back */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 0.62, 0.06]} />
        <primitive object={m.black} attach="material" />
      </mesh>
      {/* screen face */}
      <mesh position={[0, 0.5, 0.035]}>
        <planeGeometry args={[0.92, 0.54]} />
        <primitive object={m.monitor} attach="material" />
      </mesh>
    </group>
  );
});

const Coffee = memo(function Coffee() {
  const m = useMats();
  return (
    <group position={[1.2, 1.1, -0.1]}>
      <mesh castShadow position={[0, 0.13, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.16, 16]} />
        <primitive object={m.mug} attach="material" />
      </mesh>
      {/* coffee surface */}
      <mesh position={[0, 0.215, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.06, 16]} />
        <primitive object={m.mugInside} attach="material" />
      </mesh>
      {/* handle */}
      <mesh castShadow position={[0.08, 0.13, 0]} rotation-z={Math.PI / 2}>
        <torusGeometry args={[0.05, 0.012, 8, 16, Math.PI]} />
        <primitive object={m.mug} attach="material" />
      </mesh>
      <Steam />
    </group>
  );
});

function Steam() {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.children.forEach((c, i) => {
      const phase = (t * 0.5 + i * 0.3) % 1;
      c.position.y = 0.25 + phase * 0.5;
      c.scale.setScalar(0.5 + phase * 1);
      c.material.opacity = (1 - phase) * 0.5;
    });
  });
  return (
    <group ref={ref}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[i * 0.02 - 0.02, 0.25, 0]}>
          <sphereGeometry args={[0.05, 8, 6]} />
          <meshStandardMaterial color="white" transparent opacity={0.4} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

const Papers = memo(function Papers() {
  const m = useMats();
  return (
    <group position={[-0.6, 1.1, 0.2]}>
      {/* stack */}
      {[0, 1, 2, 3].map((i) => (
        <mesh castShadow key={i} position={[0, 0.005 + i * 0.012, 0]} rotation-y={i * 0.03}>
          <boxGeometry args={[0.35, 0.01, 0.45]} />
          <primitive object={m.paper} attach="material" />
        </mesh>
      ))}
      {/* loose page */}
      <mesh castShadow position={[0.35, 0.06, 0.2]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[0.32, 0.008, 0.42]} />
        <primitive object={m.paper} attach="material" />
      </mesh>
    </group>
  );
});

/* ========================================================================
   CHAIR + ATTORNEY (sitting)
   ======================================================================== */
const Attorney = memo(function Attorney({ active, won }) {
  const ref = useRef();
  const skinMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#e8c0a0", roughness: 0.7 }), []);
  const suitMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1f2a3a", roughness: 0.7 }), []);
  const shirtMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#f4f1ea", roughness: 0.8 }), []);
  const hairMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#2a1810", roughness: 0.9 }), []);

  useFrame((s) => {
    if (!ref.current) return;
    // gentle breathing
    ref.current.position.y = 0.04 + Math.sin(s.clock.elapsedTime * 1.2) * 0.012;
    // lean forward when consulting
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      active ? -0.12 : 0,
      0.08
    );
    if (won) {
      ref.current.position.y += Math.abs(Math.sin(s.clock.elapsedTime * 8)) * 0.05;
    }
  });

  return (
    <group position={[5.2, 0, 1.5]}>
      {/* chair seat */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[0.7, 0.1, 0.7]} />
        <meshStandardMaterial color="#2a1810" roughness={0.7} />
      </mesh>
      {/* chair back */}
      <mesh castShadow position={[0, 1.2, 0.32]}>
        <boxGeometry args={[0.7, 1.4, 0.1]} />
        <meshStandardMaterial color="#3a2818" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 1.2, 0.36]}>
        <boxGeometry args={[0.6, 1.3, 0.05]} />
        <meshStandardMaterial color="#1f1108" roughness={0.6} />
      </mesh>
      {/* chair base */}
      <mesh castShadow position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.1, 16]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
      {/* the person */}
      <group ref={ref} position={[0, 0.55, 0]}>
        {/* torso */}
        <mesh castShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[0.6, 0.7, 0.34]} />
          <primitive object={suitMat} attach="material" />
        </mesh>
        {/* shirt v */}
        <mesh position={[0, 0.55, 0.18]} rotation-z={Math.PI / 4}>
          <boxGeometry args={[0.16, 0.16, 0.01]} />
          <primitive object={shirtMat} attach="material" />
        </mesh>
        {/* arms */}
        <mesh castShadow position={[-0.4, 0.45, 0]}>
          <boxGeometry args={[0.2, 0.5, 0.22]} />
          <primitive object={suitMat} attach="material" />
        </mesh>
        <mesh castShadow position={[0.4, 0.45, 0]}>
          <boxGeometry args={[0.2, 0.5, 0.22]} />
          <primitive object={suitMat} attach="material" />
        </mesh>
        {/* neck */}
        <mesh castShadow position={[0, 0.92, 0]}>
          <cylinderGeometry args={[0.09, 0.1, 0.16, 12]} />
          <primitive object={skinMat} attach="material" />
        </mesh>
        {/* head */}
        <mesh castShadow position={[0, 1.15, 0]}>
          <sphereGeometry args={[0.22, 24, 18]} />
          <primitive object={skinMat} attach="material" />
        </mesh>
        {/* hair (bob) */}
        <mesh castShadow position={[0, 1.2, -0.02]}>
          <sphereGeometry args={[0.24, 24, 18, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
          <primitive object={hairMat} attach="material" />
        </mesh>
        {/* eyes */}
        <mesh position={[-0.08, 1.16, 0.2]}>
          <sphereGeometry args={[0.022, 8, 6]} />
          <meshBasicMaterial color="#0a0a0a" />
        </mesh>
        <mesh position={[0.08, 1.16, 0.2]}>
          <sphereGeometry args={[0.022, 8, 6]} />
          <meshBasicMaterial color="#0a0a0a" />
        </mesh>
      </group>
    </group>
  );
});

/* ========================================================================
   WAITING BENCH
   ======================================================================== */
const Bench = memo(function Bench() {
  const m = useMats();
  return (
    <group position={[-2, 0, -2]}>
      {/* seat */}
      <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
        <boxGeometry args={[7.5, 0.1, 1]} />
        <primitive object={m.benchSeat} attach="material" />
      </mesh>
      {/* back */}
      <mesh castShadow position={[0, 1.1, -0.45]}>
        <boxGeometry args={[7.5, 1.4, 0.12]} />
        <primitive object={m.benchBack} attach="material" />
      </mesh>
      {/* legs */}
      {[-3.5, -1.2, 1.2, 3.5].map((x, i) => (
        <mesh castShadow key={i} position={[x, 0.22, 0]}>
          <boxGeometry args={[0.12, 0.45, 0.7]} />
          <primitive object={m.wallTrim} attach="material" />
        </mesh>
      ))}
      {/* cushions hint */}
      {[-2.5, -1, 0.5, 2, 3.5].map((x, i) => (
        <mesh key={i} position={[x, 0.52, 0]}>
          <boxGeometry args={[1.3, 0.04, 0.9]} />
          <meshStandardMaterial color="#6a3825" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
});

/* ========================================================================
   PROCEDURAL HUMANOID CLIENT
   ======================================================================== */
function colorFromSeed(palette, seed, salt) {
  let h = seed * 2654435761 + salt;
  h ^= h >>> 13;
  h = (h * 0x85ebca6b) | 0;
  h ^= h >>> 16;
  return palette[Math.abs(h) % palette.length];
}

const SKIN = ["#f0c8a0", "#d8a878", "#a87856", "#6f4a32", "#e8b890", "#c08858"];
const HAIR = ["#1a1310", "#3a2818", "#6b3a14", "#a87038", "#caa860", "#d8d4cc"];
const PANTS = ["#1f2433", "#2a2218", "#3a3030", "#1a2a3a"];
const OUTFIT_BY_SUBJECT = {
  Torts: ["#7c3326", "#2d5a3c", "#1f3e6b"],
  Contracts: ["#0f2a4a", "#1a2a3a", "#373040"],
  "Criminal Law": ["#d97706", "#7a3322", "#2a2a2a"],
  "Civil Procedure": ["#3a4a6a", "#4a5468", "#5a4030"],
  "Bar Review": ["#475569", "#4a4a40", "#3a3045"],
};
const FOLDER_BY_SUBJECT = {
  Torts: "#e74c3c",
  Contracts: "#1e88e5",
  "Criminal Law": "#f59e0b",
  "Civil Procedure": "#10b981",
  "Bar Review": "#a855f7",
};

function Client({ uid, q, target, mood, isActive, urgent, onClick }) {
  const ref = useRef();
  const legL = useRef();
  const legR = useRef();
  const armL = useRef();
  const armR = useRef();
  const head = useRef();

  const skin = colorFromSeed(SKIN, uid, 1);
  const hair = colorFromSeed(HAIR, uid, 2);
  const outfits = OUTFIT_BY_SUBJECT[q?.subject] || ["#3a3a4a"];
  const suit = colorFromSeed(outfits, uid, 3);
  const pants = colorFromSeed(PANTS, uid, 4);
  const folder = FOLDER_BY_SUBJECT[q?.subject] || "#888";

  const skinMat = useMemo(() => new THREE.MeshStandardMaterial({ color: skin, roughness: 0.7 }), [skin]);
  const hairMat = useMemo(() => new THREE.MeshStandardMaterial({ color: hair, roughness: 0.9 }), [hair]);
  const suitMat = useMemo(() => new THREE.MeshStandardMaterial({ color: suit, roughness: 0.7 }), [suit]);
  const pantsMat = useMemo(() => new THREE.MeshStandardMaterial({ color: pants, roughness: 0.7 }), [pants]);
  const folderMat = useMemo(() => new THREE.MeshStandardMaterial({ color: folder, roughness: 0.6 }), [folder]);

  useFrame((s, delta) => {
    if (!ref.current) return;
    const cur = ref.current.position;
    const dx = target.x - cur.x;
    const dz = target.z - cur.z;
    const dist = Math.hypot(dx, dz);

    // lerp toward target; faster when farther away
    const speed = Math.min(dist, 2.4);
    if (dist > 0.02) {
      cur.x += (dx / dist) * speed * delta;
      cur.z += (dz / dist) * speed * delta;
      // face direction of motion
      const targetRotY = Math.atan2(dx, dz);
      ref.current.rotation.y = THREE.MathUtils.lerp(
        ref.current.rotation.y,
        targetRotY,
        0.18
      );
    } else if (isActive) {
      // face the desk
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, Math.PI / 2, 0.1);
    }

    // walk cycle
    const walking = dist > 0.05;
    const t = s.clock.elapsedTime;
    if (walking) {
      const swing = Math.sin(t * 9) * 0.5;
      if (legL.current) legL.current.rotation.x = swing;
      if (legR.current) legR.current.rotation.x = -swing;
      if (armL.current) armL.current.rotation.x = -swing * 0.6;
      if (armR.current) armR.current.rotation.x = swing * 0.6;
      ref.current.position.y = 0.02 + Math.abs(Math.sin(t * 9)) * 0.03;
    } else {
      // idle: gentle weight shift
      const idle = Math.sin(t * 1.6) * 0.04;
      if (legL.current) legL.current.rotation.x = THREE.MathUtils.lerp(legL.current.rotation.x, 0, 0.1);
      if (legR.current) legR.current.rotation.x = THREE.MathUtils.lerp(legR.current.rotation.x, 0, 0.1);
      if (armL.current) armL.current.rotation.x = THREE.MathUtils.lerp(armL.current.rotation.x, 0, 0.1);
      if (armR.current) armR.current.rotation.x = THREE.MathUtils.lerp(armR.current.rotation.x, 0, 0.1);
      ref.current.position.y = 0.02 + idle * 0.5;
    }

    // urgent: nervous shake of the head
    if (head.current && urgent) {
      head.current.rotation.z = Math.sin(t * 18) * 0.04;
    } else if (head.current) {
      head.current.rotation.z = 0;
    }
  });

  const handle = (e) => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <group ref={ref} onClick={onClick ? handle : undefined}>
      {/* shadow plane (cheap fake) */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.005, 0]}>
        <circleGeometry args={[0.35, 16]} />
        <meshBasicMaterial color="#000" transparent opacity={0.35} depthWrite={false} />
      </mesh>
      {/* legs */}
      <group position={[-0.13, 0.45, 0]}>
        <group ref={legL}>
          <mesh castShadow position={[0, -0.22, 0]}>
            <boxGeometry args={[0.18, 0.45, 0.18]} />
            <primitive object={pantsMat} attach="material" />
          </mesh>
        </group>
      </group>
      <group position={[0.13, 0.45, 0]}>
        <group ref={legR}>
          <mesh castShadow position={[0, -0.22, 0]}>
            <boxGeometry args={[0.18, 0.45, 0.18]} />
            <primitive object={pantsMat} attach="material" />
          </mesh>
        </group>
      </group>
      {/* torso */}
      <mesh castShadow position={[0, 0.85, 0]}>
        <boxGeometry args={[0.52, 0.6, 0.3]} />
        <primitive object={suitMat} attach="material" />
      </mesh>
      {/* shirt v */}
      <mesh position={[0, 0.95, 0.16]} rotation-z={Math.PI / 4}>
        <boxGeometry args={[0.12, 0.12, 0.01]} />
        <meshStandardMaterial color="#f4f1ea" roughness={0.8} />
      </mesh>
      {/* arms */}
      <group position={[-0.32, 1.1, 0]}>
        <group ref={armL}>
          <mesh castShadow position={[0, -0.27, 0]}>
            <boxGeometry args={[0.14, 0.54, 0.16]} />
            <primitive object={suitMat} attach="material" />
          </mesh>
        </group>
      </group>
      <group position={[0.32, 1.1, 0]}>
        <group ref={armR}>
          <mesh castShadow position={[0, -0.27, 0]}>
            <boxGeometry args={[0.14, 0.54, 0.16]} />
            <primitive object={suitMat} attach="material" />
          </mesh>
        </group>
      </group>
      {/* folder under right arm */}
      <mesh castShadow position={[0.4, 0.8, 0.05]} rotation-y={0.1}>
        <boxGeometry args={[0.06, 0.32, 0.26]} />
        <primitive object={folderMat} attach="material" />
      </mesh>
      {/* neck */}
      <mesh castShadow position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.12, 12]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
      {/* head */}
      <group ref={head} position={[0, 1.4, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.18, 20, 16]} />
          <primitive object={skinMat} attach="material" />
        </mesh>
        {/* hair */}
        <mesh castShadow position={[0, 0.04, -0.02]}>
          <sphereGeometry args={[0.2, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2.1]} />
          <primitive object={hairMat} attach="material" />
        </mesh>
        {/* eyes */}
        <mesh position={[-0.07, 0, 0.16]}>
          <sphereGeometry args={[0.02, 8, 6]} />
          <meshBasicMaterial color="#0a0a0a" />
        </mesh>
        <mesh position={[0.07, 0, 0.16]}>
          <sphereGeometry args={[0.02, 8, 6]} />
          <meshBasicMaterial color="#0a0a0a" />
        </mesh>
        {/* mouth — small box, color shifts with mood */}
        <mesh position={[0, -0.08, 0.17]}>
          <boxGeometry args={[0.08, 0.012, 0.005]} />
          <meshBasicMaterial color={mood === "happy" ? "#3a8a3a" : mood === "angry" ? "#7a1a1a" : "#3a1810"} />
        </mesh>
      </group>
      {/* urgency glow ring on the floor */}
      {urgent && (
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
          <ringGeometry args={[0.32, 0.42, 24]} />
          <meshBasicMaterial color="#ff3a3a" transparent opacity={0.7} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

/* ========================================================================
   THE SCENE — composes everything and wires animation
   ======================================================================== */
function Scene({ inbox, exits, activeUid, now, onSelectClient, attorneyMood, slotForUid, lastPosForUid }) {
  // claim slots
  const taken = new Set();
  for (const i of inbox) {
    if (slotForUid.has(i.uid)) taken.add(slotForUid.get(i.uid));
  }
  for (const i of inbox) {
    if (!slotForUid.has(i.uid)) {
      let slot = 0;
      while (taken.has(slot) && slot < BENCH_SLOTS.length - 1) slot++;
      slotForUid.set(i.uid, slot);
      taken.add(slot);
    }
  }
  // garbage collect
  const live = new Set([...inbox.map((i) => i.uid), ...exits.map((e) => e.uid)]);
  for (const uid of Array.from(slotForUid.keys())) {
    if (!live.has(uid)) {
      slotForUid.delete(uid);
      lastPosForUid.delete(uid);
    }
  }

  return (
    <>
      {/* lighting */}
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[-6, 8, 6]}
        intensity={0.9}
        color="#fbe7b3"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.1}
        shadow-camera-far={30}
      />
      <pointLight position={[5, 4, -3]} intensity={0.4} color="#fff4cc" />

      <Room />
      <Desk />
      <Attorney active={!!activeUid} won={attorneyMood === "won"} />
      <Bench />

      {/* clients */}
      {inbox.map((item) => {
        const isActive = item.uid === activeUid;
        const slot = slotForUid.get(item.uid) ?? 0;
        const target = isActive
          ? { x: DESK_CONSULT.x, z: DESK_CONSULT.z }
          : { x: BENCH_SLOTS[Math.min(slot, BENCH_SLOTS.length - 1)], z: -1.4 };
        const total = item.deadlineAt - item.arrivedAt;
        const remaining = Math.max(0, item.deadlineAt - now);
        const urgent = !isActive && remaining / total < 0.3;
        return (
          <Client
            key={item.uid}
            uid={item.uid}
            q={item.q}
            target={target}
            mood="neutral"
            isActive={isActive}
            urgent={urgent}
            onClick={!isActive ? () => onSelectClient(item.uid) : undefined}
          />
        );
      })}
      {/* exits */}
      {exits.map((e) => (
        <Client
          key={`x-${e.uid}`}
          uid={e.uid}
          q={e.q}
          target={e.mood === "happy" ? EXIT_HAPPY : EXIT_ANGRY}
          mood={e.mood}
          isActive={false}
          urgent={false}
          onClick={undefined}
        />
      ))}
    </>
  );
}

export default function Office3D({ inbox, exits, activeUid, now, onSelectClient, attorneyMood, heartShake }) {
  // refs persist across renders without retriggering
  const slotForUid = useRef(new Map()).current;
  const lastPosForUid = useRef(new Map()).current;

  return (
    <div className={`office3d ${heartShake ? "shake" : ""}`}>
      <Canvas
        shadows
        camera={{ position: [-3.5, 4.5, 7], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#10141f"]} />
        <fog attach="fog" args={["#10141f", 14, 28]} />
        <Scene
          inbox={inbox}
          exits={exits}
          activeUid={activeUid}
          now={now}
          onSelectClient={onSelectClient}
          attorneyMood={attorneyMood}
          slotForUid={slotForUid}
          lastPosForUid={lastPosForUid}
        />
      </Canvas>
    </div>
  );
}
