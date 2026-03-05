1. How to identify when and how to make a template?

You should create a template when you notice you are repeating the same categories of information for different items.

    The "When": If you write "Track" and "Artist" and realize you’ve naturally included a definition, a list of fields, and how to delete them for both, you have a template.
    The "How": Look at the "questions" the reader (a developer or designer) needs answered for that section.
        For Data Types: They need to know: What is it? What data does it hold? How does it relate to others?
        For Features (like Capture Mode): They need to know: How does it start? What are the rules? What does the user see?

Example: You have "Track," "Artist," and "Album." A simple template for these would be:

    Summary (The prose you already wrote).
    Attributes (The specific data points like Title, Duration).
    Relationships (How it connects to other types).
    Lifecycle (How it’s created, moved to Staging, or deleted).

2. Vertical vs. Horizontal (High-Level) Structure?

This is the most common struggle in spec writing.

    Vertical (Feature-by-Feature): You define everything about "Capture Mode" (Data, Logic, UI) in one big block.
        Best for: Complex, self-contained features that don't affect the rest of the app much.
    Horizontal (Layer-by-Layer): You have one big "Data Model" section for the whole app, one big "UI" section, etc.
        Best for: Core systems where everything is interconnected (like your Library, Staging, and Repository).

Recommendation for Northstar:
Use a Hybrid approach.

    Horizontal for Core Architecture: Keep "Data Types" and "Library Management (Staging/Repository)" as high-level sections. These are the "laws of the land" that apply to everything.
    Vertical for "Add-on" Features: Keep "Capture Mode" as its own vertical section. It is a specific behavior that sits on top of the library. If you put Capture Mode logic inside the "Track" section, the "Track" section becomes too cluttered.

3. When to split a feature and define a new template?

As a feature grows, it usually hits a "breaking point" where it becomes hard to find a specific rule.

When to split:

    The "And" Test: If you find yourself describing a feature as "The Capture Mode and the Auto-Tagging Engine," it’s time to split them into two sub-features.
    The Page Test: If a single feature section exceeds 2–3 pages, it’s usually too dense. Split it into "Logic," "UI," and "Edge Cases."

How to define a new template for the split:
When you split a feature, your new template should focus on Interactions.

    Feature A (Capture Mode)
    Feature B (Smart Logic/Filtering)
    Integration: How Feature A and Feature B talk to each other.

Summary of the "Northstar" Structure

Based on your excerpt, here is how I would suggest arranging your current thoughts:

    Core Data Model (Horizontal): (Track, Artist, Album, Tag). Use a template focused on properties and relationships.
    System State (Horizontal): (Staging vs. Repository). Use a template focused on rules of movement and "source of truth."
    Functional Features (Vertical): (Capture Mode). Use a template focused on triggers, logic, and user feedback.

Regarding your ">" notes:
Keep them exactly where they are for now. Once you decide on a "Lifecycle" or "Edge Case" section in your template, you simply move those thoughts into that section and remove the ">" marker. This turns your "brainstorming" into "documentation" naturally.