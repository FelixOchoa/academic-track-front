# Imagen de ejecución del frontend. Recibe la salida standalone de `next build`
# (deploy.sh la compila fuera de Docker para no agotar el disco de CloudShell).
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --chown=nextjs:nodejs . .
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
