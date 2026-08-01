import email
import imaplib
import os
import re
import smtplib
import ssl
from email.header import decode_header
from email.message import EmailMessage
from email.utils import parseaddr
from dotenv import load_dotenv
import os
from pathlib import Path

SCRIPT_FOLDER = Path(__file__).resolve().parent
PROCESSED_FILE = SCRIPT_FOLDER / "processed_messages.txt"

load_dotenv()
# =====================================================
# CONFIGURATION
# =====================================================
GMAIL_ADDRESS = os.getenv("GMAIL_ADDRESS")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")

IMAP_SERVER = "imap.gmail.com"
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465

# Use the exact subject configured in Web3Forms.
CONTACT_SUBJECT = "New Andrew Tech Website Enquiry"

print("Processed file location:", PROCESSED_FILE)
# Gmail keyword added after a successful automatic reply.
PROCESSED_KEYWORD = "AndrewTechAutoReplied"


def decode_text(value: str | None) -> str:
    """Decode an email header safely."""
    if not value:
        return ""

    decoded_parts = decode_header(value)
    result = []

    for part, encoding in decoded_parts:
        if isinstance(part, bytes):
            result.append(part.decode(encoding or "utf-8", errors="replace"))
        else:
            result.append(part)

    return "".join(result)


def get_plain_text(message: email.message.Message) -> str:
    """Extract the plain-text body from an email."""
    if message.is_multipart():
        for part in message.walk():
            content_type = part.get_content_type()
            disposition = str(part.get("Content-Disposition", ""))

            if (
                content_type == "text/plain"
                and "attachment" not in disposition.lower()
            ):
                payload = part.get_payload(decode=True)

                if payload:
                    charset = part.get_content_charset() or "utf-8"
                    return payload.decode(charset, errors="replace")
    else:
        payload = message.get_payload(decode=True)

        if payload:
            charset = message.get_content_charset() or "utf-8"
            return payload.decode(charset, errors="replace")

    return ""


def extract_form_value(body: str, field_name: str) -> str:
    """
    Extract values from Web3Forms messages formatted like:

    Name: John Smith
    Email: john@example.com
    Service: Web Development
    """
    pattern = rf"(?im)^\s*{re.escape(field_name)}\s*:\s*(.+?)\s*$"
    match = re.search(pattern, body)

    return match.group(1).strip() if match else ""


def is_valid_email(value: str) -> bool:
    """Perform a basic email validation."""
    _, address = parseaddr(value)

    return bool(
        address
        and re.fullmatch(
            r"[^@\s]+@[^@\s]+\.[^@\s]+",
            address
        )
    )


def send_auto_reply(
    recipient_email: str,
    recipient_name: str
) -> None:
    """Send the Andrew Tech acknowledgement email."""
    message = EmailMessage()

    message["From"] = (
        f"Andrew Tech <{GMAIL_ADDRESS}>"
    )
    message["To"] = recipient_email
    message["Subject"] = (
        "Thank you for contacting Andrew Tech"
    )

    greeting_name = recipient_name or "there"

    plain_text = f"""Dear {greeting_name},

Thank you for contacting Andrew Tech.

We have received your enquiry and will review your requirements carefully. We will get back to you shortly regarding your project or any further questions.

Kind regards,

Andrew Tech
Independent Software Developer & Consultant
"""

    html_content = f"""
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f6f8;">
    <div style="
        max-width:640px;
        margin:30px auto;
        background:#ffffff;
        border:1px solid #dfe5ec;
        border-radius:12px;
        overflow:hidden;
        font-family:Arial,Segoe UI,sans-serif;
    ">

        <!-- Header -->
        <div style="
            padding:24px;
            background:#0f1b2e;
            text-align:center;
        ">

            <div style="
                display:inline-block;
                padding:14px 24px;
                border:1px solid #00ffff;
                border-radius:12px;
                background:#0a121e;
                text-align:center;
            ">

                <div style="
                    font-family:Arial,Helvetica,sans-serif;
                    font-size:32px;
                    font-weight:bold;
                    letter-spacing:1px;
                    color:#ffffff;
                ">
                    <span style="color:#00ffff;">⚡</span>
                    ANDREW
                    <span style="color:#6EA8FE;">TECH</span>
                </div>

                <div style="
                    margin-top:8px;
                    color:#cbd5e1;
                    font-family:Arial,Helvetica,sans-serif;
                    font-size:14px;
                ">
                    Independent Software Developer &amp; Consultant
                </div>

            </div>

        </div> <!-- <-- This closing div was missing -->

        <!-- Body -->
        <div style="padding:32px;color:#263238;">

            <p style="font-size:16px;">
                Dear {greeting_name},
            </p>

            <p style="font-size:16px;line-height:1.7;">
                Thank you for contacting
                <strong>Andrew Tech</strong>.
            </p>

            <p style="font-size:16px;line-height:1.7;">
                We have received your enquiry and will review your
                requirements carefully.
            </p>

            <p style="font-size:16px;line-height:1.7;">
                We will get back to you shortly regarding your project
                or any further questions.
            </p>

            <p style="margin-top:30px;font-size:16px;">
                Kind regards,<br>
                <strong>Andrew Tech</strong><br>
                Independent Software Developer &amp; Consultant
            </p>

        </div>

    </div>
</body>
</html>
"""

    message.set_content(plain_text)
    message.add_alternative(html_content, subtype="html")

    ssl_context = ssl.create_default_context()

    with smtplib.SMTP_SSL(
        SMTP_SERVER,
        SMTP_PORT,
        context=ssl_context
    ) as smtp:
        smtp.login(
            GMAIL_ADDRESS,
            GMAIL_APP_PASSWORD
        )

        smtp.send_message(message)


def process_contact_messages() -> None:
    """Find Web3Forms messages and send acknowledgements."""

    if not GMAIL_ADDRESS or not GMAIL_APP_PASSWORD:
        raise RuntimeError(
            "Gmail environment variables are not configured."
        )

    with imaplib.IMAP4_SSL(IMAP_SERVER) as mailbox:
        mailbox.login(
            GMAIL_ADDRESS,
            GMAIL_APP_PASSWORD
        )

        status, _ = mailbox.select("INBOX")

        if status != "OK":
            raise RuntimeError(
                "Unable to open Gmail inbox."
            )

        search_query = (
            f'(SUBJECT "{CONTACT_SUBJECT}" '
            f'FROM "web3forms.com")'
        )

        status, search_data = mailbox.search(
            None,
            search_query
        )

        print("Search Status:", status)
        print("Search Query :", search_query)
        print("Message IDs  :", search_data)

        if status != "OK":
            raise RuntimeError(
                "Unable to search Gmail."
            )

        # Newest messages first
        message_ids = search_data[0].split()[::-1]

        print(
            f"Found {len(message_ids)} contact message(s)."
        )

        processed_ids = load_processed_ids()

        for message_id in message_ids:
            print("=" * 60)
            print(
                "Processing IMAP Message ID:",
                message_id.decode()
            )

            try:
                status, message_data = mailbox.fetch(
                    message_id,
                    "(RFC822)"
                )

                if status != "OK":
                    print(
                        f"Could not read message {message_id!r}."
                    )
                    continue

                raw_message = message_data[0][1]

                received_message = email.message_from_bytes(
                    raw_message
                )

                subject = decode_text(
                    received_message.get("Subject")
                )

                sender = decode_text(
                    received_message.get("From")
                )

                message_date = decode_text(
                    received_message.get("Date")
                )

                print("Subject :", subject)
                print("From    :", sender)
                print("Date    :", message_date)

                # Use the permanent email Message-ID,
                # not the temporary IMAP numeric ID.
                original_message_id = (
                    received_message
                    .get("Message-ID", "")
                    .strip()
                )

                if not original_message_id:
                    print(
                        "Skipped: original email has no Message-ID."
                    )
                    continue

                if original_message_id in processed_ids:
                    print(
                        "Skipped: this enquiry was already "
                        f"processed: {original_message_id}"
                    )
                    continue

                body = get_plain_text(
                    received_message
                )

                print("\nEMAIL BODY")
                print("-" * 40)
                print(body)
                print("-" * 40)

                visitor_name = extract_form_value(
                    body,
                    "Name"
                )

                visitor_email = extract_form_value(
                    body,
                    "Email"
                )

                print("Visitor Name :", visitor_name)
                print("Visitor Email:", visitor_email)

                if not is_valid_email(visitor_email):
                    print(
                        "Skipped because a valid visitor "
                        f"email was not found. Subject: {subject}"
                    )
                    continue

                send_auto_reply(
                    visitor_email,
                    visitor_name
                )

                # Save only after the email sends successfully.
                save_processed_id(
                    original_message_id
                )

                # Update the in-memory set too, preventing
                # duplicates during the same script run.
                processed_ids.add(
                    original_message_id
                )

                print(
                    f"Auto reply sent to {visitor_email}."
                )

            except Exception as error:
                print(
                    "Failed to process message "
                    f"{message_id!r}: {error}"
                )

        mailbox.logout()

def load_processed_ids() -> set[str]:
    if not os.path.exists(PROCESSED_FILE):
        return set()

    with open(PROCESSED_FILE, "r", encoding="utf-8") as file:
        return {
            line.strip()
            for line in file
            if line.strip()
        }


def save_processed_id(message_id: str) -> None:
    with open(PROCESSED_FILE, "a", encoding="utf-8") as file:
        file.write(message_id + "\n")


if __name__ == "__main__":
    try:
        process_contact_messages()
    except Exception as error:
        print(f"Auto-reply job failed: {error}")
        raise