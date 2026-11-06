# Output formats

Read before presenting a result.

Before presenting a result (research summary, contradictions, dossier, handoff summary), ask once per conversation, "How do you want this?", with tables preselected: text, tables, diagram (BPMN for flows, UML for states, C4 for systems, crow's foot for data), illustration (a flat drawing for people who read pictures faster than notation) or document. Reuse the choice after that; no answer means tables. The choice applies to what the person sees. Project files stay markdown, because target skills read them.

When the format does not fit the content (a diagram for a comparison of options), say so in one line and use the closest fit: a matrix for options, a table for evidence, a ranked list or grid for risks.

Diagrams and illustrations: flat fills with no gradients, shadows, 3D, hand-drawn strokes or sticky notes, a neutral palette with one primary color, red, amber and green only for status with a legend, real labels from the session, at most about 15 elements (split when larger), and a title line `<ID> · <question it answers>`. Render them as inline SVG through the visual widget when available, a document as the Docs artifact when available, otherwise markdown. Save a diagram the person wants to keep as `docs/discovery/visuals/<id>-<slug>.svg`.
