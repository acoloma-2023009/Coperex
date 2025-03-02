//Limitar la cantidad de solicitudes en cierto tiempo
import rateLimit from "express-rate-limit"

export const limiter = rateLimit(
    {
        windowMs: 15 * 60 * 1000, //rango de tiempo
        max: 100, //Cantidad de peticiones en el tiempo
        message: {
            message: "You'r blocked, wait 15 minutes"
        }

    }
)