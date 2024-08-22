import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { MailTo, MailToTrigger, MailToBody } from "@slalombuild/react-mailto";
import React from "react";
import { Button } from "./ui/button";

type ProcessedBodyItem =
  | string
  | {
      type: "break";
      spacing: number;
    };

const MailToComposer = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [body, setBody] = useState("");
  const [obfuscate, setObfuscate] = useState(false);

  const [buttonText, setButtonText] = useState("Send Email");

  // Convert comma-separated input into arrays
  const parseList = (input: string) =>
    input.split(",").map((email) => email.trim());

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart!;
      const end = e.currentTarget.selectionEnd!;

      // Insert a tab character at the cursor position
      setBody((prevBody) => {
        const newBody =
          prevBody.substring(0, start) + "\t" + prevBody.substring(end);
        // Adjust cursor position after insertion
        setTimeout(() => {
          e.currentTarget.selectionStart = e.currentTarget.selectionEnd =
            start + 1;
        }, 0);
        return newBody;
      });
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart!;
      const end = e.currentTarget.selectionEnd!;

      // Insert two newline characters at the cursor position
      setBody((prevBody) => {
        const newBody =
          prevBody.substring(0, start) + "\n" + prevBody.substring(end);
        // Adjust cursor position after insertion
        setTimeout(() => {
          e.currentTarget.selectionStart = e.currentTarget.selectionEnd =
            start + 2;
        }, 0);
        return newBody;
      });
    }
  };

  // Generate JSX preview based on the user inputs
  const generateJSX = () => {
    const toArray = parseList(to);
    const ccArray = parseList(cc);
    const bccArray = parseList(bcc);

    // Process body to handle indentation and breaks
    const processedBody: ProcessedBodyItem[] = body
      .split("\n")
      .reduce((acc: ProcessedBodyItem[], line, index) => {
        if (line.trim() === "") {
          const lastItem = acc[acc.length - 1];
          if (typeof lastItem === "object" && lastItem.type === "break") {
            lastItem.spacing += 1;
          } else {
            acc.push({ type: "break", spacing: 1 });
          }
        } else {
          if (line.startsWith("\t")) {
            const indentLevel = line.match(/^\t+/)?.[0].length ?? 0;
            acc.push(
              `${index === 0 ? "" : "  "}<MailToIndent spacing={${indentLevel * 4}}/>${line.trim()}`
            );
          } else {
            acc.push(`${index === 0 ? "" : "  "}${line}`);
          }
        }
        return acc;
      }, []);

    let jsxString = processedBody
      .map((item, index) =>
        typeof item === "string"
          ? `${index === 0 ? "" : "  "}${item}`
          : `${index === 0 ? "" : "  "}<MailToBreak spacing={${item.spacing}} />`
      )
      .join("\n");

    if (body.length === 0) {
      jsxString = "";
    }
    return `<MailTo
  to=${toArray.length === 1 ? JSON.stringify(to) : `{${JSON.stringify(toArray)}}`}
  subject=${JSON.stringify(subject)}${
    cc === ""
      ? ""
      : `
  cc=${ccArray.length === 1 ? JSON.stringify(cc) : `{${JSON.stringify(ccArray)}}`}`
  }${
    bcc === ""
      ? ""
      : `
  bcc=${bccArray.length === 1 ? JSON.stringify(bcc) : `{${JSON.stringify(bccArray)}}`}`
  }${
    obfuscate
      ? `
  obfuscate`
      : ""
  }
>
  <MailToTrigger>
    <Button>${buttonText}</Button>
  </MailToTrigger>
  <MailToBody>
    ${jsxString}
  </MailToBody>
</MailTo>
`;
  };

  return (
    <div className="flex content-between w-full">
      <div className="flex p-4 w-full">
        <form className="w-full flex flex-col gap-2">
          <div>
            <Label>To (comma-separated):</Label>
            <Input value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div>
            <Label>Subject:</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <Label>CC (comma-separated):</Label>
            <Input value={cc} onChange={(e) => setCc(e.target.value)} />
          </div>
          <div>
            <Label> BCC (comma-separated):</Label>
            <Input value={bcc} onChange={(e) => setBcc(e.target.value)} />
          </div>
          <div>
            <Label>Body:</Label>
            <Textarea
              id="body-textarea"
              rows={10}
              value={body}
              onKeyDown={handleKeyDown}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Obfuscate:
            </Label>
            <Checkbox
              checked={obfuscate}
              onCheckedChange={() => setObfuscate((prev) => !prev)}
            />
          </div>
          <div>
            <Label>Button Text:</Label>
            <Input
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
            />
          </div>
        </form>
      </div>
      <div className="w-full flex flex-col items-center pt-10">
        <h2 className="bg-muted-foreground w-full text-center text-muted p-2 rounded-t-md">
          Generated JSX
        </h2>
        <pre className="break-words whitespace-pre-wrap bg-muted rounded-b-md p-4 w-full">
          {generateJSX()}
        </pre>
        <div className="pt-8">
          <MailTo
            to={to}
            subject={subject}
            cc={cc}
            bcc={bcc}
            obfuscate={obfuscate}
          >
            <MailToTrigger>
              <Button>{buttonText}</Button>
            </MailToTrigger>
            <MailToBody>{body}</MailToBody>
          </MailTo>
        </div>
      </div>
    </div>
  );
};

export default MailToComposer;
