---
title: Practical PKI, Certificates & TLS for Engineers
description: Most PKI and TLS failures are lifecycle failures, not cryptography failures. This course teaches engineers to design, issue, rotate, revoke and monitor certificates properly — and to configure TLS and mTLS so a deployment survives production, not just the demo.
tag: PKI · CERTIFICATES · TLS / MTLS
status: Coming soon
statusBadge: Coming soon — in development
shortTitle: Practical PKI, Certificates & TLS
lede: "A lab-based course on the part of PKI that actually breaks in production: the certificate lifecycle. Design a PKI properly, automate issuance, configure TLS and mTLS correctly, and operate rotation, revocation and monitoring so certificates stop being an outage category."
cardMeta:
  - label: Audience
    value: Engineers & architects
    detail: Platform, product, infrastructure and security engineers who own systems that use certificates.
  - label: Format
    value: Instructor-led, lab-based
    detail: Planned as live online sessions with hands-on labs and a capstone exercise.
  - label: Status
    value: In development
    detail: No dates or prices yet. Register interest and you will be told first when enrolment opens.
pageMeta:
  - label: Audience
    value: Engineers & architects
    detail: Platform, product, infrastructure and security engineers responsible for systems that issue or consume certificates.
  - label: Format & duration
    value: Live online, lab-based
    detail: "Planned duration: two days of instruction and labs. Confirmed dates are published when enrolment opens — none are being booked yet."
  - label: Status & price
    value: In development
    detail: No price has been set and no payment is taken. Register interest to be notified first.
---

## About this course

The mathematics of TLS is the easy part. What breaks in production is everything around it: certificates issued by hand, rotation nobody rehearsed, revocation that was never tested, trust stores nobody owns. This course treats PKI as an engineering discipline — design, automation and operations — rather than a protocol to memorise.

Every module pairs the concept with a lab: you will stand up a small PKI, break it in the ways production PKIs break, and fix it properly. The capstone is an end-to-end design and build that is reviewed against the same lifecycle checklist AkroSecure uses in its engineering engagements.

## What you will learn

- How X.509 trust is established — chains, roots, intermediates — and where it silently breaks
- How to design a CA hierarchy sized to an organisation's risk, scale and operating model
- How to automate issuance and renewal, including ACME, so expiry stops being a surprise
- How to configure TLS correctly — versions, cipher suites, session behaviour — and verify it with testing tools
- How mTLS works in production: service identity, rollout patterns and the failure modes that matter
- How to operate the full lifecycle: rotation, revocation, monitoring, ownership and inventory
- How to diagnose common PKI and TLS failures from symptoms to root cause

## Prerequisites

- Working familiarity with networking fundamentals — TCP/IP, DNS and HTTP
- Comfort with a Linux command line and basic shell tooling
- A basic grasp of public-key concepts — key pairs, signatures, hashes (a refresher opens the course)
- No prior PKI operations experience is assumed or required

## Syllabus

<ol class="syllabus">
  <li><span class="mn">1</span><div><h4>Why PKI fails in production</h4><p>Trust, lifecycle and the gap between the design diagram and the running estate. A refresher on the cryptography the rest of the course depends on.</p></div></li>
  <li><span class="mn">2</span><div><h4>X.509 certificates in depth</h4><p>Fields, extensions, subject alternative names, key usage and certificate policies — read real certificates and spot what is wrong with them.</p></div></li>
  <li><span class="mn">3</span><div><h4>Trust architecture</h4><p>Root and intermediate CAs, hierarchy design, cross-signing and trust stores — and who should own each piece.</p></div></li>
  <li><span class="mn">4</span><div><h4>Issuance done properly</h4><p>Enrolment protocols, certificate profiles and ACME automation. Lab: issue and renew without touching a command by hand twice.</p></div></li>
  <li><span class="mn">5</span><div><h4>TLS configuration, verified</h4><p>Protocol versions, cipher suites, session resumption and the misconfigurations scanners actually find. Lab: harden a service and prove it.</p></div></li>
  <li><span class="mn">6</span><div><h4>mTLS in production</h4><p>Service identity, rollout patterns, and what breaks at scale: rotation overlap, clock skew, and clients that ignore revocation.</p></div></li>
  <li><span class="mn">7</span><div><h4>Revocation &amp; transparency</h4><p>CRLs, OCSP, Certificate Transparency — and what clients really check when a certificate must die quickly.</p></div></li>
  <li><span class="mn">8</span><div><h4>Lifecycle operations &amp; capstone lab</h4><p>Rotation, monitoring, expiry prevention and ownership. Capstone: design, build and operate a small PKI end to end, reviewed against a lifecycle checklist.</p></div></li>
</ol>

## Who teaches it

<div class="note-box" style="margin-top:14px;">The course is led by a <strong>security principal specialising in PKI, cryptography and secure communications</strong> — the same discipline behind AkroSecure's product-security and TLS/mTLS engineering work. AkroSecure is deliberately brand-first: no instructor names or portraits are published, and the course is judged on its syllabus, its labs and its rigour.</div>

## Watch

<div class="video-ph" style="margin-top:14px;" role="img" aria-label="Video placeholder: course preview videos are coming soon">
  <span class="play" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 20 20"><path d="M6 4 L16 10 L6 16 Z" fill="currentColor"/></svg></span>
  <strong>Course preview videos — coming soon</strong>
  <p>Preview lessons and lab walkthroughs for this course will be embedded here when they are published. None are available yet.</p>
</div>
