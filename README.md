![OurPod](/public/Logo.svg)

# The social network focused on connecting you, not addicting you.

## What is OurPod?

![Screenshot of Ourpod](/public/screenshot.png)

OurPod was created as a simple, open-source social network that focuses on facilitating offline conversation.

OurPod limits you to 1, text post per day with an associated mood. Our goal is to force users to reflect on their day, and share their journey with their "PodMates".

On OurPod, you won't have hundreds of friends. Your friend list, or "Pod", will be composed of only your closest friends and family. This encourages you to share more meaningful content.

OurPod is not out to get you addicted, and thus does not have common dopamine hits such as likes, retweets or notifications. Our goal is to get you off the app and talking with your PodMates in real-life.

## What is OurPod built with?

- Next.js (front end application)
- Firebase
  - Firestore (database)
  - Authentication (users)
  - Storage (image hosting)
- Vercel (site hosting)
- TailwindCSS and TailwindUI (components and styling)

## How can I build OurPod

1. Clone OurPod and `cd` into the directory
2. Run `yarn` to install packages
3. Create a `.env.local` file (duplicate and rename the `.env.example` file to get started). Fill with your Firebase values
4. Run `yarn dev` to start the development server, or `yarn build` to create a production build

## How can I deploy OurPod?

1. Fork the OurPod repo into your Github account
2. Create a new project in Vercel and point it to the forked OurPod repo
3. Create environment variables in the Vercel project for each value contained in your `.env.local` file

## Architecture decisions

OurPod utilizes two many collections, `users` and `invites`.

The `users` collection stores posts, podmates and personal information for each user. This makes it easy to access a users data without needing to join with other collections. The `users` collection is keyed off of user `uids` to make it easier to get a user document.

`invites` is used to store PodMate invitations. This was done as a seperate collection so that a user isn't directly writing into another users document. An invitation contains a `from` field and a `to` field. `from` is the UID of the sender, whereas `to` is either the email OR phone number of the receiveing user. This is to allow inviting users that are not currently on OurPod (and thus do not have a `uid`). When this type of user does join, this will automatically see their invitations on the `/podmates` page.

`reactfire` was used to simplify interacting with Firebase by using their Auth, Firestore and storage context providers. `reactfire` hooks are also used as they provide an easy way to subscribe to data changes for documents or collections, thus allowing real-time updates in many parts of the app (for example, trying inviting yourself as a PodMate in the `/podmates` page and you will instantly receive the invite).

A custom `AuthWrapper` component was created as an easy way to perform auth checks on restricted pages, and pass up the `user` object to the receiving page.

A number of components were created for frequently reused pieces (although this could be further expanded to keep the app DRY).

## Design decisions

![Screenshot of Ourpod](/public/screenshot-2.png)

OurPod was designed to be easy to understand and not overwhelming or addictive. It was important to strip out all but the bare essentials to meet the goal of a platform that encourages you to "take it offline".

When a user signs in for the first time, they are taking through a 3 step onboarding flow. This flow explains OurPod, and collects a few neccessary pieces of information. The flow ends by releasing the user in the "Feed".

The Feed focuses on 2 things, post your daily update, and view the updates of your PodMates. Once you've posted your update, the top section of the feed gets out of your way, so you can focus on your Pod. It was a concious decision not display notification indicators on PodMates with updates. This is to reduce the anxiety of needing to clear notificaitons.

## What's left to do?

### Security

- [ ] Add Firebase validation for all database calls to ensure proper values from clientside
- [ ] Add Firebase security rules to protect user data

### Error handling

- [ ] Replace `console.error` with informative toast notifications that include "Retry" buttons
- [ ] Better handling around failed server calls

### Business logic

- [ ] Limit number of PodMates to 10
- [ ] Trigger email or text when user not on OurPod is invited to be a PodMate
- [ ] Client-side validation on inputs
- [ ] Automatically transform phone numbers regardless of format

### Refactoring

- [ ] Place homepage and login page into shared template
- [ ] Pull out shared components (ex. user details form used in onboarding and profile page)
- [ ] Utilize TailwindCSS color variables for primary & secondary colors
- [ ] Pull out service calls into seperate library functions

### UX

- [ ] Automatically select first PodMate in Feed view
- [ ] List PodMates and allow deleting PodMates in `/podmates` page
- [ ] Display progress when uploading file rather than indeterminate spinner
- [ ] On step 3 of onboarding, it's too easy to forget to "Send" the invite and instead just hit "Finish"
- [ ] Allow for Markdown in post field
- [ ] Improve mood icon selection

### Testing

- [ ] Use Jest to test components and library functions
- [ ] Use Cypress for automated click testing
- [ ] Utilize Github Actions to run tests on pushes
