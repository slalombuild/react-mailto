import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  MailTo,
  MailToBody,
  MailToTrigger,
  MailToBreak,
  MailToIndent,
  createMailToLink,
  toSearchString,
  extractBodyContent,
} from "../src"; // Adjust import path

// Test toSearchString function
describe("toSearchString", () => {
  it("should correctly convert searchParams to a query string", () => {
    expect(
      toSearchString({
        subject: "Hello",
        cc: ["test@example.com"],
        bcc: ["hidden@example.com"],
        body: "Hello World",
      }),
    ).toBe(
      "subject=Hello&cc=test%40example.com&bcc=hidden%40example.com&body=Hello%20World",
    );
  });

  it("should handle empty searchParams", () => {
    expect(toSearchString({})).toBe("");
  });

  it("should handle only cc or bcc arrays", () => {
    expect(toSearchString({ cc: ["cc@example.com"], bcc: [] })).toBe(
      "cc=cc%40example.com",
    );
  });
});

// Test createMailtoLink function
describe("createMailtoLink", () => {
  it("should correctly create a mailto link with headers", () => {
    expect(
      createMailToLink(["test@example.com"], {
        subject: "Hello",
        body: "World",
      }),
    ).toBe("mailto:test@example.com?subject=Hello&body=World");
  });

  it("should create a mailto link without headers", () => {
    expect(createMailToLink(["test@example.com"], {})).toBe(
      "mailto:test@example.com",
    );
  });
});

// Test extractBodyContent function
describe("extractBodyContent", () => {
  it("should correctly extract body content from React nodes", () => {
    const textContent = extractBodyContent(
      <MailToBody>
        Hello
        <br />
        World
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </MailToBody>,
    );
    expect(textContent).toBe("Hello\nWorld\n- Item 1\n- Item 2");
  });
});

// Test extractBodyContent function
describe("extractBodyContent nested", () => {
  it("should correctly extract body content from React nodes", () => {
    const textContent = extractBodyContent(
      <MailToBody>
        Hello
        <br />
        World
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>
            <ul>
              <li>Subitem 1</li>
              <li>Subitem 2</li>
            </ul>
          </li>
        </ul>
      </MailToBody>,
    );
    expect(textContent).toBe(
      "Hello\nWorld\n- Item 1\n- Item 2\n    - Subitem 1\n    - Subitem 2",
    );
  });
});

// Test extractBodyContent function
describe("extractBodyContent double nested", () => {
  it("should correctly extract body content from React nodes", () => {
    const textContent = extractBodyContent(
      <MailToBody>
        Hello
        <br />
        World
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>
            <ul>
              <li>Subitem 1</li>
              <li>Subitem 2</li>
              <li>
                <ul>
                  <li>Sub subitem 1</li>
                  <li>Sub subitem 2</li>
                  <li>
                    <ul>
                      <li>Sub sub subitem 1</li>
                      <li>Sub sub subitem 2</li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </MailToBody>,
    );
    expect(textContent).toBe(
      "Hello\nWorld\n- Item 1\n- Item 2\n    - Subitem 1\n    - Subitem 2\n        - Sub subitem 1\n        - Sub subitem 2\n            - Sub sub subitem 1\n            - Sub sub subitem 2",
    );
  });
});

// Test Mailto component
describe("Mailto Component", () => {
  it("should render MailToTrigger with correct href", () => {
    render(
      <MailTo to="test@example.com" subject="Test Subject">
        <MailToTrigger>Send Email</MailToTrigger>
        <MailToBody>Body Content</MailToBody>
      </MailTo>,
    );
    const trigger = screen.getByText("Send Email");
    expect(trigger.getAttribute("href")).toBe(
      "mailto:test@example.com?subject=Test%20Subject&body=Body%20Content",
    );
  });

  it("should handle missing MailToTrigger", () => {
    const { container } = render(
      <MailTo to="test@example.com">
        <MailToBody>Body Content</MailToBody>
      </MailTo>,
    );
    expect(container.firstChild).toBeNull();
  });
});

// Test MailToBreak component
describe("MailToBreak Component", () => {
  it("should render correct number of line breaks", () => {
    const { container } = render(<MailToBreak spacing={2} />);
    expect(container.textContent).toBe("\n\n");
  });
});

// Test MailToIndent component
describe("MailToIndent Component", () => {
  it("should render correct number of spaces", () => {
    const { container } = render(
      <MailToIndent spacing={8}>Content</MailToIndent>,
    );
    expect(container.textContent).toBe("        Content");
  });
});
