flowchart TD
    A([User Visits /catalog Page]) --> B{Interacts with Newsletter Section?}
    
    B -- No --> C[Continues Browsing Catalog]
    
    B -- Yes --> D[Enters Email & Submits Form]
    
    D --> E[Angular Form Validation & POPIA Check]
    
    E -- Invalid --> F[Show Input Error / Inline Validation]
    F --> D
    
    E -- Valid --> G[Save Lead to Supabase 'public.leads']
    
    G --> H[Trigger Brevo Contact Sync & Automation API]
    
    H --> I[Brevo Sends Automated Welcome & Catalog Trade Bulletin]
    
    I --> J([Success Message Displayed to User])

    %% Styling with SAFS Design Tokens
    classDef startEnd fill:#151A40,stroke:#C5A059,stroke-width:2px,color:#FFFFFF;
    classDef decision fill:#F8FAFC,stroke:#151A40,stroke-width:2px,color:#151A40;
    classDef process fill:#FFFFFF,stroke:#C5A059,stroke-width:2px,color:#2C3E50;
    classDef success fill:#151A40,stroke:#C5A059,stroke-width:2px,color:#FFFFFF;
    classDef error fill:#FEE2E2,stroke:#DC2626,stroke-width:1px,color:#991B1B;

    class A,J startEnd;
    class B decision;
    class C,D,E,G,H,I process;
    class F error;

    ![alt text](image.png)