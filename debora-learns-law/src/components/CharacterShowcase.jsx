import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

function configureLoader(loader) {
  loader.setMeshoptDecoder(MeshoptDecoder);
}

function Lawyer({ url, dragYaw }) {
  const gltf = useLoader(GLTFLoader, url, configureLoader);
  const group = useRef();
  const mixer = useMemo(() => new THREE.AnimationMixer(gltf.scene), [gltf.scene]);

  useEffect(() => {
    gltf.scene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    if (gltf.animations[0]) {
      const a = mixer.clipAction(gltf.animations[0]);
      a.setLoop(THREE.LoopRepeat);
      a.play();
    }
    return () => mixer.stopAllAction();
  }, [gltf, mixer]);

  // Center & scale to a known footprint so the camera framing works
  // regardless of what units Meshy exported in.
  const { offsetY, scale } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const targetHeight = 1.7; // meters
    const s = targetHeight / Math.max(size.y, 0.001);
    return { offsetY: -box.min.y * s, scale: s };
  }, [gltf.scene]);

  useFrame((_, delta) => {
    mixer.update(delta);
    if (group.current) {
      // smooth rotation from the parent's drag
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        dragYaw.current,
        0.18
      );
    }
  });

  return (
    <group ref={group} position={[0, offsetY, 0]} scale={scale}>
      <primitive object={gltf.scene} />
    </group>
  );
}

function FloorDisc() {
  return (
    <>
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
        <circleGeometry args={[1.6, 48]} />
        <meshStandardMaterial color="#1f1108" roughness={0.95} />
      </mesh>
      {/* gold ring */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.001, 0]}>
        <ringGeometry args={[1.45, 1.6, 64]} />
        <meshStandardMaterial color="#dab84a" metalness={0.6} roughness={0.4} />
      </mesh>
    </>
  );
}

function Fallback({ message }) {
  return (
    <mesh position={[0, 1, 0]}>
      <boxGeometry args={[0.6, 1.6, 0.4]} />
      <meshStandardMaterial color="#2a3450" />
    </mesh>
  );
}

export default function CharacterShowcase({ url = "/lawyer.glb" }) {
  const dragYaw = useRef(0);
  const lastX = useRef(null);
  const [hint, setHint] = useState(true);

  // gentle auto-spin until the user drags
  useEffect(() => {
    let raf;
    let spinning = true;
    const tick = () => {
      if (spinning) dragYaw.current += 0.005;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const stop = () => {
      spinning = false;
      setHint(false);
    };
    window.addEventListener("pointerdown", stop, { once: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointerdown", stop);
    };
  }, []);

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    lastX.current = e.clientX;
  };
  const onPointerMove = (e) => {
    if (lastX.current == null) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    dragYaw.current += dx * 0.012;
  };
  const onPointerUp = () => {
    lastX.current = null;
  };

  return (
    <div
      className="showcase"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <Canvas
        shadows
        camera={{ position: [0, 1.45, 3.3], fov: 32 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[2, 4, 3]}
          intensity={1.1}
          color="#fbe7b3"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-left={-2}
          shadow-camera-right={2}
          shadow-camera-top={3}
          shadow-camera-bottom={-1}
        />
        <pointLight position={[-2, 2, 2]} intensity={0.35} color="#fff4cc" />
        <Suspense fallback={<Fallback />}>
          <Lawyer url={url} dragYaw={dragYaw} />
        </Suspense>
        <FloorDisc />
      </Canvas>
      {hint && <div className="showcase-hint">drag to rotate</div>}
    </div>
  );
}
