"""Database initialization and seed data for crowd monitoring feature."""
from database import get_db_connection
from datetime import datetime


def ensure_tables():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS geo_locations (
        location_id INT PRIMARY KEY AUTO_INCREMENT,
        location_name VARCHAR(255) NOT NULL,
        latitude DOUBLE NOT NULL,
        longitude DOUBLE NOT NULL,
        radius_meters INT NOT NULL DEFAULT 500,
        capacity INT NOT NULL DEFAULT 1000,
        status VARCHAR(50) DEFAULT 'ACTIVE'
    ) ENGINE=InnoDB;
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_locations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        latitude DOUBLE NOT NULL,
        longitude DOUBLE NOT NULL,
        location_id INT,
        seen_at DATETIME NOT NULL,
        INDEX idx_user_seen (user_id, seen_at),
        INDEX idx_location_seen (location_id, seen_at)
    ) ENGINE=InnoDB;
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS crowd_snapshots (
        id INT PRIMARY KEY AUTO_INCREMENT,
        location_id INT NOT NULL,
        crowd_count INT NOT NULL,
        capacity INT NOT NULL,
        occupancy_percentage INT NOT NULL,
        crowd_status VARCHAR(50) NOT NULL,
        created_at DATETIME NOT NULL
    ) ENGINE=InnoDB;
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS crowd_settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        `key` VARCHAR(100) NOT NULL,
        `value` VARCHAR(255) NOT NULL
    ) ENGINE=InnoDB;
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_devices (
        device_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        push_token VARCHAR(500) NOT NULL UNIQUE,
        device_type VARCHAR(50) NOT NULL DEFAULT 'android',
        device_name VARCHAR(255),
        is_active TINYINT(1) DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_used_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        INDEX idx_user_active (user_id, is_active),
        INDEX idx_push_token (push_token)
    ) ENGINE=InnoDB;
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS razorpay_payments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        razorpay_order_id VARCHAR(100) NOT NULL UNIQUE,
        razorpay_payment_id VARCHAR(100) UNIQUE,
        razorpay_signature VARCHAR(128),
        user_id INT NOT NULL,
        equipment_id INT NOT NULL,
        quantity INT NOT NULL,
        amount_paise BIGINT NOT NULL,
        currency CHAR(3) NOT NULL DEFAULT 'INR',
        status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
        receipt VARCHAR(100) NOT NULL UNIQUE,
        failure_reason VARCHAR(500),
        paid_at DATETIME,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_payment_user (user_id, created_at),
        INDEX idx_payment_status (status, created_at)
    ) ENGINE=InnoDB;
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS notifications (
        notification_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        device_id INT,
        notification_type VARCHAR(50) NOT NULL,
        title VARCHAR(255),
        body TEXT,
        data JSON,
        is_read TINYINT(1) DEFAULT 0,
        expo_response_status VARCHAR(50),
        expo_ticket_id VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (device_id) REFERENCES user_devices(device_id) ON DELETE SET NULL,
        INDEX idx_user_created (user_id, created_at),
        INDEX idx_unread (is_read, created_at)
    ) ENGINE=InnoDB;
    """)

    conn.commit()

    # seed default settings if missing
    cursor.execute("SELECT COUNT(*) FROM crowd_settings WHERE `key`='update_interval_minutes'")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO crowd_settings (`key`, `value`) VALUES (%s, %s)", ('update_interval_minutes', '30'))

    # seed 5 sample locations if table empty
    cursor.execute("SELECT COUNT(*) FROM geo_locations")
    if cursor.fetchone()[0] == 0:
        sample = [
            ("Gateway of India", 18.9220, 72.8347, 500, 500, 'ACTIVE'),
            ("Marine Drive", 18.9433, 72.8237, 400, 400, 'ACTIVE'),
            ("Colaba Causeway", 18.9126, 72.8126, 300, 300, 'ACTIVE'),
            ("Elephanta Caves", 18.9630, 72.9319, 800, 500, 'ACTIVE'),
            ("Sanjay Gandhi Park", 19.2075, 72.9106, 1000, 1000, 'ACTIVE'),
        ]
        for s in sample:
            cursor.execute(
                "INSERT INTO geo_locations (location_name, latitude, longitude, radius_meters, capacity, status) VALUES (%s, %s, %s, %s, %s, %s)",
                s
            )

    conn.commit()
    cursor.close()
    conn.close()


if __name__ == '__main__':
    ensure_tables()
    print('DB initialization complete')
