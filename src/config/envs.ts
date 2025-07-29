import "dotenv/config";
import * as joi from "joi";

interface EnvVars {
    POSTGRES_USER: string,
    POSTGRES_PASSWORD: string,
    POSTGRES_DB: string,
    POSTGRES_PORT: number,
    DATABASE_URL: string,
    PORT: number,
    SECRET_JWT: string,
    SMTP_HOST: string,
    SMTP_PORT: number,
    SMTP_USER: string,
    SMTP_PASS: string,
    FRONTEND_URL: string,
    LINKS_FILTER_QUANTITY: number,
    LINKS_FILTER_PERIOD: string,
    GOOGLE_CLIENT_ID: string,
    GOOGLE_SECRET_CLIENT: string,
    LOGIN_SESSION_CALLBACK: string,
    LOGIN_SESSION_FAILED: string,
    FRONTEND_SUCCESS_URL: string,
    FRONTEND_ERROR_URL: string,
    URL_GEOLOCATION: string,
    NODE_ENV: string,
    URL_GEOLOCATION_DEVELOPMENT: string,
}

const envsSchema = joi.object<EnvVars>({
    POSTGRES_USER: joi.string().required(),
    POSTGRES_PASSWORD: joi.string().required(),
    POSTGRES_DB: joi.string().required(),
    POSTGRES_PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    PORT: joi.number().required(),
    SECRET_JWT: joi.string().required(),
    SMTP_HOST: joi.string().required(),
    SMTP_PORT: joi.number().required(),
    SMTP_USER: joi.string().required(),
    SMTP_PASS: joi.string().required(),
    FRONTEND_URL: joi.string().required(),
    LINKS_FILTER_QUANTITY: joi.number().required(),
    LINKS_FILTER_PERIOD: joi.string().required(),
    GOOGLE_CLIENT_ID: joi.string().required(),
    GOOGLE_SECRET_CLIENT: joi.string().required(),
    LOGIN_SESSION_CALLBACK: joi.string().required(),
    LOGIN_SESSION_FAILED: joi.string().required(),
    FRONTEND_SUCCESS_URL: joi.string().required(),
    FRONTEND_ERROR_URL: joi.string().required(),
    URL_GEOLOCATION: joi.string().required(),
    NODE_ENV: joi.string().required(),
    URL_GEOLOCATION_DEVELOPMENT: joi.string().required(),
}).unknown(true);

const { value, error } = envsSchema.validate({
    ...process.env,
});

if (error) {
    throw new Error("Invalid environment variables");
}

export const envs = {
    postgresUser: value.POSTGRES_USER,
    postgresPassword: value.POSTGRES_PASSWORD,
    postgresDb: value.POSTGRES_DB,
    postgresPort: value.POSTGRES_PORT,
    databaseUrl: value.DATABASE_URL,
    port: value.PORT,
    secretJwt: value.SECRET_JWT,
    smtpHost: value.SMTP_HOST,
    smtpPort: value.SMTP_PORT,
    smtpUser: value.SMTP_USER,
    smtpPass: value.SMTP_PASS,
    frontendUrl: value.FRONTEND_URL,
    linksFilterQuantity: value.LINKS_FILTER_QUANTITY,
    linksFilterPeriod: value.LINKS_FILTER_PERIOD,
    googleClientId: value.GOOGLE_CLIENT_ID,
    googleClientSecret: value.GOOGLE_SECRET_CLIENT,
    loginSessionCallback: value.LOGIN_SESSION_CALLBACK,
    loginSessionFailed: value.LOGIN_SESSION_FAILED,
    frontendSuccessUrl: value.FRONTEND_SUCCESS_URL,
    frontendErrorUrl: value.FRONTEND_ERROR_URL,
    urlGeolocation: value.URL_GEOLOCATION,
    nodeEnv: value.NODE_ENV,
    urlGeolocationDevelopment: value.URL_GEOLOCATION_DEVELOPMENT,
};