# Real Estate Chatbot UI Skill

Act as a frontend React developer.

Create a chatbot-style UI to collect property requirements step-by-step.

Flow:

1. Welcome Message:
"Hi 👋 Welcome! I'll help you find the right property."

2. Ask: Property Type
Options:
- Apartment
- Villa
- Plot / Land
- Commercial
- Skip

3. Ask: Purpose
- Self Use
- Investment
- Rental Income
- Skip

4. Ask: Preferred Location
- City Center
- Near IT Park
- Highway Side
- Custom Input
- Skip

5. Dynamic Questions (based on Property Type):

If Apartment:
- BHK (1,2,3,4+)
- Floor Preference

If Villa:
- Villa Type (Independent / Gated)
- Furnishing (Fully / Semi / Unfurnished)

If Plot:
- Plot Size (600–1200 / 1200–2400 / 2400+)

If Commercial:
- Type (Shop / Office / Warehouse)
- Area Range

6. Amenities (multi-select):
- Parking
- Lift
- Security
- Gym
- Gated Community
- Others

7. Contact Details:
- Full Name
- Phone Number
- Email (optional)

Features:
- Chat UI (bot + user messages)
- Options as buttons
- Allow skip
- Maintain state
- Smooth step transitions

Final Output:
- Collect all user inputs into a "filters" object
- Return filters

Return:
- React component
- State handling logic