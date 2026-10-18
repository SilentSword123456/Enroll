# Admission research and product decisions — 2026-10-17

Sources reviewed:
- Current order, OMEC 6060/2025: https://legislatie.just.ro/Public/DetaliiDocument/301910
- Ministry algorithm explanation (historical; use current order for score and tie-break rules): https://static.admitere.edu.ro/2018/info/algoritmul/algoritm.html
- Ministry 2026 results: https://edu.ro/press_rel_54_26_rezultate_repartizare_computerizata_liceu
- PlusEdu's explanation and limitations: https://www.plusedu.ro/calculator-admitere
- PlusEdu public calculator dataset observed: https://www.plusedu.ro/static-data/a331f2f7ce6bdf74.txt

Candidates are processed in descending admission score with the current legal tie-breaks. For each candidate, the algorithm tries their options in their stated order, assigning the first eligible option with capacity. Putting a preferred competitive option first does not give a lower-scoring candidate priority over a higher-scoring candidate. The list should express genuine preferences and contain sufficient acceptable alternatives. Bilingual classes have additional language requirements; a language label alone does not prove eligibility.

For the regular 2026 route, the EN average determines the admission score; equal scores are resolved by V–VIII graduation average, Romanian exam mark, mathematics mark, then the relevant mother-tongue mark. Special routes have their own rules. Do not reuse historical score formulas from the old algorithm article.

PlusEdu compares the current county rank to a previous-year last-admitted rank, not to a national rank. This does not know other candidates' choices, changing capacity, cross-county applicants, or all tie-breaks. Its own calculator warns against using the estimate as an admission decision.

Implementation:
- Separate filtering (OR within each group, AND across groups), sorting, and application-list order.
- Keep the original profile colors and gradient direction. Profile colors are not chance/risk colors.
- Add sourced historical rank benchmarks only for exact normalized school + specialization + year matches from Bucharest. Show the source year and numerical comparison, never a percentage or guaranteed placement. Never filter a desired option out using rank.
- Search Google Maps using the school's full name plus address. Without verified Google Place IDs, Google resolves the named search; do not claim an exact Place-ID match.
- Synchronize on-page school markers with visible results, group multiple profiles under a school, and show school names without requiring a click. Keep the user's location opt-in.


## Additional comparison: admitereliceu.ro (checked 2026-10-18)

- https://admitereliceu.ro/calculati-medie-admitere-liceu still describes the 2021–2022 formula: 80% National Evaluation and 20% grades V–VIII. This is not the current admission-average formula.
- https://admitereliceu.ro/metodologie-admitere-liceu is explicitly for 2021–2022. It illustrates county ranking and processing a candidate's ordered choices, but must not override the current ministerial order, including tie-break rules.
- The homepage searches by name, grade, county and city. No documented probability or rank-based prediction formula was found on the homepage, calculator, FAQ or methodology pages checked.
- Product decision: explain county rank and ordered choices; show dated historical comparisons, not a promised placement or invented probability.
