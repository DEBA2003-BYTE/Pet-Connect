# 🛡️ Admin System - Complete Guide

## Overview

The Admin System provides complete control over the PetConnect platform with user management, content moderation, and access logging capabilities.

## User Roles & Permissions

### ADMIN
- **Full System Access**
- Delete any user account
- Block/Unblock users
- Verify users
- Moderate all content (products, services, rescues, adoptions, lost & found)
- View access logs
- View system statistics

### SERVICE_PROVIDER
- Post products in Pet Store
- Post services in Nearby Services
- Manage own listings

### Regular Users (PET_OWNER, VOLUNTEER, NGO, VET)
- Use platform features
- Report rescues
- Post lost & found
- Adopt pets
- Shop in Pet Store

## Admin Dashboard Features

### 1. Statistics Tab 📊
**System Overview:**
- Total users count
- Users by role breakdown
- Active vs blocked users
- Content statistics (products, services, rescues, adoptions, lost & found)
- Today's activity (logins, signups, new posts)

**Quick Actions:**
- Navigate to user management
- Navigate to content moderation
- Navigate to access logs
- Refresh statistics

### 2. User Management Tab 👥
**Features:**
- View all users with details
- Search users by name or email
- Filter by role (PET_OWNER, SERVICE_PROVIDER, NGO, VET, VOLUNTEER, ADMIN)
- See user statistics (total, blocked, verified)

**Actions Per User:**
- ✓ **Verify User** - Mark user as verified
- 🔒 **Block User** - Prevent user from accessing the platform
- 🔓 **Unblock User** - Restore user access
- 🗑️ **Delete User** - Permanently remove user (requires confirmation)

**User Information Displayed:**
- Name with verification badge
- Email address
- Role badge (color-coded)
- Phone number
- Status (Active/Blocked)
- Join date
- Action buttons

### 3. Content Moderation Tab 📝
**Features:**
- View all content across platform
- Filter by type (products, services, rescues, adoptions, lost & found)
- See content statistics (total, active, inactive)

**Content Information:**
- Type badge (color-coded)
- Status badge (Active/Inactive)
- Title and description
- Creator information (name, email)
- Creation date

**Actions Per Content:**
- **Activate/Deactivate** - Toggle content visibility
- **Delete** - Permanently remove content

### 4. Access Logs Tab 📋
**Features:**
- View all system access logs
- Filter by HTTP method (GET, POST, PUT, PATCH, DELETE)
- Pagination (50 logs per page)
- See error statistics

**Log Information:**
- Timestamp
- User details (name, email, role) or Anonymous
- HTTP method (color-coded badge)
- Resource/endpoint accessed
- Status code (color-coded: success/warning/error)
- IP address
- User agent (browser/device info)

**Use Cases:**
- Track user activity
- Identify suspicious behavior
- Debug issues
- Audit trail for admin actions
- Monitor API usage

## Access Control

### Admin-Only Routes
All admin routes require:
1. Valid authentication token
2. User role = ADMIN

**Protected Endpoints:**
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/:id/block` - Block/unblock user
- `DELETE /api/admin/users/:id` - Delete user
- `PATCH /api/admin/users/:id/verify` - Verify user
- `GET /api/admin/content` - List all content
- `PATCH /api/admin/content/:type/:id` - Update content status
- `DELETE /api/admin/content/:type/:id` - Delete content
- `GET /api/admin/logs` - View access logs
- `GET /api/admin/stats` - View system statistics

### Access Denied
Non-admin users attempting to access admin routes will see:
- 403 Forbidden error
- "Access denied. Admin only." message

## How to Create an Admin User

### Method 1: Direct Database Update
```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "admin@petconnect.com" },
  { $set: { role: "ADMIN" } }
)
```

### Method 2: Signup as Admin
1. Sign up normally
2. Update role in database to "ADMIN"
3. Login again to get admin access

### Method 3: Seed Script
Create an admin user in the seed script:
```typescript
await User.create({
  name: 'Admin User',
  email: 'admin@petconnect.com',
  passwordHash: await bcrypt.hash('admin123', 10),
  role: 'ADMIN',
  isVerified: true
})
```

## User Blocking System

### What Happens When a User is Blocked?
1. User cannot login
2. Existing sessions are invalidated
3. API requests return 403 Forbidden
4. User's content remains visible (unless deactivated separately)
5. Admin can unblock anytime

### Block User Workflow
1. Admin goes to User Management
2. Finds user in list
3. Clicks 🔒 Block button
4. Confirms action
5. User is immediately blocked
6. Action is logged in Access Logs

## Content Moderation System

### Content Types
- **Products** - Pet Store items
- **Services** - Nearby Services listings
- **Rescues** - Rescue reports
- **Adoptions** - Adoption listings
- **Lost & Found** - Lost/found pet reports

### Moderation Actions
1. **Deactivate** - Hide content from public view
2. **Activate** - Make content visible again
3. **Delete** - Permanently remove content

### Moderation Workflow
1. Admin reviews content in Content Moderation tab
2. Identifies inappropriate/spam content
3. Deactivates or deletes content
4. Creator is notified (optional feature)

## Access Logging System

### What Gets Logged?
- User ID (if authenticated)
- Action performed
- Resource accessed
- HTTP method
- Status code
- IP address
- User agent
- Timestamp

### Log Retention
- Logs are stored indefinitely
- Can be filtered and searched
- Paginated for performance

### Use Cases
1. **Security Monitoring** - Detect unauthorized access attempts
2. **User Activity Tracking** - See what users are doing
3. **Debugging** - Identify API errors
4. **Compliance** - Audit trail for regulations
5. **Analytics** - Understand platform usage

## Security Best Practices

### For Admins
1. **Strong Password** - Use complex, unique password
2. **Secure Email** - Use secure email account
3. **Regular Monitoring** - Check logs regularly
4. **Careful Deletion** - Double-check before deleting users/content
5. **Document Actions** - Keep notes on major actions

### For Platform
1. **Admin-Only Middleware** - All admin routes protected
2. **Action Logging** - All admin actions logged
3. **Confirmation Dialogs** - Destructive actions require confirmation
4. **Role-Based Access** - Strict role checking
5. **Audit Trail** - Complete history of changes

## Common Admin Tasks

### Task 1: Block Spam User
1. Go to User Management
2. Search for user by email
3. Click 🔒 Block button
4. Confirm action
5. Check Access Logs to verify

### Task 2: Remove Inappropriate Product
1. Go to Content Moderation
2. Filter by "product"
3. Find the product
4. Click "Delete"
5. Confirm deletion

### Task 3: Verify Service Provider
1. Go to User Management
2. Filter by "SERVICE_PROVIDER"
3. Find the user
4. Click ✓ Verify button
5. User gets verified badge

### Task 4: Monitor Today's Activity
1. Go to Statistics tab
2. View "Today's Activity" section
3. See logins, signups, new posts
4. Click "View Logs" for details

### Task 5: Investigate Suspicious Activity
1. Go to Access Logs
2. Filter by error status codes (400-500)
3. Check IP addresses for patterns
4. Review user actions
5. Take action if needed (block user, etc.)

## Troubleshooting

### Can't Access Admin Dashboard
- Check if you're logged in
- Verify your role is "ADMIN" in database
- Clear browser cache and login again

### Users Not Showing
- Check MongoDB connection
- Verify admin routes are working
- Check browser console for errors

### Logs Not Loading
- Check if AccessLog model is created
- Verify logs are being created
- Check pagination settings

### Delete Confirmation Not Working
- Check browser JavaScript is enabled
- Verify confirmation dialog appears
- Check network tab for API errors

## Future Enhancements

1. **Email Notifications** - Notify users when blocked/unblocked
2. **Bulk Actions** - Block/delete multiple users at once
3. **Advanced Filters** - More filtering options
4. **Export Data** - Export users/logs to CSV
5. **Dashboard Widgets** - Customizable dashboard
6. **Real-time Updates** - WebSocket for live stats
7. **Role Management** - Change user roles from UI
8. **Content Reports** - Users can report inappropriate content
9. **Automated Moderation** - AI-powered content filtering
10. **Activity Timeline** - Visual timeline of user actions

---

**Admin Dashboard is now fully functional and ready to use!** 🎉
