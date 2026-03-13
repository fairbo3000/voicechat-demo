# Standards

## Performance
- Always use `useFrame` delta time for animations (frame-rate independent)
- Dispose geometries, materials, textures when unmounting
- Use `useMemo` for expensive calculations
- Avoid creating objects in render/animation loops

## Shaders
- Comment all uniforms
- Use meaningful variable names (no single letters except `uv`, `st`)
- Keep fragment shaders under 100 lines where possible — split into functions
- Test on mobile GPU if mobile is a target

## Three.js / R3F
- Prefer R3F declarative style over imperative Three.js where possible
- Use `<Suspense>` for async asset loading
- Instanced meshes for repeated geometry

## File Structure
```
src/
├── components/   ← React/R3F components
├── shaders/      ← .glsl files
├── hooks/        ← Custom hooks (useScroll, useGPU, etc.)
├── utils/        ← Math helpers, noise functions
└── assets/       ← Textures, models, HDRIs
```

## Code Style
- TypeScript
- No magic numbers — name your constants
