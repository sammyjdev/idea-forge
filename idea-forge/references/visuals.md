# Output formats

Read before presenting a result.

## Ask first

Before presenting a result (research summary, contradictions, dossier, handoff summary), ask one question: "How do you want this?". Preselect tables. When the person already chose a format in this conversation, use it and do not ask.

| Option | What the person gets |
|---|---|
| text | Short prose and lists only |
| tables | Structured tables: evidence, decisions, risks, comparisons |
| diagram | Flat diagrams in standard notation: BPMN for flows, UML for states, C4 for systems, crow's foot for data |
| illustration | A flat drawing of the idea, the journey or the system, for people who read pictures faster than notation |
| document | A shareable document with headings, tables and visuals combined |

The choice applies to what the person sees. Project files stay markdown, because target skills read them.

"same as before" or no answer: use the preselected format.

## Matching the content

| Content | text | tables | diagram | illustration |
|---|---|---|---|---|
| Who is involved | Paragraph | Stakeholder table | C4 context | People and systems with arrows |
| Step by step | Numbered list | Flow table | BPMN with lanes | Journey strip |
| States | List of states | Transition table | UML state diagram | Status track |
| Data | List of entities | Entity table | Crow's foot ER | Connected cards |
| Options | Recommendation and reason | Weighted matrix | Use the matrix | Side-by-side cards with scores |
| Evidence | Findings by question | Evidence table | Use the table | Use the table |
| Risks | Ranked list | Risk register | Risk grid | Risk grid |

When the chosen format does not fit the content (a diagram for a comparison), say so in one line and use the closest fit.

## Style for diagram and illustration

- Flat: solid fills, no gradients, shadows, 3D, hand-drawn strokes or sticky notes.
- Neutral palette with one primary color. Red, amber and green only for status, with a legend.
- Real labels from the session. At most about 15 elements; split when larger.
- Title line: `<ID> · <question it answers>`.

Render diagrams and illustrations as inline SVG through the visual widget when available. Render document as the Docs artifact when available, otherwise a markdown file sent to the person. Save diagrams as `docs/discovery/visuals/<id>-<slug>.svg` when the person wants to keep them.
