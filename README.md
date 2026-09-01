# AP Wire Terminal

Dense Bloomberg-style **all-news** wire terminal.

- Black background + amber text
- Larger readable type (18px base)
- Real dated wires only (AP, Reuters, Bloomberg, Yahoo, ASCO Post, ASCO Daily News, ESMO Daily Reporter, AFP, BBC, SCMP, Nikkei, STAT, FiercePharma, HK01)
- Source chip appears only when a dated item exists for that wire
- No invented copy, no fake bylines, no X posts
- **DELAYED** tape locked to official U.S. closes, Monday 31 Aug 2026 4 p.m. EDT:
  - DJIA 53,185.90 (−374.09, −0.7%)
  - SPX 7,686.14 (−25.62, −0.3%)
  - COMP 26,370.89 (−31.53, −0.1%)
  - No Russell 2000 — AP did not print a RUT close in the Monday wrap
- On-demand **REFRESH** (button or `R`) merges reachable RSS from allowed wires on top of the verified seed. Seeded wires never drop. Filter resets to ALL.
- Self-contained local `index.html` plus published `index.html` shell + `app.js`. Seed stamped Tue 1 Sep 2026 11:05 a.m. HKT (STAT/Bloomberg MFN nine-firm deals, AP Caine no-troops-at-polls letter, SCMP Xi-Putin, Shein IPO/gray-market, Nepal 903, SCOTUS ballroom stay, Messi, Honda-Nissan, Saudel T1). No invented Tuesday HKEX Shein open — allowed wires have not printed an official first print.

**Live preview:**  
https://htmlpreview.github.io/?https://github.com/h55msbkpbm-sudo/ap-news-terminal/blob/main/index.html

Not affiliated with The Associated Press or any listed source. Research / demo only.
