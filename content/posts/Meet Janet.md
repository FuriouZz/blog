---
author: furiouzz
tags:
  - janet
---

For my tech watch, I am spending most of my time on [https://lobste.rs/](https://lobste.rs/) and [Reddit](https://reddit.com).

It is so easy to get lost and jump link after link.

Lately I've been reading [Janet for Mortal](https://janet.guide/), a book written by [Ian Henry](https://ianthehenry.com/).

At the beginning, I asked myself _Why people like to code with so many parenthesis?_.

But when I read something written by a passionate, it's difficult for me to not let a chance to a new language.

So _What is Janet?_ Well, it's another programming language, a simple one, pleasant to use and powerful.

One of my favorite feature are **Parsing Expression Grammars** that I call **PEGs**.

PEGs fill the role of regular expression in Janet.

```clojure
(def date-peg {
  :year  (capture (choice (repeat 4 :d) (repeat 2 :d)))
  :month (capture (sequence (range "01") (range "19")))
  :day   (capture (sequence (range "03") (range "19")))
  :main  (sequence :year "-" :month "-" :day)
})

(pp (peg/match date-peg "2025-02-01"))
; => @["2024" "02" "01"]
```

This peg can be shorten with aliases

```clojure
(def date-peg {
  :year  (<- (+ (n 4 :d) (n 2 :d)))
  :month (<- (* (range "01") (range "19")))
  :day   (<- (* (range "03") (range "19")))
  :main  (* :year "-" :month "-" :day)
})

(pp (peg/match date-peg "2025-02-01"))
; => @["2024" "02" "01"]
```

Let's take an example with this list of ledger transactions:

```text
2024-01-01 Music Subscription
  expenses:subscriptions          12.00€
  assets:checkings               -12.00€

2024-01-05 Grocery
  expenses:grocery                12.00€
  assets:checkings               -12.00€
```
