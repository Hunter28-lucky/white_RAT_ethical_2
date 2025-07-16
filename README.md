# WebRAT-Lite - Educational Cybersecurity Training Platform

## Overview

WebRAT-Lite is an educational cybersecurity awareness platform designed to teach security concepts through safe demonstrations and interactive tutorials. This application simulates a Red Team command center where operators can control connected clients after gaining proper consent.

## ⚠️ IMPORTANT LEGAL DISCLAIMER

**THIS IS FOR EDUCATIONAL PURPOSES ONLY**

- This tool is designed for cybersecurity education and awareness training
- All activities are simulated and do not involve actual unauthorized access
- No real sensitive data is collected, stored, or transmitted
- This platform demonstrates security concepts in a safe, controlled environment
- Only use with explicit consent from all participants

## Features

### Command Center (Red Team Dashboard)
- **Link Generator**: Generate unique links to share with training participants
- **Client Management**: Monitor and control connected clients in real-time
- **Permission Control**: Request camera, microphone, location, and system information
- **Activity Logging**: Comprehensive logging of all training activities
- **Real-time Communication**: WebSocket-based communication with clients

### Client Dashboard
- **Consent Management**: Clear consent process for educational demonstrations
- **Permission Demonstrations**: Educational examples of browser permission requests
- **System Information**: Display browser and system information safely
- **Real-time Updates**: Live connection status and activity feedback

### Training Modules
- **Browser Information**: Learn about browser fingerprinting and information disclosure
- **Permission Demos**: Understand browser permission models and security implications
- **Security Tests**: Educational demonstrations of common web vulnerabilities
- **Learning Content**: Structured cybersecurity education materials

## How to Use

### For Instructors/Red Team Operators:

1. **Access Command Center**
   - Visit the application homepage
   - Click "Open Command Center"
   - You'll see the Red Team Operations Dashboard

2. **Generate Target Links**
   - Click "Generate New Link" in the Command Center
   - Copy the generated link
   - Share this link with training participants

3. **Control Connected Clients**
   - Monitor connected clients in real-time
   - Select a client to send commands
   - Use quick actions to request permissions:
     - Camera access
     - Microphone access
     - Location services
     - System information

### For Training Participants:

1. **Access via Shared Link**
   - Click on the link shared by your instructor
   - You'll see a consent page explaining the demonstration

2. **Provide Consent**
   - Read the educational disclaimer carefully
   - Click "I Understand & Consent to Demonstration"
   - This connects you to the command center

3. **Participate in Demonstrations**
   - The instructor may request various permissions
   - Browser will show standard permission dialogs
   - All activities are logged for educational review

## Technical Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Radix UI** components
- **WebSocket** for real-time communication

### Backend
- **Node.js** with Express
- **WebSocket Server** for real-time features
- **In-memory storage** for session management
- **RESTful API** for data access

### Security Features
- **Explicit consent** required for all demonstrations
- **Clear educational disclaimers** on all pages
- **Permission-based access** to browser features
- **Comprehensive activity logging**
- **No permanent data storage** of sensitive information

## Running the Application

### On Replit
1. The application is pre-configured for Replit
2. Click "Run" to start the server
3. The app will be available at your Replit URL
4. Share client links with participants

### Local Development
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5000`

### Environment Variables
- `NODE_ENV`: Set to "development" for local development
- `DATABASE_URL`: Optional PostgreSQL connection string
- `PORT`: Server port (default: 5000)

## Educational Use Cases

### Cybersecurity Training
- Demonstrate browser security concepts
- Show how malicious sites might request permissions
- Teach about information disclosure vulnerabilities
- Practice incident response scenarios

### Security Awareness
- Help users understand browser permissions
- Demonstrate social engineering tactics
- Show the importance of being cautious online
- Practice safe browsing habits

### Penetration Testing Education
- Simulate client-side attacks in a safe environment
- Demonstrate reconnaissance techniques
- Show how attackers might gather information
- Practice ethical hacking methodologies

## API Endpoints

### WebSocket Events
- `register_as_command_center`: Register as a command center
- `register_as_client`: Register as a client with link ID
- `command_to_client`: Send command from center to client
- `consent_given`: Client provides consent
- `permission_granted`: Client grants permission
- `system_info`: Client sends system information

### REST API
- `GET /api/status`: Get server status
- `GET /api/sessions/:id`: Get session information
- `GET /api/sessions/:id/logs`: Get session activity logs

## Security Considerations

### Data Protection
- No sensitive data is permanently stored
- All demonstrations are clearly marked as educational
- Client IP addresses are not logged by default
- Sessions are temporary and expire automatically

### Consent Management
- Explicit consent required before any demonstrations
- Clear explanations of what data might be accessed
- Users can disconnect at any time
- All activities are logged with timestamps

### Network Security
- Uses WebSocket Secure (WSS) in production
- HTTPS required for camera/microphone access
- No cross-origin requests without proper headers
- Rate limiting on API endpoints

## Troubleshooting

### Common Issues
1. **WebSocket Connection Failed**
   - Check if port 5000 is accessible
   - Verify firewall settings
   - Try refreshing the page

2. **Permission Requests Fail**
   - Ensure HTTPS is enabled
   - Check browser permission settings
   - Verify consent was provided

3. **Client Not Appearing in Command Center**
   - Confirm WebSocket connection is established
   - Check browser console for errors
   - Verify the client used a valid link

### Browser Compatibility
- Chrome 90+ (recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

This is an educational tool. Contributions should focus on:
- Educational content improvements
- Security enhancements
- User experience improvements
- Documentation updates

## License

This project is for educational use only. Please respect privacy and legal boundaries when using this tool.

## Support

For technical issues or questions about cybersecurity education:
1. Check the troubleshooting section
2. Review browser console logs
3. Verify all consent procedures are followed
4. Ensure proper educational context is maintained

---

**Remember: This tool is for educational purposes only. Always obtain proper consent and use in appropriate learning environments.**