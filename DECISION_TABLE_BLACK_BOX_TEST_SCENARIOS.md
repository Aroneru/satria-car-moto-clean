# Decision Table Black Box Test Scenarios

This document lists the black-box testing scenarios for the dashboard features in decision-table form. Each table focuses on observable input conditions and expected outcomes only.

## Assumptions

- The dashboard feature set includes the dashboard shell, dashboard home, contact management, services management, gallery management, financial management, queue management, reports, team management, and testimonials management.
- Tests are written from the user perspective, without asserting internal state or implementation details.
- Confirm dialogs are treated as observable outcomes.

## 1) Dashboard Shell and Navigation

| Rule | Current page | Click sidebar item | Click View Website | Click Logout | Logout succeeds | Expected result |
|---|---|---|---|---|---|---|
| D1 | Any dashboard page | Yes | No | No | - | Navigates to the selected dashboard route and highlights it as active |
| D2 | Any dashboard page | No | Yes | No | - | Opens the public website home page |
| D3 | Any dashboard page | No | No | Yes | Yes | Signs the user out and redirects to the login page |
| D4 | Any dashboard page | No | No | Yes | No | Keeps the user on the dashboard and shows logout failure behavior without redirect |
| D5 | Any dashboard page | No | No | No | - | Current page title matches the active dashboard section |

## 2) Dashboard Home

| Rule | Services exist | Testimonials exist | Gallery images exist | Team members exist | Queue items exist | Income transactions exist | Expected result |
|---|---|---|---|---|---|---|---|
| H1 | Yes | Yes | Yes | Yes | Yes | Yes | Shows all overview cards, POS stats, quick actions, and tips |
| H2 | No | No | No | No | No | No | Shows zero values for content cards and queue/revenue stats |
| H3 | Mixed data | Mixed data | Mixed data | Mixed data | Mixed data | Mixed data | Card counts and revenue values reflect the current content only |
| H4 | At least one income today | - | - | - | - | Yes | Today's revenue card shows the summed income for today only |
| H5 | No income today | - | - | - | - | No | Today's revenue card shows zero or no revenue value for today |

## 3) Contact Management

| Rule | Address filled | Phone 1 filled | Email 1 filled | Hours filled | Save clicked | Expected result |
|---|---|---|---|---|---|---|
| C1 | Yes | Yes | Yes | Yes | Yes | Saves the contact information and shows success feedback |
| C2 | No | Yes | Yes | Yes | Yes | Browser validation blocks submission because address is required |
| C3 | Yes | No | Yes | Yes | Yes | Browser validation blocks submission because phone 1 is required |
| C4 | Yes | Yes | No | Yes | Yes | Browser validation blocks submission because email 1 is required |
| C5 | Yes | Yes | Yes | No | Yes | Browser validation blocks submission because operating hours are required |
| C6 | Yes | Yes | Yes | Yes | No | Form stays editable and preview updates as values change |
| C7 | Optional secondary phone/email left blank | Yes | Yes | Yes | Yes | Primary contact data saves and secondary fields remain optional |

## 4) Services Management

| Rule | Existing services | Add or edit | Title filled | Description filled | Features list filled | Price(s) filled | Duration filled | Delete confirmed | Expected result |
|---|---|---|---|---|---|---|---|---|---|
| S1 | At least one service | Add | Yes | Yes | Yes | At least one price | Yes | - | New service is added and appears in the list |
| S2 | Existing service selected | Edit | Yes | Yes | Yes | At least one price | Yes | - | Selected service updates in place |
| S3 | Existing service selected | Delete | - | - | - | - | - | Yes | Service is removed from the list |
| S4 | Existing service selected | Delete | - | - | - | - | - | No | Service remains unchanged |
| S5 | No services match filter | Filter all | - | - | - | - | - | - | Empty state shows no services found |
| S6 | Car-priced service exists | Filter car | - | - | - | Car prices present | - | - | Service appears under car-only filter |
| S7 | Motor-priced service exists | Filter motor | - | - | - | Motorcycle prices present | - | - | Service appears under motor-only filter |
| S8 | No price fields filled | Add or edit | Yes | Yes | Yes | No prices | Yes | - | Service is saved with no price range shown |
| S9 | Features entered as multiple lines | Add or edit | Yes | Yes | Multiple lines | Yes | Yes | - | Each non-empty feature line is saved as a separate feature |

## 5) Gallery Management

| Rule | URL filled | Title filled | Category selected | Add or edit | Delete confirmed | Image URL valid | Expected result |
|---|---|---|---|---|---|---|---|
| G1 | Yes | Yes | Yes | Add | - | Yes | New image card appears in the grid |
| G2 | Yes | Yes | Yes | Edit | - | Yes | Existing image card updates with new values |
| G3 | - | - | - | Delete | Yes | - | Image is removed from the grid |
| G4 | - | - | - | Delete | No | - | Image remains in the grid |
| G5 | Yes | Yes | Yes | Add or edit | - | No | Preview shows the fallback placeholder image |
| G6 | No | Yes | Yes | Add or edit | - | - | Browser validation blocks submission because URL is required |
| G7 | Yes | No | Yes | Add or edit | - | - | Browser validation blocks submission because title is required |

## 6) Financial Management

| Rule | Transaction type | Category filled | Amount valid | Description filled | Date filled | Add or edit | Delete confirmed | Expected result |
|---|---|---|---|---|---|---|---|---|
| F1 | Income | Yes | Yes | Yes | Yes | Add | - | New income transaction is added |
| F2 | Expense | Yes | Yes | Yes | Yes | Add | - | New expense transaction is added |
| F3 | Existing transaction selected | Yes | Yes | Yes | Yes | Edit | - | Transaction updates in the table |
| F4 | Existing transaction selected | - | - | - | - | Delete | Yes | Transaction is removed |
| F5 | Existing transaction selected | - | - | - | - | Delete | No | Transaction remains unchanged |
| F6 | Filter type = income | - | - | - | - | - | - | Only income transactions are shown |
| F7 | Filter type = expense | - | - | - | - | - | - | Only expense transactions are shown |
| F8 | Filter period = today | - | - | - | - | - | - | Only today's transactions are shown |
| F9 | Filter period = week | - | - | - | - | - | - | Only transactions from the last 7 days are shown |
| F10 | Filter period = month | - | - | - | - | - | - | Only transactions from the current month are shown |
| F11 | No matching data after filters | - | - | - | - | - | - | Empty state shows no transactions found |
| F12 | Income and expense data exists | - | - | - | - | - | - | Total income, total expense, net profit, and monthly profit cards calculate correctly |

## 7) Queue Management

| Rule | Vehicle type | Search query matches model | Service selected | Customer name filled | Phone filled | Plate filled | Process order | Expected result |
|---|---|---|---|---|---|---|---|---|
| Q1 | Car | Yes | At least one | Yes | Yes | Yes | Yes | Queue item(s) are created with waiting status and a generated queue number |
| Q2 | Motorcycle | Yes | At least one | Yes | Yes | Yes | Yes | Queue item(s) are created using motorcycle pricing rules |
| Q3 | Any | No | At least one | Yes | Yes | Yes | Yes | Vehicle size stays at the default or previously selected option |
| Q4 | Any | Any | No | Yes | Yes | Yes | Yes | Submission is blocked and the user is prompted to select at least one service |
| Q5 | Any | Any | Any | Any | Any | Any | Status changed to in-progress | Queue updates and income transaction is created only when payment has not already been recorded |
| Q6 | Any | Any | Any | Any | Any | Any | Status changed to completed | Queue shows completed status and completion timestamp is set |
| Q7 | Any | Any | Any | Any | Any | Any | Status changed to cancelled | Queue status changes without creating a payment transaction |
| Q8 | Any | Any | Any | Any | Any | Any | Delete confirmed | Queue item is removed |
| Q9 | Any | Any | Any | Any | Any | Any | Delete cancelled | Queue item remains |
| Q10 | Status filter = waiting | - | - | - | - | - | - | Only waiting queue items are shown |
| Q11 | Status filter = in-progress | - | - | - | - | - | - | Only in-progress queue items are shown |
| Q12 | Status filter = completed | - | - | - | - | - | - | Only completed queue items are shown |
| Q13 | Status filter = all | - | - | - | - | - | - | All queue items are shown sorted from newest to oldest |

## 8) Reports

| Rule | Month selected | Report type | Queue data exists in month | Transaction data exists in month | Generate PDF | Expected result |
|---|---|---|---|---|---|---|
| R1 | Current month | Summary | Yes | Yes | Yes | PDF downloads with summary statistics and service breakdown |
| R2 | Previous month | Summary | Yes | Yes | Yes | PDF reflects only the selected month |
| R3 | Any month | Detailed | Yes | Yes | Yes | PDF includes summary plus income and expense transaction tables |
| R4 | Any month | Summary | No | No | Yes | PDF still downloads with zeroed statistics and no breakdown tables |
| R5 | Any month | Detailed | No | No | Yes | PDF downloads without detailed transaction rows |
| R6 | Any month | Any | Yes | Yes | No | No PDF is generated |

## 9) Team Management

| Rule | Name filled | Role filled | Description filled | Photo uploaded | Add or edit | Delete confirmed | Expected result |
|---|---|---|---|---|---|---|---|
| T1 | Yes | Yes | Yes | No | Add | - | New team member is added with fallback initial avatar |
| T2 | Yes | Yes | Yes | Yes | Add | - | New team member is added with uploaded photo |
| T3 | Existing member selected | Yes | Yes | Yes | Edit | - | Existing team member updates in the grid |
| T4 | - | - | - | - | Delete | Yes | Team member is removed |
| T5 | - | - | - | - | Delete | No | Team member remains |
| T6 | Invalid file type uploaded | - | - | - | Add or edit | - | Upload is rejected with an image-type validation message |
| T7 | File larger than 5 MB uploaded | - | - | - | Add or edit | - | Upload is rejected with a file-size validation message |
| T8 | No photo uploaded | Yes | Yes | Yes | Add or edit | - | UI shows the fallback initial avatar preview |

## 10) Testimonials Management

| Rule | Customer name filled | Testimonial text filled | Rating selected | Add or edit | Delete confirmed | Expected result |
|---|---|---|---|---|---|---|
| TS1 | Yes | Yes | 5 | Add | - | New testimonial is added with a 5-star rating by default |
| TS2 | Yes | Yes | 3 | Add | - | New testimonial is added with the selected rating |
| TS3 | Existing testimonial selected | Yes | Yes | Edit | - | Existing testimonial updates in the list |
| TS4 | - | - | - | Delete | Yes | Testimonial is removed |
| TS5 | - | - | - | Delete | No | Testimonial remains |
| TS6 | No | Yes | Yes | Add or edit | - | Browser validation blocks submission because customer name is required |
| TS7 | Yes | No | Yes | Add or edit | - | Browser validation blocks submission because testimonial text is required |
| TS8 | Yes | Yes | Any value from 1 to 5 | Add or edit | - | Exactly the selected number of stars is displayed |

## Coverage Notes

- The decision tables above cover the visible dashboard features in the current workspace.
- If new dashboard modules are added later, add a matching decision table section for each new feature.
- For regression testing, prioritize destructive actions, validation failures, and empty states before the happy path.