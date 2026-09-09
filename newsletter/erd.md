erDiagram
    LEADS {
        uuid id PK "gen_random_uuid()"
        text email UK "NOT NULL, unique"
        text first_name "Optional"
        text source "Default: 'catalog-newsletter'"
        text utm_source "e.g. google, direct, email"
        text utm_medium "e.g. cpc, referral"
        text utm_campaign "e.g. expo-2026"
        text lead_magnet "Default: 'trade-catalog'"
        bigint brevo_contact_id "External ID from Brevo"
        boolean email_sent "Default: false"
        boolean consent_given "POPIA compliance flag"
        timestamptz consent_timestamp "Timestamp of consent"
        timestamptz created_at "now()"
    }

    AUDIT_LOGS {
        int id PK "Identity"
        int user_id "Optional / Null for public leads"
        text action "'newsletter_subscription'"
        text email "Subscriber email"
        text ip_address "Client IP"
        boolean success "true / false"
        timestamptz timestamp "now()"
    }

    LEADS ||--o| AUDIT_LOGS : "generates on subscribe"

    ![alt text](image.png)