import {authMiddleware, redirectToSignIn} from "@clerk/nextjs";
import {NextResponse} from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
const adminRoutes = [
    '/organization',
    '/organization-profile',
    '/create-organization'
];

export default authMiddleware({
    publicRoutes: ['/', '/sign-in', '/sign-up'],
    afterAuth(auth, req,  evt ) {
        // REDIRECT NON AUTHORIZED USER
        if (!auth.userId && !auth.isPublicRoute) {
            return redirectToSignIn({ returnBackUrl: req.url });
        }

        const redirectMember = new URL('/home', req.url);
        const redirectAdmin = new URL('/organization', req.url);

        if (auth.isPublicRoute && auth.userId) {
            return NextResponse.redirect(redirectMember);
        }

        // IF MEMBER TRIES TO ACCESS ADMIN ROUTES REDIRECT TO /HOME
        if (req.nextUrl.pathname === '/organization' && auth.orgRole === 'org:member') {
            return NextResponse.redirect(redirectMember);
        }

        if (req.nextUrl.pathname === '/organization-profile' && auth.orgRole === 'org:member') {
            return NextResponse.redirect(redirectMember);
        }

        if (req.nextUrl.pathname === '/create-organization' && auth.orgRole === 'org:member') {
            return NextResponse.redirect(redirectMember);
        }

        // IF ADMIN TRIES TO ACCESS /HOME REDIRECT TO /ORGANIZATIONS
        if (req.nextUrl.pathname === '/home' && (!auth.orgRole || auth.orgRole === 'org:admin')) {
            return NextResponse.redirect(redirectAdmin);
        }
    }
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
