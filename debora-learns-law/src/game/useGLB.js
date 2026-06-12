// Tiny GLTFLoader wrapper. Uses R3F's Suspense-aware useLoader so models
// stream in without blocking the rest of the scene. When a glb is missing
// or fails to parse, callers should render a procedural fallback.

import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three";

export function useGLB(url) {
  return useLoader(GLTFLoader, url);
}

// Drop-in component that loads a static prop and positions it.
// Cast/receive shadows are enabled on every mesh in the tree.
export function GLBProp({ url, position, rotation, scale = 1, fallback }) {
  return (
    <Suspense fallback={fallback || null}>
      <GLBPropInner url={url} position={position} rotation={rotation} scale={scale} />
    </Suspense>
  );
}

function GLBPropInner({ url, position, rotation, scale }) {
  const gltf = useGLB(url);
  const cloned = useMemo(() => gltf.scene.clone(true), [gltf]);

  useEffect(() => {
    cloned.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }, [cloned]);

  return (
    <primitive
      object={cloned}
      position={position}
      rotation={rotation}
      scale={typeof scale === "number" ? [scale, scale, scale] : scale}
    />
  );
}

// Character helper that also plays the first animation in the GLB.
// Pass `clipName` to play a specific clip; otherwise it uses index 0 (idle)
// when stationary and index 1 (walk) when `walking` is true.
export function GLBCharacter({ url, position, rotation, scale = 1, walking, tint }) {
  return (
    <Suspense fallback={null}>
      <GLBCharacterInner
        url={url}
        position={position}
        rotation={rotation}
        scale={scale}
        walking={walking}
        tint={tint}
      />
    </Suspense>
  );
}

function GLBCharacterInner({ url, position, rotation, scale, walking, tint }) {
  const gltf = useGLB(url);

  const { scene, mixer, idleAction, walkAction } = useMemo(() => {
    const s = gltf.scene.clone(true);
    s.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        if (tint) {
          o.material = o.material.clone();
          o.material.color = new THREE.Color(tint);
        }
      }
    });
    const mx = new THREE.AnimationMixer(s);
    const ia = gltf.animations[0] ? mx.clipAction(gltf.animations[0]) : null;
    const wa = gltf.animations[1] ? mx.clipAction(gltf.animations[1]) : null;
    if (ia) ia.play();
    return { scene: s, mixer: mx, idleAction: ia, walkAction: wa };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gltf, tint]);

  // crossfade between idle and walk based on the `walking` prop
  useEffect(() => {
    if (!walkAction || !idleAction) return;
    if (walking) {
      walkAction.reset().fadeIn(0.2).play();
      idleAction.fadeOut(0.2);
    } else {
      idleAction.reset().fadeIn(0.2).play();
      walkAction.fadeOut(0.2);
    }
  }, [walking, walkAction, idleAction]);

  // tick the animation mixer once per frame
  useFrame((_, delta) => mixer.update(delta));

  return (
    <primitive
      object={scene}
      position={position}
      rotation={rotation}
      scale={typeof scale === "number" ? [scale, scale, scale] : scale}
    />
  );
}
