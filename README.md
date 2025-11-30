# Parental Control Client

A modern Vue.js web application for managing parental controls, device access, and sessions.

## 🚀 Features

- **Dashboard**: Overview of active sessions, blocked devices, and system statistics
- **Session Management**: View, manage, and delete active device sessions
- **Access Control**: Grant access time or block devices with customizable durations
- **Authentication**: Secure token-based authentication
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Refresh and monitor device status in real-time

## 🛠️ Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend tooling
- **Vue Router** - Official router for Vue.js
- **Pinia** - Intuitive Vue Store
- **Axios** - Promise-based HTTP client

## 📋 Prerequisites

- Node.js 20.19.0 or higher
- pnpm (recommended) or npm
- Access to the backend API (configured via environment variables)

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd parental-control-client
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```
Then edit `.env` and set your backend API URL:
```
VITE_API_BASE_URL=https://your-backend-api-url.com
```

4. Start the development server:
```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Build for Production

Build the application for production:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## 🔐 Authentication

The application uses token-based authentication. To log in:

1. Navigate to the login page
2. Enter your authentication token (the shared secret from the backend)
3. The token is validated against the backend API
4. Upon successful authentication, you'll be redirected to the dashboard

**Note**: The authentication token is the same plain secret configured in your backend's `PARENTAL_CONTROL_PASSWORD_HASH` environment variable.

## 📁 Project Structure

```
src/
├── api/                    # API client and endpoints
│   ├── client.js          # Axios client configuration
│   ├── session.js         # Session API endpoints
│   └── access.js          # Access control API endpoints
├── assets/                # Static assets and styles
│   └── main.css           # Global styles
├── components/            # Reusable Vue components
│   └── AppLayout.vue      # Main layout with sidebar
├── router/                # Vue Router configuration
│   └── index.js           # Route definitions
├── stores/                # Pinia stores
│   ├── auth.js            # Authentication store
│   └── session.js         # Session management store
├── views/                 # Page components
│   ├── LoginView.vue      # Login page
│   ├── DashboardView.vue  # Dashboard page
│   ├── SessionsView.vue   # Sessions management page
│   └── AccessControlView.vue # Access control page
├── App.vue                # Root component
└── main.js                # Application entry point
```

## 🎨 Features Overview

### Dashboard
- View active sessions count
- Monitor blocked and active devices
- Quick access to main features
- Recent sessions list

### Session Management
- List all active device sessions
- View session details (device name, ID, IP address, timestamps)
- Delete individual sessions
- Delete all sessions at once
- Real-time session status

### Access Control
- **Grant Access**: Allow devices to connect for a specific duration
- **Block Device**: Schedule device blocking after a delay
- **Check Status**: View remaining block time for devices
- **Quick Presets**: Common time presets (30 min, 1 hour, 2 hours, etc.)

## 🔌 API Integration

The application connects to the backend API (configured in `.env` file) and uses the following endpoints:

### Sessions
- `GET /sessions` - List all active sessions
- `DELETE /sessions/{id}` - Delete a specific session
- `DELETE /sessions` - Delete all sessions

### Access Control
- `POST /access/grant` - Grant access time to a device
- `POST /access/block` - Schedule device blocking
- `GET /access/block-time/{deviceId}` - Check remaining block time

## 🎯 Usage Examples

### Granting Access
1. Navigate to Access Control
2. Enter the device ID
3. Select duration (minutes or hours)
4. Click "Grant Access"

### Blocking a Device
1. Navigate to Access Control
2. Enter the device ID
3. Set the delay time before blocking
4. Click "Schedule Block"

### Managing Sessions
1. Navigate to Sessions
2. View all active connections
3. Delete individual sessions or all at once
4. Refresh to see updated status

## 🔒 Security

- All API requests require authentication token in the `Authorization` header
- Token is stored securely in localStorage
- Automatic redirect to login on 401 Unauthorized responses
- Protected routes require authentication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is part of the Parental Control system.

## 🐛 Troubleshooting

### Cannot connect to backend
- Ensure the backend server is running and `VITE_API_BASE_URL` is correctly set in your `.env` file
- Check your authentication token is correct
- Verify CORS settings on the backend

### Authentication fails
- Ensure you're using the correct authentication token
- The token must match the BCrypt hash configured in the backend
- Check browser console for detailed error messages

### Sessions not loading
- Verify backend Redis is running
- Check network connectivity
- Ensure authentication token has proper permissions

## 📞 Support

For issues related to:
- Backend API: Check the [backend repository](https://github.com/bravos2k5/ParentalControl)
- Frontend client: Open an issue in this repository

