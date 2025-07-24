import { Injectable } from '@nestjs/common';
import * as nodemailer from "nodemailer"
import { envs } from 'src/config/envs';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: envs.smtpHost,
            port: envs.smtpPort,
            secure: false,
            auth: {
                user: envs.smtpUser,
                pass: envs.smtpPass
            }
        })
    }

    async sendPasswordResetEmail(email: string, token: string) {
        const resetUrl = `${envs.frontendUrl}/auth/reset/confirm-password?token=${token}`;

        const htmlBody = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Restablecer Contraseña</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                padding: 20px 0;
            }
            .header img {
                max-width: 150px;
            }
            .content {
                text-align: center;
                padding: 20px;
                color: #333333;
            }
            .content h1 {
                color: #0d236a;
                font-size: 24px;
            }
            .content p {
                font-size: 16px;
                line-height: 1.5;
            }
            .button {
                display: inline-block;
                background-color: #007bff;
                color: #ffffff;
                padding: 15px 25px;
                text-decoration: none;
                border-radius: 5px;
                font-size: 18px;
                margin: 20px 0;
                transition: background-color 0.3s;
            }
            .button:hover {
                background-color: #0056b3;
            }
            .footer {
                text-align: center;
                font-size: 12px;
                color: #777777;
                margin-top: 20px;
            }
            .footer p {
                margin: 5px 0;
            }
            .link-fallback {
                font-size: 12px;
                word-break: break-all;
                color: #555555;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Logo de la Empresa">
            </div>
            <div class="content">
                <h1>¿Olvidaste tu contraseña?</h1>
                <p>No te preocupes. Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
                <p>Haz clic en el botón de abajo para elegir una nueva.</p>
                <a href="${resetUrl}" class="button" style="color: #ffffff;">Restablecer Contraseña</a>
                <p>Este enlace de restablecimiento expirará en 5 minutos.</p>
                <p>Si no solicitaste un cambio de contraseña, puedes ignorar este correo de forma segura.</p>
            </div>
            <div class="footer">
                <p>Si el botón no funciona, copia y pega la siguiente URL en tu navegador:</p>
                <p class="link-fallback"><a href="${resetUrl}" style="color: #007bff;">${resetUrl}</a></p>
                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">
                <p>&copy; ${new Date().getFullYear()} Links Shortener. Todos los derechos reservados.</p>
                <p>Soler 5000, Palermo, CABA - Argentina</p>
            </div>
        </div>
    </body>
    </html>
    `;

        const mailOptions = {
            from: envs.smtpUser,
            to: email,
            subject: "Restablecimiento de Contraseña",
            text: `Hola, para reestablecer tu contraseña, por favor, haz clic en el enlace de abajo: ${resetUrl}`,
            html: htmlBody,
        }

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.log("Error al enviar el correo", error)
            throw error;
        }
    }
}