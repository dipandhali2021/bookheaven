# BookHeaven

BookHeaven is a modern e-commerce platform for book enthusiasts, built with Next.js, TypeScript, and a wide array of modern web technologies.

## Azure Deployment Guide

This guide outlines the complete process for deploying the BookHeaven application on Azure using a virtual machine with nginx and PM2 for production hosting.

### 1. Create Azure Virtual Machine

1. **VM Specifications:**
   - Name: `bookheaven`
   - Region: Central India (Zone 1)
   - Size: Standard D2s v3 (2 vCPUs, 8 GiB memory)
   - OS: Ubuntu 24.04 LTS
   - Storage: 30GB Premium SSD LRS
   - Port: Allow HTTP (80)
   - Resource Group: `bookheaven`

2. **Configure Public IP:**
   - Create static public IP address for the resource group
   - Type: Basic
   - DNS: `bookheavn.centralindia.cloudapp.azure.com`
   - Name: `bookheaven-ip`

3. **Network Configuration:**
   - Public IP: [YOUR_PUBLIC_IP]
   - Network Interface: `bookheaven_z1`
   - Private IP: [YOUR_PRIVATE_IP]
   - Virtual Network/Subnet: `bookheaven-vnet/default`
   - DNS name: `example.region.cloudapp.azure.com`

### 2. Connect to the VM

```bash
ssh your-username@[YOUR_PUBLIC_IP]
# Use your secure password
```

### 3. Set up Server Environment

1. **Update System:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install NVM (Node Version Manager):**
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
   source ~/.bashrc
   ```

3. **Install Node.js:**
   ```bash
   nvm install --lts
   nvm alias default 22.15.0
   node -v  # Verify Node.js version
   npm -v   # Verify npm version
   ```

4. **Install pnpm:**
   ```bash
   npm i -g pnpm
   ```

### 4. Deploy Application

1. **Clone Repository:**
   ```bash
   git clone https://github.com/yourusername/bookheaven
   cd bookheaven
   ```

2. **Create Environment File:**
   ```bash
   cat > .env << 'EOL'
   DATABASE_URL=postgresql://username:password@your-db-host.region.provider.com/dbname?sslmode=require
   CLERK_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
   CLERK_ENCRYPTION_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   UPLOADTHING_TOKEN='your_uploadthing_token'
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   NEXT_PUBLIC_APP_URL=http://example.region.cloudapp.azure.com
   EOL
   ```

3. **Install Dependencies and Build:**
   ```bash
   pnpm i
   pnpm build
   ```

### 5. Set up Nginx

1. **Install Nginx:**
   ```bash
   sudo apt-get install nginx
   systemctl status nginx  # Verify nginx is running
   ```

2. **Configure Nginx:**
   ```bash
   sudo su
   cd /etc/nginx/sites-available
   cp default your-config-name
   nano your-config-name
   ```

3. **Add the following configuration:**
   ```nginx
   server {
       listen 80;
       server_name example.region.cloudapp.azure.com [YOUR_PUBLIC_IP];

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       # Next.js static assets
       location ~ ^/_next/.* {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       # Public folder assets
       location ~ ^/public/.* {
           proxy_pass http://localhost:3000;
       }
   }
   ```

4. **Enable the site and restart Nginx:**
   ```bash
   ln -s /etc/nginx/sites-available/your-config-name /etc/nginx/sites-enabled/
   systemctl restart nginx
   ```

5. Nginx Certbot SSL generate
  ```bash
  sudo apt install certbot python3-certbot-nginx -y
  sudo certbot --nginx -d bookheavn.centralindia.cloudapp.azure.com
  ```

  1. in azure vm got to Networking/Network Setting
  2. Add new inbound rules
  3. On the “Add inbound security rule” screen:

Source: Any

Source port ranges: *

Destination: Any

Service: Custom

Destination port ranges: 443

Protocol: TCP (or leave as Any)

Action: Allow

Priority: e.g., 310 (must be lower than Deny rules, and higher than 300/320)

Name: AllowHTTPSInbound443

Click Add.

4. restart the vm

5. site available at https://bookheavn.centralindia.cloudapp.azure.com/

### 6. Set up PM2 for Process Management

1. **Install PM2 globally:**
   ```bash
   pnpm add -g pm2
   ```

2. **Start application with PM2:**
   ```bash
   pm2 start "pnpm start" --name bookheaven
   ```

3. **Configure PM2 for auto-restart on reboot:**
   ```bash
   pm2 save
   pm2 startup
   ```
   Run the command PM2 outputs (likely starting with `sudo env PATH=...`)

### 7. PM2 Management Commands

- **View running processes:**
  ```bash
  pm2 list
  ```

- **View application logs:**
  ```bash
  pm2 logs bookheaven
  ```

- **Restart application:**
  ```bash
  pm2 restart bookheaven
  ```

- **Stop application:**
  ```bash
  pm2 stop bookheaven
  ```

- **Delete application from PM2:**
  ```bash
  pm2 delete bookheaven
  ```

## Accessing the Site

The application should now be accessible at:
http://bookheavn.centralindia.cloudapp.azure.com and 
https://bookheavn.centralindia.cloudapp.azure.com
You can log in using the Clerk authentication system.

## Future Work

- **SSL Certificate**: Generate and configure SSL for HTTPS access
- **Custom Domain**: Configure a custom domain name if desired
- **Monitoring**: Set up application monitoring with PM2 or external tools
- **Backup**: Configure regular database and file backups

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL (hosted on Neon.tech)
- **Authentication**: Clerk
- **Payments**: Stripe
- **File Storage**: Uploadthing
- **Deployment**: Azure VM, Nginx, PM2

## Project Structure

- `/app`: Next.js app directory with pages and API routes
- `/components`: Reusable React components
- `/db`: Database connection and schema
- `/lib`: Utility functions and types
- `/public`: Static assets
- `/actions`: Server actions for data mutations

## Development

For local development:

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Setup your `.env` file with the required environment variables
4. Run `pnpm dev` to start the development server

## License

See the LICENSE file for details.

---

**Note**: Keep sensitive configuration information private. This document should not be shared publicly as it contains database credentials and API keys.
    