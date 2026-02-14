
# Google OAuth 2.0 with JWT Authentication (HTTP-Only Cookies)

A stateless authentication system using:
-   Google OAuth 2.0
-   Passport.js    
-   JSON Web Tokens (JWT)
-   HTTP-only secure cookies
-   Express.js
    
This project demonstrates how to authenticate users with Google and issue a JWT stored in an HTTP-only cookie for secure, stateless authorization.

----------

## Architecture Overview

Authentication flow:
1.  User clicks **Login with Google**
2.  Google verifies identity
3.  Server receives Google profile
4.  Server generates a JWT
5.  JWT is stored in an HTTP-only cookie
6.  On protected routes:
    -   Cookie is automatically sent
    -   JWT is verified
    -   `req.user` is reconstructed

```No sessions are used.  
No server-side user storage.  
Fully stateless authentication.
```
----------

## Tech Stack
-   Node.js
-   Express
-   Passport.js
-   passport-google-oauth20
-   jsonwebtoken
-   cookie-parser
-   dotenv
----------

## Project Structure
```
├── index.js
├── auth/
│   └── google.js
├── .env
├── package.json
```

----------

## Key Concepts Demonstrated

-   OAuth 2.0 authentication flow
-   Stateless JWT authorization
-   Rebuilding `req.user` per request
-   HTTP-only cookie security
-   sameSite protection
-   Secure vs development cookie configuration
----------

## Setup Instructions

### 1. Clone the repository
`git clone https://github.com/ashutoshh-jhaa/google-oauth-with-jwt.git cd google-oauth-with-jwt` 

----------

### 2. Install dependencies
`npm install`

----------

### 3. Create a `.env` file

```
PORT=4000  
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback
JWT_SECRET_KEY=your_jwt_secret
```
----------

### 4. Configure Google OAuth
- In Google Cloud Console:
	- Authorized JavaScript Origin:
	`http://localhost:4000` 
	- Authorized Redirect URI:
`http://localhost:4000/auth/google/callback` 
- If app is in Testing mode:
	-   Add your email as a Test User
----------

### 5. Run the server
```npm start```
- Visit: `http://localhost:4000` 

----------

## JWT + Cookie Strategy

After successful authentication:
```
res.cookie("token", token, { 
	httpOnly: true, 
	secure: false, // true in production  
	sameSite: "lax",
});
``` 
Why this approach?
-   `httpOnly` prevents XSS token theft
-   `secure` ensures HTTPS-only transmission (production)
-   `sameSite` mitigates CSRF
-   Stateless backend (no session store)
----------

## Protected Route Example

```
const authenticateJWT = (req, res, next) => { 
	const token = req.cookies.token;
	if (!token) return res.status(401).send("Unauthorized");

	jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => { 
	  if (err) return res.status(403).send("Forbidden");
	  req.user = decoded;
    next();
	});
};
```
----------

## Security Notes

-   JWT is stored in HTTP-only cookie
-   Stateless authentication
-   Token expiration enforced
-   CSRF risk mitigated using sameSite
-   No server-side session storage
----------

## Learning Outcomes

This project demonstrates understanding of:
-   Difference between authentication and authorization
-   OAuth vs JWT
-   Stateful vs stateless auth
-   Middleware-based identity reconstruction
-   Cookie security configurations
