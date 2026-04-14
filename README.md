# Auto file/image Opener

A small Node.js CLI that opens a saved file or image path with your system default application.

## What it does

- Stores one path in `path.txt`
- Opens that saved path when you run `opentodo`
- Lets you update the saved path with `opentodo change <filepath>`
- Works across platforms:
  - Windows: `start`
  - macOS: `open`
  - Linux: `xdg-open`

## Requirements

- Node.js 18+
- npm

## Install

1. Install dependencies:

```bash
npm install
```

2. Install the CLI command globally from this project folder:

```bash
npm link
```

After this, `opentodo` is available in your terminal.

## Usage

Show help:

```bash
opentodo -h
```

Set or update the file/image path:

```bash
opentodo change "C:/Users/you/Pictures/todo.jpg"
```

Open the saved path:

```bash
opentodo
```

## Without global install

You can also run it directly from this project:

```bash
npm start
```

To pass arguments through npm:

```bash
npm start -- change "C:/Users/you/Pictures/todo.jpg"
```

## How path storage works

- The saved target path is stored in `path.txt` in this project directory.
- If `path.txt` is missing, the script creates it automatically.
- If `path.txt` is empty, the CLI shows help and exits.

## Troubleshooting

- If the file does not open, verify the path in `path.txt` exists and is readable.
- On Windows, use quotes around paths with spaces.
- Run `opentodo -h` to confirm available commands.
