import time
from datetime import datetime, timedelta
from database import get_db_connection
from config import Config
import math


def haversine(lat1, lon1, lat2, lon2):
    # returns distance in meters
    R = 6371000
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c


def get_update_interval_minutes():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT value FROM crowd_settings WHERE `key`='update_interval_minutes' LIMIT 1")
    row = cursor.fetchone()
    cursor.close()
    conn.close()

    if row and row.get("value"):
        try:
            return int(row["value"])
        except Exception:
            return 30

    return 30


def set_crowd_setting(key: str, value: str):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM crowd_settings WHERE `key`=%s", (key,))
    exists = cursor.fetchone()[0] > 0

    if exists:
        cursor.execute("UPDATE crowd_settings SET `value`=%s WHERE `key`=%s", (value, key))
    else:
        cursor.execute("INSERT INTO crowd_settings (`key`, `value`) VALUES (%s, %s)", (key, value))

    conn.commit()
    cursor.close()
    conn.close()


def get_locations_with_counts():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM geo_locations")
    locations = cursor.fetchall()

    interval = get_update_interval_minutes()
    cutoff = datetime.utcnow() - timedelta(minutes=interval)

    results = []
    for loc in locations:
        cursor.execute(
            "SELECT COUNT(DISTINCT user_id) as crowd_count FROM user_locations WHERE location_id=%s AND seen_at >= %s",
            (loc["location_id"], cutoff)
        )
        cnt = cursor.fetchone().get("crowd_count") or 0

        occupancy = 0
        try:
            occupancy = round((cnt / max(1, loc.get("capacity", 1))) * 100)
        except Exception:
            occupancy = 0

        status = "LOW"
        if occupancy >= 100:
            status = "OVERCROWDED"
        elif occupancy >= 80:
            status = "HIGH"
        elif occupancy >= 40:
            status = "MODERATE"

        results.append({
            "location_id": loc["location_id"],
            "location_name": loc["location_name"],
            "latitude": loc["latitude"],
            "longitude": loc["longitude"],
            "radius_meters": loc["radius_meters"],
            "capacity": loc.get("capacity", 1000),
            "crowd_count": int(cnt),
            "occupancy_percentage": int(occupancy),
            "crowd_status": status,
            "last_updated": cutoff.isoformat() + "Z",
        })

    cursor.close()
    conn.close()

    return results


def record_user_location(user_id, lat, lon):
    # determine if inside any monitored location
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM geo_locations")
    locations = cursor.fetchall()

    matched_location_id = None
    for loc in locations:
        dist = haversine(lat, lon, float(loc["latitude"]), float(loc["longitude"]))
        if dist <= float(loc["radius_meters"]):
            matched_location_id = loc["location_id"]
            break

    # insert into user_locations
    cursor.execute(
        "INSERT INTO user_locations (user_id, latitude, longitude, location_id, seen_at) VALUES (%s, %s, %s, %s, %s)",
        (user_id, lat, lon, matched_location_id, datetime.utcnow())
    )
    conn.commit()

    # if matched, update a crowd snapshot for that location (simple authoritative calc)
    if matched_location_id:
        cursor.execute(
            "SELECT COUNT(DISTINCT user_id) as crowd_count FROM user_locations WHERE location_id=%s AND seen_at >= %s",
            (matched_location_id, datetime.utcnow() - timedelta(minutes=get_update_interval_minutes()))
        )
        cnt = cursor.fetchone().get("crowd_count") or 0

        # get capacity
        cursor.execute("SELECT capacity FROM geo_locations WHERE location_id=%s", (matched_location_id,))
        capacity_row = cursor.fetchone() or {"capacity": 1}
        cap = capacity_row.get("capacity") or 1

        occupancy = int(round((cnt / max(1, cap)) * 100))

        status = "LOW"
        if occupancy >= 100:
            status = "OVERCROWDED"
        elif occupancy >= 80:
            status = "HIGH"
        elif occupancy >= 40:
            status = "MODERATE"

        cursor.execute(
            "INSERT INTO crowd_snapshots (location_id, crowd_count, capacity, occupancy_percentage, crowd_status, created_at) VALUES (%s, %s, %s, %s, %s, %s)",
            (matched_location_id, int(cnt), cap, occupancy, status, datetime.utcnow())
        )
        conn.commit()

    cursor.close()
    conn.close()


def get_location_history(location_id, limit=100):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT location_id, crowd_count, capacity, occupancy_percentage, crowd_status, created_at FROM crowd_snapshots WHERE location_id=%s ORDER BY created_at DESC LIMIT %s",
        (location_id, limit)
    )
    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    return rows
