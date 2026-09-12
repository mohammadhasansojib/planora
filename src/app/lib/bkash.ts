import config from "../config/index.js";
import { AppError } from "../utils/errorFormats.js";
import { prisma } from "./prisma.js";


const getGrantToken = async () => {
    const response = await fetch(`${config.BKASH_BASE_URL}/tokenized/checkout/token/grant`, {
        method: "POST",
        headers: {
            'Content-Type': "application/json",
            Accept: "application/json",
            username: config.BKASH_USERNAME,
            password: config.BKASH_PASSWORD,
        },
        body: JSON.stringify({
            app_key: config.BKASH_APP_KEY,
            app_secret: config.BKASH_APP_SECRET,
        }),
    });

    if (!response.ok) {
        throw new AppError("something went wrong: grantToken generation failed");
    }

    const result = await response.json();

    return result;
}

const addTimeToISO = (
    days: number,
    hours: number,
    minutes: number,
    seconds: number
) => {
    const date = new Date();

    const ms = 
        days * 24 * 60 * 60 * 1000 +
        hours * 60 * 60 * 1000 +
        minutes * 60 * 1000 +
        seconds * 1000;

    date.setTime(date.getTime() + ms);

    return date.toISOString();
}

export const getBkashIdToken = async () => {

    try {
        // check is there any idToken in DB
        const bkashToken = await prisma.bkashToken.findFirst();

        // if no idToken in DB
        if (!bkashToken) {
            console.log("no token in DB");
            const grantToken = await getGrantToken();
            console.log(grantToken, "grant token");

            await prisma.bkashToken.create({
                data: {
                    idToken: grantToken.id_token,
                    refreshToken: grantToken.refresh_token,
                    idTokenExpiresAt: addTimeToISO(0, 0, 0, grantToken.expires_in - 300),
                    refreshTokenExpiresAt: addTimeToISO(27, 0, 0, 0),
                }
            });
            console.log("idToken: ", grantToken.id_token)
            return grantToken.id_token;
        }

        // if idToken is not expired in bkashToken(DB)
        if (bkashToken.idTokenExpiresAt.getTime() > Date.now()) {
            console.log("id Token in DB")
            console.log("idToken: ", bkashToken.idToken);
            return bkashToken.idToken;
        }

        // if refreshToken token is not expired
        if (bkashToken.refreshTokenExpiresAt.getTime() > Date.now()) {
            console.log("refresh token in DB");

            // generate new idToken using refreshToken
            const refreshResponse = await fetch(`${config.BKASH_BASE_URL}/tokenized/checkout/token/refresh`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                    Accept: "application/json",
                    username: config.BKASH_USERNAME,
                    password: config.BKASH_PASSWORD,
                },
                body: JSON.stringify({
                    app_key: config.BKASH_APP_KEY,
                    app_secret: config.BKASH_APP_SECRET,
                    refresh_token: bkashToken.refreshToken,
                }),
            });

            if (!refreshResponse.ok) {
            throw new AppError("something went wrong: grantToken generation failed using refreshToken");
        }

            const refreshResult = await refreshResponse.json();

            // update idToken and expiration time in DB
            await prisma.bkashToken.update({
                where: {
                    id: bkashToken.id,
                },
                data: {
                    idToken: refreshResult.id_token,
                    idTokenExpiresAt: addTimeToISO(0, 0, 0, refreshResult.expires_in - 300),
                }
            });

            return refreshResult.id_token;
        }

        console.log("token in DB but expired");

        // if idToken and refreshToken both expired in DB
        // then generate new idToken and refreshToken
        const grantToken = await getGrantToken();

        // update new idToken and refreshToken in DB as well as expiration time
        await prisma.bkashToken.update({
            where: {
                id: bkashToken.id,
            },
            data: {
                idToken: grantToken.id_token,
                refreshToken: grantToken.refresh_token,
                idTokenExpiresAt: addTimeToISO(0, 0, 0, grantToken.expires_in - 300),
                refreshTokenExpiresAt: addTimeToISO(27, 0, 0, 0),
            }
        });

        return grantToken.id_token;

    } catch (error) {
        console.log(error);
        throw error;
    }


}

export default getBkashIdToken;