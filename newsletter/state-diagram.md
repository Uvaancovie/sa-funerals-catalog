stateDiagram-v2
    [*] --> Idle: Page Load (/catalog)
    
    Idle --> Editing: User focuses input field
    Editing --> Validating: Clicks "Subscribe"
    
    Validating --> Invalid: Form invalid / POPIA unticked
    Invalid --> Editing: User corrects input
    
    Validating --> Submitting: Form valid (.btn-primary loading spinner)
    
    Submitting --> Success_New: 200 OK (New lead created)
    Submitting --> Success_Existing: 200 OK (Already registered)
    Submitting --> Error_Network: 500 / Network timeout
    
    Success_New --> [*]: Shows Confirmation Toast
    Success_Existing --> [*]: Shows "Already Subscribed" notice
    Error_Network --> Submitting: User clicks "Retry"

    ![alt text](image.png)