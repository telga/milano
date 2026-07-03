# How to Use the Admin Portal

This guide is for **salon staff** who manage the Milano Nail Spa website. No technical experience needed.

**Admin address:** open your website and add `/admin` to the end (example: `https://yoursite.com/admin`).

For technical details (collections, API, deployment), see the [Technical Admin Guide](ADMIN_GUIDE.md).

---

## Logging In

1. Go to **`/admin`** on your website.
2. Enter your **email** and **password**.
3. Click **Login**.

### Change your password

1. After logging in, open **Admin → Users** in the left sidebar.
2. Click your user account.
3. Enter a **new password** and save.

If you forget your password or cannot log in, contact your website developer.

---

## Changing Photos on the Website

Photos are managed in two places: **fixed slots** (hero banners and tiles) and the **gallery**.

### Fixed photo slots (Site Image Slots)

1. Open **Site Photos → Site Image Slots** in the left menu.
2. Each row is one photo position on the site. Use the table below to find the right slot.
3. Click a row, upload or replace the **Image**, then click **Save**.
4. Changes usually appear on the live site within about **one minute**. If not, wait a minute and **refresh the page** (Ctrl+F5 or Cmd+Shift+R).

| Slot label | Where it appears on the website |
|------------|----------------------------------|
| Home — Hero | Large banner at the top of the homepage |
| Home — Promotions Tile | Promotions tile on the homepage |
| Home — Specialties Tile | Specialties tile on the homepage |
| Home — Services Tile | Services tile on the homepage |
| Home — Gallery Tile | Gallery tile on the homepage |
| About — Grid Photo 1–4 | Four photos on the About section |
| Visit Us — Hero | Banner on the Visit Us page |
| Promotions — Hero | Banner on the Promotions page |
| Specialties — Hero | Banner on the Specialties page |
| Services — Hero | Banner on the Services page |
| Gallery — Hero | Banner on the Gallery page |
| Blog — Hero | Banner on the Blog page |
| Contact — Hero | Banner on the Contact page |
| Site Logo | Logo in the header (optional) |

### Gallery page photos

1. Open **Site Photos → Gallery Items**.
2. **Add a photo:** click **Create New**, upload an image, add an optional caption, set **Sort Order** (lower numbers show first), turn on **Published**, then save.
3. **Remove a photo:** open the item and click **Delete**.
4. **Reorder:** change **Sort Order** on each item (1, 2, 3…).

---

## Writing a Blog Post

1. Open **Content → Blog Posts**.
2. Click **Create New** (or open an existing post to edit).
3. Fill in:
   - **Title** — the headline visitors see
   - **Slug** — the URL ending (use lowercase words with hyphens, e.g. `summer-nail-trends`)
   - **Excerpt** — short summary for the blog listing
   - **Featured Image** — optional cover photo
   - **Content** — the full article
4. Set **Status** to **Published**.
5. Set **Published At** to today’s date (or when you want it to go live).
6. Click **Save**.

The post will appear at `/blog/your-slug`.

---

## Services Menu (Prices Hidden by Default)

### Add or edit a category

1. Open **Services Menu → Service Categories**.
2. Create or edit a category name and **Sort Order**.
3. Make sure **Published** is checked so it shows on the site.

### Add or edit a service

1. Open **Services Menu → Services**.
2. Create or edit a service: name, category, description, duration, etc.
3. **Show Price** — leave **off** to hide the price on the public website. Turn **on** only when you want that price visible to customers.
4. Use **Sort Order** to control order within the category.
5. Check **Published** and save.

---

## Promotions and Specialties

- **Content → Promotions** — promotional offers with image and text.
- **Content → Specialties** — nail design showcase cards.

For each item: upload an image, write the title/description, set **Sort Order**, turn on **Published**, and save.

---

## Homepage Popup Announcements

Use this for important messages (price changes, holiday hours, etc.) that appear when someone visits the homepage.

1. Open **Content → Popup Announcements**.
2. Click **Create New** or edit an existing one.
3. Fill in **Headline**, **Body** (press Enter twice between paragraphs), optional **Highlight Line**, and **Signature**.
4. Turn on **Published** and **Active**.
5. Optional **Start Date** / **End Date** to schedule when it shows.
6. Save.

Visitors close the popup by **clicking anywhere** on it. It stays dismissed until you edit and save the announcement again.

To turn off without deleting: uncheck **Active** or **Published**.

---

## Site Settings (Phone, Hours, Booking Link)

1. Open **Globals → Site Settings** in the left menu.
2. Update **Phone**, **Email**, **Address**, **Business Hours**, **Booking URL**, **Logo**, or **About** text as needed.
3. Save.

The booking link should stay pointed to your ABC Salon POS appointment page unless your developer changes it.

---

## Troubleshooting

| Problem | What to try |
|---------|-------------|
| I saved a change but don’t see it on the website | Wait about 1 minute, then hard refresh (Ctrl+F5). |
| I can’t log in | Double-check email/password. Contact your developer to reset access. |
| Image won’t upload | Use JPG or PNG, under 10 MB if possible. Try a smaller file. |
| Blog post doesn’t appear | Check **Status** is **Published** and **Published At** is set. |
| Popup still shows after I turned it off | Uncheck **Active** and **Published**, save, then hard refresh. |

---

## Need Help?

Contact your website developer for login issues, broken pages, or anything not covered here.

**Technical reference:** [ADMIN_GUIDE.md](ADMIN_GUIDE.md)
