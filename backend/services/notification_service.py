"""
Notification Service for TrustTrip
Handles Expo push notification delivery and logging.
"""

import requests
import json
from datetime import datetime
from database import get_db_connection
from config import Config


# Notification templates with default titles and bodies
NOTIFICATION_TEMPLATES = {
    "welcome": {
        "title": "🎉 Welcome to TrustTrip!",
        "body": "Your TrustTrip account has been created successfully. Stay safe and travel with confidence.",
        "data": {"type": "welcome", "screen": "Home"}
    },
    "equipment_order": {
        "title": "🛡️ Order Confirmed",
        "body": "Your safety equipment order has been successfully placed.",
        "data": {"type": "equipment_order", "screen": "Equipment"}
    },
    "complaint_submitted": {
        "title": "📝 Complaint Submitted",
        "body": "Your complaint has been submitted successfully. We will keep you updated.",
        "data": {"type": "complaint", "screen": "MyComplaints"}
    },
    "guide_requested": {
        "title": "🧭 Guide Request Sent",
        "body": "Your local guide request has been submitted successfully.",
        "data": {"type": "guide_request", "screen": "Guide"}
    },
}


def _get_active_devices(user_id):
    """
    Fetch all active (is_active=1) push notification tokens for a user.
    
    Args:
        user_id: The user's ID
        
    Returns:
        List of device records with push_token and device_id
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT device_id, push_token, device_type
            FROM user_devices
            WHERE user_id = %s AND is_active = 1
        """, (user_id,))
        
        devices = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return devices if devices else []
    
    except Exception as e:
        print(f"Error fetching active devices: {e}")
        return []


def _send_to_expo_api(push_token, title, body, data=None):
    """
    Send a notification to Expo Push Service.
    
    Args:
        push_token: Expo push notification token
        title: Notification title
        body: Notification body
        data: Optional JSON data to send with notification
        
    Returns:
        (success: bool, response: dict)
    """
    if not Config.EXPO_ACCESS_TOKEN:
        print("WARNING: EXPO_ACCESS_TOKEN not configured. Notification not sent.")
        return False, {"error": "EXPO_ACCESS_TOKEN not configured"}
    
    expo_url = "https://exp.host/--/api/v2/push/send"
    
    headers = {
        "Host": "exp.host",
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
    }
    
    payload = {
        "to": push_token,
        "sound": "default",
        "title": title,
        "body": body,
        "priority": "high",
    }
    
    if data:
        payload["data"] = data
    
    try:
        response = requests.post(
            expo_url,
            headers=headers,
            json=payload,
            timeout=10
        )
        response_data = response.json()
        
        if response.status_code == 200 and response_data.get("data"):
            ticket_id = response_data["data"].get("id")
            return True, {"ticket_id": ticket_id, "status": "queued"}
        else:
            return False, response_data
    
    except requests.exceptions.RequestException as e:
        print(f"Expo API error: {e}")
        return False, {"error": str(e)}


def _log_notification(user_id, device_id, notification_type, title, body, data, expo_status, expo_ticket_id):
    """
    Log notification attempt to database for history/troubleshooting.
    
    Args:
        user_id: User who received notification
        device_id: Device that received notification (or None)
        notification_type: Type of notification (e.g., 'welcome', 'equipment_order')
        title: Notification title
        body: Notification body
        data: Structured data sent with notification
        expo_status: Status from Expo API
        expo_ticket_id: Expo's ticket ID for tracking
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        data_json = json.dumps(data) if data else None
        
        cursor.execute("""
            INSERT INTO notifications
            (user_id, device_id, notification_type, title, body, data, expo_response_status, expo_ticket_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (user_id, device_id, notification_type, title, body, data_json, expo_status, expo_ticket_id))
        
        conn.commit()
        cursor.close()
        conn.close()
    
    except Exception as e:
        print(f"Error logging notification: {e}")


def _mark_device_inactive(device_id):
    """
    Mark a device as inactive when token is invalid/expired.
    
    Args:
        device_id: The device to deactivate
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            UPDATE user_devices
            SET is_active = 0, updated_at = NOW()
            WHERE device_id = %s
        """, (device_id,))
        
        conn.commit()
        cursor.close()
        conn.close()
    
    except Exception as e:
        print(f"Error marking device inactive: {e}")


def _update_device_last_used(device_id):
    """
    Update the last_used_at timestamp for a device (called after successful send).
    
    Args:
        device_id: The device to update
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            UPDATE user_devices
            SET last_used_at = NOW(), updated_at = NOW()
            WHERE device_id = %s
        """, (device_id,))
        
        conn.commit()
        cursor.close()
        conn.close()
    
    except Exception as e:
        print(f"Error updating device last_used_at: {e}")


def send_notification_to_user(user_id, notification_type, notification_data=None):
    """
    Send a notification to all active devices of a user.
    
    Uses template if notification_type is in NOTIFICATION_TEMPLATES,
    otherwise requires notification_data with title/body.
    
    Args:
        user_id: User to send notification to
        notification_type: Type of notification (key in NOTIFICATION_TEMPLATES)
        notification_data: Optional dict with { 'title', 'body', 'data' } or custom data
        
    Returns:
        (success: bool, message: str)
    """
    # Get template or use provided data
    if notification_type in NOTIFICATION_TEMPLATES:
        template = NOTIFICATION_TEMPLATES[notification_type]
        title = template.get("title", "")
        body = template.get("body", "")
        data = template.get("data", {})
    else:
        # Use provided data
        if not notification_data:
            return False, f"Unknown notification type '{notification_type}' and no data provided"
        
        title = notification_data.get("title", "TrustTrip")
        body = notification_data.get("body", "")
        data = notification_data.get("data", {})
    
    # Fetch all active devices for this user
    devices = _get_active_devices(user_id)
    
    if not devices:
        print(f"No active devices found for user {user_id}")
        return False, "No active devices registered for this user"
    
    # Send to each device
    sent_count = 0
    failed_count = 0
    
    for device in devices:
        device_id = device.get("device_id")
        push_token = device.get("push_token")
        
        # Send via Expo
        success, response = _send_to_expo_api(push_token, title, body, data)
        
        # Extract status and ticket ID
        expo_status = "ok" if success else "error"
        expo_ticket_id = response.get("ticket_id") if success else None
        
        # Log to database
        _log_notification(
            user_id=user_id,
            device_id=device_id,
            notification_type=notification_type,
            title=title,
            body=body,
            data=data,
            expo_status=expo_status,
            expo_ticket_id=expo_ticket_id
        )
        
        if success:
            _update_device_last_used(device_id)
            sent_count += 1
        else:
            # If error is token-related, mark as inactive
            error_str = str(response)
            if "invalid" in error_str.lower() or "expired" in error_str.lower():
                _mark_device_inactive(device_id)
            failed_count += 1
    
    # Determine overall success
    if sent_count > 0:
        message = f"Notification sent to {sent_count} device(s)"
        if failed_count > 0:
            message += f" ({failed_count} failed)"
        return True, message
    else:
        return False, f"Failed to send notification to any device ({failed_count} failures)"


def register_device(user_id, push_token, device_type="android", device_name=None):
    """
    Register a device push token for a user.
    Handles new tokens and token updates for existing devices.
    
    Args:
        user_id: User who owns the device
        push_token: Expo push notification token
        device_type: 'android' or 'ios' (default: 'android')
        device_name: Optional device name/model
        
    Returns:
        (success: bool, message: str, device_id: int or None)
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Check if token already exists for this user
        cursor.execute("""
            SELECT device_id FROM user_devices
            WHERE user_id = %s AND push_token = %s
        """, (user_id, push_token))
        
        existing = cursor.fetchone()
        
        if existing:
            # Token already registered; just update timestamp
            device_id = existing["device_id"]
            cursor.execute("""
                UPDATE user_devices
                SET is_active = 1, updated_at = NOW(), device_type = %s, device_name = %s
                WHERE device_id = %s
            """, (device_type, device_name, device_id))
            conn.commit()
            cursor.close()
            conn.close()
            return True, "Device token updated (already registered)", device_id
        
        # New token; check if token exists for another user (shouldn't happen)
        cursor.execute("""
            SELECT device_id FROM user_devices
            WHERE push_token = %s
        """, (push_token,))
        
        other_device = cursor.fetchone()
        if other_device:
            # Token exists for different user; deactivate that one
            cursor.execute("""
                UPDATE user_devices
                SET is_active = 0, updated_at = NOW()
                WHERE push_token = %s
            """, (push_token,))
        
        # Insert new device
        cursor.execute("""
            INSERT INTO user_devices (user_id, push_token, device_type, device_name, is_active)
            VALUES (%s, %s, %s, %s, 1)
        """, (user_id, push_token, device_type, device_name))
        
        device_id = cursor.lastrowid
        conn.commit()
        cursor.close()
        conn.close()
        
        return True, f"Device registered successfully", device_id
    
    except Exception as e:
        print(f"Error registering device: {e}")
        return False, f"Error registering device: {str(e)}", None


def deactivate_device(device_id, user_id):
    """
    Deactivate a device (soft delete).
    
    Args:
        device_id: Device to deactivate
        user_id: User who owns the device (for authorization)
        
    Returns:
        (success: bool, message: str)
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Verify ownership
        cursor.execute("""
            SELECT device_id FROM user_devices
            WHERE device_id = %s AND user_id = %s
        """, (device_id, user_id))
        
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return False, "Device not found or access denied"
        
        # Deactivate
        cursor.execute("""
            UPDATE user_devices
            SET is_active = 0, updated_at = NOW()
            WHERE device_id = %s
        """, (device_id,))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return True, "Device deactivated successfully"
    
    except Exception as e:
        print(f"Error deactivating device: {e}")
        return False, f"Error: {str(e)}"


def get_user_devices(user_id):
    """
    Get all devices for a user.
    
    Args:
        user_id: User to fetch devices for
        
    Returns:
        List of device records
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT device_id, push_token, device_type, device_name, is_active, created_at, updated_at, last_used_at
            FROM user_devices
            WHERE user_id = %s
            ORDER BY updated_at DESC
        """, (user_id,))
        
        devices = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return devices if devices else []
    
    except Exception as e:
        print(f"Error fetching user devices: {e}")
        return []
