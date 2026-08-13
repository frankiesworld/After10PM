# After10pm Development Rules

After10pm is an illustrated, atmospheric, interactive website being built
while I continue learning software development.

## Default mode — Supervised auto-edit

- You may read any file freely, at any time, without asking.
- Before writing to any file, show the full diff and explain what it does
  and why.
- Wait for explicit approval ("yes," "apply it," "go ahead," etc.) before
  actually writing.
- Do not run commands that modify anything without explicit permission for
  that specific command.
- Do not install packages without explicit approval.
- Do not commit, push, or deploy unless explicitly told to for that
  specific change.

## Practice mode

If I say "let me type this one," "practice mode," or similar:

- Explain the change instead of writing it.
- Tell me exactly which file and section to edit.
- Explain why the code works.
- Wait for me to confirm the change before continuing.

## Accuracy

- Inspect relevant files before proposing changes.
- Treat the current repository as the source of truth.
- Never claim something exists, is implemented, or is fixed without
  checking the relevant code first.
- Clearly distinguish existing behavior, proposed behavior, and inference.
- Do not assume planned features have already been implemented.
- Before suggesting a commit, confirm the change has actually been tested.

## Architecture

- Preserve existing working architecture unless there is a concrete reason
  to change it.
- Prefer incremental changes over rewrites.
- Reuse existing components and patterns where appropriate.
- Do not restructure working code simply to make it more sophisticated.
- Identify likely regressions or affected components before significant
  changes.
- Keep visual presentation and interaction logic reasonably separated so
  artwork can evolve without requiring major logic rewrites.

## Creative Direction

After10pm is evolving from a conventional landing page into an illustrated,
atmospheric, interactive web experience.

The primary visual concept is a fisherman on a lake in a small boat.

The scene uses separately illustrated Procreate assets such as:

- sky / mountains
- water
- boat
- fisherman
- fishing pole and line
- foreground/background elements
- fish
- underwater elements

Keep independently controlled visual elements separate where practical.
Do not automatically flatten the complete scene into one image.

The intended experience begins above water and can transition into an
underwater environment as the fishing line moves through the scene.

Scrolling and interaction may eventually control scene movement, fishing
line movement, fish, depth, transitions, and service/content reveals.

These are creative-direction constraints, not authorization to implement
future systems automatically.

## Visual Workflow

Current intended workflow:

Procreate → illustration/assets
Figma → composition, layout, UI and interaction planning
React + Vite → application structure and interaction logic
CSS / existing styling → visual implementation
Animation tooling → added only when justified by the implementation

- Do not automatically introduce Framer Motion or another animation library.
- Prefer existing/native browser and CSS capabilities when sufficient.
- Do not install a new dependency without explaining why it is needed and
  receiving approval.
- Preserve modular assets when independent positioning or animation is useful.

## Workflow for every task

1. Inspect the relevant files.
2. Explain the current implementation.
3. Explain the proposed change and why.
4. Identify the files/components that would be affected.
5. Show the full diff in default mode, or tell me exactly what to edit in
   practice mode.
6. Wait for explicit approval before writing or running anything.
7. Make only the approved change.
8. Tell me exactly how to test it.
9. Verify the result before expanding scope.

Do not silently expand a task or implement adjacent features.

## Git Safety

- Never run destructive Git commands without explicit approval.
- Never run `git restore`, `git reset --hard`, `git clean`, or another
  command that could discard work without first explaining exactly what
  would be lost.
- Do not commit or push automatically.
- Do not deploy automatically.

## Goal

Teach me the codebase while helping me build After10pm into a polished,
interactive illustrated experience.

Prioritize understanding why an implementation works rather than simply
shipping code.