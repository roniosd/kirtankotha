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

## আসল ডাটাবেসের তথ্য


## যাচাই ও সীমা


## গান লেখার সহজ এডিটর

`components/forms/LyricsEditor.jsx`-এ TipTap দিয়ে মোটা, বাঁকা, উপশিরোনাম, সাধারণ লেখা ও Undo/Redo আছে। Enter নতুন স্তবক, Shift+Enter একই স্তবকের নতুন লাইন। লেখা বেছে নিয়ে বোতামে চাপলে সরাসরি ফরম্যাট দেখা যায়; Markdown syntax লিখতে হয় না। Editor শুধু গান জমা দেওয়ার ফর্ম খোলার পর লোড হয়।

Formatted document `lyricsContent`-এ এবং search-এর plain text `lyrics`-এ থাকে। `lib/richLyrics.js` অনুমোদিত node/mark যাচাই করে; `components/songs/LyricsContent.jsx` raw HTML ছাড়া ফরম্যাট দেখায়। আগের plain-text গানের কোনো migration দরকার নেই।

পুরোনো কপি আপডেটে `npm ci` চালান এবং `LyricsEditor.jsx`, `UploadDialog.jsx`, `LyricsContent.jsx`, `SongReader.jsx`, `lib/richLyrics.js`, `models/Song.js`, দুইটি songs API route ও package files আপডেট করে server restart করুন। Production-এ নতুন build/deploy লাগবে।

## নিজের গান ও অ্যাডমিন পরিচালনা

- সাধারণ ব্যবহারকারী নিজের গান সম্পাদনা/মুছতে পারেন। তালিকা ও single-song page-এ একই বাটন আছে। নিচের “আমার গান” মেনুতে নিজের গানগুলো দেখা যায়।
- অ্যাডমিন সব গান পরিচালনা এবং অ্যাকাউন্ট → “সব ব্যবহারকারী পরিচালনা” থেকে user search/delete করতে পারেন। নিজের অ্যাডমিন account মুছতে পারবেন না।
- Song/User delete হলো soft delete (`deletedAt`)। সরানো গান public API থেকে আর আসে না। বন্ধ user-এর session পরবর্তী API request-এ বাতিল হয় এবং login আর কাজ করে না। তাঁর প্রকাশিত গান থাকে; admin সেগুলো আলাদাভাবে পরিচালনা করতে পারেন। Restore করতে database owner সংশ্লিষ্ট document-এর `deletedAt` null করতে পারেন; restore UI এই সংস্করণে নেই।

### ডাটাবেসে role দিয়ে অ্যাডমিন নির্ধারণ

সব নতুন account-এর `role` হলো `user`। প্রথম ব্যবহারকারীও স্বয়ংক্রিয়ভাবে admin হয় না। কোনো নির্দিষ্ট ইমেইলের বিশেষ অধিকার নেই।

MongoDB Compass-এ নিজের `users` document খুলে এই field যোগ/বদলান:

```json
{ "role": "admin" }
```

সাধারণ ব্যবহারকারীর জন্য `"role": "user"` রাখুন। পুরোনো document-এ role না থাকলেও সেটি সাধারণ user হিসেবে ধরা হয়। Role পরিবর্তনের পর পেজ refresh করুন; প্রতিটি server request বর্তমান database role পড়ে। Admin-এর গান edit/delete ও ব্যবহারকারী পরিচালনার বিদ্যমান UI এই role অনুযায়ী কাজ করে।

Role বদলানোর কোনো UI বা public API নেই। Signup request-এ role পাঠালেও server শুধু `user` account তৈরি করে। শুধু `role: "admin"` থাকলে সব গান ও ব্যবহারকারী পরিচালনার অধিকার পাওয়া যায়। অন্যরা নিজের গানই edit/delete করতে পারেন। নিজের account delete করার সুরক্ষা আগের মতো আছে।

## পুরো সাইটে Dark mode

Header-এর দিন/রাত button বা reader-এর রাতের আলো—দুটিই একই global theme বদলায়। Home, search, filters, account/upload dialogs, editor, user management এবং reading page-এ dark variants আছে। `next-themes` পছন্দ মনে রাখে। `globals.css`-এ Tailwind import এবং class-based `@custom-variant dark` configuration ছাড়া custom CSS rules নেই।

## Google Lens

Add/edit editor-এর ওপরে Google Lens খুলুন বাটন আছে। নতুন ট্যাবে ছবি স্ক্যান করে লেখা কপি করুন; ফিরে editor-এ পেস্ট করুন। এই সাইটে কোনো OCR engine বা image upload নেই। Google Lens-এর কাজ Google-এর সাইট/অ্যাপে হয়।

## Developer credit

Footer-এ আপনার অনুমোদিত credit: “Developed by Roni dev · Softbin”। পরিবর্তন করতে `components/layout/AppFooter.jsx` edit করুন।

## এই সংস্করণ আপডেট করুন

পুরো source backup রেখে নতুন archive merge করুন। `app/api/`, `lib/auth.js`, `lib/permissions.js`, `lib/songSchema.js`, `models/`, `components/`, `hooks/`, `scripts/`, `app/layout.jsx`, `app/globals.css`, package files প্রয়োজন। নিজের `.env.local` রাখুন। `npm ci` চালিয়ে server restart ও Production redeploy করুন। শুধু UI ফাইল copy করলে server permission বা editor updates কাজ করবে না।


যাচাই: role-based permission, signup role injection, ownership ও input/filter আচরণের ১৮টি test চালানো হয়েছে। Live MongoDB credentials ছাড়া বাস্তব CRUD পরীক্ষা করা হয়নি।


## গীতিকার, সংগ্রাহক ও মন্তব্য

Upload form-এ গীতিকারের নাম (`lyricist`) ও উৎস ঐচ্ছিক। সংগৃহীত/নিজের লেখা বেছে নেওয়া যায়। জমাদাতার পরিচয় server থেকে `collectedBy`-তে রাখা হয়। পুরোনো `author` field-এ জমাদাতার নাম থাকায় সেটি গীতিকার হিসেবে ব্যবহার করা হয় না। পুরোনো গানের গীতিকার জানা থাকলে edit করে সঠিক তথ্য দিন।

গানের বিস্তারিত প্রথমবার খুললে browser-এ একবার ব্যাখ্যা দেখাবে; “গীতিকার ও শেয়ার সম্পর্কে জানুন” দিয়ে আবার পড়া যায়। Browser storage মুছলে বার্তাটি আবার দেখাবে।

`/terms` পেজে শেয়ার, মন্তব্য, স্বত্ব ও অপসারণের অনুরোধের নির্দেশনা আছে। `COPYRIGHT_CONTACT_EMAIL` আপনার নিয়মিত দেখা ইমেইল দিন (বর্তমান default: ronidev39@gmail.com)। নীতিমালা কোনো আইনগত দায়মুক্তি বা গানের অনুমতি তৈরি করে না।

