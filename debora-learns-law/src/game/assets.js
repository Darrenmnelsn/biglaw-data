// Asset registry — set each property to the public path of a .glb file
// once you've dropped it into public/models/. When `null`, the scene falls
// back to the procedural mesh.
//
// Example:
//   desk: "/models/desk.glb"
//
// I (Claude) will update this file when you tell me what you've added.

export const ASSETS = {
  // Static props (no animation needed)
  desk: null,
  chair: null,
  bookshelf: null,
  lamp: null,
  bench: null,
  door: null,
  plant: null,

  // Rigged characters — first AnimationClip is treated as idle, second as walk.
  // Mixamo exports with these in order if you queue Idle then Walking.
  attorney: null,
  client: null, // used for every visiting client (color tinting per uid)
};
