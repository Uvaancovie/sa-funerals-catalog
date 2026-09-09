flowchart TB
    subgraph Client [Client Browser]
        A["Angular 19+ App\n(CatalogComponent)"]
    end

    subgraph SupabasePlatform [Supabase Cloud / Backend]
        B["Supabase Edge Function\n(/functions/v1/subscribe)"]
        C[("PostgreSQL Database\n(public.leads)")]
    end

    subgraph ThirdParty [Third-Party Services]
        D["Brevo (Sendinblue)\nTransactional & Marketing API"]
        E["Client Mail Server\n(Gmail, Outlook, Yahoo)"]
    end

    A -->|1. HTTPS POST\n(Encrypted Payload)| B
    B -->|2. SQL Query / RLS| C
    B -->|3. REST API Key\n(Bearer Token)| D
    D -->|4. SMTP / API Delivery| E

    