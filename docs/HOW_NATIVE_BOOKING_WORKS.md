# How Native Booking Works

This is a plain-language overview of Milano’s own booking page — what guests see, how it still uses ABC Salon (the salon’s existing booking system), and what that means for the business.

Technical notes for developers live in [ABC_BOOKING_PROTOCOL.md](ABC_BOOKING_PROTOCOL.md). Staff how-to for turning it on lives in [HOW_TO_USE_ADMIN.md](HOW_TO_USE_ADMIN.md).

---

## In short

Milano Nail Spa already takes online appointments through **ABC Salon**, the point-of-sale and booking tool the front desk uses every day.

**Native booking** keeps that same ABC system as the source of truth. What changes is the *front door*: guests book on **milanonailflowermound.com** in a Milano-styled five-step flow, instead of leaving the site for ABC’s own page.

When a guest finishes, the appointment is sent into ABC just as if they had booked on ABC’s website. The salon still sees it in ABC. The guest still gets confirmation by text from the salon.

Nothing here replaces ABC. It is a branded wrapper around the system you already run.

---

## Why this exists

ABC’s booking page works, but it looks and feels like ABC, not Milano. Guests also leave the salon website to finish the booking.

Native booking is meant to:

- Keep guests on the Milano site from “Book Now” through “Request appointment”
- Match the look of the rest of the website
- Still land every request in the same ABC calendar the staff already trust
- Fail safely: if something goes wrong, the guest can still open the original ABC booking page

---

## Three ways Book Now can work

Staff control this in the admin dashboard (**Online booking**) and under **Hours & Contact → Booking**.

| Mode | What the guest gets | Where the appointment lives |
|------|---------------------|-----------------------------|
| **Off** | Book Now opens ABC’s website in a new tab (original behavior) | ABC |
| **Milano page, ABC form inside** | Book Now stays on `/book`, but ABC’s form is shown inside the page | ABC |
| **Native Milano booking** | Book Now stays on `/book` and uses Milano’s own five-step wizard | Still ABC |

Native booking only runs when the Milano booking page is turned **on** *and* “Use native Milano booking UI” is turned **on**.

---

## What the guest walks through

The native page is five short steps. An order summary on the side keeps the running picture of the visit.

1. **Service** — Choose how many people are booking (minimum 1) and pick one or more treatments. Categories match the services page (Manicure first, and so on).
2. **Staff** — Choose a preferred technician, or “any available.”
3. **Date & time** — Pick a day, then a time that is actually open for that visit.
4. **Details** — Name, mobile number, and optional notes.
5. **Confirm** — Review and send the request.

After send, the site says the request was submitted. **The salon still confirms by SMS**, same as a booking that started on ABC.

Prices shown as estimates (often with a “+”) are a courtesy. Final price can still change in the salon, just as it can with ABC.

---

## How the Milano site talks to ABC

Think of ABC as the salon’s back office, and the Milano website as a nicer front desk.

The guest’s browser **never talks to ABC directly**. It only talks to Milano’s own website. Milano’s server then asks ABC for information and, at the end, hands ABC the finished request.

```
Guest on milanonailflowermound.com
        ↓
Milano website (our booking page)
        ↓
Milano server (a quiet go-between)
        ↓
ABC Salon (the system the front desk already uses)
```

In everyday terms, the Milano server does four jobs:

1. **Asks ABC for the menu** — service names, prices, and durations, so the first step stays in sync with what ABC offers.
2. **Asks ABC who is on staff and when the salon is open** — technicians, hours, holidays, and how many appointments an hour can hold.
3. **Asks ABC what is already booked that day** — so the time list hides slots that are full, too soon, or outside hours. If two people are booking together, that counts as two chairs, the same way ABC does.
4. **Sends ABC the finished request** — services, date, time, name, phone, notes, preferred staff, and number of clients. ABC stores it like any other online booking.

The guest never has to create an ABC account. From their point of view they never left Milano.

---

## What still belongs to ABC

Native booking does **not** create a second calendar.

ABC remains responsible for:

- The live book of appointments
- Which services exist and how they are priced in the POS
- Staff names and schedules
- Shop hours and holidays
- Text messages that confirm or follow up with the guest
- What the front desk sees when they open ABC on a work computer or tablet

If a service is added, renamed, or priced in ABC, native booking is designed to pick that up from ABC (and can also be matched to services already listed in the Milano website’s content system).

If native booking is turned off tomorrow, Book Now can go straight back to ABC. Appointments already sent are still in ABC.

---

## Safety nets while this is new

A few guardrails keep a test or a glitch from flooding the real calendar:

- **Live send can be switched off.** The page can still be tried without creating real appointments.
- **A daily cap** can limit how many live requests the Milano page is allowed to send (for example, one test booking per day while we prove it out).
- **If Milano cannot reach ABC**, the guest sees a clear message and a link to book on ABC the original way.
- **The Milano page does not replace the ABC link.** That original booking address stays in admin under Advanced, in case the provider URL ever changes.

Staff should treat the first live tests like any other online booking: watch ABC, confirm the text went out, and cancel the test visit if it was only for checking the system.

---

## What success looks like

For a shareholder, the test that matters is simple:

1. A guest (or a staff member posing as one) completes `/book` on the Milano site.
2. The same appointment appears in ABC Salon, with the right services, time, name, phone, and number of clients.
3. The guest receives the usual SMS from the salon.
4. The front desk can treat it like any other ABC booking — confirm, change, or cancel as they already do.

If those four things hold, native booking is doing its job: a better guest experience, same operational system.
