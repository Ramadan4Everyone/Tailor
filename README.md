# TailorBook — Digital Measurement Book

A front-end prototype for a simple, beautiful tailor measurement-record application.

## What is included
- Demo login flow
- Dashboard
- Customer search
- Add customer
- Customer photo preview
- Measurement templates: Dress, Native, Shirt, Trousers
- Customer profile
- Measurement history foundation
- WhatsApp button
- Dark, light, glass, royal, forest and rose themes
- Custom accent color picker
- Responsive mobile navigation
- LocalStorage persistence for the prototype

## Run it
Open `index.html` in a browser.

No build tools are required.

## Next step: Supabase
The UI is intentionally separated from the future backend. When you are ready:
1. Create a Supabase project.
2. Add Supabase Auth for email/password login.
3. Create `profiles`, `customers`, `measurement_sets`, and `measurements` tables.
4. Add a storage bucket for customer photos.
5. Enable Row Level Security so each tailor can only access their own records.
6. Replace the LocalStorage functions in `script.js` with Supabase reads/writes.

The prototype currently stores demo/customer changes in the browser only. It is not yet a production account system.
