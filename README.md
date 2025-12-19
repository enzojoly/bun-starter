# bun-starter

Minimal web development environment. Nix provides Bun, Bun provides everything else.

```
nix develop
bun --hot serve.ts
```

Server runs at `localhost:3000` with hot reload.

```
bun build --compile serve.ts --outfile=server
```

Produces a self-contained binary.

[Full documentation](https://github.com/enzojoly/bun-starter/blob/main/documentation/bun-starter.pdf)
