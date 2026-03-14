---
name: api-connector
description: "Example skill demonstrating API integration with required CLI tool and environment variables. Shows real-world patterns for skill development."
metadata:
  openclaw:
    emoji: "\U0001F50C"
    requires:
      bins:
        - curl
      env:
        - API_KEY
        - API_ENDPOINT
    install:
      - id: brew
        kind: brew
        formula: curl
        bins:
          - curl
        label: "Install curl via Homebrew"
      - id: apt
        kind: apt
        package: curl
        bins:
          - curl
        label: "Install curl via APT"
      - id: manual
        kind: manual
        label: "Manual setup"
        steps:
          - "Ensure curl is installed: curl --version"
          - "Set environment variables:"
          - "  export API_KEY='your-api-key-here'"
          - "  export API_ENDPOINT='https://api.example.com'"
---

## Purpose

This example demonstrates how to create a real-world effector skill that:

- Requires external CLI tools (curl)
- Needs environment variables (API_KEY, API_ENDPOINT)
- Calls external APIs
- Provides multiple operations/commands

Use this as a template when building skills that integrate with APIs, cloud services, or other external systems.

## When to Use

- Building API client skills
- Integrating with third-party services
- Creating CLI wrappers for existing tools
- Automating API operations

## When NOT to Use

- For simple operations that don't require external tools
- When the API has a dedicated effector skill already
- For complex web UI interactions

## Setup

### Prerequisites

1. **curl**: The skill uses curl to make HTTP requests
   - Install with: `brew install curl` (macOS) or `apt install curl` (Linux)
   - Verify: `curl --version`

2. **Environment Variables**: Set these before using the skill
   ```bash
   export API_KEY="sk-1234567890abcdef"
   export API_ENDPOINT="https://api.example.com/v1"
   ```

## Commands

### List resources

```bash
curl -s -X GET "$API_ENDPOINT/resources" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json"
```

### Get a specific resource

```bash
curl -s -X GET "$API_ENDPOINT/resources/<id>" \
  -H "Authorization: Bearer $API_KEY"
```

### Create a resource

```bash
curl -s -X POST "$API_ENDPOINT/resources" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "new-resource", "type": "example"}'
```

## Examples

"List all projects" → Run list query against /resources endpoint

"Get details for project X" → Run get query with specific ID

"Create a new project called Q1 Planning" → Run create with JSON payload

## Notes

- **API Credentials**: Store API_KEY in environment variables, never in scripts or version control
- **Rate Limiting**: Be aware of API rate limits when making bulk requests
- **HTTPS Only**: Always use HTTPS endpoints for security
- **Authentication**: The skill passes your API_KEY in the Authorization: Bearer header
