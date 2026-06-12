# Drop 3D models here

When you put `.glb` files in this folder, they ship with the build and the
game loads them at runtime. To wire one into the scene, tell me the filename
and what it is — I'll swap it in for the procedural version in one turn.

## Where to get good free models

These are the ones I'd grab, in order of visual impact for this game:

### 1. Characters (biggest visual jump)

**Mixamo** — https://www.mixamo.com (free Adobe account required)

1. Pick a character — *Sophie*, *Ely*, *Andromeda*, or any of the more
   detailed ones look the part of a BigLaw attorney/client.
2. Once selected, browse animations and add to your bag:
   - `Idle` (or `Standing Idle`)
   - `Walking`
3. Click **Download**:
   - Format: **GLB Binary (.glb)**
   - Skin: **With Skin**
   - Frames per second: **30**
   - Keyframe Reduction: **none**
4. Save as `attorney.glb` (or `client-1.glb`, etc.) and drop it here.

Each character ends up ~8–15 MB. For a deployable web game, run them
through **gltfpack** (`npx gltfpack -i in.glb -o out.glb -cc`) — usually
drops them to 2–4 MB with no visible loss.

### 2. Office props

**Quaternius** — https://quaternius.com (CC0, public domain)

The *Modular Office Kit* and *Ultimate Stylized Nature Pack* have what we
need. Look for:
- `desk.glb`
- `chair.glb`
- `bookshelf.glb`
- `lamp.glb`
- `door.glb`
- `bench.glb` (or `sofa.glb` as a substitute)

Quaternius models are already optimized for games (~50–500 KB each).

**Kenney** — https://kenney.nl/assets (CC0)

Search for "Furniture Kit" — similar low-poly style.

**Sketchfab** — https://sketchfab.com (mixed licenses)

Filter by **Downloadable** + **CC license** + **GLTF/GLB**. Higher-poly
models are available but watch the file size; anything over 5 MB after
gltfpack is too heavy for the web build.

## How to hand off models to me

1. Drop the `.glb` file into this folder (`public/models/`).
2. Commit it (`git add public/models/yourfile.glb && git commit`).
3. Tell me the filename and what it represents
   ("I added `office-chair.glb`, that's the chair").
4. I'll wire it in and push.

## Notes on file sizes

Every model gets shipped on every page load. Stay disciplined:

- Total models budget: **< 10 MB compressed**.
- Each character: **< 3 MB after gltfpack**.
- Each static prop: **< 500 KB**.
- Use `npx gltfpack -i in.glb -o out.glb -cc` to crunch before committing.

Anything bigger should be loaded on-demand (I can set that up when the
total budget gets tight).
