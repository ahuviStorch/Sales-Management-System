# MASTER HANDOFF PROMPT — BAKERY POS SYSTEM

## 1. Project overview

You are continuing the development of an existing React-based Point of Sale (POS) system for a home-based, seasonal bakery products sale.

This is an operational cashier system, not a customer-facing online store.

The project already contains working React code. You must preserve existing functionality and build incrementally rather than replace the application with a simplified demonstration.

**CRITICAL LANGUAGE REQUIREMENT:**

- All user-facing interfaces must be in Hebrew.
- All interfaces must support right-to-left (RTL) layout.
- All documentation, instructions, and explanations intended for the project owner must be written in Hebrew.
- Technical variable names and source code identifiers may be in English.
- This English prompt exists only to guide development.

## 2. Source of truth

The primary specification is:

`BAKERY_POS_FULL_SPEC_HE.md`

Read the entire specification before making architectural or functional changes.

When requirements conflict, the latest decisions in version 4.1 take precedence over older sections.

Do not remove existing features unless explicitly instructed.

Do not assume that every feature described in the specification has already been implemented.

Distinguish clearly between:

- Implemented functionality.
- Partially implemented functionality.
- Future requirements.
- Open business decisions.

## 3. Current implementation

The existing prototype uses React and CSS.

Important files:

- `src/App.jsx`
- `src/styles.css`

The prototype currently includes cashier workflows, product selection, carts, payment demonstration, order history, returns, and basic management settings.

The current implementation is not production-ready.

It does not include a real database, production authentication, payment processing, inventory integration, or complete reporting.

Do not claim these capabilities exist.

## 4. Most important UX requirements

The system must be extremely fast to operate during busy sales.

It must work well on:

- Small mobile phones.
- Standard mobile phones.
- Tablets.
- Desktop computers.

Minimize unnecessary scrolling.

### Checkout layout

The total payable amount and the **Confirm and Complete Payment** button must appear:

- At the top of the checkout screen.
- Side by side in the same horizontal row.
- Large enough to see and operate easily.
- In a sticky area that remains accessible during scrolling.

The payment method selection must appear immediately below.

The cash received field and change/shortfall display must be close together.

Optional customer contact fields should be collapsible.

### Cart layout

The cart total and the button to proceed to checkout must also appear side by side near the top.

The user must not have to scroll through the entire cart to complete a transaction.

## 5. Updated success-screen requirement — Version 4.1

**IMPORTANT NEW REQUIREMENT:**

After a payment has been successfully confirmed:

1. Display a clear Hebrew success message.
2. Keep the success screen visible for exactly **4 seconds (4,000 milliseconds)**.
3. Automatically transition to a new sale when the 4 seconds expire.
4. Provide a visible button to start a new sale immediately without waiting.
5. Cancel pending timers when leaving the success screen.
6. Prevent duplicate transitions.
7. Do not accidentally clear another active cart.

**Implementation status:**

This is currently a specification change only.

Do not modify the existing code unless the project owner explicitly requests implementation.

The current code may still use a 5-second timeout.

Any older documentation mentioning 5 seconds is superseded by this requirement.

## 6. Multiple simultaneous carts

The POS must support an unlimited number of carts.

A fixed bottom navigation bar must remain in one horizontal row.

The cart tabs area is horizontally scrollable independently from the rest of the navigation.

When space allows, approximately five cart tabs should be visible.

The remaining navigation controls must stay accessible.

Required controls include:

- Add a new cart.
- Back.
- Categories.
- More options.
- Current employee indicator.

Selecting a cart tab opens that cart's contents.

Creating a new cart happens immediately, without confirmation.

Removing an empty cart happens immediately.

Removing a cart containing products requires confirmation.

If the last cart is removed, the system must retain one empty cart.

Navigating between categories must never erase the current cart.

## 7. Customer types and discounts

The administrator can define customer types.

Each customer type may have an optional discount percentage.

Customer types must also be available for reporting when no discount is applied.

The administrator decides whether selecting a customer type is mandatory before starting each sale.

Customer type and customer contact details belong to each cart independently.

### Discount calculation order

Apply discounts sequentially:

1. Product discount.
2. Customer type discount on the remaining amount.

Example:

Original price: 100 NIS.

Product discount: 5%.

Remaining amount: 95 NIS.

Customer discount: 10%.

Final amount: 85.50 NIS.

Never simply add the percentages.

### Manual prices

A manually entered price is final by default.

Discounts are not applied to manual prices unless the administrator enables that policy.

The system must eventually support enabling or disabling discounts per transaction independently of customer classification.

## 8. Payment behavior

Cash is the default payment method.

The amount received field is optional.

Use a text input with `inputMode="decimal"` for monetary amounts.

Do not use numeric spinner controls.

When the received amount is entered:

- Show change when the amount is sufficient.
- Show shortfall when the amount is insufficient.

Credit card payments in the current prototype are demonstration-only.

Do not claim that a real payment has been processed.

The administrator can enable or disable credit card availability.

## 9. Returns and cancellations

There are two distinct return workflows.

### A. Standalone product cancellation

This workflow does not require a previous order.

It must work for anonymous customers.

The current sale cart must remain intact.

The cashier selects:

Category → Product → Price → Quantity.

The cashier can add multiple items to the cancellation.

A final summary shows the refund amount.

After completion, return to the previously active cart.

### B. Return from order history

A cashier can open a previous order and return one or more items.

Partial quantity returns must be supported.

The refund must use the actual price paid in the original transaction, not the current catalog price.

Never delete the original sale record.

Never allow returning more units than were originally purchased.

### Refund methods

Cash refunds are recorded immediately.

Credit refunds are recorded as pending until real payment processing is integrated.

The administrator determines:

- Whether credit refunds are available.
- Whether credit cancellation fees apply.
- The fee percentage.

Do not invent financial rules where the specification leaves them undecided.

## 10. Additional options menu

The compact More Options menu contains:

- Order history.
- Select customer type.
- Standalone product cancellation.
- Management area.

## 11. Order history

Orders must be displayed newest first.

Search must support:

- Customer name.
- Phone number.
- Email address.

The search field selector should remain compact.

Each order should preserve:

- Date and time.
- Employee.
- Customer type.
- Customer contact information.
- Purchased items.
- Actual prices.
- Quantities.
- Payment method.
- Recorded returns.

For the current prototype, temporary in-memory data is acceptable.

For production, persistent storage will be required.

## 12. Product catalog and management

The long-term system must support unlimited nested categories.

The administrator must be able to manage:

- Categories.
- Subcategories.
- Products.
- Suppliers and agents.
- Multiple price options.
- Default prices.
- Product discounts.
- Customer types.
- Employees.
- Permissions.
- Inventory.
- Reports.

Catalog management must be practical for large product collections.

Future requirements include:

- Bulk product entry.
- Product duplication.
- Templates.
- CSV/XLSX imports.
- Bulk editing.
- Default-value inheritance.

These features must not be described as implemented unless they have actually been built.

## 13. Design direction

The interface should feel professional, welcoming, and suitable for bakery products.

Recommended visual direction:

- Warm cream and off-white backgrounds.
- Coffee and espresso tones.
- Soft caramel accents.
- A distinct green for successful actions.
- Clear red styling for destructive actions.
- Compact cards.
- Consistent rounded corners.
- Subtle shadows.
- Clear Hebrew typography.

Do not sacrifice usability for decoration.

Do not sacrifice visual quality merely to reduce the number of clicks.

Important touch targets must remain usable.

## 14. Development workflow

Before changing the code:

1. Review the current implementation.
2. Identify the affected functions and screens.
3. Explain the proposed change in Hebrew.
4. Preserve unrelated functionality.
5. Make the smallest practical change.
6. Check for regressions.
7. Report what was changed and what remains incomplete.

Never replace the complete working application with a reduced example.

Do not invent backend integrations.

Do not silently change business rules.

## 15. Testing requirements

Test important workflows on mobile and desktop.

Include:

- Employee selection.
- Customer type selection.
- Category navigation.
- Product price selection.
- Manual price entry.
- Quantity adjustment.
- Adding and editing cart items.
- Multiple cart switching.
- Creating and removing carts.
- Checkout.
- Cash received and change calculation.
- Success-screen transition.
- Order history.
- Standalone cancellation.
- Historical partial returns.
- Management settings.

Test with 1, 5, 6, and 20 carts.

Check the layout with a mobile keyboard open.

For the future 4-second success transition, test both automatic navigation and immediate navigation using the button.

## 16. Final instruction

The goal is to develop a complete, reliable, attractive, fast Hebrew RTL POS system.

Preserve the existing working React application.

Use the full Hebrew specification as the primary reference.

Ask for clarification only when a missing business decision would materially affect the implementation.

Do not change source code until the project owner requests a specific change.