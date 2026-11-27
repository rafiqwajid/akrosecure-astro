---
title: "Security in the AI Era: When Machines Find the Bugs"
date: 2026-11-26
description: AI agents are now finding vulnerabilities that humans miss — and
  attackers have the same tools. What changes, what stays the same, and how to
  stay secure when discovery is no longer the bottleneck
tag: AI security
---
In November 2024, Google's Big Sleep agent found a real, exploitable flaw in SQLite — a stack buffer underflow in one of the most widely used pieces of software in the world. The project's own testing and its fuzzing infrastructure had missed it. The developers fixed it the same day, before it reached an official release. Google's team called it the first public example of an AI agent finding a previously unknown exploitable memory-safety issue in widely used software.

That was a research project. Less than a year later, at DARPA's AI Cyber Challenge final in August 2025, autonomous systems worked across 54 million lines of open-source code, found 54 of the 63 planted vulnerabilities, patched 43 of them, and found 18 real vulnerabilities that nobody had planted — at an average cost of about $152 per task.

The research phase is ending. The question now is what this means for everyone else.

## What actually changed

**Finding bugs is becoming cheap.** For decades, the hard part of security was discovery: a skilled researcher spending days or weeks understanding a codebase well enough to spot the one wrong assumption. AI agents can now do a version of that work at machine speed, around the clock, across codebases no single person could hold in their head. The bottleneck is moving. It is no longer "can we find the bug?" It is "can we decide which findings matter, and fix them before someone else uses them?"

**Both sides get the same tools.** There is no version of this story where only defenders get AI. Attackers use the same class of tools to find vulnerabilities, write exploits, and craft convincing phishing. Any advantage from AI is temporary and shared. What lasts is how fast and how well you respond.

**AI writes code too — a lot of it, fast.** That means more code to secure, produced faster than before. The bugs in AI-written code are usually not exotic. They are the ordinary kind — injection flaws, broken access checks, logic errors — just produced at higher volume, by people who may not have written the code themselves and so may not know where to look.

## What needs to be done

**1. Find your own bugs first, with the same class of tools.** Run AI-assisted review and fuzzing on your own code and your dependencies before someone else's agent does. The goal is not to collect findings; it is to close the gap between what an attacker can discover and what you already know about.

**2. Make fixing fast.** When discovery is cheap, triage and patching become the work. Prioritise by exploitability, not by severity score alone. Automate your tests so a patch can ship with confidence instead of sitting in a queue while the window stays open.

**3. Treat AI-generated code as untrusted input.** Review it. Test it. Know where it came from. An AI coding assistant is a very fast junior developer, not a senior reviewer. Code it produces still needs the same review, the same tests, and the same accountability as code a person wrote.

**4. Secure the AI itself.** AI agents with tool access, prompts carrying sensitive data, models trained on your code — these are new attack surface. Give agents the least privilege they need to do the job. Keep secrets and customer data out of prompts. Log what the agent does, the same way you would log what a person does.

**5. Keep a human in the loop where it counts.** AI proposes; humans decide — especially on anything that touches access, data, or production. Automation should remove the routine work, not the judgement.

**6. Don't abandon the basics.** Patching, access control, network segmentation, backups, monitoring — AI makes these more valuable, not less. A bug found in minutes is only useful if you can fix it and verify the fix in hours. The fundamentals are what turn a finding into a defence.

## How to stay secure in this era

In practical terms, the checklist is short and mostly familiar:

* **Know what you run.**

   Keep an inventory of your software and dependencies, so when a vulnerability is announced you know in minutes whether it affects you.
* **Patch on a rhythm — and faster for anything facing the internet.**

   The time between a bug becoming known and being exploited is shrinking.
* **Test your own systems the way an attacker would.**

   AI-assisted testing is now within reach of small teams, not just large ones.
* **Limit the blast radius.**

   Assume something will get in eventually, and make sure it cannot get far: segment networks, restrict access, separate duties.
* **Train people, not just tools.**

   AI makes phishing more convincing. The defence is verification habits — checking before clicking, confirming before sending — not just better filters.

## The bottom line

This era does not reward whoever has the cleverest AI. It rewards whoever pairs AI's speed with disciplined engineering and human judgement. The bugs will keep coming faster. The teams that stay secure will be the ones that can find, fix, and verify faster too — and that never let the speed of the tools become an excuse to skip the thinking.

If you want help thinking through where your team stands — what to automate, what to keep human, and what to fix first — that is the work we do. [Get in touch](/contact).

*Sources: Google Project Zero, "Project Zero: November 2024" (Big Sleep's SQLite discovery); DARPA, "AI Cyber Challenge marks pivotal inflection point for cyber defense" (AIxCC final results, August 2025).*
