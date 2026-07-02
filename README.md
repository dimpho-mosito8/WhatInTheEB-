# WhatInTheEB-

Daily EB report Action.

## Usage

```yaml
steps:
  - uses: dimpho-mosito8/WhatInTheEB-@main
    id: daily-report
    with:
      summary: |
        Completed the deployment review for today.
      highlights: |
        - Deployment completed successfully
        - Support queue stayed below target
      blockers: |
        - Waiting on updated stakeholder feedback
      next_steps: |
        - Finalize tomorrow's rollout checklist
```

## Inputs

- `title`: Optional report title. Defaults to `Daily EB Report`.
- `report_date`: Optional date value. Defaults to the current UTC date.
- `summary`: Optional summary section content.
- `highlights`: Optional highlights section content.
- `blockers`: Optional blockers section content.
- `next_steps`: Optional next steps section content.
- `output_path`: Optional output file path for the markdown report.
- `write_step_summary`: Optional flag to append the report to the GitHub step summary. Defaults to `true`.

## Outputs

- `report`: The generated markdown content.
- `report_path`: The path of the generated markdown file.
