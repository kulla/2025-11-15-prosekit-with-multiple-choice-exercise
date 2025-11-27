# Experiment: Prosemirror / Prosekit with Multiple Choice Exercise

This is a test to implement a multiple choice exercise in ProseMirror using their [document schema](https://prosemirror.net/examples/schema/).

## Results

### Advantages

- Compared to Lexical the implementation of the necessary schema constraints and
  normalizations is simpler.

### Limitations

- The UX is quite bad when content is copied / pasted. Also many wanted
  operations (like pressing Enter on multiple choice answers) does not work out
  of the box.

The document schema of ProseMirror does not seem to be working on higly structured documents.

## Setup

1. Clone the repository
2. Install the dependencies via `bun install`

## Get started

Start the dev server:

```bash
bun dev
```

Build the app for production:

```bash
bun run build
```

Preview the production build locally:

```bash
bun preview
```

## Maintenance

Update dependencies:

```bash
bun update
```
