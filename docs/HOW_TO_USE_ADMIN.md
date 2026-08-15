# How to Use the Admin Portal

This guide is for **salon staff** who manage the Milano Nail Spa website. No technical experience needed.

**Admin address:** open your website and add `/admin` to the end (example: `https://yoursite.com/admin`).

For technical details (collections, API, deployment), see the [Technical Admin Guide](ADMIN_GUIDE.md).

---

## Logging In

1. Go to **`/admin`** on your website.
2. Enter your **username** and **password** (email is not required).
3. Click **Login**.

You will land on a **home screen of common tasks** (Update hours, Edit services, Change photos, and so on). Click the task you need — you do not have to hunt through technical menus.

### Change your password

1. After logging in, open your **account** from the admin account menu (not the Staff Logins list, unless you are an Admin).
2. Enter a **new password** and save.

If you forget your password or cannot log in, contact your website developer.

### Add a staff login (Admins only)

1. Open **Administration → Staff Logins**.
2. Click **Create New**.
3. Enter a **username** and **password**. Email is optional.
4. Choose **Editor** (content only) or **Admin** (full access), then save.

### Roles

| Role | What you can do |
|------|-----------------|
| **Editor** | Hours, contact info, services, photos, gallery, promotions, specialties, announcements, blog |
| **Admin** | Everything Editors can do, plus staff logins and advanced settings (booking URL, SEO) |

---

## Home screen (recommended)

After login, use the big cards:

1. **Change opening hours or phone** — hours, phone, address, about text  
2. **Add or edit a service** — treatments and prices  
3. **Swap a photo on the website** — banners and tiles  
4. **Add a gallery photo** — Gallery page  
5. **Put a notice on the homepage** — popup announcement  
6. **Write a blog post** — Blog page  

Underneath, **Right now** tells you whether a homepage popup is showing and how much content you have.

Use **View live website** (top right of the home screen) to open the public site in a new tab.

### Shortcuts in the sidebar

The top of the left-hand menu always has three shortcuts: **Start here** (this home screen), **Hours & contact**, and **View live website**. Everything else is grouped below: Services, Photos, Marketing, and — for Admins — Administration.

### Reading the lists

Lists show 50 rows at a time, with photo thumbnails where there is a photo, and plain wording instead of `true`/`false`: **On website** means customers can see it, **Hidden** means they cannot. Use the search box at the top of any list to find something by name.

---

## Changing Photos on the Website

Photos are managed in two places: **fixed spots** (hero banners and tiles) and the **gallery**.

### Fixed photo spots (Website Photo Spots)

1. Open **Photos → Website Photo Spots**, or use **Change website photos** on the home screen.
2. Each row is one photo position on the site. Use the table below to find the right spot.
3. Click a row and either upload/replace the **Photo**, or turn on **Use grey crosshatch placeholder**.
4. The placeholder is always the same dark grey crosshatch used by the homepage hero. Turning it off restores the photo you selected previously.
5. Click **Save**. Changes usually appear on the live site within about **one minute**. If not, wait a minute and **refresh the page** (Ctrl+F5 or Cmd+Shift+R).

| Spot label | Where it appears on the website |
|------------|----------------------------------|
| Home — Hero | Large banner at the top of the homepage |
| Home — Promotions Tile | Promotions tile on the homepage |
| Home — Specialties Tile | Specialties tile on the homepage |
| Home — Services Tile | Services tile on the homepage |
| Home — Gallery Tile | Gallery tile on the homepage |
| About — Grid Photo 1–4 | Four photos on the About section |
| About — Salon Experience | Photo in the About “Salon Experience” section |
| Promotions — Hero | Banner on the Promotions page |
| Specialties — Hero | Banner on the Specialties page |
| Services — Hero | Banner on the Services page |
| Gallery — Hero | Banner on the Gallery page |
| Blog — Hero | Banner on the Blog page |
| Contact — Hero | Banner on the Contact page |
| Site Logo | Logo used in some branded spots |

Do **not** create or delete photo-spot rows — those are fixed places on the site. Only change the photo.

### Gallery page photos

1. Open **Photos → Gallery Photos**, or **Add a gallery photo** on the home screen.
2. **Add a photo:** click **Create New**, upload an image, add an optional caption, pick a **Gallery filter**, set **Order on page** (lower numbers show first), leave **Show on website** ticked, then save.
3. **Remove a photo:** open the item and click **Delete**.
4. **Reorder:** change **Order on page** on each item (1, 2, 3…).

---

## Writing a Blog Post

1. Open **Marketing → Blog Posts**, or **Write a blog post** on the home screen.
2. Click **Create New** (or open an existing post to edit).
3. Fill in:
   - **Title** — the headline visitors see
   - **Web address name** — filled in automatically from the title (you can leave it alone)
   - **Short summary** — for the blog listing
   - **Cover photo** — optional
   - **Article** — the full post
4. Set **Status** to **Published — live on website**.
5. **Publish date** is set for you the first time you publish if you leave it blank.
6. Click **Save**.

The post will appear at `/blog/your-slug`. Use the preview control when available to open it.

---

## Services Menu (Prices Hidden by Default)

### Add or edit a category

1. Open **Services → Service Categories**.
2. Create or edit a category name and **Order on page**.
3. Make sure **Show on website** is ticked so it shows on the site.

### Add or edit a service

1. Open **Services → Services**, or **Add or edit a service** on the home screen. The list is grouped by category, and the search box finds a treatment by name.
2. Create or edit a service: name, category, **Time needed (minutes)**, **Price**, description, and what’s included.
3. **Show price to customers** — leave **off** to keep the price private. Turn it **on** when you want customers to see it.
4. Use **Order on page** to control the order within the category.
5. Leave **Show on website** ticked and save.

---

## Promotions and Specialty Designs

- **Marketing → Promotions** — promotional offers with image and text.
- **Marketing → Specialty Designs** — nail design showcase cards.

For each item: upload a photo, write the title/description, set **Order on page**, leave **Show on website** ticked, and save.

---

## Homepage Announcements

Use this for important messages (price changes, holiday hours, etc.) that appear when someone visits the homepage.

1. Open **Marketing → Homepage Announcements**, or **Create an announcement** on the home screen.
2. Click **Create New** or edit an existing one.
3. On **What it says**, fill in **Headline**, **Message** (press Enter twice between paragraphs), optional **Gold callout line**, and **Closing / signature**.
4. On **When it shows**, tick **Showing on website**. That single switch is all it takes.
5. Optional **Start showing on** / **Stop showing after** dates to schedule it.
6. Save.

Visitors close the popup by **clicking anywhere** on it. It stays dismissed until you edit and save the announcement again.

To turn it off without deleting: untick **Showing on website**.

---

## Hours & Contact

1. Open **Website Basics → Hours & Contact**, or **Update hours & contact** on the home screen.
2. Use the tabs:
   - **Contact** — phone, email, address, logo
   - **Hours** — business hours rows
   - **Website text** — about paragraph and social links
   - **Advanced** (Admins only) — booking link and SEO defaults
3. Save.

The booking link should stay pointed to your ABC Salon POS appointment page unless your developer changes it.

---

## Troubleshooting

| Problem | What to try |
|---------|-------------|
| I saved a change but don’t see it on the website | Wait about 1 minute, then hard refresh (Ctrl+F5). |
| I can’t log in | Double-check username/password. Contact your developer to reset access. |
| Image won’t upload | Use JPG or PNG, under 10 MB if possible. Try a smaller file. |
| Blog post doesn’t appear | Check **Status** is **Published** and refresh. |
| Popup still shows after I turned it off | Untick **Showing on website**, save, then hard refresh. |
| I don’t see Staff Logins or Advanced settings | Those are Admin-only. Ask an Admin or your developer. |

---

## Need Help?

Contact your website developer for login issues, broken pages, or anything not covered here.

**Technical reference:** [ADMIN_GUIDE.md](ADMIN_GUIDE.md)
