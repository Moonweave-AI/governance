# Kilo

## Project / global installation

```bash
npx @moonweave-ai/governance-skills install --agents kilo --scope project
```

## Remote URL

Add the following to `kilo.jsonc`:

```jsonc
{
  "skills": {
    "urls": ["https://raw.githubusercontent.com/Moonweave-AI/governance/main/governance-skills/skills/"]
  }
}
```

This URL serves `skills/index.json` and the files for each skill.
