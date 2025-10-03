# Examples Directory

This directory contains example code that demonstrates web features detected by GreenLightCI.

## Structure

- `css/` - CSS feature examples
- `javascript/` - JavaScript feature examples
- `demo-pr-diff.txt` - Sample PR diff for testing

## Purpose

These examples serve multiple purposes:

1. **Testing** - Used to verify feature detection works correctly
2. **Documentation** - Shows what features are detected
3. **Demo** - Demonstrates the action in a real repository

## Running Tests

To test the action against these examples:

```bash
# Run unit tests
pnpm test

# Test locally with sample diff
cat examples/demo-pr-diff.txt | grep "^+" | pnpm action:check
```
