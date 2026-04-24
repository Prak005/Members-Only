Live: https://members-only-ae73.onrender.com


# Members Only (Clubhouse App)

A fullstack web application where users can create anonymous posts.  
Only club members can see who wrote each message, and admins can manage content.



## Features

- User authentication (Passport.js + sessions)
- Create anonymous messages
- Membership system (secret passcode)
- Admin role with delete permissions
- PostgreSQL database with relational schema
- Persistent login using sessions



## How it works

- Anyone can view messages, but authors are hidden
- Logged-in users can post messages
- Members (via passcode) can see authors + timestamps
- Admins can delete messages


## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- EJS (templating)
- Passport.js (authentication)
- express-session + connect-pg-simple
