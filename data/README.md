# School metadata sources

School detail links and missing coordinates were matched by normalized full school name against PlusEdu's public map dataset on 2026-10-17. Attribution: https://www.plusedu.ro/ (map: https://www.plusedu.ro/harta; observed dataset: https://www.plusedu.ro/static-data/f8aca2d611f73a29.txt).

`plusedu-coordinate-updates.json` is the audit record for the missing-coordinate update. Only null coordinates are filled; existing locations are preserved. No student records were collected.

`school-details.json` is keyed by the existing database school slug. Admission codes must have an exact specialization, admission year, and source URL. Only four 2026 codes for Gheorghe Lazăr were verified from the Ministry's specialization table. Do not infer codes from school IDs or propagate codes to another year. Other codes remain unavailable.

Social links must have a supporting source URL. The initial Spiru Haret Facebook link is listed by the National Library of Romania; other schools currently have website and PlusEdu links.

PlusEdu's 2026 calculator dataset merges some language variants (for example Sfântul Sava mathematics), so it was NOT imported over the existing historical admission rows. Preserve language distinctions until an official complete offer is available.
