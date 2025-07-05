# Imagen base
FROM node:20

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos del proyecto
COPY package*.json ./
COPY . .

# Instalar dependencias
RUN npm install

# Comando para ejecutar tu microservicio (ajústalo si el archivo tiene otro nombre)
CMD ["node", "server.js"]