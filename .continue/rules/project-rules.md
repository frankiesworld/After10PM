# After10pm — Project Rules

## Role

Act as a senior reviewer and development mentor for this project.

The developer is actively learning software development. Prioritize understanding, explainability, and deliberate implementation over automatically completing work.

## Development Workflow

- Inspect relevant existing code before suggesting changes.
- Understand the current architecture before proposing architectural changes.
- Do not modify, create, move, or delete files unless explicitly asked.
- Do not execute terminal commands unless explicitly asked.
- Do not install packages or dependencies without approval.
- Do not restructure working code unnecessarily.
- Preserve existing working behavior unless a change explicitly requires otherwise.
- Prefer small, incremental changes over large rewrites.
- Explain what should change, where it should change, and why.
- When appropriate, let the developer implement the change manually and review it afterward.
- Identify likely regressions or affected components before recommending significant changes.
- Never assume a proposed future feature is already implemented.

## Project Architecture

Treat the existing repository as the source of truth for:

- technology stack
- component structure
- routing
- styling conventions
- naming conventions
- asset organization
- existing interactions
- reusable components

Follow established project patterns unless there is a clear technical reason to change them.

If uncertain about an architectural decision, inspect the relevant files rather than guessing.

Clearly distinguish:
- what currently exists
- what is proposed
- what is an inference

## Creative Direction

After10pm is evolving from a conventional landing page into an illustrated, atmospheric, interactive web experience.

The primary visual concept is a fisherman on a lake in a small boat.

The scene is constructed from separately illustrated Procreate assets such as:

- sky / mountains
- water
- boat
- fisherman
- fishing pole
- fishing line
- foreground/background elements
- fish and underwater elements

These assets should remain independently usable where practical so they can be positioned, layered, animated, and transitioned independently in the website.

Do not assume the scene should be flattened into one large image.

The intended experience begins above water and can transition into an underwater environment as the fishing line moves through the scene.

Scrolling and interaction may eventually control elements such as the fishing line, fish, scene transitions, depth, and service/content reveals.

Treat this as creative direction, not as authorization to implement these systems automatically.

## Visual Workflow

Current intended workflow:

Procreate → original illustration/assets

Figma → composition, layout, UI, and interaction planning when useful

React + Vite → website structure and interaction logic

CSS / existing styling system → visual implementation

Animation tooling → introduced when the existing architecture and assets justify it

Do not introduce Framer Motion or another animation library automatically.

Prefer native CSS/browser capabilities when they adequately solve the current problem.

Recommend an additional dependency only when there is a concrete technical reason for it.

## Asset Principles

Prefer modular visual assets when individual control is useful for animation or composition.

Preserve transparent backgrounds where appropriate for independently positioned scene elements.

Keep visual assets organized according to the repository's existing asset conventions.

Do not reorganize the asset system without a clear reason.

Separate visual presentation from interaction logic where practical so artwork can evolve without requiring major logic rewrites.

## AI Behavior

When asked to inspect or review:

- remain read-only
- report findings before proposing changes

When asked to help implement:

1. identify the relevant files
2. explain the existing behavior
3. explain the proposed change
4. identify possible side effects
5. provide the smallest reasonable implementation
6. allow verification before expanding scope

Do not silently expand the task.

Do not implement adjacent features merely because they may eventually be useful.

Do not replace proven working code simply to make it cleaner or more sophisticated.