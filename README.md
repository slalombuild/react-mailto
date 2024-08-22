# react-mailto

<!-- TODO: Uncomment once JSR works for JSX -->
<!-- [![JSR](https://jsr.io/badges/@slalombuild/react-mailto)](https://jsr.io/@slalombuild/react-mailto) -->
[![NPM Version](https://img.shields.io/npm/v/@slalombuild/react-mailto)](https://www.npmjs.com/package/@slalombuild/react-mailto)
[![Demo](https://img.shields.io/badge/Demo-Visit%20Demo-blue)](https://slalombuild.github.io/react-mailto/)

## Overview

**react-mailto** is a Mailto Link Generator library is a React utility for creating customizable `mailto` links with optional headers, such as `subject`, `cc`, `bcc`, and `body`. It also includes components for building the body content of the email with nested lists, line breaks, and indentation.

This package is ideal for developers who want to generate email links with rich content and customizable options directly within their React applications.

## Features

- **Create Mailto Links**: Easily generate `mailto` links with multiple recipients, subjects, CCs, and BCCs.
- **Extract Body Content**: Parse and format email body content from nested React components.
- **Custom Components**: Use components to handle email body formatting with support for indentation, line breaks, and lists.

## Installation

<!-- TODO: Uncomment once JSR works for JSX -->
<!-- Install the package via deno, npm, yarn, pnpm or bun: -->

<!-- ```sh
deno add @slalombuild/react-mailto

npx jsr add @slalombuild/react-mailto

yarn dlx jsr add @slalombuild/react-mailto

pnpm dlx jsr add @slalombuild/react-mailto

bunx jsr add @slalombuild/react-mailto
``` -->

## Usage

### Basic Usage

To create a mailto link with a subject and body content, use the `MailTo` component. Here's a simple example:

```tsx
import React from 'react';
import { MailTo, MailToBody, MailToTrigger } from 'package-name';

const App = () => (
  <MailTo to="example@example.com" subject="Hello World">
    <MailToTrigger>Send Email</MailToTrigger>
    <MailToBody>
      Hi there,
      <br />
      This is a test email.
      <br />
      Cheers,
      <br />
      Your Name
    </MailToBody>
  </MailTo>
);

export default App;
```

### Advanced Usage

For more complex scenarios, such as including CC and BCC recipients, or enabling link obfuscation, you can configure the `Mailto` component accordingly:

```tsx
import React from 'react';
import { MailTo, MailToBody, MailToTrigger } from 'package-name';

const App = () => (
  <MailTo
    to="recipient@example.com"
    subject="Meeting Invitation"
    cc={["cc1@example.com", "cc2@example.com"]}
    bcc={["bcc@example.com"]}
    obfuscate
  >
    <MailToTrigger>Invite to Meeting</MailToTrigger>
    <MailToBody>
      Dear Team,
      <br />
      Please join us for a meeting next week.
      <br />
      Regards,
      <br />
      Your Name
    </MailToBody>
  </MailTo>
);

export default App;
```

## Components

### `MailTo`

The main component to generate the mailto link with optional headers and body content.

**Props:**

- to (`string | string[]`): Recipient email addresses.
- subject (`string`, optional): Subject of the email.
- cc (`string[] | string`, optional): CC recipients.
- bcc (`string[] | string`, optional): BCC recipients.
- obfuscate (`boolean`, optional): Whether to obfuscate the mailto link.
- children (`React.ReactNode`): Content to be rendered inside the link.

### `MailToBody`

A component to define the body content of the email.

**Props:**

- `children` (`React.ReactNode`): Content to include in the email body.

### `MailToTrigger`

A component that renders a clickable link to trigger the mailto action.

**Props:**

- `children` (`React.ReactNode`): The text or elements to display inside the link.
- `props` (`React.AnchorHTMLAttributes<HTMLAnchorElement>`, optional): Additional props for the anchor element.

### `MailToIndent`

A component to add indentation in the email body content.

**Props:**

- `children` (`React.ReactNode`): Content to include with indentation.
- `spacing` (`number`, optional): Number of spaces for indentation.

### `MailToBreak`

A component to insert line breaks in the email body content.

**Props:**

- `spacing` (`number`, optional): Number of line breaks.

## Contributing

We welcome contributions! If you want to help improve this package:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a Pull Request.

For more details, check our contributing guidelines.

## License

This project is licensed under the MIT License.

Thank you for using react-mailto!
