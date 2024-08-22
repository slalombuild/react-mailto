import React from "react";

const MAIL_TO_INDENT_SPACING_DEFAULT = 4;
const MAIL_TO_BREAK_SPACING_DEFAULT = 1;

/**
 * Represents the headers that can be used in a `mailto` link.
 */
export type MailtoHeaders = {
  /**
   * Additional recipients to be copied on the email.
   * @example ["cc@example.com"]
   */
  cc?: string[];

  /**
   * Additional recipients to be blind copied on the email.
   * @example ["bcc@example.com"]
   */
  bcc?: string[];

  /**
   * The subject of the email.
   * @example "Meeting Request"
   */
  subject?: string;

  /**
   * The body content of the email.
   * @example "Please find the details attached."
   */
  body?: string;
};

/**
 * Converts an object of mailto headers into a query string.
 * @param searchParams - An object containing mailto headers.
 * @returns A query string representation of the mailto headers.
 */
export const toSearchString = (searchParams: MailtoHeaders = {}): string => {
  return Object.entries(searchParams)
    .flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((item) => `${key}=${encodeURIComponent(item)}`);
      }
      return value ? `${key}=${encodeURIComponent(value)}` : "";
    })
    .filter(Boolean)
    .join("&");
};

/**
 * Creates a mailto link with optional headers.
 *
 * @param {string[]} email - The recipient's email addresses.
 * @param {MailtoHeaders} [headers={}] - Optional headers to include in the mailto link.
 * @returns {string} The constructed mailto link with headers if provided.
 */
export const createMailToLink = (
  email: string[],
  headers: MailtoHeaders,
): string => {
  let link = `mailto:${email.join(",")}`;
  if (headers) {
    const params = toSearchString(headers);
    if (params.length > 0) {
      link += `?${params}`;
    }
  }
  return link;
};

/**
 * Extracts text content from nested MailToBody components.
 *
 * @param {React.ReactNode} children - The nested content to extract text from.
 * @param {number} level - The current indentation level for nested lists.
 * @returns {string} The extracted text content.
 */
export const extractBodyContent = (
  children: React.ReactNode,
  level: number = 0,
): string => {
  let bodyContent = "";

  const traverse = (node: React.ReactNode, currentLevel: number) => {
    const indent = " ".repeat(currentLevel * MAIL_TO_INDENT_SPACING_DEFAULT);
    if (typeof node === "string") {
      bodyContent += node;
    } else if (React.isValidElement(node)) {
      switch (node.type) {
        case "br":
          bodyContent += "\n";
          break;
        case MailToBreak:
          bodyContent += "\n".repeat(
            node.props.spacing ?? MAIL_TO_BREAK_SPACING_DEFAULT,
          );
          break;
        case MailToIndent:
          React.Children.forEach(
            [
              " ".repeat(node.props.spacing ?? MAIL_TO_INDENT_SPACING_DEFAULT),
              ...node.props.children,
            ],
            (child) => traverse(child, currentLevel),
          );
          break;
        case "ul":
        case "ol":
          if (bodyContent && !bodyContent.endsWith("\n")) {
            bodyContent += "\n";
          }
          React.Children.forEach(node.props.children, (child) => {
            if (React.isValidElement(child) && child.type === "li") {
              traverse(child, currentLevel);
            }
          });
          break;
        case "li":
          const prefix = "- ";
          React.Children.forEach(node.props.children, (child) => {
            if (
              React.isValidElement(child) &&
              (child.type === "ul" || child.type === "ol")
            ) {
              traverse(child, currentLevel + 1);
            } else if (typeof child === "string") {
              traverse(`${indent}${prefix}${child}`, currentLevel);
            }
          });
          if (!bodyContent.endsWith("\n")) {
            bodyContent += "\n";
          }
          break;
        case MailToBody:
          React.Children.forEach(node.props.children, (child) =>
            traverse(child, currentLevel),
          );
          break;
        default:
          break;
      }
    }
  };

  React.Children.forEach(children, (child) => traverse(child, level));
  return bodyContent.trim();
};

/**
 * A React component that generates a `mailto` link with optional email headers such as
 * `subject`, `cc`, `bcc`, and `body`. The body content is extracted from the nested
 * `MailToBody` component, while the clickable link is rendered using the `MailToTrigger`
 * component.
 *
 * This component allows for an optional obfuscation of the `mailto` link, which prevents
 * email harvesting by directly assigning the `mailto` link in the `href` attribute.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string[]} props.to - The recipient's email addresses.
 * @param {string} [props.subject] - The subject of the email.
 * @param {string[]} [props.cc] - Additional recipients to be copied on the email.
 * @param {string[]} [props.bcc] - Additional recipients to be blind copied on the email.
 * @param {boolean} [props.obfuscate=false] - Whether to obfuscate the mailto link. If true, the link will not be directly exposed in the `href` attribute.
 * @param {React.ReactNode} props.children - The content to display inside the link, including `MailToTrigger` and `MailToBody`.
 * @param {React.AnchorHTMLAttributes<HTMLAnchorElement>} [props.others] - Additional props for the anchor element, such as `className`, `style`, or `target`.
 * @returns {JSX.Element} The rendered `mailto` link component.
 *
 * @example
 * // Basic usage with subject and body
 * <Mailto to="demo@email.com" subject="Check this out">
 *   <MailToTrigger>Send Email</MailToTrigger>
 *   <MailToBody>
 *     Hello,
 *     <br />
 *     This is a multiline email body.
 *     <br />
 *     Regards,
 *     <br />
 *     Your Name
 *   </MailToBody>
 * </Mailto>
 *
 * @example
 * // Usage with CC, BCC, and obfuscation enabled
 * <Mailto
 *   to="demo@email.com"
 *   subject="Meeting Request"
 *   cc={["cc1@email.com", "cc2@email.com"]}
 *   bcc={["bcc@email.com"]}
 *   obfuscate
 * >
 *   <MailToTrigger>Request Meeting</MailToTrigger>
 *   <MailToBody>
 *     Dear Team,
 *     <br />
 *     I would like to schedule a meeting next week.
 *   </MailToBody>
 * </Mailto>
 *
 * @example
 * // Applying additional props to the trigger link
 * <Mailto
 *   to="contact@company.com"
 *   subject="Inquiry"
 *   style={{ color: 'blue', textDecoration: 'underline' }}
 * >
 *   <MailToTrigger>Contact Us</MailToTrigger>
 *   <MailToBody>
 *     Hi,
 *     <br />
 *     I'd like to know more about your services.
 *   </MailToBody>
 * </Mailto>
 */
export const MailTo = ({
  to,
  subject,
  cc = [],
  bcc = [],
  obfuscate = false,
  children,
  ...others
}: {
  to: string | string[];
  subject?: string;
  cc?: string | string[];
  bcc?: string | string[];
  obfuscate?: boolean;
  children: React.ReactNode;
} & React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>): JSX.Element => {
  // Normalize to, cc, and bcc to always be arrays
  const normalizeToList = (input?: string | string[]): string[] =>
    typeof input === "string" ? [input] : (input ?? []);
  const normalizedTo = normalizeToList(to);
  const normalizedCc = normalizeToList(cc);
  const normalizedBcc = normalizeToList(bcc);
  // Extract the body content from children
  const bodyContent = extractBodyContent(children);

  // Prepare headers for the mailto link
  const headers: MailtoHeaders = {
    subject,
    cc: normalizedCc,
    bcc: normalizedBcc,
    body: bodyContent || undefined,
  };

  // Find the MailToTrigger in the children
  const trigger = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === MailToTrigger,
  ) as React.ReactElement | undefined;

  if (!trigger) {
    console.error("MailToTrigger is required inside Mailto component.");
    return <React.Fragment></React.Fragment>;
  }

  // Generate the mailto link
  const mailtoLink = createMailToLink(normalizedTo, headers);

  // If obfuscate is true, handle the link differently
  if (obfuscate) {
    return React.cloneElement(trigger, {
      onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        window.location.href = mailtoLink;
      },
      href: "#",
      ...others,
    });
  }

  // Render the trigger with the mailto link
  return React.cloneElement(trigger, {
    href: mailtoLink,
    ...others,
  });
};


/**
 * A component that holds the body content of an email, which will be included
 * in the `mailto` link when used inside the `MailTo` component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to include in the email body.
 * @returns {React.ReactElement} The content that will be included in the email body.
 *
 * @example
 * <MailToBody>
 *   This is the email body content.
 *   <br />
 *   It can be multiline.
 * </MailToBody>
 */
export const MailToBody = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => <React.Fragment>{children}</React.Fragment>;

/**
 * A component that renders a trigger link (`<a>` tag) for the `MailTo` component.
 * This trigger will contain the text or elements that should be clickable to initiate
 * the email with the `mailto` link.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to display inside the link.
 * @param {React.AnchorHTMLAttributes<HTMLAnchorElement>} props.props - Additional anchor attributes.
 * @returns {React.ReactElement} A link (`<a>`) element that triggers the `mailto` action.
 *
 * @example
 * <MailToTrigger>
 *   Click here to send an email.
 * </MailToTrigger>
 */
export const MailToTrigger = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  props?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
}): React.ReactElement => <a {...props}>{children}</a>;

/**
 * A component to add indentation in the email body content.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - Content to include with indentation.
 * @param {number} [props.spacing=MAIL_TO_INDENT_SPACING_DEFAULT] - Number of spaces for indentation.
 * @returns {React.ReactElement} The content with the specified indentation.
 *
 * @example
 * <MailToIndent spacing={8}>
 *   Indented content
 * </MailToIndent>
 */
export const MailToIndent = ({
  children,
  spacing = MAIL_TO_INDENT_SPACING_DEFAULT,
}: {
  children: React.ReactNode;
  spacing?: number;
}): React.ReactElement => (
  <React.Fragment>
    {`${" ".repeat(spacing)}`}
    {children}
  </React.Fragment>
);

/**
 * A component to insert line breaks in the email body content.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.spacing=MAIL_TO_BREAK_SPACING_DEFAULT] - Number of line breaks.
 * @returns {React.ReactElement} The content with the specified number of line breaks.
 *
 * @example
 * <MailToBreak spacing={2} />
 * // Renders two line breaks
 */
export const MailToBreak = ({
  spacing = MAIL_TO_BREAK_SPACING_DEFAULT,
}: {
  spacing?: number;
}): React.ReactElement => <React.Fragment>{"\n".repeat(spacing)}</React.Fragment>;
