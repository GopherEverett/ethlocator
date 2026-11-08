# Ethlocator

This React app was bootstrapped with Create React App and uses the [NREL (National Renewable Energy Laboratory) API](https://developer.nrel.gov/docs/transportation/alt-fuel-stations-v1/) to find locations of gas stations selling E85 fuel within a chosen radius and displays those as pins on a Google Map utilizing the [Google Map API](https://developers.google.com/maps/documentation).

On load the map centers on the user's location (if they allow location access) and shows nearby stations. Users can also search any city, address or ZIP code in the US or Canada; search text is converted to coordinates with OpenStreetMap's [Nominatim](https://nominatim.org/) geocoder, since the NREL API no longer accepts free-text locations.

To run locally you will need keys for both APIs in an `.env` file as:
`REACT_APP_MAP_KEY` and `REACT_APP_NREL_KEY`
## Login (AWS Amplify Auth)

Signing in is required to use the map. Accounts are stored in an Amazon Cognito user pool (email + password, with an emailed confirmation code), defined in code under `amplify/` with [Amplify Gen 2](https://docs.amplify.aws/react/build-a-backend/auth/).

**On Amplify Hosting** nothing extra is needed: `amplify.yml` deploys the auth backend for each branch (`npx ampx pipeline-deploy`) and writes `src/amplify_outputs.json` before the React build. Two one-time settings in the Amplify console:
- **Build image:** App settings → Build settings → Build image settings → **Amazon Linux 2023**. The build uses Node 22 (`amplify.yml` runs `nvm install 22`), which can't run on the older Amazon Linux 2 image.
- **Service role:** the app's service role needs the `AmplifyBackendDeployFullAccess` policy.

**Locally**, the app needs `src/amplify_outputs.json`. Either:
- run your own cloud sandbox (needs AWS credentials on your machine): `npm run sandbox`, then `npm start` in another terminal; or
- download the outputs for a deployed branch from the Amplify console (branch → Deployed backend resources → Download amplify_outputs.json) into `src/`.
