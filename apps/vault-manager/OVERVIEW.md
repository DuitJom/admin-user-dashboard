# BlackVault

BlackVault is a public password manager in Malay, inspired by Bitwarden, with a premium black Vercel-style look. Anyone can sign up with Google or a 6-digit email code. They then set a master password that locks their personal vault.

Inside the vault, users store logins, cards, identities and secure notes, and organise them with folders, favorites and a shared collection. The vault also includes a password generator, secure Send sharing, a vault health score, and account settings for profile, master password, auto-lock and JSON export/import. Vault data is saved in the user's own browser.

This is an ADD-ON prompt ONLY. DO NOT delete, remove, or change any existing features, pages, design, or data in the current BlackVault web app. Keep everything that already exists exactly as it is. Only ADD the new functions below on top of the existing app. If there is a conflict, keep the existing function and add the new one as an extra.

THEME AND ICON RULES - MUST FOLLOW:

- Keep the existing premium black theme like [vercel.com](http://vercel.com) - background #000000, cards #0A0A0A, thin border #262626, white text.

- DO NOT use normal emojis anywhere in the UI.

- MUST use SVG icons only, Lucide / Heroicons style, stroke 1.5 or 2, color currentColor.

- For every new button and field, use an SVG icon, never an emoji.

1. ICON UPLOAD - AUTO / MANUAL FOR NOTE AND ALL ITEMS

Add an Icon Upload feature to the Note section and to every Add Item form:

- AUTO MODE: When the user types a full website URL in the Website field, for example [https://www.github.com](https://www.github.com), automatically fetch and display the website logo / favicon for that domain. This must work for ALL websites, not only GitHub. Use the domain favicon, for example [https://www.google.com/s2/favicons?domain=github.com](https://www.google.com/s2/favicons?domain=github.com) or the website logo service. Show the logo in a small rounded square on the left of the Title and Website field. Show a loading state while fetching, then show the logo. If the logo cannot be found, show a default SVG letter icon with the first letter of the website name.

- MANUAL MODE: Add an Upload Icon button next to the auto icon. When clicked, open the device file picker to upload a custom image icon from the gallery. Preview it instantly and save it with the item. The user can switch between Auto and Manual at any time.

- The icon must be saved and shown in the Vault list and in the Search results page too.

2. OTHER / CUSTOM ITEM - FULL LIST MUST EXIST

Make sure the Other / Custom Item page has ALL of these buttons, grouped exactly like this. Do not miss any:

Technology:

- API Credential

- Database

- Server

- SSH Key

- Software License

- WiFi Network

Finance:

- Bank Account

- Crypto Wallet

Personal:

- Driver License

- Medical Record

- Membership

- Passport

- Reward Program

- Social Security Number

Each button must be clickable and open its own Add Form. At the top of the Custom Item page, keep the button "Start from scratch".

3. EXACT FIELD DETAILS FROM THE IMAGES - MUST INCLUDE ALL

Every Add Form must include ALL details from the images. Use the exact field names below, in this exact order, so it is not messy. Do not merge fields or rename them.

EXAMPLE - API Credential Form:

- Title - [input box for title, placeholder "Untitled"]

- Website - [input box for website link, with website logo / icon on the left, placeholder "Website"]

- API Key - [input box, placeholder "API key"] + 3-dot button on the right

- Secret - [input box, placeholder "Secret"] + 3-dot button on the right

- Expiry Date - [date picker field, with + icon to add date] + 3-dot button on the right

- Permissions - [input box, placeholder "Permissions"] + 3-dot button on the right

- [Add field] button and [Add section] button side by side

- Note - [textarea, placeholder "Add note"]

- Attachments - [upload area, text "Upload files from your device", button "Attach a file"]

DATABASE FORM - Section for Database:

- Title - [input box, placeholder "Untitled"]

- Host - [input box, placeholder "Host"] + 3-dot button

- Port - [input box, placeholder "Port"] + 3-dot button

- Username - [input box, placeholder "Username"] + 3-dot button

- Password - [input box, placeholder "Password"] + 3-dot button

- Database type - [input box, placeholder "Database type"] + 3-dot button

- [Add field] button and [Add section] button

- Note - [textarea, placeholder "Add note"]

- Attachments - [upload area, button "Attach a file"]

SERVER FORM - Section for Server:

- Title - [input box, placeholder "Untitled"]

- IP address - [input box, placeholder "IP address"] + 3-dot button

- Hostname - [input box, placeholder "Hostname"] + 3-dot button

- OS - [input box, placeholder "OS"] + 3-dot button

- Username - [input box, placeholder "Username"] + 3-dot button

- Password - [input box, placeholder "Password"] + 3-dot button

- [Add field] button and [Add section] button

- Note - [textarea, placeholder "Add note"]

- Attachments - [upload area, button "Attach a file"]

For the other templates (SSH Key, Software License, WiFi Network, Bank Account, Crypto Wallet, Driver License, Medical Record, Membership, Passport, Reward Program, Social Security Number), create their own Add Forms with their own correct field names. Do not mix fields between templates. Each template must have its own fields, plus [Add field], [Add section], Note, and Attachments at the bottom, exactly like API Credential.

4. 3-DOT MENU - MUST WORK ON EVERY FIELD

Every single field / column in every form must have a 3-dot button on the right side.

When clicked, the 3-dot menu must show ONLY these 2 options, nothing else:

- Edit Name

- Remove Field

Edit Name: Opens a small input to rename the field label, for example change "API Key" to "My API Key", and saves it.

Remove Field: Deletes that field from the form after a confirm dialog.

Do not add any other option in the 3-dot menu. This 3-dot menu must exist on every field in every Add Form.

5. CREATE BUTTON ON EVERY PAGE

Add a [Create] button at the top right corner of EVERY Add Page.

- On Login page, Card page, Identity page, Note page, API Credential page, Database page, Server page, and all other Add pages, the top bar must have: X button on top left, Personal dropdown in the middle, and Create button on top right.

- Create button is the only way to save the new record. When clicked, validate the Title, save the record, show a success toast, and go back to the list. Do not remove the existing Save buttons if they already exist, keep them, but the top-right Create button must always be there.

6. ATTACHMENTS - FILE / MEDIA UPLOAD FOR IMAGES AND MP4 VIDEO

Upgrade the Attachments section in every form:

- Add a File / Media upload button.

- User can upload and save Images (JPG, PNG, WEBP) and Video MP4 files from their device.

- After upload, show a thumbnail preview for images and a playable video player for MP4 videos.

- The uploaded files must be saved with the vault record and shown again when the user opens that record later.

- Keep the existing button "Attach a file" and the text "Upload files from your device". Add the media preview below it.

7. SEPARATION - ADD PAGE IS DIFFERENT FROM SEARCH PAGE

This is very important:

- ALL the forms above are ONLY for ADDING information.

- Do NOT mix Add and Search in the same page.

- Create 2 separate pages:

  Page A - "Tambah Rekod Vault" / "Add Vault Record": This page is ONLY for adding new information using the forms above. No search results here.

  Page B - "Cari Maklumat Vault" / "Search Vault": This page is ONLY for finding back the saved information. The user must press a button / tab on another page to go to this Search page.

8. SEARCH BY FIELD NAMES - KEEP IT CLEAN

In the Search Vault page:

- Put a Search Bar at the top.

- The user only needs to type ONE piece of account information to find it, for example Website Name or App Name, for example "GitHub", "Maybank", "Netflix".

- Search must check Title, Website, App Name, Username, and all other field values.

- Results must be shown grouped by their original field names, for example Title, Website, API Key, Secret, Expiry Date, Permissions, Note. Do not mix all values into one messy text block. Show each field with its own label, so the user can read it clearly.

- When the user clicks a result, open the full detail view with all fields, icon, Note, and Attachments.

FINAL RULE:

This prompt is for ADDITIONAL functions only. Do not delete, hide, or change any existing page, button, or function. Only add the new features above and make sure every new button works. All new UI text must be in English. Do not use emojis.