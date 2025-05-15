Clerk Production Key Rule - 

EXPO_PUBLIC_CLERK_PUBLISHABLE_LIVE_KEY=
"This key value will start like this pk_live. 
Then the warning from console will go away.
In the free version we cannot remove the clerk branding. It requires the paid version"

CLERK EXPO  PRODUCTION BUILD LOGIC.

1. No clerk dashboard configuration required
2. only go to clerk dashboard go to attack protection and disable bot signup protection

3. IN expo go app i donot need to configure scheme and path 
4. But if i am in eas build then beause it is a native code so i must write the scheme and the path
5. Here path means after google signin when will google redirect to the app
6. AuthSession under the hood uses expo linking.
await startSSOFlow({
                strategy: 'oauth_google',
                // For web, defaults to current path
                // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
                // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
                // redirectUrl: AuthSession.makeRedirectUri(),
                redirectUrl: AuthSession.makeRedirectUri({ scheme: 'iqbmobilecustomer', path: '/signin' })
})