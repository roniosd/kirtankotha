# কীর্তনকথা — মোবাইলে সহজে বাংলা গান পড়ুন

Next.js App Router + React + Tailwind CSS v4 + MongoDB। কীর্তন, পদাবলী ও ভক্তিগীতির ছোট, মোবাইল উপযোগী ওয়েবসাইট।

## কী পরিবর্তন হয়েছে

- মোবাইলে বড় চাপ দেওয়ার জায়গাসহ তালিকায় গান দেখা যায়। হৃদয় বাটন ও গানের লিংক আলাদা।
- প্রতিটি গানের নিজের ঠিকানা: `/songs/[id]`। সরাসরি লিংক খুলেও গান পড়া যায়।
- তালিকায় সার্চ, বিভাগ, ধরন ও প্রিয় গানের ফিল্টার আছে। ফিল্টার URL-এ থাকে।
- আগের/পরের গান বর্তমান সার্চ ও বিভাগের তালিকা অনুসরণ করে। প্রথম ও শেষ গানে অপ্রযোজ্য বাটন বন্ধ থাকে।
- লেখার আকার ২০–৩৬ পিক্সেল, বেশি লাইন-স্পেস ও রাতের আলো। পড়ার পছন্দ এই ব্রাউজারে মনে থাকে।
- নিচে বাংলা নামসহ চারটি বড় মেনু: সব গান, খুঁজুন, প্রিয় গান, গান দিন।
- ইমেইল-পাসওয়ার্ডে নিবন্ধন/লগইন; নাম ঐচ্ছিক। লগইন করে গান জমা ও account-based favorites।
- সব UI Tailwind utility classes-এ লেখা। `app/globals.css`-এ শুধু `@import "tailwindcss";` আছে; custom CSS rules বা inline styles নেই।

## কম্পোনেন্টগুলো কী করে

| ফাইল | কাজ |
|---|---|
| `components/AppProvider.jsx` | গান, account, favorites এবং notice-এর shared state; API calls |
| `components/Home.jsx` | Homepage-এর তালিকা ও URL filters সাজায় |
| `components/layout/AppHeader.jsx` | Logo, account ও তালিকায় ফেরার header |
| `components/layout/BottomNav.jsx` | মোবাইলের নিচের navigation |
| `components/songs/SongList.jsx` | বড় clickable row-তে গানের তালিকা |
| `components/songs/SongFilters.jsx` | Search, quick category ও বিভাগ বেছে নেওয়ার dialog |
| `components/songs/SongReader.jsx` | আলাদা গানের পাতার সম্পূর্ণ lyrics ও share |
| `components/songs/ReadingControls.jsx` | লেখা ছোট/বড় ও দিন/রাতের আলো |
| `components/songs/SongNavigation.jsx` | আগের/পরের গান ও তালিকায় ফেরার controls |
| `components/songs/FavoriteButton.jsx` | একই favorite button তালিকা ও reader-এ reuse হয় |
| `components/forms/AccountDialog.jsx` | Login/signup form |
| `components/forms/UploadDialog.jsx` | গান জমা দেওয়ার form |
| `components/ui/Modal.jsx`, `Button.jsx` | Reusable dialog, button ও form classes |
| `hooks/useReadingSettings.js` | Reading preferences সংরক্ষণ |
| `lib/songFilters.js` | Search/filter ও reading URL helpers |

এক জায়গার UI বদলাতে পুরো homepage পরিবর্তন করতে হয় না। যেমন row design-এর জন্য `SongList.jsx`, reading controls-এর জন্য `ReadingControls.jsx` পরিবর্তন করুন।

## চালু করুন

Node.js 20.9 বা নতুন সংস্করণ প্রয়োজন।

```bash
npm ci
cp .env.example .env.local
npm run dev
```

`.env.local`-এ নিজের MongoDB URL ও secret বসান:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@YOUR_CLUSTER.mongodb.net/kirtankotha
AUTH_SECRET=your-own-random-secret-at-least-32-characters
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_SITE_URL=https://kirtankotha.vercel.app
```

Secret তৈরি:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Local MongoDB ব্যবহার করলে `.env.example`-এর local URL ব্যবহার করুন এবং MongoDB চালু রাখুন। Atlas ব্যবহার করলে database user ও Network Access সঠিক থাকতে হবে। `.env.local` GitHub-এ দেবেন না। Vercel-এ dashboard-এর Production environment variables সেট করে Redeploy করুন।

```bash
npm run build
npm start
node --test tests/songFilters.test.mjs
```

## আগের প্রজেক্ট আপডেট

এটি UI/structure migration; শুধু `Home.jsx` কপি করলে চলবে না। প্রথমে নিজের project backup রাখুন। এই archive থেকে `app`, `components`, `hooks`, `lib/songFilters.js`, `lib/songs.js`, `public`, `package.json`, `package-lock.json`, ও `postcss.config.mjs` কপি করুন। নিজের backend পরিবর্তন থাকলে `app/api`-তে merge করুন—বিশেষ করে নতুন `app/api/songs/[id]/route.js` যোগ করুন। নিজের `.env.local` রেখে `npm ci` চালিয়ে dev server restart করুন। আগে favorites feature না থাকলে `models/User.js` এবং `app/api/favorites/route.js`-ও কপি করুন।

## API

| Route | কাজ |
|---|---|
| `GET /api/songs` | গানের তালিকা |
| `GET /api/songs/[id]` | সরাসরি একটি গান পড়া; invalid/missing ID-তে 404 |
| `GET/POST/DELETE /api/auth` | Session, signup/signin, logout |
| `GET/PUT /api/favorites` | বর্তমান ব্যবহারকারীর প্রিয় গান; PUT body `{songId, favorite}` |
| `POST /api/songs` | শুধু লগইন করা ব্যবহারকারীর গান জমা |

## ডেমো বনাম আসল প্রজেক্ট

Published preview-তে ছয়টি public-domain নমুনা excerpt ও browser-local favorites ব্যবহার হয়। ডেমোতে account বা submission সংরক্ষিত হয় না। Download করা project-এ `NEXT_PUBLIC_DEMO_MODE=false` রাখলে আসল APIs/MongoDB ব্যবহার হয়। Full project-এ static `output: 'export'` সেট করবেন না; dynamic song routes ও API-এর জন্য Node.js hosting প্রয়োজন। নমুনা গানের পরিবর্তে নিজের সম্পূর্ণ অনুমোদিত lyrics দিন। এটি ছোট সংগ্রহের জন্য তৈরি; list endpoint বর্তমানে সম্পূর্ণ collection ফেরত দেয়।

## যাচাই ও সীমা

Production build এবং Bengali search/filter/context-link tests চালানো হয়েছে। Browser-এ mobile-width list, category selection, আলাদা reading page, previous/next, font settings ও demo favorites পরীক্ষা করা হয়েছে। আসল MongoDB credentials দেওয়া হয়নি; live registration, submission ও account favorites deployment-এর পর নিজের database দিয়ে পরীক্ষা করুন। Public launch-এর আগে hosting-এ authentication/submission rate limits দিন। Email verification, password reset বা admin panel যোগ করা হয়নি।

## গান লেখার সহজ এডিটর

`components/forms/LyricsEditor.jsx`-এ TipTap দিয়ে মোটা, বাঁকা, উপশিরোনাম, সাধারণ লেখা ও Undo/Redo আছে। Enter নতুন স্তবক, Shift+Enter একই স্তবকের নতুন লাইন। লেখা বেছে নিয়ে বোতামে চাপলে সরাসরি ফরম্যাট দেখা যায়; Markdown syntax লিখতে হয় না। Editor শুধু গান জমা দেওয়ার ফর্ম খোলার পর লোড হয়।

Formatted document `lyricsContent`-এ এবং search-এর plain text `lyrics`-এ থাকে। `lib/richLyrics.js` অনুমোদিত node/mark যাচাই করে; `components/songs/LyricsContent.jsx` raw HTML ছাড়া ফরম্যাট দেখায়। আগের plain-text গানের কোনো migration দরকার নেই।

পুরোনো কপি আপডেটে `npm ci` চালান এবং `LyricsEditor.jsx`, `UploadDialog.jsx`, `LyricsContent.jsx`, `SongReader.jsx`, `lib/richLyrics.js`, `models/Song.js`, দুইটি songs API route ও package files আপডেট করে server restart করুন। Production-এ নতুন build/deploy লাগবে।
