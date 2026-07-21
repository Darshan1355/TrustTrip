# Environment Setup

## Changing the backend URL

1. Open the single environment file at .env.
2. Update the API_BASE_URL value.
3. Restart the Expo app or rebuild it so the new value is loaded.

Example:

API_BASE_URL=http://192.168.1.5:5000

## Adding new environment variables

1. Add the variable to .env.
2. Read it through the shared config layer in src/config/constants.js.
3. Rebuild or restart the app to pick up the change.

## Switching environments

Use the same .env file for development, staging, and production. You can change its values when moving between environments.

## Building a Release APK

Run:

npx expo export --platform android

Then build with:

npx expo run:android --variant release

Or use EAS Build if configured.

## Troubleshooting

- If the app keeps using the old URL, restart Metro and the app.
- If the value is undefined, confirm the .env file is in the frontend root.
- If Android still uses an old host, clear the app cache and rebuild.
- If the backend is unreachable, verify the device/emulator can reach the host.
